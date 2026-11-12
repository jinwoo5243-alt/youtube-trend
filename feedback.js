/* 수정요청 위젯 — 버튼 2개(✏️ 수정요청 / 📋 수정사항 목록)
 * 접수: GitHub Issues (제목 앞에 [수정요청]) — 페이지에는 비밀키 없음
 * 반영 상태: data/feedback_log.js (window.FEEDBACK_LOG) — 수집기/수정요청.py 가 관리
 */
(function () {
  var REPO = "jinwoo5243-alt/youtube-trend";
  var PREFIX = "[수정요청]";
  var KINDS = ["기능 추가", "오류 수정", "디자인", "데이터", "기타"];
  var STATES = { "접수": "#6b7280", "진행중": "#d97706", "반영완료": "#059669", "보류": "#7c3aed" };

  function esc(s) {
    return (s == null ? "" : String(s)).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function day(iso) { return iso ? String(iso).slice(0, 10) : ""; }

  var css = "" +
    ".fbw-fab{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}" +
    ".fbw-fab button{font:600 13px 'Malgun Gothic',system-ui,sans-serif;padding:10px 16px;border-radius:24px;border:0;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25);color:#fff}" +
    ".fbw-w{background:#c4302b}.fbw-l{background:#374151}" +
    ".fbw-l .fbw-n{display:inline-block;min-width:18px;margin-left:6px;padding:0 5px;border-radius:9px;background:#f59e0b;color:#111;font-size:11px;line-height:18px}" +
    ".fbw-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;display:none;align-items:center;justify-content:center;padding:16px}" +
    ".fbw-bg.on{display:flex}" +
    ".fbw-m{background:#fff;color:#1a1a1a;width:min(640px,100%);max-height:88vh;overflow:auto;border-radius:14px;padding:20px;font-family:'Malgun Gothic',system-ui,sans-serif}" +
    "@media (prefers-color-scheme:dark){.fbw-m{background:#1f2226;color:#eceef0}.fbw-m input,.fbw-m textarea,.fbw-m select{background:#15171a;color:#eceef0;border-color:#3a3f47}.fbw-it{border-color:#2c2f34!important}}" +
    ".fbw-m h2{margin:0 0 6px;font-size:18px}.fbw-m .fbw-d{font-size:12.5px;opacity:.7;margin:0 0 14px;line-height:1.5}" +
    ".fbw-m label{display:block;font-size:12.5px;font-weight:600;margin:12px 0 4px}" +
    ".fbw-m input,.fbw-m textarea,.fbw-m select{width:100%;box-sizing:border-box;font:inherit;font-size:14px;padding:9px 10px;border:1px solid #d1d5db;border-radius:8px}" +
    ".fbw-m textarea{min-height:140px;resize:vertical}" +
    ".fbw-row{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}" +
    ".fbw-row button,.fbw-tabs button{font:inherit;font-size:13px;padding:8px 14px;border-radius:8px;border:1px solid #d1d5db;background:transparent;color:inherit;cursor:pointer}" +
    ".fbw-row .fbw-p{background:#c4302b;border-color:#c4302b;color:#fff;font-weight:600}" +
    ".fbw-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 12px}.fbw-tabs button.on{background:#374151;border-color:#374151;color:#fff}" +
    ".fbw-it{border:1px solid #e5e7eb;border-radius:10px;padding:12px;margin-bottom:10px}" +
    ".fbw-h{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:14px;font-weight:600}" +
    ".fbw-s{font-size:11px;font-weight:700;color:#fff;padding:2px 8px;border-radius:6px}" +
    ".fbw-meta{font-size:11.5px;opacity:.65;margin-top:4px}" +
    ".fbw-body{font-size:13px;white-space:pre-wrap;margin-top:6px;line-height:1.5}" +
    ".fbw-done{font-size:13px;margin-top:8px;padding:8px 10px;border-radius:8px;background:rgba(5,150,105,.12);white-space:pre-wrap}" +
    ".fbw-m a{color:#2563eb}.fbw-msg{font-size:12.5px;margin-top:10px;opacity:.8}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- 버튼 ----------
  var fab = document.createElement("div"); fab.className = "fbw-fab";
  fab.innerHTML = '<button class="fbw-l" type="button">📋 수정사항<span class="fbw-n" style="display:none"></span></button>' +
                  '<button class="fbw-w" type="button">✏️ 수정요청</button>';
  document.body.appendChild(fab);

  function modal(html) {
    var bg = document.createElement("div"); bg.className = "fbw-bg on";
    bg.innerHTML = '<div class="fbw-m" role="dialog" aria-modal="true">' + html + "</div>";
    bg.addEventListener("click", function (e) { if (e.target === bg) bg.remove(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { bg.remove(); document.removeEventListener("keydown", k); } });
    document.body.appendChild(bg);
    return bg;
  }

  // ---------- 쓰기 ----------
  fab.querySelector(".fbw-w").onclick = function () {
    var page = location.pathname.split("/").pop() || "index.html";
    var bg = modal(
      "<h2>✏️ 수정요청 남기기</h2>" +
      '<p class="fbw-d">적은 내용은 GitHub 이슈로 접수되고, 다음 작업 때 읽어서 반영합니다.<br>' +
      "‘GitHub에 접수’를 누르면 새 창이 열립니다 → 그 창에서 <b>Create</b>를 눌러야 접수가 끝납니다. (GitHub 로그인 필요)</p>" +
      "<label>분류</label><select class='fbw-k'>" + KINDS.map(function (k) { return "<option>" + k + "</option>"; }).join("") + "</select>" +
      "<label>제목 (한 줄 요약)</label><input class='fbw-t' maxlength='80' placeholder='예: 쇼츠 필터에 1분 미만 옵션 추가'>" +
      "<label>내용</label><textarea class='fbw-b' placeholder='무엇을 어떻게 바꾸면 좋을지 자유롭게 적어주세요'></textarea>" +
      '<div class="fbw-row"><button type="button" class="fbw-c">취소</button><button type="button" class="fbw-p">GitHub에 접수</button></div>' +
      '<div class="fbw-msg"></div>');
    var q = function (s) { return bg.querySelector(s); };
    try { var dr = JSON.parse(localStorage.getItem("fbw-draft") || "null"); if (dr) { q(".fbw-k").value = dr.k; q(".fbw-t").value = dr.t; q(".fbw-b").value = dr.b; } } catch (e) {}
    function save() { try { localStorage.setItem("fbw-draft", JSON.stringify({ k: q(".fbw-k").value, t: q(".fbw-t").value, b: q(".fbw-b").value })); } catch (e) {} }
    bg.addEventListener("input", save);
    q(".fbw-c").onclick = function () { bg.remove(); };
    q(".fbw-p").onclick = function () {
      var t = q(".fbw-t").value.trim(), b = q(".fbw-b").value.trim();
      if (!b && !t) { q(".fbw-msg").textContent = "내용을 적어주세요."; return; }
      if (!t) t = b.split("\n")[0].slice(0, 40);
      var body = "### 분류\n" + q(".fbw-k").value + "\n\n### 내용\n" + (b || t) +
                 "\n\n---\n페이지: " + page + " · 작성: " + new Date().toLocaleString("ko-KR");
      var url = "https://github.com/" + REPO + "/issues/new?title=" + encodeURIComponent(PREFIX + " " + t) +
                "&body=" + encodeURIComponent(body);
      window.open(url, "_blank", "noopener");
      try { localStorage.removeItem("fbw-draft"); } catch (e) {}
      q(".fbw-msg").innerHTML = "GitHub 창이 열렸습니다. 그 창에서 <b>Create</b>를 눌러 주세요. 접수되면 ‘📋 수정사항’ 목록에 나타납니다.";
    };
  };

  // ---------- 목록 ----------
  var cache = null;
  function logItems() {
    var L = window.FEEDBACK_LOG && window.FEEDBACK_LOG.items; return Array.isArray(L) ? L : [];
  }
  function parseBody(body) {
    body = body || "";
    var k = /###\s*분류\s*\n+([^\n]+)/.exec(body);
    var c = /###\s*내용\s*\n+([\s\S]*?)(\n---\n|$)/.exec(body);
    return { kind: k ? k[1].trim() : "", text: c ? c[1].trim() : body.trim() };
  }
  function load() {
    if (cache) return Promise.resolve(cache);
    var byNo = {};
    logItems().forEach(function (x) { byNo[x.번호] = Object.assign({}, x); });
    return fetch("https://api.github.com/repos/" + REPO + "/issues?state=all&per_page=100&sort=created&direction=desc")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (arr) {
        arr.forEach(function (is) {
          if (is.pull_request || String(is.title).indexOf(PREFIX) !== 0) return;
          var p = parseBody(is.body), o = byNo[is.number] || {};
          byNo[is.number] = Object.assign({
            번호: is.number, 상태: "접수"
          }, o, {
            제목: String(is.title).slice(PREFIX.length).trim(), 분류: o.분류 || p.kind, 내용: p.text,
            작성자: is.user && is.user.login, 접수일: day(is.created_at), 링크: is.html_url
          });
        });
        return { items: values(byNo), online: true };
      })
      .catch(function () { return { items: values(byNo), online: false }; })
      .then(function (res) { cache = res; return res; });
  }
  function values(o) { return Object.keys(o).map(function (k) { return o[k]; }).sort(function (a, b) { return b.번호 - a.번호; }); }

  function badge() {
    load().then(function (res) {
      var n = res.items.filter(function (x) { return x.상태 === "접수" || x.상태 === "진행중"; }).length;
      var el = fab.querySelector(".fbw-n"); el.textContent = n; el.style.display = n ? "inline-block" : "none";
      el.title = "반영 대기 " + n + "건";
    });
  }

  fab.querySelector(".fbw-l").onclick = function () {
    var bg = modal("<h2>📋 수정사항 목록</h2><p class='fbw-d'>불러오는 중…</p>");
    var m = bg.querySelector(".fbw-m");
    load().then(function (res) {
      var tab = "전체";
      var upd = window.FEEDBACK_LOG && window.FEEDBACK_LOG.updated;
      function draw() {
        var counts = { "전체": res.items.length };
        Object.keys(STATES).forEach(function (s) { counts[s] = res.items.filter(function (x) { return x.상태 === s; }).length; });
        var rows = res.items.filter(function (x) { return tab === "전체" || x.상태 === tab; });
        m.innerHTML = "<h2>📋 수정사항 목록</h2>" +
          "<p class='fbw-d'>접수 → 진행중 → 반영완료 순으로 바뀝니다." + (upd ? " 반영 기록 갱신: " + esc(upd) : "") +
          (res.online ? "" : "<br>⚠ GitHub에서 새 접수 내역을 못 불러와 반영 기록만 보여줍니다.") + "</p>" +
          "<div class='fbw-tabs'>" + ["전체"].concat(Object.keys(STATES)).map(function (s) {
            return "<button type='button' data-t='" + s + "' class='" + (s === tab ? "on" : "") + "'>" + s + " " + counts[s] + "</button>";
          }).join("") + "</div>" +
          (rows.length ? rows.map(function (x) {
            var c = STATES[x.상태] || "#6b7280";
            return "<div class='fbw-it'><div class='fbw-h'><span class='fbw-s' style='background:" + c + "'>" + esc(x.상태) + "</span>" +
              "<span>#" + esc(x.번호) + " " + esc(x.제목) + "</span></div>" +
              "<div class='fbw-meta'>" + [x.분류, x.접수일 && "접수 " + x.접수일, x.반영일 && "반영 " + x.반영일, x.작성자].filter(Boolean).map(esc).join(" · ") +
              (x.링크 ? " · <a href='" + esc(x.링크) + "' target='_blank' rel='noopener'>원문</a>" : "") + "</div>" +
              (x.내용 ? "<div class='fbw-body'>" + esc(x.내용) + "</div>" : "") +
              (x.반영내용 ? "<div class='fbw-done'>✅ " + esc(x.반영내용) + "</div>" : "") + "</div>";
          }).join("") : "<p class='fbw-d'>아직 수정요청이 없습니다.</p>") +
          "<div class='fbw-row'><button type='button' class='fbw-c'>닫기</button></div>";
        m.querySelectorAll(".fbw-tabs button").forEach(function (b) { b.onclick = function () { tab = b.dataset.t; draw(); }; });
        m.querySelector(".fbw-c").onclick = function () { bg.remove(); };
      }
      draw();
    });
  };

  badge();
})();
