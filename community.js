/* LearnFlow Community Learning Board */
let communityPublications=[];
let communityInteractions=[];
let communityComments=[];
let communityTab='discover';
let communitySearch='';

function communitySafeUrl(value){try{const u=new URL(String(value||''));return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}}
function communityIsPublished(resourceId){
  return communityPublications.some(p=>String(p.resource_id)===String(resourceId));
}
window.communityIsPublished=communityIsPublished;

async function loadCommunityData(){
  if(!user||!supa||profile?.access_status!=='active'){
    communityPublications=[];communityInteractions=[];communityComments=[];return;
  }
  const [pubs,interactions,comments]=await Promise.all([
    supa.from('community_publications').select('*').order('created_at',{ascending:false}),
    supa.from('community_interactions').select('*'),
    supa.from('community_comments').select('*').order('created_at',{ascending:false}).limit(500)
  ]);
  if(pubs.error||interactions.error||comments.error){
    console.error('Community data load failed:',pubs.error||interactions.error||comments.error);
    toast('Community data could not be loaded. Check that the community migration is applied.');
    return;
  }
  communityPublications=pubs.data||[];
  communityInteractions=interactions.data||[];
  // Fetch the newest 500 comments, then display them chronologically.
  communityComments=(comments.data||[]).reverse();
}
function communityInteraction(pubId,type){
  return communityInteractions.find(x=>x.publication_id===pubId&&x.user_id===user?.id&&x.interaction_type===type);
}
function communityCounts(pubId,type){
  return communityInteractions.filter(x=>x.publication_id===pubId&&x.interaction_type===type).length;
}
function communityCanFollow(){
  return ['mentor','admin'].includes(profile?.role)&&profile?.access_status==='active';
}
function communityOwnerCard(p){
  const date=new Date(p.created_at);
  return `<article class="community-card">
    <div class="community-meta"><span>${esc(p.type)} · ${esc(p.provider)}</span><span>${date.toLocaleDateString()}</span></div>
    <h3>${esc(p.title)}</h3>
    <div class="community-author"><span class="avatar avatar-blue">${esc((p.owner_name||'L').trim().charAt(0).toUpperCase())}</span><span><strong>${esc(p.owner_name||'LearnFlow member')}</strong> · ${esc((p.owner_role||'learner').charAt(0).toUpperCase()+(p.owner_role||'learner').slice(1))}</span></div>
    ${p.goal?`<p><strong>Learning goal:</strong> ${esc(p.goal)}</p>`:''}
    ${p.description?`<p>${esc(p.description)}</p>`:''}
    ${communitySafeUrl(p.url)?`<p><a href="${esc(communitySafeUrl(p.url))}" target="_blank" rel="noopener noreferrer">Open learning resource ↗</a></p>`:''}
    <div class="tag-row">${(p.skills||[]).map(s=>`<span class="tag">${esc(s)}</span>`).join('')}</div>
    <div class="community-count">${communityCounts(p.id,'like')} likes · ${communityComments.filter(c=>c.publication_id===p.id).length} comments · ${communityCounts(p.id,'bookmark')} saves</div>
    <div class="community-actions">
      <button class="community-action ${communityInteraction(p.id,'like')?'active':''}" data-community-action="like" data-id="${p.id}">♥ ${communityInteraction(p.id,'like')?'Liked':'Like'} · ${communityCounts(p.id,'like')}</button>
      <button class="community-action ${communityInteraction(p.id,'bookmark')?'active':''}" data-community-action="bookmark" data-id="${p.id}">${communityInteraction(p.id,'bookmark')?'★ Saved':'☆ Save'}</button>
      <button class="community-action" data-community-action="comments" data-id="${p.id}">Comment · ${communityComments.filter(c=>c.publication_id===p.id).length}</button>
      ${communityCanFollow()?`<button class="filter-button ${communityInteraction(p.id,'follow')?'active':''}" data-community-action="follow" data-id="${p.id}">${communityInteraction(p.id,'follow')?'Following':'＋ Follow'}</button>`:''}
      ${p.owner_id===user?.id?'<button class="filter-button" disabled>Your share</button>':`<button class="primary-button" data-community-action="copy" data-id="${p.id}">＋ Add to my board</button>`}
    </div>
  </article>`;
}
function renderCommunityBoard(){
  if(!user||profile?.access_status!=='active')return `<div class="community-page"><div class="community-header"><div><div class="community-kicker">LEARN TOGETHER</div><h1>Community</h1><p>Sign in with an active LearnFlow account to explore shared learning.</p></div></div></div>`;
  if(!communityCanFollow()&&communityTab==='following')communityTab='discover';
  let list=communityPublications;
  if(communityTab==='following')list=list.filter(p=>communityInteraction(p.id,'follow'));
  if(communityTab==='bookmarks')list=list.filter(p=>communityInteraction(p.id,'bookmark'));
  if(communityTab==='my-shares')list=list.filter(p=>p.owner_id===user.id);
  if(communitySearch)list=list.filter(p=>[p.title,p.provider,p.goal,p.description,...(p.skills||[])].join(' ').toLowerCase().includes(communitySearch.toLowerCase()));
  const tabs=[['discover','Discover'],...(communityCanFollow()?[['following','Following']]:[]),['bookmarks','Saved'],['my-shares','My shares']];
  return `<div class="community-page"><header class="community-header"><div><div class="community-kicker">LEARN TOGETHER</div><h1>Community</h1><p>Explore what people are learning. Share useful resources and exchange ideas.</p></div><div class="community-total"><strong>${communityPublications.length}</strong><span>shared resources</span></div></header>
    <section class="community-controls"><nav class="community-tabs" aria-label="Community views">${tabs.map(([key,label])=>`<button class="community-tab ${communityTab===key?'active':''}" data-community-tab="${key}">${label}</button>`).join('')}</nav><label class="community-search"><span>⌕</span><input id="community-search" placeholder="Search topics, skills or people…" value="${esc(communitySearch)}"></label></section>
    <div class="community-feed-heading"><strong>${communityTab==='discover'?'Explore shared learning':communityTab==='my-shares'?'Your shared learning':communityTab==='bookmarks'?'Saved resources':'Resources you follow'}</strong><span>${list.length} ${list.length===1?'resource':'resources'}</span></div>
    ${list.length?`<div class="community-grid">${list.map(communityOwnerCard).join('')}</div>`:`<div class="community-empty"><div class="community-empty-icon">◎</div><strong>${communityTab==='my-shares'?'You haven’t shared a resource yet':communityTab==='following'?'You’re not following any resources':communityTab==='bookmarks'?'No saved resources yet':'Nothing shared here yet'}</strong><p>${communityTab==='discover'?'When someone shares a learning resource, it will appear here. You can also publish one from your Learning Board.':'Explore Discover to find more learning resources.'}</p></div>`}
  </div>`;
}
window.renderCommunityBoard=renderCommunityBoard;
async function toggleCommunityShare(resourceId){
  if(!user||!supa){toast('Sign in to share learning resources');return}
  const existing=communityPublications.find(p=>String(p.resource_id)===String(resourceId));
  if(existing){openCommunityShare(resourceId);return}
  const r=resources.find(x=>String(x.id)===String(resourceId));
  if(!r||String(r.user_id||user.id)!==String(user.id)){toast('Only the resource owner can share this card');return}
  const payload={resource_id:r.id,owner_id:user.id,title:r.title,type:r.type,provider:r.provider||'Independent',url:communitySafeUrl(r.url),goal:r.goal||null,skills:r.skills||[],description:null,owner_name:profile?.display_name||user.user_metadata?.full_name||user.email?.split('@')[0]||'LearnFlow member',owner_role:profile?.role||'learner'};
  const {data,error}=await supa.from('community_publications').insert(payload).select().single();
  if(error){toast('Could not share this card: '+error.message);return}
  await trackAudit('resource_shared','community_publication',data.id,{title:r.title});
  await loadCommunityData();render();toast('Shared with the community');
}
window.toggleCommunityShare=toggleCommunityShare;
async function openCommunityShare(resourceId){
  if(!user||!supa){toast('Sign in to share learning resources');return}
  const r=resources.find(x=>String(x.id)===String(resourceId));
  if(!r||String(r.user_id||user.id)!==String(user.id)){toast('Only the resource owner can share this card');return}
  const existing=communityPublications.find(p=>String(p.resource_id)===String(resourceId));
  modal.className='modal';
  modal.innerHTML=`<div class="detail-head"><div><div class="eyebrow">Community sharing</div><h2>${existing?'Manage shared card':'Share learning card'}</h2></div><button class="close-button" id="community-share-close">×</button></div>
    <p class="modal-subtitle">Only the learning resource details below are shared. Your progress, private notes, due date, sprint and activity history remain private.</p>
    <div class="field"><label>Learning resource</label><input value="${esc(r.title)}" disabled></div>
    <form id="community-share-form"><div class="field" style="margin-top:13px"><label>Community description (public)</label><textarea name="description" maxlength="1200" placeholder="What makes this resource useful? What will someone learn?">${esc(existing?.description||'')}</textarea></div><div class="modal-actions"><button type="button" class="secondary-button" id="community-share-cancel">Cancel</button>${existing?'<button type="button" class="secondary-button" id="community-unshare">Unshare</button>':''}<button class="primary-button">${existing?'Save changes':'Publish to community'}</button></div></form>`;
  modalBackdrop.classList.add('open');
  document.getElementById('community-share-close').onclick=closeModal;
  document.getElementById('community-share-cancel').onclick=closeModal;
  document.getElementById('community-share-form').onsubmit=async e=>{
    e.preventDefault();
    const description=String(new FormData(e.target).get('description')||'').trim()||null;
    const payload={resource_id:r.id,owner_id:user.id,title:r.title,type:r.type,provider:r.provider||'Independent',url:communitySafeUrl(r.url),goal:r.goal||null,skills:r.skills||[],description,owner_name:profile?.display_name||user.user_metadata?.full_name||user.email?.split('@')[0]||'LearnFlow member',owner_role:profile?.role||'learner'};
    const result=existing
      ?await supa.from('community_publications').update({description}).eq('id',existing.id).select().single()
      :await supa.from('community_publications').insert(payload).select().single();
    if(result.error){toast('Could not publish this card: '+result.error.message);return}
    await trackAudit(existing?'community_share_updated':'resource_shared','community_publication',result.data.id,{title:r.title});
    await loadCommunityData();closeModal();toast(existing?'Community share updated':'Learning card published');render();
  };
  document.getElementById('community-unshare')?.addEventListener('click',async()=>{
    if(!confirm('Remove this card from the Community Learning Board?'))return;
    const {data,error}=await supa.from('community_publications').delete().eq('id',existing.id).select('id').maybeSingle();
    if(error||!data){toast('Could not unshare this card'+(error?': '+error.message:''));return}
    await loadCommunityData();closeModal();toast('Card removed from the community');render();
  });
}
window.openCommunityShare=openCommunityShare;

