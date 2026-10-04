let supa=null;
const SUPABASE_URL='https://zltqnsylerhcbnslqcqm.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_rwWi8lxqY2rHQvTmfBr0qw_BO_gNh9J';
const AUTH_REDIRECT_URL='https://learnflow-steel.vercel.app/';

const demoResources = [
  {id:1,title:'Financial Modeling for Entrepreneurs',type:'Course',provider:'Udemy',goal:'Build Business Acumen',skills:['Financial Modeling','Business Strategy'],status:'In Progress',progress:78,priority:'High',due:'Sep 27',hours:'15.6 / 20h',column:'in-progress',owner:'J',color:'blue',activity:[['Sep 20','Study · 1h'],['Sep 19','Practice · 45m'],['Sep 18','Watch · 1h 20m']]},
  {id:2,title:'AI Engineering Fundamentals',type:'Course',provider:'DeepLearning.AI',goal:'Become Better at AI',skills:['AI','Prompt Engineering'],status:'In Progress',progress:52,priority:'High',due:'Sep 30',hours:'8 / 16h',column:'in-progress',owner:'J',color:'blue',activity:[['Sep 20','Read · 40m'],['Sep 17','Study · 1h']]},
  {id:3,title:'Prompt Engineering',type:'Course',provider:'OpenAI Academy',goal:'Become Better at AI',skills:['AI','Prompt Engineering'],status:'Practice / Review',progress:64,priority:'Medium',due:'Oct 04',hours:'5.2 / 8h',column:'practice',owner:'R',color:'purple',activity:[['Sep 19','Practice · 50m']]},
  {id:4,title:'Digital Marketing Strategy',type:'Course',provider:'Reforge',goal:'Master Marketing',skills:['Marketing','Sales'],status:'Planned',progress:18,priority:'Medium',due:'Oct 12',hours:'2 / 14h',column:'planned',owner:'P',color:'orange',activity:[['Sep 12','Read · 2h']]},
  {id:5,title:'Leadership Fundamentals',type:'Book',provider:'Penguin',goal:'Improve Leadership',skills:['Leadership'],status:'Completed',progress:100,priority:'Low',due:'Sep 18',hours:'11 / 11h',column:'completed',owner:'J',color:'blue',activity:[['Sep 18','Read · 1h 30m'],['Sep 16','Read · 1h']]},
  {id:6,title:'Negotiation Masterclass',type:'Workshop',provider:'MasterClass',goal:'Build Business Acumen',skills:['Sales','Leadership'],status:'Backlog',progress:0,priority:'High',due:'Oct 20',hours:'0 / 6h',column:'backlog',owner:'R',color:'purple',activity:[]},
  {id:7,title:'Product Management Fundamentals',type:'Course',provider:'LinkedIn Learning',goal:'Build Business Acumen',skills:['Business Strategy'],status:'Completed',progress:100,priority:'Medium',due:'Sep 14',hours:'9 / 9h',column:'completed',owner:'J',color:'blue',activity:[['Sep 14','Completed · 1h']]},
  {id:8,title:'Advanced Excel',type:'Course',provider:'Coursera',goal:'Build Business Acumen',skills:['Financial Modeling'],status:'Planned',progress:12,priority:'Low',due:'Nov 02',hours:'1 / 10h',column:'planned',owner:'P',color:'orange',activity:[['Sep 10','Study · 1h']]}
];
const columns=[['backlog','BACKLOG'],['planned','PLANNED'],['in-progress','IN PROGRESS'],['practice','PRACTICE / REVIEW'],['completed','COMPLETED']];
const demoGoals=[
  {id:'demo-goal-1',title:'Build Business Acumen',description:'Become a stronger, more confident operator.',priority:'High',status:'active'},
  {id:'demo-goal-2',title:'Become Better at AI',description:'Build practical fluency in modern AI systems.',priority:'High',status:'active'},
  {id:'demo-goal-3',title:'Improve Leadership',description:'Lead with clarity, empathy, and conviction.',priority:'Medium',status:'active'},
  {id:'demo-goal-4',title:'Master Marketing',description:'Understand how great products find their people.',priority:'Medium',status:'active'}
];
const demoSkills=[
  {id:'demo-skill-1',title:'Financial Modeling',description:'Build and interpret models to make better decisions.'},
  {id:'demo-skill-2',title:'AI Engineering',description:'Design useful systems with modern AI primitives.'},
  {id:'demo-skill-3',title:'Business Strategy',description:'See the system, find the leverage, make the call.'},
  {id:'demo-skill-4',title:'Leadership',description:'Create clarity and momentum for other people.'},
  {id:'demo-skill-5',title:'Marketing',description:'Turn customer insight into meaningful growth.'},
  {id:'demo-skill-6',title:'Sales',description:'Build trust and move from interest to action.'}
];
const demoSprints=[
  {id:'demo-sprint-1',title:'Build the foundation',start_date:'2026-09-21',end_date:'2026-09-27',status:'active'},
  {id:'demo-sprint-2',title:'AI practice week',start_date:'2026-09-28',end_date:'2026-10-04',status:'planned'}
];
const demoActivities=[
  {id:'demo-activity-1',resource_id:1,activity_type:'Study',duration_minutes:60,notes:'Worked through financial modeling fundamentals.',occurred_at:'2026-09-20T09:30:00+05:30'},
  {id:'demo-activity-2',resource_id:2,activity_type:'Study',duration_minutes:40,notes:'Practiced building an AI workflow.',occurred_at:'2026-09-20T14:00:00+05:30'},
  {id:'demo-activity-3',resource_id:3,activity_type:'Practice',duration_minutes:50,notes:'Applied prompt patterns to a real task.',occurred_at:'2026-09-19T16:30:00+05:30'},
  {id:'demo-activity-4',resource_id:5,activity_type:'Read',duration_minutes:90,notes:'Finished the final chapter.',occurred_at:'2026-09-18T20:00:00+05:30'}
];
function resetDemoWorkspace(){
  goalsData=demoGoals.map(x=>({...x}));
  skillsData=demoSkills.map(x=>({...x}));
  sprintsData=demoSprints.map(x=>({...x}));
  activitiesData=demoActivities.map(x=>({...x}));
  resources=demoResources.map(r=>({...r,skills:[...r.skills],activity:r.activity.map(a=>[...a])}));
  resources.forEach(r=>{
    if([1,2,3,5,7].includes(r.id))r.sprint_id='demo-sprint-1';
    if(r.id===4||r.id===6)r.sprint_id='demo-sprint-2';
  });
}

