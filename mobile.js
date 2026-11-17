/* Telegram viewport integration also works as a normal mobile webpage. */
(()=>{
  const app=window.Telegram?.WebApp;
  const root=document.documentElement;
  const px=n=>Math.max(0,Number(n)||0)+'px';
  let fullHeight=window.innerHeight;
  function update(){
    const safe=app?.safeAreaInset||{},content=app?.contentSafeAreaInset||{};
    for(const edge of ['top','bottom','left','right'])root.style.setProperty('--app-safe-'+edge,px((Number(safe[edge])||0)+(Number(content[edge])||0)));
    const heights=[window.visualViewport?.height,app?.viewportHeight,window.innerHeight].filter(n=>Number.isFinite(n)&&n>0);
    const visible=Math.min(...heights);
    const editable=document.activeElement?.matches('input:not([type=button]),textarea');
    if(!editable)fullHeight=window.innerHeight;
    document.body.classList.toggle('keyboard-open',!!editable&&fullHeight-visible>120);
    root.style.setProperty('--app-visible-height',px(visible));
  }
  window.addEventListener('resize',update,{passive:true});
  window.visualViewport?.addEventListener('resize',update,{passive:true});
  window.visualViewport?.addEventListener('scroll',update,{passive:true});
  document.addEventListener('focusin',update);
  document.addEventListener('focusout',()=>requestAnimationFrame(update));
  if(app?.onEvent){app.onEvent('viewportChanged',update);if(app.isVersionAtLeast?.('8.0')){app.onEvent('safeAreaChanged',update);app.onEvent('contentSafeAreaChanged',update)}}
  try{if(app?.isVersionAtLeast?.('7.10'))app.setBottomBarColor('#f3faf6')}catch{}
  document.addEventListener('click',e=>{if(!e.target.closest('button:not(:disabled)'))return;try{if(app?.isVersionAtLeast?.('6.1'))app.HapticFeedback?.selectionChanged()}catch{}});
  update();
})();

