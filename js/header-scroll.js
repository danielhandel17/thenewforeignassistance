(function () {
  var header = document.querySelector('header.site-header');
  if (!header) return;

  var tabletMq = window.matchMedia('(min-width: 860px)');
  var TOP_THRESHOLD = 16;
  var MIN_HIDE_SCROLL = 132;
  var DELTA = 10;
  var lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
  var ticking = false;

  function isTablet() {
    return tabletMq.matches;
  }

  function scrollY() {
    return Math.max(0, window.scrollY || window.pageYOffset || 0);
  }

  function setHidden(hidden) {
    header.classList.toggle('is-scroll-hidden', hidden);
  }

  function update() {
    ticking = false;
    if (!isTablet()) {
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

  if (tabletMq.addEventListener) {
    tabletMq.addEventListener('change', onResize);
  } else if (tabletMq.addListener) {
    tabletMq.addListener(onResize);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  setHidden(false);
  update();
})();