async function communityToggle(publicationId,type){
  if(type==='follow'&&!communityCanFollow()){toast('Following shared cards is available to Mentors and Admins');return}
  const current=communityInteraction(publicationId,type);
  if(current){
    const {error}=await supa.from('community_interactions').delete().eq('id',current.id);
    if(error){toast('Could not update: '+error.message);return}
  }else{
    const {error}=await supa.from('community_interactions').insert({publication_id:publicationId,user_id:user.id,interaction_type:type});
    if(error){toast('Could not update: '+error.message);return}
  }
  await loadCommunityData();render();
}
async function communityCopy(publicationId){
  const p=communityPublications.find(x=>x.id===publicationId);
  if(!p||!user)return;
  if(p.owner_id===user.id){toast('This card is already yours');return;}
  const {data,error}=await supa.from('resources').insert({
    user_id:user.id,title:p.title,type:p.type,provider:p.provider||'Independent',url:communitySafeUrl(p.url),
    goal:p.goal||null,skills:p.skills||[],status:'backlog',progress:0,priority:'Medium',
    due_date:null,estimated_hours:null,notes:p.description||null,sprint_id:null
  }).select().single();
  if(error){toast('Could not copy this card: '+error.message);return}
  await trackAudit('community_resource_copied','resource',data.id,{source_publication_id:p.id,title:p.title});
  await loadResources();toast('Copied to your Learning Board');setView('board');
}
function communityRenderCommentText(value){return esc(value||'').replace(/@\[([^\]]+)\]/g,'<span class="community-mention-tag">@$1</span>')}
function openCommunityComments(publicationId){
  const p=communityPublications.find(x=>x.id===publicationId);if(!p)return;
  const rows=communityComments.filter(c=>c.publication_id===publicationId);
  modal.className='modal';
  modal.innerHTML=`<div class="detail-head"><div><div class="eyebrow">Community discussion</div><h2>${esc(p.title)}</h2></div><button class="close-button" id="community-comments-close">×</button></div>
    <div id="community-comment-list">${rows.length?rows.map(c=>`<div class="community-comment"><strong>${esc(c.author_name)}</strong> <small>· ${esc(c.author_role)} · ${new Date(c.created_at).toLocaleString()}</small><p>${communityRenderCommentText(c.content)}</p>${c.user_id===user.id?`<button class="filter-button" data-delete-community-comment="${c.id}">Delete</button>`:''}</div>`).join(''):'<div class="empty-state" style="padding:25px">No comments yet. Start the discussion.</div>'}</div>
    <form class="community-comment-form" id="community-comment-form"><div class="community-mention-wrap"><textarea name="content" id="community-comment-input" maxlength="2000" placeholder="Write a comment… Type @ to tag a member" required></textarea><div id="community-mention-suggestions" class="community-mention-suggestions" hidden></div></div><div class="community-mention-hint">Type @ followed by a member’s name to tag them.</div><button class="primary-button">Post comment</button></form>`;
  modalBackdrop.classList.add('open');document.getElementById('community-comments-close').onclick=closeModal;
  const mentionedUserIds=[];
  const commentInput=document.getElementById('community-comment-input');
  const mentionBox=document.getElementById('community-mention-suggestions');
  let mentionRequest=0;
  commentInput?.addEventListener('input',async()=>{
    const match=commentInput.value.match(/(?:^|\s)@([^\n@]*)$/);
    if(!match||match[1].trim().length<2){mentionBox.hidden=true;return}
    const request=++mentionRequest;
    const {data,error}=await supa.rpc('search_community_members',{search_term:match[1].trim()});
    if(request!==mentionRequest)return;
    if(error||!data?.length){mentionBox.innerHTML='<div class="community-mention-empty">No active members found</div>';mentionBox.hidden=false;return}
    mentionBox.innerHTML=data.map(m=>`<button type="button" class="community-mention-option" data-mention-id="${m.user_id}" data-mention-name="${esc(m.display_name)}"><span class="community-mention-avatar">${esc((m.display_name||'L').charAt(0).toUpperCase())}</span><span><strong>${esc(m.display_name)}</strong><small>${esc(m.role)}</small></span></button>`).join('');
    mentionBox.hidden=false;
    mentionBox.querySelectorAll('[data-mention-id]').forEach(button=>button.addEventListener('click',()=>{
      const name=button.dataset.mentionName,id=button.dataset.mentionId;
      commentInput.value=commentInput.value.replace(/(^|\s)@[^\n@]*$/,(_,prefix)=>prefix+'@['+name+'] ');
      if(!mentionedUserIds.includes(id))mentionedUserIds.push(id);
      mentionBox.hidden=true;commentInput.focus();
    }));
  });
  document.getElementById('community-comment-form').onsubmit=async e=>{
    e.preventDefault();const content=String(new FormData(e.target).get('content')||'').trim();if(!content)return;
    const {error}=await supa.from('community_comments').insert({publication_id:publicationId,user_id:user.id,author_name:profile?.display_name||user.email?.split('@')[0]||'LearnFlow member',author_role:profile?.role||'learner',content,mentioned_user_ids:mentionedUserIds});
    if(error){toast('Could not post comment: '+error.message);return}
    await trackAudit('community_comment_added','community_publication',publicationId);await loadCommunityData();openCommunityComments(publicationId);
  };
  modal.querySelectorAll('[data-delete-community-comment]').forEach(b=>b.onclick=async()=>{
    const {data,error}=await supa.from('community_comments').delete().eq('id',b.dataset.deleteCommunityComment).eq('user_id',user.id).select('id').maybeSingle();
    if(error||!data){toast('Could not delete comment');return}await loadCommunityData();openCommunityComments(publicationId);
  });
}
function bindCommunityEvents(){
  document.querySelectorAll('[data-community-tab]').forEach(b=>b.onclick=()=>{communityTab=b.dataset.communityTab;render()});
  document.getElementById('community-search')?.addEventListener('input',e=>{communitySearch=e.target.value;const pos=e.target.selectionStart;render();const input=document.getElementById('community-search');input?.focus();input?.setSelectionRange(pos,pos)});
  document.querySelectorAll('[data-community-action]').forEach(b=>b.onclick=async()=>{
    const id=b.dataset.id,action=b.dataset.communityAction;
    if(action==='copy')await communityCopy(id);
    else if(action==='comments')openCommunityComments(id);
    else await communityToggle(id,action);
  });
}
window.bindCommunityEvents=bindCommunityEvents;
