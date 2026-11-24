/* Triangle Angle Sum Lab — 馬Sir教室
   Classroom projection tool. No student data is collected. */
(function () {
  "use strict";

  const COL = {
    a: "#1d4f9a",
    aFill: "#d6e4f6",
    b: "#b8510c",
    bFill: "#f6dfcc",
    c: "#1a6d45",
    cFill: "#d4ecdf",
    ink: "#1c1914",
    muted: "#5a5448",
    line: "#8a8376",
    stage: "#fbf7ef",
    ruler: "#c4a06a",
    rulerEdge: "#6d5228",
    parallel: "#2a5f86",
  };

  const TEAR_PRESETS = {
    acute: {
      id: "acute",
      hash: "tear-acute",
      label: "Acute scalene",
      a: 50, b: 70, c: 60,
    },
    right: {
      id: "right",
      hash: "tear-right",
      label: "Right-angled",
      a: 40, b: 90, c: 50,
    },
    obtuse: {
      id: "obtuse",
      hash: "tear-obtuse",
      label: "Obtuse",
      a: 30, b: 110, c: 40,
    },
    iso: {
      id: "iso",
      hash: "tear-iso",
      label: "Isosceles",
      a: 70, b: 55, c: 55,
    },
    equilateral: {
      id: "equilateral",
      hash: "tear-equilateral",
      label: "Equilateral",
      a: 60, b: 60, c: 60,
    },
  };

  const ITEMS = {
    ex53: {
      id: "ex53",
      hash: "ex5.3",
      title: "Example 5.3",
      subtitle: "Find the unknown angle in a triangle",
    },
    te53: {
      id: "te53",
      hash: "te5.3",
      title: "Teaching Example 5.3",
      subtitle: "Find the unknown angle in a triangle",
    },
    qp53: {
      id: "qp53",
      hash: "qp5.3",
      title: "Quick Practice 5.3",
      subtitle: "Find the unknown angle in a triangle",
    },
    ex54: {
      id: "ex54",
      hash: "ex5.4",
      title: "Example 5.4",
      subtitle: "Further problem on finding unknown angles in triangles",
    },
    te54: {
      id: "te54",
      hash: "te5.4",
      title: "Teaching Example 5.4",
      subtitle: "Further problem on finding unknown angles in triangles",
    },
    qp54: {
      id: "qp54",
      hash: "qp5.4",
      title: "Quick Practice 5.4",
      subtitle: "Further problem on finding unknown angles in triangles",
    },
  };

  const NOTES = {
    tear: `
      <p>此畫面只作投影／重溫，<strong>不能取代</strong> Activity 5.1 的實體剪角。觀課主軸仍是：學生先畫三角形、剪／撕三個內角、貼在尺上，親眼看到拼成平角。</p>
      <ul>
        <li>實體活動完成後，再投影幾款不同三角形（銳角不等邊、直角、鈍角、等腰、等邊），讓學生看到結果一樣。</li>
        <li>三個角貼上尺後，先問「What do these three angles form?」，才揭示 straight angle／180° 與簡稱 ∠ sum of △。</li>
        <li>投影不方便拖曳時，可用 “Fit them against the ruler”。</li>
        <li>撕下後，把扇形拖到尺上：第一隻會停在放下的位置，頂點貼尺、開口向上。再把另一隻拖到尺上或靠過去，它們會共用同一個頂點、邊貼邊拼在一起，不會彈開到遠處。三隻都貼上後，會拼成平角。</li>
        <li>尚未全部拼好時，可選取該角，按 Rotate left／Rotate right，或拖動弧上的小圓點來旋轉。</li>
      </ul>
    `,
    proof: `
      <p>跟課本附錄證明逐步展示。過 A 作 DE ∥ BC 的作圖在 §5.3 才教，課堂可由老師在黑板畫出；App 已代為畫好，並註明 “DE ∥ BC is drawn for you”。</p>
      <ul>
        <li>只用錘角（alt. ∠s）。不要提及對應角或同側內角，亦不要預告後面章節的角與線性質。</li>
        <li>出現第一對、第二對錘角時，先問理由，再顯示 “alt. ∠s, DE ∥ BC”。</li>
        <li>最後可用 “Show the angles on DE”，把三個同色扇形放到直線 DE 上，對應實體「三角貼在尺上」＝ ∠BAD、∠BAC、∠CAE 落在平角上。</li>
      </ul>
    `,
    practice: `
      <p>鎖定課本 Example 5.3、Teaching Example 5.3、Quick Practice 5.3、Example 5.4、Teaching Example 5.4、Quick Practice 5.4。六題一開始就可選。</p>
      <ul>
        <li>每題都按「先辨三角形與已知角 → 才寫式 → 才出終值」逐步揭示，不要一次過放出答案。</li>
        <li>Example 5.4 可先出示 Tips for Students：在 △ABC、△ACD、△ABD 之中，先處理只有一個未知角的三角形（△ABC）。Teaching Example 5.4 與 Quick Practice 5.4 同樣先處理只有一個未知角的三角形，再用「直線上兩鄰角和為 180°」處理第二個三角形。不要提及對應角或同側內角。</li>
        <li>理由一律用 ∠ sum of △（直線則直接說明是 straight line）；圖上的數值須與課本一致。</li>
      </ul>
    `,
  };

  const ANGLE_OPTIONS = [
    { id: "acute", label: "an acute angle" },
    { id: "right", label: "a right angle" },
    { id: "obtuse", label: "an obtuse angle" },
    { id: "straight", label: "a straight angle" },
    { id: "reflex", label: "a reflex angle" },
    { id: "round", label: "a round angle" },
  ];

  const state = {
    mode: "tear",
    preset: "acute",
    item: "ex53",
    board: null,
    tear: {
      phase: "intact", // intact | torn | placed | revealed
      chosen: null,
      sectors: null,
    },
    proof: {
      step: 1, // 1..5
      reason3: false,
      reason4: false,
      correspondence: false,
    },
    practice: {
      step: 0,
    },
    notesOpen: false,
  };

  let tearUI = null;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function deg(r) { return r * 180 / Math.PI; }
  function rad(d) { return d * Math.PI / 180; }

  function katexEl(el, src, display) {
    if (!el) return;
    if (window.katex) {
      window.katex.render(src, el, { throwOnError: false, displayMode: !!display });
    } else {
      el.textContent = src;
    }
  }

  function spanTex(src, display) {
    const s = document.createElement(display ? "div" : "span");
    s.className = display ? "eq" : "";
    katexEl(s, src, display);
    return s;
  }

  function setHash(hash) {
    const next = "#" + hash;
    if (location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }

  function parseHash() {
    const h = (location.hash || "").replace(/^#/, "").trim().toLowerCase();
    if (h === "tear" || h === "") return { mode: "tear", preset: "acute" };
    if (h === "tear-acute") return { mode: "tear", preset: "acute" };
    if (h === "tear-right") return { mode: "tear", preset: "right" };
    if (h === "tear-obtuse") return { mode: "tear", preset: "obtuse" };
    if (h === "tear-iso") return { mode: "tear", preset: "iso" };
    if (h === "tear-equilateral") return { mode: "tear", preset: "equilateral" };
    if (h === "proof") return { mode: "proof" };
    if (h === "ex5.3") return { mode: "practice", item: "ex53" };
    if (h === "te5.3" || h === "te53") return { mode: "practice", item: "te53" };
    if (h === "qp5.3") return { mode: "practice", item: "qp53" };
    if (h === "ex5.4") return { mode: "practice", item: "ex54" };
    if (h === "te5.4" || h === "te54") return { mode: "practice", item: "te54" };
    if (h === "qp5.4") return { mode: "practice", item: "qp54" };
    return { mode: "tear", preset: "acute" };
  }

  /* ---------- geometry helpers ---------- */

  function intersectRays(p, r, q, s) {
    const det = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(det) < 1e-9) return null;
    const t = ((q[0] - p[0]) * s[1] - (q[1] - p[1]) * s[0]) / det;
    return [p[0] + t * r[0], p[1] + t * r[1]];
  }

  function triangleFromAngles(angA, angB, angC, base) {
    const B = [0, 0];
    const C = [base, 0];
    const rB = [Math.cos(rad(angB)), Math.sin(rad(angB))];
    const rC = [Math.cos(Math.PI - rad(angC)), Math.sin(Math.PI - rad(angC))];
    const A = intersectRays(B, rB, C, rC);
    return { A, B, C };
  }

  function fitTriangle(tri, box) {
    const pts = [tri.A, tri.B, tri.C];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach((p) => {
      minX = Math.min(minX, p[0]); minY = Math.min(minY, p[1]);
      maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]);
    });
    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    const scale = Math.min(box.w / w, box.h / h);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const tx = box.cx - cx * scale;
    const ty = box.cy - cy * scale;
    const map = (p) => [p[0] * scale + tx, p[1] * scale + ty];
    return { A: map(tri.A), B: map(tri.B), C: map(tri.C), scale };
  }

  function fitPoints(points, box) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    points.forEach((pt) => {
      minX = Math.min(minX, pt[0]); minY = Math.min(minY, pt[1]);
      maxX = Math.max(maxX, pt[0]); maxY = Math.max(maxY, pt[1]);
    });
    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    const scale = Math.min(box.w / w, box.h / h);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const map = (pt) => [(pt[0] - cx) * scale + box.cx, (pt[1] - cy) * scale + box.cy];
    return { map, scale };
  }

  function thirdPointOnBase(vertex, shared, baseY, wantXGreaterThan, angleDeg) {
    // From `vertex`, take a ray that makes angleDeg with the ray to `shared`,
    // and meet the horizontal line y = baseY on the requested side.
    const angShared = Math.atan2(shared[1] - vertex[1], shared[0] - vertex[0]);
    const candidates = [];
    [1, -1].forEach((sign) => {
      const ang = angShared + sign * rad(angleDeg);
      const sy = Math.sin(ang);
      if (Math.abs(sy) < 1e-8) return;
      const t = (baseY - vertex[1]) / sy;
      if (t <= 0) return;
      candidates.push([vertex[0] + t * Math.cos(ang), baseY]);
    });
    const prefer = candidates.filter((p) => wantXGreaterThan ? p[0] > wantXGreaterThan : p[0] < wantXGreaterThan);
    return (prefer[0] || candidates[0] || [shared[0] + 2, baseY]);
  }

  function angleAt(P, V, Q) {
    const ax = P[0] - V[0], ay = P[1] - V[1];
    const bx = Q[0] - V[0], by = Q[1] - V[1];
    const a1 = Math.atan2(ay, ax);
    const a2 = Math.atan2(by, bx);
    let d = a2 - a1;
    while (d <= -Math.PI) d += 2 * Math.PI;
    while (d > Math.PI) d -= 2 * Math.PI;
    return { from: a1, to: a1 + d, mid: a1 + d / 2, signed: d, abs: Math.abs(d) };
  }

  function sectorCoords(apex, from, to, radius, n) {
    n = n || 20;
    const pts = [[apex[0], apex[1]]];
    for (let i = 0; i <= n; i++) {
      const t = from + (to - from) * (i / n);
      pts.push([apex[0] + radius * Math.cos(t), apex[1] + radius * Math.sin(t)]);
    }
    return pts;
  }

  function interiorOrder(P, V, Q) {
    const ang = angleAt(P, V, Q);
    return ang;
  }

  /* ---------- board ---------- */

  function freeBoard() {
    state._freeing = true;
    if (state.board) {
      try { JXG.JSXGraph.freeBoard(state.board); } catch (e) { /* ignore */ }
      state.board = null;
    }
    const el = document.getElementById("board");
    if (el) el.innerHTML = "";
  }

  function initBoard(bbox) {
    freeBoard();
    state.bbox = bbox.slice();
    const board = JXG.JSXGraph.initBoard("board", {
      boundingbox: bbox,
      keepaspectratio: false,
      axis: false,
      grid: false,
      showCopyright: false,
      showNavigation: false,
      showFullscreen: false,
      showInfobox: false,
      pan: { enabled: false, needTwoFingers: true },
      zoom: { enabled: false },
      selection: { enabled: false },
      defaultAxes: {},
    });
    board.containerObj.style.backgroundColor = COL.stage;
    board.containerObj.style.border = "none";
    state.board = board;
    state._freeing = false;
    applyBBox(board, state.bbox);
    return board;
  }

  function pt(board, coords, opts) {
    return board.create("point", coords, Object.assign({
      fixed: true,
      fillColor: COL.ink,
      strokeColor: COL.ink,
      size: 2.5,
      label: { fontSize: 18, color: COL.ink, offset: [8, 8], cssClass: "jg-label", highlight: false },
      highlight: false,
      withLabel: true,
    }, opts || {}));
  }

  function poly(board, points, opts) {
    return board.create("polygon", points, Object.assign({
      fillColor: "#f3ead8",
      fillOpacity: 0.85,
      borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false },
      vertices: { visible: false },
      highlight: false,
      hasInnerPoints: false,
    }, opts || {}));
  }

  function sectorPoly(board, coords, color, fill, nameOpts) {
    const points = coords.map((c, i) => board.create("point", c, {
      visible: false, fixed: true, withLabel: false, name: "",
    }));
    const p = board.create("polygon", points, {
      fillColor: fill,
      fillOpacity: 0.92,
      borders: { strokeColor: color, strokeWidth: 1.8, highlight: false },
      vertices: { visible: false },
      highlight: false,
      hasInnerPoints: false,
    });
    return { polygon: p, points };
  }

  function angleWedge(board, P, V, Q, radius, color, fill, label, labelOff) {
    const ang = interiorOrder([P.X(), P.Y()], [V.X(), V.Y()], [Q.X(), Q.Y()]);
    const coords = sectorCoords([V.X(), V.Y()], ang.from, ang.to, radius);
    const s = sectorPoly(board, coords, color, fill);
    if (label) {
      const mid = ang.mid;
      const lr = radius * 0.62;
      board.create("text", [
        V.X() + lr * Math.cos(mid) + (labelOff ? labelOff[0] : 0),
        V.Y() + lr * Math.sin(mid) + (labelOff ? labelOff[1] : 0),
        label,
      ], {
        fontSize: 18,
        color: color,
        strokeColor: color,
        anchorX: "middle",
        anchorY: "middle",
        highlight: false,
        fixed: true,
        cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      });
    }
    return { ang, sector: s };
  }

  function rightSquare(board, B, A, C, size) {
    const v1 = [A[0] - B[0], A[1] - B[1]];
    const v2 = [C[0] - B[0], C[1] - B[1]];
    const n1 = Math.hypot(v1[0], v1[1]) || 1;
    const n2 = Math.hypot(v2[0], v2[1]) || 1;
    const u1 = [v1[0] / n1 * size, v1[1] / n1 * size];
    const u2 = [v2[0] / n2 * size, v2[1] / n2 * size];
    const p1 = [B[0] + u1[0], B[1] + u1[1]];
    const p2 = [B[0] + u1[0] + u2[0], B[1] + u1[1] + u2[1]];
    const p3 = [B[0] + u2[0], B[1] + u2[1]];
    board.create("polygon", [B, p1, p2, p3], {
      fillColor: "none",
      fillOpacity: 0,
      borders: { strokeColor: COL.ink, strokeWidth: 1.6, highlight: false },
      vertices: { visible: false },
      highlight: false,
    });
  }

  function sideMarks(board, P, Q, n, color) {
    const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
    const dx = Q[0] - P[0], dy = Q[1] - P[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = -dy / len, uy = dx / len;
    const tick = 0.18;
    const gap = 0.12;
    const start = -((n - 1) / 2) * gap;
    for (let i = 0; i < n; i++) {
      const cx = mx + (dx / len) * (start + i * gap);
      const cy = my + (dy / len) * (start + i * gap);
      board.create("segment", [
        [cx - ux * tick, cy - uy * tick],
        [cx + ux * tick, cy + uy * tick],
      ], { strokeColor: color || COL.ink, strokeWidth: 1.6, highlight: false, fixed: true });
    }
  }

  function arrowHead(board, from, to, color, size) {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    const s = size || 0.28;
    const tip = to;
    const base = [to[0] - ux * s, to[1] - uy * s];
    board.create("polygon", [
      tip,
      [base[0] + px * s * 0.45, base[1] + py * s * 0.45],
      [base[0] - px * s * 0.45, base[1] - py * s * 0.45],
    ], {
      fillColor: color || COL.ink,
      fillOpacity: 1,
      borders: { strokeColor: color || COL.ink, strokeWidth: 0, highlight: false },
      vertices: { visible: false },
      highlight: false,
    });
  }

  function parallelChevrons(board, from, to, color, t) {
    const dx = to[0] - from[0], dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    const tt = (t == null) ? 0.5 : t;
    const mid = [from[0] + dx * tt, from[1] + dy * tt];
    const s = 0.26;
    const off = 0.10;
    const tip = [mid[0] + ux * s * 0.7 + px * off, mid[1] + uy * s * 0.7 + py * off];
    const a = [mid[0] - ux * s + px * (off + s * 0.55), mid[1] - uy * s + py * (off + s * 0.55)];
    const c = [mid[0] - ux * s + px * (off - s * 0.55), mid[1] - uy * s + py * (off - s * 0.55)];
    const opt = { strokeColor: color || COL.parallel, strokeWidth: 2.2, highlight: false, fixed: true };
    board.create("segment", [a, tip], opt);
    board.create("segment", [c, tip], opt);
  }

  function drawRuler(board, x0, x1, y, height) {
    const y0 = y - height, y1 = y;
    board.create("polygon", [
      [x0, y0], [x1, y0], [x1, y1], [x0, y1],
    ], {
      fillColor: COL.ruler,
      fillOpacity: 1,
      borders: { strokeColor: COL.rulerEdge, strokeWidth: 1.5, highlight: false },
      vertices: { visible: false },
      highlight: false,
    });
    const midY = (y0 + y1) / 2 + height * 0.12;
    board.create("segment", [[x0, y1], [x1, y1]], {
      strokeColor: COL.ink, strokeWidth: 2.4, highlight: false, fixed: true,
    });
    const step = 0.45;
    for (let x = x0 + 0.3; x < x1 - 0.2; x += step) {
      const long = Math.round((x - x0) / step) % 5 === 0;
      board.create("segment", [
        [x, y1],
        [x, y1 - (long ? height * 0.45 : height * 0.28)],
      ], { strokeColor: COL.rulerEdge, strokeWidth: 1, highlight: false, fixed: true });
    }
    board.create("text", [(x0 + x1) / 2, y0 + height * 0.32, "ruler"], {
      fontSize: 13,
      color: COL.rulerEdge,
      anchorX: "middle",
      anchorY: "middle",
      highlight: false,
      fixed: true,
      cssStyle: "font-weight:600;font-family:Source Sans 3,sans-serif;letter-spacing:0.06em;",
    });
    return { x0, x1, y: y1, mid: [(x0 + x1) / 2, y1] };
  }

  /* ---------- Mode A ---------- */

  function tearTriangleBox() {
    return { cx: 0, cy: 2.6, w: 8.6, h: 4.4 };
  }

  function buildTearSectorsData(preset) {
    const raw = triangleFromAngles(preset.a, preset.b, preset.c, 6);
    const tri = fitTriangle(raw, tearTriangleBox());
    const verts = {
      a: { name: "a", color: COL.a, fill: COL.aFill, V: tri.A, P: tri.B, Q: tri.C, measure: preset.a, vertex: "A" },
      b: { name: "b", color: COL.b, fill: COL.bFill, V: tri.B, P: tri.A, Q: tri.C, measure: preset.b, vertex: "B" },
      c: { name: "c", color: COL.c, fill: COL.cFill, V: tri.C, P: tri.A, Q: tri.B, measure: preset.c, vertex: "C" },
    };
    Object.values(verts).forEach((v) => {
      v.ang = interiorOrder(v.P, v.V, v.Q);
    });
    return { tri, verts, preset };
  }

  function drawTearFigure(data, showWedges) {
    const board = state.board;
    const { tri, verts, preset } = data;
    poly(board, [tri.A, tri.B, tri.C], { fillColor: "#f1e6cf", fillOpacity: 0.9 });
    const A = pt(board, tri.A, { name: "A", label: { offset: [0, 18], fontSize: 18, anchorX: "middle" } });
    const B = pt(board, tri.B, { name: "B", label: { offset: [-16, -14], fontSize: 18 } });
    const C = pt(board, tri.C, { name: "C", label: { offset: [10, -14], fontSize: 18 } });
    if (preset.id === "iso" || preset.id === "equilateral") {
      sideMarks(board, tri.A, tri.B, 1);
      sideMarks(board, tri.A, tri.C, 1);
      if (preset.id === "equilateral") sideMarks(board, tri.B, tri.C, 1);
    }
    if (preset.b === 90) rightSquare(board, tri.B, tri.A, tri.C, 0.38);
    if (showWedges) {
      const r = Math.min(
        Math.hypot(tri.A[0] - tri.B[0], tri.A[1] - tri.B[1]),
        Math.hypot(tri.A[0] - tri.C[0], tri.A[1] - tri.C[1]),
        Math.hypot(tri.B[0] - tri.C[0], tri.B[1] - tri.C[1])
      ) * 0.32;
      const radA = Math.max(0.55, Math.min(1.15, r));
      angleWedge(board, B, A, C, radA, COL.a, COL.aFill, "a");
      if (preset.b !== 90) angleWedge(board, A, B, C, radA * 0.95, COL.b, COL.bFill, "b");
      else {
        board.create("text", [tri.B[0] + 0.55, tri.B[1] + 0.55, "b"], {
          fontSize: 18, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
          cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
        });
      }
      angleWedge(board, A, C, B, radA * 0.95, COL.c, COL.cFill, "c");
    } else {
      // faint ghosts after tearing
      const r = 0.7;
      [[verts.a, COL.a], [verts.b, COL.b], [verts.c, COL.c]].forEach(([v, col]) => {
        const coords = sectorCoords(v.V, v.ang.from, v.ang.to, r);
        const g = sectorPoly(board, coords, col, col);
        if (g.polygon) {
          g.polygon.setAttribute({ fillOpacity: 0.12, borders: { strokeOpacity: 0.45 } });
        }
      });
    }
    return { A, B, C };
  }

  function placeSectorsOnRuler(verts, meeting, radius) {
    // Left to right: a, b, c filling the upper half-plane, shared apex on the ruler.
    const order = ["a", "b", "c"];
    let start = Math.PI; // left along the ruler
    const placed = {};
    order.forEach((key) => {
      const v = verts[key];
      const m = rad(v.measure);
      const from = start - m;
      const to = start;
      placed[key] = {
        apex: [meeting[0], meeting[1]],
        from, to, mid: (from + to) / 2,
        measureRad: m,
        radius, color: v.color, fill: v.fill, name: v.name, measure: v.measure,
        snapped: true,
      };
      start = from;
    });
    return placed;
  }

  function setSectorAngles(s, mid) {
    const m = s.measureRad;
    s.mid = mid;
    s.from = mid - m / 2;
    s.to = mid + m / 2;
  }

  function orientSectorUpward(s) {
    // Vertex will sit on the ruler; the sector opens into the upper half-plane,
    // bisector straight up (π/2). Used only for a lone sector on the ruler.
    setSectorAngles(s, Math.PI / 2);
  }

  function snappedKeys(sectors) {
    return ["a", "b", "c"].filter((k) => sectors[k] && sectors[k].snapped);
  }

  function orderByAngle(sectors, keys) {
    // Left to right: larger `to` (the left ray) comes first.
    return keys.slice().sort((p, q) => sectors[q].to - sectors[p].to);
  }

  function layoutCluster(sectors, keys, apex) {
    // Pack the given sectors (already in left-to-right order) so they share
    // one vertex on the ruler and sit side by side, opening upward.
    if (!keys.length) return;
    const M = keys.reduce((sum, k) => sum + sectors[k].measureRad, 0);
    let start = Math.PI / 2 + M / 2;
    if (start > Math.PI) start = Math.PI;
    if (start - M < 0) start = M;
    keys.forEach((key) => {
      const s = sectors[key];
      const m = s.measureRad;
      const from = start - m;
      const to = start;
      s.from = from;
      s.to = to;
      s.mid = (from + to) / 2;
      s.apex = [apex[0], apex[1]];
      start = from;
    });
  }

  function tornHomePositions(verts) {
    // Offset each sector a little away from the vertex, along the angle bisector but shortened.
    const homes = {};
    Object.values(verts).forEach((v) => {
      const mid = v.ang.mid;
      const measureRad = (typeof v.ang.abs === "number") ? v.ang.abs : rad(v.measure);
      homes[v.name] = {
        apex: [v.V[0] + Math.cos(mid) * 0.15, v.V[1] + Math.sin(mid) * 0.15],
        from: v.ang.from,
        to: v.ang.to,
        mid: v.ang.mid,
        measureRad: measureRad,
        radius: 1.15,
        color: v.color, fill: v.fill, name: v.name, measure: v.measure,
        snapped: false,
      };
    });
    return homes;
  }

  function drawLooseSectors(board, sectors, draggable, meeting, onSnapAll) {
    const handles = {};
    const rots = {};
    const polys = {};
    const rulerY = meeting[1];

    function syncRot(key) {
      const s = sectors[key];
      const handle = handles[key];
      const rot = rots[key];
      if (!handle || !rot) return;
      rot.setPositionDirectly(JXG.COORDS_BY_USER, [
        handle.X() + s.radius * Math.cos(s.mid),
        handle.Y() + s.radius * Math.sin(s.mid),
      ]);
    }

    function applySelection() {
      Object.keys(polys).forEach((key) => {
        const on = draggable && state.tear.selected === key;
        polys[key].setAttribute({
          borders: { strokeColor: sectors[key].color, strokeWidth: on ? 3.6 : 2, highlight: false },
        });
      });
      if (draggable) updateTearSelectionButtons();
    }

    function selectKey(key) {
      if (!draggable) return;
      state.tear.selected = key;
      applySelection();
    }

    function clampApexX(x) {
      const lo = meeting[0] - 4.4;
      const hi = meeting[0] + 4.4;
      return Math.max(lo, Math.min(hi, x));
    }

    function moveClusterHandles(keys) {
      keys.forEach((k) => {
        const sec = sectors[k];
        const h = handles[k];
        if (!sec || !h) return;
        h.setPositionDirectly(JXG.COORDS_BY_USER, sec.apex);
        syncRot(k);
      });
    }

    function nearRuler(handle) {
      return handle.Y() < rulerY + 1.85;
    }

    function nearCluster(handle) {
      const others = snappedKeys(sectors);
      if (!others.length) return false;
      const ax = sectors[others[0]].apex[0];
      const ay = rulerY;
      return Math.hypot(handle.X() - ax, handle.Y() - ay) < 2.8;
    }

    function snapSectorToRuler(key) {
      const s = sectors[key];
      const handle = handles[key];
      if (!s || !handle) return;
      const dropX = clampApexX(handle.X());
      const existing = snappedKeys(sectors).filter((k) => k !== key);

      if (existing.length === 0) {
        // First sector on the ruler: sit near the drop, vertex on the line, open upward.
        const apex = [dropX, rulerY];
        s.snapped = true;
        s.apex = apex;
        orientSectorUpward(s);
        handle.setPositionDirectly(JXG.COORDS_BY_USER, apex);
        syncRot(key);
      } else if (s.snapped) {
        // Already joined — keep the packing and slide the shared apex to the drop.
        const apex = [dropX, rulerY];
        const order = orderByAngle(sectors, existing.concat([key]));
        layoutCluster(sectors, order, apex);
        moveClusterHandles(order);
      } else {
        // Join the cluster: share the existing apex, attach on the side of approach.
        const apex = [existing[0] ? sectors[existing[0]].apex[0] : dropX, rulerY];
        apex[0] = clampApexX(apex[0]);
        const order = orderByAngle(sectors, existing);
        if (dropX < apex[0] - 0.12) order.unshift(key);
        else order.push(key);
        s.snapped = true;
        layoutCluster(sectors, order, apex);
        moveClusterHandles(order);
      }

      board.update();
      if (allSnapped() && typeof onSnapAll === "function") onSnapAll();
    }

    function rotateSector(key, delta) {
      const s = sectors[key];
      if (!s) return;
      const clustered = snappedKeys(sectors);
      if (s.snapped && clustered.length >= 2) {
        // Rotate the packed group as one piece, staying in the upper half-plane.
        const order = orderByAngle(sectors, clustered);
        const M = order.reduce((sum, k) => sum + sectors[k].measureRad, 0);
        let start = Math.max.apply(null, order.map((k) => sectors[k].to)) + delta;
        if (start > Math.PI) start = Math.PI;
        if (start - M < 0) start = M;
        const apex = [s.apex[0], rulerY];
        order.forEach((k) => {
          const m = sectors[k].measureRad;
          const from = start - m;
          const to = start;
          sectors[k].from = from;
          sectors[k].to = to;
          sectors[k].mid = (from + to) / 2;
          sectors[k].apex = [apex[0], apex[1]];
          start = from;
        });
        moveClusterHandles(order);
      } else {
        setSectorAngles(s, s.mid + delta);
        syncRot(key);
      }
      board.update();
    }

    function allSnapped() {
      return Object.keys(sectors).every((k) => sectors[k].snapped);
    }

    Object.keys(sectors).forEach((key) => {
      const s = sectors[key];
      if (!s.measureRad) s.measureRad = Math.abs(s.to - s.from) || rad(s.measure);
      const handle = board.create("point", s.apex, {
        name: "",
        size: draggable ? 6 : 1.5,
        fillColor: s.color,
        strokeColor: s.color,
        fillOpacity: 1,
        fixed: !draggable,
        withLabel: false,
        highlight: draggable,
        showInfobox: false,
        snapToGrid: false,
      });
      const labR = s.radius * 0.58;
      board.create("text", [
        () => handle.X() + labR * Math.cos(s.mid),
        () => handle.Y() + labR * Math.sin(s.mid),
        s.name,
      ], {
        fontSize: 18,
        color: s.color,
        anchorX: "middle",
        anchorY: "middle",
        highlight: false,
        fixed: true,
        cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
        parse: false,
      });
      const n = 20;
      const pts = [];
      pts.push(handle);
      for (let i = 0; i <= n; i++) {
        const iCopy = i;
        pts.push(board.create("point", [
          () => handle.X() + s.radius * Math.cos(s.from + (s.to - s.from) * (iCopy / n)),
          () => handle.Y() + s.radius * Math.sin(s.from + (s.to - s.from) * (iCopy / n)),
        ], { visible: false, withLabel: false, name: "" }));
      }
      const poly = board.create("polygon", pts, {
        fillColor: s.fill,
        fillOpacity: 0.95,
        borders: { strokeColor: s.color, strokeWidth: 2, highlight: false },
        vertices: { visible: false },
        highlight: false,
        hasInnerPoints: true,
      });
      handles[key] = handle;
      polys[key] = poly;

      if (draggable) {
        const rot = board.create("point", [
          s.apex[0] + s.radius * Math.cos(s.mid),
          s.apex[1] + s.radius * Math.sin(s.mid),
        ], {
          name: "↻",
          size: 6,
          fillColor: "#fff",
          strokeColor: s.color,
          strokeWidth: 2,
          fillOpacity: 1,
          fixed: false,
          withLabel: true,
          label: {
            fontSize: 16,
            color: s.color,
            offset: [8, 10],
            cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
          },
          highlight: true,
          showInfobox: false,
          snapToGrid: false,
        });
        rots[key] = rot;

        handle.on("down", function () { selectKey(key); });
        rot.on("down", function () { selectKey(key); });
        poly.on("down", function () { selectKey(key); });

        handle.on("drag", function () {
          if (s.snapped && handle.Y() > rulerY + 1.85) {
            s.snapped = false;
            s.apex = [handle.X(), handle.Y()];
            const remain = snappedKeys(sectors);
            if (remain.length) {
              const apex = [sectors[remain[0]].apex[0], rulerY];
              const order = orderByAngle(sectors, remain);
              layoutCluster(sectors, order, apex);
              moveClusterHandles(order);
            }
          } else if (s.snapped) {
            const pos = [handle.X(), handle.Y()];
            s.apex = pos;
            snappedKeys(sectors).filter((k) => k !== key).forEach((k) => {
              sectors[k].apex = pos;
              handles[k].setPositionDirectly(JXG.COORDS_BY_USER, pos);
              syncRot(k);
            });
          } else {
            s.apex = [handle.X(), handle.Y()];
          }
          syncRot(key);
        });

        handle.on("up", function () {
          selectKey(key);
          if (nearRuler(handle) || nearCluster(handle)) {
            snapSectorToRuler(key);
          }
        });

        rot.on("drag", function () {
          const clustered = snappedKeys(sectors);
          const ang = Math.atan2(rot.Y() - handle.Y(), rot.X() - handle.X());
          if (s.snapped && clustered.length >= 2) {
            const curr = s.mid;
            rotateSector(key, ang - curr);
          } else {
            setSectorAngles(s, ang);
            rot.setPositionDirectly(JXG.COORDS_BY_USER, [
              handle.X() + s.radius * Math.cos(s.mid),
              handle.Y() + s.radius * Math.sin(s.mid),
            ]);
          }
        });
      }
    });

    applySelection();

    tearUI = {
      board, sectors, handles, rots,
      snapSectorToRuler, rotateSector, selectKey, syncRot, applySelection,
    };
    if (typeof window !== "undefined") window.__tasTearUI = tearUI;
    return handles;
  }

  function updateTearSelectionButtons() {
    const side = document.getElementById("side");
    if (!side) return;
    side.querySelectorAll("[data-select-angle]").forEach((b) => {
      b.setAttribute("aria-pressed", b.getAttribute("data-select-angle") === state.tear.selected ? "true" : "false");
    });
  }

  function renderTearBoard() {
    const preset = TEAR_PRESETS[state.preset];
    const data = buildTearSectorsData(preset);
    const board = initBoard([-6.6, 6.5, 6.6, -3.6]);
    const ruler = drawRuler(board, -5.2, 5.2, -1.55, 0.7);
    const meeting = [0, ruler.y];
    const phase = state.tear.phase;

    if (phase === "intact") {
      drawTearFigure(data, true);
    } else if (phase === "torn") {
      drawTearFigure(data, false);
      let homes;
      if (state.tear.loose && state.tear.loosePreset === state.preset) {
        homes = state.tear.loose;
      } else {
        homes = tornHomePositions(data.verts);
        state.tear.loose = homes;
        state.tear.loosePreset = state.preset;
        if (!state.tear.selected) state.tear.selected = "a";
      }
      state.tear._verts = data.verts;
      state.tear._meeting = meeting;
      drawLooseSectors(board, homes, true, meeting, function () {
        state.tear.phase = "placed";
        state.tear.loose = null;
        state.tear.loosePreset = null;
        renderAll();
      });
    } else {
      // placed or revealed: sectors sit on the ruler, triangle remains as ghost
      drawTearFigure(data, false);
      const placed = placeSectorsOnRuler(data.verts, meeting, 1.45);
      drawLooseSectors(board, placed, false, meeting, null);
    }
  }

  function renderTearSide() {
    const side = document.getElementById("side");
    const preset = TEAR_PRESETS[state.preset];
    const phase = state.tear.phase;
    side.innerHTML = "";

    const h = document.createElement("h2");
    h.textContent = "Tear and join";
    side.appendChild(h);

    const lede = document.createElement("p");
    lede.className = "lede";
    lede.textContent = "Tear off the three interior angles and fit them together against the ruler.";
    side.appendChild(lede);

    const legend = document.createElement("ul");
    legend.className = "legend";
    legend.innerHTML = '<li><i class="a"></i>angle <em>a</em> at <em>A</em></li><li><i class="b"></i>angle <em>b</em> at <em>B</em></li><li><i class="c"></i>angle <em>c</em> at <em>C</em></li>';
    side.appendChild(legend);

    const lab = document.createElement("p");
    lab.className = "kicker-free";
    lab.textContent = "Choose a triangle";
    side.appendChild(lab);

    const row = document.createElement("div");
    row.className = "row";
    Object.values(TEAR_PRESETS).forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = p.label;
      b.setAttribute("aria-pressed", p.id === state.preset ? "true" : "false");
      b.addEventListener("click", () => {
        state.preset = p.id;
        state.tear = { phase: "intact", chosen: null, sectors: null, loose: null, loosePreset: null, selected: "a" };
        setHash(p.hash);
        renderAll();
      });
      row.appendChild(b);
    });
    side.appendChild(row);

    const actions = document.createElement("div");
    actions.className = "row";
    const tearBtn = document.createElement("button");
    tearBtn.type = "button";
    tearBtn.className = "btn btn-wide";
    tearBtn.setAttribute("data-action", "tear");
    tearBtn.textContent = "Tear the angles";
    tearBtn.disabled = phase !== "intact";
    tearBtn.addEventListener("click", () => {
      state.tear.phase = "torn";
      state.tear.chosen = null;
      state.tear.loose = null;
      state.tear.loosePreset = null;
      state.tear.selected = "a";
      renderAll();
    });
    const fitBtn = document.createElement("button");
    fitBtn.type = "button";
    fitBtn.className = "btn-accent btn-wide";
    fitBtn.setAttribute("data-action", "fit");
    fitBtn.textContent = "Fit them against the ruler";
    if (phase === "placed" || phase === "revealed") fitBtn.disabled = true;
    fitBtn.addEventListener("click", () => {
      state.tear.phase = "placed";
      state.tear.chosen = null;
      state.tear.loose = null;
      state.tear.loosePreset = null;
      renderAll();
    });
    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn-ghost btn-wide";
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", () => {
      state.tear = { phase: "intact", chosen: null, sectors: null, loose: null, loosePreset: null, selected: "a" };
      tearUI = null;
      renderAll();
    });
    actions.appendChild(tearBtn);
    actions.appendChild(fitBtn);
    actions.appendChild(resetBtn);
    side.appendChild(actions);

    if (phase === "torn") {
      const hint = document.createElement("p");
      hint.className = "lede";
      hint.textContent = "Drag each coloured corner onto the ruler. The first one sits where you drop it, with the vertex on the line and the angle opening upwards. Drop another onto the ruler, or next to a sector already there, and they snap together around one vertex.";
      side.appendChild(hint);
      const hint2 = document.createElement("p");
      hint2.className = "lede";
      hint2.textContent = "When all three join they form a straight angle. To turn a sector yourself before they are fully packed, select it and press Rotate, or drag the small circle (↻) on its arc.";
      side.appendChild(hint2);

      const pickLab = document.createElement("p");
      pickLab.className = "kicker-free";
      pickLab.textContent = "Turn a sector";
      side.appendChild(pickLab);

      if (!state.tear.selected) state.tear.selected = "a";
      const pick = document.createElement("div");
      pick.className = "row";
      ["a", "b", "c"].forEach((key) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice btn-wide";
        b.setAttribute("data-select-angle", key);
        b.setAttribute("aria-pressed", state.tear.selected === key ? "true" : "false");
        b.textContent = "Angle " + key;
        b.addEventListener("click", () => {
          state.tear.selected = key;
          if (tearUI && tearUI.selectKey) tearUI.selectKey(key);
          else updateTearSelectionButtons();
        });
        pick.appendChild(b);
      });
      side.appendChild(pick);

      const rotRow = document.createElement("div");
      rotRow.className = "row";
      const left = document.createElement("button");
      left.type = "button";
      left.className = "btn btn-wide";
      left.setAttribute("data-action", "rotate-left");
      left.textContent = "↺  Rotate left";
      left.addEventListener("click", () => {
        if (!tearUI) return;
        const key = state.tear.selected || "a";
        tearUI.selectKey(key);
        tearUI.rotateSector(key, Math.PI / 6);
      });
      const right = document.createElement("button");
      right.type = "button";
      right.className = "btn btn-wide";
      right.setAttribute("data-action", "rotate-right");
      right.textContent = "Rotate right  ↻";
      right.addEventListener("click", () => {
        if (!tearUI) return;
        const key = state.tear.selected || "a";
        tearUI.selectKey(key);
        tearUI.rotateSector(key, -Math.PI / 6);
      });
      rotRow.appendChild(left);
      rotRow.appendChild(right);
      side.appendChild(rotRow);
    }

    if (phase === "placed" || phase === "revealed") {
      const q = document.createElement("p");
      q.className = "prompt-q";
      q.textContent = "What do these three angles form?";
      side.appendChild(q);
      const opts = document.createElement("div");
      opts.className = "options";
      const showOpts = phase === "revealed" ? ANGLE_OPTIONS.filter((o) => o.id === "straight") : ANGLE_OPTIONS;
      showOpts.forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = opt.label;
        if (phase === "revealed" && opt.id === "straight") b.classList.add("is-correct");
        b.addEventListener("click", () => {
          if (phase === "revealed") return;
          state.tear.chosen = opt.id;
          if (opt.id === "straight") state.tear.phase = "revealed";
          renderAll();
        });
        opts.appendChild(b);
      });
      side.appendChild(opts);

      if (phase === "placed" && state.tear.chosen && state.tear.chosen !== "straight") {
        const fb = document.createElement("p");
        fb.className = "feedback bad";
        fb.textContent = "Not quite — look at the ruler. What kind of angle lies along a straight line?";
        side.appendChild(fb);
      }

      if (phase === "placed") {
        const reveal = document.createElement("button");
        reveal.type = "button";
        reveal.className = "btn-ghost";
        reveal.setAttribute("data-action", "reveal");
        reveal.textContent = "Reveal";
        reveal.addEventListener("click", () => {
          state.tear.phase = "revealed";
          if (!state.tear.chosen) state.tear.chosen = "straight";
          renderAll();
        });
        side.appendChild(reveal);
      }
    }

    if (phase === "revealed") {
      if (state.tear.chosen && state.tear.chosen !== "straight") {
        const fb = document.createElement("p");
        fb.className = "feedback";
        fb.textContent = "They form a straight angle.";
        side.appendChild(fb);
      } else {
        const fb = document.createElement("p");
        fb.className = "feedback ok";
        fb.textContent = "They form a straight angle.";
        side.appendChild(fb);
      }
      const box = document.createElement("div");
      box.className = "theorem";
      const p1 = document.createElement("p");
      p1.textContent = "The sum of the three interior angles of a triangle is 180°.";
      box.appendChild(p1);
      const p2 = document.createElement("p");
      p2.textContent = "In other words, the sum of all the interior angles of a triangle is 180°.";
      box.appendChild(p2);
      box.appendChild(spanTex("\\text{i.e. In }\\triangle ABC,\\quad a + b + c = 180^{\\circ}", true));
      const ab = document.createElement("p");
      ab.className = "abbrev";
      ab.textContent = "Abbreviation: ∠ sum of △";
      box.appendChild(ab);
      const measures = document.createElement("p");
      measures.className = "num";
      measures.textContent = "In this triangle, a = " + preset.a + "°, b = " + preset.b + "°, c = " + preset.c + "°.";
      box.appendChild(measures);
      side.appendChild(box);
    }
  }

  /* ---------- Mode B ---------- */

  function proofGeometry() {
    // Scalene acute, DE horizontal through A, BC horizontal.
    const raw = triangleFromAngles(50, 60, 70, 6);
    const tri = fitTriangle(raw, { cx: 0, cy: 0.55, w: 8.2, h: 4.4 });
    const A = tri.A, B = tri.B, C = tri.C;
    const left = -5.3, right = 5.3;
    const DE_y = A[1];
    return {
      A, B, C,
      D: [left, DE_y],
      E: [right, DE_y],
    };
  }

  function renderProofBoard() {
    const g = proofGeometry();
    const board = initBoard([-6.4, 4.8, 6.4, -3.4]);
    const step = state.proof.step;

    // Triangle always (step >= 1)
    poly(board, [g.A, g.B, g.C], { fillColor: "#f1e6cf", fillOpacity: 0.85 });
    const A = pt(board, g.A, { name: "A", label: { offset: [0, 16], fontSize: 18, anchorX: "middle" } });
    const B = pt(board, g.B, { name: "B", label: { offset: [-16, -16], fontSize: 18 } });
    const C = pt(board, g.C, { name: "C", label: { offset: [12, -16], fontSize: 18 } });

    const rA = 0.85, rB = 0.75, rC = 0.75;
    const showCorr = state.proof.correspondence && step >= 5;
    if (step >= 1) {
      if (!showCorr) angleWedge(board, B, A, C, rA, COL.a, COL.aFill, "a");
      angleWedge(board, A, B, C, rB, COL.b, COL.bFill, "b");
      angleWedge(board, A, C, B, rC, COL.c, COL.cFill, "c");
    }

    if (step >= 2) {
      board.create("segment", [g.D, g.E], {
        strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true,
      });
      pt(board, g.D, { name: "D", size: 2, label: { offset: [-16, 10], fontSize: 18 } });
      pt(board, g.E, { name: "E", size: 2, label: { offset: [10, 10], fontSize: 18 } });
      // extend BC slightly to look like a line
      const Bext = [g.B[0] - 1.1, g.B[1]];
      const Cext = [g.C[0] + 1.1, g.C[1]];
      board.create("segment", [Bext, Cext], {
        strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true,
      });
      parallelChevrons(board, g.D, g.A, COL.parallel, 0.45);
      parallelChevrons(board, g.B, g.C, COL.parallel, 0.55);
      board.create("text", [0, g.A[1] + 0.85, "DE ∥ BC is drawn for you"], {
        fontSize: 14,
        color: COL.muted,
        anchorX: "middle",
        highlight: false,
        fixed: true,
        cssStyle: "font-family:Source Sans 3,sans-serif;",
        parse: false,
      });
    }

    function highlightPair(P1, V1, Q1, P2, V2, Q2, color, fill, radius) {
      angleWedge(board, P1, V1, Q1, radius, color, fill, null);
      angleWedge(board, P2, V2, Q2, radius, color, fill, null);
    }

    // Alternate pair 1: ∠BAD and ∠ABC (= b)
    if (!showCorr && step >= 3 && (state.proof.reason3 || step > 3)) {
      const Dpt = board.create("point", g.D, { visible: false, withLabel: false, fixed: true, name: "" });
      angleWedge(board, Dpt, A, B, 1.15, COL.b, COL.bFill, "b");
    }

    // Alternate pair 2: ∠CAE and ∠ACB (= c)
    if (!showCorr && step >= 4 && (state.proof.reason4 || step > 4)) {
      const Ept = board.create("point", g.E, { visible: false, withLabel: false, fixed: true, name: "" });
      angleWedge(board, C, A, Ept, 1.15, COL.c, COL.cFill, "c");
    }

    if (step >= 5) {
      board.create("text", [g.A[0], g.A[1] + 0.72, "straight angle ∠DAE"], {
        fontSize: 13,
        color: COL.muted,
        anchorX: "middle",
        highlight: false,
        fixed: true,
        cssStyle: "font-family:Source Sans 3,sans-serif;",
        parse: false,
      });
    }

    if (showCorr) {
      // Coloured sectors sit on DE, triangle side: left b = ∠BAD, middle a = ∠BAC, right c = ∠CAE.
      const meeting = [g.A[0], g.A[1]];
      const R = 1.45;
      const measA = interiorOrder(g.B, g.A, g.C).abs;
      const measB = interiorOrder(g.A, g.B, g.C).abs;
      const measC = interiorOrder(g.A, g.C, g.B).abs;
      let start = Math.PI;
      const seq = [
        { m: measB, color: COL.b, fill: COL.bFill, name: "b" },
        { m: measA, color: COL.a, fill: COL.aFill, name: "a" },
        { m: measC, color: COL.c, fill: COL.cFill, name: "c" },
      ];
      seq.forEach((s) => {
        const from = start;
        const to = start + s.m;
        const coords = sectorCoords(meeting, from, to, R);
        sectorPoly(board, coords, s.color, s.fill);
        const mid = (from + to) / 2;
        board.create("text", [
          meeting[0] + (R * 0.62) * Math.cos(mid),
          meeting[1] + (R * 0.62) * Math.sin(mid),
          s.name,
        ], {
          fontSize: 18, color: s.color, anchorX: "middle", anchorY: "middle",
          highlight: false, fixed: true,
          cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
          parse: false,
        });
        start = to;
      });
    }
  }

  function proofCaptionFix() {
    // Replace "DE \\parallel BC..." if it appeared as raw TeX — we already intended unicode.
    // Recreate caption properly by setting text after board init is awkward; draw with unicode originally.
  }

  function renderProofSide() {
    const side = document.getElementById("side");
    side.innerHTML = "";
    const h = document.createElement("h2");
    h.textContent = "Appendix proof";
    side.appendChild(h);
    const lede = document.createElement("p");
    lede.className = "lede";
    lede.textContent = "We prove that the sum of all the interior angles of a triangle is 180° by using alternate angles on parallel lines.";
    side.appendChild(lede);

    const steps = [
      {
        n: 1,
        html: null,
        text: "Draw △ABC and label the interior angles a, b and c.",
      },
      {
        n: 2,
        text: "Construct a line DE passing through A and parallel to BC.",
      },
      {
        n: 3,
        text: "Look at the first pair of alternate angles.",
        ask: "Why is ∠BAD = ∠ABC?",
        reason: "alt. ∠s, DE ∥ BC",
        result: "∠BAD = ∠ABC = b",
        reasonKey: "reason3",
      },
      {
        n: 4,
        text: "Look at the second pair of alternate angles.",
        ask: "Why is ∠CAE = ∠ACB?",
        reason: "alt. ∠s, DE ∥ BC",
        result: "∠CAE = ∠ACB = c",
        reasonKey: "reason4",
      },
      {
        n: 5,
        text: "∠DAE is a straight angle, so ∠DAE = 180°.",
      },
    ];

    const ol = document.createElement("ol");
    ol.className = "step-list";
    steps.forEach((s) => {
      const li = document.createElement("li");
      li.className = "step";
      const cur = state.proof.step;
      if (s.n === cur) li.classList.add("is-active");
      if (s.n > cur) li.classList.add("is-dim");
      if (s.n < cur) li.classList.add("is-done");
      const lab = document.createElement("div");
      lab.className = "n";
      lab.textContent = "Step " + s.n + " of 5";
      li.appendChild(lab);
      const p = document.createElement("p");
      p.textContent = s.text;
      li.appendChild(p);
      if (s.n <= cur && s.ask) {
        const ask = document.createElement("p");
        ask.className = "reason";
        ask.textContent = s.ask;
        li.appendChild(ask);
        const revealed = state.proof[s.reasonKey];
        if (!revealed && s.n === cur) {
          const rb = document.createElement("button");
          rb.type = "button";
          rb.className = "btn-accent";
          rb.style.marginTop = "8px";
          rb.setAttribute("data-action", "reason");
          rb.textContent = "Show the reason";
          rb.addEventListener("click", () => {
            state.proof[s.reasonKey] = true;
            renderAll();
          });
          li.appendChild(rb);
        } else if (revealed || s.n < cur) {
          const res = document.createElement("div");
          res.className = "reason filled";
          res.textContent = s.result + "    (" + s.reason + ")";
          li.appendChild(res);
        }
      }
      if (s.n === 5 && cur >= 5) {
        const box = document.createElement("div");
        box.className = "theorem";
        box.style.marginTop = "8px";
        box.appendChild(spanTex("\\angle BAC + \\angle BAD + \\angle CAE = \\angle DAE", true));
        box.appendChild(spanTex("a + b + c = 180^{\\circ}", true));
        const thus = document.createElement("p");
        thus.textContent = "Thus, the sum of all interior angles of a triangle is 180°.";
        box.appendChild(thus);
        const ab = document.createElement("p");
        ab.className = "abbrev";
        ab.textContent = "Abbreviation: ∠ sum of △";
        box.appendChild(ab);
        li.appendChild(box);
      }
      ol.appendChild(li);
    });
    side.appendChild(ol);

    const nav = document.createElement("div");
    nav.className = "row";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn-ghost btn-wide";
    back.textContent = "Back";
    back.disabled = state.proof.step <= 1;
    back.addEventListener("click", () => {
      if (state.proof.step === 3) state.proof.reason3 = false;
      if (state.proof.step === 4) state.proof.reason4 = false;
      if (state.proof.step === 5) state.proof.correspondence = false;
      state.proof.step = Math.max(1, state.proof.step - 1);
      renderAll();
    });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-wide";
    next.setAttribute("data-action", "next");
    next.textContent = state.proof.step >= 5 ? "Proof complete" : "Next step";
    next.disabled = state.proof.step >= 5 ||
      (state.proof.step === 3 && !state.proof.reason3) ||
      (state.proof.step === 4 && !state.proof.reason4);
    next.addEventListener("click", () => {
      state.proof.step = Math.min(5, state.proof.step + 1);
      renderAll();
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn-ghost btn-wide";
    reset.textContent = "Reset proof";
    reset.addEventListener("click", () => {
      state.proof = { step: 1, reason3: false, reason4: false, correspondence: false };
      renderAll();
    });
    nav.appendChild(back);
    nav.appendChild(next);
    nav.appendChild(reset);
    side.appendChild(nav);

    if (state.proof.step >= 5) {
      const corr = document.createElement("button");
      corr.type = "button";
      corr.className = state.proof.correspondence ? "btn-ghost" : "btn-accent";
      corr.setAttribute("data-action", "correspondence");
      corr.textContent = state.proof.correspondence
        ? "Hide the angles on DE"
        : "Show the angles on DE";
      corr.addEventListener("click", () => {
        state.proof.correspondence = !state.proof.correspondence;
        renderAll();
      });
      side.appendChild(corr);
      if (state.proof.correspondence) {
        const note = document.createElement("p");
        note.className = "lede";
        note.textContent = "The same coloured sectors sit on the straight line DE: ∠BAD, ∠BAC and ∠CAE form the straight angle ∠DAE.";
        side.appendChild(note);
      }
    }
  }

  /* ---------- Mode C ---------- */

  function drawEx53(board) {
    // P = 60°, Q = 65°, R = 55°
    const raw = triangleFromAngles(60, 65, 55, 6);
    const tri = fitTriangle(raw, { cx: 0, cy: 0.3, w: 8.2, h: 5.2 });
    poly(board, [tri.A, tri.B, tri.C], { fillColor: "#f1e6cf", fillOpacity: 0.9 });
    const P = pt(board, tri.A, { name: "P", label: { offset: [0, 18], fontSize: 20, anchorX: "middle" } });
    const Q = pt(board, tri.B, { name: "Q", label: { offset: [-16, -16], fontSize: 20 } });
    const R = pt(board, tri.C, { name: "R", label: { offset: [12, -16], fontSize: 20 } });
    const r = 0.85;
    angleWedge(board, Q, P, R, r, COL.a, COL.aFill, "60°");
    angleWedge(board, P, Q, R, r, COL.b, COL.bFill, "65°");
    // R unknown: small arc, no measure (or ? after reveal)
    const angR = interiorOrder(tri.A, tri.C, tri.B);
    const coords = sectorCoords(tri.C, angR.from, angR.to, 0.7);
    sectorPoly(board, coords, COL.c, COL.cFill);
    const lab = state.practice.step >= 3 && state.item === "ex53" ? "55°" : "";
    if (lab) {
      const mid = angR.mid;
      board.create("text", [
        tri.C[0] + 0.45 * Math.cos(mid),
        tri.C[1] + 0.45 * Math.sin(mid),
        lab,
      ], {
        fontSize: 18, color: COL.c, anchorX: "middle", highlight: false, fixed: true,
        cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      });
    }
  }

  function drawQp53(board) {
    // A = 100°, B = 43°, C = 37°
    const raw = triangleFromAngles(100, 43, 37, 6);
    const tri = fitTriangle(raw, { cx: 0, cy: 0.1, w: 8.8, h: 4.6 });
    poly(board, [tri.A, tri.B, tri.C], { fillColor: "#f1e6cf", fillOpacity: 0.9 });
    const A = pt(board, tri.A, { name: "A", label: { offset: [0, 18], fontSize: 20, anchorX: "middle" } });
    const B = pt(board, tri.B, { name: "B", label: { offset: [-16, -16], fontSize: 20 } });
    const C = pt(board, tri.C, { name: "C", label: { offset: [12, -16], fontSize: 20 } });
    const r = 0.8;
    const angA = interiorOrder(tri.B, tri.A, tri.C);
    const coords = sectorCoords(tri.A, angA.from, angA.to, 0.7);
    sectorPoly(board, coords, COL.a, COL.aFill);
    if (state.practice.step >= 3 && state.item === "qp53") {
      const mid = angA.mid;
      board.create("text", [
        tri.A[0] + 0.42 * Math.cos(mid),
        tri.A[1] + 0.42 * Math.sin(mid),
        "100°",
      ], {
        fontSize: 18, color: COL.a, anchorX: "middle", highlight: false, fixed: true,
        cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      });
    }
    angleWedge(board, A, B, C, r, COL.b, COL.bFill, "43°");
    angleWedge(board, A, C, B, r, COL.c, COL.cFill, "37°");
  }

  function drawEx54(board, highlight) {
    // AB vertical, BCD horizontal, ∠ABC = 90°, ∠ACB = 66°, ∠BAC = 24°, ∠CAD = 34°, ∠ADB = 32°
    const h = 4.4;
    const cLen = h * Math.tan(rad(24));
    const dLen = h * Math.tan(rad(58));
    const B = [0, 0], C = [cLen, 0], D = [dLen, 0], A = [0, h];
    const raw = { A, B, C, D };
    // fit into box
    const pts = [A, B, C, D];
    let minX = 0, minY = 0, maxX = dLen, maxY = h;
    const w = maxX - minX, ht = maxY - minY;
    const box = { cx: 0.3, cy: 0.35, w: 8.4, h: 5.2 };
    const scale = Math.min(box.w / w, box.h / ht);
    const map = (p) => [
      (p[0] - w / 2) * scale + box.cx,
      (p[1] - ht / 2) * scale + box.cy,
    ];
    const a = map(A), b = map(B), c = map(C), d = map(D);

    // highlight fills
    const hl = highlight || "none";
    if (hl === "ABC") {
      poly(board, [a, b, c], { fillColor: "#dcecdc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [a, d], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else if (hl === "ABD") {
      poly(board, [a, b, d], { fillColor: "#f3e1cc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [a, c], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else {
      poly(board, [a, b, d], { fillColor: "#f1e6cf", fillOpacity: 0.85 });
      board.create("segment", [a, c], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    }

    // straight line BCD with a little extension and arrow
    const ext = [d[0] + 0.85, d[1]];
    board.create("segment", [ [b[0] - 0.5, b[1]], ext ], {
      strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true,
    });
    arrowHead(board, d, ext, COL.ink, 0.32);

    const Ap = pt(board, a, { name: "A", label: { offset: [-14, 16], fontSize: 20 } });
    const Bp = pt(board, b, { name: "B", label: { offset: [-18, -16], fontSize: 20 } });
    const Cp = pt(board, c, { name: "C", label: { offset: [-6, -18], fontSize: 20 } });
    const Dp = pt(board, d, { name: "D", label: { offset: [12, -16], fontSize: 20 } });

    rightSquare(board, b, a, d, 0.38);

    const r = 0.85;
    const showX = state.practice.step >= 3 && state.item === "ex54";
    const showY = state.practice.step >= 6 && state.item === "ex54";

    // x = ∠BAC (narrow 24° wedge: put the label further along the bisector)
    const angX = interiorOrder(b, a, c);
    const sx = sectorCoords(a, angX.from, angX.to, r);
    sectorPoly(board, sx, COL.a, COL.aFill);
    const midX = angX.mid;
    board.create("text", [
      a[0] + 1.05 * Math.cos(midX),
      a[1] + 1.05 * Math.sin(midX),
      showX ? "24°" : "x",
    ], {
      fontSize: 20, color: COL.a, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });

    // 34° = ∠CAD
    const ang34 = interiorOrder(c, a, d);
    const s34 = sectorCoords(a, ang34.from, ang34.to, r * 1.12);
    sectorPoly(board, s34, COL.b, COL.bFill);
    const mid34 = ang34.mid;
    board.create("text", [
      a[0] + 0.82 * Math.cos(mid34),
      a[1] + 0.82 * Math.sin(mid34),
      "34°",
    ], {
      fontSize: 17, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });

    // 66° at C
    angleWedge(board, Ap, Cp, Bp, 0.7, COL.c, COL.cFill, "66°");

    // y at D
    const angY = interiorOrder(a, d, b);
    const sy = sectorCoords(d, angY.from, angY.to, 0.7);
    sectorPoly(board, sy, COL.b, COL.bFill);
    const midY = angY.mid;
    board.create("text", [
      d[0] + 0.72 * Math.cos(midY),
      d[1] + 0.72 * Math.sin(midY),
      showY ? "32°" : "y",
    ], {
      fontSize: 18, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
    });
  }

  function drawTe53(board) {
    // Teaching Example 5.3: ∠A = 80°, ∠C = 45°, ∠B = 55°.
    const raw = triangleFromAngles(80, 55, 45, 6);
    const tri = fitTriangle(raw, { cx: 0, cy: 0.25, w: 8.4, h: 5.1 });
    poly(board, [tri.A, tri.B, tri.C], { fillColor: "#f1e6cf", fillOpacity: 0.9 });
    const A = pt(board, tri.A, { name: "A", label: { offset: [0, 18], fontSize: 20, anchorX: "middle" } });
    const B = pt(board, tri.B, { name: "B", label: { offset: [-16, -16], fontSize: 20 } });
    const C = pt(board, tri.C, { name: "C", label: { offset: [12, -16], fontSize: 20 } });
    const r = 0.85;
    angleWedge(board, B, A, C, r, COL.a, COL.aFill, "80°");
    angleWedge(board, A, C, B, r, COL.c, COL.cFill, "45°");
    const angB = interiorOrder(tri.A, tri.B, tri.C);
    const coords = sectorCoords(tri.B, angB.from, angB.to, 0.7);
    sectorPoly(board, coords, COL.b, COL.bFill);
    if (state.practice.step >= 3 && state.item === "te53") {
      const mid = angB.mid;
      board.create("text", [
        tri.B[0] + 0.48 * Math.cos(mid),
        tri.B[1] + 0.48 * Math.sin(mid),
        "55°",
      ], {
        fontSize: 18, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
        cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      });
    }
  }

  function drawTe54(board, highlight) {
    // Teaching Example 5.4: QRS is a straight line.
    // △PQR: x = ∠QPR = 28°, ∠PQR = 52°, ∠PRQ = 100°.
    // △PRS: ∠RPS = 64°, ∠PRS = 80°, y = ∠PSR = 36°.
    const raw = triangleFromAngles(28, 52, 100, 6);
    const P0 = raw.A, Q0 = raw.B, R0 = raw.C;
    const S0 = thirdPointOnBase(P0, R0, Q0[1], R0[0], 64);
    const fitted = fitPoints([P0, Q0, R0, S0], { cx: 0.15, cy: 0.2, w: 10.2, h: 5.1 });
    const P = fitted.map(P0), Q = fitted.map(Q0), R = fitted.map(R0), S = fitted.map(S0);

    const hl = highlight || "none";
    if (hl === "PQR") {
      poly(board, [P, Q, R], { fillColor: "#dcecdc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [P, S], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else if (hl === "PRS") {
      poly(board, [P, R, S], { fillColor: "#f3e1cc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [P, Q], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else {
      poly(board, [P, Q, S], { fillColor: "#f1e6cf", fillOpacity: 0.85 });
      board.create("segment", [P, R], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    }

    const extL = [Q[0] - 0.55, Q[1]];
    const extR = [S[0] + 0.7, S[1]];
    board.create("segment", [extL, extR], {
      strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true,
    });

    const Pp = pt(board, P, { name: "P", label: { offset: [0, 18], fontSize: 20, anchorX: "middle" } });
    const Qp = pt(board, Q, { name: "Q", label: { offset: [-16, -16], fontSize: 20 } });
    const Rp = pt(board, R, { name: "R", label: { offset: [-4, -18], fontSize: 20 } });
    const Sp = pt(board, S, { name: "S", label: { offset: [12, -16], fontSize: 20 } });

    const showX = state.practice.step >= 3 && state.item === "te54";
    const showY = state.practice.step >= 6 && state.item === "te54";

    // x at P in △PQR
    const angX = interiorOrder(Q, P, R);
    sectorPoly(board, sectorCoords(P, angX.from, angX.to, 0.9), COL.a, COL.aFill);
    board.create("text", [
      P[0] + 1.12 * Math.cos(angX.mid),
      P[1] + 1.12 * Math.sin(angX.mid),
      showX ? "28°" : "x",
    ], {
      fontSize: 20, color: COL.a, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });

    // 64° at P in △PRS
    angleWedge(board, Rp, Pp, Sp, 0.95, COL.b, COL.bFill, "64°");

    // 52° at Q
    angleWedge(board, Pp, Qp, Rp, 0.75, COL.c, COL.cFill, "52°");

    // 100° at R in △PQR
    angleWedge(board, Pp, Rp, Qp, 0.62, COL.a, COL.aFill, "100°");

    // y at S
    const angY = interiorOrder(P, S, R);
    sectorPoly(board, sectorCoords(S, angY.from, angY.to, 0.7), COL.b, COL.bFill);
    board.create("text", [
      S[0] + 0.72 * Math.cos(angY.mid),
      S[1] + 0.72 * Math.sin(angY.mid),
      showY ? "36°" : "y",
    ], {
      fontSize: 18, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });
  }

  function drawQp54(board, highlight) {
    // Quick Practice 5.4: BCD is a straight line.
    // △ABC: x = ∠BAC = 72°, ∠ABC = 32°, ∠ACB = 76°.
    // △ACD: y = ∠CAD = 30°, ∠ACD = 104°, ∠ADC = 46°.
    const raw = triangleFromAngles(72, 32, 76, 6);
    const A0 = raw.A, B0 = raw.B, C0 = raw.C;
    const D0 = thirdPointOnBase(A0, C0, B0[1], C0[0], 30);
    const fitted = fitPoints([A0, B0, C0, D0], { cx: 0.15, cy: 0.25, w: 10.2, h: 5.0 });
    const A = fitted.map(A0), B = fitted.map(B0), C = fitted.map(C0), D = fitted.map(D0);

    const hl = highlight || "none";
    if (hl === "ABC") {
      poly(board, [A, B, C], { fillColor: "#dcecdc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [A, D], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else if (hl === "ACD") {
      poly(board, [A, C, D], { fillColor: "#f3e1cc", fillOpacity: 0.95, borders: { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false } });
      board.create("segment", [A, B], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    } else {
      poly(board, [A, B, D], { fillColor: "#f1e6cf", fillOpacity: 0.85 });
      board.create("segment", [A, C], { strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true });
    }

    const extL = [B[0] - 0.55, B[1]];
    const extR = [D[0] + 0.7, D[1]];
    board.create("segment", [extL, extR], {
      strokeColor: COL.ink, strokeWidth: 2.2, highlight: false, fixed: true,
    });

    const Ap = pt(board, A, { name: "A", label: { offset: [0, 18], fontSize: 20, anchorX: "middle" } });
    const Bp = pt(board, B, { name: "B", label: { offset: [-16, -16], fontSize: 20 } });
    const Cp = pt(board, C, { name: "C", label: { offset: [-4, -18], fontSize: 20 } });
    const Dp = pt(board, D, { name: "D", label: { offset: [12, -16], fontSize: 20 } });

    const showX = state.practice.step >= 3 && state.item === "qp54";
    const showY = state.practice.step >= 6 && state.item === "qp54";

    const angX = interiorOrder(B, A, C);
    sectorPoly(board, sectorCoords(A, angX.from, angX.to, 0.95), COL.a, COL.aFill);
    board.create("text", [
      A[0] + 0.62 * Math.cos(angX.mid),
      A[1] + 0.62 * Math.sin(angX.mid),
      showX ? "72°" : "x",
    ], {
      fontSize: 20, color: COL.a, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });

    const angY = interiorOrder(C, A, D);
    sectorPoly(board, sectorCoords(A, angY.from, angY.to, 1.15), COL.b, COL.bFill);
    board.create("text", [
      A[0] + 0.78 * Math.cos(angY.mid),
      A[1] + 0.78 * Math.sin(angY.mid),
      showY ? "30°" : "y",
    ], {
      fontSize: 18, color: COL.b, anchorX: "middle", highlight: false, fixed: true,
      cssStyle: "font-weight:700;font-family:Source Sans 3,sans-serif;",
      parse: false,
    });

    angleWedge(board, Ap, Bp, Cp, 0.75, COL.c, COL.cFill, "32°");
    angleWedge(board, Ap, Cp, Bp, 0.7, COL.a, COL.aFill, "76°");
    angleWedge(board, Ap, Dp, Cp, 0.7, COL.b, COL.bFill, "46°");
  }

  function renderPracticeBoard() {
    const board = initBoard([-6.2, 5.4, 6.2, -3.8]);
    const item = state.item;
    const step = state.practice.step;
    if (item === "ex53") drawEx53(board);
    else if (item === "te53") drawTe53(board);
    else if (item === "qp53") drawQp53(board);
    else if (item === "te54") {
      let hl = "none";
      if (step >= 1 && step <= 3) hl = "PQR";
      if (step >= 4) hl = "PRS";
      drawTe54(board, hl);
    } else if (item === "qp54") {
      let hl = "none";
      if (step >= 1 && step <= 3) hl = "ABC";
      if (step >= 4) hl = "ACD";
      drawQp54(board, hl);
    } else {
      let hl = "none";
      if (step >= 1 && step <= 3) hl = "ABC";
      if (step >= 4) hl = "ABD";
      drawEx54(board, hl);
    }
  }

  function isTwoUnknown(id) {
    return id === "ex54" || id === "te54" || id === "qp54";
  }

  function addEq(parent, src) {
    parent.appendChild(spanTex(src, true));
  }

  function renderPracticeSide() {
    const side = document.getElementById("side");
    side.innerHTML = "";
    const h = document.createElement("h2");
    h.textContent = "Find the unknown angle";
    side.appendChild(h);

    const nav = document.createElement("div");
    nav.className = "item-nav";
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", "Textbook items");
    Object.values(ITEMS).forEach((it) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", it.id === state.item ? "true" : "false");
      b.textContent = it.title;
      b.addEventListener("click", () => {
        state.item = it.id;
        state.practice.step = 0;
        setHash(it.hash);
        renderAll();
      });
      nav.appendChild(b);
    });
    side.appendChild(nav);

    const item = ITEMS[state.item];
    const stem = document.createElement("p");
    stem.className = "stem";
    const sub = document.createElement("p");
    sub.className = "kicker-free";
    if (item.id === "ex53") {
      sub.textContent = "Example 5.3  ·  Find the unknown angle in a triangle";
      stem.textContent = "Find ∠R in the figure.";
    } else if (item.id === "te53") {
      sub.textContent = "Teaching Example 5.3";
      stem.textContent = "Find ∠B in the figure.";
    } else if (item.id === "qp53") {
      sub.textContent = "Quick Practice 5.3";
      stem.textContent = "Find ∠A in the figure.";
    } else if (item.id === "ex54") {
      sub.textContent = "Example 5.4  ·  Further problem on finding unknown angles in triangles";
      stem.textContent = "In the figure, BCD is a straight line. Find x and y.";
    } else if (item.id === "te54") {
      sub.textContent = "Teaching Example 5.4";
      stem.textContent = "In the figure, QRS is a straight line. Find x and y.";
    } else if (item.id === "qp54") {
      sub.textContent = "Quick Practice 5.4";
      stem.textContent = "In the figure, BCD is a straight line. Find x and y.";
    }
    side.appendChild(sub);
    side.appendChild(stem);

    const scaf = document.createElement("div");
    scaf.className = "scaffold";
    const step = state.practice.step;

    function block(title, childrenFn, visible) {
      if (!visible) return;
      const li = document.createElement("div");
      li.className = "step is-active";
      const n = document.createElement("div");
      n.className = "n";
      n.textContent = title;
      li.appendChild(n);
      childrenFn(li);
      scaf.appendChild(li);
    }

    if (item.id === "ex53") {
      block("1  Identify the triangle and the known angles", (li) => {
        const p = document.createElement("p");
        p.textContent = "We work in △PQR. The known angles are ∠P = 60° and ∠Q = 65°.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation", (li) => {
        addEq(li, "\\angle P + \\angle Q + \\angle R = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "60^{\\circ} + 65^{\\circ} + \\angle R = 180^{\\circ}");
      }, step >= 2);
      block("3  Find the unknown angle", (li) => {
        addEq(li, "\\angle R = 180^{\\circ} - 60^{\\circ} - 65^{\\circ}");
        addEq(li, "\\angle R = 55^{\\circ}");
      }, step >= 3);
    } else if (item.id === "te53") {
      block("1  Identify the triangle and the known angles", (li) => {
        const p = document.createElement("p");
        p.textContent = "We work in △ABC. The known angles are ∠A = 80° and ∠C = 45°.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation", (li) => {
        addEq(li, "\\angle A + \\angle B + \\angle C = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "80^{\\circ} + \\angle B + 45^{\\circ} = 180^{\\circ}");
      }, step >= 2);
      block("3  Find the unknown angle", (li) => {
        addEq(li, "\\angle B = 180^{\\circ} - 80^{\\circ} - 45^{\\circ}");
        addEq(li, "\\angle B = 55^{\\circ}");
      }, step >= 3);
    } else if (item.id === "qp53") {
      block("1  Identify the triangle and the known angles", (li) => {
        const p = document.createElement("p");
        p.textContent = "We work in △ABC. The known angles are ∠B = 43° and ∠C = 37°.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation", (li) => {
        addEq(li, "\\angle A + \\angle B + \\angle C = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "\\angle A + 43^{\\circ} + 37^{\\circ} = 180^{\\circ}");
      }, step >= 2);
      block("3  Find the unknown angle", (li) => {
        addEq(li, "\\angle A = 180^{\\circ} - 43^{\\circ} - 37^{\\circ}");
        addEq(li, "\\angle A = 100^{\\circ}");
      }, step >= 3);
    } else if (item.id === "ex54") {
      if (step >= 1) {
        const tip = document.createElement("div");
        tip.className = "reason filled";
        tip.textContent = "Tips for Students: Among △ABC, △ACD and △ABD, consider the triangle in which there is only one unknown angle first.";
        scaf.appendChild(tip);
      }
      block("1  Identify — start with △ABC", (li) => {
        const p = document.createElement("p");
        p.textContent = "In △ABC there is only one unknown angle. The known angles are ∠ABC = 90° and ∠ACB = 66°. The unknown is x = ∠BAC.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation in △ABC", (li) => {
        addEq(li, "\\angle BAC + \\angle ABC + \\angle ACB = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "x + 90^{\\circ} + 66^{\\circ} = 180^{\\circ}");
      }, step >= 2);
      block("3  Find x", (li) => {
        addEq(li, "x = 180^{\\circ} - 90^{\\circ} - 66^{\\circ}");
        addEq(li, "x = 24^{\\circ}");
      }, step >= 3);
      block("4  Identify — now △ABD", (li) => {
        const p = document.createElement("p");
        p.textContent = "In △ABD, ∠ABD = 90° and ∠BAD = x + 34° = 24° + 34°. The unknown is y = ∠ADB.";
        li.appendChild(p);
      }, step >= 4);
      block("5  Write the equation in △ABD", (li) => {
        addEq(li, "\\angle BAD + \\angle ABD + \\angle ADB = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "(x + 34^{\\circ}) + 90^{\\circ} + y = 180^{\\circ}");
        addEq(li, "24^{\\circ} + 34^{\\circ} + 90^{\\circ} + y = 180^{\\circ}");
      }, step >= 5);
      block("6  Find y", (li) => {
        addEq(li, "y = 180^{\\circ} - 24^{\\circ} - 34^{\\circ} - 90^{\\circ}");
        addEq(li, "y = 32^{\\circ}");
      }, step >= 6);
    } else if (item.id === "te54") {
      block("1  Identify — start with △PQR", (li) => {
        const p = document.createElement("p");
        p.textContent = "In △PQR there is only one unknown angle. The known angles are ∠PQR = 52° and ∠PRQ = 100°. The unknown is x = ∠QPR.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation in △PQR", (li) => {
        addEq(li, "\\angle QPR + \\angle PQR + \\angle PRQ = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "x + 52^{\\circ} + 100^{\\circ} = 180^{\\circ}");
      }, step >= 2);
      block("3  Find x", (li) => {
        addEq(li, "x = 180^{\\circ} - 52^{\\circ} - 100^{\\circ}");
        addEq(li, "x = 28^{\\circ}");
      }, step >= 3);
      block("4  Identify — now △PRS", (li) => {
        const p = document.createElement("p");
        p.textContent = "QRS is a straight line, so ∠PRQ + ∠PRS = 180°. Hence ∠PRS = 180° − 100° = 80°. In △PRS the known angles are ∠RPS = 64° and ∠PRS = 80°. The unknown is y = ∠PSR.";
        li.appendChild(p);
      }, step >= 4);
      block("5  Write the equation in △PRS", (li) => {
        addEq(li, "\\angle RPS + \\angle PRS + \\angle PSR = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "64^{\\circ} + 80^{\\circ} + y = 180^{\\circ}");
      }, step >= 5);
      block("6  Find y", (li) => {
        addEq(li, "y = 180^{\\circ} - 64^{\\circ} - 80^{\\circ}");
        addEq(li, "y = 36^{\\circ}");
      }, step >= 6);
    } else if (item.id === "qp54") {
      block("1  Identify — start with △ABC", (li) => {
        const p = document.createElement("p");
        p.textContent = "In △ABC there is only one unknown angle. The known angles are ∠ABC = 32° and ∠ACB = 76°. The unknown is x = ∠BAC.";
        li.appendChild(p);
      }, step >= 1);
      block("2  Write the equation in △ABC", (li) => {
        addEq(li, "\\angle BAC + \\angle ABC + \\angle ACB = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "x + 32^{\\circ} + 76^{\\circ} = 180^{\\circ}");
      }, step >= 2);
      block("3  Find x", (li) => {
        addEq(li, "x = 180^{\\circ} - 32^{\\circ} - 76^{\\circ}");
        addEq(li, "x = 72^{\\circ}");
      }, step >= 3);
      block("4  Identify — now △ACD", (li) => {
        const p = document.createElement("p");
        p.textContent = "BCD is a straight line, so ∠ACB + ∠ACD = 180°. Hence ∠ACD = 180° − 76° = 104°. In △ACD the known angles are ∠ADC = 46° and ∠ACD = 104°. The unknown is y = ∠CAD.";
        li.appendChild(p);
      }, step >= 4);
      block("5  Write the equation in △ACD", (li) => {
        addEq(li, "\\angle CAD + \\angle ACD + \\angle ADC = 180^{\\circ}\\quad(\\angle\\,\\text{sum of }\\triangle)");
        addEq(li, "y + 104^{\\circ} + 46^{\\circ} = 180^{\\circ}");
      }, step >= 5);
      block("6  Find y", (li) => {
        addEq(li, "y = 180^{\\circ} - 104^{\\circ} - 46^{\\circ}");
        addEq(li, "y = 30^{\\circ}");
      }, step >= 6);
    }

    side.appendChild(scaf);

    const maxStep = isTwoUnknown(item.id) ? 6 : 3;
    const nav2 = document.createElement("div");
    nav2.className = "actions-col";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "btn-ghost btn-wide";
    back.textContent = "Back";
    back.disabled = step <= 0;
    back.addEventListener("click", () => {
      state.practice.step = Math.max(0, state.practice.step - 1);
      renderAll();
    });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "btn btn-wide";
    next.setAttribute("data-action", "next");
    if (step === 0 && item.id === "ex54") next.textContent = "Show the tip, then identify";
    else if (step === 0) next.textContent = "Identify the triangle";
    else if (step >= maxStep) next.textContent = "Done";
    else if (isTwoUnknown(item.id) && step === 1) next.textContent = "Write the equation";
    else if (isTwoUnknown(item.id) && step === 2) next.textContent = "Find x";
    else if (item.id === "ex54" && step === 3) next.textContent = "Now identify △ABD";
    else if (item.id === "te54" && step === 3) next.textContent = "Now identify △PRS";
    else if (item.id === "qp54" && step === 3) next.textContent = "Now identify △ACD";
    else if (isTwoUnknown(item.id) && step === 4) next.textContent = "Write the equation";
    else if (isTwoUnknown(item.id) && step === 5) next.textContent = "Find y";
    else if (step === 1) next.textContent = "Write the equation";
    else if (step === 2) next.textContent = "Find the unknown angle";
    else next.textContent = "Next";
        next.disabled = step >= maxStep;
    next.addEventListener("click", () => {
      state.practice.step = Math.min(maxStep, state.practice.step + 1);
      renderAll();
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn-ghost btn-wide";
    reset.textContent = "Reset this item";
    reset.addEventListener("click", () => {
      state.practice.step = 0;
      renderAll();
    });
    nav2.appendChild(next);
    const navRow = document.createElement("div");
    navRow.className = "row";
    back.className = "btn-ghost btn-wide";
    reset.className = "btn-ghost btn-wide";
    navRow.appendChild(back);
    navRow.appendChild(reset);
    nav2.appendChild(navRow);
    side.appendChild(nav2);
  }

  /* ---------- shell ---------- */

  function currentHash() {
    if (state.mode === "tear") return TEAR_PRESETS[state.preset].hash;
    if (state.mode === "proof") return "proof";
    return ITEMS[state.item].hash;
  }

  function renderNotes() {
    const panel = document.getElementById("notes");
    const btn = document.getElementById("notes-btn");
    const body = document.getElementById("notes-body");
    body.innerHTML = NOTES[state.mode] || "";
    if (state.notesOpen) {
      panel.hidden = false;
      panel.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      panel.hidden = true;
      panel.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function renderTabs() {
    $$(".modes button").forEach((b) => {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
  }

  function renderAll() {
    renderTabs();
    renderNotes();
    if (state.mode === "tear") {
      renderTearBoard();
      renderTearSide();
    } else if (state.mode === "proof") {
      renderProofBoard();
      renderProofSide();
    } else {
      renderPracticeBoard();
      renderPracticeSide();
    }
    setHash(currentHash());
    resizeBoard();
  }

  function applyBBox(board, box) {
    if (!board || !box) return;
    const el = board.containerObj;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    if (w < 40 || h < 40) return;
    try { board.resizeContainer(w, h); } catch (e) { return; }
    const [x0, y1, x1, y0] = box;
    const bw = x1 - x0, bh = y1 - y0;
    if (bw <= 0 || bh <= 0) return;
    const viewAspect = w / h;
    const boxAspect = bw / bh;
    let nx0 = x0, nx1 = x1, ny0 = y0, ny1 = y1;
    if (viewAspect > boxAspect) {
      const extra = (bh * viewAspect - bw) / 2;
      nx0 = x0 - extra;
      nx1 = x1 + extra;
    } else {
      const extra = (bw / viewAspect - bh) / 2;
      ny0 = y0 - extra;
      ny1 = y1 + extra;
    }
    board.setBoundingBox([nx0, ny1, nx1, ny0], false);
  }

  function resizeBoard() {
    const board = state.board;
    if (!board || state._freeing) return;
    applyBBox(board, state.bbox);
  }

  function applyRoute(parsed, resetFlow) {
    state.mode = parsed.mode || "tear";
    if (parsed.preset) state.preset = parsed.preset;
    if (parsed.item) state.item = parsed.item;
    if (resetFlow) {
      if (state.mode === "tear") state.tear = { phase: "intact", chosen: null, sectors: null, loose: null, loosePreset: null, selected: "a" };
      if (state.mode === "proof") state.proof = { step: 1, reason3: false, reason4: false, correspondence: false };
      if (state.mode === "practice") state.practice = { step: 0 };
    }
  }

  function goMode(mode) {
    if (mode === "tear") applyRoute({ mode: "tear", preset: state.preset }, true);
    else if (mode === "proof") applyRoute({ mode: "proof" }, true);
    else applyRoute({ mode: "practice", item: state.item }, true);
    renderAll();
  }

  function bind() {
    $$(".modes button").forEach((b) => {
      b.addEventListener("click", () => goMode(b.getAttribute("data-mode")));
    });
    document.getElementById("notes-btn").addEventListener("click", () => {
      state.notesOpen = !state.notesOpen;
      renderNotes();
    });
    document.addEventListener("tas-tear-cmd", (ev) => {
      if (!tearUI) return;
      const d = ev.detail || {};
      if (d.cmd === "snap" && d.key) tearUI.snapSectorToRuler(d.key);
      if (d.cmd === "rotate" && d.key) tearUI.rotateSector(d.key, d.delta || 0);
      if (d.cmd === "select" && d.key) tearUI.selectKey(d.key);
    });
    window.addEventListener("hashchange", () => {
      applyRoute(parseHash(), true);
      renderAll();
    });
    window.addEventListener("resize", resizeBoard);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => resizeBoard());
      const stage = document.querySelector(".stage");
      if (stage) ro.observe(stage);
    }
  }

  function start() {
    applyRoute(parseHash(), true);
    bind();
    renderAll();
    [50, 200, 500, 1000].forEach(function (t) { setTimeout(resizeBoard, t); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
