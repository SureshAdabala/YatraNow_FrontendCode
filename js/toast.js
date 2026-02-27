/**
 * toast.js — YatraNow Premium Notification & Dialog System
 * Dark-themed popups matching the YatraNow brand.
 *
 * API:
 *   showToast(message, type = 'info', duration = 4000)
 *     type: 'success' | 'error' | 'info' | 'warning'
 *
 *   showConfirm(message, onConfirm, onCancel?, options?)
 *     options: { yesLabel, noLabel, icon, title }
 */

(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────────────────
     *  STYLES — injected once
     * ───────────────────────────────────────────────────────────────── */
    const STYLE_ID = '__ynPremiumStyles';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* ── Google Font ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ══════════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════════════════════════ */

#yn-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
    width: min(380px, calc(100vw - 32px));
}

/* Base toast card */
.yn-toast {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px 18px;
    border-radius: 14px;
    background: rgba(20, 20, 20, 0.97);
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow:
        0 4px 6px rgba(0,0,0,0.3),
        0 20px 40px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #e8e8e8;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    pointer-events: all;
    overflow: hidden;
    /* Entrance animation */
    opacity: 0;
    transform: translateX(110%) scale(0.92);
    transition: opacity 0.35s cubic-bezier(.22,1,.36,1),
                transform 0.35s cubic-bezier(.22,1,.36,1);
    will-change: transform, opacity;
}

.yn-toast.yn-show {
    opacity: 1;
    transform: translateX(0) scale(1);
}

.yn-toast.yn-hide {
    opacity: 0;
    transform: translateX(110%) scale(0.88);
    transition: opacity 0.28s ease, transform 0.28s ease;
}

/* Coloured left accent stripe */
.yn-toast::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    border-radius: 14px 0 0 14px;
}

/* Icon area */
.yn-toast-icon-wrap {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-top: 1px;
}

/* Text */
.yn-toast-body {
    flex: 1;
    min-width: 0;
    padding-right: 6px;
}

.yn-toast-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 2px;
    line-height: 1.3;
}

.yn-toast-msg {
    font-size: 13.5px;
    font-weight: 400;
    color: #c8c8c8;
    word-break: break-word;
}

/* Dismiss button */
.yn-toast-close {
    flex-shrink: 0;
    background: rgba(255,255,255,0.06);
    border: none;
    border-radius: 7px;
    color: #666;
    cursor: pointer;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;
    align-self: flex-start;
}

.yn-toast-close:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
}

/* Progress bar */
.yn-toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 3px;
    width: 100%;
    border-radius: 0 0 14px 14px;
    transform-origin: left center;
    animation: yn-progress-shrink linear forwards;
    opacity: 0.8;
}

@keyframes yn-progress-shrink {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
}

/* ── Type variants ── */

