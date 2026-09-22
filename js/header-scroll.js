(function () {
  var header = document.querySelector('header.site-header');
  if (!header) return;

  var desktopMq = window.matchMedia('(min-width: 860px)');
  var TOP_THRESHOLD = 16;
  var MIN_HIDE_SCROLL = 132;
  var DELTA = 10;
  var lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
  var ticking = false;

  function isDesktop() {
    return desktopMq.matches;
  }

  function scrollY() {
    return Math.max(0, window.scrollY || window.pageYOffset || 0);
  }

  function setHidden(hidden) {
    header.classList.toggle('is-scroll-hidden', hidden);
  }

  function update() {
    ticking = false;
    if (!isDesktop()) {
      setHidden(false);
      lastScrollY = scrollY();
      return;
    }

    var y = scrollY();
    var nearTop = y <= TOP_THRESHOLD;

    if (nearTop) {
      setHidden(false);
    } else if (y > lastScrollY + DELTA && y > MIN_HIDE_SCROLL) {
      setHidden(true);
    } else if (y < lastScrollY - DELTA) {
      setHidden(false);
    }

    lastScrollY = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function onResize() {
    lastScrollY = scrollY();
    update();
  }

  if (desktopMq.addEventListener) {
    desktopMq.addEventListener('change', onResize);
  } else if (desktopMq.addListener) {
    desktopMq.addListener(onResize);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  setHidden(false);
  update();
})();
