(function () {
  const Home = window.IoriHome = window.IoriHome || {};

  // 1. 侧边栏抽屉逻辑
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const closeSidebar = document.getElementById('closeSidebar');

    function openSidebar() {
      sidebar?.classList.add('open');
      mobileOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebarMenu() {
      sidebar?.classList.remove('open');
      mobileOverlay?.classList.remove('open');
      document.body.style.overflow = '';
    }

    sidebarToggle?.addEventListener('click', openSidebar);
    closeSidebar?.addEventListener('click', closeSidebarMenu);
    mobileOverlay?.addEventListener('click', closeSidebarMenu);

    return { closeSidebarMenu };
  }

  // 2. 复制成功动画提示
  function showCopySuccess(btn) {
    const successMsg = btn.querySelector('.copy-success');
    if (!successMsg) return;

    successMsg.classList.remove('hidden');
    successMsg.classList.add('copy-success-animation');

    setTimeout(() => {
      successMsg.classList.add('hidden');
      successMsg.classList.remove('copy-success-animation');
    }, 2000);
  }

  // 3. 复制按钮事件监听（基于事件委托）
  function initCopyButtons() {
    const sitesGrid = document.getElementById('sitesGrid');
    if (!sitesGrid) return;

    sitesGrid.addEventListener('click', async (e) => {
      const btn = e.target.closest('.copy-btn');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const url = btn.getAttribute('data-url');
      if (!url) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          // 针对非 HTTPS 环境或老旧浏览器的降级兜底
          const textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showCopySuccess(btn);
      } catch (err) {
        alert('复制失败，请手动复制');
      }
    });
  }

  // 4. 回到顶部逻辑
  function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    const appScroll = document.getElementById('app-scroll');
    const scrollTarget = appScroll || window;

    let scrollTicking = false;

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;

      requestAnimationFrame(() => {
        const top = appScroll ? appScroll.scrollTop : window.pageYOffset;
        if (top > 300) {
          backToTop.classList.remove('opacity-0', 'invisible');
        } else {
          backToTop.classList.add('opacity-0', 'invisible');
        }
        scrollTicking = false;
      });
    };

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', () => {
      if (appScroll) {
        appScroll.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // 5. 全局 Toast 提示
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // 6. 主题切换逻辑
  function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const isDark = root.classList.contains('dark');
      const nextState = isDark ? 'light' : 'dark';

      const updateTheme = () => {
        root.classList.toggle('dark', nextState === 'dark');
        localStorage.setItem('theme', nextState);
      };

      if (!document.startViewTransition) {
        updateTheme();
        return;
      }

      root.classList.add('theme-animating');

      const transition = document.startViewTransition(updateTheme);

      transition.finished.finally(() => {
        root.classList.remove('theme-animating');
      });
    });
  }

  // 统一 UI 初始化入口
  Home.initCommonUi = function () {
    const sidebarController = initSidebar();
    Home.closeSidebarMenu = sidebarController.closeSidebarMenu;
    Home.showToast = showToast;

    initCopyButtons();
    initBackToTop();
    initThemeToggle();
  };
})();
