(function(){
  var menu = document.getElementById('menu'), open = document.getElementById('openMenu'), shut = document.getElementById('closeMenu');
  function close(){ menu.hidden = true; open.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; open.focus(); }
  open.addEventListener('click', function(){ menu.hidden = false; open.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; shut.focus(); });
  shut.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ if(a.getAttribute('href').indexOf('#') > -1) close(); }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !menu.hidden) close(); });
  var back = document.getElementById('pageBack');
  if(back) back.addEventListener('click', function(){
    var same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch(_){}
    if(same && history.length > 1) history.back(); else location.href = 'index.html';
  });
})();

/* Background photographs that fade from one to the next behind a section */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-bg]').forEach(function(sec){
    var list = sec.getAttribute('data-bg').split(',').filter(Boolean);
    if(!list.length) return;
    var box = document.createElement('div'); box.className = 'bgfade'; box.setAttribute('aria-hidden','true');
    var layers = list.map(function(src, i){
      var d = document.createElement('div'); d.className = 'bgfade-img' + (i === 0 ? ' on' : '');
      d.dataset.src = src; box.appendChild(d); return d;
    });
    function load(d){ if(d.dataset.src){ d.style.backgroundImage = "url('" + d.dataset.src + "')"; d.removeAttribute('data-src'); } }
    sec.insertBefore(box, sec.firstChild);
    var i = 0, timer = null;
    function start(){
      load(layers[0]); if(layers[1]) load(layers[1]);
      if(reduce || layers.length < 2 || timer) return;
      timer = setInterval(function(){
        layers[i].classList.remove('on'); i = (i + 1) % layers.length;
        layers[i].classList.add('on'); load(layers[(i + 1) % layers.length]);
      }, 5000);
    }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ e.isIntersecting ? start() : stop(); }); }, {rootMargin:'200px 0px'}).observe(sec);
    } else start();
  });
})();

/* Header gets a solid background once the page is scrolled */
(function(){
  var hd = document.querySelector('.hd'); if(!hd) return;
  function set(){ hd.classList.toggle('solid', window.scrollY > 40); }
  set(); window.addEventListener('scroll', set, {passive:true});
})();

/* Control system gallery lightbox */
(function(){
  var lb=document.getElementById('lightbox'); if(!lb) return;
  var shots=[].slice.call(document.querySelectorAll('.shot')), img=lb.querySelector('img'), cap=lb.querySelector('.lb-cap'), i=0;
  function show(n){ i=(n+shots.length)%shots.length; var s=shots[i]; img.src=s.dataset.full; img.alt=s.querySelector('img').alt; cap.textContent=s.closest('figure').querySelector('b').textContent; }
  function close(){ lb.hidden=true; document.body.style.overflow=''; shots[i].focus(); }
  shots.forEach(function(s,n){ s.addEventListener('click',function(){ show(n); lb.hidden=false; document.body.style.overflow='hidden'; lb.querySelector('.lb-close').focus(); }); });
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',function(){show(i-1)});
  lb.querySelector('.lb-next').addEventListener('click',function(){show(i+1)});
  lb.addEventListener('click',function(e){ if(e.target===lb) close(); });
  document.addEventListener('keydown',function(e){ if(lb.hidden) return; if(e.key==='Escape') close(); if(e.key==='ArrowLeft') show(i-1); if(e.key==='ArrowRight') show(i+1); });
  var x0=null; lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40) show(dx<0?i+1:i-1); x0=null; });
})();

/* Contact form service dropdown */
(function(){
  var dd=document.getElementById('serviceSelect'); if(!dd) return;
  var btn=dd.querySelector('.dd-btn'), list=dd.querySelector('.dd-list'), input=dd.querySelector('input'), items=[].slice.call(list.querySelectorAll('li'));
  function open(o){ list.hidden=!o; btn.setAttribute('aria-expanded',o?'true':'false'); if(o){ (list.querySelector('[aria-selected=true]')||items[0]).focus(); } }
  btn.addEventListener('click',function(){ open(list.hidden); });
  items.forEach(function(li,n){
    li.addEventListener('click',function(){ items.forEach(function(x){x.removeAttribute('aria-selected')}); li.setAttribute('aria-selected','true'); input.value=li.textContent; btn.textContent=li.textContent; open(false); btn.focus(); });
    li.addEventListener('keydown',function(e){ if(e.key==='ArrowDown'){e.preventDefault();(items[n+1]||li).focus();} if(e.key==='ArrowUp'){e.preventDefault();(items[n-1]||li).focus();} if(e.key==='Enter'||e.key===' '){e.preventDefault();li.click();} if(e.key==='Escape'){open(false);btn.focus();} });
  });
  document.addEventListener('click',function(e){ if(!dd.contains(e.target)) open(false); });
})();
