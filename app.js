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
let deletionRequests=[];
let auditEvents=[];
let preferences={
  weekly_learning_minutes:420,daily_learning_minutes:45,session_length_minutes:45,default_priority:'Medium',
  learning_reminders_enabled:true,sprint_deadline_reminders_enabled:true,overdue_reminders_enabled:true,
  weekly_summary_enabled:true,mentor_feedback_enabled:true,notification_frequency:'daily',notification_time:'09:00',
  theme:'system',reduce_motion:false,browser_notifications_enabled:false,last_notification_at:null
};
let auditClickTrackerAttached=false;
let notificationTimer=null;
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
async function loadDeletionRequests(){if(!supa||profile?.role!=='admin'||profile?.access_status!=='active'){deletionRequests=[];return}const {data,error}=await supa.from('account_deletion_requests').select('*').order('requested_at',{ascending:false});if(error){console.error(error);deletionRequests=[];return}deletionRequests=data||[]}
async function loadPreferences(){
  if(!user||!supa){preferences={...preferences};applyTheme();return}
  const {data,error}=await supa.from('user_preferences').select('*').eq('user_id',user.id).maybeSingle();
  if(error){console.error(error);return}
  if(data)preferences={...preferences,...data};
  else{
    const payload={user_id:user.id,weekly_learning_minutes:420,daily_learning_minutes:45,session_length_minutes:45,default_priority:'Medium'};
    const {data:created,error:createError}=await supa.from('user_preferences').insert(payload).select().single();
    if(!createError&&created)preferences={...preferences,...created};
  }
  applyTheme();
}
async function savePreferences(patch){
  if(!user||!supa)return false;
  const payload={user_id:user.id,...patch};
  const {data,error}=await supa.from('user_preferences').upsert(payload).select().single();
  if(error){toast('Could not save preferences: '+error.message);return false}
  preferences={...preferences,...data};
  applyTheme();
  return true;
}
async function loadAuditEvents(){
  if(!user||!supa){auditEvents=[];return}
  const {data,error}=await supa.from('audit_events').select('*').order('occurred_at',{ascending:false}).limit(300);
  if(error){console.error(error);auditEvents=[];return}
  auditEvents=data||[];
}
async function trackAudit(action,targetType=null,targetId=null,metadata={}){
  if(!user||!supa)return;
  const {data,error}=await supa.from('audit_events').insert({
    user_id:user.id,action,target_type:targetType,target_id:targetId?String(targetId):null,
    metadata:{...metadata,page:currentView,url:window.location.pathname}
  }).select().single();
  if(!error&&data)auditEvents.unshift(data);
}
function applyTheme(){
  const theme=preferences.theme||'system';
  const systemDark=theme==='system'&&window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark=theme==='dark'||systemDark;
  document.body.classList.toggle('dark',dark);
  document.body.classList.toggle('light-theme',!dark);
  const toggle=document.getElementById('theme-toggle');
  if(toggle)toggle.textContent=theme==='dark'?'☀':theme==='light'?'☾':'◐';
}
function minutesUntil(date){return Math.round((date-Date.now())/60000)}
function shouldSendScheduledNotification(now){
  if(!preferences.browser_notifications_enabled||preferences.notification_frequency==='off')return false;
  if(!('Notification' in window)||Notification.permission!=='granted')return false;
  const last=preferences.last_notification_at?new Date(preferences.last_notification_at):null;
  const frequency=preferences.notification_frequency;
  if(last){
    const elapsed=(now-last)/60000;
    if(frequency==='hourly'&&elapsed<60)return false;
    if(frequency==='daily'&&elapsed<1440)return false;
    if(frequency==='weekly'&&elapsed<10080)return false;
    if(frequency==='immediate'&&elapsed<15)return false;
  }
  if(frequency==='immediate'||frequency==='hourly')return true;
  const [hh,mm]=String(preferences.notification_time||'09:00').split(':').map(Number);
  const currentMinutes=now.getHours()*60+now.getMinutes();
  const target=hh*60+mm;
  if(Math.abs(currentMinutes-target)>2)return false;
  if(frequency==='weekly'&&now.getDay()!==1)return false;
  return true;
}
async function checkNotifications(){
  if(!user||!supa||!preferences.browser_notifications_enabled)return;
  const now=new Date();
  if(!shouldSendScheduledNotification(now))return;
  const overdue=preferences.overdue_reminders_enabled?resources.filter(r=>r.due_date&&new Date(r.due_date)<now&&Number(r.progress)<100).length:0;
  const currentSprint=sprintsData.find(sp=>sp.status==='active');
  const sprintSoon=preferences.sprint_deadline_reminders_enabled&&currentSprint?.end_date
    ?minutesUntil(new Date(currentSprint.end_date+'T23:59:59'))<=2880&&minutesUntil(new Date(currentSprint.end_date+'T23:59:59'))>=0:false;
  const noActivityToday=preferences.learning_reminders_enabled&&!activitiesData.some(a=>{const d=new Date(a.occurred_at);return d.toDateString()===now.toDateString()});
  const weeklySummary=preferences.weekly_summary_enabled&&preferences.notification_frequency==='weekly';
  let title='LearnFlow reminder',body='';
  if(overdue)body=overdue+' overdue learning item'+(overdue===1?'':'s')+' need your attention.';
  else if(sprintSoon)body='Your current sprint is nearing its deadline.';
  else if(noActivityToday)body='You have not logged a learning session today.';
  else if(weeklySummary)body=`This week: ${activitiesData.length} learning sessions logged across your workspace.`;
  else return;
  const notification=new Notification(title,{body});
  notification.onclick=()=>window.focus();
  await supa.from('user_preferences').update({last_notification_at:now.toISOString()}).eq('user_id',user.id);
  preferences.last_notification_at=now.toISOString();
  await trackAudit('notification_sent','notification',null,{title,body});
}
function startNotificationScheduler(){
  if(notificationTimer)clearInterval(notificationTimer);
  notificationTimer=setInterval(checkNotifications,60000);
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
async function createGoal(payload){const {data,error}=await supa.from('goals').insert(payload).select().single();if(error){toast('Could not create goal: '+error.message);return null}goalsData.push(data);await trackAudit('goal_created','goal',data.id,{title:data.title});toast('Goal created');render();return data}
async function createSkill(payload){const {data,error}=await supa.from('skills').insert(payload).select().single();if(error){toast('Could not add skill: '+error.message);return null}skillsData.push(data);await trackAudit('skill_created','skill',data.id,{title:data.title});toast('Skill added');render();return data}
async function createSprint(payload){const {data,error}=await supa.from('sprints').insert(payload).select().single();if(error){toast('Could not create sprint: '+error.message);return false}sprintsData.unshift(data);await trackAudit('sprint_created','sprint',data.id,{title:data.title});toast('Sprint created');render();return true}

function syncResourceActivities(){
  resources.forEach(r=>{
    r.activity=activitiesData
      .filter(a=>String(a.resource_id)===String(r.id))
      .sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at));
  });
}
async function persistResource(r){
  if(!user||!supa)return true;
  const isNew=!r.id;
  const payload={title:r.title,type:r.type,provider:r.provider||'Independent',goal:r.goal||null,skills:r.skills||[],status:r.column||'backlog',progress:r.progress||0,priority:r.priority||'Medium',due_date:r.due&&r.due!=='Not scheduled'?r.due:null,estimated_hours:r.estimated_hours??null,notes:r.notes||null,owner_label:user.email?.split('@')[0]||null,sprint_id:r.sprint_id||null};
  if(typeof r.id==='string')payload.id=r.id;
  const {data,error}=await supa.from('resources').upsert(payload).select().single();
  if(error){console.error(error);toast('Could not save resource: '+error.message);return false}
  Object.assign(r,toUiResource(data));
  await trackAudit(isNew?'resource_created':'resource_saved','resource',data.id,{title:data.title,status:data.status,progress:data.progress});
  return true;
}