let user=null;
let profile=null;
let profiles=[];
let resources=demoResources.map(r=>({...r,skills:[...r.skills],activity:r.activity.map(a=>[...a])}));
let goalsData=[], skillsData=[], sprintsData=[], activitiesData=[];
let currentView='overview'; let searchTerm=''; let activeFilter='All';
const root=document.getElementById('view-container'); const modalBackdrop=document.getElementById('modal-backdrop'); const modal=document.getElementById('modal');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function toUiResource(r){
  const column=r.status==='completed'?'completed':r.status==='in-progress'?'in-progress':r.status==='practice'?'practice':r.status;
  const ownerProfile=profiles.find(p=>p.user_id===r.user_id)||(r.user_id===user?.id?profile:null);
  const ownerName=ownerProfile?.display_name||'Learner';
  const ownerInitials=ownerName.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'L';
  return {...r,column,status:column==='completed'?'Completed':column==='in-progress'?'In Progress':column==='practice'?'Practice / Review':column==='planned'?'Planned':'Backlog',due:r.due_date||'Not scheduled',owner:ownerInitials,ownerName,color:'blue',hours:r.estimated_hours?('0 / '+r.estimated_hours+'h'):'0 / —',activity:[]};
}
async function loadProfile(){
  if(!user||!supa){profile=null;return}
  const {data,error}=await supa.from('profiles').select('*').eq('user_id',user.id).maybeSingle();
  if(error){console.error(error);profile=null;toast('Could not load your access profile');return}
  profile=data||null;
}
async function loadProfiles(){
  if(!supa||!profile||profile.role!=='admin'||profile.access_status!=='active'){profiles=[];return}
  const {data,error}=await supa.from('profiles').select('*').order('created_at',{ascending:true});
  if(error){console.error(error);toast('Could not load user access list');return}
  profiles=data||[];
}
async function updateAccess(userId, role, accessStatus){
  if(!supa||profile?.role!=='admin'||profile?.access_status!=='active')return false;
  const payload={role,access_status:accessStatus,approved_at:accessStatus==='active'?new Date().toISOString():null,approved_by:accessStatus==='active'?user.id:null};
  const {error}=await supa.from('profiles').update(payload).eq('user_id',userId);
  if(error){console.error(error);toast('Could not update user access: '+error.message);return false}
  await loadProfiles();
  toast('User access updated');
  render();
  return true;
}
async function loadResources(){
  if(!user||!supa){resetDemoWorkspace();return}
  const {data,error}=await supa.from('resources').select('*').order('created_at',{ascending:false});
  if(error){console.error(error);toast('Could not load saved learning resources');return}
  resources=(data||[]).map(toUiResource);
  syncResourceActivities();
}
async function loadWorkspaceData(){
  if(!user||!supa){resetDemoWorkspace();return}
  const [g,s,sp,a]=await Promise.all([
    supa.from('goals').select('*').order('created_at',{ascending:true}),
    supa.from('skills').select('*').order('created_at',{ascending:true}),
    supa.from('sprints').select('*').order('start_date',{ascending:false}),
    supa.from('activities').select('*').order('occurred_at',{ascending:false}).limit(100)
  ]);
  for(const result of [g,s,sp,a])if(result.error){console.error(result.error);toast('Could not load all learning workspace data');}
  goalsData=g.data||[];skillsData=s.data||[];sprintsData=sp.data||[];activitiesData=a.data||[];
  syncResourceActivities();
  if(!goalsData.length&&!skillsData.length&&!sprintsData.length)await seedWorkspaceData();
}
async function seedWorkspaceData(){
  if(!user||!supa||profile?.role==='admin')return;
  const goalTitles=[['Build Business Acumen','Become a stronger, more confident operator.','High'],['Become Better at AI','Build practical fluency in modern AI systems.','High'],['Improve Leadership','Lead with clarity, empathy, and conviction.','Medium'],['Master Marketing','Understand how great products find their people.','Medium']];
  const skillTitles=[['Financial Modeling','Build and interpret models to make better decisions.'],['AI Engineering','Design useful systems with modern AI primitives.'],['Business Strategy','See the system, find the leverage, make the call.'],['Leadership','Create clarity and momentum for other people.'],['Marketing','Turn customer insight into meaningful growth.'],['Sales','Build trust and move from interest to action.']];
  const today=new Date();const end=new Date(today);end.setDate(end.getDate()+6);
  const [g,s,sp]=await Promise.all([
    supa.from('goals').insert(goalTitles.map(x=>({title:x[0],description:x[1],priority:x[2]}))).select(),
    supa.from('skills').insert(skillTitles.map(x=>({title:x[0],description:x[1]}))).select(),
    supa.from('sprints').insert({title:'Build the foundation',start_date:today.toISOString().slice(0,10),end_date:end.toISOString().slice(0,10),status:'active'}).select().single()
  ]);
  if(g.error||s.error||sp.error){console.error(g.error||s.error||sp.error);return}
  goalsData=g.data||[];skillsData=s.data||[];sprintsData=[sp.data];
}
async function createGoal(payload){const {data,error}=await supa.from('goals').insert(payload).select().single();if(error){toast('Could not create goal: '+error.message);return false}goalsData.push(data);toast('Goal created');render();return true}
async function createSkill(payload){const {data,error}=await supa.from('skills').insert(payload).select().single();if(error){toast('Could not create skill: '+error.message);return false}skillsData.push(data);toast('Skill added');render();return true}
async function createSprint(payload){const {data,error}=await supa.from('sprints').insert(payload).select().single();if(error){toast('Could not create sprint: '+error.message);return false}sprintsData.unshift(data);toast('Sprint created');render();return true}

function syncResourceActivities(){
  resources.forEach(r=>{
    r.activity=activitiesData
      .filter(a=>String(a.resource_id)===String(r.id))
      .sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at));
  });
}
async function persistResource(r){
  if(!user||!supa)return true;
  const payload={title:r.title,type:r.type,provider:r.provider||'Independent',goal:r.goal||null,skills:r.skills||[],status:r.column||'backlog',progress:r.progress||0,priority:r.priority||'Medium',due_date:r.due&&r.due!=='Not scheduled'?r.due:null,estimated_hours:r.estimated_hours??null,notes:r.notes||null,owner_label:user.email?.split('@')[0]||null,sprint_id:r.sprint_id||null};
  if(typeof r.id==='string')payload.id=r.id;
  const {data,error}=await supa.from('resources').upsert(payload).select().single();
  if(error){console.error(error);toast('Could not save resource: '+error.message);return false}
  Object.assign(r,toUiResource(data));return true;
}

