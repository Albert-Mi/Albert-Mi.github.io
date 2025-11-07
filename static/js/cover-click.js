(function(){
  // 1) 仅首页显示 —— 支持“根路径”和“子路径部署”
  // ----------------------------------------------------
  // Hugo 的 baseURL 注入（见 head/custom.html）
  var base = window.__HUGO_BASEURL__ || '/';
  var basePath = new URL(base, location.origin).pathname;   // 例：'/' 或 '/Albert-Mi.github.io/'
  if (!basePath.endsWith('/')) basePath += '/';

  // 当前路径正规化为以 / 结尾
  var current = location.pathname;
  if (!current.endsWith('/')) current += '/';

  // 首页判断：当前路径与 basePath 完全一致 -> 首页
  var isHome = (current === basePath);
  if (!isHome) return;

  // 2) 读取配置的多行文案
  // ----------------------------------------------------
  var enabled = (window.__COVER_ENABLED__ !== false);
  if (!enabled) return;

  var lines = Array.isArray(window.__COVER_LINES__) && window.__COVER_LINES__.length
    ? window.__COVER_LINES__
    : ["你好，我是 Jiaqi (Jackey) Fan", "欢迎来到我的个人网站", "Robotics · Aerospace · Data"];

  // 3) 组装 DOM
  // ----------------------------------------------------
  var wrap = document.createElement('div');
  wrap.id = 'site-cover';
  wrap.innerHTML = [
    '<div class="cover-bg">',
    '  <div class="bg-gradient"></div>',
    '  <div class="flow-lines"></div>',
    '</div>',
    '<div class="cover-content">',
    '  <div class="cover-lines">',
         lines.map(function(t,i){ return '<div class="line" style="--i:'+ (i+1) +';">'+ t +'</div>'; }).join(''),
    '    <div class="hint">( 单击进入 / Tap to enter )</div>',
    '  </div>',
    '</div>'
  ].join('');

  // 禁止滚动穿透
  var html = document.documentElement;
  var prevOverflow = html.style.overflow;
  html.style.overflow = 'hidden';

  document.body.appendChild(wrap);

  // 4) 单击一次才进入（PC 左键 / 移动端一次触摸）
  // ----------------------------------------------------
  function hide(){
    wrap.classList.add('hide');
    setTimeout(function(){
      try { document.body.removeChild(wrap); } catch(e){}
      html.style.overflow = prevOverflow || '';
    }, 700);
  }

  function onInteract(e){ e.preventDefault && e.preventDefault(); hide(); }
  wrap.addEventListener('click', onInteract, { passive:true });
  wrap.addEventListener('touchstart', onInteract, { passive:true });

  // 5) 每次进入都会显示：不做任何 storage 缓存
  // ----------------------------------------------------
})();
