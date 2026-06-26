
// ─── CURSOR ────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.transform=`translate(${mx-4}px,${my-4}px)`;
});
(function animRing(){
  rx+=(mx-rx)*0.11;ry+=(my-ry)*0.11;
  ring.style.transform=`translate(${rx-16}px,${ry-16}px)`;
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.project-card,.tool-item,.info-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='50px';ring.style.height='50px';ring.style.borderColor='rgba(0,240,200,0.7)';});
  el.addEventListener('mouseleave',()=>{ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(0,240,200,0.5)';});
});

// ─── MOBILE MENU ───────────────────────────────────────────
function toggleMobile(){document.getElementById('mobileMenu').classList.toggle('open');}
function closeMobile(){document.getElementById('mobileMenu').classList.remove('open');}

// ─── HIRE ME MODAL ─────────────────────────────────────────
function openHire(){
  document.getElementById('hireOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeHire(){
  document.getElementById('hireOverlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('hireOverlay').addEventListener('click',function(e){
  if(e.target===this) closeHire();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeHire();});

// ─── TOAST ─────────────────────────────────────────────────
let toastTimer;
function showToast(){
  const t=document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),4000);
}
function closeToast(){document.getElementById('toast').classList.remove('show');}

// ─── LOCAL STORAGE MESSAGES ────────────────────────────────
function saveMessage(name,email,type,budget,msg){
  const msgs=JSON.parse(localStorage.getItem('ali_portfolio_msgs')||'[]');
  msgs.unshift({
    name,email,type,budget,msg,
    time:new Date().toLocaleString()
  });
  localStorage.setItem('ali_portfolio_msgs',JSON.stringify(msgs));
}

function renderSavedMsgs(){
  const msgs=JSON.parse(localStorage.getItem('ali_portfolio_msgs')||'[]');
  const list=document.getElementById('msgsList');
  if(!msgs.length){
    list.innerHTML='<p class="no-msgs">No messages saved yet.</p>';
    return;
  }
  list.innerHTML=msgs.map((m,i)=>`
    <div class="msg-entry">
      <div class="msg-meta">
        <span class="msg-name">${m.name} &lt;${m.email}&gt;</span>
        <span>${m.time}</span>
      </div>
      ${m.type?`<div style="font-size:11px;color:var(--accent2);font-family:'Fira Code',monospace;margin-bottom:6px;">${m.type}${m.budget?' · '+m.budget:''}</div>`:''}
      <div class="msg-body">${m.msg}</div>
    </div>
  `).join('');
}

function toggleSavedMsgs(){
  const panel=document.getElementById('msgsPanel');
  panel.classList.toggle('show');
  if(panel.classList.contains('show')) renderSavedMsgs();
}

// ─── HIRE FORM SUBMIT ──────────────────────────────────────
function submitHire(){
  const name=document.getElementById('hName').value.trim();
  const email=document.getElementById('hEmail').value.trim();
  const type=document.getElementById('hType').value;
  const budget=document.getElementById('hBudget').value;
  const msg=document.getElementById('hMsg').value.trim();
  const btn=document.getElementById('hireBtn');

  if(!name||!email||!msg){
    btn.textContent='⚠ Please fill required fields!';
    btn.style.background='linear-gradient(135deg,#ef4444,#dc2626)';
    btn.style.color='#fff';
    setTimeout(()=>{
      btn.innerHTML='Send Message &nbsp;<i class="fa-solid fa-paper-plane"></i>';
      btn.style.background='';
      btn.style.color='';
    },2500);
    return;
  }

  // Save to localStorage
  saveMessage(name,email,type,budget,msg);

  btn.disabled=true;
  btn.innerHTML='<i class="fa-solid fa-check"></i> Message Saved!';

  setTimeout(()=>{
    // Clear fields
    document.getElementById('hName').value='';
    document.getElementById('hEmail').value='';
    document.getElementById('hType').value='';
    document.getElementById('hBudget').value='';
    document.getElementById('hMsg').value='';
    btn.disabled=false;
    btn.innerHTML='Send Message &nbsp;<i class="fa-solid fa-paper-plane"></i>';
    closeHire();
    showToast();
  },1200);
}

// ─── CONTACT FORM SUBMIT ───────────────────────────────────
function submitContactForm(){
  const fname=document.getElementById('cfname').value.trim();
  const email=document.getElementById('cfemail').value.trim();
  const msg=document.getElementById('cfmessage').value.trim();
  const btn=document.getElementById('contactSubmitBtn');
  const subject=document.getElementById('cfsubject').value.trim();
  const lname=document.getElementById('clname').value.trim();

  if(!fname||!email||!msg){
    btn.textContent='⚠ Fill required fields!';
    btn.style.background='linear-gradient(135deg,#ef4444,#dc2626)';
    btn.style.color='#fff';
    setTimeout(()=>{
      btn.innerHTML='Send Message &nbsp;<i class="fa-solid fa-paper-plane"></i>';
      btn.style.background='';
      btn.style.color='';
    },2500);
    return;
  }

  saveMessage(fname+(lname?' '+lname:''),email,subject,'',msg);

  btn.disabled=true;
  btn.innerHTML='<i class="fa-solid fa-check"></i> Sent!';

  setTimeout(()=>{
    document.getElementById('cfname').value='';
    document.getElementById('clname').value='';
    document.getElementById('cfemail').value='';
    document.getElementById('cfsubject').value='';
    document.getElementById('cfmessage').value='';
    btn.disabled=false;
    btn.innerHTML='Send Message &nbsp;<i class="fa-solid fa-paper-plane"></i>';
    showToast();
  },1200);
}

// ─── SCROLL OBSERVER ───────────────────────────────────────
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      if(e.target.classList.contains('stat-item')){
        const num=e.target.querySelector('.stat-num');
        const target=parseInt(num.dataset.target);
        if(!isNaN(target)){
          let current=0;
          const step=Math.ceil(target/30);
          const timer=setInterval(()=>{
            current+=step;
            if(current>=target){current=target;clearInterval(timer);}
            num.textContent=current+'+';
          },40);
        }
      }
    }
  });
},{threshold:0.15});
document.querySelectorAll('.reveal,.stat-item').forEach(el=>observer.observe(el));

// ─── SKILL BARS ────────────────────────────────────────────
const skillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(bar=>{
        setTimeout(()=>{bar.style.width=bar.dataset.width+'%';},100);
      });
    }
  });
},{threshold:0.3});
document.querySelectorAll('.skills-layout').forEach(el=>skillObs.observe(el));

// ─── PROJECT CARD GLOW ─────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});

// ─── HEADER SCROLL ─────────────────────────────────────────
window.addEventListener('scroll',()=>{
  const h=document.getElementById('header');
  h.style.background=window.scrollY>50?'rgba(6,8,13,0.97)':'rgba(6,8,13,0.75)';
});
