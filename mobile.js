/* Mobile interaction layer. No clinical content is modified here. */
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
    if(typeof window.showPage!=='function' || window.showPage.__mobileHooked) return;
    var original=window.showPage;
    var wrapped=function(page){
      var r=original.apply(this,arguments);
      syncActive(page);
      setTimeout(addScrollHints,0);
      return r;
    };
    wrapped.__mobileHooked=true;
    window.showPage=wrapped;
  }

  function init(){
    makeBottomNav(); makeTopButton(); addScrollHints(); hookShowPage(); syncActive(detectCurrentPage());
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  window.addEventListener('resize',function(){ if(isMobile()) addScrollHints(); });
})();
