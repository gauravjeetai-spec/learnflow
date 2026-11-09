import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://learnflow-steel.vercel.app",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const allowedPermissions = new Set(["resources", "goals", "skills", "sprints", "activities"]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Authentication required" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY");
    if (!serviceKey) return json({ error: "Server admin key is not configured" }, 500);

    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: authData, error: authError } = await admin.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Invalid session" }, 401);

    const actorId = authData.user.id;
    const { data: actor, error: actorError } = await admin.from("profiles")
      .select("user_id,role,access_status,display_name")
      .eq("user_id", actorId).maybeSingle();
    if (actorError || !actor || actor.access_status !== "active") return json({ error: "Active LearnFlow access required" }, 403);

    const body = await req.json();
    const action = String(body.action || "");
    const isAdmin = actor.role === "admin";

    const requireAdmin = () => {
      if (!isAdmin) throw new Error("Administrator access required");
    };
    const getProfile = async (id: string) => {
      const { data, error } = await admin.from("profiles").select("user_id,role,access_status,display_name").eq("user_id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("User profile not found");
      return data;
    };

    if (action === "invite") {
      requireAdmin();
      const email = String(body.email || "").trim().toLowerCase();
      const role = String(body.role || "learner");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "Enter a valid email address" }, 400);
      if (!["learner", "mentor"].includes(role)) return json({ error: "Invitations can create Learner or Mentor accounts only" }, 400);
      const { error: inviteRowError } = await admin.from("invitations").upsert({
        email, role, status: "pending", invited_by: actorId, auth_user_id: null, accepted_at: null
      }, { onConflict: "email" });
      if (inviteRowError) throw inviteRowError;
      const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: "https://learnflow-steel.vercel.app/"
      });
      if (inviteError || !invited.user) {
        await admin.from("invitations").update({ status: "failed" }).eq("email", email);
        throw inviteError || new Error("Invitation could not be created");
      }
      const { error: profileError } = await admin.from("profiles").upsert({
        user_id: invited.user.id, role, access_status: "pending", name_setup_completed: false
      }, { onConflict: "user_id" });
      if (profileError) throw profileError;
      const { error: updateInviteError } = await admin.from("invitations").update({
        status: "sent", auth_user_id: invited.user.id
      }).eq("email", email);
      if (updateInviteError) throw updateInviteError;
      return json({ success: true, message: "Invitation sent", email, role });
    }

    if (action === "update_access") {
      requireAdmin();
      const targetId = String(body.userId || "");
      const role = String(body.role || "");
      const accessStatus = String(body.accessStatus || "");
      if (!targetId || !["admin", "mentor", "learner"].includes(role) ||
          !["pending", "active", "suspended", "rejected"].includes(accessStatus)) {
        return json({ error: "Invalid access update" }, 400);
      }
      if (targetId === actorId && (role !== "admin" || accessStatus !== "active")) {
        return json({ error: "You cannot remove your own administrator access" }, 400);
      }
      const target = await getProfile(targetId);
      if (target.role === "admin" && target.access_status === "active" &&
          (role !== "admin" || accessStatus !== "active")) {
        const { count, error } = await admin.from("profiles").select("user_id", { count: "exact", head: true })
          .eq("role", "admin").eq("access_status", "active");
        if (error) throw error;
        if ((count || 0) <= 1) return json({ error: "The last active administrator cannot be demoted or suspended" }, 409);
      }
      const { error } = await admin.from("profiles").update({
        role, access_status: accessStatus,
        approved_at: accessStatus === "active" ? new Date().toISOString() : null,
        approved_by: accessStatus === "active" ? actorId : null
      }).eq("user_id", targetId);
      if (error) throw error;
      return json({ success: true, message: "User access updated" });
    }

    if (action === "delete_user") {
      requireAdmin();
      const targetId = String(body.userId || "");
      if (!targetId || targetId === actorId) return json({ error: "You cannot delete your own administrator account" }, 400);
      const { data: purgeResult, error: purgeError } = await admin.rpc("admin_purge_user_data", {
        p_actor_id: actorId,
        p_target_id: targetId
      });
      if (purgeError) throw purgeError;
      const { error: authDeleteError } = await admin.auth.admin.deleteUser(targetId);
      if (authDeleteError) throw authDeleteError;
      // Explicit cleanup also covers projects where profiles.user_id is not cascading.
      const { error: profileDeleteError } = await admin.from("profiles").delete().eq("user_id", targetId);
      if (profileDeleteError) throw profileDeleteError;
      await admin.from("audit_events").insert({
        user_id: actorId,
        action: "admin_deleted_user",
        target_type: "user",
        target_id: targetId,
        metadata: {
          deleted_role: purgeResult?.deleted_role || null,
          deleted_display_name: purgeResult?.deleted_display_name || null
        }
      });
      return json({ success: true, message: "User and associated LearnFlow data permanently deleted" });
    }

    if (action === "list_mentors") {
      if (actor.role !== "learner" || actor.access_status !== "active") return json({ error: "Active learners only" }, 403);
      const { data, error } = await admin.from("profiles").select("user_id,display_name,role")
        .eq("role", "mentor").eq("access_status", "active").order("display_name");
      if (error) throw error;
      return json({ mentors: data || [] });
    }

    if (action === "mentor_workspace") {
      if (actor.role !== "mentor") return json({ error: "Active mentors only" }, 403);
      const relationshipId = String(body.relationshipId || "");
      const { data: rel, error: relError } = await admin.from("mentor_relationships")
        .select("id,mentor_id,learner_id,status,learner_consent_at")
        .eq("id", relationshipId).single();
      if (relError) throw relError;
      if (rel.mentor_id !== actorId || rel.status !== "active" || !rel.learner_consent_at) {
        return json({ error: "No active learner consent for this relationship" }, 403);
      }
      const { data: permissionRows, error: permissionError } = await admin.from("mentor_relationship_permissions")
        .select("permission_key").eq("relationship_id", relationshipId);
      if (permissionError) throw permissionError;
      const permissions = new Set((permissionRows || []).map((p: {permission_key:string}) => p.permission_key));
      const learnerId = rel.learner_id;
      const result: Record<string, unknown[]> = { resources: [], goals: [], skills: [], sprints: [], activities: [] };
      if (permissions.has("resources")) {
        const { data, error } = await admin.from("resources")
          .select("id,title,type,provider,status,progress,priority,due_date,estimated_hours")
          .eq("user_id", learnerId).order("created_at", { ascending: false }).limit(100);
        if (error) throw error;
        result.resources = data || [];
      }
      if (permissions.has("goals")) {
        const { data, error } = await admin.from("goals")
          .select("id,title,priority,status").eq("user_id", learnerId).order("created_at", { ascending: true });
        if (error) throw error;
        result.goals = data || [];
      }
      if (permissions.has("skills")) {
        const { data, error } = await admin.from("skills")
          .select("id,title").eq("user_id", learnerId).order("created_at", { ascending: true });
        if (error) throw error;
        result.skills = data || [];
      }
      if (permissions.has("sprints")) {
        const { data, error } = await admin.from("sprints")
          .select("id,title,start_date,end_date,status").eq("user_id", learnerId).order("start_date", { ascending: false });
        if (error) throw error;
        result.sprints = data || [];
      }
      if (permissions.has("activities")) {
        const { data, error } = await admin.from("activities")
          .select("id,resource_id,activity_type,duration_minutes,occurred_at")
          .eq("user_id", learnerId).order("occurred_at", { ascending: false }).limit(200);
        if (error) throw error;
        result.activities = data || [];
      }
      return json({ workspace: result, permissions: [...permissions] });
    }

    if (action === "list_relationships") {
      const query = admin.from("mentor_relationships").select("*").order("created_at", { ascending: false });
      if (!isAdmin) query.or(`mentor_id.eq.${actorId},learner_id.eq.${actorId}`);
      const { data, error } = await query;
      if (error) throw error;
      const ids = [...new Set((data || []).flatMap((r: {mentor_id:string;learner_id:string}) => [r.mentor_id, r.learner_id]))];
      const { data: people, error: peopleError } = ids.length
        ? await admin.from("profiles").select("user_id,display_name,role").in("user_id", ids)
        : { data: [], error: null };
      if (peopleError) throw peopleError;
      const byId = new Map((people || []).map((p: {user_id:string}) => [p.user_id,p]));
      return json({ relationships: (data || []).map((r: {mentor_id:string;learner_id:string}) => ({
        ...r, mentor: byId.get(r.mentor_id), learner: byId.get(r.learner_id)
      })) });
    }

    if (action === "mentor_action") {
      const kind = String(body.kind || "");
      if (kind === "assign") {
        requireAdmin();
        const mentorId = String(body.mentorId || ""), learnerId = String(body.learnerId || "");
        const mentor = await getProfile(mentorId), learner = await getProfile(learnerId);
        if (mentor.role !== "mentor" || mentor.access_status !== "active" || learner.role !== "learner" || learner.access_status !== "active") {
          return json({ error: "Choose an active mentor and an active learner" }, 400);
        }
        const { error } = await admin.from("mentor_relationships").upsert({
          mentor_id: mentorId, learner_id: learnerId, initiated_by: actorId, status: "offered",
          learner_consent_at: null, accepted_at: null, revoked_at: null, revoked_by: null
        }, { onConflict: "mentor_id,learner_id" });
        if (error) throw error;
        return json({ success: true, message: "Mentoring offer sent; learner consent is still required" });
      }
      if (kind === "request") {
        if (actor.role !== "learner") return json({ error: "Only learners can request a mentor" }, 403);
        const mentorId = String(body.mentorId || "");
        const mentor = await getProfile(mentorId);
        if (mentor.role !== "mentor" || mentor.access_status !== "active") return json({ error: "Mentor is not available" }, 400);
        const { error } = await admin.from("mentor_relationships").upsert({
          mentor_id: mentorId, learner_id: actorId, initiated_by: actorId, status: "requested",
          learner_consent_at: null, accepted_at: null, revoked_at: null, revoked_by: null
        }, { onConflict: "mentor_id,learner_id" });
        if (error) throw error;
        return json({ success: true, message: "Mentor request sent" });
      }
      if (kind === "respond") {
        const relationshipId = String(body.relationshipId || "");
        const { data: rel, error: relError } = await admin.from("mentor_relationships").select("*").eq("id", relationshipId).single();
        if (relError) throw relError;
        if (rel.mentor_id !== actorId || !["requested","offered"].includes(rel.status)) return json({ error: "This mentoring request is not available to you" }, 403);
        const accept = body.accept === true;
        const { error } = await admin.from("mentor_relationships").update({
          status: accept ? "accepted" : "declined", accepted_at: accept ? new Date().toISOString() : null, updated_at: new Date().toISOString()
        }).eq("id", relationshipId);
        if (error) throw error;
        return json({ success: true, message: accept ? "Accepted. Waiting for learner consent." : "Mentoring request declined" });
      }
      if (kind === "consent") {
        const relationshipId = String(body.relationshipId || "");
        const { data: rel, error: relError } = await admin.from("mentor_relationships").select("*").eq("id", relationshipId).single();
        if (relError) throw relError;
        if (rel.learner_id !== actorId || rel.status !== "accepted") return json({ error: "Learner consent is not available for this relationship" }, 403);
        const permissions = Array.isArray(body.permissions) ? body.permissions.filter((p: string) => allowedPermissions.has(p)) : [];
        if (!permissions.length) return json({ error: "Select at least one information category to share" }, 400);
        const { error: clearError } = await admin.from("mentor_relationship_permissions").delete().eq("relationship_id", relationshipId);
        if (clearError) throw clearError;
        const { error: addError } = await admin.from("mentor_relationship_permissions").insert(permissions.map((permission_key: string) => ({ relationship_id: relationshipId, permission_key })));
        if (addError) throw addError;
        const { error } = await admin.from("mentor_relationships").update({
          status: "active", learner_consent_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }).eq("id", relationshipId);
        if (error) throw error;
        return json({ success: true, message: "Mentor access activated with your selected permissions" });
      }
      if (kind === "revoke") {
        const relationshipId = String(body.relationshipId || "");
        const { data: rel, error: relError } = await admin.from("mentor_relationships").select("*").eq("id", relationshipId).single();
        if (relError) throw relError;
        if (rel.learner_id !== actorId && !isAdmin) return json({ error: "Only the learner or an administrator can revoke this relationship" }, 403);
        const { error } = await admin.from("mentor_relationships").update({
          status: "revoked", revoked_at: new Date().toISOString(), revoked_by: actorId, learner_consent_at: null, updated_at: new Date().toISOString()
        }).eq("id", relationshipId);
        if (error) throw error;
        return json({ success: true, message: "Mentor access revoked" });
      }
      return json({ error: "Unknown mentoring action" }, 400);
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("learnflow-admin error", error);
    return json({ error: error instanceof Error ? error.message : "Request failed" }, 400);
  }
});
