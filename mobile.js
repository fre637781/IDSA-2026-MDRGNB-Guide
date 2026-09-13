/* Responsive interaction layer. No clinical content is modified here. */
(function(){
  'use strict';

  function isMobile(){ return window.matchMedia('(max-width:760px)').matches; }

  function makeBottomNav(){
    if(document.querySelector('.mobile-bottom-nav')) return;
    var nav=document.createElement('div');
    nav.className='mobile-bottom-nav';
    nav.setAttribute('aria-label','Mobile bedside navigation');
    var items=[
      ['home','⌂','Home'],
      ['bedside','✚','Bedside'],
      ['pathogen','◎','Explore'],
      ['guidance','Q','41 Qs'],
      ['reference','Rx','Dose']
    ];
    items.forEach(function(item){
      var b=document.createElement('button');
      b.type='button'; b.dataset.page=item[0];
      b.innerHTML='<span class="mi">'+item[1]+'</span><span>'+item[2]+'</span>';
      b.addEventListener('click',function(){
        if(typeof window.showPage==='function') window.showPage(item[0]);
        syncActive(item[0]);
        window.scrollTo({top:0,behavior:'smooth'});
      });
      nav.appendChild(b);
    });
    document.body.appendChild(nav);
  }

  function syncActive(page){
    document.querySelectorAll('.mobile-bottom-nav button').forEach(function(b){
      b.classList.toggle('active',b.dataset.page===page);
    });
  }

  function makeTopButton(){
    if(document.querySelector('.mobile-top-btn')) return;
    var b=document.createElement('button');
    b.type='button'; b.className='mobile-top-btn'; b.setAttribute('aria-label','Back to top'); b.textContent='↑';
    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
    document.body.appendChild(b);
    function update(){b.classList.toggle('show',isMobile() && window.scrollY>700);}
    window.addEventListener('scroll',update,{passive:true}); update();
  }

  function addScrollHints(){
    document.querySelectorAll('.matrixwrap,.bpwrap,.synmatrix').forEach(function(w){
      if(w.querySelector(':scope > .mobile-scroll-note')) return;
      var n=document.createElement('div'); n.className='mobile-scroll-note'; n.textContent='↔ 表格可左右滑動';
      w.insertBefore(n,w.firstChild);
    });
  }

  function detectCurrentPage(){
    var active=document.querySelector('.page-pane.active,[data-page].active');
    if(active && active.dataset.page) return active.dataset.page;
    var visible=Array.from(document.querySelectorAll('.page-pane[data-page]')).find(function(x){return getComputedStyle(x).display!=='none';});
    return visible ? visible.dataset.page : 'home';
  }

  function hookShowPage(){
    if(typeof window.showPage!=='function' || window.showPage.__responsiveHooked) return;
    var original=window.showPage;
    var wrapped=function(page){
      var r=original.apply(this,arguments);
      syncActive(page);
      setTimeout(addScrollHints,0);
      return r;
    };
    wrapped.__responsiveHooked=true;
    window.showPage=wrapped;
  }

  function resolveAnchorHash(hash, smooth){
    if(!hash || hash==='#' || hash.indexOf('#page=')===0) return false;
    var id;
    try { id=decodeURIComponent(hash.slice(1)); } catch(e) { id=hash.slice(1); }
    var target=document.getElementById(id);
    if(!target) return false;

    var qm=id.match(/^q([1-6])-/);
    if(qm && typeof window.showQGroup==='function') window.showQGroup(Number(qm[1]));

    var pane=target.closest('.page-pane[data-page]');
    if(pane && typeof window.showPage==='function') window.showPage(pane.dataset.page,false);
    if(pane) syncActive(pane.dataset.page);

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ target.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'}); });
    });
    return true;
  }

  function installAnchorRouter(){
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');
      if(!a) return;
      var h=a.getAttribute('href');
      if(!h || h==='#' || h.indexOf('#page=')===0) return;
      if(!document.getElementById(h.slice(1))) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      history.replaceState(null,'',h);
      resolveAnchorHash(h,true);
    },true);

    window.addEventListener('hashchange',function(){ resolveAnchorHash(location.hash,false); });
  }

  function init(){
    makeBottomNav();
    makeTopButton();
    addScrollHints();
    hookShowPage();
    installAnchorRouter();
    if(!resolveAnchorHash(location.hash,false)) syncActive(detectCurrentPage());
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  window.addEventListener('resize',function(){ if(isMobile()) addScrollHints(); });
})();
