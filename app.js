const requests = [
  { ref:'VAR-034', project:'Dubai Tower', description:'Additional electrical cabling (200m) – Level 3', amount:8000, status:'Pending', updated:'Today, 10:24 AM', date:4 },
  { ref:'VAR-033', project:'Marina Residence', description:'Extra HVAC ducts and fittings', amount:42500, status:'Under Review', updated:'Yesterday, 4:17 PM', date:3 },
  { ref:'VAR-032', project:'Office Complex', description:'Additional plumbing lines (restroom area)', amount:12000, status:'Approved', updated:'Mar 10, 11:02 AM', date:2 },
  { ref:'VAR-031', project:'Dubai Tower', description:'Modification to cable trays (as per site instruction)', amount:15000, status:'Approved', updated:'Mar 9, 3:45 PM', date:1 },
  { ref:'VAR-030', project:'Al Barsha Mall', description:'Additional lighting fixtures (18 units)', amount:9500, status:'Rejected', updated:'Mar 8, 2:11 PM', date:0 }
];
const projects = [
  { name:'Dubai Tower', initials:'DT', variations:12, value:210000, width:82 },
  { name:'Marina Residence', initials:'MR', variations:8, value:96500, width:58 },
  { name:'Office Complex', initials:'OC', variations:6, value:62000, width:41 }
];
const activities = [
  { icon:'✓', title:'VAR-032 approved', detail:'Office Complex · AED 12,000', time:'11:02 AM' },
  { icon:'↥', title:'Quotation uploaded', detail:'VAR-033 · Marina Residence', time:'Yesterday' },
  { icon:'↗', title:'VAR-034 submitted', detail:'Dubai Tower · AED 8,000', time:'Mar 9' }
];
let activeStatus='All', activeProject='All', newestFirst=true;
const $=s=>document.querySelector(s);
const fmt=n=>new Intl.NumberFormat('en-AE').format(n);
const rows=$('#requestRows'), pop=$('#popover'), toast=$('#toast');
function renderProjects(){ $('#projectList').innerHTML=projects.map(p=>`<div class="project-row"><span class="project-avatar">${p.initials}</span><div class="project-info"><b>${p.name}</b><small>${p.variations} variation requests</small></div><div class="project-value">AED ${fmt(p.value)}<small>${p.width}% of portfolio</small></div></div>`).join(''); }
function renderActivity(){ $('#activityList').innerHTML=activities.map(a=>`<div class="activity-row"><span class="activity-icon">${a.icon}</span><div class="activity-copy"><b>${a.title}</b><small>${a.detail}</small></div><span class="activity-time">${a.time}</span></div>`).join(''); }
function renderRows(){
  const query=$('#searchInput').value.trim().toLowerCase();
  let visible=requests.filter(r=>(activeStatus==='All'||r.status===activeStatus)&&(activeProject==='All'||r.project===activeProject)&&(!query||`${r.ref} ${r.project} ${r.description} ${r.status}`.toLowerCase().includes(query)));
  visible.sort((a,b)=>newestFirst?b.date-a.date:a.date-b.date);
  rows.innerHTML=visible.map(r=>`<tr><td><input type="checkbox" aria-label="Select ${r.ref}"></td><td>${r.ref}</td><td>${r.project}</td><td>${r.description}</td><td>${fmt(r.amount)}</td><td><span class="status-pill ${r.status==='Pending'?'pending':r.status==='Under Review'?'review':r.status==='Approved'?'approved':'rejected'}">${r.status}</span></td><td>${r.updated}</td><td><button class="row-menu" aria-label="More options for ${r.ref}" data-ref="${r.ref}">···</button></td></tr>`).join('');
  $('#emptyState').hidden=visible.length>0;
  $('#resultCount').textContent=`Showing ${visible.length} of 34 requests`;
  rows.querySelectorAll('.row-menu').forEach(btn=>btn.addEventListener('click',()=>openMenu(btn,['View request','Edit details','Download documents'])));
}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2600)}
function openMenu(anchor,items){pop.innerHTML=items.map((x,i)=>`<div class="pop-item" data-action="${i}">${x}</div>`).join('');pop.hidden=false;const r=anchor.getBoundingClientRect();pop.style.top=`${Math.min(r.bottom+6,innerHeight-145)}px`;pop.style.right=`${Math.max(14,innerWidth-r.right)}px`;pop.style.left='auto';pop.querySelectorAll('.pop-item').forEach(item=>item.addEventListener('click',()=>{showToast(item.textContent==='View request'?'Opening request details…':`${item.textContent} selected`);pop.hidden=true}));}
renderProjects();renderActivity();renderRows();
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelector('.tab.active').classList.remove('active');tab.classList.add('active');activeStatus=tab.dataset.status;renderRows()}));
$('#searchInput').addEventListener('input',renderRows);
$('#sortBtn').addEventListener('click',()=>{newestFirst=!newestFirst;$('#sortBtn').innerHTML=`↕ <span>${newestFirst?'Newest first':'Oldest first'}</span>`;renderRows()});
$('#selectAll').addEventListener('change',e=>rows.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=e.target.checked));
$('#filterBtn').addEventListener('click',e=>{const b=e.currentTarget;openMenu(b,['All projects','Dubai Tower','Marina Residence','Office Complex','Al Barsha Mall']);pop.querySelectorAll('.pop-item').forEach(item=>item.addEventListener('click',()=>{activeProject=item.textContent==='All projects'?'All':item.textContent;$('#filterCount').textContent=activeProject==='All'?'0':'1';$('#filterCount').classList.toggle('visible',activeProject!=='All');renderRows();pop.hidden=true;showToast(activeProject==='All'?'Project filter cleared':`Showing ${activeProject}`)}));});
const overlay=$('#modalOverlay');
function closeModal(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')}
$('#newRequestBtn').addEventListener('click',()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>overlay.querySelector('select').focus(),30)});
$('#closeModal').addEventListener('click',closeModal);$('#cancelModal').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();pop.hidden=true;$('#sidebar').classList.remove('open')}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#searchInput').focus()}});
$('#requestForm').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.currentTarget),project=d.get('project'),title=d.get('title'),amount=Number(d.get('amount'));requests.unshift({ref:`VAR-${String(35+requests.filter(r=>r.ref.startsWith('VAR-')).length-5).padStart(3,'0')}`,project,description:title,amount,status:'Pending',updated:'Just now',date:Date.now()});requests.forEach((r,i)=>r.date=Number.isFinite(r.date)?r.date:100+i);activeStatus='All';document.querySelector('.tab.active')?.classList.remove('active');document.querySelector('.tab[data-status="All"]').classList.add('active');renderRows();closeModal();e.currentTarget.reset();showToast('Variation request created successfully')});
$('#notificationsBtn').addEventListener('click',e=>openMenu(e.currentTarget,['Notifications','VAR-032 was approved','New quotation uploaded','VAR-034 needs review']));
$('#userMenuBtn').addEventListener('click',e=>openMenu(e.currentTarget,['Ahmed Mansour · Profile','Workspace settings','Sign out']));
$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
document.addEventListener('click',e=>{if(!pop.hidden&&!pop.contains(e.target)&&!e.target.closest('#filterBtn,#notificationsBtn,#userMenuBtn,.row-menu'))pop.hidden=true;if(innerWidth<=920&&!e.target.closest('#sidebar,#menuBtn'))$('#sidebar').classList.remove('open')});
document.querySelectorAll('.nav-item').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector('.nav-item.active')?.classList.remove('active');a.classList.add('active');$('#sidebar').classList.remove('open');const page=a.dataset.page;if(page!=='Dashboard'){showToast(`${page} view selected`)}else window.scrollTo({top:0,behavior:'smooth'})}));
$('#viewAllBtn').addEventListener('click',()=>{activeStatus='All';activeProject='All';document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.status==='All'));$('#filterCount').classList.remove('visible');renderRows();showToast('Showing all variation requests')});
$('#reviewPendingBtn').addEventListener('click',()=>{document.querySelector('.tab[data-status="Pending"]').click();document.querySelector('#variations').scrollIntoView({behavior:'smooth',block:'start'})});
$('#allProjectsBtn').addEventListener('click',()=>showToast('Project overview is up to date'));
$('#activityBtn').addEventListener('click',()=>showToast('You’re viewing the latest activity'));
$('#upgradeBtn').addEventListener('click',()=>showToast('Plan options are ready to explore'));
document.querySelector('.searchbox').addEventListener('click',e=>{if(innerWidth<=620){e.currentTarget.classList.add('expanded');$('#searchInput').focus()}});

