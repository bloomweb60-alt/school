/* =========================================================================
   main.js  —  LP共通の挙動
   1. スクロール演出（.reveal → .is-visible）
   2. 追従CTA（ヒーロー通過で表示 / 最上部で非表示）
   3. ハンバーガーメニュー開閉
   4. お悩みカード横スクロール（縦ホイールを横送りに変換）
   ========================================================================= */
(function () {
  "use strict";

  /* ---- 1. スクロール演出 ---- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- 2. 追従CTA ---- */
  var stickyCta = document.getElementById("stickyCta");
  var heroEl = document.querySelector(".hero");
  if (stickyCta && heroEl) {
    var showAfter = heroEl.offsetHeight * 0.8 || 400;
    var ticking = false;

    var updateSticky = function () {
      var y = window.scrollY || window.pageYOffset;
      stickyCta.classList.toggle("is-shown", y > showAfter);
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateSticky);
        ticking = true;
      }
    });
    updateSticky();
  }

  /* ---- 3. ハンバーガーメニュー ---- */
  var menuToggle = document.getElementById("menuToggle");
  var siteMenu = document.getElementById("siteMenu");
  if (menuToggle && siteMenu) {
    var setMenuOpen = function (open) {
      siteMenu.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    };

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!siteMenu.classList.contains("is-open"));
    });

    siteMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenuOpen(false); });
    });
  }

  /* ---- 4. お悩みカード：縦ホイールを横スクロールへ ---- */
  var cardsTrack = document.querySelector(".sp-cards-track");
  if (cardsTrack) {
    cardsTrack.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        cardsTrack.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
})();
