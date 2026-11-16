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