async function initSupabase(){
  render();
  try{
    const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
    supa=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    const {data,error}=await supa.auth.getUser();
    if(!error)user=data.user||null;
    await refreshSessionState();
    supa.auth.onAuthStateChange(async(_event,session)=>{user=session?.user||null;await refreshSessionState()});
  }catch(error){
    console.error('Supabase initialization failed:',error);
    user=null;
    updateAuthButton();
    toast('LearnFlow could not connect to its data service');
  }
}
async function refreshSessionState(){
  await loadProfile();
  await loadProfiles();
  updateAuthButton();
  updateRoleUI();
  if(!user){
    currentView='overview';
    resetDemoWorkspace();
  }else if(profile?.access_status==='active'){
    if(!profile.name_setup_completed)currentView='name-setup';
    else if(currentView==='login'||currentView==='name-setup')currentView='overview';
    if(currentView==='name-setup'){await loadResources();await loadWorkspaceData();render();return}
    await loadResources();
    await loadWorkspaceData();
  }else{
    resources=[];goalsData=[];skillsData=[];sprintsData=[];activitiesData=[];
  }
  const activeView=document.getElementById('breadcrumb-current');
  if(activeView)activeView.textContent=currentView==='board'?'Learning Board':currentView[0].toUpperCase()+currentView.slice(1);
  document.querySelectorAll('.nav-item[data-view],.mobile-nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  render();
}
function updateAuthButton(){const b=document.getElementById('auth-button');if(b)b.textContent=user?'Log out':'Log in';}
function updateRoleUI(){
  const adminNav=document.getElementById('admin-nav');
  if(adminNav)adminNav.style.display=profile?.role==='admin'&&profile?.access_status==='active'?'flex':'none';
  const workspace=document.getElementById('sidebar-workspace');
  if(workspace)workspace.style.display=user?'block':'none';
  const roleLabel=document.getElementById('user-role-label');
  if(roleLabel)roleLabel.textContent=profile?.role?profile.role[0].toUpperCase()+profile.role.slice(1):'Guest';
  const userName=document.getElementById('user-name');
  if(userName)userName.textContent=profile?.display_name||user?.email?.split('@')[0]||'Guest';
}
async function authAction(){
  if(user){const {error}=await supa.auth.signOut();if(error)toast(error.message);return}
  currentView='login';
  document.querySelectorAll('.nav-item[data-view],.mobile-nav button[data-view]').forEach(b=>b.classList.remove('active'));
  const breadcrumb=document.getElementById('breadcrumb-current');
  if(breadcrumb)breadcrumb.textContent='Log in';
  render();
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function setView(view){if(view==='admin'&&!(profile?.role==='admin'&&profile?.access_status==='active'))return;currentView=view;document.querySelectorAll('.nav-item[data-view],.mobile-nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.getElementById('breadcrumb-current').textContent=view==='board'?'Learning Board':view[0].toUpperCase()+view.slice(1);render()}
function resourceCard(r){
  return `<article class="course-card" draggable="true" data-id="${r.id}"><div class="card-top"><span class="type-label">${esc(r.type)} · ${esc(r.provider)}</span><span class="priority-dot ${r.priority.toLowerCase()}" title="${r.priority} priority"></span></div><h4>${esc(r.title)}</h4><div class="provider">${r.goal}</div><div class="card-progress"><div class="progress-caption"><span>Progress</span><b>${r.progress}%</b></div><div class="progress-track"><div class="progress-fill ${r.progress===100?'green':''}" style="width:${r.progress}%"></div></div></div><div class="tag-row">${r.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><div class="card-footer"><span class="due ${r.priority==='High'?'soon':''}">◷ ${r.due}</span><span class="owner-badge" title="${esc(r.ownerName)}"><span class="avatar avatar-${r.color}">${r.owner}</span><span class="owner-name">${esc(r.ownerName)}</span></span></div></article>`;
}
function loginView(){
  return `<div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand"><div class="brand-mark">L</div><span>LearnFlow</span></div>
      <div class="eyebrow">Welcome back</div>
      <h1>Log in to LearnFlow</h1>
      <p class="auth-copy">Continue your learning workspace and pick up where you left off.</p>
      <form id="login-form">
        <div class="field">
          <label>Email</label>
          <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        </div>
        <div class="field">
          <label>Password <span class="auth-optional">optional</span></label>
          <input name="password" type="password" autocomplete="current-password" placeholder="Enter your password">
        </div>
        <button class="primary-button auth-submit" type="submit">Log in</button>
      </form>
      <div class="auth-divider"><span>or</span></div>
      <button class="secondary-button auth-link-button" id="magic-link-login" type="button">Send me a magic link</button>
      <button class="auth-back" id="back-to-demo" type="button">← Back to LearnFlow</button>
      <p class="auth-help">Use your password for immediate sign-in, or request a magic link by email.</p>
    </div>
  </div>`;
}

function nameSetup(){
  return `<div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand"><div class="brand-mark">L</div><span>LearnFlow</span></div>
      <div class="eyebrow">One quick question</div>
      <h1>What should we call you?</h1>
      <p class="auth-copy">This is the name LearnFlow will use when greeting you and around your workspace.</p>
      <form id="name-form">
        <div class="field">
          <label>Your name</label>
          <input name="display_name" type="text" autocomplete="name" placeholder="e.g. Gaurav" maxlength="80" required>
        </div>
        <button class="primary-button auth-submit" type="submit">Continue</button>
      </form>
      <p class="auth-help">We’ll use this name for your greetings and workspace identity.</p>
    </div>
  </div>`;
}

function accessGate(){
  const status=profile?.access_status;
  const title=status==='pending'?'Access pending':status==='rejected'?'Access not approved':'Access suspended';
  const copy=status==='pending'?'Your LearnFlow account is created, but an admin needs to approve your access before you can use the workspace.':'Your LearnFlow access is currently unavailable. Please contact the LearnFlow admin.';
  return `<div class="page"><div class="empty-state" style="max-width:680px;margin:70px auto;padding:40px"><div class="eyebrow">Account access</div><h1 style="margin:8px 0 10px">${title}</h1><p>${copy}</p><p class="stat-meta" style="margin-top:18px">Signed in as <strong>${esc(user?.email||'')}</strong></p><button class="secondary-button" id="refresh-access" style="margin-top:18px">Check access again</button></div></div>`
}
function admin(){
  const rows=profiles.map(p=>`<tr>
    <td><strong>${esc(p.display_name||'Unnamed user')}</strong><span class="table-type">${esc(p.user_id)}</span></td>
    <td><span class="status-pill ${p.access_status==='active'?'done':p.access_status==='pending'?'practice':''}">${esc(p.access_status)}</span></td>
    <td><select data-role-user="${p.user_id}" ${p.user_id===user?.id?'disabled':''}><option value="learner" ${p.role==='learner'?'selected':''}>Learner</option><option value="mentor" ${p.role==='mentor'?'selected':''}>Mentor</option><option value="admin" ${p.role==='admin'?'selected':''}>Admin</option></select></td>
    <td><select data-access-user="${p.user_id}" ${p.user_id===user?.id?'disabled':''}><option value="pending" ${p.access_status==='pending'?'selected':''}>Pending</option><option value="active" ${p.access_status==='active'?'selected':''}>Active</option><option value="suspended" ${p.access_status==='suspended'?'selected':''}>Suspended</option><option value="rejected" ${p.access_status==='rejected'?'selected':''}>Rejected</option></select></td>
    <td>${p.user_id===user?.id?'<span class="stat-meta">You</span>':`<button class="secondary-button" style="padding:6px 9px" data-approve-user="${p.user_id}">${p.access_status==='active'?'Update':'Approve'}</button>`}</td>
  </tr>`).join('');
  return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Workspace administration</div><h1>User access</h1><p>Approve users and assign Admin, Mentor, or Learner roles.</p></div></div><section class="panel list-panel"><div class="table-toolbar"><strong>${profiles.length} users</strong><span class="stat-meta">Access is enforced by Supabase RLS</span></div><table class="data-table"><thead><tr><th>User</th><th>Status</th><th>Role</th><th>Access</th><th>Action</th></tr></thead><tbody>${rows||'<tr><td colspan="5">No users yet.</td></tr>'}</tbody></table></section></div>`
}
function overview(){
  const now=new Date();
  const hour=now.getHours();
  const greeting=hour<12?'Good morning':hour<17?'Good afternoon':hour<21?'Good evening':'Good night';
  const dateLabel=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const displayName=user?(profile?.display_name||'there'):'there';
  if(!user){
    return `
<div class="page demo-overview"><div class="page-heading"><div><div class="eyebrow">${dateLabel}</div><h1>${greeting}, ${esc(displayName)}</h1><p>Keep learning at your own pace. Your next useful step is waiting for you.</p></div><div class="button-row"><button class="secondary-button" id="open-search">⌕ Search</button><button class="primary-button" id="add-learning">＋ Add learning</button></div></div><div class="stats-grid"><div class="stat-card"><span class="stat-label">Courses</span><div class="stat-value">${resources.length}</div><span class="stat-meta">8 completed this year</span></div><div class="stat-card"><span class="stat-label">Overall progress</span><div class="stat-value">67%</div><span class="stat-meta positive">↑ 8% from last month</span></div><div class="stat-card"><span class="stat-label">Learning hours</span><div class="stat-value">29<span style="font-size:13px">h</span></div><span class="stat-meta">of 42h planned</span></div><div class="stat-card"><span class="stat-label">Active days</span><div class="stat-value">12</div><span class="stat-meta positive">↑ 3 this month</span></div></div><div class="overview-grid"><section class="panel sprint-panel"><div class="panel-header"><h3>Current sprint</h3><button class="panel-link" data-view-link="sprints">View sprint →</button></div><div class="sprint-content"><div class="sprint-title"><div class="sprint-icon">◷</div><div><strong>Sprint 04 · Build the foundation</strong><small>Sep 21 – Sep 27, 2026 · 5 days left</small></div></div><div class="progress-row"><span>Progress</span><b>78%</b></div><div class="progress-track"><div class="progress-fill" style="width:78%"></div></div><div class="sprint-footer"><div><strong>5</strong><span>courses planned</span></div><div><strong>3</strong><span>completed</span></div><div><strong>12h</strong><span>learning planned</span></div></div></div></section><section class="panel momentum-panel"><div class="panel-header"><h3>Learning momentum</h3><span class="status-pill done">ACTIVE</span></div><div class="momentum-score"><strong>8.4</strong><small>GOOD</small></div><p class="momentum-copy">You’re building a steady rhythm. Keep your focus on one small step today.</p><div class="mini-stats"><div><strong>4</strong><span>active days</span></div><div><strong>5.5h</strong><span>this week</span></div><div><strong>2</strong><span>progressed</span></div></div></section></div><div class="overview-grid"><section class="panel chart-panel"><div class="panel-header"><h3>Learning activity</h3><button class="panel-link" data-view-link="analytics">Last 7 days⌄</button></div><div class="chart"><div class="chart-y"><span>3h</span><span>2h</span><span>1h</span><span>0</span></div><div class="bar-area"><div class="bar-col"><div class="bar" style="height:44%"></div><label>Mon</label></div><div class="bar-col"><div class="bar active" style="height:76%"></div><label>Tue</label></div><div class="bar-col"><div class="bar" style="height:31%"></div><label>Wed</label></div><div class="bar-col"><div class="bar active" style="height:92%"></div><label>Thu</label></div><div class="bar-col"><div class="bar" style="height:59%"></div><label>Fri</label></div><div class="bar-col"><div class="bar active" style="height:72%"></div><label>Sat</label></div><div class="bar-col"><div class="bar" style="height:24%"></div><label>Sun</label></div></div></div><div class="chart-legend"><span><i class="legend-dot"></i>Hours logged</span><span>5.5 hours this week</span></div></section><section class="panel focus-panel"><div class="panel-header"><h3>Today’s focus</h3><span class="panel-link">3 items</span></div><div class="focus-item"><span class="focus-number">01</span><div class="focus-copy"><strong>Financial Modeling for Entrepreneurs</strong><span>In progress · High priority</span></div><span class="time-pill">45 min</span></div><div class="focus-item"><span class="focus-number">02</span><div class="focus-copy"><strong>AI Engineering Fundamentals</strong><span>Current sprint</span></div><span class="time-pill">60 min</span></div><div class="focus-item"><span class="focus-number">03</span><div class="focus-copy"><strong>Read: Product Strategy</strong><span>Due Sep 25</span></div><span class="time-pill">20 min</span></div></section></div><section class="panel"><div class="panel-header"><h3>Attention</h3><button class="panel-link" data-view-link="board">View all →</button></div><div class="attention-row"><div class="attention-item warning"><strong>2</strong><span>Overdue resources</span></div><div class="attention-item danger"><strong>1</strong><span>Blocked resource</span></div><div class="attention-item info"><strong>3</strong><span>Stale resources</span></div></div></section></div>`;
  }
  const completed=resources.filter(r=>Number(r.progress)>=100).length;
  const overall=resources.length?Math.round(resources.reduce((sum,r)=>sum+Number(r.progress||0),0)/resources.length):0;
  const plannedHours=resources.reduce((sum,r)=>sum+Number(r.estimated_hours||0),0);
  const learningMinutes=activitiesData.reduce((sum,a)=>sum+Number(a.duration_minutes||0),0);
  const learningHours=Math.round(learningMinutes/60*10)/10;
  const activeDays=new Set(activitiesData.map(a=>new Date(a.occurred_at).toLocaleDateString())).size;
  const currentSprint=sprintsData.find(sp=>sp.status==='active')||sprintsData[0];
  const sprintResources=currentSprint?resources.filter(r=>r.sprint_id===currentSprint.id):[];
  const sprintProgress=sprintResources.length?Math.round(sprintResources.reduce((sum,r)=>sum+Number(r.progress||0),0)/sprintResources.length):0;
  const focus=resources.filter(r=>r.progress<100).sort((a,b)=>Number(b.priority==='High')-Number(a.priority==='High')||Number(b.progress)-Number(a.progress)).slice(0,3);
  const attentionOverdue=resources.filter(r=>r.due_date&&new Date(r.due_date)<now&&r.progress<100).length;
  const attentionBlocked=resources.filter(r=>r.status==='backlog'&&r.priority==='High').length;
  const attentionStale=resources.filter(r=>{const d=r.updated_at?new Date(r.updated_at):null;return d&&((now-d)/86400000)>14&&r.progress<100}).length;
  const chartDays=[...Array(7)].map((_,i)=>{const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-6+i);return d});
  const chartMinutes=chartDays.map(d=>activitiesData.filter(a=>{const x=new Date(a.occurred_at);return x.getFullYear()===d.getFullYear()&&x.getMonth()===d.getMonth()&&x.getDate()===d.getDate()}).reduce((sum,a)=>sum+Number(a.duration_minutes||0),0));
  const maxChart=Math.max(...chartMinutes,1);
  const weekHours=Math.round(chartMinutes.reduce((a,b)=>a+b,0)/60*10)/10;
  const sprintStart=currentSprint?.start_date?new Date(currentSprint.start_date):null;
  const sprintEnd=currentSprint?.end_date?new Date(currentSprint.end_date):null;
  const sprintDaysLeft=sprintEnd?Math.max(0,Math.ceil((sprintEnd-now)/86400000)):0;
  return `<div class="page demo-overview"><div class="page-heading"><div><div class="eyebrow">${dateLabel}</div><h1>${greeting}, ${esc(displayName)}</h1><p>Keep learning at your own pace. Your next useful step is waiting for you.</p></div><div class="button-row"><button class="secondary-button" id="open-search">⌕ Search</button><button class="primary-button" id="add-learning">＋ Add learning</button></div></div>
  <div class="stats-grid"><div class="stat-card"><span class="stat-label">Courses</span><div class="stat-value">${resources.length}</div><span class="stat-meta">${completed} completed</span></div><div class="stat-card"><span class="stat-label">Overall progress</span><div class="stat-value">${overall}%</div><span class="stat-meta">Across your learning</span></div><div class="stat-card"><span class="stat-label">Learning hours</span><div class="stat-value">${learningHours}<span style="font-size:13px">h</span></div><span class="stat-meta">of ${plannedHours.toFixed(1)}h planned</span></div><div class="stat-card"><span class="stat-label">Active days</span><div class="stat-value">${activeDays}</div><span class="stat-meta">Days with logged activity</span></div></div>
  <div class="overview-grid"><section class="panel sprint-panel"><div class="panel-header"><h3>Current sprint</h3><button class="panel-link" data-view-link="sprints">View sprint →</button></div><div class="sprint-content">${currentSprint?`<div class="sprint-title"><div class="sprint-icon">◷</div><div><strong>${esc(currentSprint.title)}</strong><small>${esc(currentSprint.start_date||'')} – ${esc(currentSprint.end_date||'')} · ${sprintDaysLeft} days left</small></div></div><div class="progress-row"><span>Progress</span><b>${sprintProgress}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${sprintProgress}%"></div></div><div class="sprint-footer"><div><strong>${sprintResources.length}</strong><span>resources planned</span></div><div><strong>${sprintResources.filter(r=>r.progress>=100).length}</strong><span>completed</span></div><div><strong>${sprintResources.reduce((sum,r)=>sum+Number(r.estimated_hours||0),0).toFixed(1)}h</strong><span>learning planned</span></div></div>`:'<div class="empty-state" style="padding:28px 12px"><strong>No sprint yet</strong><p>Create a sprint to see your current plan here.</p></div>'}</div></section>
  <section class="panel momentum-panel"><div class="panel-header"><h3>Learning momentum</h3><span class="status-pill ${activeDays?'done':''}">${activeDays?'ACTIVE':'NEW'}</span></div><div class="momentum-score"><strong>${activeDays?Math.min(10,(activeDays+weekHours/2).toFixed(1)):'0'}</strong><small>${activeDays?'ACTIVE':'START'}</small></div><p class="momentum-copy">${activeDays?'You are building a learning rhythm. Keep your focus on one small step today.':'Log your first learning activity to start building momentum.'}</p><div class="mini-stats"><div><strong>${activeDays}</strong><span>active days</span></div><div><strong>${weekHours}h</strong><span>this week</span></div><div><strong>${activitiesData.filter(a=>(Date.now()-new Date(a.occurred_at).getTime())<604800000).length}</strong><span>activities</span></div></div></section></div>
  <div class="overview-grid"><section class="panel chart-panel"><div class="panel-header"><h3>Learning activity</h3><button class="panel-link" data-view-link="analytics">Last 7 days⌄</button></div><div class="chart"><div class="chart-y"><span>3h</span><span>2h</span><span>1h</span><span>0</span></div><div class="bar-area">${chartDays.map((d,i)=>`<div class="bar-col"><div class="bar ${chartMinutes[i]?'active':''}" style="height:${Math.max(4,Math.round(chartMinutes[i]/maxChart*92))}%"></div><label>${d.toLocaleDateString(undefined,{weekday:'short'})}</label></div>`).join('')}</div></div><div class="chart-legend"><span><i class="legend-dot"></i>Hours logged</span><span>${weekHours} hours this week</span></div></section><section class="panel focus-panel"><div class="panel-header"><h3>Today’s focus</h3><span class="panel-link">${focus.length} items</span></div>${focus.length?focus.map((r,i)=>`<div class="focus-item"><span class="focus-number">0${i+1}</span><div class="focus-copy"><strong>${esc(r.title)}</strong><span>${esc(r.status)} · ${esc(r.priority)} priority</span></div><span class="time-pill">${r.estimated_hours?Math.round(Number(r.estimated_hours)*60*(1-Number(r.progress||0)/100))+' min':'—'}</span></div>`).join(''):'<div class="empty-state" style="padding:30px 12px"><strong>No learning yet</strong><p>Add a resource to create your first focus list.</p></div>'}</section></div>
  <section class="panel"><div class="panel-header"><h3>Attention</h3><button class="panel-link" data-view-link="board">View all →</button></div><div class="attention-row"><div class="attention-item warning"><strong>${attentionOverdue}</strong><span>Overdue resources</span></div><div class="attention-item danger"><strong>${attentionBlocked}</strong><span>High-priority backlog</span></div><div class="attention-item info"><strong>${attentionStale}</strong><span>Stale resources</span></div></div></section></div>`;
}
function board(){const filtered=resources.filter(r=>(activeFilter==='All'||r.status===activeFilter)&&(!searchTerm||`${r.title} ${r.goal} ${r.skills.join(' ')}`.toLowerCase().includes(searchTerm.toLowerCase())));return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Execution space</div><h1>Learning board</h1><p>Turn your goals into consistent, visible progress.</p></div><button class="primary-button" id="add-learning">＋ Add learning</button></div><div class="board-toolbar"><div class="toolbar-left"><button class="filter-button ${activeFilter==='All'?'active':''}" data-filter="All">All resources</button><button class="filter-button ${activeFilter==='In Progress'?'active':''}" data-filter="In Progress">In progress</button><button class="filter-button ${activeFilter==='Completed'?'active':''}" data-filter="Completed">Completed</button><button class="filter-button" id="board-filter">＋ Filter</button></div><div class="toolbar-right"><button class="filter-button">☷ List view</button><button class="filter-button">↕ Sort</button></div></div><div class="board-columns">${columns.map(([id,label])=>`<div class="board-column" data-status="${id}"><div class="column-heading"><div><strong>${label}</strong><span class="column-count">${filtered.filter(r=>r.column===id).length}</span></div><button class="column-add" data-column="${id}">＋</button></div>${filtered.filter(r=>r.column===id).map(resourceCard).join('')||'<div class="empty-state" style="padding:28px 12px"><strong>Nothing here yet</strong><p>Drag a resource here</p></div>'}</div>`).join('')}</div><h2 class="section-title">All learning</h2><section class="panel list-panel"><div class="table-toolbar"><strong>Resource library</strong><span class="stat-meta">${filtered.length} resources</span></div><table class="data-table"><thead><tr><th>Resource</th><th>Status</th><th>Goal</th><th>Progress</th><th>Priority</th><th>Due</th></tr></thead><tbody>${filtered.map(r=>`<tr data-id="${r.id}"><td><span class="table-title">${esc(r.title)}</span><span class="table-type">${esc(r.type)}</span></td><td><span class="status-pill ${r.column==='completed'?'done':r.column==='in-progress'?'progress':r.column==='practice'?'practice':''}">${r.status}</span></td><td>${r.goal}</td><td><b>${r.progress}%</b></td><td>${r.priority}</td><td>${r.due}</td></tr>`).join('')}</tbody></table></section></div>`}
function workspaceOwner(row){
  const p=profiles.find(x=>x.user_id===row.user_id)||(row.user_id===user?.id?profile:null);
  return {name:p?.display_name||'Learner',role:p?.role||'learner'};
}
function visibleWorkspaceRows(rows){
  if(profile?.role==='admin'&&profile?.access_status==='active')return rows;
  return rows.filter(row=>row.user_id===user?.id);
}
function updateNavCounts(){
  const adminView=profile?.role==='admin'&&profile?.access_status==='active';
  const visibleGoals=adminView?visibleWorkspaceRows(goalsData):goalsData;
  const visibleSkills=adminView?visibleWorkspaceRows(skillsData):skillsData;
  const visibleSprints=adminView?visibleWorkspaceRows(sprintsData):sprintsData;
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=String(value)};
  set('goals-count',visibleGoals.length);
  set('skills-count',visibleSkills.length);
  set('sprints-count',visibleSprints.length);
}
function goals(){const gs=visibleWorkspaceRows(goalsData);const adminView=profile?.role==='admin'&&profile?.access_status==='active';return `<div class="page"><div class="page-heading"><div><div class="eyebrow">${adminView?'Learner & mentor workspace':'Direction before action'}</div><h1>Goals</h1><p>${adminView?'All goals across your workspace, including learners and mentors.':'Give your learning a reason to exist.'}</p></div><button class="primary-button" id="add-goal">＋ Create goal</button></div><div class="goal-grid">${gs.map(g=>{const owner=workspaceOwner(g);const rs=resources.filter(r=>r.goal===g.title&&r.user_id===g.user_id);const progress=rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0;return `<article class="goal-card"><div class="goal-top"><h3>${esc(g.title)}</h3><span class="priority-label">${esc(g.priority)}</span></div><p>${esc(g.description||'')}</p><div class="progress-row"><span>Progress</span><b>${progress}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div class="meta-line"><span>${rs.length} resources</span><span>${esc(owner.name)} · ${esc(owner.role)}</span></div></article>`}).join('')||'<div class="empty-state"><strong>No learner or mentor goals yet</strong><p>Goals will appear here once they create them.</p></div>'}</div></div>`}
function skills(){const ss=visibleWorkspaceRows(skillsData);const adminView=profile?.role==='admin'&&profile?.access_status==='active';return `<div class="page"><div class="page-heading"><div><div class="eyebrow">${adminView?'Learner & mentor workspace':'Capabilities in motion'}</div><h1>Skills</h1><p>${adminView?'All skills across your workspace, including learners and mentors.':'Reusable capabilities compound across every goal.'}</p></div><button class="primary-button" id="add-skill">＋ Add skill</button></div><div class="skill-grid">${ss.map((s,i)=>{const owner=workspaceOwner(s);const rs=resources.filter(r=>r.skills.includes(s.title)&&r.user_id===s.user_id);const progress=rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0;const hours=rs.reduce((a,r)=>a+Number(r.estimated_hours||0)*Number(r.progress||0)/100,0);return `<article class="skill-card"><div class="skill-icon">${['⌁','◈','◫','✦','◒','↗'][i%6]}</div><h3>${esc(s.title)}</h3><p>${esc(s.description||'')}</p><div class="progress-row"><span>Progress</span><b>${progress}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div><div class="meta-line"><span>${rs.length} resources</span><span>${esc(owner.name)} · ${esc(owner.role)}</span></div></article>`}).join('')||'<div class="empty-state"><strong>No learner or mentor skills yet</strong><p>Skills will appear here once they create them.</p></div>'}</div></div>`}
function sprints(){const sps=visibleWorkspaceRows(sprintsData);const adminView=profile?.role==='admin'&&profile?.access_status==='active';return `<div class="page"><div class="page-heading"><div><div class="eyebrow">${adminView?'Learner & mentor workspace':'Focused timeboxes'}</div><h1>Sprints</h1><p>${adminView?'All sprints across your workspace, including learners and mentors.':'Make a small, clear promise for the week.'}</p></div><button class="primary-button" id="add-sprint">＋ Start a sprint</button></div>${sps.map(sp=>{const owner=workspaceOwner(sp);const rs=resources.filter(r=>r.sprint_id===sp.id&&r.user_id===sp.user_id);const progress=rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0;return `<article class="sprint-card"><div class="sprint-card-header"><div><div class="eyebrow">${sp.status==='active'?'Active sprint':'Sprint'} · ${esc(owner.name)} · ${esc(owner.role)}</div><h3>${esc(sp.title)}</h3><div class="sprint-details"><div><strong>${sp.start_date||'—'} – ${sp.end_date||'—'}</strong>Dates</div><div><strong>${rs.length}</strong>Resources</div><div><strong>${rs.reduce((a,r)=>a+Number(r.estimated_hours||0),0).toFixed(1)}h</strong>Learning planned</div></div></div><span class="sprint-status">${esc(sp.status).toUpperCase()}</span></div><div class="progress-row"><span>${rs.filter(r=>r.progress===100).length} completed</span><b>${progress}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div></article>`}).join('')||'<div class="empty-state"><strong>No learner or mentor sprints yet</strong><p>Sprints will appear here once they create them.</p></div>'}</div>`}
function courses(){return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Your learning library</div><h1>Courses & resources</h1><p>Everything you want to learn, in one calm place.</p></div><button class="primary-button" id="add-learning">＋ Add learning</button></div><div class="stats-grid"><div class="stat-card"><span class="stat-label">All resources</span><div class="stat-value">${resources.length}</div><span class="stat-meta">Across 4 goals</span></div><div class="stat-card"><span class="stat-label">Completed</span><div class="stat-value">${resources.filter(r=>r.progress===100).length}</div><span class="stat-meta positive">Keep going</span></div><div class="stat-card"><span class="stat-label">In progress</span><div class="stat-value">${resources.filter(r=>r.column==='in-progress').length}</div><span class="stat-meta">2 due soon</span></div><div class="stat-card"><span class="stat-label">Hours invested</span><div class="stat-value">29<span style="font-size:13px">h</span></div><span class="stat-meta">This quarter</span></div></div><section class="panel list-panel"><div class="table-toolbar"><strong>All resources</strong><button class="filter-button">＋ Filter</button></div><table class="data-table"><thead><tr><th>Resource</th><th>Type</th><th>Status</th><th>Progress</th><th>Owner</th><th>Target date</th></tr></thead><tbody>${resources.map(r=>`<tr data-id="${r.id}"><td><span class="table-title">${esc(r.title)}</span><span class="table-type">${r.provider}</span></td><td>${r.type}</td><td><span class="status-pill ${r.progress===100?'done':r.column==='in-progress'?'progress':''}">${r.status}</span></td><td>${r.progress}%</td><td><span class="avatar avatar-${r.color}">${r.owner}</span></td><td>${r.due}</td></tr>`).join('')}</tbody></table></section></div>`}
function activity(){return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Your learning history</div><h1>Activity</h1><p>Small actions add up to meaningful outcomes.</p></div><button class="primary-button" id="log-activity">＋ Log activity</button></div><div class="activity-list">${activitiesData.length?activitiesData.map((a,i)=>{const r=resources.find(x=>x.id===a.resource_id);const sprint=sprintsData.find(sp=>sp.id===r?.sprint_id);const d=new Date(a.occurred_at);const goal=r?.goal||'No goal';const skill=(r?.skills||[]).join(', ')||'No skill';return `<div class="activity-day">${i===0?'Recent activity':d.toLocaleDateString()}</div><div class="activity-item"><div class="activity-avatar">↗</div><div class="activity-copy"><strong>${esc(user?.email?.split('@')[0]||'You')}</strong> logged <strong>${a.duration_minutes} minutes</strong> of ${esc(r?.title||'learning')}<small>${esc(a.activity_type)} · Sprint: ${esc(sprint?.title||'None')} · Goal: ${esc(goal)} · Skill: ${esc(skill)}${a.notes?' · '+esc(a.notes):''} · ${d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</small></div></div>`}).join(''):'<div class="empty-state"><strong>No activity yet</strong><p>Log your first learning session from a resource.</p></div>'}</div></div>`}
function analytics(){const total=resources.length,completed=resources.filter(r=>r.progress===100).length,inProgress=resources.filter(r=>r.column==='in-progress').length,progress=total?Math.round(resources.reduce((a,r)=>a+r.progress,0)/total):0;const totalMinutes=activitiesData.reduce((a,x)=>a+Number(x.duration_minutes||0),0);const activeDays=new Set(activitiesData.map(x=>new Date(x.occurred_at).toISOString().slice(0,10))).size;const byGoal=goalsData.map(g=>{const rs=resources.filter(r=>r.goal===g.title);return [g.title,rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0]});return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Make progress visible</div><h1>Analytics</h1><p>Understand how your learning is moving, not just where it is.</p></div></div><div class="metric-grid"><div class="metric-card"><span class="stat-label">Overall progress</span><strong>${progress}%</strong><span class="stat-meta">${total} resources</span></div><div class="metric-card"><span class="stat-label">Completion rate</span><strong>${total?Math.round(completed/total*100):0}%</strong><span class="stat-meta">${completed} of ${total} resources</span></div><div class="metric-card"><span class="stat-label">Learning time</span><strong>${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m</strong><span class="stat-meta">Logged activity</span></div><div class="metric-card"><span class="stat-label">Active learning days</span><strong>${activeDays}</strong><span class="stat-meta">Recorded sessions</span></div></div><div class="analytics-grid" style="margin-top:13px"><section class="panel"><div class="panel-header"><h3>Resource status</h3><span class="panel-link">${total} total</span></div><div class="mini-stats" style="justify-content:center;margin:30px 0"><div><strong>${completed}</strong><span>completed</span></div><div><strong>${inProgress}</strong><span>in progress</span></div><div><strong>${total-completed-inProgress}</strong><span>other</span></div></div></section><section class="panel"><div class="panel-header"><h3>Learning time</h3><span class="panel-link">All logged activity</span></div><div class="momentum-score"><strong>${(totalMinutes/60).toFixed(1)}h</strong><small>LOGGED</small></div><p class="momentum-copy">Keep logging sessions to build a useful personal learning history.</p></section></div><section class="panel" style="margin-top:13px"><div class="panel-header"><h3>Progress by goal</h3><span class="panel-link">Live from resources</span></div>${byGoal.map(x=>`<div class="progress-row"><span>${esc(x[0])}</span><b>${x[1]}%</b></div><div class="progress-track" style="margin-bottom:12px"><div class="progress-fill" style="width:${x[1]}%"></div></div>`).join('')||'<div class="empty-state">Create goals and resources to see progress here.</div>'}</section></div>`}
function animateHighlightNumbers(){
  const items=document.querySelectorAll('.stat-value,.metric-card > strong,.momentum-score > strong,.attention-item > strong');
  if(!items.length)return;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  items.forEach(el=>{
    const targetText=el.textContent.trim();
    const match=targetText.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    if(!match)return;
    const target=Number(match[1]);
    const suffix=match[2];
    const decimals=match[1].includes('.')?(match[1].split('.')[1]?.length||1):0;
    if(reduced){el.textContent=target.toFixed(decimals)+suffix;return}
    const start=performance.now();
    const duration=850;
    const ease=t=>1-Math.pow(1-t,3);
    const tick=now=>{
      const progress=Math.min(1,(now-start)/duration);
      const value=target*ease(progress);
      el.textContent=(decimals?value.toFixed(decimals):Math.round(value))+suffix;
      if(progress<1)requestAnimationFrame(tick);
      else el.textContent=target.toFixed(decimals)+suffix;
    };
    el.textContent=(decimals?'0.0':'0')+suffix;
    requestAnimationFrame(tick);
  });
}
function render(){
  if(user&&profile&&profile.access_status!=='active'&&profile.role!=='admin'){root.innerHTML=accessGate();bindEvents();return}
  const views={overview,board,goals,skills,sprints,courses,activity,analytics,admin,login:loginView,'name-setup':nameSetup};
  root.innerHTML=views[currentView]?views[currentView]():overview();
  bindEvents();
  updateNavCounts();
  requestAnimationFrame(animateHighlightNumbers);
}
async function deleteResource(id){
  if(!user||!supa){resources=resources.filter(x=>x.id!=id);return true}
  const {data,error}=await supa.from('resources').delete().eq('id',id).select('id').maybeSingle();
  if(error){console.error(error);toast('Could not delete resource: '+error.message);return false}
  if(!data){toast('Resource could not be deleted');return false}
  resources=resources.filter(x=>x.id!=id);
  return true;
}
function openEditResource(id){
  const r=resources.find(x=>x.id==id);
  if(!r)return;
  const status=r.column||'backlog';
  const skill=r.skills?.[0]||'';
  const sprintOptions=sprintsData.map(sp=>`<option value="${esc(sp.id)}" ${r.sprint_id===sp.id?'selected':''}>${esc(sp.title)}</option>`).join('');
  modal.className='modal';
  modal.innerHTML=`<div class="detail-head"><div><div class="eyebrow">Edit learning</div><h2 class="detail-title">${esc(r.title)}</h2></div><button class="close-button" id="close-modal">×</button></div><form id="edit-resource-form"><div class="form-grid"><div class="field full"><label>What do you want to learn?</label><input name="title" value="${esc(r.title)}" required></div><div class="field"><label>Type</label><select name="type">${['Course','Book','Video','Article','Project','Workshop','Podcast','Other'].map(v=>`<option ${r.type===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Status</label><select name="status">${[['backlog','Backlog'],['planned','Planned'],['in-progress','In Progress'],['practice','Practice / Review'],['completed','Completed']].map(([v,l])=>`<option value="${v}" ${status===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label>Progress</label><input name="progress" type="number" min="0" max="100" value="${Number(r.progress)||0}"></div><div class="field"><label>Priority</label><select name="priority">${['Medium','High','Low'].map(v=>`<option ${r.priority===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Goal</label><input name="goal" value="${esc(r.goal||'')}"></div><div class="field"><label>Skill</label><input name="skill" value="${esc(skill)}"></div><div class="field"><label>Sprint</label><select name="sprint_id"><option value="">No sprint</option>${sprintOptions}</select></div><div class="field"><label>Provider</label><input name="provider" value="${esc(r.provider||'')}"></div><div class="field"><label>Target date</label><input name="due" type="date" value="${r.due_date||''}"></div><div class="field"><label>Estimated hours</label><input name="estimated_hours" type="number" min="0" step="0.25" value="${r.estimated_hours??''}"></div><div class="field full"><label>Notes</label><textarea name="notes" placeholder="Optional notes">${esc(r.notes||'')}</textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>`;
  modalBackdrop.classList.add('open');
  document.getElementById('close-modal').onclick=closeModal;
  modal.querySelectorAll('[data-detail-tab]').forEach(tab=>tab.onclick=()=>{
    modal.querySelectorAll('[data-detail-tab]').forEach(x=>x.classList.toggle('active',x===tab));
    const content=document.getElementById('detail-tab-content');
    if(!content)return;
    content.innerHTML=tab.dataset.detailTab==='activity'?activityRows():tab.dataset.detailTab==='notes'?notesView():historyView();
  });
  document.getElementById('cancel-modal').onclick=closeModal;
  document.getElementById('edit-resource-form').onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const progress=Math.max(0,Math.min(100,Number(f.get('progress'))||0));
    r.title=f.get('title');
    r.type=f.get('type');
    r.provider=f.get('provider')||'Independent';
    r.goal=f.get('goal')||'';
    r.skills=[f.get('skill')||'General'];
    r.sprint_id=f.get('sprint_id')||null;
    r.priority=f.get('priority');
    r.column=f.get('status');
    r.progress=progress;
    r.status=r.column==='completed'?'Completed':r.column==='in-progress'?'In Progress':r.column==='practice'?'Practice / Review':r.column==='planned'?'Planned':'Backlog';
    r.due=f.get('due')||'Not scheduled';
    r.due_date=f.get('due')||null;
    r.estimated_hours=f.get('estimated_hours')?Number(f.get('estimated_hours')):null;
    r.notes=f.get('notes')||null;
    if(await persistResource(r)){closeModal();toast('Learning resource updated');render()}
  };
}
function openResource(id){
  const r=resources.find(x=>x.id==id);
  if(!r)return;
  const activityRows=()=>r.activity?.length?r.activity.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><div><strong>${esc(a.activity_type)}</strong><span style="display:block;color:var(--muted);font-size:10px;margin-top:3px">${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div><span>${Number(a.duration_minutes||0)} min</span></div>`}).join(''):'<div class="empty-state" style="padding:24px">No activity yet. Log a learning session to see it here.</div>';
  const notesView=()=>r.notes?`<div class="detail-notes" style="padding:10px 0;font-size:11px;line-height:1.6;white-space:pre-wrap">${esc(r.notes)}</div>`:'<div class="empty-state" style="padding:24px">No notes yet. Add notes from Edit resource.</div>';
  const historyView=()=>`<div class="detail-history" style="padding:10px 0"><div class="detail-activity-item"><strong>Resource created</strong><span>${r.created_at?new Date(r.created_at).toLocaleString():'—'}</span></div><div class="detail-activity-item"><strong>Last updated</strong><span>${r.updated_at?new Date(r.updated_at).toLocaleString():'—'}</span></div>${r.activity?.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><strong>${esc(a.activity_type)} · ${Number(a.duration_minutes||0)} min</strong><span>${d.toLocaleString()}</span></div>`}).join('')||''}</div>`;
  modal.innerHTML=`<div class="detail-head"><div><div class="detail-type">${esc(r.type)} · ${esc(r.provider)}</div><h2 class="detail-title">${esc(r.title)}</h2><div class="detail-provider">${esc(r.goal||'')}</div></div><button class="close-button" id="close-modal">×</button></div><div class="detail-progress"><div class="progress-caption"><span>Progress</span><b>${r.progress}%</b></div><div class="progress-track"><div class="progress-fill ${r.progress===100?'green':''}" style="width:${r.progress}%"></div></div><div style="display:flex;gap:7px;margin-top:13px"><button class="filter-button" data-progress="${r.id}">+5%</button><button class="filter-button" data-progress="${r.id}">+10%</button><button class="primary-button" style="padding:7px 10px;margin-left:auto" data-complete="${r.id}">Mark complete</button></div></div><div class="detail-meta"><div><span>Status</span><strong>${r.status}</strong></div><div><span>Sprint</span><strong>${esc(sprintsData.find(sp=>sp.id===r.sprint_id)?.title||'None')}</strong></div><div><span>Estimated</span><strong>${r.estimated_hours??'—'} hours</strong></div><div><span>Target date</span><strong>${r.due}</strong></div></div><div class="tag-row">${r.skills.map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div><div class="detail-tabs"><button class="active" data-detail-tab="activity">Activity</button><button data-detail-tab="notes">Notes</button><button data-detail-tab="history">History</button></div><div class="detail-activity" id="detail-tab-content">${activityRows()}</div><div style="display:flex;gap:8px;margin-top:10px"><button class="secondary-button" id="edit-detail" style="flex:1">Edit resource</button><button class="secondary-button" id="log-detail" style="flex:1">＋ Log learning activity</button></div><button class="secondary-button" id="delete-detail" style="width:100%;margin-top:8px;border-color:#e6b4b4;color:#b34a4a">Delete resource</button>`;
  modal.className='modal detail-modal';
  modalBackdrop.classList.add('open');
  document.getElementById('close-modal').onclick=closeModal;
  modal.querySelectorAll('[data-detail-tab]').forEach(tab=>tab.onclick=()=>{modal.querySelectorAll('[data-detail-tab]').forEach(x=>x.classList.toggle('active',x===tab));const content=document.getElementById('detail-tab-content');if(content)content.innerHTML=tab.dataset.detailTab==='activity'?activityRows():tab.dataset.detailTab==='notes'?notesView():historyView()});
  document.getElementById('edit-detail').onclick=()=>openEditResource(r.id);
  document.getElementById('log-detail').onclick=()=>logActivity(r.id);
  document.getElementById('delete-detail').onclick=async()=>{
    if(!confirm(`Delete "${r.title}"? This cannot be undone.`))return;
    if(await deleteResource(r.id)){closeModal();toast('Learning resource deleted');render()}
  };
  modal.querySelectorAll('[data-progress]').forEach(b=>b.onclick=async()=>{
    const amount=Number(b.textContent.replace('+','').replace('%',''));
    r.progress=Math.min(100,r.progress+amount);
    if(r.progress===100){r.column='completed';r.status='Completed'}
    if(await persistResource(r)){toast('Progress updated');openResource(r.id);render()}
  });
  document.querySelector('[data-complete]').onclick=async()=>{
    r.progress=100;r.column='completed';r.status='Completed';
    if(await persistResource(r)){toast('Resource completed');closeModal();render()}
  };
}
function closeModal(){modalBackdrop.classList.remove('open')}
function openAdd(){const sprintOptions=sprintsData.map(sp=>`<option value="${esc(sp.id)}">${esc(sp.title)}</option>`).join('');modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal" style="float:right">×</button><h2>Add learning</h2><p class="modal-subtitle">Capture the next thing you want to learn. You can fill in the details later.</p><form id="resource-form"><div class="form-grid"><div class="field full"><label>What do you want to learn?</label><input name="title" placeholder="e.g. Financial Modeling for Entrepreneurs" required autofocus></div><div class="field"><label>Type</label><select name="type"><option>Course</option><option>Book</option><option>Video</option><option>Article</option><option>Project</option><option>Workshop</option></select></div><div class="field"><label>Priority</label><select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></div><div class="field"><label>Goal</label><select name="goal"><option>Build Business Acumen</option><option>Become Better at AI</option><option>Improve Leadership</option><option>Master Marketing</option></select></div><div class="field"><label>Skill</label><input name="skill" placeholder="e.g. Product Strategy"></div><div class="field"><label>Sprint</label><select name="sprint_id"><option value="">No sprint</option>${sprintOptions}</select></div><div class="field"><label>Provider</label><input name="provider" placeholder="e.g. Coursera"></div><div class="field"><label>Target date</label><input name="due" type="date"></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Add learning</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('resource-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const r={title:f.get('title'),type:f.get('type'),provider:f.get('provider')||'Independent',goal:f.get('goal'),skills:[f.get('skill')||'General'],sprint_id:f.get('sprint_id')||null,status:'Backlog',progress:0,priority:f.get('priority'),due:f.get('due')||'Not scheduled',hours:'0 / —',column:'backlog',owner:'J',color:'blue',activity:[]};if(await persistResource(r)){resources.unshift(r);closeModal();toast(user?'Learning resource synced':'Learning resource added');render()}}}
function openGoalModal(){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Create goal</h2><p class="modal-subtitle">Give your learning a reason to exist.</p><form id="goal-form"><div class="field"><label>Goal name</label><input name="title" required></div><div class="field"><label>Priority</label><select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Create goal</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('goal-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(await createGoal({title:f.get('title'),description:f.get('description')||null,priority:f.get('priority')}))closeModal()}}
function openSkillModal(){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Add skill</h2><form id="skill-form"><div class="field"><label>Skill name</label><input name="title" required></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Add skill</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('skill-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(await createSkill({title:f.get('title'),description:f.get('description')||null}))closeModal()}}
function openSprintModal(){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Start a sprint</h2><form id="sprint-form"><div class="field"><label>Sprint name</label><input name="title" required></div><div class="field"><label>Start date</label><input name="start_date" type="date" required></div><div class="field"><label>End date</label><input name="end_date" type="date" required></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Start sprint</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('sprint-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(await createSprint({title:f.get('title'),start_date:f.get('start_date'),end_date:f.get('end_date'),status:'active'}))closeModal()}}
function logActivity(id){const initialId=id??resources[0]?.id;if(!resources.length){toast('Add a learning resource first');return}const resourceOptions=resources.map(x=>`<option value="${esc(x.id)}" ${String(x.id)===String(initialId)?'selected':''}>${esc(x.title)}</option>`).join('');modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal" style="float:right">×</button><h2>Log learning activity</h2><p class="modal-subtitle">Make the work visible. It only takes a few seconds.</p><form id="activity-form"><div class="form-grid"><div class="field full"><label>Resource</label><select name="resource_id" id="activity-resource">${resourceOptions}</select></div><div class="field"><label>Goal</label><input id="activity-goal" value="" disabled></div><div class="field"><label>Skill</label><input id="activity-skill" value="" disabled></div><div class="field full"><label>Sprint</label><input id="activity-sprint" value="" disabled></div><div class="field"><label>Activity type</label><select name="activity_type"><option>Study</option><option>Watch</option><option>Read</option><option>Practice</option><option>Project</option><option>Revision</option></select></div><div class="field"><label>Duration (minutes)</label><input name="duration" type="number" min="1" required></div><div class="field full"><label>Notes</label><textarea name="notes"></textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save activity</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;const resourceSelect=document.getElementById('activity-resource');const goalInput=document.getElementById('activity-goal');const skillInput=document.getElementById('activity-skill');const sprintInput=document.getElementById('activity-sprint');const syncContext=()=>{const selected=resources.find(x=>String(x.id)===String(resourceSelect.value));const sprint=sprintsData.find(sp=>sp.id===selected?.sprint_id);goalInput.value=selected?.goal||'Not assigned';skillInput.value=(selected?.skills||[]).join(', ')||'Not assigned';sprintInput.value=sprint?.title||'No sprint assigned'};resourceSelect.onchange=syncContext;syncContext();document.getElementById('activity-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const selected=resources.find(x=>String(x.id)===String(f.get('resource_id')));if(!selected){toast('Please select a learning resource');return}const minutes=Math.max(1,Number(f.get('duration'))||0);const {data,error}=await supa.from('activities').insert({resource_id:selected.id,activity_type:f.get('activity_type'),duration_minutes:minutes,notes:f.get('notes')||null}).select().single();if(error){toast('Could not log activity: '+error.message);return}activitiesData.unshift(data);syncResourceActivities();selected.progress=Math.min(100,selected.progress+5);if(selected.progress===100){selected.column='completed';selected.status='Completed'}if(await persistResource(selected)){closeModal();toast('Activity logged · progress +5%');render()}}}

function bindEvents(){
  document.getElementById('refresh-access')?.addEventListener('click',refreshSessionState);
  document.getElementById('name-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!user||!supa)return;
    const f=new FormData(e.target);
    const display_name=String(f.get('display_name')||'').trim();
    if(!display_name){toast('Please enter your name');return}
    const button=e.target.querySelector('button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Saving…'}
    const {data,error}=await supa.from('profiles').update({display_name,name_setup_completed:true}).eq('user_id',user.id).select('*').single();
    if(error){if(button){button.disabled=false;button.textContent='Continue'}console.error(error);toast('Could not save your name: '+error.message);return}
    const {error:authError}=await supa.auth.updateUser({data:{full_name:display_name}});
    if(authError){console.error(authError);if(button){button.disabled=false;button.textContent='Continue'}toast('Your LearnFlow name was saved, but we could not sync the authentication profile. Please try again.');return}
    if(button){button.disabled=false;button.textContent='Continue'}
    profile=data;
    currentView='overview';
    updateRoleUI();
    render();
    toast('Welcome to LearnFlow, '+display_name+'!');
  });
  document.getElementById('login-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const email=String(f.get('email')||'').trim();
    const password=String(f.get('password')||'');
    if(!email)return;
    const button=e.target.querySelector('button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Logging in…'}
    const result=password
      ?await supa.auth.signInWithPassword({email,password})
      :await supa.auth.signInWithOtp({email,options:{emailRedirectTo:AUTH_REDIRECT_URL}});
    if(button){button.disabled=false;button.textContent='Log in'}
    if(result.error){toast(result.error.message);return}
    if(password){
      user=result.data?.user||user;
      await refreshSessionState();
      toast('Signed in successfully.');
    }else{
      toast('Check your email for the LearnFlow login link.');
    }
  });
  document.getElementById('magic-link-login')?.addEventListener('click',async()=>{
    const email=String(document.querySelector('#login-form input[name="email"]')?.value||'').trim();
    if(!email){toast('Enter your email first');document.querySelector('#login-form input[name="email"]')?.focus();return}
    const button=document.getElementById('magic-link-login');
    button.disabled=true;button.textContent='Sending…';
    const {error}=await supa.auth.signInWithOtp({email,options:{emailRedirectTo:AUTH_REDIRECT_URL}});
    button.disabled=false;button.textContent='Send me a magic link';
    toast(error?error.message:'Check your email for the LearnFlow login link.');
  });
  document.getElementById('back-to-demo')?.addEventListener('click',()=>{
    currentView='overview';
    document.getElementById('breadcrumb-current').textContent='Overview';
    render();
  });
  document.querySelectorAll('[data-approve-user]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.approveUser;
    const role=document.querySelector(`[data-role-user="${id}"]`)?.value||'learner';
    const status=document.querySelector(`[data-access-user="${id}"]`)?.value||'active';
    await updateAccess(id,role,status);
  });
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));document.querySelectorAll('[data-view-link]').forEach(b=>b.onclick=()=>setView(b.dataset.viewLink));document.querySelectorAll('.course-card,.data-table tr[data-id]').forEach(c=>c.onclick=()=>openResource(c.dataset.id));
  document.querySelectorAll('.course-card[draggable="true"]').forEach(card=>{
    card.ondragstart=e=>{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',card.dataset.id);card.classList.add('dragging')};
    card.ondragend=()=>card.classList.remove('dragging');
  });
  document.querySelectorAll('.board-column').forEach(column=>{
    column.ondragover=e=>{e.preventDefault();e.dataTransfer.dropEffect='move';column.classList.add('drag-over')};
    column.ondragleave=e=>{if(!column.contains(e.relatedTarget))column.classList.remove('drag-over')};
    column.ondrop=async e=>{
      e.preventDefault();column.classList.remove('drag-over');
      const id=e.dataTransfer.getData('text/plain');const card=resources.find(r=>String(r.id)===String(id));const target=column.dataset.status;
      if(!card||!target||card.column===target)return;
      const previous={column:card.column,status:card.status,progress:card.progress};
      card.column=target;card.status=target==='in-progress'?'In Progress':target==='completed'?'Completed':target==='practice'?'Practice / Review':target==='planned'?'Planned':'Backlog';
      if(target==='completed')card.progress=100;
      render();
      if(await persistResource(card))toast('Moved to '+card.status);else{Object.assign(card,previous);render();toast('Could not move resource')};
    };
  });document.getElementById('add-learning')?.addEventListener('click',openAdd);document.getElementById('log-activity')?.addEventListener('click',()=>logActivity());document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;render()});document.getElementById('add-goal')?.addEventListener('click',openGoalModal);document.getElementById('add-skill')?.addEventListener('click',openSkillModal);document.getElementById('add-sprint')?.addEventListener('click',openSprintModal);}
document.getElementById('auth-button')?.addEventListener('click',authAction);
document.getElementById('theme-toggle').onclick=()=>document.body.classList.toggle('dark');document.getElementById('search-trigger').onclick=()=>{const q=prompt('Search courses, goals, skills or activity');if(q){searchTerm=q;setView('board');toast(`Showing results for “${q}”`)}};document.getElementById('open-search')?.addEventListener('click',()=>document.getElementById('search-trigger').click());modalBackdrop.onclick=e=>{if(e.target===modalBackdrop)closeModal()};initSupabase();