async function initSupabase(){
  render();
  try{
    const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
    supa=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    const {data,error}=await supa.auth.getUser();
    if(!error)user=data.user||null;
    await refreshSessionState();
    supa.auth.onAuthStateChange(async(event,session)=>{
      user=session?.user||null;
      await refreshSessionState();
      if(event==='SIGNED_IN'&&user)await trackAudit('login','auth',user.id,{email:user.email});
      if(event==='SIGNED_OUT')render();
    });
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
  await loadDeletionRequests();
  await loadPreferences();
  await loadAuditEvents();
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
  startNotificationScheduler();
}
function updateAuthButton(){const b=document.getElementById('auth-button');if(b)b.textContent=user?'Log out':'Log in';}
function updateRoleUI(){
  const adminNav=document.getElementById('admin-nav');
  if(adminNav)adminNav.style.display=profile?.role==='admin'&&profile?.access_status==='active'?'flex':'none';
  const workspace=document.getElementById('sidebar-workspace');
  if(workspace)workspace.style.display=user?'block':'none';
  const roleLabel=document.getElementById('user-role-label');
  if(roleLabel)roleLabel.textContent=profile?.role?profile.role[0].toUpperCase()+profile.role.slice(1):'Guest';
  const displayName=profile?.display_name||user?.user_metadata?.full_name||user?.email?.split('@')[0]||'Guest';
  const userName=document.getElementById('user-name');
  if(userName)userName.textContent=displayName;
  const initial=(displayName.trim().charAt(0)||'G').toUpperCase();
  document.querySelectorAll('[data-user-avatar]').forEach(avatar=>{avatar.textContent=initial;avatar.setAttribute('aria-label',displayName+' avatar')});
}
async function requestAccountDeletion(){if(!user||!supa)return;const {data:existing}=await supa.from('account_deletion_requests').select('id,status').eq('user_id',user.id).eq('status','pending').maybeSingle();if(existing){toast('Your delete request is already with an Admin');return}const {error}=await supa.from('account_deletion_requests').insert({user_id:user.id});if(error){toast('Could not send delete request: '+error.message);return}toast('Delete request sent to Admin');}async function authAction(){
  if(user){await trackAudit('logout','auth',user.id,{email:user.email});const {error}=await supa.auth.signOut();if(error)toast(error.message);return}
  currentView='login';
  document.querySelectorAll('.nav-item[data-view],.mobile-nav button[data-view]').forEach(b=>b.classList.remove('active'));
  const breadcrumb=document.getElementById('breadcrumb-current');
  if(breadcrumb)breadcrumb.textContent='Log in';
  render();
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function setView(view){if(view==='admin'&&!(profile?.role==='admin'&&profile?.access_status==='active'))return;if(view==='settings'&&!user)return;currentView=view;document.querySelectorAll('.nav-item[data-view],.mobile-nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.getElementById('breadcrumb-current').textContent=view==='board'?'Learning Board':view[0].toUpperCase()+view.slice(1);render()}
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
function settings(){
  const weeklyOptions=Array.from({length:30},(_,i)=>{const m=(i+1)*60;return `<option value="${m}" ${Number(preferences.weekly_learning_minutes)===m?'selected':''}>${i+1} hour${i?'s':''}</option>`}).join('');
  const minuteOptions=Array.from({length:12},(_,i)=>{const m=(i+1)*15;return `<option value="${m}" ${Number(preferences.daily_learning_minutes)===m?'selected':''}>${m} minutes</option>`}).join('');
  const sessionOptions=Array.from({length:12},(_,i)=>{const m=(i+1)*15;return `<option value="${m}" ${Number(preferences.session_length_minutes)===m?'selected':''}>${m} minutes</option>`}).join('');
  const permission=('Notification' in window)?Notification.permission:'unsupported';
  return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Your LearnFlow</div><h1>Settings</h1><p>Control your learning pace, notifications, privacy and account preferences.</p></div></div>
<section class="panel settings-panel"><div class="panel-header"><h3>Profile</h3></div><form id="settings-profile-form"><div class="form-grid"><div class="field"><label>Preferred name</label><input name="display_name" value="${esc(profile?.display_name||'')}" required></div><div class="field"><label>Email</label><input value="${esc(user?.email||'')}" disabled></div></div><div class="modal-actions"><button class="primary-button">Save profile</button></div></form></section>
<section class="panel settings-panel"><div class="panel-header"><h3>Learning preferences</h3></div><form id="learning-preferences-form"><div class="settings-grid">
<div class="setting-row"><div><strong>Weekly learning target</strong><small>Set your weekly learning goal from 1 to 30 hours.</small></div><select name="weekly_learning_minutes">${weeklyOptions}</select></div>
<div class="setting-row"><div><strong>Daily learning target</strong><small>Choose a daily commitment from 15 to 180 minutes.</small></div><select name="daily_learning_minutes">${minuteOptions}</select></div>
<div class="setting-row"><div><strong>Preferred session length</strong><small>Your usual learning block, up to 180 minutes.</small></div><select name="session_length_minutes">${sessionOptions}</select></div>
<div class="setting-row"><div><strong>Default priority</strong><small>Used when creating new learning resources.</small></div><select name="default_priority"><option ${preferences.default_priority==='Low'?'selected':''}>Low</option><option ${preferences.default_priority==='Medium'?'selected':''}>Medium</option><option ${preferences.default_priority==='High'?'selected':''}>High</option></select></div>
</div><div class="modal-actions"><button class="primary-button">Save learning preferences</button></div></form></section>
<section class="panel settings-panel"><div class="panel-header"><div><h3>Notifications</h3><p class="settings-copy">Choose what LearnFlow can remind you about and how often.</p></div></div>
<form id="notification-preferences-form"><div class="settings-list">
<label><span>Learning reminders</span><input name="learning_reminders_enabled" type="checkbox" ${preferences.learning_reminders_enabled?'checked':''}></label>
<label><span>Sprint deadline reminders</span><input name="sprint_deadline_reminders_enabled" type="checkbox" ${preferences.sprint_deadline_reminders_enabled?'checked':''}></label>
<label><span>Overdue learning reminders</span><input name="overdue_reminders_enabled" type="checkbox" ${preferences.overdue_reminders_enabled?'checked':''}></label>
<label><span>Weekly learning summary</span><input name="weekly_summary_enabled" type="checkbox" ${preferences.weekly_summary_enabled?'checked':''}></label>
<label><span>Mentor feedback notifications</span><input name="mentor_feedback_enabled" type="checkbox" ${preferences.mentor_feedback_enabled?'checked':''}></label>
<div class="setting-row"><div><strong>Notification frequency</strong><small>How often LearnFlow may send a reminder when one is due.</small></div><select name="notification_frequency"><option value="immediate" ${preferences.notification_frequency==='immediate'?'selected':''}>Immediately</option><option value="hourly" ${preferences.notification_frequency==='hourly'?'selected':''}>At most once an hour</option><option value="daily" ${preferences.notification_frequency==='daily'?'selected':''}>Once a day</option><option value="weekly" ${preferences.notification_frequency==='weekly'?'selected':''}>Once a week</option><option value="off" ${preferences.notification_frequency==='off'?'selected':''}>Off</option></select></div>
<div class="setting-row"><div><strong>Preferred notification time</strong><small>Used for daily and weekly reminders.</small></div><input name="notification_time" type="time" value="${esc(preferences.notification_time||'09:00')}"></div>
<label><span>Browser notifications</span><input name="browser_notifications_enabled" type="checkbox" ${preferences.browser_notifications_enabled?'checked':''}></label>
</div><div class="settings-actions"><button type="button" class="secondary-button" id="request-notification-permission">Enable browser notifications</button><button class="primary-button">Save notification settings</button></div><p class="settings-note">Browser notifications require permission. LearnFlow currently checks scheduled reminders while the app is open; true background push when the browser is closed requires a push service.</p><p class="settings-note">Permission status: <strong>${permission}</strong></p></form></section>
<section class="panel settings-panel"><div class="panel-header"><h3>Privacy & visibility</h3></div><p class="settings-copy">You control your own learner data. Your Mentor can access the learner information permitted by LearnFlow's role model. Administrators can access workspace information for platform management.</p></section>
<section class="panel settings-panel"><div class="panel-header"><h3>Appearance & accessibility</h3></div><form id="appearance-preferences-form"><div class="settings-list"><label><span>Theme</span><select name="theme"><option value="system" ${preferences.theme==='system'?'selected':''}>System</option><option value="light" ${preferences.theme==='light'?'selected':''}>Light</option><option value="dark" ${preferences.theme==='dark'?'selected':''}>Dark</option></select></label><label><span>Reduce motion</span><input name="reduce_motion" type="checkbox" ${preferences.reduce_motion?'checked':''}></label></div><div class="modal-actions"><button class="primary-button">Save appearance</button></div></form></section>
<section class="panel settings-panel danger-panel"><div class="panel-header"><h3>Account</h3></div><div class="settings-actions"><button class="secondary-button" id="settings-signout">Sign out</button><button class="danger-button" id="settings-delete-request">Request account deletion</button></div><p class="settings-note">Account deletion is reviewed by an Admin. Your account will not be deleted immediately.</p></section>
</div>`;
}
function admin(){
  const rows=profiles.map(p=>`<tr>
    <td><strong>${esc(p.display_name||'Unnamed user')}</strong><span class="table-type">${esc(p.user_id)}</span></td>
    <td><span class="status-pill ${p.access_status==='active'?'done':p.access_status==='pending'?'practice':''}">${esc(p.access_status)}</span></td>
    <td><select data-role-user="${p.user_id}" ${p.user_id===user?.id?'disabled':''}><option value="learner" ${p.role==='learner'?'selected':''}>Learner</option><option value="mentor" ${p.role==='mentor'?'selected':''}>Mentor</option><option value="admin" ${p.role==='admin'?'selected':''}>Admin</option></select></td>
    <td><select data-access-user="${p.user_id}" ${p.user_id===user?.id?'disabled':''}><option value="pending" ${p.access_status==='pending'?'selected':''}>Pending</option><option value="active" ${p.access_status==='active'?'selected':''}>Active</option><option value="suspended" ${p.access_status==='suspended'?'selected':''}>Suspended</option><option value="rejected" ${p.access_status==='rejected'?'selected':''}>Rejected</option></select></td>
    <td>${p.user_id===user?.id?'<span class="stat-meta">You</span>':`<button class="secondary-button" style="padding:6px 9px" data-approve-user="${p.user_id}">${p.access_status==='active'?'Update':'Approve'}</button>`}</td>
  </tr>`).join('');
  const requests=deletionRequests.filter(x=>x.status==='pending');
  return `<div class="page"><div class="page-heading"><div><div class="eyebrow">Workspace administration</div><h1>User access</h1><p>Approve users, assign roles, and review account deletion requests.</p></div></div><section class="panel list-panel"><div class="table-toolbar"><strong>${profiles.length} users</strong><span class="stat-meta">Access is enforced by Supabase RLS</span></div><table class="data-table"><thead><tr><th>User</th><th>Status</th><th>Role</th><th>Access</th><th>Action</th></tr></thead><tbody>${rows||'<tr><td colspan="5">No users yet.</td></tr>'}</tbody></table></section><section class="panel list-panel" style="margin-top:13px"><div class="table-toolbar"><strong>Account deletion requests</strong><span class="stat-meta">${requests.length} pending</span></div><table class="data-table"><thead><tr><th>User</th><th>Requested</th><th>Status</th></tr></thead><tbody>${requests.map(x=>{const p=profiles.find(y=>y.user_id===x.user_id);return `<tr><td><strong>${esc(p?.display_name||'Unnamed user')}</strong><span class="table-type">${esc(x.user_id)}</span></td><td>${new Date(x.requested_at).toLocaleString()}</td><td><span class="status-pill practice">Pending review</span></td></tr>`}).join('')||'<tr><td colspan="3">No pending deletion requests.</td></tr>'}</tbody></table></section></div>`;

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
function canManageWorkspaceRow(row){return !!user&&(profile?.role==='admin'&&profile?.access_status==='active'||row?.user_id===user.id)}
async function openEditGoal(id){const g=goalsData.find(x=>String(x.id)===String(id));if(!g)return;modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Edit goal</h2><form id="edit-goal-form"><div class="field"><label>Goal name</label><input name="title" value="${esc(g.title)}" required></div><div class="field"><label>Priority</label><select name="priority"><option ${g.priority==='Low'?'selected':''}>Low</option><option ${g.priority==='Medium'?'selected':''}>Medium</option><option ${g.priority==='High'?'selected':''}>High</option></select></div><div class="field"><label>Description</label><textarea name="description">${esc(g.description||'')}</textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('edit-goal-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {data,error}=await supa.from('goals').update({title:String(f.get('title')).trim(),priority:String(f.get('priority')),description:String(f.get('description')||'').trim()||null}).eq('id',g.id).select().single();if(error){toast('Could not update goal: '+error.message);return}Object.assign(g,data);await trackAudit('goal_updated','goal',g.id,{title:g.title});closeModal();toast('Goal updated');render()}}
async function deleteGoal(id){const g=goalsData.find(x=>String(x.id)===String(id));if(!g||!canManageWorkspaceRow(g)||!supa)return;if(!confirm('Delete goal '+JSON.stringify(g.title)+'? Resources linked to this goal will remain, but the goal itself will be removed.'))return;const {data,error}=await supa.from('goals').delete().eq('id',g.id).select('id').maybeSingle();if(error){toast('Could not delete goal: '+error.message);return}if(!data){toast('Goal could not be deleted. Check your access and try again.');return}goalsData=goalsData.filter(x=>String(x.id)!==String(id));await trackAudit('goal_deleted','goal',id,{title:g.title});toast('Goal deleted');render()}
async function openEditSkill(id){
  const s=skillsData.find(x=>String(x.id)===String(id));if(!s)return;
  modal.className='modal';
  modal.innerHTML='<button class="close-button" id="close-modal">×</button><h2>Edit skill</h2><form id="edit-skill-form"><div class="field"><label>Skill name</label><input name="title" value="'+esc(s.title)+'" required></div><div class="field"><label>Description</label><textarea name="description">'+esc(s.description||'')+'</textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>';
  modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;
  document.getElementById('edit-skill-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {data,error}=await supa.from('skills').update({title:String(f.get('title')).trim(),description:String(f.get('description')||'').trim()||null}).eq('id',s.id).select().single();if(error){toast('Could not update skill: '+error.message);return}Object.assign(s,data);await trackAudit('skill_updated','skill',s.id,{title:s.title});closeModal();toast('Skill updated');render()}
}
async function deleteSkill(id){
  const s=skillsData.find(x=>String(x.id)===String(id));if(!s||!canManageWorkspaceRow(s))return;
  if(!confirm('Delete skill '+JSON.stringify(s.title)+'? Existing learning resources will keep their saved skill text.'))return;
  if(!supa){toast('Connect to your workspace to delete skills');return}
  const {data,error}=await supa.from('skills').delete().eq('id',s.id).select('id').maybeSingle();if(error){toast('Could not delete skill: '+error.message);return}
  if(!data){toast('Skill could not be deleted. Check your access and try again.');return}
  skillsData=skillsData.filter(x=>String(x.id)!==String(id));await trackAudit('skill_deleted','skill',id,{title:s.title});toast('Skill deleted');render()
}
async function openEditSprint(id){
  const sp=sprintsData.find(x=>String(x.id)===String(id));if(!sp)return;
  modal.className='modal';
  modal.innerHTML='<button class="close-button" id="close-modal">×</button><h2>Edit sprint</h2><form id="edit-sprint-form"><div class="field"><label>Sprint name</label><input name="title" value="'+esc(sp.title)+'" required></div><div class="field"><label>Start date</label><input name="start_date" type="date" value="'+esc(sp.start_date||'')+'" required></div><div class="field"><label>End date</label><input name="end_date" type="date" value="'+esc(sp.end_date||'')+'" required></div><div class="field"><label>Status</label><select name="status"><option value="planned" '+(sp.status==='planned'?'selected':'')+'>planned</option><option value="active" '+(sp.status==='active'?'selected':'')+'>active</option><option value="completed" '+(sp.status==='completed'?'selected':'')+'>completed</option><option value="archived" '+(sp.status==='archived'?'selected':'')+'>archived</option></select></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>';
  modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;
  document.getElementById('edit-sprint-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const {data,error}=await supa.from('sprints').update({title:String(f.get('title')).trim(),start_date:f.get('start_date'),end_date:f.get('end_date'),status:String(f.get('status'))}).eq('id',sp.id).select().single();if(error){toast('Could not update sprint: '+error.message);return}Object.assign(sp,data);await trackAudit('sprint_updated','sprint',sp.id,{title:sp.title});closeModal();toast('Sprint updated');render()}
}
async function deleteSprint(id){
  const sp=sprintsData.find(x=>String(x.id)===String(id));if(!sp||!canManageWorkspaceRow(sp))return;
  if(!confirm('Delete sprint '+JSON.stringify(sp.title)+'? Resources assigned to it will become unassigned.'))return;
  if(!supa){toast('Connect to your workspace to delete sprints');return}
  const {data,error}=await supa.from('sprints').delete().eq('id',sp.id).select('id').maybeSingle();if(error){toast('Could not delete sprint: '+error.message);return}
  if(!data){toast('Sprint could not be deleted. Check your access and try again.');return}
  sprintsData=sprintsData.filter(x=>String(x.id)!==String(id));await trackAudit('sprint_deleted','sprint',id,{title:sp.title});toast('Sprint deleted');render()
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
function goals(){
  const gs=visibleWorkspaceRows(goalsData);
  const adminView=profile?.role==='admin'&&profile?.access_status==='active';
  const cards=gs.map(g=>{
    const owner=workspaceOwner(g);
    const rs=resources.filter(r=>r.goal===g.title&&r.user_id===g.user_id);
    const progress=rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0;
    const actions=canManageWorkspaceRow(g)
      ? '<div class="settings-actions" style="margin-top:12px"><button class="secondary-button" data-edit-goal="'+esc(g.id)+'">Edit</button><button class="danger-button" data-delete-goal="'+esc(g.id)+'">Delete</button></div>'
      : '';
    return '<article class="goal-card"><div class="goal-top"><h3>'+esc(g.title)+'</h3><span class="priority-label">'+esc(g.priority)+'</span></div><p>'+esc(g.description||'')+'</p><div class="progress-row"><span>Progress</span><b>'+progress+'%</b></div><div class="progress-track"><div class="progress-fill" style="width:'+progress+'%"></div></div><div class="meta-line"><span>'+rs.length+' resources</span><span>'+esc(owner.name)+' · '+esc(owner.role)+'</span></div>'+actions+'</article>';
  }).join('');
  if(!cards) return '<div class="page"><div class="empty-state"><strong>No learner or mentor goals yet</strong><p>Goals will appear here once they create them.</p></div></div>';
  return '<div class="page"><div class="page-heading"><div><div class="eyebrow">'+(adminView?'Learner & mentor workspace':'Direction before action')+'</div><h1>Goals</h1><p>'+(adminView?'All goals across your workspace, including learners and mentors.':'Give your learning a reason to exist.')+'</p></div><button class="primary-button" id="add-goal">＋ Create goal</button></div><div class="goal-grid">'+cards+'</div></div>';
}
function skills(){
  const ss=visibleWorkspaceRows(skillsData);
  const adminView=profile?.role==='admin'&&profile?.access_status==='active';
  const cards=ss.map((s,i)=>{
    const owner=workspaceOwner(s);const rs=resources.filter(r=>r.skills.includes(s.title)&&r.user_id===s.user_id);const progress=rs.length?Math.round(rs.reduce((a,r)=>a+r.progress,0)/rs.length):0;
    const actions=canManageWorkspaceRow(s)?'<div class="settings-actions" style="margin-top:12px"><button class="secondary-button" data-edit-skill="'+esc(s.id)+'">Edit</button><button class="danger-button" data-delete-skill="'+esc(s.id)+'">Delete</button></div>':'';
    return '<article class="skill-card"><div class="skill-icon">'+['⌁','◈','◫','✦','◒','↗'][i%6]+'</div><h3>'+esc(s.title)+'</h3><p>'+esc(s.description||'')+'</p><div class="progress-row"><span>Progress</span><b>'+progress+'%</b></div><div class="progress-track"><div class="progress-fill" style="width:'+progress+'%"></div></div><div class="meta-line"><span>'+rs.length+' resources</span><span>'+esc(owner.name)+' · '+esc(owner.role)+'</span></div>'+actions+'</article>';
  }).join('');
  return '<div class="page"><div class="page-heading"><div><div class="eyebrow">'+(adminView?'Learner & mentor workspace':'Capabilities in motion')+'</div><h1>Skills</h1><p>'+(adminView?'All skills across your workspace, including learners and mentors.':'Reusable capabilities compound across every goal.')+'</p></div><button class="primary-button" id="add-skill">＋ Add skill</button></div><div class="skill-grid">'+(cards||'<div class="empty-state"><strong>No learner or mentor skills yet</strong><p>Skills will appear here once they create them.</p></div>')+'</div></div>';
}
function sprints(){
  const sps=visibleWorkspaceRows(sprintsData);const adminView=profile?.role==='admin'&&profile?.access_status==='active';
  const cards=sps.map(sp=>{const owner=workspaceOwner(sp);const rs=resources.filter(r=>r.sprint_id===sp.id&&r.user_id===sp.user_id);const progress=rs.length?Math.round(rs.reduce((a,r)=>a+Number(r.progress||0),0)/rs.length):0;const actions=canManageWorkspaceRow(sp)?'<div class="settings-actions" style="margin-top:12px"><button class="secondary-button" data-edit-sprint="'+esc(sp.id)+'">Edit</button><button class="danger-button" data-delete-sprint="'+esc(sp.id)+'">Delete</button></div>':'';
    return '<article class="sprint-card"><div class="sprint-card-header"><div><div class="eyebrow">'+(sp.status==='active'?'Active sprint':'Sprint')+' · '+esc(owner.name)+' · '+esc(owner.role)+'</div><h3>'+esc(sp.title)+'</h3><div class="sprint-details"><div><strong>'+esc(sp.start_date||'—')+' – '+esc(sp.end_date||'—')+'</strong>Dates</div><div><strong>'+rs.length+'</strong>Resources</div><div><strong>'+rs.reduce((a,r)=>a+Number(r.estimated_hours||0),0).toFixed(1)+'h</strong>Learning planned</div></div></div><span class="sprint-status">'+esc(sp.status).toUpperCase()+'</span></div><div class="progress-row"><span>'+rs.filter(r=>r.progress===100).length+' completed</span><b>'+progress+'%</b></div><div class="progress-track"><div class="progress-fill" style="width:'+progress+'%"></div></div>'+actions+'</article>';
  }).join('');
  return '<div class="page"><div class="page-heading"><div><div class="eyebrow">'+(adminView?'Learner & mentor workspace':'Focused timeboxes')+'</div><h1>Sprints</h1><p>'+(adminView?'All sprints across your workspace, including learners and mentors.':'Make a small, clear promise for the week.')+'</p></div><button class="primary-button" id="add-sprint">＋ Start a sprint</button></div>'+(cards||'<div class="empty-state"><strong>No learner or mentor sprints yet</strong><p>Sprints will appear here once they create them.</p></div>')+'</div>';
}
function courses(){
  const rows=resources.map(r=>'<tr data-id="'+esc(r.id)+'"><td><span class="table-title">'+esc(r.title)+'</span><span class="table-type">'+esc(r.provider)+'</span></td><td>'+esc(r.type)+'</td><td><span class="status-pill '+(r.progress===100?'done':r.column==='in-progress'?'progress':'')+'">'+esc(r.status)+'</span></td><td>'+r.progress+'%</td><td>'+(r.goal?esc(r.goal):'<span class="stat-meta">Not linked</span>')+'</td><td><span class="owner-name">'+esc(r.ownerName||'Learner')+'</span></td><td>'+esc(r.due)+'</td></tr>').join('');
  return '<div class="page"><div class="page-heading"><div><div class="eyebrow">Your learning library</div><h1>Courses & resources</h1><p>Everything you have added to LearnFlow, with the goal connection visible when one exists.</p></div></div><section class="panel list-panel"><div class="table-toolbar"><strong>All resources</strong><span class="stat-meta">'+resources.length+' resources</span></div><table class="data-table"><thead><tr><th>Resource</th><th>Type</th><th>Status</th><th>Progress</th><th>Goal</th><th>Owner</th><th>Target date</th></tr></thead><tbody>'+(rows||'<tr><td colspan="7">No learning resources yet.</td></tr>')+'</tbody></table></section></div>';
}
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
  if(!root)return;
  const views={overview,board,goals,skills,sprints,courses,activity,analytics,admin,settings,login:loginView,'name-setup':nameSetup};
  try{
    if(user&&profile&&profile.access_status!=='active'&&profile.role!=='admin'){
      root.innerHTML=accessGate();
    }else{
      const viewRenderer=views[currentView]||overview;
      root.innerHTML=viewRenderer();
    }
  }catch(error){
    console.error('LearnFlow view render failed:',error);
    currentView='overview';
    try{root.innerHTML=overview()}catch(fallbackError){
      console.error('LearnFlow overview fallback failed:',fallbackError);
      root.innerHTML='<div class="page"><div class="empty-state"><strong>LearnFlow is recovering</strong><p>Please refresh this page. Your saved workspace data is not affected.</p><button class="primary-button" id="recover-app">Refresh LearnFlow</button></div></div>';
    }
  }
  try{bindEvents()}catch(error){console.error('LearnFlow event binding failed:',error)}
  try{updateNavCounts()}catch(error){console.error('LearnFlow navigation count update failed:',error)}
  requestAnimationFrame(()=>{try{animateHighlightNumbers()}catch(error){console.error('LearnFlow number animation failed:',error)}});
  const recover=document.getElementById('recover-app');
  if(recover)recover.onclick=()=>window.location.reload();
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
  const goalValues=[...new Set([...goalsData.map(g=>g.title),r.goal||''].filter(Boolean))];
  const skillValues=[...new Set([...skillsData.map(s=>s.title),skill||''].filter(Boolean))];
  const goalOptions=goalValues.map(g=>`<option value="${esc(g)}" ${r.goal===g?'selected':''}>${esc(g)}</option>`).join('');
  const skillOptions=skillValues.map(s=>`<option value="${esc(s)}" ${skill===s?'selected':''}>${esc(s)}</option>`).join('');
  const sprintOptions=sprintsData.map(sp=>`<option value="${esc(sp.id)}" ${r.sprint_id===sp.id?'selected':''}>${esc(sp.title)}</option>`).join('');
  modal.className='modal';
  modal.innerHTML=`<div class="detail-head"><div><div class="eyebrow">Edit learning</div><h2 class="detail-title">${esc(r.title)}</h2></div><button class="close-button" id="close-modal">×</button></div><form id="edit-resource-form"><div class="form-grid"><div class="field full"><label>What do you want to learn?</label><input name="title" value="${esc(r.title)}" required></div><div class="field"><label>Type</label><select name="type">${['Course','Book','Video','Article','Project','Workshop','Podcast','Other'].map(v=>`<option ${r.type===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Status</label><select name="status">${[['backlog','Backlog'],['planned','Planned'],['in-progress','In Progress'],['practice','Practice / Review'],['completed','Completed']].map(([v,l])=>`<option value="${v}" ${status===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label>Progress</label><input name="progress" type="number" min="0" max="100" value="${Number(r.progress)||0}"></div><div class="field"><label>Priority</label><select name="priority">${['Medium','High','Low'].map(v=>`<option ${r.priority===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Goal</label><select name="goal" id="edit-goal-select">${goalOptions}<option value="__create_goal__">＋ Create new goal</option></select></div><div class="field"><label>Skill</label><select name="skill" id="edit-skill-select">${skillOptions}<option value="__create_skill__">＋ Create new skill</option></select></div><div class="field"><label>Sprint</label><select name="sprint_id"><option value="">No sprint</option>${sprintOptions}</select></div><div class="field"><label>Provider</label><input name="provider" value="${esc(r.provider||'')}"></div><div class="field"><label>Target date</label><input name="due" type="date" value="${r.due_date||''}"></div><div class="field"><label>Estimated hours</label><input name="estimated_hours" type="number" min="0" step="0.25" value="${r.estimated_hours??''}"></div><div class="field full"><label>Notes</label><textarea name="notes" placeholder="Optional notes">${esc(r.notes||'')}</textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>`;
  modalBackdrop.classList.add('open');
  document.getElementById('close-modal').onclick=closeModal;
  modal.querySelectorAll('[data-detail-tab]').forEach(tab=>tab.onclick=()=>{
    modal.querySelectorAll('[data-detail-tab]').forEach(x=>x.classList.toggle('active',x===tab));
    const content=document.getElementById('detail-tab-content');
    if(!content)return;
    content.innerHTML=tab.dataset.detailTab==='activity'?activityRows():tab.dataset.detailTab==='notes'?notesView():historyView();
  });
  document.getElementById('cancel-modal').onclick=closeModal;
  document.getElementById('edit-goal-select').onchange=()=>{if(document.getElementById('edit-goal-select').value==='__create_goal__'){openGoalModal(created=>{r.goal=created.title;openEditResource(id)})}};
  document.getElementById('edit-skill-select').onchange=()=>{if(document.getElementById('edit-skill-select').value==='__create_skill__'){openSkillModal(created=>{r.skills=[created.title];openEditResource(id)})}};
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
  const resourceActivities=activitiesData.filter(a=>String(a.resource_id)===String(r.id)).sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at));
  const activityRows=()=>resourceActivities.length?resourceActivities.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><div><strong>${esc(a.activity_type)}</strong><span style="display:block;color:var(--muted);font-size:10px;margin-top:3px">${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div><span>${Number(a.duration_minutes||0)} min</span></div>`}).join(''):'<div class="empty-state" style="padding:24px">No activity yet. Log a learning session to see it here.</div>';
  const notesView=()=>r.notes?`<div class="detail-notes" style="padding:10px 0;font-size:11px;line-height:1.6;white-space:pre-wrap">${esc(r.notes)}</div>`:'<div class="empty-state" style="padding:24px">No notes yet. Add notes from Edit resource.</div>';
  const historyView=()=>`<div class="detail-history" style="padding:10px 0"><div class="detail-activity-item"><strong>Resource created</strong><span>${r.created_at?new Date(r.created_at).toLocaleString():'—'}</span></div><div class="detail-activity-item"><strong>Last updated</strong><span>${r.updated_at?new Date(r.updated_at).toLocaleString():'—'}</span></div>${resourceActivities.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><strong>${esc(a.activity_type)} · ${Number(a.duration_minutes||0)} min</strong><span>${d.toLocaleString()}</span></div>`}).join('')||''}</div>`;
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
function openGoalModal(onCreated){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Create goal</h2><p class="modal-subtitle">Give your learning a reason to exist.</p><form id="goal-form"><div class="field"><label>Goal name</label><input name="title" required></div><div class="field"><label>Priority</label><select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Create goal</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('goal-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const created=await createGoal({title:f.get('title'),description:f.get('description')||null,priority:f.get('priority')});if(created){closeModal();onCreated?.(created)}}}
function openSkillModal(onCreated){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Add skill</h2><form id="skill-form"><div class="field"><label>Skill name</label><input name="title" required></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Add skill</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('skill-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const created=await createSkill({title:f.get('title'),description:f.get('description')||null});if(created){closeModal();onCreated?.(created)}}}
function openSprintModal(){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Start a sprint</h2><form id="sprint-form"><div class="field"><label>Sprint name</label><input name="title" required></div><div class="field"><label>Start date</label><input name="start_date" type="date" required></div><div class="field"><label>End date</label><input name="end_date" type="date" required></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Start sprint</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('sprint-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(await createSprint({title:f.get('title'),start_date:f.get('start_date'),end_date:f.get('end_date'),status:'active'}))closeModal()}}
function logActivity(id){const initialId=id??resources[0]?.id;if(!resources.length){toast('Add a learning resource first');return}const resourceOptions=resources.map(x=>`<option value="${esc(x.id)}" ${String(x.id)===String(initialId)?'selected':''}>${esc(x.title)}</option>`).join('');modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal" style="float:right">×</button><h2>Log learning activity</h2><p class="modal-subtitle">Make the work visible. It only takes a few seconds.</p><form id="activity-form"><div class="form-grid"><div class="field full"><label>Resource</label><select name="resource_id" id="activity-resource">${resourceOptions}</select></div><div class="field"><label>Goal</label><input id="activity-goal" value="" disabled></div><div class="field"><label>Skill</label><input id="activity-skill" value="" disabled></div><div class="field full"><label>Sprint</label><input id="activity-sprint" value="" disabled></div><div class="field"><label>Activity type</label><select name="activity_type"><option>Study</option><option>Watch</option><option>Read</option><option>Practice</option><option>Project</option><option>Revision</option></select></div><div class="field"><label>Duration (minutes)</label><input name="duration" type="number" min="1" required></div><div class="field full"><label>Notes</label><textarea name="notes"></textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save activity</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;const resourceSelect=document.getElementById('activity-resource');const goalInput=document.getElementById('activity-goal');const skillInput=document.getElementById('activity-skill');const sprintInput=document.getElementById('activity-sprint');const syncContext=()=>{const selected=resources.find(x=>String(x.id)===String(resourceSelect.value));const sprint=sprintsData.find(sp=>sp.id===selected?.sprint_id);goalInput.value=selected?.goal||'Not assigned';skillInput.value=(selected?.skills||[]).join(', ')||'Not assigned';sprintInput.value=sprint?.title||'No sprint assigned'};resourceSelect.onchange=syncContext;syncContext();document.getElementById('activity-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const selected=resources.find(x=>String(x.id)===String(f.get('resource_id')));if(!selected){toast('Please select a learning resource');return}const minutes=Math.max(1,Number(f.get('duration'))||0);const {data,error}=await supa.from('activities').insert({resource_id:selected.id,activity_type:f.get('activity_type'),duration_minutes:minutes,notes:f.get('notes')||null}).select().single();if(error){toast('Could not log activity: '+error.message);return}activitiesData.unshift(data);await trackAudit('learning_activity_logged','activity',data.id,{resource_id:selected.id,resource_title:selected.title,activity_type:data.activity_type,duration_minutes:minutes});syncResourceActivities();selected.progress=Math.min(100,selected.progress+5);if(selected.progress===100){selected.column='completed';selected.status='Completed'}if(await persistResource(selected)){closeModal();toast('Activity logged · progress +5%');render()}}}

function attachAuditClickTracker(){
  if(auditClickTrackerAttached)return;
  auditClickTrackerAttached=true;
  document.addEventListener('click',e=>{
    const target=e.target.closest('button,a,[role="button"],.course-card,.data-table tr,[data-view-link]');
    if(!target)return;
    const label=(target.dataset.view||target.dataset.viewLink||target.getAttribute('aria-label')||target.textContent||target.getAttribute('title')||'').trim().replace(/\s+/g,' ').slice(0,120);
    if(!label)return;
    const navigation=!!(target.dataset.view||target.dataset.viewLink);
    trackAudit('click',navigation?'navigation':'ui',target.dataset.id||target.dataset.view||target.dataset.viewLink||target.id||null,{
      label,element:target.tagName.toLowerCase(),element_id:target.id||null,
      action_id:target.dataset.action||target.dataset.editGoal||target.dataset.deleteGoal||target.dataset.editSkill||target.dataset.deleteSkill||target.dataset.editSprint||target.dataset.deleteSprint||null
    });
  },true);
  document.addEventListener('submit',e=>{
    const form=e.target;
    if(!(form instanceof HTMLFormElement))return;
    const submitter=e.submitter;
    trackAudit('form_submit_attempted','form',form.id||null,{
      form_id:form.id||null,
      submit_label:(submitter?.textContent||submitter?.value||'').trim().replace(/\s+/g,' ').slice(0,80)
    });
  },true);
  document.addEventListener('change',e=>{
    const control=e.target;
    if(!(control instanceof HTMLElement)||!control.matches('select,input[type="checkbox"],input[type="radio"]'))return;
    trackAudit('control_changed','form_control',control.name||control.id||null,{
      field:control.name||control.id||'unnamed',
      control_type:control.tagName.toLowerCase()==='select'?'select':control.type
    });
  },true);
}
function bindEvents(){
  attachAuditClickTracker();
  document.getElementById('refresh-access')?.addEventListener('click',refreshSessionState);
  document.getElementById('settings-signout')?.addEventListener('click',()=>authAction());
  document.getElementById('settings-delete-request')?.addEventListener('click',requestAccountDeletion);
  document.getElementById('settings-profile-form')?.addEventListener('submit',async e=>{e.preventDefault();const name=String(new FormData(e.target).get('display_name')||'').trim();if(!name)return;const {data,error}=await supa.from('profiles').update({display_name:name}).eq('user_id',user.id).select('*').single();if(error){toast('Could not save profile: '+error.message);return}profile=data;const {error:authError}=await supa.auth.updateUser({data:{full_name:name}});if(authError)toast('Profile saved, but authentication name sync failed');else toast('Profile saved');await trackAudit('profile_updated','profile',user.id,{display_name:name});updateRoleUI();render()});
  document.getElementById('learning-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const ok=await savePreferences({weekly_learning_minutes:Number(f.get('weekly_learning_minutes')),daily_learning_minutes:Number(f.get('daily_learning_minutes')),session_length_minutes:Number(f.get('session_length_minutes')),default_priority:String(f.get('default_priority'))});if(ok){await trackAudit('preferences_updated','settings',user.id,{section:'learning'});toast('Learning preferences saved');render()}});
  document.getElementById('notification-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const patch={learning_reminders_enabled:f.has('learning_reminders_enabled'),sprint_deadline_reminders_enabled:f.has('sprint_deadline_reminders_enabled'),overdue_reminders_enabled:f.has('overdue_reminders_enabled'),weekly_summary_enabled:f.has('weekly_summary_enabled'),mentor_feedback_enabled:f.has('mentor_feedback_enabled'),notification_frequency:String(f.get('notification_frequency')),notification_time:String(f.get('notification_time')||'09:00'),browser_notifications_enabled:f.has('browser_notifications_enabled')&&('Notification' in window)&&Notification.permission==='granted'};const ok=await savePreferences(patch);if(ok){await trackAudit('preferences_updated','settings',user.id,{section:'notifications'});toast('Notification settings saved');render()}});
  document.getElementById('request-notification-permission')?.addEventListener('click',async()=>{if(!('Notification' in window)){toast('This browser does not support notifications');return}const permission=await Notification.requestPermission();if(permission==='granted'){await savePreferences({browser_notifications_enabled:true});toast('Browser notifications enabled');render()}else toast('Browser notification permission was not granted')});
  document.getElementById('appearance-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const ok=await savePreferences({theme:String(f.get('theme')),reduce_motion:f.has('reduce_motion')});if(ok){document.documentElement.classList.toggle('reduce-motion',preferences.reduce_motion);await trackAudit('preferences_updated','settings',user.id,{section:'appearance'});toast('Appearance settings saved');render()}});

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
      if(await persistResource(card)){await trackAudit('resource_moved','resource',card.id,{title:card.title,from:previous.column,to:target});toast('Moved to '+card.status)}else{Object.assign(card,previous);render();toast('Could not move resource')};
    };
  });document.getElementById('add-learning')?.addEventListener('click',openAdd);document.getElementById('log-activity')?.addEventListener('click',()=>logActivity());document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;render()});document.getElementById('add-goal')?.addEventListener('click',openGoalModal);document.getElementById('add-skill')?.addEventListener('click',openSkillModal);document.getElementById('add-sprint')?.addEventListener('click',openSprintModal);document.querySelectorAll('[data-edit-goal]').forEach(b=>b.onclick=()=>openEditGoal(b.dataset.editGoal));document.querySelectorAll('[data-delete-goal]').forEach(b=>b.onclick=()=>deleteGoal(b.dataset.deleteGoal));document.querySelectorAll('[data-edit-skill]').forEach(b=>b.onclick=()=>openEditSkill(b.dataset.editSkill));document.querySelectorAll('[data-delete-skill]').forEach(b=>b.onclick=()=>deleteSkill(b.dataset.deleteSkill));document.querySelectorAll('[data-edit-sprint]').forEach(b=>b.onclick=()=>openEditSprint(b.dataset.editSprint));document.querySelectorAll('[data-delete-sprint]').forEach(b=>b.onclick=()=>deleteSprint(b.dataset.deleteSprint));}
if(!window.__LEARNFLOW_APP_STARTED__){window.__LEARNFLOW_APP_STARTED__=true;initSupabase();}
document.getElementById('auth-button')?.addEventListener('click',authAction);
document.getElementById('theme-toggle')?.addEventListener('click',async()=>{const next=preferences.theme==='system'?'dark':preferences.theme==='dark'?'light':'system';await savePreferences({theme:next});if(user)await trackAudit('theme_changed','settings',user.id,{theme:next});render()});
document.getElementById('search-trigger')?.addEventListener('click',()=>{const q=prompt('Search courses, goals, skills or activity');if(q){searchTerm=q;setView('board');toast(`Showing results for “${q}”`)}});
document.getElementById('open-search')?.addEventListener('click',()=>document.getElementById('search-trigger')?.click());
if(modalBackdrop)modalBackdrop.onclick=e=>{if(e.target===modalBackdrop)closeModal()};function auditDescription(a){
  const m=a.metadata||{};
  if(a.action==='click')return 'Clicked '+(m.label||a.target_type||'interface');
  if(a.action==='login')return 'Signed in';
  if(a.action==='logout')return 'Signed out';
  if(a.action==='notification_sent')return 'Notification sent: '+(m.title||'LearnFlow reminder');
  if(a.action==='resource_moved')return 'Moved resource '+(m.title||a.target_id||'');
  if(a.action==='form_submit_attempted')return 'Submitted '+(m.form_id||'a form');
  if(a.action==='control_changed')return 'Changed '+(m.field||'a control');
  const labels={goal_created:'Created goal',goal_updated:'Updated goal',goal_deleted:'Deleted goal',skill_created:'Added skill',skill_updated:'Updated skill',skill_deleted:'Deleted skill',sprint_created:'Created sprint',sprint_updated:'Updated sprint',sprint_deleted:'Deleted sprint',resource_created:'Added learning resource',resource_saved:'Saved learning resource',resource_moved:'Moved learning resource',learning_activity_logged:'Logged learning activity',preferences_updated:'Updated settings',profile_updated:'Updated profile',theme_changed:'Changed theme'};
  return labels[a.action]||a.action.replaceAll('_',' ');
}
function activity(){
  const learning=activitiesData.map(a=>({type:'learning',occurred_at:a.occurred_at,description:'Logged '+a.duration_minutes+' minutes of '+(resources.find(r=>String(r.id)===String(a.resource_id))?.title||'learning'),detail:a.activity_type}));
  const audit=auditEvents.map(a=>({type:'audit',occurred_at:a.occurred_at,description:auditDescription(a),detail:a.target_type||'account'}));
  const all=[...learning,...audit].sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at));
  const rows=all.map(x=>'<div class="activity-item"><div class="activity-avatar">'+(x.type==='audit'?'•':'↗')+'</div><div class="activity-copy"><strong>'+esc(x.description)+'</strong><small>'+esc(x.detail||'')+' · '+new Date(x.occurred_at).toLocaleString()+'</small></div></div>').join('');
  return '<div class="page"><div class="page-heading"><div><div class="eyebrow">Immutable activity history</div><h1>Activity</h1><p>LearnFlow records sign-ins, navigation, button clicks, form submissions, saved changes, moves, and learning sessions. Sensitive form values are not recorded. This history cannot be edited from the app.</p></div><button class="primary-button" id="log-activity">＋ Log learning activity</button></div><section class="panel list-panel"><div class="table-toolbar"><strong>Activity log</strong><span class="stat-meta">'+all.length+' recorded events</span></div><div class="activity-list">'+(rows||'<div class="empty-state"><strong>No activity yet</strong><p>Your learning and workspace actions will appear here.</p></div>')+'</div></section></div>';
}
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
  if(!root)return;
  const views={overview,board,goals,skills,sprints,courses,activity,analytics,admin,settings,login:loginView,'name-setup':nameSetup};
  try{
    if(user&&profile&&profile.access_status!=='active'&&profile.role!=='admin'){
      root.innerHTML=accessGate();
    }else{
      const viewRenderer=views[currentView]||overview;
      root.innerHTML=viewRenderer();
    }
  }catch(error){
    console.error('LearnFlow view render failed:',error);
    currentView='overview';
    try{
      root.innerHTML=overview();
    }catch(fallbackError){
      console.error('LearnFlow overview fallback failed:',fallbackError);
      root.innerHTML='<div class="page"><div class="empty-state"><strong>LearnFlow is recovering</strong><p>Your workspace is safe. Refresh LearnFlow to retry the interface.</p><button class="primary-button" id="recover-app">Refresh LearnFlow</button></div></div>';
    }
  }
  try{bindEvents()}catch(error){console.error('LearnFlow event binding failed:',error)}
  try{updateNavCounts()}catch(error){console.error('LearnFlow navigation count update failed:',error)}
  requestAnimationFrame(()=>{try{animateHighlightNumbers()}catch(error){console.error('LearnFlow number animation failed:',error)}});
  const recover=document.getElementById('recover-app');
  if(recover)recover.onclick=()=>window.location.reload();
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
  const goalValues=[...new Set([...goalsData.map(g=>g.title),r.goal||''].filter(Boolean))];
  const skillValues=[...new Set([...skillsData.map(s=>s.title),skill||''].filter(Boolean))];
  const goalOptions=goalValues.map(g=>`<option value="${esc(g)}" ${r.goal===g?'selected':''}>${esc(g)}</option>`).join('');
  const skillOptions=skillValues.map(s=>`<option value="${esc(s)}" ${skill===s?'selected':''}>${esc(s)}</option>`).join('');
  const sprintOptions=sprintsData.map(sp=>`<option value="${esc(sp.id)}" ${r.sprint_id===sp.id?'selected':''}>${esc(sp.title)}</option>`).join('');
  modal.className='modal';
  modal.innerHTML=`<div class="detail-head"><div><div class="eyebrow">Edit learning</div><h2 class="detail-title">${esc(r.title)}</h2></div><button class="close-button" id="close-modal">×</button></div><form id="edit-resource-form"><div class="form-grid"><div class="field full"><label>What do you want to learn?</label><input name="title" value="${esc(r.title)}" required></div><div class="field"><label>Type</label><select name="type">${['Course','Book','Video','Article','Project','Workshop','Podcast','Other'].map(v=>`<option ${r.type===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Status</label><select name="status">${[['backlog','Backlog'],['planned','Planned'],['in-progress','In Progress'],['practice','Practice / Review'],['completed','Completed']].map(([v,l])=>`<option value="${v}" ${status===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label>Progress</label><input name="progress" type="number" min="0" max="100" value="${Number(r.progress)||0}"></div><div class="field"><label>Priority</label><select name="priority">${['Medium','High','Low'].map(v=>`<option ${r.priority===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Goal</label><select name="goal" id="edit-goal-select">${goalOptions}<option value="__create_goal__">＋ Create new goal</option></select></div><div class="field"><label>Skill</label><select name="skill" id="edit-skill-select">${skillOptions}<option value="__create_skill__">＋ Create new skill</option></select></div><div class="field"><label>Sprint</label><select name="sprint_id"><option value="">No sprint</option>${sprintOptions}</select></div><div class="field"><label>Provider</label><input name="provider" value="${esc(r.provider||'')}"></div><div class="field"><label>Target date</label><input name="due" type="date" value="${r.due_date||''}"></div><div class="field"><label>Estimated hours</label><input name="estimated_hours" type="number" min="0" step="0.25" value="${r.estimated_hours??''}"></div><div class="field full"><label>Notes</label><textarea name="notes" placeholder="Optional notes">${esc(r.notes||'')}</textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save changes</button></div></form>`;
  modalBackdrop.classList.add('open');
  document.getElementById('close-modal').onclick=closeModal;
  modal.querySelectorAll('[data-detail-tab]').forEach(tab=>tab.onclick=()=>{
    modal.querySelectorAll('[data-detail-tab]').forEach(x=>x.classList.toggle('active',x===tab));
    const content=document.getElementById('detail-tab-content');
    if(!content)return;
    content.innerHTML=tab.dataset.detailTab==='activity'?activityRows():tab.dataset.detailTab==='notes'?notesView():historyView();
  });
  document.getElementById('cancel-modal').onclick=closeModal;
  document.getElementById('edit-goal-select').onchange=()=>{if(document.getElementById('edit-goal-select').value==='__create_goal__'){openGoalModal(created=>{r.goal=created.title;openEditResource(id)})}};
  document.getElementById('edit-skill-select').onchange=()=>{if(document.getElementById('edit-skill-select').value==='__create_skill__'){openSkillModal(created=>{r.skills=[created.title];openEditResource(id)})}};
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
  const resourceActivities=activitiesData.filter(a=>String(a.resource_id)===String(r.id)).sort((a,b)=>new Date(b.occurred_at)-new Date(a.occurred_at));
  const activityRows=()=>resourceActivities.length?resourceActivities.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><div><strong>${esc(a.activity_type)}</strong><span style="display:block;color:var(--muted);font-size:10px;margin-top:3px">${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</span></div><span>${Number(a.duration_minutes||0)} min</span></div>`}).join(''):'<div class="empty-state" style="padding:24px">No activity yet. Log a learning session to see it here.</div>';
  const notesView=()=>r.notes?`<div class="detail-notes" style="padding:10px 0;font-size:11px;line-height:1.6;white-space:pre-wrap">${esc(r.notes)}</div>`:'<div class="empty-state" style="padding:24px">No notes yet. Add notes from Edit resource.</div>';
  const historyView=()=>`<div class="detail-history" style="padding:10px 0"><div class="detail-activity-item"><strong>Resource created</strong><span>${r.created_at?new Date(r.created_at).toLocaleString():'—'}</span></div><div class="detail-activity-item"><strong>Last updated</strong><span>${r.updated_at?new Date(r.updated_at).toLocaleString():'—'}</span></div>${resourceActivities.map(a=>{const d=new Date(a.occurred_at);return `<div class="detail-activity-item"><strong>${esc(a.activity_type)} · ${Number(a.duration_minutes||0)} min</strong><span>${d.toLocaleString()}</span></div>`}).join('')||''}</div>`;
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
function openGoalModal(onCreated){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Create goal</h2><p class="modal-subtitle">Give your learning a reason to exist.</p><form id="goal-form"><div class="field"><label>Goal name</label><input name="title" required></div><div class="field"><label>Priority</label><select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Create goal</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('goal-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const created=await createGoal({title:f.get('title'),description:f.get('description')||null,priority:f.get('priority')});if(created){closeModal();onCreated?.(created)}}}
function openSkillModal(onCreated){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Add skill</h2><form id="skill-form"><div class="field"><label>Skill name</label><input name="title" required></div><div class="field"><label>Description</label><textarea name="description"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Add skill</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('skill-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const created=await createSkill({title:f.get('title'),description:f.get('description')||null});if(created){closeModal();onCreated?.(created)}}}
function openSprintModal(){modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal">×</button><h2>Start a sprint</h2><form id="sprint-form"><div class="field"><label>Sprint name</label><input name="title" required></div><div class="field"><label>Start date</label><input name="start_date" type="date" required></div><div class="field"><label>End date</label><input name="end_date" type="date" required></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Start sprint</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;document.getElementById('sprint-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);if(await createSprint({title:f.get('title'),start_date:f.get('start_date'),end_date:f.get('end_date'),status:'active'}))closeModal()}}
function logActivity(id){const initialId=id??resources[0]?.id;if(!resources.length){toast('Add a learning resource first');return}const resourceOptions=resources.map(x=>`<option value="${esc(x.id)}" ${String(x.id)===String(initialId)?'selected':''}>${esc(x.title)}</option>`).join('');modal.className='modal';modal.innerHTML=`<button class="close-button" id="close-modal" style="float:right">×</button><h2>Log learning activity</h2><p class="modal-subtitle">Make the work visible. It only takes a few seconds.</p><form id="activity-form"><div class="form-grid"><div class="field full"><label>Resource</label><select name="resource_id" id="activity-resource">${resourceOptions}</select></div><div class="field"><label>Goal</label><input id="activity-goal" value="" disabled></div><div class="field"><label>Skill</label><input id="activity-skill" value="" disabled></div><div class="field full"><label>Sprint</label><input id="activity-sprint" value="" disabled></div><div class="field"><label>Activity type</label><select name="activity_type"><option>Study</option><option>Watch</option><option>Read</option><option>Practice</option><option>Project</option><option>Revision</option></select></div><div class="field"><label>Duration (minutes)</label><input name="duration" type="number" min="1" required></div><div class="field full"><label>Notes</label><textarea name="notes"></textarea></div></div><div class="modal-actions"><button type="button" class="secondary-button" id="cancel-modal">Cancel</button><button class="primary-button">Save activity</button></div></form>`;modalBackdrop.classList.add('open');document.getElementById('close-modal').onclick=closeModal;document.getElementById('cancel-modal').onclick=closeModal;const resourceSelect=document.getElementById('activity-resource');const goalInput=document.getElementById('activity-goal');const skillInput=document.getElementById('activity-skill');const sprintInput=document.getElementById('activity-sprint');const syncContext=()=>{const selected=resources.find(x=>String(x.id)===String(resourceSelect.value));const sprint=sprintsData.find(sp=>sp.id===selected?.sprint_id);goalInput.value=selected?.goal||'Not assigned';skillInput.value=(selected?.skills||[]).join(', ')||'Not assigned';sprintInput.value=sprint?.title||'No sprint assigned'};resourceSelect.onchange=syncContext;syncContext();document.getElementById('activity-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const selected=resources.find(x=>String(x.id)===String(f.get('resource_id')));if(!selected){toast('Please select a learning resource');return}const minutes=Math.max(1,Number(f.get('duration'))||0);const {data,error}=await supa.from('activities').insert({resource_id:selected.id,activity_type:f.get('activity_type'),duration_minutes:minutes,notes:f.get('notes')||null}).select().single();if(error){toast('Could not log activity: '+error.message);return}activitiesData.unshift(data);await trackAudit('learning_activity_logged','activity',data.id,{resource_id:selected.id,resource_title:selected.title,activity_type:data.activity_type,duration_minutes:minutes});syncResourceActivities();selected.progress=Math.min(100,selected.progress+5);if(selected.progress===100){selected.column='completed';selected.status='Completed'}if(await persistResource(selected)){closeModal();toast('Activity logged · progress +5%');render()}}}

function bindEvents(){
  attachAuditClickTracker();
  document.getElementById('refresh-access')?.addEventListener('click',refreshSessionState);
  document.getElementById('settings-signout')?.addEventListener('click',()=>authAction());
  document.getElementById('settings-delete-request')?.addEventListener('click',requestAccountDeletion);
  document.getElementById('settings-profile-form')?.addEventListener('submit',async e=>{e.preventDefault();const name=String(new FormData(e.target).get('display_name')||'').trim();if(!name)return;const {data,error}=await supa.from('profiles').update({display_name:name}).eq('user_id',user.id).select('*').single();if(error){toast('Could not save profile: '+error.message);return}profile=data;const {error:authError}=await supa.auth.updateUser({data:{full_name:name}});if(authError)toast('Profile saved, but authentication name sync failed');else toast('Profile saved');await trackAudit('profile_updated','profile',user.id,{display_name:name});updateRoleUI();render()});
  document.getElementById('learning-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const ok=await savePreferences({weekly_learning_minutes:Number(f.get('weekly_learning_minutes')),daily_learning_minutes:Number(f.get('daily_learning_minutes')),session_length_minutes:Number(f.get('session_length_minutes')),default_priority:String(f.get('default_priority'))});if(ok){await trackAudit('preferences_updated','settings',user.id,{section:'learning'});toast('Learning preferences saved');render()}});
  document.getElementById('notification-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const patch={learning_reminders_enabled:f.has('learning_reminders_enabled'),sprint_deadline_reminders_enabled:f.has('sprint_deadline_reminders_enabled'),overdue_reminders_enabled:f.has('overdue_reminders_enabled'),weekly_summary_enabled:f.has('weekly_summary_enabled'),mentor_feedback_enabled:f.has('mentor_feedback_enabled'),notification_frequency:String(f.get('notification_frequency')),notification_time:String(f.get('notification_time')||'09:00'),browser_notifications_enabled:f.has('browser_notifications_enabled')&&('Notification' in window)&&Notification.permission==='granted'};const ok=await savePreferences(patch);if(ok){await trackAudit('preferences_updated','settings',user.id,{section:'notifications'});toast('Notification settings saved');render()}});
  document.getElementById('request-notification-permission')?.addEventListener('click',async()=>{if(!('Notification' in window)){toast('This browser does not support notifications');return}const permission=await Notification.requestPermission();if(permission==='granted'){await savePreferences({browser_notifications_enabled:true});toast('Browser notifications enabled');render()}else toast('Browser notification permission was not granted')});
  document.getElementById('appearance-preferences-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);const ok=await savePreferences({theme:String(f.get('theme')),reduce_motion:f.has('reduce_motion')});if(ok){document.documentElement.classList.toggle('reduce-motion',preferences.reduce_motion);await trackAudit('preferences_updated','settings',user.id,{section:'appearance'});toast('Appearance settings saved');render()}});

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
      if(await persistResource(card)){await trackAudit('resource_moved','resource',card.id,{title:card.title,from:previous.column,to:target});toast('Moved to '+card.status)}else{Object.assign(card,previous);render();toast('Could not move resource')};
    };
  });document.getElementById('add-learning')?.addEventListener('click',openAdd);document.getElementById('log-activity')?.addEventListener('click',()=>logActivity());document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;render()});document.getElementById('add-goal')?.addEventListener('click',openGoalModal);document.getElementById('add-skill')?.addEventListener('click',openSkillModal);document.getElementById('add-sprint')?.addEventListener('click',openSprintModal);
  document.querySelectorAll('[data-edit-goal]').forEach(b=>b.addEventListener('click',()=>openEditGoal(b.dataset.editGoal)));
  document.querySelectorAll('[data-delete-goal]').forEach(b=>b.addEventListener('click',()=>deleteGoal(b.dataset.deleteGoal)));
  document.querySelectorAll('[data-edit-skill]').forEach(b=>b.addEventListener('click',()=>openEditSkill(b.dataset.editSkill)));
  document.querySelectorAll('[data-delete-skill]').forEach(b=>b.addEventListener('click',()=>deleteSkill(b.dataset.deleteSkill)));
  document.querySelectorAll('[data-edit-sprint]').forEach(b=>b.addEventListener('click',()=>openEditSprint(b.dataset.editSprint)));
  document.querySelectorAll('[data-delete-sprint]').forEach(b=>b.addEventListener('click',()=>deleteSprint(b.dataset.deleteSprint)));
}
document.getElementById('auth-button')?.addEventListener('click',authAction);
document.getElementById('theme-toggle')?.addEventListener('click',async()=>{const next=preferences.theme==='system'?'dark':preferences.theme==='dark'?'light':'system';await savePreferences({theme:next});if(user)await trackAudit('theme_changed','settings',user.id,{theme:next});render()});document.getElementById('search-trigger')?.addEventListener('click',()=>{const q=prompt('Search courses, goals, skills or activity');if(q){searchTerm=q;setView('board');toast(`Showing results for “${q}”`)}});document.getElementById('open-search')?.addEventListener('click',()=>document.getElementById('search-trigger')?.click());if(modalBackdrop)modalBackdrop.onclick=e=>{if(e.target===modalBackdrop)closeModal()};
