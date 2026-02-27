/**
 * spotlight.js — Orange spotlight glow effect for all YatraNow cards.
 * No dependencies. Works on any page that includes main.css.
 * Handles dynamically rendered cards via MutationObserver.
 */
(function () {
    'use strict';

    /* ─── All card selectors across the site ─── */
    var CARD_CLASSES = [
        'feature-card',
        'testimonial-card',
        'route-card',
        'step-card',
        'result-card',
        'vehicle-info-card',
        'seat-layout-card',
        'booking-summary',
        'success-card',
        'booking-details-card',
        'admin-content',
        'admin-sidebar',
        'roadmap-mobile-content'
    ];

    var CARD_SELECTOR = CARD_CLASSES.map(function (c) { return '.' + c; }).join(', ');

    /* ─── Attach spotlight to a single card ─── */
    function attachSpotlight(card) {
        if (card.dataset.spotlightInit) return;
        card.dataset.spotlightInit = '1';

        /* Ensure position context */
        var cs = window.getComputedStyle(card);
        if (cs.position === 'static') card.style.position = 'relative';
        if (cs.overflow !== 'hidden') card.style.overflow = 'hidden';

        /* Inject overlay div as first child */
        var overlay = document.createElement('div');
        overlay.className = 'card-spotlight';
        card.insertBefore(overlay, card.firstChild);

        /* Lift existing direct children above overlay */
        Array.from(card.children).forEach(function (child) {
            if (!child.classList.contains('card-spotlight')) {
                if (window.getComputedStyle(child).position === 'static') {
                    child.style.position = 'relative';
                }
                if (!child.style.zIndex) child.style.zIndex = '1';
            }
        });

        /* Track local mouse position → update gradient */
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2) + '%';
            var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2) + '%';
            overlay.style.background =
                'radial-gradient(260px circle at ' + x + ' ' + y + ', ' +
                'rgba(255, 122, 26, 0.16), transparent 70%)';
            overlay.style.opacity = '1';
            card.classList.add('spotlight-hovered');
        });

        card.addEventListener('mouseleave', function () {
            overlay.style.opacity = '0';
            card.classList.remove('spotlight-hovered');
        });
    }

    /* ─── Init all matching cards on page ─── */
    function initAll() {
        document.querySelectorAll(CARD_SELECTOR).forEach(attachSpotlight);
    }

    /* ─── MutationObserver: watch for dynamically added cards ─── */
    function observeDynamic() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return; /* elements only */
                    /* Check the node itself */
                    if (CARD_CLASSES.some(function (c) { return node.classList && node.classList.contains(c); })) {
                        attachSpotlight(node);
                    }
                    /* Check descendants */
                    if (node.querySelectorAll) {
                        node.querySelectorAll(CARD_SELECTOR).forEach(attachSpotlight);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ─── Run ─── */
    function boot() {
        initAll();
        observeDynamic();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    /* Allow manual re-scan from other scripts (e.g. after AJAX render) */
    window.spotlightRefresh = initAll;

})();