/* SUCCESS */
.yn-toast-success::before        { background: #1DCD9F; }
.yn-toast-success .yn-toast-icon-wrap {
    background: rgba(29,205,159,0.12);
    color: #1DCD9F;
}
.yn-toast-success .yn-toast-title { color: #1DCD9F; }
.yn-toast-success .yn-toast-progress { background: linear-gradient(90deg,#1DCD9F,#0fa87a); }

/* ERROR */
.yn-toast-error::before          { background: #e74c3c; }
.yn-toast-error .yn-toast-icon-wrap {
    background: rgba(231,76,60,0.12);
    color: #e74c3c;
}
.yn-toast-error .yn-toast-title { color: #e74c3c; }
.yn-toast-error .yn-toast-progress { background: linear-gradient(90deg,#e74c3c,#c0392b); }

/* WARNING */
.yn-toast-warning::before        { background: #f39c12; }
.yn-toast-warning .yn-toast-icon-wrap {
    background: rgba(243,156,18,0.12);
    color: #f39c12;
}
.yn-toast-warning .yn-toast-title { color: #f39c12; }
.yn-toast-warning .yn-toast-progress { background: linear-gradient(90deg,#f39c12,#d68910); }

/* INFO */
.yn-toast-info::before           { background: #FF7A1A; }
.yn-toast-info .yn-toast-icon-wrap {
    background: rgba(255,122,26,0.12);
    color: #FF7A1A;
}
.yn-toast-info .yn-toast-title { color: #FF7A1A; }
.yn-toast-info .yn-toast-progress { background: linear-gradient(90deg,#FF7A1A,#e56b0f); }


/* ══════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
══════════════════════════════════════════════════════════════════ */

#yn-confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 1000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.25s ease;
}

#yn-confirm-overlay.yn-show {
    opacity: 1;
}

#yn-confirm-box {
    background: #141414;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 36px 32px 28px;
    max-width: 440px;
    width: 100%;
    box-shadow:
        0 0 0 1px rgba(255,122,26,0.08),
        0 32px 64px rgba(0,0,0,0.7),
        0 8px 16px rgba(0,0,0,0.4);
    transform: scale(0.88) translateY(12px);
    transition: transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.3s ease;
    opacity: 0;
    font-family: 'Inter', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
}

/* Top gradient accent line */
#yn-confirm-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #FF7A1A, #ffaa6e, #FF7A1A);
    background-size: 200% 100%;
    animation: yn-shimmer 2.5s linear infinite;
}

@keyframes yn-shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
}

#yn-confirm-overlay.yn-show #yn-confirm-box {
    transform: scale(1) translateY(0);
    opacity: 1;
}

/* Icon circle */
#yn-confirm-icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255,122,26,0.1);
    border: 2px solid rgba(255,122,26,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin: 0 auto 20px;
}

/* Title */
#yn-confirm-title {
    color: #ffffff;
    font-size: 17px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
}

/* Message */
#yn-confirm-msg {
    color: #999;
    font-size: 14px;
    line-height: 1.65;
    text-align: center;
    margin-bottom: 28px;
    white-space: pre-line;
    padding: 0 8px;
}

/* Button row */
#yn-confirm-btns {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.yn-confirm-btn {
    padding: 11px 32px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.2s, box-shadow 0.2s;
    font-family: 'Inter', system-ui, sans-serif;
    letter-spacing: 0.01em;
    min-width: 110px;
}

.yn-confirm-btn:hover  {
    transform: translateY(-1px);
}

.yn-confirm-btn:active {
    transform: translateY(0);
}

#yn-confirm-yes {
    background: linear-gradient(135deg,#e74c3c,#c0392b);
    color: #fff;
    box-shadow: 0 4px 14px rgba(231,76,60,0.35);
}

#yn-confirm-yes:hover {
    box-shadow: 0 6px 20px rgba(231,76,60,0.5);
}

#yn-confirm-no {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #bbb;
}

#yn-confirm-no:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
}

/* ── Responsive ── */
@media (max-width: 480px) {
    #yn-toast-container {
        top: 12px;
        right: 12px;
        left: 12px;
        width: auto;
    }

    .yn-toast {
        padding: 14px 14px 16px;
        font-size: 13px;
    }

    .yn-toast-icon-wrap {
        width: 30px;
        height: 30px;
        font-size: 15px;
        border-radius: 8px;
    }

    .yn-toast-title {
        font-size: 11px;
    }

    .yn-toast-msg {
        font-size: 12.5px;
    }

    #yn-confirm-box {
        padding: 28px 20px 22px;
        border-radius: 16px;
    }

    #yn-confirm-icon-wrap {
        width: 52px;
        height: 52px;
        font-size: 24px;
    }

    #yn-confirm-title {
        font-size: 15px;
    }

    #yn-confirm-msg {
        font-size: 13px;
    }

    .yn-confirm-btn {
        padding: 10px 22px;
        font-size: 13px;
        min-width: 90px;
    }
}
        `;
        document.head.appendChild(style);
    }

    /* ─────────────────────────────────────────────────────────────────
     *  TOAST
     * ───────────────────────────────────────────────────────────────── */

    function getContainer() {
        let el = document.getElementById('yn-toast-container');
        if (!el) {
            el = document.createElement('div');
            el.id = 'yn-toast-container';
            el.setAttribute('aria-live', 'polite');
            el.setAttribute('aria-atomic', 'false');
            document.body.appendChild(el);
        }
        return el;
    }

    const CONFIG = {
        success: { icon: '✓', label: 'Success', svg: null },
        error: { icon: '✕', label: 'Error', svg: null },
        warning: { icon: '!', label: 'Warning', svg: null },
        info: { icon: 'i', label: 'Info', svg: null },
    };

    /* SVG icons (inline) */
    const ICONS = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><polyline points="20 6 9 17 4 12"/></svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="19" height="19"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    };

    const LABELS = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
    };

    /**
     * showToast(message, type, duration)
     */
    window.showToast = function (message, type = 'info', duration = 4000) {
        if (!['success', 'error', 'warning', 'info'].includes(type)) type = 'info';
        const container = getContainer();

        const toast = document.createElement('div');
        toast.className = `yn-toast yn-toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="yn-toast-icon-wrap">${ICONS[type] || ICONS.info}</div>
            <div class="yn-toast-body">
                <div class="yn-toast-title">${LABELS[type]}</div>
                <div class="yn-toast-msg">${message}</div>
            </div>
            <button class="yn-toast-close" aria-label="Dismiss">&#215;</button>
            ${duration > 0 ? `<div class="yn-toast-progress" style="animation-duration:${duration}ms"></div>` : ''}
        `;

        container.appendChild(toast);

        // Animate in (double rAF avoids batching)
        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('yn-show')));

        function dismiss() {
            toast.classList.remove('yn-show');
            toast.classList.add('yn-hide');
            setTimeout(() => toast.remove(), 320);
        }

        toast.querySelector('.yn-toast-close').addEventListener('click', dismiss);
        if (duration > 0) setTimeout(dismiss, duration);
    };

    /* ─────────────────────────────────────────────────────────────────
     *  CONFIRM DIALOG
     * ───────────────────────────────────────────────────────────────── */

    let _overlay = null;

    function buildOverlay() {
        if (_overlay) return _overlay;
        _overlay = document.createElement('div');
        _overlay.id = 'yn-confirm-overlay';
        _overlay.setAttribute('role', 'dialog');
        _overlay.setAttribute('aria-modal', 'true');
        _overlay.innerHTML = `
            <div id="yn-confirm-box">
                <div id="yn-confirm-icon-wrap">⚠️</div>
                <div id="yn-confirm-title">Are you sure?</div>
                <div id="yn-confirm-msg"></div>
                <div id="yn-confirm-btns">
                    <button class="yn-confirm-btn" id="yn-confirm-yes">Yes, proceed</button>
                    <button class="yn-confirm-btn" id="yn-confirm-no">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(_overlay);
        return _overlay;
    }

    /**
     * showConfirm(message, onConfirm, onCancel?, options?)
     * @param {string}   message
     * @param {Function} onConfirm
     * @param {Function} [onCancel]
     * @param {object}   [options]  — { yesLabel, noLabel, icon, title }
     */
    window.showConfirm = function (message, onConfirm, onCancel, options = {}) {
        const overlay = buildOverlay();
        const {
            yesLabel = 'Yes, proceed',
            noLabel = 'Cancel',
            icon = '⚠️',
            title = 'Are you sure?',
        } = options;

        overlay.querySelector('#yn-confirm-icon-wrap').textContent = icon;
        overlay.querySelector('#yn-confirm-title').textContent = title;
        overlay.querySelector('#yn-confirm-msg').textContent = message;

        // Show overlay
        overlay.style.display = 'flex';
        requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('yn-show')));

        // Trap focus after animation
        setTimeout(() => {
            const btn = overlay.querySelector('#yn-confirm-yes');
            if (btn) btn.focus();
        }, 300);

        function close() {
            overlay.classList.remove('yn-show');
            setTimeout(() => { overlay.style.display = 'none'; }, 260);
        }

        // Replace buttons to remove stale listeners
        const yesOld = overlay.querySelector('#yn-confirm-yes');
        const noOld = overlay.querySelector('#yn-confirm-no');
        const newYes = yesOld.cloneNode(true);
        const newNo = noOld.cloneNode(true);
        newYes.textContent = yesLabel;
        newNo.textContent = noLabel;
        yesOld.replaceWith(newYes);
        noOld.replaceWith(newNo);

        newYes.addEventListener('click', () => { close(); if (onConfirm) onConfirm(); });
        newNo.addEventListener('click', () => { close(); if (onCancel) onCancel(); });

        // Close on backdrop click
        overlay.addEventListener('click', function bdHandler(e) {
            if (e.target === overlay) {
                close();
                if (onCancel) onCancel();
                overlay.removeEventListener('click', bdHandler);
            }
        });

        // Close on Escape key
        function keyHandler(e) {
            if (e.key === 'Escape') {
                close();
                if (onCancel) onCancel();
                document.removeEventListener('keydown', keyHandler);
            }
        }
        document.addEventListener('keydown', keyHandler);
    };

})();
