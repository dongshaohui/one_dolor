requirejs.config({
    baseUrl: G.url + G.imgver + "/js/",
    paths: {
        pro: "http://mimg.127.net/p/tools/pro/pro-1.3.5.min",
        component: G.comp + "component/release/1.3.3",
        wxsdk: "http://res.wx.qq.com/open/js/jweixin-1.0.0",
        $: "http://mimg.127.net/p/tools/appframework/appframework-2.1.0.min",
        "$.css3animate": "http://mimg.127.net/p/yymobile/lib/js/af.css3animate.min",
        "$.scroller": "http://mimg.127.net/p/yymobile/lib/js/af.scroller.min",
        "$.touch": "http://mimg.127.net/p/yymobile/lib/js/af.touchEvents",
        YyJSBridge: "http://mimg.127.net/p/tools/yyjsbridge/yyjsbridge-2.2.0.min",
        YyHelper: "http://mimg.127.net/p/tools/yyjsbridge/yyhelper-1.6.6.min",
        "plugin-hd": G.url + "hd/"
    },
    shim: {
        $: {
            exports: "$"
        },
        YyJSBridge: {
            exports: "YyJSBridge"
        }
    }
}),
define("base",
function() {}),
define("common/Cookie", ["require", "$"],
function(e) {
    function t(e) {
        return e.replace(/(^\s*|\s*$)/g, "")
    }
    function i() {
        r._document = document
    }
    function n(e, t, i, n, o) {
        function s(e) {
            var t = e.substring(0, 1),
            i = e.substring(1, e.length) - 0;
            return "s" == t ? 1e3 * i: "h" == t ? 60 * i * 60 * 1e3: "d" == t ? 24 * i * 60 * 60 * 1e3: void 0
        }
        var a = e,
        c = t,
        l = i ? s(i) : 0,
        u = n || "/",
        d = o;
        if (a) {
            var h = new Date,
            p = "";
            l && (h.setTime(h.getTime() + l), p = ";expires=" + h.toGMTString()),
            r._document.cookie = encodeURIComponent(r.trim(a)) + "=" + encodeURIComponent(c) + p + (u ? ";path=" + u: "") + (d ? ";domain=" + d: "")
        }
    }
    function o(e) {
        var t = e,
        i = "";
        if (!t) return i;
        var n = r._document.cookie;
        if (!r.trim(n)) return i;
        var o = "(^| |;)" + encodeURIComponent(r.trim(t)) + "=([^;]*)(;|$)",
        s = new RegExp(o),
        a = n.match(s);
        return a && (i = decodeURIComponent(a[2])),
        i
    }
    function s(e, t, i) {
        var n = e;
        if (n) {
            var o = t || "/",
            s = i,
            a = new Date;
            a.setTime(a.getTime() + -1);
            var c = ";expires=" + a.toGMTString();
            r._document.cookie = encodeURIComponent(r.trim(n)) + "=" + c + (o ? ";path=" + o: "") + (s ? ";domain=" + s: "")
        }
    }
    var r = (e("$"), {
        _document: null,
        _init: i,
        set: n,
        get: o,
        del: s,
        trim: t
    });
    return r._init(),
    r
}),
define("action/BaseAction", ["require", "pro", "$", "common/Cookie"],
function(e) {
    function t(e) {
        var t = this.Class;
        if (e = e || {},
        this.__apis = {},
        this.__filters = {},
        a.mix(this.__apis, t._apis), a.mix(this.__filters, t._filters), "apis" in e && a.mix(this.__apis, e.apis), "filters" in e && a.mix(this.__filters, e.handlers), "onresponse" in e && this.listen("response", e.onresponse), "onnoresponse" in e && this.listen("noresponse", e.onnoresponse), "onsuccess" in e && this.listen("success", e.onsuccess), "onerror" in e && this.listen("error", e.onerror), "listeners" in e) {
            var i = e.listeners;
            for (var n in i) this.listen(n, i[n])
        }
    }
    function i(e, t) {
        var i = window.localStorage;
        try {
            if (void 0 == t) {
                t = i.getItem(e);
                try {
                    return JSON.parse(t)
                } catch(n) {
                    return t
                }
            } else "string" == typeof t ? i.setItem(e, t) : "object" == typeof t && i.setItem(e, JSON.stringify(t))
        } catch(n) {}
    }
    function n() {
        var e = this.object = this.object || new this;
        return e.ajax.apply(e, arguments)
    }
    function o(e, t, i, n, o) {
        var s = this,
        r = this.Class,
        a = this.getApi(e),
        u = a.type,
        d = a.url;
        for (var h in t) void 0 == t[h] ? delete t[h] : null == t[h] && "" == t[h];
        return t = t || {},
        t.t = "t" in t ? t.t: (new Date).getTime(),
        t.token = "token" in t ? t.token: l.get("OTOKEN"),
        this.fire("request"),
        this.fire("request:" + e),
        c.ajax({
            url: d,
            data: t,
            type: u,
            async: !o,
            headers: {
                Accept: "application/json"
            },
            dataType: "json",
            success: function(n) {
                var o = s.__filters[e],
                a = o && o.call(s, n);
                void 0 != a && (n = a),
                i && i.call(s, n),
                s.fire("response", n, t),
                s.fire("response:" + e, n, t),
                "code" in n && (n.code -= 0, s.fire("response:" + e + ":" + n.code, n.result, t), n.code == r.CODE_SUCCESS ? (s.fire("success", e, n.result, t), s.fire("success:" + e, n.result, t)) : n.code == r.CODE_NOT_LOGIN ? r.isNews ? window.location.href = "login://": window.location.href = window.G.host + "/login.do?url=" + window.location.href: (s.fire("error", e, n.code, n, t), s.fire("error:" + e, n.code, n, t), s.fire("error:" + e + ":" + n.code, n, t)))
            },
            error: function(i) {
                n && n.call(s, i),
                s.fire("noresponse", i, t),
                s.fire("noresponse:" + e, i, t)
            }
        }),
        this
    }
    function s(e, t, i) {
        var n = this.getApi(e);
        e = n.url;
        for (var o in t) void 0 == t[o] ? delete t[o] : null == t[o] && (t[o] = "");
        var s = "baseActionForm",
        r = a.$(s),
        c = document.body,
        l = document.createElement("form");
        r && r.parentNode.removeChild(r),
        l.id = s,
        l.action = e,
        l.method = e.type || "POST",
        l.target = i || "_self",
        l.style.display = "none",
        l.innerHTML = "";
        for (var u in t) {
            var d = document.createElement("input");
            d.type = "hidden",
            d.name = u,
            d.value = t[u],
            l.appendChild(d)
        }
        c.appendChild(l),
        this.fire("request"),
        this.fire("request:" + e),
        l.submit()
    }
    function r(e) {
        var t = this.Class,
        i = "get",
        n = e,
        o = this.__apis[e] || e,
        s = /^(post|get)\:/;
        return s.test(o) ? (i = o.match(s)[1], n = o.replace(s, "")) : n = o,
        t._isLocal && (n = n.replace(/\.do/, ".mo")),
        /^\/\//.test(n) ? n = n.substring(1) : /^\//.test(n) && (n = G.host + n),
        {
            url: n,
            type: i
        }
    }
    var a = e("pro"),
    c = e("$"),
    l = e("common/Cookie"),
    u = a.Base.extend(t, {
        CODE_SUCCESS: 0,
        CODE_NOT_LOGIN: -1,
        rawAjax: c.ajax,
        ajax: n,
        _apis: {},
        _filters: {},
        _isLocal: "8082" == window.location.port
    },
    {
        rawAjax: c.ajax,
        local: i,
        ajax: o,
        form: s,
        getApi: r
    });
    return u
}),
define("action/CartAction", ["require", "pro", "$", "action/BaseAction"],
function(e) {
    var t = e("pro"),
    i = (e("$"), e("action/BaseAction"));
    return i.extend({
        _apis: {
            get: "/cart/get.do",
            getCount: "/cart/getCount.do",
            add: "post:/cart/add.do",
            autoAdd: "post:/cart/add.do",
            del: "post:/cart/del.do",
            update: "post:/cart/update.do",
            submit: "post:/cart/submit.do",
            batchAdd: "post:/cart/batchAdd.do"
        },
        _filters: {
            get: function(e) {
                for (var i = e.result,
                n = 0,
                o = i.length; o > n; n++) {
                    var s = i[n];
                    t.mix(s, s.info.goods),
                    s.period = s.info.period,
                    s.existingTimes = s.info.existingTimes,
                    delete s.info
                }
            }
        }
    })
}),
define("action/IndexAction", ["require", "pro", "$", "action/BaseAction"],
function(e) {
    var t = e("pro"),
    i = (e("$"), e("action/BaseAction"));
    return i.extend({
        _apis: {
            newReveal: "/goods/newReveal.do",
            getWinner: "/goods/getWinner.do"
        },
        _filters: {
            newReveal: function(e) {
                for (var i = e.result.list,
                n = 0,
                o = i.length; o > n; n++) {
                    var s = i[n];
                    t.mix(s, s.goods),
                    s.remainTime -= 0,
                    delete s.goods
                }
            },
            getWinner: function(e) {
                var t = e.result;
                0 == e.code && t.luckyCode && "" != t.luckyCode && (t.status = 3, t.ownerCost = t.cost)
            }
        }
    })
}),
define("action/PayAction", ["require", "pro", "$", "action/BaseAction"],
function(e) {
    var t = e("pro"),
    i = (e("$"), e("action/BaseAction"));
    return i.extend({
        TYPE_RECHARGE: 0,
        TYPE_DUOBAO: 1,
        _apis: {
            confirm: "post:/newpay/order/confirm.do",
            weiboPay: "http://api.sc.weibo.com/v2/pay/cashier/route",
            check: "post:/pay/check.do",
            ready: "post:/pay/ready.do",
            submit: "post:/pay/submit.do",
            jump: "post:/pay/jump.do",
            getNoPay: "post:/pay/getNoPay.do",
            getBonus: "/pay/getBonus.do",
            info: "post:/pay/info.do"
        },
        _filters: {
            getNoPay: function(e) {
                for (var i = 0,
                n = e.result.length; n > i; i++) for (var o = e.result[i].order, s = 0, r = o.length; r > s; s++) {
                    var a = o[s];
                    t.mix(a, a.info),
                    t.mix(a, a.info.goods),
                    delete a.info,
                    delete a.goods
                }
            },
            check: function(e) {
                function t(e) {
                    if (e) for (var t = 0,
                    n = e.length; n > t; t++) e[t] = i(e[t])
                }
                function i(e) {
                    return {
                        gid: e.info.goods.gid,
                        name: e.info.goods.gname,
                        tag: e.info.goods.tag,
                        period: e.info.period,
                        num: e.num,
                        luckyCode: e.luckyCode,
                        regularBuy: e.regularBuy
                    }
                }
                var n = e.result;
                n && (t(n.success), t(n.failure))
            }
        }
    })
}),
define("action/UserAction", ["require", "pro", "$", "action/BaseAction"],
function(e) {
    var t = (e("pro"), e("$"), e("action/BaseAction"));
    return t.extend({
        _apis: {
            dbRecordGet: "/user/duobaoRecord/get.do",
            bonusList: "/user/bonus/list.do",
            getMyCode: "/code/get.do",
            winList: "/user/win/get.do",
            shareList: "/user/share/list.do",
            goodsShareList: "/share/getList.do",
            chargeList: "/user/charge/get.do",
            gShareList: "/global/share/list.do",
            shipList: "/user/shipAddress/get.do",
            mallRecordList: "/mall/order/list.do",
            mallPayUrl: "/mall/order/check.do",
            mallDetail: "/mall/order/detail.do",
            mallConfirm: "post:/mall/ship/confirm.do",
            mallClose: "/mall/order/close.do",
            mallDoneConfirm: "post:/mall/ship/confirm.do",
            wishList: "/wish/list.do",
            wishInfo: "/wish/detail.do",
            supporterlist: "/wish/support/list.do",
            wishShipInfo: "/wish/shipInfo.do",
            wishAddress: "/wish/address.do",
            wishConfirm: "/wish/confirm.do"
        }
    })
}),
define("common/Countdown", ["require", "pro"],
function(e) {
    function t(e) {
        if ("now" in e && (this.__fix = this._now() - e.now), "interval" in e && (this.interval = e.interval), "expires" in e && (this.expires = e.expires), "finish" in e ? this.finish = e.finish: this.finish = this._now().getTime() + this.expires, "listeners" in e) {
            var t = e.listeners;
            for (var i in t) this.listen(i, t[i])
        }
    }
    function i() {
        return new Date((new Date).getTime() - this.__fix)
    }
    function n(e, t) {
        function i() {
            var i = this._now();
            this.expires = this.finish - this._now().getTime();
            var n = new Date(this.finish),
            o = n.getTime() - i.getTime(),
            s = parseInt(o / 1e3 / 60 / 60 % 60),
            r = parseInt(o / 1e3 / 60 % 60),
            a = parseInt(o / 1e3 % 60),
            c = parseInt(o % 1e3),
            l = c,
            u = {
                h: 10 > s ? "0" + s: s + "",
                m: 10 > r ? "0" + r: r + "",
                s: 10 > a ? "0" + a: a + "",
                ms: 10 > l ? "00" + l: 100 > l ? "0" + l: l + ""
            };
            e && e.call(this, u),
            this.fire("run", u),
            0 >= s && 0 >= r && 0 >= a && 0 >= c && (t && t.call(this), this.fire("run", {
                h: "00",
                m: "00",
                s: "00",
                ms: "000"
            }), this.fire("finish"), this.stop())
        }
        this.__timer = setInterval(s.bind(i, this), this.interval),
        i.call(this),
        this.fire("start")
    }
    function o() {
        clearInterval(this.__timer),
        this.fire("stop")
    }
    var s = e("pro"),
    r = s.Base.extend(t, {},
    {
        interval: 1e3,
        expires: 6e4,
        start: n,
        stop: o,
        _now: i,
        __timer: null,
        __fix: 0
    });
    return r
}),
define("common/Lazyload", ["require", "$", "pro"],
function(e) {
    function t(e) {
        var t = this,
        i = e || {},
        n = window;
        t.__win = n,
        t.__doc = n.document;
        var o = i.container;
        if ("undefined" == typeof o) t.__dom = s(t.__doc.body);
        else if (o instanceof s) t.__dom = o;
        else {
            if ("string" != typeof o) return;
            t.__dom = s("#" + o)
        }
        var r = i.dataName || "data-src";
        t.__dataName = r;
        var a = i.time - 0 || 200;
        t.__time = a,
        t.__domList = t.__dom.find(t.__tag + "[" + t.__dataName + "]"),
        t.__domList.each(function(e, t) {
            s(t).addClass("fn-lazyLoadMinHeight")
        }),
        t.__initListen(),
        t.__show(),
        t.fire("afterinit")
    }
    function i() {
        var e = this,
        t = function(e) {
            return function() {
                window.setTimeout(function() {
                    e.__show.apply(e)
                },
                e.__time)
            }
        } (e);
        e.__handler = t,
        s(e.__win).on("scroll", e.__handler),
        s(e.__win).on("resize", e.__handler)
    }
    function n() {
        var e = this;
        s(e.__win).off("scroll", e.__handler),
        s(e.__win).off("resize", e.__handler),
        e.__domList = e.__dom = e.__win = e.__doc = null,
        r.Base.prototype.destroy.call(e),
        e = null
    }
    function o() {
        var e = this,
        t = e.__doc;
        if (t) {
            var i, n, o, s, r, a, c = parseInt(t.documentElement.clientHeight),
            l = e.__domList,
            u = l.length;
            if (!u) return ! 1;
            for (var d = 0; u > d; d++) i = l[d],
            i && (n = i.getAttribute(e.__dataName), n && (o = i.getBoundingClientRect(), s = parseInt(o.top), r = parseInt(o.bottom), (0 > s * r || s >= 0 && r > 0 && c > s) && (i.onload = function() {
                var t = this.className;
                this.className = t.replace(/\s*fn-lazyLoading/, ""),
                t = this.className,
                this.className = t.replace(/\s*fn-lazyLoadMinHeight/, ""),
                this.removeAttribute(e.__dataName)
            },
            a = i.className, /\s*fn-lazyLoading\s*/.test(a) || (i.className += a ? " fn-lazyLoading": "fn-lazyLoading"), i.setAttribute("src", n), l[d] = null)))
        }
    }
    var s = e("$"),
    r = e("pro"),
    a = r.Base.extend(t, {},
    {
        __time: null,
        __dom: null,
        __dataName: null,
        __tag: "img",
        __domList: null,
        __initListen: i,
        __win: null,
        __doc: null,
        __show: o,
        __handler: null,
        destroy: n
    });
    return a
}),
define("common/Location", ["require", "pro", "$"],
function(e) {
    function t(e, t, i) {
        function n(e, t) {
            return e.indexOf("?" + t) > -1 || e.indexOf("&" + t) > -1
        }
        t = t || window.location.href;
        var o = t.split("#"),
        s = o[0],
        r = s.indexOf("?") > -1 ? "&": "?";
        if ("string" == typeof e) {
            var a = e.charAt(0);
            e = "?" === a || "&" === a ? e.slice(1) : e,
            s += r + e
        } else for (var c in e) n(s, c) ? i || (s = s.replace(new RegExp(c + "=[^&#]*"), c + "=" + e[c])) : (s += r + c + "=" + e[c], r = "&");
        return o[0] = s,
        o.join("#")
    }
    function i(e, t) {
        return this.getParameters(t)[e]
    }
    function n(e) {
        function t(e) {
            return e.replace(/(^\s*|\s*$)/g, "")
        }
        e = e || window.location.href;
        var i = this._paramCache,
        n = e.replace(/(#.+)/g, "");
        if (i[n]) return i[n];
        var o, s = t(this._parse(e).query),
        r = s ? s.split("&") : [],
        a = {};
        if (r.length > 0) {
            for (var c = 0,
            l = r.length; l > c; c++) o = /([^=]+)=([^=]*)/.exec(r[c]),
            o && (a[o[1]] = o[2]);
            i[n] = a
        }
        return a
    }
    function o(e) {
        var t = this._parse(e).hostname.split(".");
        return t.length < 2 ? "": t.reverse().slice(0, 2).reverse().join(".")
    }
    function s(e) {
        var t = this._parse(e).hash;
        return t = t && t.length > 0 ? t.slice(1) : ""
    }
    function r(e, t) {
        var i = this._parse(t).hash;
        i = i && i.length > 0 ? i.slice(1) : "";
        var n, o = i.split("&"),
        s = "";
        if (o.length > 0) for (var r = 0,
        a = o.length; a > r; r++) if (n = /([^=]+)=([^=]*)/.exec(o[r]), n[1] == e) return s = n[2];
        return s
    }
    function a(e) {
        e = e || window.location.href;
        var t = document.createElement("a");
        return t.href = e,
        {
            href: t.href,
            host: t.host || window.location.host,
            port: "0" === t.port || "" === t.port ? window.location.port: t.port,
            hash: t.hash,
            hostname: t.hostname || window.location.hostname,
            pathname: "/" !== t.pathname.charAt(0) ? "/" + t.pathname: t.pathname,
            protocol: t.protocol && ":" !== t.protocol ? t.protocol: location.protocol,
            search: t.search,
            query: t.search.slice(1)
        }
    }
    var c = e("pro"),
    l = (e("$"), c.Base.extend({
        _paramCache: {},
        _parse: a,
        addParam: t,
        getParam: i,
        getDomain: o,
        getParameters: n,
        getHash: s,
        getHashValue: r
    }));
    return l
}),
define("common/Log", ["require", "$"],
function(e) {
    function t() {
        var e = location.host,
        t = !1;
        $.each(o._white,
        function(i, n) {
            return n.test(e) ? (t = !0, !1) : void 0
        }),
        o._debug = t,
        "undefined" != typeof console && (o._console = console)
    }
    function i(e, t) {
        if (o._debug) {
            var i = e,
            n = t || "";
            "undefined" != typeof i && (i += "", i && o._console && o._console.log(n + ": " + i))
        }
    }
    function n(e) {
        if (o._debug) {
            var e = e;
            "undefined" != typeof e && o._console && (e.stack ? o._console.error(e.stack) : e.message ? o._console.error(e.message) : o._console.error(e))
        }
    }
    $ = e("$");
    var o = {
        _console: null,
        _debug: !0,
        _white: [new RegExp("^xparkdev4.mail.163.com$"), new RegExp("^1.gztest.mail.163.com$"), new RegExp("^my.1.mail.163.com(|:\\d+)$")],
        _init: t,
        log: i,
        error: n
    };
    return o._init(),
    o
}),
define("common/Utils", ["require", "pro"],
function(e) {
    function t(e) {
        var t = e.getFullYear(),
        i = this.format(e.getMonth() + 1, 2),
        n = this.format(e.getDate(), 2),
        o = this.format(e.getHours(), 2),
        s = this.format(e.getMinutes(), 2),
        r = this.format(e.getSeconds(), 2);
        return [t, i, n].join("-") + " " + [o, s, r].join(":")
    }
    function i(e, t) {
        var i, n;
        e && (e.addEventListener("touchstart",
        function(e) {
            var t = e.touches[0];
            i = t.clientX,
            n = t.clientY
        },
        !1), e.addEventListener("touchend",
        function(o) {
            var s = o.changedTouches[0],
            r = s.clientX,
            a = s.clientY;
            Math.abs(i - r) < 6 && Math.abs(n - a) < 6 && t && t(o, e)
        },
        !1))
    }
    function n(e, t) {
        var i = document.createElement("script");
        i.type = "text/javascript",
        t && (i.onload = i.onreadystatechange = function() {
            i.readyState && "loaded" != i.readyState && "complete" != i.readyState || (i.onreadystatechange = i.onload = null, t())
        }),
        i.src = e,
        document.getElementsByTagName("head")[0].appendChild(i)
    }
    function o(e) {
        return e = e.replace(/</gi, "&lt;"),
        e = e.replace(/>/gi, "&gt;"),
        e = e.replace(/\"/gi, "&quot;"),
        e = e.replace(/\'/gi, "&apos;")
    }
    function s(e) {
        for (var t = 0,
        i = 0; i < e.length; i++) t += e.charCodeAt(i) < 0 || e.charCodeAt(i) > 255 ? 2 : 1;
        return t
    }
    function r(e, t) {
        var i = e + "";
        if (i.length < t) for (var n = 0,
        o = t - i.length; o > n; n++) i = "0" + i;
        return i
    }
    function a(e) {
        return e.replace(/(^\s*)|(\s*$)/g, "").replace(/(^　*)|(　*$)/g, "")
    }
    function c(e) {
        for (var t = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"), i = "", n = 0; n < e.length; n++) i += e.substr(n, 1).replace(t, "");
        return i
    }
    function l(e, t) {
        var i, n = t || 160,
        o = e || {},
        s = o.avatarPrefix;
        s || (s = G.url + "lib/img/avatar/"),
        i = 40 >= n ? 40 : 90 >= n ? 90 : 160;
        var r = '<img width="' + n + '" height="' + n + '" onerror="this.src=\'' + G.url + "lib/img/avatar/" + i + '.jpeg\'" src="' + s + i + '.jpeg" />';
        return r
    }
    function u(e, t) {
        return e + t + ".jpg"
    }
    function d(e, t) {
        return G.host + "/user/shareAdd.do?gid=" + e + "&period=" + t
    }
    function h(e, t, i) {
        var n = t ? this.format(e, 4) : e,
        o = t ? this.format(t || 0, 6) : "",
        s = "/detail/";
        return "" == o ? G.host + s + n + ".html": ((i || "" != o) && (s = "/detail/"), G.host + s + e + "-" + t + ".html")
    }
    function p(e, t, i, n) {
        return G.host + "/list/" + e + "-" + t + "-" + i + "-" + n + ".html"
    }
    function m(e, t) {
        var i = "index.do";
        return t && (i = i + "?refer=" + t),
        e !== G.cid && (i = "index.do?cid=" + e, t && (i = i + "&refer=" + t)),
        G.host + "/user/" + i
    }
    function f(e, t, i) {
        return G.host + "/user/shareDetail.do?cid=" + e + "&gid=" + t + "&period=" + i
    }
    function g(e, t) {
        var i = "";
        switch (t) {
        case "s":
            i = e[0];
            break;
        case "m":
            i = e[1];
            break;
        case "l":
            i = e[2]
        }
        return i
    }
    function v(e) {
        return e ? G.domains.cashier + "recharge/info.do?id=" + e: ""
    }
    function b(e) {
        var t = "http://mimg.127.net/p/yy/lib/img/bonus/",
        i = e.img;
        if (i) return i;
        var n = e.price;
        return 1 == n || n % 5 == 0 && 100 >= n ? t + n + ".png": t + "0_1.png"
    }
    function _() {
        var e = G.ver || "";
        return "yixin" == e || "weixin" == e
    }
    function x() {
        var e = G.ver || "";
        return "weixin" == e
    }
    function w() {
        var e = G.ver || "";
        return "dashi" == e
    }
    function y() {
        var e = G.ver || "";
        return "kaola" == e
    }
    function k() {
        return ! this.isYixin()
    }
    var C = e("pro"),
    T = C.Base.extend({
        encodeHTML: o,
        stringLen: s,
        format: r,
        formatDate: t,
        trim: a,
        stripScript: c,
        loadScript: n,
        touch: i,
        avatar: l,
        getGoodsImg: g,
        getGoodsUrl: h,
        getGoodsListPage: p,
        getUserPage: m,
        getShareDetailPage: f,
        getSharePic: u,
        getShareAdd: d,
        getRecharge: v,
        getBonusImg: b,
        isYixin: _,
        isWeixin: x,
        isDashi: w,
        isKaola: y,
        isNormal: k
    });
    return T
}),
define("controller/BaseController", ["require", "$", "pro", "common/Utils"],
function(e) {
    function t() {
        var t = this.Class,
        i = !!window.YyJSBridge;
        if (t.isIOSApp && !t.useIOSJSBridge && i && (window.YyJSBridge = null), t.isApp() && !i) {
            e(["YyJSBridge"])
        }
    }
    function i() {
        var e = window.location.host,
        t = navigator.userAgent;
        return /ios\./.test(e) || /duobao/i.test(t) && /iphone|ipad|ipod|ios/i.test(t)
    }
    function n() {
        var e = window.location.host,
        t = navigator.userAgent;
        return /android\./.test(e) || /duobao/i.test(t) && /android/i.test(t)
    }
    function o() {
        return /(?:ios|android)\./.test(window.location.host)
    }
    function s(e, t, i) {
        var n = this.Class,
        o = "back" == e,
        s = "login" == e,
        r = "detail" == e,
        a = "",
        c = /#\w*$/,
        l = e.match(c),
        d = "";
        return l && (e = e.replace(c, ""), d = l[0]),
        window.YyJSBridge ? (G.appSource && (YyJSBridge.__protocol = G.appSource + "://"), t = t || {},
        t.module = e, void(s ? YyJSBridge.invoke("login", {
            callback: function() {
                YyJSBridge.invoke("refresh")
            }
        }) : o ? YyJSBridge.invoke("back") : YyJSBridge.invoke("go", t))) : n.isNews && s ? void(window.location.href = n.NEWS_LOGIN_URL) : (i = void 0 == i ? o: i, void this.finish(function() {
            if (o) window.history.go( - 1);
            else {
                if (r) e = u.getGoodsUrl(t.gid, t.period),
                delete t.gid,
                delete t.period;
                else {
                    var i = n._uris[e];
                    if (i) {
                        var s = /\/$/.test(e),
                        c = "8082" == window.location.port;
                        e = i,
                        s || (e += c ? ".jsp": ".do")
                    }
                    /^\//.test(e) && window.G && G.host && (e = G.host + e)
                }
                if (t) {
                    var l = [];
                    for (var h in t) l.push(h + "=" + t[h]);
                    l.length && (a += e.indexOf("?") >= 0 ? "&": "?"),
                    a += l.join("&")
                }
                /^http(s)?:\/\/(\w*\.)*((163\.com)|(126\.com)|(yeah\.net)|(188\.com)|(youdao\.com)|(netease\.com)|(lofter\.com))(:\d*)?(\/.*)?$/.test(e) ? window.location.href = e + a + d: window.history.go( - 1)
            }
        },
        i))
    }
    function r(e) {
        var t = this,
        i = this.Class,
        n = [];
        for (var o in i.browser) i.browser[o] && n.push(o);
        this.addClass(n.join(" ")),
        e && e(),
        t.fire("start")
    }
    function a(e, t) {
        var i = this;
        e && e(),
        i.fire("finish")
    }
    function c() {
        var e = navigator.userAgent.toLowerCase(),
        t = !1,
        i = !1,
        n = !1,
        o = !1,
        s = !1,
        r = !1,
        a = !1;
        return e.indexOf("android") >= 0 ? t = !0 : e.indexOf("ipad") >= 0 ? (i = !0, o = !0) : e.indexOf("iphone") >= 0 && (i = !0, n = !0),
        e.indexOf("webkit") && (r = !0, e.indexOf("chrome") ? s = !0 : e.indexOf("safari") && (a = !0)),
        {
            webkit: r,
            android: t,
            chrome: s,
            safari: a,
            ios: i,
            iphone: n,
            ipad: o
        }
    }
    var l = (e("$"), e("pro")),
    u = e("common/Utils"),
    d = !!window.gAppInfo,
    h = d && "iOS" == gAppInfo.TERMINAL,
    p = d && "android" == gAppInfo.TERMINAL,
    m = d && gAppInfo["APP-VER"] >= "2.1.5";
    return /\/$/.test(G.host) && (G.host = G.host.replace(/\/$/, "")),
    l.View.extend(t, {
        NEWS_LOGIN_URL: "//" + ("test" == G.environment ? "1.gztest.mail.163.com": "1.163.com") + "/one.user/news/index.do?login=true",
        isTest: "test" == G.environment,
        isRelease: "release" == G.environment,
        isDevelop: "dev" == G.environment,
        isYixin: "yixin" == G.ver,
        isWeixin: "weixin" == G.ver,
        isWeibo: "weibo" == G.ver,
        isNews: "news" == G.ver,
        isKaola: "kaola" == G.ver,
        isIOSApp: h,
        isAndroidApp: p,
        useIOSJSBridge: m,
        browser: c(),
        isApp: o,
        isIOS: i,
        isCorpUser: !!G.isStaff,
        hasEpay: !G.hasEpay,
        isAndroid: n,
        _uris: {
            home: "/index",
            index: "/index",
            cart: "/cart/index",
            pay: "/newpay/order/info",
            payResult: "/newpay/result",
            noPay: "/pay/nopay",
            recharge: "/pay/recharge",
            rechargeResult: "/pay/rechargeResult",
            user: "/user/index",
            userCenter: "/user/index",
            userDuobao: "/user/duobaoRecord",
            userCharge: "/user/chargeRecord",
            userShare: "/user/share",
            userBonus: "/user/bonus",
            bonus: "/user/bonus",
            userDetail: "/user/detail",
            userWin: "/user/win",
            userMallRecord: "/user/mallrecord",
            userMallDetail: "/user/malldetail",
            login: "/login",
            question: "/question"
        }
    },
    {
        dom: document.body,
        start: r,
        finish: a,
        go: s
    })
}),
define("common/SpecialSupport", ["require", "pro", "controller/BaseController", "action/BaseAction"],
function(e) {
    function t(e, t, i) {
        this._specials.length <= 0 ? this.getSpecial(e,
        function() {
            this.eachSpecial(t)
        },
        i) : this.eachSpecial(t, i)
    }
    function i() {
        return this._specials.length
    }
    function n(t, i, n) {
        var o = this,
        c = this.Class,
        l = "http://" + (G.environment.indexOf("test") >= 0 ? "t.1": "1") + ".163.com",
        u = this.__requestQueue = this.__requestQueue || [];
        return this.__requesting ? void u.push(i) : (this.__requesting = !0, void a.rawAjax({
            url: l + "/kpimission/actregu.do",
            data: {
                t: (new Date).getTime()
            },
            dataType: "jsonp",
            jsonp: "callback",
            success: function(n) {
                function a() {
                    if (h + p >= d && (i && i.call(o), u.length)) {
                        for (var e = 0,
                        t = u.length; t > e; e++) u[e].call(o);
                        delete this.__requestQueue
                    }
                }
                delete o.__requesting;
                try {
                    for (var l = c.isApp ? c: r, d = n.result.list.length, h = 0, p = 0, m = 0; d > m; m++) {
                        var f = n.result.list[m],
                        g = f.relateAct,
                        v = o._specialMap[g],
                        b = f.source,
                        _ = l.isWeixin || l.isYixin || l.isApp(),
                        x = "any" == b,
                        w = !_ && "wap" == b,
                        y = "wap_wx" == b && l.isWeixin,
                        k = "wap_yx" == b && l.isYixin,
                        C = "app" == b && l.isApp(),
                        T = "app_ios" == b && l.isIOS(),
                        B = "app_az" == b && l.isAndroid(),
                        M = x || w || y || k || T || B || C;
                        M && v && v[t] ? e([v.base + v[t]], s.bind(function(e, t, i, n) {
                            h++;
                            try {
                                this._specials.push(new n({
                                    context: this,
                                    rule: t,
                                    tag: e,
                                    siteName: i.siteName || ""
                                }))
                            } catch(o) {}
                            a()
                        },
                        o, g, f, v),
                        function() {
                            p++,
                            a()
                        }) : p++
                    }
                    a()
                } catch(N) {
                    i && i.call(o)
                }
            },
            error: function() {
                delete o.__requesting,
                i && i.call(o)
            }
        }))
    }
    function o(e) {
        if (this._specials) for (var t = 0,
        i = this._specials.length; i > t; t++) {
            var n = this._specials[t];
            try {
                n && e.call(this, n)
            } catch(o) {}
        }
    }
    var s = e("pro"),
    r = e("controller/BaseController"),
    a = e("action/BaseAction");
    return {
        getSpecialCount: i,
        eachSpecial: o,
        getSpecial: n,
        callSpecial: t,
        _specials: [],
        _specialMap: G.specials
    }
}),
define("common/AdapterView", ["require", "pro"],
function(e) {
    function t(e) {
        this.applySuper(arguments);
        this.Class;
        this.list = e.list,
        this.adapter = e.adapter || this.adapter,
        this._init()
    }
    function i() {
        var e = this,
        t = this.list,
        i = this.__config;
        this.listen("create",
        function() {
            t.each(function(t, i) {
                var n = e.adapter(t, i);
                n && n.join(e).render(e)
            })
        }),
        i.bind && (this.listen(t, "set",
        function() {
            this.update()
        }), this.listen(t, "exclude",
        function(e) {
            this.getChild(e).destroy()
        }), this.listen(t, "include",
        function(t, i) {
            var n = this.getChild(t),
            o = this.adapter(i, t);
            n ? o.join(e, t).renderBefore(n) : o.join(e).render(e)
        }))
    }
    var n = e("pro"),
    o = n.View.extend(t, null, {
        adapter: null,
        _init: i
    });
    return o
}),
define("view/cart/MiniCartView", ["require", "pro"],
function(e) {
    var t = e("pro");
    return t.View.extend({
        _template: '<a class="w-miniCart{{#color}} w-miniCart-{{color}}{{/color}}" href="javascript:void(0);"><span class="w-miniCart-text">清单</span><i class="ico ico-miniCart{{#color}} ico-miniCart-{{color}}{{/color}}"></i><b class="w-miniCart-count" data-pro="count" style="display:none"></b></a>',
        _events: {
            "@": "click"
        },
        _doms: {
            count: "@count"
        },
        _getData: function(e) {
            return {
                color: e.color,
                count: e.count
            }
        }
    },
    {
        updateCount: function(e) {
            var t = this.doms.count;
            e > 99 && (e = "99+"),
            t.innerHTML = e,
            e > 0 || "string" == typeof e ? t.style.display = "": t.style.display = "none"
        }
    })
}),
define("controller/cart/MiniCart", ["require", "$", "pro", "controller/BaseController", "view/cart/MiniCartView", "action/CartAction", "common/Cookie"],
function(e) {
    function t(e, t, i, n) {
        var o = this.action,
        s = {
            id: e,
            period: t,
            num: i,
            token: u.get("OTOKEN")
        };
        if (G.isLogin) o.ajax("add", s,
        function(e) {
            0 == e.code && n && n.call(this)
        });
        else {
            delete s.token;
            for (var r = o.local("cart") || [], a = !1, c = 0, l = r.length; l > c; c++) {
                var d = r[c];
                if (d.id == s.id) {
                    d.num += s.num,
                    a = !0;
                    break
                }
            }
            a || r.push(s);
            try {
                o.local("cart", r)
            } catch(h) {
                this.go("login", {
                    url: window.location.href
                })
            }
            n && n.call(this),
            o.fire("success:add", r.length)
        }
    }
    function i(e) {
        void 0 == e ? this.action.ajax("getCount") : this.view && this.view.updateCount(e)
    }
    function n() {
        var e = this.action.local("cart") || [];
        if (G.isLogin) if (e && e.length > 0) {
            for (var t = 0,
            i = e.length; i > t; t++) this.action.ajax("add", e[t]);
            this.action.local("cart", "")
        } else this.action.ajax("getCount");
        else this.view && this.view.updateCount(e.length)
    }
    function o() {
        this.listen(this.action, "success:getCount",
        function(e) {
            this.fire("change", e)
        }),
        this.listen(this.action, "success:add",
        function(e) {
            this.fire("add", e),
            this.fire("change", e)
        }),
        this.view && (this.listen("change",
        function(e) {
            this.view.updateCount(e)
        }), this.listen(this.view, "click",
        function() {
            G.isLogin ? this.go("cart", {
                t: (new Date).getTime()
            }) : this.go("login", {
                url: encodeURIComponent(window.location.href)
            })
        }))
    }
    function s(e, t, i) {
        for (var n = this,
        o = [], s = 0, r = e.length; r > s; s++) o.push({
            num: 1,
            id: e[s] - 0
        });
        this.action.ajax("batchAdd", {
            goods: JSON.stringify(o)
        },
        function(e) {
            0 == e.code ? (n.update(), t && t.call(n)) : i && i.call(n, e.code)
        },
        function(e) {
            i && i.call(n, e)
        })
    }
    function r() {
        var e = this.__config;
        e.renderFrom ? this.view = c.from(e.renderFrom) : this.view = new c({
            color: e.color
        }).render(e.renderTo || this),
        this.action = new l,
        this._listenEvents(),
        this._fetch()
    }
    var a = (e("$"), e("pro"), e("controller/BaseController")),
    c = e("view/cart/MiniCartView"),
    l = e("action/CartAction"),
    u = e("common/Cookie");
    return a.extend(r, null, {
        update: i,
        add: t,
        batchAdd: s,
        _listenEvents: o,
        _fetch: n
    })
}),
define("component/base", ["require", "pro"],
function(e) {
    function t() {
        var e = this.constructor,
        t = this.__config,
        i = e.pro;
        if (!c.version || c.version < i) throw new Error("请使用" + i + "及以上版本的pro.js");
        this.toString = r;
        var n;
        t.theme ? (n = this.theme = t.theme, n.view = this, t.template = t.template || n.Class.template) : t.Theme ? n = this.theme = new t.Theme(this, t) : e.Theme && (n = this.theme = new e.Theme(this, t)),
        n && (this.__baseClassName = n.Class.baseClassName),
        this.listen("disable",
        function() {
            this.dom.setAttribute("disabled", "disabled"),
            this.addClass(this.getClassName("disabled")),
            this.model && this.model.set("disabled", !0),
            this.theme && this.theme.use("disabled")
        }),
        this.listen("resume",
        function() {
            this.dom.removeAttribute("disabled"),
            this.removeClass(this.getClassName("disabled")),
            this.model && this.model.set("disabled", !1),
            this.theme && this.theme.use(this.__config.color)
        }),
        this.listen("create",
        function(e) {
            var t = this.__config,
            i = this.theme;
            if (i && i.use(t.color), t.className && this.addClass(t.className), t.subclass && this.addClass(this.getClassName(t.subclass)), t.style) {
                var n = "";
                if ("string" == typeof t.style) n = t.style;
                else for (var o in t.style) n += o + ":" + t.style[o] + ";";
                e.style.cssText += (/;$/.test(e.style.cssText) || !e.style.cssText ? "": ";") + n
            }
            if (t.attr) for (var o in t.attr) e.setAttribute(o, t.attr[o])
        }),
        this.listen("render",
        function() {
            this.__config.disabled && this.disable(),
            this.__config.hidden && this.hide()
        })
    }
    function i(e) {
        var t = this.Class,
        i = this.__baseClassName || t._baseClassName;
        if (i) {
            if (e) {
                for (var n = e.split(" "), o = 0, s = n.length; s > o; o++) n[o] = i + "-" + n[o];
                return n.join(" ")
            }
            return i
        }
        return ""
    }
    function n() {
        return this.from.apply(this, arguments)
    }
    function o(e, t) {
        var i = e ? this.find(e) : this.dom;
        t && !i.getAttribute("tabindex") && i.setAttribute("tabindex", "0"),
        i.focus(),
        this.fire("focus", i)
    }
    function s(e) {
        var t = e ? this.find(e) : this.dom;
        t.blur(),
        this.fire("blur", t)
    }
    function r() {
        return this.getHtml()
    }
    function a(e) {
        this.Theme = e
    }
    var c = e("pro"),
    l = c.View.extend(t, {
        pro: "1.3.5",
        version: "1.3.3",
        setTheme: a,
        by: n
    },
    {
        getClassName: i,
        focus: o,
        blur: s,
        toHtml: r
    });
    return l
}),
define("component/button", ["require", "pro", "component/base"],
function(e) {
    var t = (e("pro"), e("component/base")),
    i = t.extend(function() {
        var e = this.__config;
        this.listen("click", e.onclick),
        e.href && (this.listen("disable",
        function() {
            this.dom.href = "javascript:void(0)",
            this.dom.target = ""
        }), this.listen("resume",
        function() {
            var e = this.__config;
            this.dom.href = e.href,
            this.dom.target = e.target
        }))
    },
    {
        _css: {
            all: ".pro-btn{margin:0;padding:0 1em;height:2em;line-height:2em;border:1px solid #e0e0e0;vertical-align:middle;background-color:#f5f5f5;box-sizing:content-box;outline:none;text-decoration:none;display:inline-block;white-space:nowrap;cursor:pointer}				button.pro-btn{line-height:1;width:auto;overflow:visible}				.pro-btn:focus,				.pro-btn:hover{background-color:#fafafa;border-color:#ccc}				.pro-btn:active{background-color:#f0f0f0;border-color:#ccc}				.pro-btn-disabled{background:#e0e0e0!important;border-color:#ccc!important;color:#aaa!important;cursor:default!important}",
            iel: ".pro-btn{display:inline;zoom:1}"
        },
        _baseClassName: "pro-btn",
        _getData: function(e) {
            return {
                __tag: e.href ? "a": "button",
                text: e.text || "",
                href: e.href,
                type: e.type || "button",
                target: e.target || "_self"
            }
        },
        _template: '<{{__tag}} class="pro-btn"{{#href}} href="{{href}}"{{#target}} target="{{target}}"{{/target}}{{/href}}{{^href}}{{#type}} type="{{type}}"{{/type}}{{/href}}><span>{{{text}}}</span></{{__tag}}>',
        _events: {
            "@": "click"
        }
    },
    {
        click: function() {
            this.fire("click")
        }
    });
    return i
}),
define("component/msgbox", ["require", "pro", "component/base", "component/button"],
function(e) {
    var t = e("pro"),
    i = e("component/base"),
    n = e("component/button"),
    o = i.extend(function() {
        var e = this.__config;
        o.current && o.current.destroy(),
        this.listen("ok", e.onokclick || e.onok),
        this.listen("cancel", e.oncancelclick || e.oncancel),
        this.listen("close", e.oncloseclick || e.onclose),
        o.current = this
    },
    {
        _baseClassName: "pro-msgbox",
        _getData: function(e) {
            var t = !!(e.okText || e.onokclick || e.onok || e.ok),
            i = !!(e.cancelText || e.oncancelclick || e.oncancel || e.cancel);
            return {
                header: e.header || "",
                title: e.title || "",
                text: e.text || "",
                ok: t,
                cancel: i,
                footer: e.footer,
                __hasFooter: !!(e.footer || t || i)
            }
        },
        _css: ".pro-msgbox{width:40em;border:8px solid;border-color:#000;border-color:rgba(0,0,0,.35);font-size:14px;position:fixed;z-index:999;-position:absolute;outline:none}				.pro-msgbox-close{font-size:1.5em;width:1em;height:1em;line-height:1;color:#999;text-align:center;text-decoration:none;position:absolute;right:.3em;top:.3em}				.pro-msgbox-close:hover{color:#666}				.pro-msgbox-hd{line-height:2.4em;padding:0 1em;color:#333;background: #f0f0f0}				.pro-msgbox-bd{padding:1.5em;background:#fff;}				.pro-msgbox-ft{padding:1.5em;text-align:center;background:#fff;}				.pro-msgbox-title{font-size:1.5em;font-weight:bold;margin:0 0 1em;}				.pro-mask{position:fixed;z-index:998;-position:absolute;left:0;top:0;width:100%;height:100%;background:#000;opacity: .6; filter:alpha(opacity=60);}",
        _template: '<div class="pro-msgbox" tabindex="0">						<a data-pro="close" href="javascript:void(0);" class="pro-msgbox-close">×</a>						<div class="pro-msgbox-hd" data-pro="header">{{{header}}}</div>						<div class="pro-msgbox-bd" data-pro="entry">{{#title}}<h2 class="pro-msgbox-title">{{{title}}}</h2>{{/title}}{{{text}}}</div>						{{#__hasFooter}}							<div data-pro="footer" class="pro-msgbox-ft">{{{footer}}}</div>						{{/__hasFooter}}					</div>',
        _entry: "@entry",
        _doms: {
            header: "@header",
            footer: "@footer"
        },
        _events: {
            "@ok": "okclick",
            "@cancel": "cancelclick",
            "@close": "closeclick",
            "@/keydown": function(e, t) {
                var i = t.target || t.srcElement;
                if ("textarea" !== i.tagName) switch (t.keyCode) {
                case 13:
                    this.fire("okclick");
                    break;
                case 27:
                    this.fire("closeclick")
                }
            }
        },
        _listeners: {
            create: function() {
                var e = this,
                t = this.__config;
                this.doms.footer && (this.model.get("ok") && new n({
                    Theme: t.ButtonTheme,
                    color: t.okColor,
                    text: t.okText || "确定",
                    onclick: function() {
                        e.fire("okclick")
                    }
                }).join(this).render(this.doms.footer), this.model.get("cancel") && new n({
                    Theme: t.ButtonTheme,
                    color: t.cancelColor,
                    text: t.cancelText || "取消",
                    onclick: function() {
                        e.fire("cancelclick")
                    }
                }).join(this).render(this.doms.footer)),
                t.modeless || (this.mask = new i({
                    html: '<div class="pro-mask"></div>'
                }).join(this).render(document.body))
            },
            render: function() {
                var e = this.__config;
                this.center(),
                this.__onresize = t.bind(function() {
                    this.center()
                },
                this),
                t.addEvent(window, "resize", this.__onresize),
                e.autoFocus !== !1 && this.dom.focus()
            },
            destroy: function() {
                t.removeEvent(window, "resize", this.__onresize),
                o.current = null
            },
            okclick: function() {
                this.fire("ok") !== !1 && this.destroy()
            },
            closeclick: function() {
                this.fire("cancel") !== !1 && this.fire("close") !== !1 && this.destroy()
            },
            cancelclick: function() {
                this.fire("cancel") !== !1 && this.destroy()
            }
        },
        show: function(e) {
            new this(e).render(document.body)
        }
    },
    {
        center: function() {
            var e = this.dom,
            t = document.documentElement,
            i = e.offsetWidth,
            n = e.offsetHeight,
            o = t.clientWidth,
            s = t.clientHeight;
            t.scrollTop,
            t.scrollLeft;
            e.style.left = (o - i) / 2 + "px",
            e.style.top = (s - n) / 2 + "px";
            var r = this.mask;
            if (r && r.dom.offsetHeight < s) {
                var a = r.dom,
                c = t.scrollHeight;
                a.style.height = c + "px",
                e.style.top = e.offsetTop + t.scrollTop + "px"
            } else e.offsetTop < 0 ? (e.style.position = "absolute", e.style.top = (t.scrollTop || document.body.scrollTop) + "px") : e.style.position = ""
        }
    });
    return o
}),
define("ui/Msgbox", ["require", "$", "pro", "component/msgbox"],
function(e) {
    var t = (e("$"), e("pro"), e("component/msgbox"));
    return t.extend(function() {
        var e = this.__config;
        this.model.set("__btnCount",
        function() {
            var e = 0;
            return e = this.ok && this.cancel ? 2 : 1
        }),
        this.model.set("center", e.center),
        this.model.set("close", e.close)
    },
    {
        _css: "",
        _baseClassName: "w-msgbox",
        _template: ['<div class="w-msgbox{{#center}} w-msgbox-center{{/center}}">', '{{#close}}<div data-pro="close" class="w-msgbox-close">×</div>{{/close}}', '<div class="w-msgbox-bd"><h3 class="w-msgbox-title">{{{title}}}</h3>{{{text}}}</div>', "{{#__hasFooter}}", '<div data-pro="footer" class="w-msgbox-ft w-msgbox-ft-{{__btnCount}}">{{{footer}}}</div>', "{{/__hasFooter}}", "</div>"].join(""),
        _events_extend: {
            "@/touchstart": function() {
                window.scrollTo(0, document.body.scrollTop + 1)
            }
        }
    })
}),
define("controller/CommonController", ["require", "$", "pro", "controller/BaseController", "controller/cart/MiniCart", "action/BaseAction", "common/Location", "common/Cookie", "ui/Msgbox"],
function(e) {
    function t(e, t) {
        var i = t.list,
        n = t.pageSize,
        o = t.pageNum,
        s = this;
        e.render(s);
        var r = e.list;
        if (r.insert(i), e.hideLoading(), 0 == r.getCount() ? (e.showBlank(), s.isHideMore || e.hideMore()) : (e.hideBlank(), s.isHideMore || e.showMore()), !s.isHideMore) {
            var a = n * (o - 1);
            i.length + a >= t.totalCnt && e.disableMore()
        }
    }
    function i() {
        var t = G.ver || "";
        "dashi" == t && e(["controller/dashi/Index"],
        function(e) {
            new e
        })
    }
    function n() {
        1 == g.getParam("needLogin") && (window.location.href = G.host + "/login.do"),
        d(".m-link-logout").bind("click",
        function() {
            return window.location.href = "http://reg.163.com/Logout.jsp?username=" + G.uid.split("@")[0] + "&url=" + encodeURIComponent(G.homeUrl),
            !1
        })
    }
    function o(e) {
        f.ajax("/user/global.do", null,
        function(t) {
            if (t.code - 0 == 0) {
                var i = t.result;
                d.extend(G, i),
                e && e()
            }
        })
    }
    function s() {
        f.ajax("/user/bonus/num.do", null,
        function(e) {
            if (e.code - 0 == 0) {
                var t = e.result.valid,
                i = d(".m-header-toolbar .bonusBtn .ico-dot");
                t > 0 ? i.show() : i.hide()
            }
        })
    }
    function r(e) {
        var t = parseInt(d(window).height()),
        i = 0,
        e = e || {},
        n = h.View.extend({
            _template: '<button class="w-button w-button-round w-button-backToTop" style="display:none" id="backToTop">返回顶部</button>',
            _events: {
                "@": "click"
            }
        }),
        o = new n;
        o.render(document.body),
        e.bottom && (o.dom.style.bottom = e.bottom),
        d(window).on("scroll",
        function() {
            i = document.body.scrollTop + document.documentElement.scrollTop,
            i > .5 * t ? o.show() : o.hide()
        }),
        this.listen(o, "click",
        function() {
            document.documentElement && (document.documentElement.scrollTop = 0),
            document.body && (document.body.scrollTop = 0),
            o.hide()
        })
    }
    function a(e) {
        var t = this,
        e = (parseInt(d(window).height()), e || {}),
        i = h.View.extend({
            _template: '<button class="w-button w-button-round w-button-backToHome">返回首页</button>',
            _events: {
                "@": "click"
            }
        }),
        n = new i;
        n.render(document.body),
        e.bottom && (n.dom.style.bottom = e.bottom),
        this.listen(n, "click",
        function() {
            t.go("home")
        })
    }
    function c(e) {
        var t = this;
        t.miniCart = new m({
            color: e && e.color || null
        })
    }
    function l() {
        var e = this;
        f.ajax("/user/getNewestReward.do", null,
        function(t) {
            var i = t.result.prize,
            n = t.result.hasBonus,
            o = t.result.wishlist;
            if (i.gid) {
                i.isVirtual = i.property && 1 == i.property ? !0 : !1;
                var s = ['<p style="text-indent:2em">恭喜您成功夺得<b class="txt-red">{{gname}}</b>(期号：{{period}})，{{#isVirtual}}商品已经充值到您的网易邮箱帐号，请注意查收。{{/isVirtual}}{{^isVirtual}}请确认收货地址，以便安排商品发放！{{/isVirtual}}</p>'].join("");
                b.show({
                    title: "猜猜发生什么事？！",
                    text: h.template(s, i),
                    ok: !0,
                    onokclick: function() {
                        e.go("userWin")
                    },
                    okText: i.isVirtual ? "查看": "立即确认",
                    cancel: !0,
                    cancelText: "知道了"
                })
            } else if (n) b.show({
                className: "w-msgbox-special w-msgbox-special-getBonus",
                text: '<a class="w-msgbox-special-getBonus-link" href="javascript:void(0)">恭喜您<br/>获得新的红包！</a>',
                ok: !1,
                cancel: !0,
                onafterrender: function() {
                    d(".w-msgbox-special-getBonus-link").click(function() {
                        e.go("bonus", {
                            status: t.result.bonusStatus || ""
                        })
                    })
                }
            });
            else if (o) switch (o.status - 0) {
            case 0:
                b.show({
                    title:
                    "您的心愿单在指定时间内未完成！",
                    text: o.supporter > 0 ? '<p style="text-align:center">朋友们支持的款项已转为红包了哦！</p>': "",
                    okText: "立即查看",
                    onok: function() {
                        window.location.href = G.host + "/user/wishlist.do"
                    }
                });
                break;
            case 1:
                b.show({
                    title:
                    '<p style="text-align:left">您的心愿单即将到期结束，凑单仍未满额！<p>',
                    text: "<p>您可以：<br/>赶快叫更多朋友来凑单；<br/>自己也可以补足余额实现心愿</p>",
                    okText: "立即查看",
                    onok: function() {
                        window.location.href = G.host + "/user/wishlist.do"
                    }
                });
                break;
            case 2:
                b.show({
                    title:
                    '<p style="text-align:left">恭喜，您的心愿单已实现！<br/>赶紧填写地址，我们将速度为您发出礼物！</p>',
                    text: "别忘了感谢默默支持的他们~",
                    okText: o.property && 1 == o.property ? "立即查看": "立即确认收货地址",
                    onok: function() {
                        window.location.href = G.host + "/user/wishDetail.do?wid=" + o.wid
                    }
                })
            }
        })
    }
    function u() {
        function e(e) {
            0 === e.indexOf("no_") && d(".footer_dl").remove()
        }
        if ("" != v.get("from")) return void e(v.get("from"));
        var t = g.getParam("from"),
        i = g.getParam("kw");
        t && (v.set("from", t, "h3", "", ".1.163.com"), v.set("kw", i || "", "h3", "", ".1.163.com"), e(t))
    }
    var d = e("$"),
    h = e("pro"),
    p = e("controller/BaseController"),
    m = e("controller/cart/MiniCart"),
    f = e("action/BaseAction"),
    g = e("common/Location"),
    v = e("common/Cookie"),
    b = e("ui/Msgbox");
    return p.extend(i, {},
    {
        listSucc: t,
        initLogin: n,
        getGlobal: o,
        getBonusAmount: s,
        initBackToTop: r,
        showBackToHome: a,
        renderMiniCart: c,
        getNewestReward: l,
        setCookie: u,
        miniCart: {}
    })
}),
define("model/UserModel", ["require", "pro", "common/Utils"],
function(e) {
    var t = e("pro"),
    i = e("common/Utils");
    return t.Model.extend({
        _data: {
            cid: 0,
            uid: "",
            nickname: "",
            isFirstLogin: 0,
            coin: 0,
            total: 0,
            mobile: "",
            avatarPrefix: "",
            IP: "",
            IPAddress: "",
            userpage: function() {
                return i.getUserPage(this.cid)
            },
            avatar: function() {
                return i.avatar(this, this.avatarSize || 160)
            }
        }
    })
}),
define("model/GoodsModel", ["require", "pro", "common/Utils"],
function(e) {
    var t = e("pro"),
    i = e("common/Utils");
    return t.Model.extend({
        _data: {
            gid: 0,
            gname: "",
            gpic: [],
            desc: "",
            price: 0,
            priceType: 1,
            typeId: 0,
            priceUnit: 1,
            tag: "",
            buyable: !0,
            buyUnit: 1,
            shortUrl: function() {
                return i.getGoodsUrl(this.gid)
            },
            largePic: function() {
                return i.getGoodsImg(this.gpic, "l")
            },
            smallPic: function() {
                return i.getGoodsImg(this.gpic, "s")
            },
            normalPic: function() {
                return i.getGoodsImg(this.gpic, "m")
            },
            isTen: function() {
                return 10 == this.buyUnit
            },
            isVirtual: function() {
                var e = !1;
                return this.property && /(^|,)1($|,)/.test(this.property) && (e = !0),
                e
            },
            isWishGoodsList: !1
        }
    })
}),
define("model/PeriodGoodsModel", ["require", "pro", "model/GoodsModel", "common/Utils"],
function(e) {
    var t = (e("pro"), e("model/GoodsModel")),
    i = e("common/Utils");
    return t.extend({
        _data_extend: {
            id: 0,
            period: 0,
            totalPeriod: 0,
            status: 0,
            isLimit: !1,
            limitTime: 0,
            remainTime: 0,
            existingTimes: 0,
            isCounting: function() {
                return 2 == this.status
            },
            isErr: function() {
                return 864e5 == this.remainTime
            },
            gurl: function() {
                return i.getGoodsUrl(this.gid, this.period, 3 == this.status ? !0 : !1)
            },
            remainTimes: function() {
                return this.price - this.existingTimes
            },
            percent: function() {
                return Math.round(this.existingTimes / this.price * 100)
            }
        }
    })
}),
define("model/BankModel", ["require", "pro"],
function(e) {
    var t = e("pro"),
    i = t.Model.extend({
        __isTest: /^(?:m\.)?(?:1\.gztest|xparkdev\d|yxtest)\.mail\.163\.com$/.test(window.location.host),
        get: function(e) {
            return new this(this.bankMap[e] || {})
        },
        getYixin: function() {
            return this.get("9998")
        },
        getWeixin: function() {
            return this.get("JSWX")
        },
        getWeibo: function() {
            return this.get("MOWB")
        },
        getWYB: function() {
            return this.get("9999")
        },
        getNews: function() {
            return this.get("NEWS")
        },
        getMob: function() {
            var e = this.getType(4);
            return this.__isTest && e.push(this.get("9968")),
            e.push(this.get("9999")),
            e.sort(function(e, t) {
                var i = e.get("weight") || 0,
                n = t.get("weight") || 0;
                return i > n ? -1 : 1
            }),
            e
        },
        getAll: function(e) {
            var t = [];
            for (var i in this.bankMap) {
                var n = this.bankMap[i],
                o = n.type < 0;
                e && o || (this.__isTest || "9968" != n.type) && t.push(new this(n))
            }
            return t
        },
        getType: function(e) {
            var t = [];
            for (var i in this.bankMap) {
                var n = this.bankMap[i];
                n.type == e && t.push(new this(n))
            }
            return t
        },
        _data: {
            bankCode: "",
            name: "",
            type: 0,
            logo: !1,
            typeName: function() {
                return i.typeMap[this.type]
            }
        },
        typeMap: {
            0 : "支付平台",
            1 : "储蓄卡",
            2 : "信用卡",
            3 : "网易宝",
            4 : "手机",
            5 : "易信",
            6 : "微信",
            7 : "米币",
            8 : "微博",
            9 : "新闻钱包",
            "-1": "系统",
            "-9": "测试"
        },
        bankMap: {
            "0023": {
                name: "支付宝",
                type: 0,
                logo: !0
            },
            9999 : {
                name: "网易宝",
                type: 3,
                weight: 8,
                logo: !0
            },
            9998 : {
                name: "易信支付",
                type: 5,
                weight: 8,
                logo: !1
            },
            JSWX: {
                name: "微信支付",
                type: 6,
                weight: 8,
                logo: !1
            },
            SKWX: {
                name: "微信支付",
                type: 6,
                logo: !1
            },
            MOWX: {
                name: "微信支付",
                type: 6,
                logo: !1
            },
            SMWX: {
                name: "微信支付",
                type: 6,
                logo: !0
            },
            WEBO: {
                name: "微博支付",
                type: 8,
                weight: 8,
                logo: !1
            },
            MOWB: {
                name: "微博支付",
                type: 8,
                weight: 8,
                logo: !1
            },
            PCWB: {
                name: "微博支付",
                type: 8,
                weight: 8,
                logo: !1
            },
            NEWS: {
                name: "新闻钱包支付",
                type: 9,
                weight: 8,
                logo: !1
            },
            "0001": {
                name: "工商银行",
                type: 1,
                logo: !0
            },
            "0004": {
                name: "建设银行",
                type: 1,
                logo: !0
            },
            "0002": {
                name: "农业银行",
                type: 1,
                logo: !0
            },
            "0009": {
                name: "中国银行",
                type: 1,
                logo: !0
            },
            "0006": {
                name: "邮储银行",
                type: 1,
                logo: !0
            },
            "0003": {
                name: "招商银行",
                type: 1,
                logo: !0
            },
            "0014": {
                name: "交通银行",
                type: 1,
                logo: !0
            },
            "0013": {
                name: "民生银行",
                type: 1,
                logo: !0
            },
            "0200": {
                name: "中信银行",
                type: 1,
                logo: !1
            },
            "0016": {
                name: "华夏银行",
                type: 1,
                logo: !1
            },
            "0008": {
                name: "光大银行",
                type: 1,
                logo: !1
            },
            "0007": {
                name: "兴业银行",
                type: 1,
                logo: !1
            },
            "0010": {
                name: "平安银行",
                type: 1,
                logo: !1
            },
            "0011": {
                name: "浦发银行",
                type: 1,
                logo: !1
            },
            "0022": {
                name: "广发银行",
                type: 1,
                logo: !1
            },
            "0017": {
                name: "温州银行",
                type: 1,
                logo: !1
            },
            "0019": {
                name: "渤海银行",
                type: 1,
                logo: !1
            },
            "0021": {
                name: "汉口银行",
                type: 1,
                logo: !1
            },
            "0032": {
                name: "浙商银行",
                type: 1,
                logo: !1
            },
            "0033": {
                name: "宁波银行",
                type: 1,
                logo: !1
            },
            "0155": {
                name: "杭州银行",
                type: 1,
                logo: !1
            },
            "0061": {
                name: "建设银行",
                type: 2,
                logo: !0
            },
            "0039": {
                name: "招商银行",
                type: 2,
                logo: !0
            },
            "0067": {
                name: "招商银行",
                hidden: !0,
                type: 2,
                logo: !1
            },
            "0060": {
                name: "中国银行",
                type: 2,
                logo: !0
            },
            "0206": {
                name: "中信银行",
                type: 2,
                logo: !0
            },
            "0071": {
                name: "工商银行",
                type: 2,
                logo: !0
            },
            "0066": {
                name: "兴业银行",
                type: 2,
                logo: !0
            },
            "0059": {
                name: "交通银行",
                type: 2,
                logo: !0
            },
            "0069": {
                name: "民生银行",
                type: 2,
                logo: !0
            },
            "0064": {
                name: "光大银行",
                type: 2,
                logo: !1
            },
            "0065": {
                name: "平安银行",
                type: 2,
                logo: !1
            },
            "0070": {
                name: "浦发银行",
                type: 2,
                logo: !1
            },
            "0057": {
                name: "汉口银行",
                type: 2,
                logo: !1
            },
            "0058": {
                name: "广发银行",
                type: 2,
                logo: !1
            },
            "0072": {
                name: "支付宝",
                weight: 9,
                type: 4
            },
            6001 : {
                name: "银联移动支付",
                weight: 3,
                type: 4
            },
            8003 : {
                name: "招商银行（信用卡）",
                weight: 2,
                type: 4
            },
            "0205": {
                name: "建设银行（信用卡）",
                weight: 2,
                type: 4
            },
            "0130": {
                name: "中国银行（信用卡）",
                weight: 2,
                type: 4
            },
            "0120": {
                name: "农业银行（信用卡）",
                weight: 2,
                type: 4
            },
            8123 : {
                name: "招商银行（储蓄卡）",
                weight: 1,
                type: 4
            },
            2404 : {
                name: "建设银行（储蓄卡）",
                weight: 1,
                type: 4
            },
            8128 : {
                name: "中国银行（储蓄卡）",
                weight: 1,
                type: 4
            },
            8129 : {
                name: "交通银行（储蓄卡）",
                weight: 1,
                type: 4
            },
            2402 : {
                name: "农业银行（储蓄卡）",
                weight: 1,
                type: 4
            },
            AZFB: {
                name: "支付宝App",
                type: 0
            },
            IZFB: {
                name: "支付宝App",
                type: 0
            },
            AWYB: {
                name: "网易宝App",
                type: 0
            },
            IWYB: {
                name: "网易宝App",
                type: 0
            },
            AGXM: {
                name: "米币支付",
                type: 7,
                logo: !1
            },
            9968 : {
                name: "江负银行",
                weight: 10,
                type: -9
            },
            S001: {
                name: "系统赠送",
                type: -1
            },
            S002: {
                name: "系统赠送",
                type: -1
            },
            M001: {
                name: "晒单奖励",
                type: -1
            }
        }
    });
    for (var n in i.bankMap) {
        var o = i.bankMap[n];
        o.bankCode = n
    }
    return i
}),
define("model/CartGoodsModel", ["require", "pro", "model/PeriodGoodsModel"],
function(e) {
    var t = (e("pro"), e("model/PeriodGoodsModel"));
    return t.extend({
        _data_extend: {
            num: 0,
            renew: 0,
            cut: 0,
            proofLimitNum: -1,
            proofTips: "",
            proofLimit: function() {
                return this.num > this.proofLimitNum
            },
            overflow: function() {
                return this.num > this.remainTimes()
            }
        }
    })
}),
define("model/ChargeRcdModel", ["require", "pro", "model/BankModel"],
function(e) {
    function t(e) {
        var t = /(\d+)(\d{3})/;
        for (e += ""; t.test(e);) e = e.replace(t, "$1,$2");
        return e
    }
    var i = e("pro"),
    n = e("model/BankModel");
    return i.Model.extend({
        _data: {
            code: "",
            status: 0,
            time: "",
            from: "",
            amount: 0,
            freeCoin: 0,
            _expire: function() {
                return 2 == this.status
            },
            _amount: function() {
                return t(this.amount)
            },
            _from: function() {
                var e = this.from,
                t = n.bankMap[e] || {
                    name: "M001" == e ? "晒单奖励": e,
                    type: -1
                };
                return t.name
            }
        }
    })
}),
define("model/DuobaoRcdModel", ["require", "pro", "common/Utils", "model/GoodsModel"],
function(e) {
    var t = e("pro"),
    i = e("common/Utils"),
    n = e("model/GoodsModel");
    return t.Model.extend({
        _data: {
            goods: n,
            period: 0,
            type: 0,
            num: 0,
            status: 0,
            existingTimes: 0,
            calcTime: "",
            ownerId: 0,
            ownerName: "",
            luckyCode: "",
            ownerTotal: 0,
            _remainTimes: function() {
                var e = this.goods.get();
                return e.price - this.existingTimes
            },
            _percent: function() {
                var e = this.goods.get();
                return Math.round(this.existingTimes / e.price * 100)
            },
            _ownerUrl: function() {
                return i.getUserPage(this.ownerId)
            },
            _url: function() {
                var e = this.goods.get();
                return i.getGoodsUrl(e.gid, this.period, 1 == this.status ? !1 : !0)
            },
            _full: function() {
                return 2 == this.status
            },
            _end: function() {
                return 3 == this.status
            },
            _exp: function() {
                return 0 == this.status
            },
            _ing: function() {
                return 1 == this.status
            },
            _isFree: function() {
                return 2 == this.type
            }
        }
    })
}),
define("model/MyWinRcdModel", ["require", "pro", "common/Utils", "model/GoodsModel"],
function(e) {
    var t = e("pro"),
    i = e("common/Utils"),
    n = e("model/GoodsModel");
    return t.Model.extend({
        _data: {
            id: "",
            period: 0,
            goods: n,
            luckyCode: "",
            winTime: "",
            buyTime: "",
            status: 0,
            total: 0,
            addrTime: "",
            shipTime: "",
            confirmTime: "",
            _winTime: function() {
                var e = this.winTime,
                t = e.split(":");
                return t[0] + ":" + t[1]
            },
            _toAddress: function() {
                return 0 == this.status
            },
            _toShip: function() {
                return 1 == this.status
            },
            _toConfirm: function() {
                return 2 == this.status
            },
            _end: function() {
                return 3 == this.status
            },
            _overdue: function() {
                return 4 == this.status
            },
            _payback: function() {
                return 5 == this.status
            },
            _goodsback: function() {
                return 6 == this.status
            },
            _goodsgiveup: function() {
                return 7 == this.status
            },
            _goodsgiveupreviewing: function() {
                return 8 == this.status
            },
            _url: function() {
                var e = this.goods.get();
                return i.getGoodsUrl(e.gid, this.period, 1 == this.status ? !1 : !0)
            }
        }
    })
}),
define("model/PaidGoodsModel", ["require", "pro", "model/PeriodGoodsModel"],
function(e) {
    var t = (e("pro"), e("model/PeriodGoodsModel"));
    return t.extend({
        _data_extend: {
            time: 0,
            num: 0,
            luckyCode: [],
            regularBuy: 1,
            isRegularBuy: function() {
                return this.regularBuy > 1
            }
        }
    })
}),
define("model/ShareModel", ["require", "pro", "common/Utils", "model/UserModel", "model/MyWinRcdModel"],
function(e) {
    function t(e) {
        function t(e) {
            var t = e + "";
            return t.length < 2 ? "0" + t: t
        }
        var i = e.replace(/-/g, "/"),
        n = new Date(i),
        o = new Date,
        s = n.getHours(),
        r = n.getMinutes();
        return o.getFullYear() != n.getFullYear() ? n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + " " + t(s) + ":" + t(r) : o.getMonth() == n.getMonth() && o.getDate() == n.getDate() ? "今天 " + t(s) + ":" + t(r) : n.getMonth() + 1 + "-" + n.getDate() + " " + t(s) + ":" + t(r)
    }
    var i = e("pro"),
    n = e("common/Utils"),
    o = e("model/UserModel"),
    s = e("model/MyWinRcdModel");
    return i.Model.extend({
        _data: {
            title: "",
            content: "",
            images: [],
            author: o,
            date: "",
            winRecord: s,
            status: 0,
            _date: function() {
                return t(this.date)
            },
            _userUrl: function() {
                var e = this.author.get();
                return n.getUserPage(e.cid)
            },
            _status: function() {
                return 0 == this.status ? '<span class="toAudit">等待审核</span>': 1 == this.status ? '<span class="txt-suc">审核通过</span>': '<span class="txt-impt">审核不通过</span>'
            },
            _goodsUrl: function() {
                var e = this.winRecord.get();
                return n.getGoodsUrl(e.goods.gid, e.period, !0)
            },
            _img: function() {
                return n.getSharePic(this.images[0], "m")
            },
            _shareUrl: function() {
                var e = this.author.get(),
                t = this.winRecord.get();
                return n.getShareDetailPage(e.cid, t.goods.gid, t.period)
            }
        }
    })
}),
define("model/ShipAddrModel", ["require", "pro", "common/Utils", "model/UserModel", "model/MyWinRcdModel"],
function(e) {
    var t = e("pro");
    e("common/Utils"),
    e("model/UserModel"),
    e("model/MyWinRcdModel");
    return t.Model.extend({
        _data: {
            id: "",
            aid: "",
            aname: "",
            bid: "",
            bname: "",
            cid: "",
            cname: "",
            zip: "",
            address: "",
            name: "",
            mobile: "",
            dft: "0",
            _sel: !1,
            _isDft: function() {
                return 1 == this.dft
            },
            _mobile: function() {
                return this.mobile ? this.mobile: ""
            },
            _tel: function() {
                return this.telPre && this.telNum ? this.telPre + "-" + this.telNum: ""
            },
            _getMobile: function() {
                var e = this,
                t = e._mobile;
                "function" == typeof t && (t = e._mobile());
                var i = e._tel;
                return "function" == typeof i && (i = e._tel()),
                t ? t: i
            },
            fullAddress: function() {
                var e = [];
                return this.aname && e.push(this.aname),
                this.bname && e.push(this.bname),
                this.cname && e.push(this.cname),
                this.address && e.push(this.address),
                this.zip && e.push(this.zip),
                e.join("，")
            }
        }
    })
}),
define("model/WinRecordModel", ["require", "pro", "common/Utils", "model/PeriodGoodsModel", "model/UserModel"],
function(e) {
    var t = (e("pro"), e("common/Utils"), e("model/PeriodGoodsModel")),
    i = e("model/UserModel");
    return t.extend({
        _data_extend: {
            owner: i,
            calcTime: "",
            duobaoTime: "",
            luckyCode: "",
            ownerAllCode: [],
            ownerCost: 0,
            cost: 0
        }
    })
}),
define("ui/Bar", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        var e = this.__config;
        this.listen("click", e.onclick)
    },
    {
        _template: ['<div class="w-bar">{{{text}}}', '{{#ext}}<div class="w-bar-ext">{{{ext}}}</div>{{/ext}}', '{{#next}}<div class="w-bar-ext"><b class="ico-next"></b></div>{{/next}}', "</div>"].join(""),
        _getData: function(e) {
            return {
                text: e.text,
                ext: e.ext,
                next: !!e.next
            }
        },
        _events: {
            "@": "click"
        }
    })
}),
define("ui/Button", ["require", "$", "pro", "component/button"],
function(e) {
    var t = (e("$"), e("pro"), e("component/button"));
    return t.extend({
        _css: "",
        _baseClassName: "w-button",
        _template: '<button class="w-button">{{text}}</button>'
    })
}),
define("component/checkbox", ["require", "component/base"],
function(e) {
    var t = e("component/base"),
    i = t.extend(function() {
        var e = this.__config;
        this.listen("change", e.onchange),
        this.listen("check", e.oncheck),
        this.listen("uncheck", e.onuncheck),
        this.listen("create",
        function(e) {
            var t = this.__config;
            t.checked ? this.check() : this.uncheck()
        }),
        this.listen("disable",
        function() {
            this.doms.input.setAttribute("disabled", "disabled")
        }),
        this.listen("resume",
        function() {
            this.doms.input.removeAttribute("disabled")
        })
    },
    {
        _getData: function(e) {
            return {
                text: e.text,
                name: e.name,
                value: e.value,
                right: !!e.right,
                checked: !!e.checked
            }
        },
        _baseClassName: "pro-checkbox",
        _template: '<label class="pro-checkbox">{{#right}}{{#text}}<span>{{{text}}}</span> {{/text}}{{/right}}<input type="checkbox"{{#name}} name="{{name}}"{{/name}}{{#value}} value="{{value}}"{{/value}}{{#checked}} checked{{/checked}}/>{{^right}} {{#text}}<span>{{{text}}}</span>{{/text}}{{/right}}</label>',
        _doms: {
            input: "input"
        },
        _events: {
            "input/change": function(e) {
                var t = e.checked;
                this.model.set("checked", t),
                t ? this.check() : this.uncheck(),
                this.fire("change", e.checked)
            },
            "input/click": function(e) {
                e.blur(),
                e.focus()
            }
        }
    },
    {
        check: function() {
            var e = 0 == this.getChecked();
            this.doms.input.checked = !0,
            this.fire("check"),
            e && this.fire("change", !0)
        },
        uncheck: function() {
            var e = 1 == this.getChecked();
            this.doms.input.checked = !1,
            this.fire("uncheck"),
            e && this.fire("change", !1)
        },
        getChecked: function() {
            return this.doms.input.checked
        },
        getValue: function() {
            return this.doms.input.value
        },
        setValue: function(e) {
            return this.doms.input.value = e
        }
    });
    return i
}),
define("ui/CheckBar", ["require", "$", "pro", "component/checkbox"],
function(e) {
    var t = (e("$"), e("pro"), e("component/checkbox"));
    return t.extend(function() {
        var e = this.__config;
        e.label && this.model.set("text", e.label),
        this.model.set("checkbox", e.checkbox),
        this.listen("check",
        function() {
            this.addClass(this.getClassName("checked"))
        }),
        this.listen("uncheck",
        function() {
            this.removeClass(this.getClassName("checked"))
        }),
        this.listen("click",
        function() {
            this.getChecked() ? this.uncheck() : this.check()
        })
    },
    {
        _baseClassName: "w-checkBar",
        _template: ['<div class="w-checkBar w-bar">{{{text}}}<div class="w-bar-ext">{{#checkbox}}<b data-pro="switcher" class="w-checkbox"></b>{{/checkbox}}{{^checkbox}}<b data-pro="switcher" class="w-switcher"></b>{{/checkbox}}<input{{#name}} name="{{name}}"{{/name}} type="checkbox"/></div></div>'].join(""),
        _events_extend: {
            "@": "click"
        }
    })
}),
define("component/input", ["require", "pro", "component/base"],
function(e) {
    var t = e("pro"),
    i = e("component/base"),
    n = i.extend(function() {
        var e = this.__config;
        this.validator = e.validator,
        this.validator && this.listen("change",
        function() {
            return this.validate()
        }),
        this.listen("keypress", e.onkeypress),
        this.listen("keydown", e.onkeydown),
        this.listen("keyup", e.onkeyup),
        this.listen("enter", e.onenter),
        this.listen("change", e.onchange),
        this.listen("focus", e.onfocus),
        this.listen("blur", e.onblur),
        this.listen("valid", e.onvalid),
        this.listen("invalid", e.oninvalid),
        this.listen("tipsshow", e.ontipsshow),
        this.listen("tipshide", e.ontipshide),
        this.listen("create",
        function(e) {
            var t = this.Class;
            this.doms.input;
            this.model.get("placeholder") && (this.placeholder = new t.Placeholder({
                text: this.model.get("placeholder")
            }).join(this).render(this)),
            this.model.get("value") && this.setValue(this.model.get("value"))
        }),
        this.listen("disable",
        function() {
            this.doms.input.setAttribute("disabled", "disabled")
        }),
        this.listen("resume",
        function() {
            this.doms.input.removeAttribute("disabled")
        })
    },
    {
        _getData: function(e) {
            return {
                placeholder: e.placeholder,
                value: e.value || "",
                type: e.type || "text",
                maxLength: e.maxLength || e.maxlength,
                name: e.name
            }
        },
        _css: {
            all: ".pro-input{position:relative;width:10em;height:2em;border:1px solid #e0e0e0;padding:0 .6em;vertical-align:middle;display:inline-block;cursor:text}.pro-input-textarea{height:auto}.pro-input-input{position:relative;top:.3em;font-size:100%;width:100%;height:auto;padding:0;vertical-align:top;margin:0;border:none;position:relative;z-index:2;background-color:transparent;resize:none;outline:none}.pro-input .pro-placeholder{position:absolute;left:.6em;top:.4em;line-height:1.25;color:#999;z-index:1}.pro-input-textarea .pro-placeholder{left:.6em;line-height:1.5;padding:0}.pro-input-tips{display:block;line-height:2;font-size:smaller}.pro-input-tips-err{color:#f00}.pro-input-tips-suc{color:#390}.pro-input-disabled{background-color:#f0f0f0;color:#999}",
            iel: ".pro-input{display:inline;zoom:1}"
        },
        _baseClassName: "pro-input",
        _template: '<div class="pro-input"><input data-pro="input" class="pro-input-input" type="{{type}}"{{#maxLength}} maxlength="{{maxLength}}"{{/maxLength}}{{#name}} name="{{name}}"{{/name}}/></div>',
        _doms: {
            input: "@input"
        },
        _events: {
            "@": function() {
                this.focus()
            },
            "@input/focus": "focus",
            "@input/blur": "blur",
            "@input/keypress": function(e, t) {
                this.fire("keypress", t.keyCode, t),
                13 == t.keyCode && this.fire("enter", t)
            },
            "@input/keydown": function(e, t) {
                this.fire("keydown", t.keyCode, t)
            },
            "@input/keyup": function(e, t) {
                this.fire("keyup", t.keyCode, t)
            },
            "@input/change": function(e) {
                this.fire("change", e.value)
            }
        },
        Tips: i.extend({
            _getData: function(e) {
                return {
                    text: e.text
                }
            },
            _template: '<span class="pro-input-tips">{{text}}</span>'
        }),
        Placeholder: i.extend(function(e) {
            this.listen("create",
            function() {
                function e() {
                    t.delay(function() {
                        this.getParent().getValue() ? this.hide() : this.show()
                    },
                    this)
                }
                var i = this.getParent();
                this.listen(i, "keydown", e),
                this.listen(i, "keyup", e),
                this.listen(i, "change", e),
                this.listen(i, "blur",
                function() {
                    this.getParent().getValue() || this.show()
                })
            })
        },
        {
            _getData: function(e) {
                return {
                    text: e.text
                }
            },
            _template: '<span class="pro-placeholder">{{text}}</span>',
            _events: {
                "@": function() {
                    this.getParent().focus()
                }
            }
        })
    },
    {
        validate: function() {
            if (!this.validator) return ! 1;
            var e = (this.Class, this.getValue()),
            t = this.validator(e);
            return "string" == typeof t ? (this.showTips(t, this.getClassName("tips-err")), this.__valid = !1, this.fire("invalid", e, t), !1) : (this.hideTips(), this.__valid = !0, this.fire("valid", e, t), !0)
        },
        isValid: function() {
            return !! this.__valid
        },
        select: function() {
            this.doms.input.select()
        },
        focus: function() {
            this.doms.input.focus()
        },
        blur: function() {
            this.doms.input.blur()
        },
        setValue: function(e) {
            this.doms.input.value = e,
            this.fire("change", e)
        },
        getValue: function() {
            return this.doms.input.value
        },
        clear: function() {
            this.setValue("")
        },
        showTips: function(e, t) {
            return this.tips && this.tips.dom ? this.tips.update({
                className: t,
                text: e
            }) : this.tips = new n.Tips({
                className: t,
                text: e
            }).render(this.dom.parentNode).join(this),
            this.fire("tipsshow", this.tips),
            this.tips
        },
        hideTips: function() {
            this.tips && (this.tips.destroy(), this.tips = null, delete this.tips, this.fire("tipshide"))
        }
    });
    return n
}),
define("ui/InputBar", ["require", "$", "pro", "component/input", "ui/Msgbox"],
function(e) {
    function t(e) {
        n.show({
            center: !0,
            text: e,
            ok: !0
        })
    }
    var i = (e("$"), e("pro"), e("component/input")),
    n = e("ui/Msgbox");
    return i.extend(function() {
        var e = this.__config;
        this.model.set({
            label: e.label,
            clear: !!e.clear,
            textarea: !!e.textarea
        }),
        this.listen("clearclick",
        function() {
            this.setValue("")
        }),
        e.clear && (this.listen("focus",
        function() {
            this.doms.clear.style.display = "block"
        }), this.listen("blur",
        function() {
            this.doms.clear.style.display = "none"
        }))
    },
    {
        _css: "",
        _baseClassName: "w-inputBar",
        _template: ['<div class="w-inputBar w-bar">', "{{#label}}", '<div class="w-bar-label">{{{label}}}</div>', "{{/label}}", "{{#clear}}", '<a data-pro="clear" href="javascript:void(0);" class="w-bar-input-clear">×</a>', "{{/clear}}", '<div class="w-bar-control">', "{{#textarea}}", '<textarea{{#placeholder}} placeholder="{{placeholder}}"{{/placeholder}} data-pro="input" class="w-bar-input" name="{{name}}"{{#maxLength}} maxlength="{{maxLength}}"{{/maxLength}}>{{value}}</textarea>', "{{/textarea}}", "{{^textarea}}", '<input{{#placeholder}} placeholder="{{placeholder}}"{{/placeholder}} data-pro="input" class="w-bar-input" type="{{type}}" name="{{name}}" value="{{value}}"{{#maxLength}} maxlength="{{maxLength}}"{{/maxLength}}/>', "{{/textarea}}", "</div>", "</div>"].join(""),
        _entry: ".w-bar-control",
        _doms_extend: {
            clear: "@clear"
        },
        _events_extend: {
            "@clear/touchstart": "clearclick"
        },
        Placeholder: i.Placeholder.extend({
            _template: '<span hidden class="w-inputBar-placeholder">{{text}}</span>'
        })
    },
    {
        showTips: t
    })
}),
define("component/radio", ["require", "pro", "component/base", "component/checkbox"],
function(e) {
    var t = e("pro"),
    i = e("component/base"),
    n = e("component/checkbox"),
    o = i.extend(function() {
        var e = this.__config;
        this.listen("change", e.onchange),
        this.listen("check", e.oncheck),
        this.listen("uncheck", e.onuncheck),
        this.listen("disable",
        function() {
            this.each(function(e) {
                e.disable()
            })
        }),
        this.listen("resume",
        function() {
            this.each(function(e) {
                e.resume()
            })
        }),
        this.listen("create",
        function() {
            var e = this.constructor,
            i = this.__config,
            n = this;
            this.options && this.options.destroy(),
            this.options = new t.List(i.options),
            this.options.each(function(t, o) {
                var s = t.getAttrs();
                s.name || (s.name = "pro-radio" + n.id),
                s.index = o;
                var r = s.renderTo || n,
                a = new e.Item(s).join(n).render(r);
                a.listen("change",
                function() {
                    n.checked = this,
                    n.fire("change", this.getValue(), this.getIndex())
                }),
                a.listen("check",
                function() {
                    n.fire("check", this.getValue(), this.getIndex())
                }),
                a.listen("uncheck",
                function() {
                    n.fire("uncheck", this.getValue(), this.getIndex())
                }),
                s.checked && (i.checked = o)
            }),
            this.check(i.checked)
        })
    },
    {
        _baseClassName: "pro-radioGroup",
        _template: '<span class="pro-radioGroup"></span>',
        Item: n.extend({
            _baseClassName: "pro-radio",
            _template: '<label class="pro-radio">{{#right}}{{#text}}<span>{{{text}}}</span> {{/text}}{{/right}}<input type="radio"{{#name}} name="{{name}}"{{/name}}{{#value}} value="{{value}}"{{/value}}{{#checked}} checked{{/checked}}/>{{^right}} {{#text}}<span>{{{text}}}</span>{{/text}}{{/right}}</label>'
        },
        {
            getIndex: function() {
                return this.__config.index
            }
        })
    },
    {
        setValue: function(e) {
            this.each(function(t) {
                return t.model.get("value") === e ? (t.check(), !1) : void 0
            })
        },
        getValue: function() {
            return this.checked.getValue()
        },
        getChecked: function() {
            return this.checked.getIndex()
        },
        check: function(e) {
            var t = this.getChild(e);
            t && t.check()
        },
        uncheck: function() {
            this.each(function(e) {
                e.uncheck()
            }),
            this.fire("uncheck")
        },
        disable: function(e) {
            if (void 0 === e) o.__super.prototype.disable.call(this);
            else {
                var t = this.getChild(e);
                t.disable()
            }
        },
        resume: function(e) {
            if (void 0 === e) o.__super.prototype.resume.call(this);
            else {
                var t = this.getChild(e);
                t.resume()
            }
        }
    });
    return o
}),
define("ui/RadioBar", ["require", "$", "pro", "component/radio", "ui/CheckBar"],
function(e) {
    var t = (e("$"), e("pro"), e("component/radio")),
    i = e("ui/CheckBar");
    return t.extend(function() {
        var e = this.__config;
        e.label && this.model.set("text", e.label)
    },
    {
        Item: i.extend({
            _baseClassName: "w-radioBar",
            _template: ['<div class="w-radioBar w-bar"><b class="w-radio"></b>{{{text}}}<div class="w-bar-ext"><input{{#name}} name="{{name}}"{{/name}} value="{{value}}" type="radio"/></div></div>'].join(""),
            _events_extend: {
                "@": function() {
                    this.getChecked() || this.check()
                }
            },
            _listeners: {
                check: function() {
                    var e = this,
                    t = this.getParent();
                    t && t.each(function(t) {
                        t !== e && t.uncheck()
                    })
                }
            }
        })
    })
}),
define("ui/SelectBar", ["require", "$", "pro", "ui/Bar"],
function(e) {
    var t = (e("$"), e("pro"), e("ui/Bar"));
    return t.extend(function() {
        var e = this.__config;
        this.listen("change", e.onchange)
    },
    {
        _baseClassName: "w-selectBar",
        _template: ['<div class="w-selectBar w-bar">', "{{#label}}", '<div class="w-bar-label">{{{label}}}</div>', "{{/label}}", '<div class="w-bar-control"><select class="w-bar-input" name="{{name}}">', "{{#items}}", '<option value="{{value}}">{{text}}</option>', "{{/items}}", "</select></div>", "</div>"].join(""),
        _doms: {
            select: "select"
        },
        _events: {
            "select/change": function(e) {
                this.fire("change", e.value)
            }
        },
        _getData: function(e) {
            return {
                label: e.text || e.label,
                items: e.items || e.options
            }
        }
    },
    {
        getValue: function() {
            return this.doms.select.value
        },
        getIndex: function() {
            return this.doms.select.selectedIndex
        },
        setIndex: function(e) {
            return this.doms.select.selectedIndex = e
        },
        setValue: function(e) {
            for (var t = this.model.get("items"), i = 0, n = t.length; n > i; i++) if (t[i].value === e) {
                this.setIndex(i);
                break
            }
        }
    })
}),
define("ui/Loading", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        this.__config
    },
    {
        _template: ['<div class="w-loading">', '<div ><b class="ico ico-loading"></b> {{{loadingText}}}</div>', "</div>"].join(""),
        _getData: function(e) {
            return {
                loadingText: e.loadingText || "努力加载中"
            }
        }
    })
}),
define("ui/More", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        var e = this.__config;
        this.listen("click", e.onclick)
    },
    {
        _template: ['<div class="w-more">', '<div data-pro="link"><a href="javascript:void(0);">{{{text}}}</a></div>', '<div data-pro="loading" style="display:none"><b class="ico ico-loading"></b> {{{loadingText}}}</div>', '<div data-pro="disable" style="display:none">{{{disableText}}}</div>', "</div>"].join(""),
        _doms: {
            link: "@link",
            loading: "@loading",
            disable: "@disable"
        },
        _getData: function(e) {
            return {
                text: e.text || "上拉加载更多",
                loadingText: e.loadingText || "努力加载中",
                disableText: e.disableText || "已经没有更多"
            }
        },
        _events: {
            "@link": function() {
                this.loading(),
                this.fire("click")
            }
        }
    },
    {
        loading: function() {
            var e = this.doms;
            e.link.style.display = "none",
            e.disable.style.display = "none",
            e.loading.style.display = ""
        },
        reset: function() {
            var e = this.doms;
            e.link.style.display = "",
            e.disable.style.display = "none",
            e.loading.style.display = "none"
        },
        disable: function() {
            var e = this.doms;
            e.disable.style.display = "",
            e.link.style.display = "none",
            e.loading.style.display = "none"
        }
    })
}),
define("ui/Nav", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        var e = this.__config;
        this.listen("change", e.onchange)
    },
    {
        _baseClassName: "w-nav",
        _template: '<div class="w-nav"></div>',
        Item: t.extend(function() {
            var e = this.__config;
            this.listen("select", e.onselect),
            this.listenOnce("select", e.onselectonce)
        },
        {
            _baseClassName: "w-nav-item",
            _template: '<div class="w-nav-item"><span class="w-nav-txt">{{text}}</span></div>',
            _events: {
                "@": "click"
            },
            _getData: function(e) {
                return {
                    text: e.text
                }
            }
        },
        {
            select: function() {
                this.addClass(this.getClassName("on")),
                this.fire("select")
            },
            unselect: function() {
                this.removeClass(this.getClassName("on")),
                this.fire("unselect")
            }
        })
    },
    {
        oncreate: function() {
            var e = this.Class,
            t = this.__config,
            i = 0;
            t.hasSplt && this.addClass(this.getClassName("hasSplt")),
            t.hasBorder && this.addClass(this.getClassName("hasBorder"));
            for (var n = this.findAll("@item"), o = 0, s = n.length; s > o; o++) {
                var r = n[o];
                e.Item.by(r).join(this)
            }
            if (t.items && t.items.length > 0) for (var o = 0,
            s = t.items.length; s > o; o++) {
                var a = t.items[o],
                c = new e.Item(a).join(this).render(this);
                a.selected && (i = c)
            }
            this.listen("@child:click",
            function(e) {
                this.switchTo(e)
            }),
            this.switchTo(i)
        },
        switchTo: function(e) {
            "number" == typeof e && (e = this.getChild(e));
            var t = this.cur && this.cur !== e;
            this.cur && this.cur.unselect(),
            this.cur = e,
            this.cur.select(),
            t && this.fire("change", this.cur),
            this.listen("switch", this.cur)
        }
    })
}),
define("component/numberinput", ["require", "pro", "component/base"],
function(e) {
    var t = e("pro"),
    i = e("component/base");
    return i.extend(function() {
        var e = this.__config;
        this.step = e.step || 1,
        this.forceStep = !!e.forceStep,
        this.listen("disable",
        function() {
            this.doms.input.setAttribute("disabled", "true")
        }),
        this.listen("resume",
        function() {
            this.doms.input.removeAttribute("disabled")
        }),
        this.listen(this.model, "change:value",
        function(e) {
            this.fire("change", e)
        }),
        this.listen("change", e.onchange)
    },
    {
        _template: '<div class="pro-number"><a class="pro-number-btn pro-number-btn-minus" data-pro="minus" href="javascript:void(0);">－</a><input class="pro-number-input" data-pro="input" type="text" value="{{value}}" /><a class="pro-number-btn pro-number-btn-plus" data-pro="plus" href="javascript:void(0);">＋</a></div>',
        _doms: {
            input: "@input"
        },
        _css: {
            all: ".pro-number,.pro-number-btn{display:inline-block}.pro-number{position:relative}.pro-number-input{font-size:100%;text-align:center;width:3em;height:2em;line-height:2em;border:solid #e0e0e0;border-width:1px 0;padding:0 .6em;vertical-align:middle;+zoom:1;outline:none}.pro-number-btn{text-align:center;width:2.5em;height:2em;line-height:2em;border:1px solid #e0e0e0;vertical-align:middle;background-color:#f5f5f5;box-sizing:content-box;outline:none;text-decoration:none;white-space:nowrap;cursor:pointer}.pro-number-btn:focus,.pro-number-btn:hover{position:relative;background-color:#fafafa;border-color:#ccc}.pro-number-btn:active{position:relative;background-color:#f0f0f0;border-color:#ccc}.pro-number-disabled .pro-number-input{background-color:#f0f0f0;color:#999}.pro-number-disabled .pro-number-btn{background:#e0e0e0!important;border-color:#ccc!important;color:#aaa!important;cursor:default!important}",
            iel: ".pro-number,.pro-number-btn{display:inline;zoom:1}"
        },
        _baseClassName: "pro-number",
        _getData: function(e) {
            return {
                min: "min" in e ? e.min: -(1 / 0),
                max: "max" in e ? e.max: 1 / 0,
                value: e.value || 0,
                width: e.width
            }
        },
        _events: {
            "@plus/mousedown": function() {
                this.fire("plusclick"),
                this.__timer = t.delay(function() {
                    this.__timer = setInterval(t.bind(function() {
                        this.fire("plusclick")
                    },
                    this), 100)
                },
                this, 400)
            },
            "@minus/mousedown": function() {
                this.fire("minusclick"),
                this.__timer = t.delay(function() {
                    this.__timer = setInterval(t.bind(function() {
                        this.fire("minusclick")
                    },
                    this), 100)
                },
                this, 400)
            },
            "@plus/mouseup": function() {
                clearTimeout(this.__timer)
            },
            "@minus/mouseup": function() {
                clearTimeout(this.__timer)
            },
            "@plus/mouseout": function() {
                clearTimeout(this.__timer)
            },
            "@minus/mouseout": function() {
                clearTimeout(this.__timer)
            },
            "@input/change": function(e) {
                this.setValue(e.value)
            }
        },
        _listeners: {
            plusclick: function() {
                this.plus()
            },
            minusclick: function() {
                this.minus()
            }
        }
    },
    {
        setValue: function(e, t) {
            e -= 0;
            var i = this.step;
            i > 1 && e % i != 0 && (e = (Math.floor(e / i) + 1) * i, this.fire("forcestep"));
            var n = this.model.get("max"),
            o = this.model.get("min");
            return "number" == typeof e && !isNaN(e) && isFinite(e) ? (e > n ? e = n: o > e && (e = o), this.doms.input.value = e, this.model.set("value", e), e) : isNaN(e) || !isFinite(e) ? (this.doms.input.value = this.model.get("value"), this.getValue()) : void 0
        },
        getValue: function() {
            return this.doms.input.value - 0
        },
        plus: function() {
            var e = this.getValue();
            this.setValue(e + this.step),
            this.fire("plus", e)
        },
        minus: function() {
            var e = this.getValue();
            this.setValue(e - this.step),
            this.fire("minus", e)
        }
    })
}),
define("ui/NumberInput", ["require", "$", "pro", "component/numberinput"],
function(e) {
    var t = (e("$"), e("pro"), e("component/numberinput"));
    return t.extend({
        _css: "",
        _baseClassName: "w-number",
        _template: ['<div class="w-number">', '<input class="w-number-input" data-pro="input" value="{{value}}" pattern="[0-9]*"/>', '<a class="w-number-btn w-number-btn-plus" data-pro="plus" href="javascript:void(0);">+</a>', '<a class="w-number-btn w-number-btn-minus" data-pro="minus" href="javascript:void(0);">-</a>', "</div>"].join("")
    })
}),
define("ui/Option", ["require", "$", "pro", "component/base", "ui/CheckBar", "ui/RadioBar"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base")),
    i = e("ui/CheckBar"),
    n = e("ui/RadioBar");
    return t.extend(function() {
        var e = this.__config;
        this.listen("change", e.onchange),
        this.listen("check", e.oncheck),
        this.listen("uncheck", e.onuncheck),
        this.listen("fold", e.onfold),
        this.listen("unfold", e.onunfold),
        this.listen("grouptitleclick",
        function() {
            this.__config.foldable && (this.__itemsHidden ? this.unfold() : this.fold())
        }),
        this.listen("disable",
        function() {
            this.each(function(e) {
                e.dom && e.disable()
            })
        }),
        this.listen("resume",
        function() {
            this.each(function(e) {
                e.dom && e.resume()
            })
        }),
        this.__itemsHidden = !0
    },
    {
        _baseClassName: "w-option",
        _getData: function(e) {
            return {
                text: e.text,
                value: e.value,
                name: e.name,
                foldable: e.foldable,
                isGroup: !!e.items
            }
        },
        _template: ['<div class="w-option">', '{{#isGroup}}{{#text}}<div class="w-bar" data-pro="groupTitle">{{{text}}}{{#foldable}} <span class="w-bar-ext"><b class="ico ico-fold"></b></span>{{/foldable}}</div>{{/text}}', '<div style="display:none" class="w-bar-content" data-pro="groupItems"></div>{{/isGroup}}', "</div>"].join(""),
        _entry: "@groupItems",
        _events: {
            "@groupTitle": "grouptitleclick"
        },
        _doms: {
            title: "@groupTitle",
            items: "@groupItems"
        }
    },
    {
        oncreate: function() {
            var e, t = this.__config,
            o = t.name || "w-option-" + this.id;
            t.items ? (e = new n({
                name: o,
                options: t.items
            }), e.type = "radio") : (e = new i({
                text: t.text,
                name: o,
                value: t.value
            }), e.type = "check"),
            this.__check = e,
            this.listen(e, "change",
            function(t, i) {
                "check" == e.type ? this.fire("change", t) : this.fire("change", t, i)
            }),
            this.listen(e, "check",
            function(e, t) {
                this.fire("check", e, t)
            }),
            this.listen(e, "uncheck",
            function(e, t) {
                this.fire("uncheck", e, t)
            }),
            e.join(this),
            t.items ? t.foldable || this.unfold() : e.render(this)
        },
        getValue: function() {
            return this.__check.getValue()
        },
        getChecked: function() {
            return this.__check.getChecked()
        },
        check: function(e) {
            return this.__check.check(e)
        },
        uncheck: function() {
            return this.__check.uncheck()
        },
        fold: function() {
            this.removeClass("w-option-unfold"),
            this.doms.items.style.display = "none",
            this.fire("fold"),
            this.__itemsHidden = !0
        },
        unfold: function() {
            this.addClass("w-option-unfold"),
            this.doms.items.style.display = "",
            this.__check.isRendered() || this.__check.render(this),
            this.fire("unfold"),
            this.__itemsHidden = !1
        }
    })
}),
define("ui/SimpleFooter", ["require", "pro", "component/base"],
function(e) {
    var t = (e("pro"), e("component/base"));
    return t.extend({
        _template: ['<div class="m-simpleFooter">', '<div data-pro="text" class="m-simpleFooter-text">{{{text}}}</div>', '<div data-pro="ext" class="m-simpleFooter-ext">{{{ext}}}</div>', "</div>"].join(""),
        _getData: function(e) {
            return {
                text: e.text,
                ext: e.ext
            }
        }
    })
}),
define("ui/SimpleHeader", ["require", "$", "pro", "component/base", "controller/BaseController"],
function(e) {
    function t(e) {
        this.context = e.context || this.getParent() || new n,
        this.listen("okclick", e.onokclick || e.onok),
        this.listen("cancelclick", e.oncancelclick || e.oncancel),
        this.listen("backclick", e.onbackclick || e.onback)
    }
    var i = (e("$"), e("pro"), e("component/base")),
    n = e("controller/BaseController");
    return i.extend(t, {
        _template: ['<div class="m-simpleHeader">', '{{#cancel}}<a href="javascript:void(0);" data-pro="cancel" class="m-simpleHeader-cancel">{{cancel}}</a>{{/cancel}}', '{{#ok}}<a href="javascript:void(0);" data-pro="ok" class="m-simpleHeader-ok">{{ok}}</a>{{/ok}}', '{{#back}}<a href="javascript:void(0);" data-pro="back" data-back="{{back}}" class="m-simpleHeader-back"><i class="ico ico-back"></i></a>{{/back}}', "<h1>{{{title}}}</h1>", "</div>"].join(""),
        _events: {
            "@cancel": "cancelclick",
            "@ok": "okclick",
            "@back": function(e) {
                if (this.fire("backclick") !== !1) {
                    var t = e.getAttribute("data-back");
                    this.context.go("true" == t ? "back": t, null, !0)
                }
            }
        },
        _getData: function(e) {
            return {
                title: e.title,
                back: e.back,
                ok: e.ok,
                cancel: e.cancel
            }
        }
    })
}),
define("ui/Tips", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        var e = this.__config,
        t = this.Class,
        i = t.current;
        i && (i.destroy(), t.current = null),
        t.current = this;
        var n = e.time;
        this.timer = setTimeout(function() {
            t.finish()
        },
        n || 2e3)
    },
    {
        current: null,
        entry: document.body,
        _template: '<div class="w-tips"><div class="w-tips-inner">{{{text}}}</div></div>',
        _getData: function(e) {
            return {
                text: e.text
            }
        },
        _listeners: {
            destroy: function() {
                var e = this,
                t = e.timer;
                t && clearTimeout(e.timer)
            },
            afterrender: function() {
                var e = this,
                t = this.__config,
                i = t.position || "bottom";
                e.addClass("w-tips-" + i),
                e.addClass("w-tips-show")
            }
        },
        finish: function() {
            var e = this,
            t = e.current;
            t && (t.destroy(), e.current = null)
        },
        show: function(e) {
            var t = this;
            new t(e).render(t.entry)
        }
    })
}),
define("ui/IntervalScroll", ["require", "$", "pro", "component/base", "$.css3animate"],
function(e) {
    var t = e("$"),
    i = (e("pro"), e("component/base"));
    e("$.css3animate");
    var n = i.extend(function(e) {
        e = e || {},
        n.current = this,
        n.current.interval = null
    },
    {
        _getData: function(e) {
            return {
                isFresh: void 0 === e.isFresh ? !1 : e.isFresh,
                classname: e.classname || "",
                items: e.items || [],
                line: e.line || 1,
                perLine: e.perLine || 1,
                minLine: e.minLine || 5,
                speed: e.speed || 500,
                gap: e.gap || 5e3,
                defaultTxt: e.defaultTxt || "暂无内容"
            }
        },
        _template: '<ul class="w-intervalScroll {{classname}}">						{{#items}}						<li data-pro="item" class="w-intervalScroll-item">{{&content}}</li>						{{/items}}						{{^items}}{{&defaultTxt}}{{/items}}					</ul>',
        _doms: {
            item: "@item"
        },
        _listeners: {
            afterrender: function() {
                var e = (this.__config, this.dom),
                i = (t(e), t(this.find("@item")));
                if (i.length) {
                    this.lis = this.findAll("li"),
                    this.model.set("listLength", this.findAll("li").length);
                    var n = i.css("padding-top").match(/\d/)[0] - 0,
                    o = i.css("padding-bottom").match(/\d/)[0] - 0;
                    this.model.set("lineHeight", i.height() + n + o)
                }
            }
        }
    },
    {
        scrollUp: function(e) {
            function i() {
                l += c * r,
                o.css3Animate({
                    y: (0 - n.model.get("lineHeight") * r) * l + "px",
                    time: n.model.get("speed"),
                    success: function() {
                        n.model.get("isFresh") || l == s * nTimes - c && (o.append(sHtml), nTimes++),
                        o.find(".w-intervalScroll-item").length / (c * r) < a + 1 && n.fire("runout")
                    }
                })
            }
            var n = e || this,
            o = t(n.dom),
            s = n.model.get("listLength"),
            r = n.model.get("line"),
            a = n.model.get("minLine"),
            c = n.model.get("perLine"),
            l = 0;
            nTimes = 1,
            sHtml = o.html(),
            void 0 === s || a >= s || (n.interval = setInterval(i, n.model.get("gap")))
        },
        scrollDown: function(e) {},
        start: function(e, t) {
            var i = t || this;
            clearInterval(i.interval),
            e(t)
        },
        stop: function(e) {
            var t = e || this;
            clearInterval(t.interval)
        }
    });
    return n
}),
define("ui/SlideShow", ["require", "$", "pro", "component/base", "$.css3animate", "$.touch"],
function(e) {
    var t = e("$"),
    i = (e("pro"), e("component/base"));
    e("$.css3animate"),
    e("$.touch");
    var n = i.extend(function(e) {
        e = e || {},
        n.current = this,
        n.current.frame = 0,
        n.current.interval = null
    },
    {
        _getData: function(e) {
            return {
                classname: e.classname || "",
                items: e.items || [],
                autoPlay: void 0 === e.autoPlay ? !0 : e.autoPlay,
                width: e.width || 0,
                hasBtn: void 0 === e.hasBtn ? !0 : e.hasBtn,
                hasNav: void 0 === e.hasNav ? !0 : e.hasNav,
                perGroup: e.perGroup || 1,
                speed: e.speed || 500,
                gap: e.gap || 5e3
            }
        },
        _template: '<div class="w-slide {{classname}}"						<div class="w-slide-wrap">							<ul class="w-slide-wrap-list" data-pro="list">								{{#items}}								<li data-pro="item" class="w-slide-wrap-list-item">{{&content}}</li>								{{/items}}							</ul>						</div>						<div class="w-slide-controller">							{{#hasBtn}}							<div class="w-slide-controller-btn" data-pro="controllerBtn" style="display: none;">                                <a class="prev" data-pro="prev" href="javascript:void(0)"><i class="ico ico-arrow-large ico-arrow-large-l"></i></a>                                <a class="next" data-pro="next" href="javascript:void(0)"><i class="ico ico-arrow-large ico-arrow-large-r"></i></a>                            </div>                            {{/hasBtn}}                            {{#hasNav}}                            <div class="w-slide-controller-nav" data-pro="controllerNav"></div>                            {{/hasNav}}						</div>					</div>',
        _doms: {
            list: "@list",
            item: "@item",
            controllerBtn: "@controllerBtn",
            controllerNav: "@controllerNav"
        },
        _events: {
            "@next": function() {
                this.fire("nextclick"),
                this.fire("slideChange", !0)
            },
            "@prev": function() {
                this.fire("prevclick"),
                this.fire("slideChange", !0)
            },
            "@item": function() {
                this.fire("slideCLick", this.frame, this.itemsDom[this.frame])
            }
        },
        _listeners: {
            render: function() {
                var e = this,
                i = e.doms,
                n = t(e.dom);
                t(e.find("@item"));
                this.itemsDom = e.findAll("li"),
                e.init();
                var o = e.model.get("group");
                if (e.model.get("hasNav") && o > 1) {
                    for (var s = "",
                    r = 0,
                    a = Math.ceil(o); a > r; r++) s += '<span class="dot' + (0 == r ? " curr": "") + '"></span>';
                    i.controllerNav.innerHTML = s
                }
                n.bind("touchstart",
                function(t) {
                    e.interval && clearInterval(e.interval)
                }),
                n.bind("touchend",
                function(t) {
                    e.start()
                }),
                n.bind("swipeLeft",
                function(t) {
                    e.fire("nextclick", !0)
                }),
                n.bind("swipeRight",
                function(t) {
                    e.fire("prevclick", !0)
                })
            },
            nextclick: function(e) {
                if (this.frame < this.model.get("group") - 1) this.frame++;
                else {
                    if (e) return;
                    this.frame = 0
                }
                this.switchTo(),
                this.fire("slideChange", !0)
            },
            prevclick: function(e) {
                if (this.frame > 0) this.frame--;
                else {
                    if (e) return;
                    this.frame = this.model.get("group") - 1
                }
                this.switchTo(),
                this.fire("slideChange", !0)
            }
        }
    },
    {
        init: function(e) {
            var i = this,
            n = i.doms,
            o = t(i.find("@item")),
            s = i.findAll("li"),
            r = s.length,
            a = i.model.get("perGroup"),
            c = 1,
            l = 0;
            if (! (a >= r)) {
                if (i.interval && clearInterval(i.interval), e) i.model.set("width", e);
                else var e = i.model.get("width");
                i.model.set("listLength", r),
                i.model.set("group", r / a),
                c = i.model.get("group"),
                e && t(s).each(function() {
                    t(this).css("width", e)
                }),
                i.model.set("moveLen", o.width() * a),
                l = i.model.get("moveLen"),
                t(n.list).css("width", 100 * r + "%")
            }
        },
        start: function(e) {
            var t = e || this,
            i = t.model.get("autoPlay"),
            n = t.model.get("gap");
            return i && (t.interval && clearInterval(t.interval), t.interval = setInterval(function() {
                t.fire("nextclick"),
                t.fire("slideChange")
            },
            n)),
            t
        },
        switchTo: function(e) {
            var i = e || this,
            n = i.findAll("li");
            i.interval && clearInterval(i.interval);
            var o = t(i.doms.controllerNav).find(".dot");
            o.removeClass("curr"),
            o.eq(i.frame).addClass("curr"),
            t(n).removeClass("selected"),
            t(n).eq(i.frame).addClass("selected");
            var s = t(n).eq(i.frame).find("img"),
            r = s.attr("data-src");
            r && "" != r && (s.attr("src", r), s.attr("data-src", "")),
            t(i.doms.list).css3Animate({
                x: 0 - i.model.get("moveLen") * i.frame + "px",
                time: i.model.get("speed"),
                success: function() {
                    i.start()
                }
            })
        }
    });
    return n
}),
define("ui/WishesInput", ["require", "pro", "component/base", "ui/InputBar"],
function(e) {
    var t = e("pro"),
    i = e("component/base"),
    n = e("ui/InputBar"),
    o = i.extend(function(e) {
        switch (e.type = e.type || "user", e.type) {
        case "user":
            e.placeholder = "请认真填写邀请朋友凑单的话语，成不成就看你写得好不好了。懒得写？请从下面4个模板里挑选~",
            e.items = [{
                title: "江湖告急",
                content: "男侠女侠，鄙人钱包告急啊，不用你两肋插刀，只求帮忙付点钱凑个单，我想要这个礼物！拜托拜托~~"
            },
            {
                title: "甜蜜撒娇",
                content: "你说，你的钱包就是我的钱包，我也是这么想的，嘻嘻~别让我失望哦"
            },
            {
                title: "感情永恒",
                content: "提钱伤感情，那咱就谈感情吧，现在我想要这个礼物，你不会拒绝我的吧！"
            },
            {
                title: "威逼利诱",
                content: "谁说感情不能用金钱来衡量呢？！真是不能忍！你看着给吧！"
            }];
            break;
        default:
            var i = ["钱包告急还想要礼物啊，幸亏有我们这些好哥儿姐们！", "买买买！亲，我怎么舍得让你失望呢", "咱俩什么交情啊，一定会支持你的！", "爷赏你的，下次吃饭可不要忘了我！", "这钱我付了！大手一挥不用谢", "小小心意，祝你猴年万事如意", "新年大红包，我来给你发~", "你喜欢的，我都给你买买买", "说！我到底是不是你的真爱？", "凑钱我愿意，生猴子我不愿意", "猴年的大红包，快点收下吧", "能用钱解决的，咱就不废话了", "小手一抖，真爱就是我啊", "点赞的不如送钱的，你说是不是呢", "哈哈哈，你的真爱被我承包了"];
            e.value = i[parseInt(Math.random() * i.length)]
        }
        this.itemList = new t.List(e.items),
        this.listen("render",
        function(t) {
            var i = this,
            s = this.doms = {
                tab: this.find("@tab"),
                textarea: this.find("@textarea")
            };
            t.style.width = e.width ? e.width + "px": "auto",
            i.textarea = new n({
                width: e.width - 18,
                height: 95,
                maxlength: 50,
                value: e.value || "",
                textarea: !0,
                placeholder: e.placeholder
            }).render(s.textarea),
            this.itemList.getCount() && this.itemList.each(function(t, n) {
                var r, a = t.get();
                r = new o.Tab({
                    title: a.title,
                    content: a.content
                }).join(i).render(s.tab),
                r.listen("click",
                function() {
                    i.switchTo(this)
                }),
                r.listen("destroy",
                function() {
                    this.textarea.destroy(),
                    this.textarea = null,
                    delete this.textarea
                }),
                a.selected && (e.selected = n)
            }),
            this.switchTo(e.selected || null)
        })
    },
    {
        _html: '<div class="w-wishes">					<div class="w-wishes-tab" data-pro="tab"></div>					<div class="w-wishes-text" data-pro="textarea"></div>				</div>',
        Tab: i.extend({
            _template: '<div class="w-wishes-tab-wrap"><a class="w-wishes-tab-item" href="javascript:void(0)">{{{title}}}</a></div>',
            _events: {
                "@": "click"
            },
            _getData: function(e) {
                return {
                    title: e.title,
                    content: e.content
                }
            }
        },
        {
            select: function() {
                this.addClass("selected"),
                this.fire("select")
            },
            unselect: function() {
                this.removeClass("selected"),
                this.fire("unselect")
            }
        })
    },
    {
        getTextarea: function() {
            return this.textarea
        },
        getTab: function(e) {
            return this.getChild(e)
        },
        switchTo: function(e) {
            this.each(function(t, i) {
                e === t || e === i ? (t.select(), this.fire("switch", i, t), this.textarea.setValue(e.model.get("content"))) : t.unselect()
            })
        },
        getValue: function() {
            return this.textarea.getValue()
        },
        setValue: function(e) {
            return this.textarea.setValue(e)
        },
        showTips: function(e) {
            this.textarea.showTips(e)
        }
    });
    return o
}),
define("ui/Toast", ["require", "$", "pro", "component/base"],
function(e) {
    var t = (e("$"), e("pro"), e("component/base"));
    return t.extend(function() {
        var e = this.Class,
        t = this.__config;
        e.current && e.current.destroy(),
        e.current = this,
        this.expires = t.expires || 3e3
    },
    {
        current: null,
        _template: '<div class="w-toast">{{{text}}}</div>',
        _getData: function(e) {
            return {
                text: e.text
            }
        },
        _listeners: {
            destroy: function() {
                clearTimeout(this.timer),
                this.Class.current = null
            },
            render: function() {
                var e = this;
                this.timer = setTimeout(function() {
                    e.destroy()
                },
                this.expires)
            }
        },
        show: function(e, t) {
            return new this({
                text: e,
                expires: t
            }).render(document.body)
        }
    })
}),
define("hd/common/Base", ["require", "pro"],
function(e) {
    function t(e) {
        this.tag = e.tag,
        this.context = e.context,
        this.rule = e.rule,
        this.siteName = e.siteName
    }
    function i(e) {
        return this.matchByTag(e) || this.matchById(e)
    }
    function n(e) {
        var t = new RegExp("(?:^|,)" + this.tag + "(?=,|$)");
        return t.test(e.get("tag"))
    }
    function o(e) {
        var t = new RegExp("(?:^|,)" + e.get("gid") + "(?=,|$)"),
        i = this.rule.relateDictid.join(",");
        return t.test(i)
    }
    function s(e, t) {
        var i = this,
        n = 0;
        return e && e.each(function(e) {
            if (i.match(e)) {
                var o = e.get("num"),
                s = t || e.get("checked"),
                r = t || 1 === e.get("status"),
                a = t || o <= e.get("remainTimes");
                s && r && a && (n += o)
            }
        }),
        n
    }
    var r = e("pro");
    return r.Base.extend(t, null, {
        tag: "",
        rule: null,
        context: null,
        siteName: "",
        getCount: s,
        match: i,
        matchByTag: n,
        matchById: o
    })
});