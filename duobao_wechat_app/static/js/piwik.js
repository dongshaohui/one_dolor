/*
 * Piwik - Web Analytics
 *
 * JavaScript tracking client
 *
 * @link http://piwik.org
 * @source http://dev.piwik.org/trac/browser/trunk/js/piwik.js
 * @license http://www.opensource.org/licenses/bsd-license.php Simplified BSD
 */
if (!this.JSON2) {
    this.JSON2 = {}
} (function() {
    function d(f) {
        return f < 10 ? "0" + f: f
    }
    function l(n, m) {
        var f = Object.prototype.toString.apply(n);
        if (f === "[object Date]") {
            return isFinite(n.valueOf()) ? n.getUTCFullYear() + "-" + d(n.getUTCMonth() + 1) + "-" + d(n.getUTCDate()) + "T" + d(n.getUTCHours()) + ":" + d(n.getUTCMinutes()) + ":" + d(n.getUTCSeconds()) + "Z": null
        }
        if (f === "[object String]" || f === "[object Number]" || f === "[object Boolean]") {
            return n.valueOf()
        }
        if (f !== "[object Array]" && typeof n.toJSON === "function") {
            return n.toJSON(m)
        }
        return n
    }
    var c = new RegExp("[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]", "g"),
    e = '\\\\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]',
    i = new RegExp("[" + e, "g"),
    j,
    b,
    k = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    h;
    function a(f) {
        i.lastIndex = 0;
        return i.test(f) ? '"' + f.replace(i,
        function(m) {
            var n = k[m];
            return typeof n === "string" ? n: "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + f + '"'
    }
    function g(s, p) {
        var n, m, t, f, q = j,
        o, r = p[s];
        if (r && typeof r === "object") {
            r = l(r, s)
        }
        if (typeof h === "function") {
            r = h.call(p, s, r)
        }
        switch (typeof r) {
        case "string":
            return a(r);
        case "number":
            return isFinite(r) ? String(r) : "null";
        case "boolean":
        case "null":
            return String(r);
        case "object":
            if (!r) {
                return "null"
            }
            j += b;
            o = [];
            if (Object.prototype.toString.apply(r) === "[object Array]") {
                f = r.length;
                for (n = 0; n < f; n += 1) {
                    o[n] = g(n, r) || "null"
                }
                t = o.length === 0 ? "[]": j ? "[\n" + j + o.join(",\n" + j) + "\n" + q + "]": "[" + o.join(",") + "]";
                j = q;
                return t
            }
            if (h && typeof h === "object") {
                f = h.length;
                for (n = 0; n < f; n += 1) {
                    if (typeof h[n] === "string") {
                        m = h[n];
                        t = g(m, r);
                        if (t) {
                            o.push(a(m) + (j ? ": ": ":") + t)
                        }
                    }
                }
            } else {
                for (m in r) {
                    if (Object.prototype.hasOwnProperty.call(r, m)) {
                        t = g(m, r);
                        if (t) {
                            o.push(a(m) + (j ? ": ": ":") + t)
                        }
                    }
                }
            }
            t = o.length === 0 ? "{}": j ? "{\n" + j + o.join(",\n" + j) + "\n" + q + "}": "{" + o.join(",") + "}";
            j = q;
            return t
        }
    }
    if (typeof JSON2.stringify !== "function") {
        JSON2.stringify = function(o, m, n) {
            var f;
            j = "";
            b = "";
            if (typeof n === "number") {
                for (f = 0; f < n; f += 1) {
                    b += " "
                }
            } else {
                if (typeof n === "string") {
                    b = n
                }
            }
            h = m;
            if (m && typeof m !== "function" && (typeof m !== "object" || typeof m.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return g("", {
                "": o
            })
        }
    }
    if (typeof JSON2.parse !== "function") {
        JSON2.parse = function(o, f) {
            var n;
            function m(s, r) {
                var q, p, t = s[r];
                if (t && typeof t === "object") {
                    for (q in t) {
                        if (Object.prototype.hasOwnProperty.call(t, q)) {
                            p = m(t, q);
                            if (p !== undefined) {
                                t[q] = p
                            } else {
                                delete t[q]
                            }
                        }
                    }
                }
                return f.call(s, r, t)
            }
            o = String(o);
            c.lastIndex = 0;
            if (c.test(o)) {
                o = o.replace(c,
                function(p) {
                    return "\\u" + ("0000" + p.charCodeAt(0).toString(16)).slice( - 4)
                })
            }
            if ((new RegExp("^[\\],:{}\\s]*$")).test(o.replace(new RegExp('\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})', "g"), "@").replace(new RegExp('"[^"\\\\\n\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?', "g"), "]").replace(new RegExp("(?:^|:|,)(?:\\s*\\[)+", "g"), ""))) {
                n = eval("(" + o + ")");
                return typeof f === "function" ? m({
                    "": n
                },
                "") : n
            }
            throw new SyntaxError("JSON.parse")
        }
    }
} ());
var _paq = _paq || [],
Piwik = Piwik || (function() {
    var n, w = {},
    d = document,
    j = navigator,
    v = screen,
    H = window,
    h = false,
    C = [],
    e = H.encodeURIComponent,
    I = H.decodeURIComponent,
    E = unescape,
    G,
    D;
    function b(i) {
        return typeof i !== "undefined"
    }
    function a(i) {
        return typeof i === "function"
    }
    function o(i) {
        return typeof i === "object"
    }
    function r(i) {
        return typeof i === "string" || i instanceof String
    }
    function z() {
        var J, L, K;
        for (J = 0; J < arguments.length; J += 1) {
            K = arguments[J];
            L = K.shift();
            if (r(L)) {
                G[L].apply(G, K)
            } else {
                L.apply(G, K)
            }
        }
    }
    function t(L, K, J, i) {
        if (L.addEventListener) {
            L.addEventListener(K, J, i);
            return true
        }
        if (L.attachEvent) {
            return L.attachEvent("on" + K, J)
        }
        L["on" + K] = J
    }
    function g(K, N) {
        var J = "",
        M, L;
        for (M in w) {
            if (Object.prototype.hasOwnProperty.call(w, M)) {
                L = w[M][K];
                if (a(L)) {
                    J += L(N)
                }
            }
        }
        return J
    }
    function B() {
        var i;
        g("unload");
        if (n) {
            do {
                i = new Date()
            } while ( i . getTimeAlias () < n)
        }
    }
    function k() {
        var J;
        if (!h) {
            h = true;
            g("load");
            for (J = 0; J < C.length; J++) {
                C[J]()
            }
        }
        return true
    }
    function x() {
        var J;
        if (d.addEventListener) {
            t(d, "DOMContentLoaded",
            function i() {
                d.removeEventListener("DOMContentLoaded", i, false);
                k()
            })
        } else {
            if (d.attachEvent) {
                d.attachEvent("onreadystatechange",
                function i() {
                    if (d.readyState === "complete") {
                        d.detachEvent("onreadystatechange", i);
                        k()
                    }
                });
                if (d.documentElement.doScroll && H === H.top) { (function i() {
                        if (!h) {
                            try {
                                d.documentElement.doScroll("left")
                            } catch(K) {
                                setTimeout(i, 0);
                                return
                            }
                            k()
                        }
                    } ())
                }
            }
        }
        if ((new RegExp("WebKit")).test(j.userAgent)) {
            J = setInterval(function() {
                if (h || /loaded|complete/.test(d.readyState)) {
                    clearInterval(J);
                    k()
                }
            },
            10)
        }
        t(H, "load", k, false)
    }
    function f() {
        var i = "";
        try {
            i = H.top.document.referrer
        } catch(K) {
            if (H.parent) {
                try {
                    i = H.parent.document.referrer
                } catch(J) {
                    i = ""
                }
            }
        }
        if (i === "") {
            i = d.referrer
        }
        return i
    }
    function A(i) {
        var K = new RegExp("^([a-z]+):"),
        J = K.exec(i);
        return J ? J[1] : null
    }
    function y(i) {
        var K = new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),
        J = K.exec(i);
        return J ? J[1] : i
    }
    function q(K, J) {
        var N = new RegExp("^(?:https?|ftp)(?::/*(?:[^?]+)[?])([^#]+)"),
        M = N.exec(K),
        L = new RegExp("(?:^|&)" + J + "=([^&]*)"),
        i = M ? L.exec(M[1]) : 0;
        return i ? I(i[1]) : ""
    }
    function s(i) {
        return E(e(i))
    }
    function u(Z) {
        var L = function(W, i) {
            return (W << i) | (W >>> (32 - i))
        },
        aa = function(ag) {
            var af = "",
            ae, W;
            for (ae = 7; ae >= 0; ae--) {
                W = (ag >>> (ae * 4)) & 15;
                af += W.toString(16)
            }
            return af
        },
        O,
        ac,
        ab,
        K = [],
        S = 1732584193,
        Q = 4023233417,
        P = 2562383102,
        N = 271733878,
        M = 3285377520,
        Y,
        X,
        V,
        U,
        T,
        ad,
        J,
        R = [];
        Z = s(Z);
        J = Z.length;
        for (ac = 0; ac < J - 3; ac += 4) {
            ab = Z.charCodeAt(ac) << 24 | Z.charCodeAt(ac + 1) << 16 | Z.charCodeAt(ac + 2) << 8 | Z.charCodeAt(ac + 3);
            R.push(ab)
        }
        switch (J & 3) {
        case 0:
            ac = 2147483648;
            break;
        case 1:
            ac = Z.charCodeAt(J - 1) << 24 | 8388608;
            break;
        case 2:
            ac = Z.charCodeAt(J - 2) << 24 | Z.charCodeAt(J - 1) << 16 | 32768;
            break;
        case 3:
            ac = Z.charCodeAt(J - 3) << 24 | Z.charCodeAt(J - 2) << 16 | Z.charCodeAt(J - 1) << 8 | 128;
            break
        }
        R.push(ac);
        while ((R.length & 15) !== 14) {
            R.push(0)
        }
        R.push(J >>> 29);
        R.push((J << 3) & 4294967295);
        for (O = 0; O < R.length; O += 16) {
            for (ac = 0; ac < 16; ac++) {
                K[ac] = R[O + ac]
            }
            for (ac = 16; ac <= 79; ac++) {
                K[ac] = L(K[ac - 3] ^ K[ac - 8] ^ K[ac - 14] ^ K[ac - 16], 1)
            }
            Y = S;
            X = Q;
            V = P;
            U = N;
            T = M;
            for (ac = 0; ac <= 19; ac++) {
                ad = (L(Y, 5) + ((X & V) | (~X & U)) + T + K[ac] + 1518500249) & 4294967295;
                T = U;
                U = V;
                V = L(X, 30);
                X = Y;
                Y = ad
            }
            for (ac = 20; ac <= 39; ac++) {
                ad = (L(Y, 5) + (X ^ V ^ U) + T + K[ac] + 1859775393) & 4294967295;
                T = U;
                U = V;
                V = L(X, 30);
                X = Y;
                Y = ad
            }
            for (ac = 40; ac <= 59; ac++) {
                ad = (L(Y, 5) + ((X & V) | (X & U) | (V & U)) + T + K[ac] + 2400959708) & 4294967295;
                T = U;
                U = V;
                V = L(X, 30);
                X = Y;
                Y = ad
            }
            for (ac = 60; ac <= 79; ac++) {
                ad = (L(Y, 5) + (X ^ V ^ U) + T + K[ac] + 3395469782) & 4294967295;
                T = U;
                U = V;
                V = L(X, 30);
                X = Y;
                Y = ad
            }
            S = (S + Y) & 4294967295;
            Q = (Q + X) & 4294967295;
            P = (P + V) & 4294967295;
            N = (N + U) & 4294967295;
            M = (M + T) & 4294967295
        }
        ad = aa(S) + aa(Q) + aa(P) + aa(N) + aa(M);
        return ad.toLowerCase()
    }
    function p(K, i, J) {
        if (K === "translate.googleusercontent.com") {
            if (J === "") {
                J = i
            }
            i = q(i, "u");
            K = y(i)
        } else {
            if (K === "cc.bingj.com" || K === "webcache.googleusercontent.com" || K.slice(0, 5) === "74.6.") {
                i = d.links[0].href;
                K = y(i)
            }
        }
        return [K, i, J]
    }
    function m(J) {
        var i = J.length;
        if (J.charAt(--i) === ".") {
            J = J.slice(0, i)
        }
        if (J.slice(0, 2) === "*.") {
            J = J.slice(1)
        }
        return J
    }
    function l(J) {
        if (!r(J)) {
            J = J.text || "";
            var i = d.getElementsByTagName("title");
            if (i && b(i[0])) {
                J = i[0].text
            }
        }
        return J
    }
    function F(ad, aB) {
        var M = p(d.domain, H.location.href, f()),
        aU = m(M[0]),
        a8 = M[1],
        aH = M[2],
        aF = "GET",
        L = ad || "",
        aY = aB || "",
        ar,
        ai = d.title,
        ak = "7z|aac|ar[cj]|as[fx]|avi|bin|csv|deb|dmg|doc|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|ms[ip]|od[bfgpst]|og[gv]|pdf|phps|png|ppt|qtm?|ra[mr]?|rpm|sea|sit|tar|t?bz2?|tgz|torrent|txt|wav|wm[av]|wpd||xls|xml|z|zip",
        aD = [aU],
        P = [],
        aw = [],
        ac = [],
        aC = 500,
        Q,
        ae,
        R,
        S,
        am = ["pk_campaign", "piwik_campaign", "utm_campaign", "utm_source", "utm_medium"],
        ah = ["pk_kwd", "piwik_kwd", "utm_term"],
        a6 = "_pk_",
        V,
        a7,
        T = false,
        a1,
        ao,
        aq,
        aa = 63072000000,
        ab = 1800000,
        at = 15768000000,
        Y = d.location.protocol === "https",
        O = false,
        ax = {},
        a2 = 200,
        aN = {},
        aZ = {},
        aK = false,
        aI = false,
        aG,
        ay,
        W,
        al = u,
        aJ,
        ap;
        function aP(bh, be, bd, bg, bc, bf) {
            if (T) {
                return
            }
            var bb;
            if (bd) {
                bb = new Date();
                bb.setTime(bb.getTime() + bd)
            }
            d.cookie = bh + "=" + e(be) + (bd ? ";expires=" + bb.toGMTString() : "") + ";path=" + (bg || "/") + (bc ? ";domain=" + bc: "") + (bf ? ";secure": "")
        }
        function Z(bd) {
            if (T) {
                return 0
            }
            var bb = new RegExp("(^|;)[ ]*" + bd + "=([^;]*)"),
            bc = bb.exec(d.cookie);
            return bc ? I(bc[2]) : 0
        }
        function a3(bb) {
            var bc;
            if (R) {
                bc = new RegExp("#.*");
                return bb.replace(bc, "")
            }
            return bb
        }
        function aT(bd, bb) {
            var be = A(bb),
            bc;
            if (be) {
                return bb
            }
            if (bb.slice(0, 1) === "/") {
                return A(bd) + "://" + y(bd) + bb
            }
            bd = a3(bd);
            if ((bc = bd.indexOf("?")) >= 0) {
                bd = bd.slice(0, bc)
            }
            if ((bc = bd.lastIndexOf("/")) !== bd.length - 1) {
                bd = bd.slice(0, bc + 1)
            }
            return bd + bb
        }
        function aE(be) {
            var bc, bb, bd;
            for (bc = 0; bc < aD.length; bc++) {
                bb = m(aD[bc].toLowerCase());
                if (be === bb) {
                    return true
                }
                if (bb.slice(0, 1) === ".") {
                    if (be === bb.slice(1)) {
                        return true
                    }
                    bd = be.length - bb.length;
                    if ((bd > 0) && (be.slice(bd) === bb)) {
                        return true
                    }
                }
            }
            return false
        }
        function ba(bb) {
            var bc = new Image(1, 1);
            bc.onload = function() {};
            bc.src = L + (L.indexOf("?") < 0 ? "?": "&") + bb
        }
        function aQ(bb) {
            try {
                var bd = H.XMLHttpRequest ? new H.XMLHttpRequest() : H.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null;
                bd.open("POST", L, true);
                bd.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status !== 200) {
                        ba(bb)
                    }
                };
                bd.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                bd.send(bb)
            } catch(bc) {
                ba(bb)
            }
        }
        function an(bd, bc) {
            var bb = new Date();
            if (!a1) {
                if (aF === "POST") {
                    aQ(bd)
                } else {
                    ba(bd)
                }
                n = bb.getTime() + bc
            }
        }
        function aO(bb) {
            return a6 + bb + "." + aY + "." + aJ
        }
        function N() {
            if (T) {
                return "0"
            }
            if (!b(j.cookieEnabled)) {
                var bb = aO("testcookie");
                aP(bb, "1");
                return Z(bb) === "1" ? "1": "0"
            }
            return j.cookieEnabled ? "1": "0"
        }
        function az() {
            aJ = al((V || aU) + (a7 || "/")).slice(0, 4)
        }
        function X() {
            var bc = aO("cvar"),
            bb = Z(bc);
            if (bb.length) {
                bb = JSON2.parse(bb);
                if (o(bb)) {
                    return bb
                }
            }
            return {}
        }
        function K() {
            if (O === false) {
                O = X()
            }
        }
        function aX() {
            var bb = new Date();
            aG = bb.getTime()
        }
        function U(bf, bc, bb, be, bd, bg) {
            aP(aO("id"), bf + "." + bc + "." + bb + "." + be + "." + bd + "." + bg, aa, a7, V, Y)
        }
        function J() {
            var bc = new Date(),
            bb = Math.round(bc.getTime() / 1000),
            be = Z(aO("id")),
            bd;
            if (be) {
                bd = be.split(".");
                bd.unshift("0")
            } else {
                if (!ap) {
                    ap = al((j.userAgent || "") + (j.platform || "") + JSON2.stringify(aZ) + bb).slice(0, 16)
                }
                bd = ["1", ap, bb, 0, bb, "", ""]
            }
            return bd
        }
        function i() {
            var bb = Z(aO("ref"));
            if (bb.length) {
                try {
                    bb = JSON2.parse(bb);
                    if (o(bb)) {
                        return bb
                    }
                } catch(bc) {}
            }
            return ["", "", 0, ""]
        }
        function aj(bd, bB, bC, bf) {
            var bz, bc = new Date(),
            bl = Math.round(bc.getTime() / 1000),
            bE,
            bA,
            bh,
            bs,
            bw,
            bk,
            bu,
            bi,
            by,
            bg = 1024,
            bF,
            bo,
            bv = O,
            bq = aO("id"),
            bm = aO("ses"),
            bn = aO("ref"),
            bG = aO("cvar"),
            bt = J(),
            bp = Z(bm),
            bx = i(),
            bD = ar || a8,
            bj,
            bb;
            if (T) {
                T = false;
                aP(bq, "", -86400, a7, V);
                aP(bm, "", -86400, a7, V);
                aP(bG, "", -86400, a7, V);
                aP(bn, "", -86400, a7, V);
                T = true
            }
            if (a1) {
                return ""
            }
            bE = bt[0];
            bA = bt[1];
            bs = bt[2];
            bh = bt[3];
            bw = bt[4];
            bk = bt[5];
            if (!b(bt[6])) {
                bt[6] = ""
            }
            bu = bt[6];
            if (!b(bf)) {
                bf = ""
            }
            bj = bx[0];
            bb = bx[1];
            bi = bx[2];
            by = bx[3];
            if (!bp) {
                bh++;
                bk = bw;
                if (!aq || !bj.length) {
                    for (bz in am) {
                        if (Object.prototype.hasOwnProperty.call(am, bz)) {
                            bj = q(bD, am[bz]);
                            if (bj.length) {
                                break
                            }
                        }
                    }
                    for (bz in ah) {
                        if (Object.prototype.hasOwnProperty.call(ah, bz)) {
                            bb = q(bD, ah[bz]);
                            if (bb.length) {
                                break
                            }
                        }
                    }
                }
                bF = y(aH);
                bo = by.length ? y(by) : "";
                if (bF.length && !aE(bF) && (!aq || !bo.length || aE(bo))) {
                    by = aH
                }
                if (by.length || bj.length) {
                    bi = bl;
                    bx = [bj, bb, bi, a3(by.slice(0, bg))];
                    aP(bn, JSON2.stringify(bx), at, a7, V, Y)
                }
            }
            bd += "&idsite=" + aY + "&rec=1&r=" + String(Math.random()).slice(2, 8) + "&h=" + bc.getHours() + "&m=" + bc.getMinutes() + "&s=" + bc.getSeconds() + "&url=" + e(a3(bD)) + (aH.length ? "&urlref=" + e(a3(aH)) : "") + "&_id=" + bA + "&_idts=" + bs + "&_idvc=" + bh + "&_idn=" + bE + (bj.length ? "&_rcn=" + e(bj) : "") + (bb.length ? "&_rck=" + e(bb) : "") + "&_refts=" + bi + "&_viewts=" + bk + (String(bu).length ? "&_ects=" + bu: "") + (String(by).length ? "&_ref=" + e(a3(by.slice(0, bg))) : "");
            var be = JSON2.stringify(ax);
            if (be.length > 2) {
                bd += "&cvar=" + e(be)
            }
            for (bz in aZ) {
                if (Object.prototype.hasOwnProperty.call(aZ, bz)) {
                    bd += "&" + bz + "=" + aZ[bz]
                }
            }
            if (bB) {
                bd += "&data=" + e(JSON2.stringify(bB))
            } else {
                if (S) {
                    bd += "&data=" + e(JSON2.stringify(S))
                }
            }
            if (O) {
                var br = JSON2.stringify(O);
                if (br.length > 2) {
                    bd += "&_cvar=" + e(br)
                }
                for (bz in bv) {
                    if (Object.prototype.hasOwnProperty.call(bv, bz)) {
                        if (O[bz][0] === "" || O[bz][1] === "") {
                            delete O[bz]
                        }
                    }
                }
                aP(bG, JSON2.stringify(O), ab, a7, V, Y)
            }
            U(bA, bs, bh, bl, bk, b(bf) && String(bf).length ? bf: bu);
            aP(bm, "*", ab, a7, V, Y);
            bd += g(bC);
            return bd
        }
        function aS(be, bd, bi, bf, bb, bl) {
            var bg = "idgoal=0",
            bh, bc = new Date(),
            bj = [],
            bk;
            if (String(be).length) {
                bg += "&ec_id=" + e(be);
                bh = Math.round(bc.getTime() / 1000)
            }
            bg += "&revenue=" + bd;
            if (String(bi).length) {
                bg += "&ec_st=" + bi
            }
            if (String(bf).length) {
                bg += "&ec_tx=" + bf
            }
            if (String(bb).length) {
                bg += "&ec_sh=" + bb
            }
            if (String(bl).length) {
                bg += "&ec_dt=" + bl
            }
            if (aN) {
                for (bk in aN) {
                    if (Object.prototype.hasOwnProperty.call(aN, bk)) {
                        if (!b(aN[bk][1])) {
                            aN[bk][1] = ""
                        }
                        if (!b(aN[bk][2])) {
                            aN[bk][2] = ""
                        }
                        if (!b(aN[bk][3]) || String(aN[bk][3]).length === 0) {
                            aN[bk][3] = 0
                        }
                        if (!b(aN[bk][4]) || String(aN[bk][4]).length === 0) {
                            aN[bk][4] = 1
                        }
                        bj.push(aN[bk])
                    }
                }
                bg += "&ec_items=" + e(JSON2.stringify(bj))
            }
            bg = aj(bg, S, "ecommerce", bh);
            an(bg, aC)
        }
        function aR(bb, bf, be, bd, bc, bg) {
            if (String(bb).length && b(bf)) {
                aS(bb, bf, be, bd, bc, bg)
            }
        }
        function a5(bb) {
            if (b(bb)) {
                aS("", bb, "", "", "", "")
            }
        }
        function av(be, bf) {
            var bb = new Date(),
            bd = aj("action_name=" + e(l(be || ai)), bf, "log");
            an(bd, aC);
            if (Q && ae && !aI) {
                aI = true;
                t(d, "click", aX);
                t(d, "mouseup", aX);
                t(d, "mousedown", aX);
                t(d, "mousemove", aX);
                t(d, "mousewheel", aX);
                t(H, "DOMMouseScroll", aX);
                t(H, "scroll", aX);
                t(d, "keypress", aX);
                t(d, "keydown", aX);
                t(d, "keyup", aX);
                t(H, "resize", aX);
                t(H, "focus", aX);
                t(H, "blur", aX);
                aG = bb.getTime();
                setTimeout(function bc() {
                    var bg = new Date(),
                    bh;
                    if ((aG + ae) > bg.getTime()) {
                        if (Q < bg.getTime()) {
                            bh = aj("ping=1", bf, "ping");
                            an(bh, aC)
                        }
                        setTimeout(bc, ae)
                    }
                },
                ae)
            }
        }
        function aA(bb, be, bd) {
            var bc = aj("idgoal=" + bb + (be ? "&revenue=" + be: ""), bd, "goal");
            an(bc, aC)
        }
        function aW(bc, bb, be) {
            var bd = aj(bb + "=" + e(a3(bc)), be, "link");
            an(bd, aC)
        }
        function a0(bc, bb) {
            if (bc !== "") {
                return bc + bb.charAt(0).toUpperCase() + bb.slice(1)
            }
            return bb
        }
        function ag(bg) {
            var bf, bb, be = ["", "webkit", "ms", "moz"],
            bd;
            if (!ao) {
                for (bb = 0; bb < be.length; bb++) {
                    bd = be[bb];
                    if (Object.prototype.hasOwnProperty.call(d, a0(bd, "hidden"))) {
                        if (d[a0(bd, "visibilityState")] === "prerender") {
                            bf = true
                        }
                        break
                    }
                }
            }
            if (bf) {
                t(d, bd + "visibilitychange",
                function bc() {
                    d.removeEventListener(bd + "visibilitychange", bc, false);
                    bg()
                });
                return
            }
            bg()
        }
        function af(bd, bc) {
            var be, bb = "(^| )(piwik[_-]" + bc;
            if (bd) {
                for (be = 0; be < bd.length; be++) {
                    bb += "|" + bd[be]
                }
            }
            bb += ")( |$)";
            return new RegExp(bb)
        }
        function aV(be, bb, bf) {
            if (!bf) {
                return "link"
            }
            var bd = af(aw, "download"),
            bc = af(ac, "link"),
            bg = new RegExp("\\.(" + ak + ")([?&#]|$)", "i");
            return bc.test(be) ? "link": (bd.test(be) || bg.test(bb) ? "download": 0)
        }
        function aM(bg) {
            var be, bc, bb;
            while ((be = bg.parentNode) !== null && b(be) && ((bc = bg.tagName.toUpperCase()) !== "A" && bc !== "AREA")) {
                bg = be
            }
            if (b(bg.href)) {
                var bh = bg.hostname || y(bg.href),
                bi = bh.toLowerCase(),
                bd = bg.href.replace(bh, bi),
                bf = new RegExp("^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):", "i");
                if (!bf.test(bd)) {
                    bb = aV(bg.className, bd, aE(bi));
                    if (bb) {
                        bd = E(bd);
                        aW(bd, bb)
                    }
                }
            }
        }
        function a9(bb) {
            var bc, bd;
            bb = bb || H.event;
            bc = bb.which || bb.button;
            bd = bb.target || bb.srcElement;
            if (bb.type === "click") {
                if (bd) {
                    aM(bd)
                }
            } else {
                if (bb.type === "mousedown") {
                    if ((bc === 1 || bc === 2) && bd) {
                        ay = bc;
                        W = bd
                    } else {
                        ay = W = null
                    }
                } else {
                    if (bb.type === "mouseup") {
                        if (bc === ay && bd === W) {
                            aM(bd)
                        }
                        ay = W = null
                    }
                }
            }
        }
        function aL(bc, bb) {
            if (bb) {
                t(bc, "mouseup", a9, false);
                t(bc, "mousedown", a9, false)
            } else {
                t(bc, "click", a9, false)
            }
        }
        function au(bc) {
            if (!aK) {
                aK = true;
                var bd, bb = af(P, "ignore"),
                be = d.links;
                if (be) {
                    for (bd = 0; bd < be.length; bd++) {
                        if (!bb.test(be[bd].className)) {
                            aL(be[bd], bc)
                        }
                    }
                }
            }
        }
        function a4() {
            var bb, bc, bd = {
                pdf: "application/pdf",
                qt: "video/quicktime",
                realp: "audio/x-pn-realaudio-plugin",
                wma: "application/x-mplayer2",
                dir: "application/x-director",
                fla: "application/x-shockwave-flash",
                java: "application/x-java-vm",
                gears: "application/x-googlegears",
                ag: "application/x-silverlight"
            };
            if (! ((new RegExp("MSIE")).test(j.userAgent))) {
                if (j.mimeTypes && j.mimeTypes.length) {
                    for (bb in bd) {
                        if (Object.prototype.hasOwnProperty.call(bd, bb)) {
                            bc = j.mimeTypes[bd[bb]];
                            aZ[bb] = (bc && bc.enabledPlugin) ? "1": "0"
                        }
                    }
                }
                if (typeof navigator.javaEnabled !== "unknown" && b(j.javaEnabled) && j.javaEnabled()) {
                    aZ.java = "1"
                }
                if (a(H.GearsFactory)) {
                    aZ.gears = "1"
                }
                aZ.cookie = N()
            }
            aZ.res = v.width + "x" + v.height
        }
        a4();
        az();
        return {
            getVisitorId: function() {
                return (J())[1]
            },
            getVisitorInfo: function() {
                return J()
            },
            getAttributionInfo: function() {
                return i()
            },
            getAttributionCampaignName: function() {
                return i()[0]
            },
            getAttributionCampaignKeyword: function() {
                return i()[1]
            },
            getAttributionReferrerTimestamp: function() {
                return i()[2]
            },
            getAttributionReferrerUrl: function() {
                return i()[3]
            },
            setTrackerUrl: function(bb) {
                L = bb
            },
            setSiteId: function(bb) {
                aY = bb
            },
            setCustomData: function(bb, bc) {
                if (o(bb)) {
                    S = bb
                } else {
                    if (!S) {
                        S = []
                    }
                    S[bb] = bc
                }
            },
            getCustomData: function() {
                return S
            },
            setCustomVariable: function(bc, bb, bf, bd) {
                var be;
                if (!b(bd)) {
                    bd = "visit"
                }
                if (bc > 0) {
                    bb = b(bb) && !r(bb) ? String(bb) : bb;
                    bf = b(bf) && !r(bf) ? String(bf) : bf;
                    be = [bb.slice(0, a2), bf.slice(0, a2)];
                    if (bd === "visit" || bd === 2) {
                        K();
                        O[bc] = be
                    } else {
                        if (bd === "page" || bd === 3) {
                            ax[bc] = be
                        }
                    }
                }
            },
            getCustomVariable: function(bc, bd) {
                var bb;
                if (!b(bd)) {
                    bd = "visit"
                }
                if (bd === "page" || bd === 3) {
                    bb = ax[bc]
                } else {
                    if (bd === "visit" || bd === 2) {
                        K();
                        bb = O[bc]
                    }
                }
                if (!b(bb) || (bb && bb[0] === "")) {
                    return false
                }
                return bb
            },
            deleteCustomVariable: function(bb, bc) {
                if (this.getCustomVariable(bb, bc)) {
                    this.setCustomVariable(bb, "", "", bc)
                }
            },
            setLinkTrackingTimer: function(bb) {
                aC = bb
            },
            setDownloadExtensions: function(bb) {
                ak = bb
            },
            addDownloadExtensions: function(bb) {
                ak += "|" + bb
            },
            setDomains: function(bb) {
                aD = r(bb) ? [bb] : bb;
                aD.push(aU)
            },
            setIgnoreClasses: function(bb) {
                P = r(bb) ? [bb] : bb
            },
            setRequestMethod: function(bb) {
                aF = bb || "GET"
            },
            setReferrerUrl: function(bb) {
                aH = bb
            },
            setCustomUrl: function(bb) {
                ar = aT(a8, bb)
            },
            setDocumentTitle: function(bb) {
                ai = bb
            },
            setDownloadClasses: function(bb) {
                aw = r(bb) ? [bb] : bb
            },
            setLinkClasses: function(bb) {
                ac = r(bb) ? [bb] : bb
            },
            setCampaignNameKey: function(bb) {
                am = r(bb) ? [bb] : bb
            },
            setCampaignKeywordKey: function(bb) {
                ah = r(bb) ? [bb] : bb
            },
            discardHashTag: function(bb) {
                R = bb
            },
            setCookieNamePrefix: function(bb) {
                a6 = bb;
                O = X()
            },
            setCookieDomain: function(bb) {
                V = m(bb);
                az()
            },
            setCookiePath: function(bb) {
                a7 = bb;
                az()
            },
            setVisitorCookieTimeout: function(bb) {
                aa = bb * 1000
            },
            setSessionCookieTimeout: function(bb) {
                ab = bb * 1000
            },
            setReferralCookieTimeout: function(bb) {
                at = bb * 1000
            },
            setConversionAttributionFirstReferrer: function(bb) {
                aq = bb
            },
            disableCookies: function() {
                T = true;
                aZ.cookie = "0"
            },
            setDoNotTrack: function(bc) {
                var bb = j.doNotTrack || j.msDoNotTrack;
                a1 = bc && (bb === "yes" || bb === "1");
                if (a1) {
                    this.disableCookies()
                }
            },
            addListener: function(bc, bb) {
                aL(bc, bb)
            },
            enableLinkTracking: function(bb) {
                if (h) {
                    au(bb)
                } else {
                    C.push(function() {
                        au(bb)
                    })
                }
            },
            setHeartBeatTimer: function(bd, bc) {
                var bb = new Date();
                Q = bb.getTime() + bd * 1000;
                ae = bc * 1000
            },
            killFrame: function() {
                if (H.location !== H.top.location) {
                    H.top.location = H.location
                }
            },
            redirectFile: function(bb) {
                if (H.location.protocol === "file:") {
                    H.location = bb
                }
            },
            setCountPreRendered: function(bb) {
                ao = bb
            },
            trackGoal: function(bb, bd, bc) {
                ag(function() {
                    aA(bb, bd, bc)
                })
            },
            trackLink: function(bc, bb, bd) {
                ag(function() {
                    aW(bc, bb, bd)
                })
            },
            trackPageView: function(bb, bc) {
                ag(function() {
                    av(bb, bc)
                })
            },
            setEcommerceView: function(be, bb, bd, bc) {
                if (!b(bd) || !bd.length) {
                    bd = ""
                } else {
                    if (bd instanceof Array) {
                        bd = JSON2.stringify(bd)
                    }
                }
                ax[5] = ["_pkc", bd];
                if (b(bc) && String(bc).length) {
                    ax[2] = ["_pkp", bc]
                }
                if ((!b(be) || !be.length) && (!b(bb) || !bb.length)) {
                    return
                }
                if (b(be) && be.length) {
                    ax[3] = ["_pks", be]
                }
                if (!b(bb) || !bb.length) {
                    bb = ""
                }
                ax[4] = ["_pkn", bb]
            },
            addEcommerceItem: function(bf, bb, bd, bc, be) {
                if (bf.length) {
                    aN[bf] = [bf, bb, bd, bc, be]
                }
            },
            trackEcommerceOrder: function(bb, bf, be, bd, bc, bg) {
                aR(bb, bf, be, bd, bc, bg)
            },
            trackEcommerceCartUpdate: function(bb) {
                a5(bb)
            }
        }
    }
    function c() {
        return {
            push: z
        }
    }
    t(H, "beforeunload", B, false);
    x();
    Date.prototype.getTimeAlias = Date.prototype.getTime;
    G = new F();
    for (D = 0; D < _paq.length; D++) {
        z(_paq[D])
    }
    _paq = new c();
    return {
        addPlugin: function(i, J) {
            w[i] = J
        },
        getTracker: function(i, J) {
            return new F(i, J)
        },
        getAsyncTracker: function() {
            return G
        }
    }
} ()),
piwik_track,
piwik_log = function(b, f, d, g) {
    function a(h) {
        try {
            return eval("piwik_" + h)
        } catch(i) {}
        return
    }
    var c, e = Piwik.getTracker(d, f);
    e.setDocumentTitle(b);
    e.setCustomData(g);
    c = a("tracker_pause");
    if (c) {
        e.setLinkTrackingTimer(c)
    }
    c = a("download_extensions");
    if (c) {
        e.setDownloadExtensions(c)
    }
    c = a("hosts_alias");
    if (c) {
        e.setDomains(c)
    }
    c = a("ignore_classes");
    if (c) {
        e.setIgnoreClasses(c)
    }
    e.trackPageView();
    if (a("install_tracker")) {
        piwik_track = function(i, k, j, h) {
            e.setSiteId(k);
            e.setTrackerUrl(j);
            e.trackLink(i, h)
        };
        e.enableLinkTracking()
    }
};