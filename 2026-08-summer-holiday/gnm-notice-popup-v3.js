/* gnm-notice-popup.js — 굿나잇몰 휴무 공지 (Cafe24 ScriptTags 주입용)
 * holiday-notice 스킬 산출물. CONFIG만 교체해 연휴마다 재사용.
 * 동작: 메인=이미지 팝업 / 상품 상세=상단 배너 띠. 기간 외 자동 무동작 */
(function () {
  var CONFIG = {
    id: 'gnm-popup-2026-08-summer',
    img: 'https://cdn.jsdelivr.net/gh/sooyoungkm6/gnm-assets@main/2026-08-summer-holiday/notice-600.png',
    alt: '굿나잇몰 여름휴가 휴무 안내 8/5(수)-8/7(금)',
    start: '2026-07-28T00:00:00+09:00',
    end: '2026-08-10T23:59:59+09:00',
    link: '',  // 클릭 시 이동할 공지 URL (비우면 이동 없음)
    banner: {
      html: '🏖 여름휴가 휴무 <b style="color:#FCB825">8/5(수)–8/7(금)</b> · 8/4(화) 15시 결제분까지 당일 출고 · <b style="color:#FCB825">8/10(월) 정상재개</b>',
      start: '2026-07-27T00:00:00+09:00',  // 배너는 네이버 전체공지와 동일하게 즉시 시작
      end: '2026-08-10T23:59:59+09:00'
    }
  };

  var now = new Date();

  // ── 상품 상세: 상단 배너 띠 ──
  function showBanner() {
    if (now < new Date(CONFIG.banner.start) || now > new Date(CONFIG.banner.end)) return;
    try { if (sessionStorage.getItem(CONFIG.id + '-bar')) return; } catch (e) {}
    if (document.getElementById(CONFIG.id + '-bar')) return;
    var bar = document.createElement('div');
    bar.id = CONFIG.id + '-bar';
    bar.style.cssText = 'background:#1F1F1F;color:#FFFFFF;font-size:14px;font-weight:500;' +
      'padding:11px 40px 11px 14px;text-align:center;position:relative;line-height:1.45;' +
      'font-family:Pretendard,"Apple SD Gothic Neo",sans-serif;';
    bar.innerHTML = CONFIG.banner.html;
    var x = document.createElement('button');
    x.textContent = '×';
    x.setAttribute('aria-label', '공지 닫기');
    x.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);' +
      'border:0;background:none;font-size:20px;cursor:pointer;color:#FFFFFF;padding:4px 10px;';
    x.onclick = function () {
      try { sessionStorage.setItem(CONFIG.id + '-bar', '1'); } catch (e) {}
      bar.remove();
    };
    bar.appendChild(x);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  var isProduct = location.pathname.indexOf('/product/') === 0 ||
                  location.pathname.indexOf('/surl/') === 0;
  var isOrder = location.pathname.indexOf('/order/') === 0;  // 장바구니·주문서 포함
  if (isProduct || isOrder) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else { showBanner(); }
    return;
  }

  // ── 메인: 이미지 팝업 ──
  if (now < new Date(CONFIG.start) || now > new Date(CONFIG.end)) return;
  try {
    if (localStorage.getItem(CONFIG.id + '-hide') === new Date().toDateString()) return;
  } catch (e) { /* localStorage 차단 환경은 그냥 노출 */ }

  function show() {
    if (document.getElementById(CONFIG.id)) return;
    var dim = document.createElement('div');
    dim.id = CONFIG.id;
    dim.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);' +
      'z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
    var box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:8px;overflow:hidden;' +
      'max-width:min(420px,92vw);width:100%;box-shadow:0 8px 32px rgba(0,0,0,.35);';
    var img = document.createElement('img');
    img.src = CONFIG.img;
    img.alt = CONFIG.alt;
    img.style.cssText = 'display:block;width:100%;height:auto;' +
      (CONFIG.link ? 'cursor:pointer;' : '');
    if (CONFIG.link) img.onclick = function () { location.href = CONFIG.link; };
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;font-size:13px;border-top:1px solid #eee;';
    var hide = document.createElement('button');
    hide.textContent = '오늘 하루 보지 않기';
    hide.style.cssText = 'flex:1;padding:12px;border:0;background:#f5f5f5;cursor:pointer;';
    hide.onclick = function () {
      try { localStorage.setItem(CONFIG.id + '-hide', new Date().toDateString()); } catch (e) {}
      dim.remove();
    };
    var close = document.createElement('button');
    close.textContent = '닫기';
    close.style.cssText = 'flex:1;padding:12px;border:0;background:#1f1f1f;color:#fff;cursor:pointer;';
    close.onclick = function () { dim.remove(); };
    bar.appendChild(hide); bar.appendChild(close);
    box.appendChild(img); box.appendChild(bar);
    dim.appendChild(box);
    dim.onclick = function (e) { if (e.target === dim) dim.remove(); };
    document.body.appendChild(dim);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else { show(); }
})();
