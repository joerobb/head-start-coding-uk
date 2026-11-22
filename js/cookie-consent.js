/*!
 * Head Start Coding - cookie consent (PECR / UK GDPR)
 *
 * Must be loaded synchronously at the top of <head>, BEFORE any inline gtag()/fbq() code.
 *
 * - Google Analytics (gtag.js) and the Meta Pixel (fbevents.js) are only loaded
 *   after the visitor opts in to that category.
 * - Until then, gtag() and fbq() are safe stubs: calls are queued in memory and
 *   nothing is sent and no cookies are set. If consent is given, the real libraries
 *   load and process the queue; if not, the queue is simply discarded on page exit.
 * - The choice is stored in a first-party cookie (strictly necessary, so exempt)
 *   for 12 months, then the visitor is asked again.
 * - Any element with [data-cookie-settings] re-opens the settings panel.
 */
(function () {
    'use strict';

    var GA_ID = 'G-HR4S0H22GE';
    var PIXEL_ID = '719206096806149';
    var COOKIE_NAME = 'hsc_cookie_consent';
    var CONSENT_VERSION = 1;               // bump to re-ask everyone (e.g. new tracking added)
    var MAX_AGE_DAYS = 365;
    var PRIVACY_URL = (function () {
        // Resolve the privacy policy relative to this script so it works from /blog/YYYY/MM/ too
        var s = document.currentScript && document.currentScript.src;
        return s ? s.replace(/js\/cookie-consent\.js.*$/, 'privacy-policy.html') : '/privacy-policy';
    })();

    // Tidy up data left by the old "accept the privacy policy" pop-up (removed Nov 2026).
    try {
        localStorage.removeItem('privacyConsent');
        localStorage.removeItem('privacyConsentDate');
    } catch (e) { /* storage unavailable - nothing to clean */ }

    /* ---------- Stubs (no network, no cookies) ---------- */

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    // Google Consent Mode v2 defaults: everything denied until the visitor chooses.
    window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
    });

    // Same shape as Meta's official stub, minus loading the script. Because window.fbq
    // already exists, the inline Meta snippet on each page exits early ("if(f.fbq)return;").
    if (!window.fbq) {
        var n = window.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!window._fbq) window._fbq = n;
        n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    }

    /* ---------- Storage ---------- */

    function readConsent() {
        try {
            var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
            if (!m) return null;
            var c = JSON.parse(decodeURIComponent(m[1]));
            if (c.v !== CONSENT_VERSION) return null;
            if (!c.t || (Date.now() - c.t) > MAX_AGE_DAYS * 864e5) return null;
            return c;
        } catch (e) { return null; }
    }

    function writeConsent(analytics, marketing) {
        var c = { v: CONSENT_VERSION, a: !!analytics, m: !!marketing, t: Date.now() };
        var secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(c)) +
            '; Max-Age=' + (MAX_AGE_DAYS * 86400) + '; Path=/; SameSite=Lax' + secure;
        return c;
    }

    function deleteCookies(patterns) {
        var host = location.hostname;
        var domains = ['', host, '.' + host, '.' + host.split('.').slice(-3).join('.'), '.' + host.split('.').slice(-2).join('.')];
        document.cookie.split('; ').forEach(function (pair) {
            var name = pair.split('=')[0];
            if (!patterns.some(function (p) { return p.test(name); })) return;
            domains.forEach(function (d) {
                document.cookie = name + '=; Max-Age=0; Path=/' + (d ? '; Domain=' + d : '');
            });
        });
    }

    /* ---------- Loading trackers ---------- */

    var loaded = { a: false, m: false };

    function loadScript(src) {
        var s = document.createElement('script');
        s.async = true; s.src = src;
        (document.head || document.documentElement).appendChild(s);
    }

    function apply(c) {
        if (c.a && !loaded.a) {
            loaded.a = true;
            window.gtag('consent', 'update', { analytics_storage: 'granted' });
            loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
        }
        if (c.m && !loaded.m) {
            loaded.m = true;
            loadScript('https://connect.facebook.net/en_US/fbevents.js');
        }
    }

    /* ---------- UI ---------- */

    var CSS = '' +
        '.hsc-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:100000;max-width:560px;margin:0 auto;background:#fff;color:#333;' +
        'border-radius:18px;box-shadow:0 10px 40px rgba(34,10,80,.28);border-top:6px solid #6222CC;padding:22px 22px 18px;font-family:Heebo,Arial,sans-serif;' +
        'font-size:15px;line-height:1.55;animation:hscccIn .35s ease-out}' +
        '@keyframes hscccIn{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}' +
        '.hsc-cc h2{font-family:Jost,Arial,sans-serif;font-size:20px;font-weight:600;color:#6222CC;margin:0 0 8px}' +
        '.hsc-cc p{margin:0 0 14px}' +
        '.hsc-cc a{color:#6222CC;text-decoration:underline}' +
        '.hsc-cc-btns{display:flex;flex-wrap:wrap;gap:10px}' +
        '.hsc-cc-btn{flex:1 1 140px;border:2px solid #6222CC;border-radius:50px;padding:10px 16px;font-family:Jost,Arial,sans-serif;font-weight:600;' +
        'font-size:15px;cursor:pointer;background:#6222CC;color:#fff;transition:background .2s,color .2s}' +
        '.hsc-cc-btn:hover{background:#4e1aa3;border-color:#4e1aa3}' +
        '.hsc-cc-btn.hsc-cc-alt{background:#fff;color:#6222CC}' +
        '.hsc-cc-btn.hsc-cc-alt:hover{background:#f3edff}' +
        '.hsc-cc-link{background:none;border:0;padding:0;margin-top:12px;color:#6222CC;text-decoration:underline;cursor:pointer;font-size:14px;font-family:inherit}' +
        '.hsc-cc-btn:focus-visible,.hsc-cc-link:focus-visible,.hsc-cc-toggle input:focus-visible+span{outline:3px solid #F7931E;outline-offset:2px}' +
        '.hsc-cc-cat{border:1px solid #e6def7;border-radius:12px;padding:12px 14px;margin-bottom:10px}' +
        '.hsc-cc-cat-head{display:flex;justify-content:space-between;align-items:center;gap:12px;font-weight:600;color:#222}' +
        '.hsc-cc-cat p{margin:6px 0 0;font-size:14px;color:#555}' +
        '.hsc-cc-always{font-size:13px;color:#2e7d32;font-weight:600;white-space:nowrap}' +
        '.hsc-cc-toggle{position:relative;display:inline-block;width:48px;height:26px;flex:0 0 auto}' +
        '.hsc-cc-toggle input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:1}' +
        '.hsc-cc-toggle span{position:absolute;inset:0;background:#c9c2d6;border-radius:26px;transition:background .2s}' +
        '.hsc-cc-toggle span:before{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform .2s}' +
        '.hsc-cc-toggle input:checked+span{background:#6222CC}' +
        '.hsc-cc-toggle input:checked+span:before{transform:translateX(22px)}' +
        '.hsc-cc-panel{max-height:min(70vh,520px);overflow-y:auto;margin:0 -4px 12px;padding:0 4px}' +
        '@media (max-width:480px){.hsc-cc{left:10px;right:10px;bottom:10px;padding:18px 16px 14px;font-size:14px}.hsc-cc-btn{flex-basis:100%}}' +
        '@media print{.hsc-cc{display:none}}';

    var root = null;

    function el(html) {
        var d = document.createElement('div');
        d.innerHTML = html;
        return d.firstChild;
    }

    function close() {
        if (root && root.parentNode) root.parentNode.removeChild(root);
        root = null;
    }

    function save(analytics, marketing) {
        var prev = readConsent();
        var c = writeConsent(analytics, marketing);
        close();
        // Withdrawing consent after a tracker has loaded: clear its cookies and reload
        // so the script is no longer running on the page.
        var revoked = (loaded.a && !c.a) || (loaded.m && !c.m) ||
            (prev && ((prev.a && !c.a) || (prev.m && !c.m)));
        if (revoked) {
            if (!c.a) deleteCookies([/^_ga/, /^_gid$/, /^_gat/]);
            if (!c.m) deleteCookies([/^_fbp$/, /^_fbc$/]);
            location.reload();
            return;
        }
        apply(c);
    }

    function show(startInSettings) {
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', function () { show(startInSettings); });
            return;
        }
        close();
        if (!document.getElementById('hsc-cc-style')) {
            var st = document.createElement('style');
            st.id = 'hsc-cc-style';
            st.textContent = CSS;
            document.head.appendChild(st);
        }
        var current = readConsent() || { a: false, m: false };

        root = el('<div class="hsc-cc" role="dialog" aria-live="polite" aria-labelledby="hsc-cc-title" aria-describedby="hsc-cc-desc"></div>');
        document.body.appendChild(root);

        function renderBanner() {
            root.innerHTML =
                '<h2 id="hsc-cc-title">Cookies on Head Start Coding</h2>' +
                '<p id="hsc-cc-desc">We use some essential cookies to make this site work. With your permission, we\'d also like to use ' +
                'analytics cookies to understand how parents use our site, and marketing cookies to measure our Facebook and Instagram adverts. ' +
                'We won\'t set these unless you say yes. <a href="' + PRIVACY_URL + '#cookies">Read more</a></p>' +
                '<div class="hsc-cc-btns">' +
                '<button type="button" class="hsc-cc-btn" data-act="accept">Accept all</button>' +
                '<button type="button" class="hsc-cc-btn" data-act="reject">Reject all</button>' +
                '</div>' +
                '<button type="button" class="hsc-cc-link" data-act="manage">Manage cookie settings</button>';
        }

        function renderSettings() {
            root.innerHTML =
                '<h2 id="hsc-cc-title">Cookie settings</h2>' +
                '<div class="hsc-cc-panel" id="hsc-cc-desc">' +
                '<p>Choose which cookies you\'re happy for us to use. You can change your mind at any time using the &ldquo;Cookie Settings&rdquo; link at the bottom of every page.</p>' +
                '<div class="hsc-cc-cat"><div class="hsc-cc-cat-head"><span>Essential</span><span class="hsc-cc-always">Always on</span></div>' +
                '<p>Needed for the website to work, such as remembering your cookie choice. These can\'t be switched off.</p></div>' +
                '<div class="hsc-cc-cat"><div class="hsc-cc-cat-head"><label for="hsc-cc-a">Analytics</label>' +
                '<span class="hsc-cc-toggle"><input type="checkbox" id="hsc-cc-a"' + (current.a ? ' checked' : '') + '><span></span></span></div>' +
                '<p>Google Analytics helps us see which pages are useful so we can improve the site. No information about your child is collected.</p></div>' +
                '<div class="hsc-cc-cat"><div class="hsc-cc-cat-head"><label for="hsc-cc-m">Marketing</label>' +
                '<span class="hsc-cc-toggle"><input type="checkbox" id="hsc-cc-m"' + (current.m ? ' checked' : '') + '><span></span></span></div>' +
                '<p>The Meta Pixel measures how well our Facebook and Instagram adverts work and helps show them to relevant parents.</p></div>' +
                '<p style="font-size:14px;margin:0">See our <a href="' + PRIVACY_URL + '#cookies">Privacy Policy</a> for full details.</p>' +
                '</div>' +
                '<div class="hsc-cc-btns">' +
                '<button type="button" class="hsc-cc-btn" data-act="save">Save my choices</button>' +
                '<button type="button" class="hsc-cc-btn hsc-cc-alt" data-act="accept">Accept all</button>' +
                '</div>' +
                '<button type="button" class="hsc-cc-link" data-act="reject">Reject all</button>';
        }

        root.addEventListener('click', function (e) {
            var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'accept') save(true, true);
            else if (act === 'reject') save(false, false);
            else if (act === 'manage') { renderSettings(); focusFirst(); }
            else if (act === 'save') save(root.querySelector('#hsc-cc-a').checked, root.querySelector('#hsc-cc-m').checked);
        });

        root.addEventListener('keydown', function (e) {
            // Escape closes the settings panel only if a choice already exists (never dismisses an unanswered banner)
            if (e.key === 'Escape' && readConsent()) close();
        });

        function focusFirst() {
            var b = root && root.querySelector('button, input');
            if (b && startInSettings !== undefined) b.focus();
        }

        if (startInSettings) { renderSettings(); focusFirst(); } else { renderBanner(); }
    }

    // Public API
    window.hscCookieConsent = {
        open: function () { show(true); },
        get: readConsent
    };

    // Footer "Cookie Settings" links
    document.addEventListener('click', function (e) {
        var t = e.target && e.target.closest && e.target.closest('[data-cookie-settings]');
        if (!t) return;
        e.preventDefault();
        show(true);
    });

    /* ---------- Start ---------- */

    var existing = readConsent();
    if (existing) {
        apply(existing);
    } else {
        show(false);
    }
})();
