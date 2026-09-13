(function () {
  var toggle = document.getElementById('menuToggle');
  var closeBtn = document.getElementById('menuClose');
  var menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var closeTimer = null;
  var MENU_CLOSE_MS = 450;

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  function finishClose() {
    menu.hidden = true;
    menu.setAttribute('aria-hidden', 'true');
  }

  function setOpen(open) {
    if (open && isOpen()) return;
    if (!open && menu.hidden) return;

    clearTimeout(closeTimer);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      menu.hidden = false;
      menu.setAttribute('aria-hidden', 'false');
      if (reduceMotion) {
        menu.classList.add('is-open');
        return;
      }
      requestAnimationFrame(function () {
        menu.classList.add('is-open');
      });
      return;
    }

    menu.classList.remove('is-open');
    if (reduceMotion) {
      finishClose();
      return;
    }
    closeTimer = setTimeout(finishClose, MENU_CLOSE_MS);
  }

  toggle.addEventListener('click', function () {
    setOpen(!isOpen());
  });
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });

  menu.querySelectorAll('a[href]').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });
})();
