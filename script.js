/**
 * OnlineT — script.js
 * 기능 단위 구조:
 *  1. 헤더 스크롤 효과
 *  2. 모바일 메뉴 토글
 *  3. 스크롤 진입 애니메이션 (IntersectionObserver)
 */

(function () {
  'use strict';

  /* =========================================================================
     1. 헤더 스크롤 효과
     스크롤 시 그림자를 추가하여 헤더가 콘텐츠 위에 떠있는 느낌을 줌
     ========================================================================= */

  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 0) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 초기 상태 반영
  }


  /* =========================================================================
     2. 모바일 메뉴 토글
     1024px 이하에서 햄버거 버튼 클릭 시 네비게이션 표시/숨김
     ========================================================================= */

  function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const headerNav = document.getElementById('headerNav');
    if (!menuBtn || !headerNav) return;

    function toggleMenu() {
      const isOpen = headerNav.classList.toggle('is-open');
      menuBtn.classList.toggle('is-active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closeMenu() {
      headerNav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', toggleMenu);

    // 메뉴 링크 클릭 시 메뉴 닫기
    headerNav.querySelectorAll('.header__nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function (event) {
      const header = document.getElementById('header');
      if (header && !header.contains(event.target)) {
        closeMenu();
      }
    });

    // 창 크기 변경으로 데스크톱이 되면 메뉴 상태 초기화
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1023) {
        closeMenu();
      }
    });
  }


  /* =========================================================================
     3. 스크롤 진입 애니메이션
     .anim-target 요소가 뷰포트에 진입하면 .is-visible 클래스를 추가하여
     CSS transition으로 fade-in-up 효과를 적용
     ========================================================================= */

  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      '.anim-target, .slide-from-left, .slide-from-right'
    );
    if (!targets.length) return;

    // IntersectionObserver 지원 여부 확인
    if (!('IntersectionObserver' in window)) {
      // 미지원 환경에서는 모든 요소를 즉시 보이게 처리
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // 한 번 실행 후 관찰 해제
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* =========================================================================
     초기화 — DOM 준비 후 각 기능 실행
     ========================================================================= */

  function init() {
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
