function smoothScroll() {
    var framerate = 150;
    var animtime = 800;
    var stepsize = 80;
    var pulseAlgorithm = true;
    var pulseScale = 8;
    var pulseNormalize = 1;
    var acceleration = true;
    var accelDelta = 10;
    var accelMax = 1;
    var keyboardsupport = true;
    var disableKeyboard = false;
    var arrowscroll = 50;
    var exclude = "";
    var disabled = false;
    var frame = false;
    var direction = {
        x: 0,
        y: 0
    };
    var initdone = false;
    var fixedback = true;
    var root = document.documentElement;
    var activeElement;
    var key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    };

    function init() {
        if (!document.body) return;
        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;
        root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
        activeElement = body;
        initdone = true;
        if (top != self) {
            frame = true;
        } else if (scrollHeight > windowHeight && (body.offsetHeight <= windowHeight || html.offsetHeight <= windowHeight)) {
            var pending = false;
            var refresh = function() {
                if (!pending && html.scrollHeight != document.height) {
                    pending = true;
                    setTimeout(function() {
                        html.style.height = document.height + 'px';
                        pending = false;
                    }, 500);
                }
            };
            html.style.height = '';
            setTimeout(refresh, 10);
            addEvent("DOMNodeInserted", refresh);
            addEvent("DOMNodeRemoved", refresh);
            if (root.offsetHeight <= windowHeight) {
                var underlay = document.createElement("div");
                underlay.style.clear = "both";
                body.appendChild(underlay);
            }
        }
        if (document.URL.indexOf("mail.google.com") > -1) {
            var s = document.createElement("style");
            s.innerHTML = ".iu { visibility: hidden }";
            (document.getElementsByTagName("head")[0] || html).appendChild(s);
        }
        if (!fixedback && !disabled) {
            body.style.backgroundAttachment = "scroll";
            html.style.backgroundAttachment = "scroll";
        }
    }
    var que = [];
    var pending = false;
    var lastScroll = +new Date;

    function scrollArray(elem, left, top, delay) {
        delay || (delay = 1000);
        directionCheck(left, top);
        if (acceleration) {
            var now = +new Date;
            var elapsed = now - lastScroll;
            if (elapsed < accelDelta) {
                var factor = (1 + (30 / elapsed)) / 2;
                if (factor > 1) {
                    factor = Math.min(factor, accelMax);
                    left *= factor;
                    top *= factor;
                }
            }
            lastScroll = +new Date;
        }
        que.push({
            x: left,
            y: top,
            lastX: (left < 0) ? 0.99 : -0.99,
            lastY: (top < 0) ? 0.99 : -0.99,
            start: +new Date
        });
        if (pending) {
            return;
        }
        var scrollWindow = (elem === document.body);
        var step = function() {
            var now = +new Date;
            var scrollX = 0;
            var scrollY = 0;
            for (var i = 0; i < que.length; i++) {
                var item = que[i];
                var elapsed = now - item.start;
                var finished = (elapsed >= animtime);
                var position = (finished) ? 1 : elapsed / animtime;
                if (pulseAlgorithm) {
                    position = pulse(position);
                }
                var x = (item.x * position - item.lastX) >> 0;
                var y = (item.y * position - item.lastY) >> 0;
                scrollX += x;
                scrollY += y;
                item.lastX += x;
                item.lastY += y;
                if (finished) {
                    que.splice(i, 1);
                    i--;
                }
            }
            if (scrollWindow) {
                window.scrollBy(scrollX, scrollY)
            } else {
                if (scrollX) elem.scrollLeft += scrollX;
                if (scrollY) elem.scrollTop += scrollY;
            }
            if (!left && !top) {
                que = [];
            }
            if (que.length) {
                requestFrame(step, elem, (delay / framerate + 1));
            } else {
                pending = false;
            }
        }
        requestFrame(step, elem, 0);
        pending = true;
    }

    function wheel(event) {
        if (!initdone) {
            init();
        }
        var target = event.target;
        var overflowing = overflowingAncestor(target);
        if (!overflowing || event.defaultPrevented || isNodeName(activeElement, "embed") || (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
            return true;
        }
        var deltaX = event.wheelDeltaX || 0;
        var deltaY = event.wheelDeltaY || 0;
        if (!deltaX && !deltaY) {
            deltaY = event.wheelDelta || 0;
        }
        if (Math.abs(deltaX) > 1.2) {
            deltaX *= stepsize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
            deltaY *= stepsize / 120;
        }
        scrollArray(overflowing, -deltaX, -deltaY);
        event.preventDefault();
    }

    function keydown(event) {
        var target = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey || (event.shiftKey && event.keyCode !== key.spacebar);
        if (/input|textarea|select|embed/i.test(target.nodeName) || target.isContentEditable || event.defaultPrevented || modifier) {
            return true;
        }
        if (isNodeName(target, "button") && event.keyCode === key.spacebar) {
            return true;
        }
        var shift, x = 0,
            y = 0;
        var elem = overflowingAncestor(activeElement);
        var clientHeight = elem.clientHeight;
        if (elem == document.body) {
            clientHeight = window.innerHeight;
        }
        switch (event.keyCode) {
            case key.up:
                y = -arrowscroll;
                break;
            case key.down:
                y = arrowscroll;
                break;
            case key.spacebar:
                shift = event.shiftKey ? 1 : -1;
                y = -shift * clientHeight * 0.9;
                break;
            case key.pageup:
                y = -clientHeight * 0.9;
                break;
            case key.pagedown:
                y = clientHeight * 0.9;
                break;
            case key.home:
                y = -elem.scrollTop;
                break;
            case key.end:
                var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
                y = (damt > 0) ? damt + 10 : 0;
                break;
            case key.left:
                x = -arrowscroll;
                break;
            case key.right:
                x = arrowscroll;
                break;
            default:
                return true;
        }
        scrollArray(elem, x, y);
        event.preventDefault();
    }

    function mousedown(event) {
        activeElement = event.target;
    }
    var cache = {};
    setInterval(function() {
        cache = {};
    }, 10 * 1000);
    var uniqueID = (function() {
        var i = 0;
        return function(el) {
            return el.uniqueID || (el.uniqueID = i++);
        };
    })();

    function setCache(elems, overflowing) {
        for (var i = elems.length; i--;) cache[uniqueID(elems[i])] = overflowing;
        return overflowing;
    }

    function overflowingAncestor(el) {
        var elems = [];
        var rootScrollHeight = root.scrollHeight;
        do {
            var cached = cache[uniqueID(el)];
            if (cached) {
                return setCache(elems, cached);
            }
            elems.push(el);
            if (rootScrollHeight === el.scrollHeight) {
                if (!frame || root.clientHeight + 10 < rootScrollHeight) {
                    return setCache(elems, document.body);
                }
            } else if (el.clientHeight + 10 < el.scrollHeight) {
                overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
                if (overflow === "scroll" || overflow === "auto") {
                    return setCache(elems, el);
                }
            }
        } while (el = el.parentNode);
    }

    function addEvent(type, fn, bubble) {
        window.addEventListener(type, fn, (bubble || false));
    }

    function removeEvent(type, fn, bubble) {
        window.removeEventListener(type, fn, (bubble || false));
    }

    function isNodeName(el, tag) {
        return (el.nodeName || "").toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
        x = (x > 0) ? 1 : -1;
        y = (y > 0) ? 1 : -1;
        if (direction.x !== x || direction.y !== y) {
            direction.x = x;
            direction.y = y;
            que = [];
            lastScroll = 0;
        }
    }
    var requestFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback, element, delay) {
            window.setTimeout(callback, delay || (1000 / 60));
        };
    })();

    function pulse_(x) {
        var val, start, expx;
        x = x * pulseScale;
        if (x < 1) {
            val = x - (1 - Math.exp(-x));
        } else {
            start = Math.exp(-1);
            x -= 1;
            expx = 1 - Math.exp(-x);
            val = start + (expx * (1 - start));
        }
        return val * pulseNormalize;
    }

    function pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;
        if (pulseNormalize == 1) {
            pulseNormalize /= pulse_(1);
        }
        return pulse_(x);
    }
    addEvent("mousedown", mousedown);
    addEvent("mousewheel", wheel);
    addEvent("load", init);
};
(function() {
    'use strict';

    function FastClick(layer, options) {
        var oldOnClick;
        options = options || {};
        this.trackingClick = false;
        this.trackingClickStart = 0;
        this.targetElement = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastTouchIdentifier = 0;
        this.touchBoundary = options.touchBoundary || 10;
        this.layer = layer;
        this.tapDelay = options.tapDelay || 200;
        this.tapTimeout = options.tapTimeout || 700;
        if (FastClick.notNeeded(layer)) {
            return;
        }

        function bind(method, context) {
            return function() {
                return method.apply(context, arguments);
            };
        }
        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }
        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };
            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }
        if (typeof layer.onclick === 'function') {
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;
    FastClick.prototype.needsClick = function(target) {
        switch (target.nodeName.toLowerCase()) {
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }
                break;
            case 'input':
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }
                break;
            case 'label':
            case 'iframe':
            case 'video':
                return true;
        }
        return (/\bneedsclick\b/).test(target.className);
    };
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }
        touch = event.changedTouches[0];
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };
    FastClick.prototype.determineEventType = function(targetElement) {
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }
        return 'click';
    };
    FastClick.prototype.focus = function(targetElement) {
        var length;
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;
        scrollParent = targetElement.fastClickScrollParent;
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }
                parentElement = parentElement.parentElement;
            } while (parentElement);
        }
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }
        return eventTarget;
    };
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;
        if (event.targetTouches.length > 1) {
            return true;
        }
        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];
        if (deviceIsIOS) {
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }
            if (!deviceIsIOS4) {
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }
                this.lastTouchIdentifier = touch.identifier;
                this.updateScrollParent(targetElement);
            }
        }
        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;
        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }
        return true;
    };
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0],
            boundary = this.touchBoundary;
        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }
        return false;
    };
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }
        return true;
    };
    FastClick.prototype.findControl = function(labelElement) {
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
        if (!this.trackingClick) {
            return true;
        }
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }
        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        this.cancelNextClick = false;
        this.lastClickTime = event.timeStamp;
        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }
        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }
                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }
            this.focus(targetElement);
            this.sendClick(targetElement, event);
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }
            return false;
        }
        if (deviceIsIOS && !deviceIsIOS4) {
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }
        return false;
    };
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };
    FastClick.prototype.onMouse = function(event) {
        if (!this.targetElement) {
            return true;
        }
        if (event.forwardedTouchEvent) {
            return true;
        }
        if (!event.cancelable) {
            return true;
        }
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {
                event.propagationStopped = true;
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
        return true;
    };
    FastClick.prototype.onClick = function(event) {
        var permitted;
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }
        permitted = this.onMouse(event);
        if (!permitted) {
            this.targetElement = null;
        }
        return permitted;
    };
    FastClick.prototype.destroy = function() {
        var layer = this.layer;
        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }
        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
        if (chromeVersion) {
            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');
                if (metaViewport) {
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            } else {
                return true;
            }
        }
        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');
                if (metaViewport) {
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
        if (firefoxVersion >= 27) {
            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }
        return false;
    };
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };
    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return FastClick;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = FastClick.attach;
        module.exports.FastClick = FastClick;
    } else {
        window.FastClick = FastClick;
    }
}());
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('7 p(a){a=a||{};5.8.1N.2h(2,32);2.L=a.1u||"";2.1D=a.1q||H;2.P=a.1H||0;2.E=a.1B||1f 5.8.1U(0,0);2.B=a.W||1f 5.8.2t(0,0);2.S=a.11||q;2.1n=a.1l||"28";2.1k=a.D||{};2.1G=a.1E||"34";2.M=a.19||"2W://2Q.5.2L/2I/2G/2F/1v.2z";3(a.19===""){2.M=""}2.1i=a.1r||1f 5.8.1U(1,1);2.Y=a.1s||H;2.1a=a.1p||H;2.1K=a.2k||"2g";2.17=a.1m||H;2.4=q;2.w=q;2.X=q;2.16=q;2.15=q;2.13=q;2.12=q;2.O=q}p.r=1f 5.8.1N();p.r.22=7(){6 a;6 d=2;6 c=7(e){e.1Z=U;3(e.18){e.18()}};6 b=7(e){e.2S=H;3(e.1Y){e.1Y()}3(!d.17){c(e)}};3(!2.4){2.4=1g.2K("2J");2.1d();3(t 2.L.1w==="u"){2.4.J=2.F()+2.L}v{2.4.J=2.F();2.4.1b(2.L)}2.2y()[2.1K].1b(2.4);2.1F();3(2.4.9.A){2.O=U}v{3(2.P!==0&&2.4.Z>2.P){2.4.9.A=2.P;2.4.9.2u="2s";2.O=U}v{a=2.24();2.4.9.A=(2.4.Z-a.14-a.T)+"R";2.O=H}}2.1t(2.1D);3(!2.17){2.X=5.8.s.I(2.4,"2n",c);2.16=5.8.s.I(2.4,"1L",c);2.15=5.8.s.I(2.4,"2m",c);2.1o=5.8.s.I(2.4,"2l",7(e){2.9.1J="2j"})}2.12=5.8.s.I(2.4,"2i",b);5.8.s.Q(2,"2f")}};p.r.F=7(){6 a="";3(2.M!==""){a="<2e";a+=" 2d=\'"+2.M+"\'";a+=" 2c=T";a+=" 9=\'";a+=" W: 2b;";a+=" 1J: 2a;";a+=" 29: "+2.1G+";";a+="\'>"}N a};p.r.1F=7(){6 a;3(2.M!==""){a=2.4.27;2.w=5.8.s.I(a,\'1L\',2.1I())}v{2.w=q}};p.r.1I=7(){6 a=2;N 7(e){e.1Z=U;3(e.18){e.18()}a.1v();5.8.s.Q(a,"26")}};p.r.1t=7(d){6 m;6 n;6 e=0,G=0;3(!d){m=2.25();3(m 39 5.8.38){3(!m.23().37(2.B)){m.36(2.B)}n=m.23();6 a=m.35();6 h=a.Z;6 f=a.21;6 k=2.E.A;6 l=2.E.1j;6 g=2.4.Z;6 b=2.4.21;6 i=2.1i.A;6 j=2.1i.1j;6 o=2.20().31(2.B);3(o.x<(-k+i)){e=o.x+k-i}v 3((o.x+g+k+i)>h){e=o.x+g+k+i-h}3(2.1a){3(o.y<(-l+j+b)){G=o.y+l-j-b}v 3((o.y+l+j)>f){G=o.y+l+j-f}}v{3(o.y<(-l+j)){G=o.y+l-j}v 3((o.y+b+l+j)>f){G=o.y+b+l+j-f}}3(!(e===0&&G===0)){6 c=m.30();m.2Z(e,G)}}}};p.r.1d=7(){6 i,D;3(2.4){2.4.2Y=2.1n;2.4.9.2X="";D=2.1k;2V(i 2U D){3(D.2R(i)){2.4.9[i]=D[i]}}3(t 2.4.9.1h!=="u"&&2.4.9.1h!==""){2.4.9.2P="2O(1h="+(2.4.9.1h*2N)+")"}2.4.9.W="2M";2.4.9.V=\'1y\';3(2.S!==q){2.4.9.11=2.S}}};p.r.24=7(){6 c;6 a={1e:0,1c:0,14:0,T:0};6 b=2.4;3(1g.1x&&1g.1x.1V){c=b.2H.1x.1V(b,"");3(c){a.1e=C(c.1T,10)||0;a.1c=C(c.1S,10)||0;a.14=C(c.1R,10)||0;a.T=C(c.1W,10)||0}}v 3(1g.2E.K){3(b.K){a.1e=C(b.K.1T,10)||0;a.1c=C(b.K.1S,10)||0;a.14=C(b.K.1R,10)||0;a.T=C(b.K.1W,10)||0}}N a};p.r.2D=7(){3(2.4){2.4.2C.2B(2.4);2.4=q}};p.r.1A=7(){2.22();6 a=2.20().2A(2.B);2.4.9.14=(a.x+2.E.A)+"R";3(2.1a){2.4.9.1c=-(a.y+2.E.1j)+"R"}v{2.4.9.1e=(a.y+2.E.1j)+"R"}3(2.Y){2.4.9.V=\'1y\'}v{2.4.9.V="1X"}};p.r.2T=7(a){3(t a.1l!=="u"){2.1n=a.1l;2.1d()}3(t a.D!=="u"){2.1k=a.D;2.1d()}3(t a.1u!=="u"){2.1Q(a.1u)}3(t a.1q!=="u"){2.1D=a.1q}3(t a.1H!=="u"){2.P=a.1H}3(t a.1B!=="u"){2.E=a.1B}3(t a.1p!=="u"){2.1a=a.1p}3(t a.W!=="u"){2.1z(a.W)}3(t a.11!=="u"){2.1P(a.11)}3(t a.1E!=="u"){2.1G=a.1E}3(t a.19!=="u"){2.M=a.19}3(t a.1r!=="u"){2.1i=a.1r}3(t a.1s!=="u"){2.Y=a.1s}3(t a.1m!=="u"){2.17=a.1m}3(2.4){2.1A()}};p.r.1Q=7(a){2.L=a;3(2.4){3(2.w){5.8.s.z(2.w);2.w=q}3(!2.O){2.4.9.A=""}3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}3(!2.O){2.4.9.A=2.4.Z+"R";3(t a.1w==="u"){2.4.J=2.F()+a}v{2.4.J=2.F();2.4.1b(a)}}2.1F()}5.8.s.Q(2,"2x")};p.r.1z=7(a){2.B=a;3(2.4){2.1A()}5.8.s.Q(2,"1O")};p.r.1P=7(a){2.S=a;3(2.4){2.4.9.11=a}5.8.s.Q(2,"2w")};p.r.2v=7(){N 2.L};p.r.1C=7(){N 2.B};p.r.33=7(){N 2.S};p.r.2r=7(){2.Y=H;3(2.4){2.4.9.V="1X"}};p.r.2q=7(){2.Y=U;3(2.4){2.4.9.V="1y"}};p.r.2p=7(c,b){6 a=2;3(b){2.B=b.1C();2.13=5.8.s.2o(b,"1O",7(){a.1z(2.1C())})}2.1M(c);3(2.4){2.1t()}};p.r.1v=7(){3(2.w){5.8.s.z(2.w);2.w=q}3(2.X){5.8.s.z(2.X);5.8.s.z(2.16);5.8.s.z(2.15);5.8.s.z(2.1o);2.X=q;2.16=q;2.15=q;2.1o=q}3(2.13){5.8.s.z(2.13);2.13=q}3(2.12){5.8.s.z(2.12);2.12=q}2.1M(q)};', 62, 196, '||this|if|div_|google|var|function|maps|style||||||||||||||||InfoBox|null|prototype|event|typeof|undefined|else|closeListener_|||removeListener|width|position_|parseInt|boxStyle|pixelOffset_|getCloseBoxImg_|yOffset|false|addDomListener|innerHTML|currentStyle|content_|closeBoxURL_|return|fixedWidthSet_|maxWidth_|trigger|px|zIndex_|right|true|visibility|position|eventListener1_|isHidden_|offsetWidth||zIndex|contextListener_|moveListener_|left|eventListener3_|eventListener2_|enableEventPropagation_|stopPropagation|closeBoxURL|alignBottom_|appendChild|bottom|setBoxStyle_|top|new|document|opacity|infoBoxClearance_|height|boxStyle_|boxClass|enableEventPropagation|boxClass_|eventListener4_|alignBottom|disableAutoPan|infoBoxClearance|isHidden|panBox_|content|close|nodeType|defaultView|hidden|setPosition|draw|pixelOffset|getPosition|disableAutoPan_|closeBoxMargin|addClickHandler_|closeBoxMargin_|maxWidth|getCloseClickHandler_|cursor|pane_|click|setMap|OverlayView|position_changed|setZIndex|setContent|borderLeftWidth|borderBottomWidth|borderTopWidth|Size|getComputedStyle|borderRightWidth|visible|preventDefault|cancelBubble|getProjection|offsetHeight|createInfoBoxDiv_|getBounds|getBoxWidths_|getMap|closeclick|firstChild|infoBox|margin|pointer|relative|align|src|img|domready|floatPane|apply|contextmenu|default|pane|mouseover|dblclick|mousedown|addListener|open|hide|show|auto|LatLng|overflow|getContent|zindex_changed|content_changed|getPanes|gif|fromLatLngToDivPixel|removeChild|parentNode|onRemove|documentElement|mapfiles|en_us|ownerDocument|intl|div|createElement|com|absolute|100|alpha|filter|www|hasOwnProperty|returnValue|setOptions|in|for|http|cssText|className|panBy|getCenter|fromLatLngToContainerPixel|arguments|getZIndex|2px|getDiv|setCenter|contains|Map|instanceof'.split('|'), 0, {})) ! function(a, b) {
    "use strict";

    function c(a) {
        this.callback = a, this.ticking = !1
    }

    function d(b) {
        return b && "undefined" != typeof a && (b === a || b.nodeType)
    }

    function e(a) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var b, c, f = a || {};
        for (c = 1; c < arguments.length; c++) {
            var g = arguments[c] || {};
            for (b in g) f[b] = "object" != typeof f[b] || d(f[b]) ? f[b] || g[b] : e(f[b], g[b])
        }
        return f
    }

    function f(a) {
        return a === Object(a) ? a : {
            down: a,
            up: a
        }
    }

    function g(a, b) {
        b = e(b, g.options), this.lastKnownScrollY = 0, this.elem = a, this.debouncer = new c(this.update.bind(this)), this.tolerance = f(b.tolerance), this.classes = b.classes, this.offset = b.offset, this.scroller = b.scroller, this.initialised = !1, this.onPin = b.onPin, this.onUnpin = b.onUnpin, this.onTop = b.onTop, this.onNotTop = b.onNotTop
    }
    var h = {
        bind: !! function() {}.bind,
        classList: "classList" in b.documentElement,
        rAF: !!(a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame)
    };
    a.requestAnimationFrame = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame, c.prototype = {
        constructor: c,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, g.prototype = {
        constructor: g,
        init: function() {
            return g.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this) : void 0
        },
        destroy: function() {
            var a = this.classes;
            this.initialised = !1, this.elem.classList.remove(a.unpinned, a.pinned, a.top, a.initial), this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var a = this.elem.classList,
                b = this.classes;
            (a.contains(b.pinned) || !a.contains(b.unpinned)) && (a.add(b.unpinned), a.remove(b.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var a = this.elem.classList,
                b = this.classes;
            a.contains(b.unpinned) && (a.remove(b.unpinned), a.add(b.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var a = this.elem.classList,
                b = this.classes;
            a.contains(b.top) || (a.add(b.top), a.remove(b.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var a = this.elem.classList,
                b = this.classes;
            a.contains(b.notTop) || (a.add(b.notTop), a.remove(b.top), this.onNotTop && this.onNotTop.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (b.documentElement || b.body.parentNode || b.body).scrollTop
        },
        getViewportHeight: function() {
            return a.innerHeight || b.documentElement.clientHeight || b.body.clientHeight
        },
        getDocumentHeight: function() {
            var a = b.body,
                c = b.documentElement;
            return Math.max(a.scrollHeight, c.scrollHeight, a.offsetHeight, c.offsetHeight, a.clientHeight, c.clientHeight)
        },
        getElementHeight: function(a) {
            return Math.max(a.scrollHeight, a.offsetHeight, a.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === a || this.scroller === b.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(a) {
            var b = 0 > a,
                c = a + this.getViewportHeight() > this.getScrollerHeight();
            return b || c
        },
        toleranceExceeded: function(a, b) {
            return Math.abs(a - this.lastKnownScrollY) >= this.tolerance[b]
        },
        shouldUnpin: function(a, b) {
            var c = a > this.lastKnownScrollY,
                d = a >= this.offset;
            return c && d && b
        },
        shouldPin: function(a, b) {
            var c = a < this.lastKnownScrollY,
                d = a <= this.offset;
            return c && b || d
        },
        update: function() {
            var a = this.getScrollY(),
                b = a > this.lastKnownScrollY ? "down" : "up",
                c = this.toleranceExceeded(a, b);
            this.isOutOfBounds(a) || (a <= this.offset ? this.top() : this.notTop(), this.shouldUnpin(a, c) ? this.unpin() : this.shouldPin(a, c) && this.pin(), this.lastKnownScrollY = a)
        }
    }, g.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: a,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            initial: "headroom"
        }
    }, g.cutsTheMustard = "undefined" != typeof h && h.rAF && h.bind && h.classList, a.Headroom = g
}(window, document);
var thb_easing = [0.75, 0, 0.175, 1];;
(function($, window, undefined) {
    'use strict';
    $.fn.foundationAccordion = function(options) {
        $('.accordion', this).each(function() {
            var that = $(this),
                active = (!(that.data('active-tab')) ? 1 : that.data('active-tab'));
            that.find('li').eq(active - 1).addClass('active');
            that.find('li').on('click.fndtn', function() {
                var p = $(this).parent(),
                    flyout = $(this).children('.content').first(),
                    active = p.data('active');
                $('.content', p).not(flyout).slideUp(400, $.bez(thb_easing), function() {
                    $(this).parent('li').removeClass('active');
                });
                flyout.slideDown({
                    duration: '400',
                    easing: $.bez(thb_easing)
                }).parent('li').addClass('active');
            });
        });
    };
})(jQuery, this);;
(function($, window, undefined) {
    'use strict';
    $.fn.foundationAlerts = function(options) {
        var settings = $.extend({
            callback: $.noop
        }, options);
        $(document).on("click", ".notification-box a.close", function(e) {
            e.preventDefault();
            $(this).closest(".notification-box").fadeOut(function() {
                $(this).remove();
                settings.callback();
            });
        });
    };
})(jQuery, this);;
(function($, window, undefined) {
    'use strict';
    $.fn.foundationTabs = function(options) {
        var settings = $.extend({
            callback: $.noop
        }, options);
        var activateTab = function($tab) {
            var $activeTab = $tab.closest('dl').find('dd.active'),
                target = $tab.children('a').attr("href"),
                hasHash = /^#/.test(target),
                contentLocation = '';
            if (hasHash) {
                contentLocation = target + 'Tab';
                contentLocation = contentLocation.replace(/^.+#/, '#');
                $(contentLocation).closest('.tabs-content').children('li').removeClass('active').hide();
                $(contentLocation).css('display', 'block').addClass('active');
            }
            $activeTab.removeClass('active');
            $tab.addClass('active');
        };
        $(document).on('click.fndtn', 'dl.tabs dd a', function(event) {
            activateTab($(this).parent('dd'));
        });
        $(document).find('dl.tabs').each(function() {
            activateTab($(this).find('dd:eq(0)'));
        });
    };
})(jQuery, this);
jQuery(document).ready(function($) {
    $.fn.foundationAlerts ? $(document).foundationAlerts() : null;
    $.fn.foundationAccordion ? $(document).foundationAccordion() : null;
    $.fn.foundationTabs ? $(document).foundationTabs() : null;
});
(function($) {
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {
                threshold: 0
            });
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {
                threshold: 0
            });
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {
                threshold: 0
            });
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {
                threshold: 0
            });
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {
                threshold: 0
            });
        }
    });
})(jQuery);
require = function a(b, c, d) {
    function e(g, h) {
        if (!c[g]) {
            if (!b[g]) {
                var i = "function" == typeof require && require;
                if (!h && i) return i(g, !0);
                if (f) return f(g, !0);
                var j = new Error("Cannot find module '" + g + "'");
                throw j.code = "MODULE_NOT_FOUND", j
            }
            var k = c[g] = {
                exports: {}
            };
            b[g][0].call(k.exports, function(a) {
                var c = b[g][1][a];
                return e(c ? c : a)
            }, k, k.exports, a, b, c, d)
        }
        return c[g].exports
    }
    for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
    return e
}({
    1: [function(a, b) {
        function c() {
            return void 0 === window.pageYOffset ? (document.documentElement || document.body.parentNode || document.body).scrollTop : window.pageYOffset
        }
        b.exports = function(a, b) {
            var d = c(),
                e = document.documentElement.clientHeight,
                f = d + e;
            b = b || 0;
            var g = a.getBoundingClientRect(),
                h = g.top + d - b,
                i = g.bottom + d + b;
            return i > d && f > h
        }
    }, {}],
    2: [function(a) {
        (function(b) {
            var c = a("jquery"),
                d = a("./near-viewport.js");
            c.expr[":"]["near-viewport"] = function(a, c, e) {
                var f = b.parseInt(e[3]) || 0;
                return d(a, f)
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "./near-viewport.js": 1,
        jquery: "jquery"
    }],
    jquery: [function(a, b) {
        (function(a) {
            b.exports = a.jQuery
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}]
}, {}, [2]);
(function(c, q) {
    var m = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    c.fn.imagesLoaded = function(f) {
        function n() {
            var b = c(j),
                a = c(h);
            d && (h.length ? d.reject(e, b, a) : d.resolve(e));
            c.isFunction(f) && f.call(g, e, b, a)
        }

        function p(b) {
            k(b.target, "error" === b.type)
        }

        function k(b, a) {
            b.src === m || -1 !== c.inArray(b, l) || (l.push(b), a ? h.push(b) : j.push(b), c.data(b, "imagesLoaded", {
                isBroken: a,
                src: b.src
            }), r && d.notifyWith(c(b), [a, e, c(j), c(h)]), e.length === l.length && (setTimeout(n), e.unbind(".imagesLoaded", p)))
        }
        var g = this,
            d = c.isFunction(c.Deferred) ? c.Deferred() : 0,
            r = c.isFunction(d.notify),
            e = g.find("img").add(g.filter("img")),
            l = [],
            j = [],
            h = [];
        c.isPlainObject(f) && c.each(f, function(b, a) {
            if ("callback" === b) f = a;
            else if (d) d[b](a)
        });
        e.length ? e.bind("load.imagesLoaded error.imagesLoaded", p).each(function(b, a) {
            var d = a.src,
                e = c.data(a, "imagesLoaded");
            if (e && e.src === d) k(a, e.isBroken);
            else if (a.complete && a.naturalWidth !== q) k(a, 0 === a.naturalWidth || 0 === a.naturalHeight);
            else if (a.readyState || a.complete) a.src = m, a.src = d
        }) : n();
        return d ? d.promise(g) : g
    }
})(jQuery);
! function(a) {
    var b = "waitForImages";
    a.waitForImages = {
        hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"]
    }, a.expr[":"].uncached = function(b) {
        if (!a(b).is('img[src][src!=""]')) return !1;
        var c = new Image;
        return c.src = b.src, !c.complete
    }, a.fn.waitForImages = function(c, d, e) {
        var f = 0,
            g = 0;
        if (a.isPlainObject(arguments[0]) && (e = arguments[0].waitForAll, d = arguments[0].each, c = arguments[0].finished), c = c || a.noop, d = d || a.noop, e = !!e, !a.isFunction(c) || !a.isFunction(d)) throw new TypeError("An invalid callback was supplied.");
        return this.each(function() {
            var h = a(this),
                i = [],
                j = a.waitForImages.hasImageProperties || [],
                k = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
            e ? h.find("*").addBack().each(function() {
                var b = a(this);
                b.is("img:uncached") && i.push({
                    src: b.attr("src"),
                    element: b[0]
                }), a.each(j, function(a, c) {
                    var d, e = b.css(c);
                    if (!e) return !0;
                    for (; d = k.exec(e);) i.push({
                        src: d[2],
                        element: b[0]
                    })
                })
            }) : h.find("img:uncached").each(function() {
                i.push({
                    src: this.src,
                    element: this
                })
            }), f = i.length, g = 0, 0 === f && c.call(h[0]), a.each(i, function(e, i) {
                var j = new Image,
                    k = "load." + b + " error." + b;
                a(j).on(k, function l(b) {
                    return g++, d.call(i.element, g, f, "load" == b.type), a(this).off(k, l), g == f ? (c.call(h[0]), !1) : void 0
                }), j.src = i.src
            })
        })
    }
}(jQuery);
jQuery.extend({
    bez: function(coOrdArray) {
        var encodedFuncName = "bez_" + jQuery.makeArray(arguments).join("_").replace(/\./g, "p");
        if (typeof jQuery.easing[encodedFuncName] !== "function") {
            var polyBez = function(p1, p2) {
                var A = [null, null],
                    B = [null, null],
                    C = [null, null],
                    bezCoOrd = function(t, ax) {
                        C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                        return t * (C[ax] + t * (B[ax] + t * A[ax]));
                    },
                    xDeriv = function(t) {
                        return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                    },
                    xForT = function(t) {
                        var x = t,
                            i = 0,
                            z;
                        while (++i < 14) {
                            z = bezCoOrd(x, 0) - t;
                            if (Math.abs(z) < 1e-3) break;
                            x -= z / xDeriv(x);
                        }
                        return x;
                    };
                return function(t) {
                    return bezCoOrd(xForT(t), 1);
                }
            };
            jQuery.easing[encodedFuncName] = function(x, t, b, c, d) {
                return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b;
            }
        }
        return encodedFuncName;
    }
});
(function(b) {
    b.fn.matchHeight = function(a) {
        if ("remove" === a) {
            var d = this;
            this.css("height", "");
            b.each(b.fn.matchHeight._groups, function(b, a) {
                a.elements = a.elements.not(d)
            });
            return this
        }
        if (1 >= this.length) return this;
        a = "undefined" !== typeof a ? a : !0;
        b.fn.matchHeight._groups.push({
            elements: this,
            byRow: a
        });
        b.fn.matchHeight._apply(this, a);
        return this
    };
    b.fn.matchHeight._apply = function(a, d) {
        var c = b(a),
            e = [c];
        d && (c.css({
            display: "block",
            "padding-top": "0",
            "padding-bottom": "0",
            "border-top": "0",
            "border-bottom": "0",
            height: "100px"
        }), e = k(c), c.css({
            display: "",
            "padding-top": "",
            "padding-bottom": "",
            "border-top": "",
            "border-bottom": "",
            height: ""
        }));
        b.each(e, function(a, c) {
            var d = b(c),
                e = 0;
            d.each(function() {
                var a = b(this);
                a.css({
                    display: "block",
                    height: ""
                });
                a.outerHeight(!1) > e && (e = a.outerHeight(!1));
                a.css({
                    display: ""
                })
            });
            d.each(function() {
                var a = b(this),
                    c = 0;
                "border-box" !== a.css("box-sizing") && (c += g(a.css("border-top-width")) + g(a.css("border-bottom-width")), c += g(a.css("padding-top")) + g(a.css("padding-bottom")));
                a.css("height", e - c)
            })
        });
        return this
    };
    b.fn.matchHeight._applyDataApi = function() {
        var a = {};
        b("[data-match-height], [data-mh]").each(function() {
            var d = b(this),
                c = d.attr("data-match-height");
            a[c] = c in a ? a[c].add(d) : d
        });
        b.each(a, function() {
            this.matchHeight(!0)
        })
    };
    b.fn.matchHeight._groups = [];
    b.fn.matchHeight._throttle = 80;
    var h = -1,
        f = -1;
    b.fn.matchHeight._update = function(a) {
        if (a && "resize" === a.type) {
            a = b(window).width();
            if (a === h) return;
            h = a
        } - 1 === f && (f = setTimeout(function() {
            b.each(b.fn.matchHeight._groups, function() {
                b.fn.matchHeight._apply(this.elements, this.byRow)
            });
            f = -1
        }, b.fn.matchHeight._throttle))
    };
    b(b.fn.matchHeight._applyDataApi);
    b(window).bind("load resize orientationchange", b.fn.matchHeight._update);
    var k = function(a) {
            var d = null,
                c = [];
            b(a).each(function() {
                var a = b(this),
                    f = a.offset().top - g(a.css("margin-top")),
                    h = 0 < c.length ? c[c.length - 1] : null;
                null === h ? c.push(a) : 1 >= Math.floor(Math.abs(d - f)) ? c[c.length - 1] = h.add(a) : c.push(a);
                d = f
            });
            return c
        },
        g = function(a) {
            return parseFloat(a) || 0
        }
})(jQuery);;
(function($, window, document, undefined) {
    $.fn.wc_variation_form = function() {
        $.fn.wc_variation_form.find_matching_variations = function(product_variations, settings) {
            var matching = [];
            for (var i = 0; i < product_variations.length; i++) {
                var variation = product_variations[i];
                var variation_id = variation.variation_id;
                if ($.fn.wc_variation_form.variations_match(variation.attributes, settings)) {
                    matching.push(variation);
                }
            }
            return matching;
        };
        $.fn.wc_variation_form.variations_match = function(attrs1, attrs2) {
            var match = true;
            for (var attr_name in attrs1) {
                if (attrs1.hasOwnProperty(attr_name)) {
                    var val1 = attrs1[attr_name];
                    var val2 = attrs2[attr_name];
                    if (val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2) {
                        match = false;
                    }
                }
            }
            return match;
        };
        this.unbind('check_variations update_variation_values found_variation');
        this.find('.reset_variations').unbind('click');
        this.find('.variations select').unbind('change focusin');
        $form = this.on('click', '.reset_variations', function(event) {
            $(this).closest('.variations_form').find('.variations select').val('').change();
            var $sku = $(this).closest('.product').find('.sku'),
                $weight = $(this).closest('.product').find('.product_weight'),
                $dimensions = $(this).closest('.product').find('.product_dimensions');
            if ($sku.attr('data-o_sku')) $sku.text($sku.attr('data-o_sku'));
            if ($weight.attr('data-o_weight')) $weight.text($weight.attr('data-o_weight'));
            if ($dimensions.attr('data-o_dimensions')) $dimensions.text($dimensions.attr('data-o_dimensions'));
            return false;
        }).on('change', '.variations select', function(event) {
            $variation_form = $(this).closest('.variations_form');
            $variation_form.find('input[name=variation_id]').val('').change();
            $variation_form.trigger('woocommerce_variation_select_change').trigger('check_variations', ['', false]);
            $(this).blur();
            if ($().uniform && $.isFunction($.uniform.update)) {
                $.uniform.update();
            }
        }).on('focusin touchstart', '.variations select', function(event) {
            $variation_form = $(this).closest('.variations_form');
            $variation_form.trigger('woocommerce_variation_select_focusin').trigger('check_variations', [$(this).attr('name'), true]);
        }).on('check_variations', function(event, exclude, focus) {
            var all_set = true,
                any_set = false,
                showing_variation = false,
                current_settings = {},
                $variation_form = $(this),
                $reset_variations = $variation_form.find('.reset_variations');
            $variation_form.find('.variations select').each(function() {
                if ($(this).val().length === 0) {
                    all_set = false;
                } else {
                    any_set = true;
                }
                if (exclude && $(this).attr('name') === exclude) {
                    all_set = false;
                    current_settings[$(this).attr('name')] = '';
                } else {
                    value = $(this).val();
                    current_settings[$(this).attr('name')] = value;
                }
            });
            var product_id = parseInt($variation_form.data('product_id')),
                all_variations = $variation_form.data('product_variations');
            if (!all_variations) all_variations = window.product_variations.product_id;
            if (!all_variations) all_variations = window.product_variations;
            if (!all_variations) all_variations = window['product_variations_' + product_id];
            var matching_variations = $.fn.wc_variation_form.find_matching_variations(all_variations, current_settings);
            if (all_set) {
                var variation = matching_variations.shift();
                if (variation) {
                    $variation_form.find('input[name=variation_id]').val(variation.variation_id).change();
                    $variation_form.trigger('found_variation', [variation]);
                } else {
                    $variation_form.find('.variations select').val('');
                    if (!focus) $variation_form.trigger('reset_image');
                    alert(wc_add_to_cart_variation_params.i18n_no_matching_variations_text);
                }
            } else {
                $variation_form.trigger('update_variation_values', [matching_variations]);
                if (!focus) $variation_form.trigger('reset_image');
                if (!exclude) {
                    $variation_form.find('.single_variation_wrap').slideUp(200);
                }
            }
            if (any_set) {
                if ($reset_variations.css('visibility') === 'hidden') $reset_variations.css('visibility', 'visible').hide().fadeIn();
            } else {
                $reset_variations.css('visibility', 'hidden');
            }
        }).on('reset_image', function(event) {
            var $product = $(this).closest('.product'),
                $product_img = $product.find('div.images img:eq(0)'),
                $product_link = $product.find('div.images a.zoom:eq(0)'),
                o_src = $product_img.attr('data-o_src'),
                o_title = $product_img.attr('data-o_title'),
                o_alt = $product_img.attr('data-o_alt'),
                o_href = $product_link.attr('data-o_href');
            if (o_src !== undefined) {
                $product_img.attr('src', o_src);
            }
            if (o_href !== undefined) {
                $product_link.attr('href', o_href);
            }
            if (o_title !== undefined) {
                $product_img.attr('title', o_title);
                $product_link.attr('title', o_title);
            }
            if (o_alt !== undefined) {
                $product_img.attr('alt', o_alt);
            }
        }).on('update_variation_values', function(event, variations) {
            $variation_form = $(this).closest('.variations_form');
            $variation_form.find('.variations select').each(function(index, el) {
                current_attr_select = $(el);
                if (!current_attr_select.data('attribute_options')) current_attr_select.data('attribute_options', current_attr_select.find('option:gt(0)').get());
                current_attr_select.find('option:gt(0)').remove();
                current_attr_select.append(current_attr_select.data('attribute_options'));
                current_attr_select.find('option:gt(0)').removeClass('active');
                var current_attr_name = current_attr_select.attr('name');
                for (var num in variations) {
                    if (typeof(variations[num]) != 'undefined') {
                        var attributes = variations[num].attributes;
                        for (var attr_name in attributes) {
                            if (attributes.hasOwnProperty(attr_name)) {
                                var attr_val = attributes[attr_name];
                                if (attr_name == current_attr_name) {
                                    if (attr_val) {
                                        attr_val = $('<div/>').html(attr_val).text();
                                        attr_val = attr_val.replace(/'/g, "\\'");
                                        attr_val = attr_val.replace(/"/g, "\\\"");
                                        current_attr_select.find('option[value="' + attr_val + '"]').addClass('active');
                                    } else {
                                        current_attr_select.find('option:gt(0)').addClass('active');
                                    }
                                }
                            }
                        }
                    }
                }
                current_attr_select.find('option:gt(0):not(.active)').remove();
            });
            $variation_form.trigger('woocommerce_update_variation_values');
        }).on('found_variation', function(event, variation) {
            var $variation_form = $(this),
                $product = $(this).closest('.product'),
                $product_img = $product.find('div.images img:eq(0)'),
                $product_link = $product.find('div.images a.zoom:eq(0)'),
                o_src = $product_img.attr('data-o_src'),
                o_title = $product_img.attr('data-o_title'),
                o_alt = $product_img.attr('data-o_alt'),
                o_href = $product_link.attr('data-o_href'),
                variation_image = variation.image_src,
                variation_link = variation.image_link,
                variation_title = variation.image_title,
                variation_alt = variation.image_alt;
            $variation_form.find('.variations_button').show();
            $variation_form.find('.single_variation').html(variation.price_html + variation.availability_html);
            if (o_src === undefined) {
                o_src = (!$product_img.attr('src')) ? '' : $product_img.attr('src');
                $product_img.attr('data-o_src', o_src);
            }
            if (o_href === undefined) {
                o_href = (!$product_link.attr('href')) ? '' : $product_link.attr('href');
                $product_link.attr('data-o_href', o_href);
            }
            if (o_title === undefined) {
                o_title = (!$product_img.attr('title')) ? '' : $product_img.attr('title');
                $product_img.attr('data-o_title', o_title);
            }
            if (o_alt === undefined) {
                o_alt = (!$product_img.attr('alt')) ? '' : $product_img.attr('alt');
                $product_img.attr('data-o_alt', o_alt);
            }
            if (variation_image && variation_image.length > 1) {
                $product_img.attr('src', variation_image).attr('alt', variation_alt).attr('title', variation_title);
                $product_link.attr('href', variation_link).attr('title', variation_title);
            } else {
                $product_img.attr('src', o_src).attr('alt', o_alt).attr('title', o_title);
                $product_link.attr('href', o_href).attr('title', o_title);
            }
            var $single_variation_wrap = $variation_form.find('.single_variation_wrap'),
                $sku = $product.find('.product_meta').find('.sku'),
                $weight = $product.find('.product_weight'),
                $dimensions = $product.find('.product_dimensions');
            if (!$sku.attr('data-o_sku')) $sku.attr('data-o_sku', $sku.text());
            if (!$weight.attr('data-o_weight')) $weight.attr('data-o_weight', $weight.text());
            if (!$dimensions.attr('data-o_dimensions')) $dimensions.attr('data-o_dimensions', $dimensions.text());
            if (variation.sku) {
                $sku.text(variation.sku);
            } else {
                $sku.text($sku.attr('data-o_sku'));
            }
            if (variation.weight) {
                $weight.text(variation.weight);
            } else {
                $weight.text($weight.attr('data-o_weight'));
            }
            if (variation.dimensions) {
                $dimensions.text(variation.dimensions);
            } else {
                $dimensions.text($dimensions.attr('data-o_dimensions'));
            }
            $single_variation_wrap.find('.quantity').show();
            if (!variation.is_purchasable || !variation.is_in_stock || !variation.variation_is_visible) {
                $variation_form.find('.variations_button').hide();
            }
            if (!variation.variation_is_visible) {
                $variation_form.find('.single_variation').html('<p>' + wc_add_to_cart_variation_params.i18n_unavailable_text + '</p>');
            }
            if (variation.min_qty) $single_variation_wrap.find('input[name=quantity]').attr('min', variation.min_qty).val(variation.min_qty);
            else
                $single_variation_wrap.find('input[name=quantity]').removeAttr('min');
            if (variation.max_qty) $single_variation_wrap.find('input[name=quantity]').attr('max', variation.max_qty);
            else
                $single_variation_wrap.find('input[name=quantity]').removeAttr('max');
            if (variation.is_sold_individually === 'yes') {
                $single_variation_wrap.find('input[name=quantity]').val('1');
                $single_variation_wrap.find('.quantity').hide();
            }
            $single_variation_wrap.slideDown(200).trigger('show_variation', [variation]);
        });
        $form.trigger('wc_variation_form');
        return $form;
    };
    $(function() {
        if (typeof wc_add_to_cart_variation_params === 'undefined') return false;
        $('.variations_form').wc_variation_form();
        $('.variations_form .variations select').change();
    });
})(jQuery, window, document);
(function(doc) {
    var root = doc.documentElement;
    if ("MozAppearance" in root.style) {
        var scrollbarWidth = root.clientWidth;
        root.style.overflow = "scroll";
        scrollbarWidth -= root.clientWidth;
        root.style.overflow = "";
        var scrollEvent = doc.createEvent("UIEvent")
        scrollEvent.initEvent("scroll", true, true);

        function scrollHandler() {
            doc.dispatchEvent(scrollEvent)
        }
        doc.addEventListener("mousedown", function(e) {
            if (e.clientX > root.clientWidth - scrollbarWidth) {
                doc.addEventListener("mousemove", scrollHandler, false);
                doc.addEventListener("mouseup", function() {
                    doc.removeEventListener("mouseup", arguments.callee, false);
                    doc.removeEventListener("mousemove", scrollHandler, false);
                }, false)
            }
        }, false)
        doc.addEventListener("DOMMouseScroll", function(e) {
            if (!e.ctrlKey && !e.shiftKey) {
                root.scrollTop += e.detail * 16;
                scrollHandler.call(this, e);
                e.preventDefault()
            }
        }, false)
    }
})(document);
(function(e) {
    e.fn.hoverIntent = function(t, n, r) {
        var i = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };
        if (typeof t === "object") {
            i = e.extend(i, t)
        } else if (e.isFunction(n)) {
            i = e.extend(i, {
                over: t,
                out: n,
                selector: r
            })
        } else {
            i = e.extend(i, {
                over: t,
                out: t,
                selector: n
            })
        }
        var s, o, u, a;
        var f = function(e) {
            s = e.pageX;
            o = e.pageY
        };
        var l = function(t, n) {
            n.hoverIntent_t = clearTimeout(n.hoverIntent_t);
            if (Math.abs(u - s) + Math.abs(a - o) < i.sensitivity) {
                e(n).off("mousemove.hoverIntent", f);
                n.hoverIntent_s = 1;
                return i.over.apply(n, [t])
            } else {
                u = s;
                a = o;
                n.hoverIntent_t = setTimeout(function() {
                    l(t, n)
                }, i.interval)
            }
        };
        var c = function(e, t) {
            t.hoverIntent_t = clearTimeout(t.hoverIntent_t);
            t.hoverIntent_s = 0;
            return i.out.apply(t, [e])
        };
        var h = function(t) {
            var n = jQuery.extend({}, t);
            var r = this;
            if (r.hoverIntent_t) {
                r.hoverIntent_t = clearTimeout(r.hoverIntent_t)
            }
            if (t.type == "mouseenter") {
                u = n.pageX;
                a = n.pageY;
                e(r).on("mousemove.hoverIntent", f);
                if (r.hoverIntent_s != 1) {
                    r.hoverIntent_t = setTimeout(function() {
                        l(n, r)
                    }, i.interval)
                }
            } else {
                e(r).off("mousemove.hoverIntent", f);
                if (r.hoverIntent_s == 1) {
                    r.hoverIntent_t = setTimeout(function() {
                        c(n, r)
                    }, i.timeout)
                }
            }
        };
        return this.on({
            "mouseenter.hoverIntent": h,
            "mouseleave.hoverIntent": h
        }, i.selector)
    }
})(jQuery);
(function($) {
    $.fn.gMap = function(options, methods_options) {
        switch (options) {
            case "addMarker":
                return $(this).trigger("gMap.addMarker", [methods_options.latitude, methods_options.longitude, methods_options.content, methods_options.icon, methods_options.popup]);
            case "centerAt":
                return $(this).trigger("gMap.centerAt", [methods_options.latitude, methods_options.longitude, methods_options.zoom]);
            case "clearMarkers":
                return $(this).trigger("gMap.clearMarkers")
        }
        var opts = $.extend({}, $.fn.gMap.defaults, options);
        return this.each(function() {
            var $gmap = new google.maps.Map(this);
            $(this).data("gMap.reference", $gmap);
            var $geocoder = new google.maps.Geocoder;
            if (opts.address) {
                $geocoder.geocode({
                    address: opts.address
                }, function(gresult, status) {
                    if (gresult && gresult.length) $gmap.setCenter(gresult[0].geometry.location)
                })
            } else {
                if (opts.latitude && opts.longitude) {
                    $gmap.setCenter(new google.maps.LatLng(opts.latitude, opts.longitude))
                } else {
                    if ($.isArray(opts.markers) && opts.markers.length > 0) {
                        if (opts.markers[0].address) {
                            $geocoder.geocode({
                                address: opts.markers[0].address
                            }, function(gresult, status) {
                                if (gresult && gresult.length > 0) $gmap.setCenter(gresult[0].geometry.location)
                            })
                        } else {
                            $gmap.setCenter(new google.maps.LatLng(opts.markers[0].latitude, opts.markers[0].longitude))
                        }
                    } else {
                        $gmap.setCenter(new google.maps.LatLng(34.885931, 9.84375))
                    }
                }
            }
            $gmap.setZoom(opts.zoom);
            $gmap.setMapTypeId(google.maps.MapTypeId[opts.maptype]);
            var map_options = {
                scrollwheel: opts.scrollwheel,
                disableDoubleClickZoom: !opts.doubleclickzoom
            };
            if (opts.controls === false) {
                $.extend(map_options, {
                    disableDefaultUI: true
                })
            } else if (opts.controls.length != 0) {
                $.extend(map_options, opts.controls, {
                    disableDefaultUI: true
                })
            }
            $gmap.setOptions(map_options);
            var gicon = new google.maps.Marker;
            marker_icon = new google.maps.MarkerImage(opts.icon.image);
            marker_icon.size = new google.maps.Size(opts.icon.iconsize[0], opts.icon.iconsize[1]);
            marker_icon.anchor = new google.maps.Point(opts.icon.iconanchor[0], opts.icon.iconanchor[1]);
            gicon.setIcon(marker_icon);
            if (opts.icon.shadow) {
                marker_shadow = new google.maps.MarkerImage(opts.icon.shadow);
                marker_shadow.size = new google.maps.Size(opts.icon.shadowsize[0], opts.icon.shadowsize[1]);
                marker_shadow.anchor = new google.maps.Point(opts.icon.shadowanchor[0], opts.icon.shadowanchor[1]);
                gicon.setShadow(marker_shadow)
            }
            $(this).bind("gMap.centerAt", function(e, latitude, longitude, zoom) {
                if (zoom) $gmap.setZoom(zoom);
                $gmap.panTo(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)))
            });
            var overlays = [];
            $(this).bind("gMap.clearMarkers", function() {
                while (overlays[0]) {
                    overlays.pop().setMap(null)
                }
            });
            var last_infowindow;
            $(this).bind("gMap.addMarker", function(e, latitude, longitude, content, icon, popup) {
                var glatlng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
                var gmarker = new google.maps.Marker({
                    position: glatlng
                });
                if (icon) {
                    marker_icon = new google.maps.MarkerImage(icon.image);
                    marker_icon.size = new google.maps.Size(icon.iconsize[0], icon.iconsize[1]);
                    marker_icon.anchor = new google.maps.Point(icon.iconanchor[0], icon.iconanchor[1]);
                    gmarker.setIcon(marker_icon);
                    if (icon.shadow) {
                        marker_shadow = new google.maps.MarkerImage(icon.shadow);
                        marker_shadow.size = new google.maps.Size(icon.shadowsize[0], icon.shadowsize[1]);
                        marker_shadow.anchor = new google.maps.Point(icon.shadowanchor[0], icon.shadowanchor[1]);
                        gicon.setShadow(marker_shadow)
                    }
                } else {
                    gmarker.setIcon(gicon.getIcon());
                    gmarker.setShadow(gicon.getShadow())
                }
                if (content) {
                    if (content == "_latlng") content = latitude + ", " + longitude;
                    var infowindow = new google.maps.InfoWindow({
                        content: opts.html_prepend + content + opts.html_append
                    });
                    google.maps.event.addListener(gmarker, "click", function() {
                        last_infowindow && last_infowindow.close();
                        infowindow.open($gmap, gmarker);
                        last_infowindow = infowindow
                    });
                    if (popup) {
                        google.maps.event.addListenerOnce($gmap, "tilesloaded", function() {
                            infowindow.open($gmap, gmarker)
                        })
                    }
                }
                gmarker.setMap($gmap);
                overlays.push(gmarker)
            });
            for (var j = 0; j < opts.markers.length; j++) {
                marker = opts.markers[j];
                if (marker.address) {
                    if (marker.html == "_address") marker.html = marker.address;
                    var $this = this;
                    $geocoder.geocode({
                        address: marker.address
                    }, function(marker, $this) {
                        return function(gresult, status) {
                            if (gresult && gresult.length > 0) {
                                $($this).trigger("gMap.addMarker", [gresult[0].geometry.location.lat(), gresult[0].geometry.location.lng(), marker.html, marker.icon, marker.popup])
                            }
                        }
                    }(marker, $this))
                } else {
                    $(this).trigger("gMap.addMarker", [marker.latitude, marker.longitude, marker.html, marker.icon, marker.popup])
                }
            }
        })
    };
    $.fn.gMap.defaults = {
        address: "",
        latitude: 0,
        longitude: 0,
        zoom: 1,
        markers: [],
        controls: [],
        scrollwheel: false,
        doubleclickzoom: true,
        maptype: "ROADMAP",
        html_prepend: '<div class="gmap_marker">',
        html_append: "</div>",
        icon: {
            image: "http://www.google.com/mapfiles/marker.png",
            shadow: "http://www.google.com/mapfiles/shadow50.png",
            iconsize: [20, 34],
            shadowsize: [37, 34],
            iconanchor: [9, 34],
            shadowanchor: [6, 34]
        }
    }
})(jQuery);
(function(window) {
    var slice = Array.prototype.slice;

    function noop() {}

    function defineBridget($) {
        if (!$) {
            return;
        }

        function addOptionMethod(PluginClass) {
            if (PluginClass.prototype.option) {
                return;
            }
            PluginClass.prototype.option = function(opts) {
                if (!$.isPlainObject(opts)) {
                    return;
                }
                this.options = $.extend(true, this.options, opts);
            };
        }
        var logError = typeof console === 'undefined' ? noop : function(message) {
            console.error(message);
        };

        function bridge(namespace, PluginClass) {
            $.fn[namespace] = function(options) {
                if (typeof options === 'string') {
                    var args = slice.call(arguments, 1);
                    for (var i = 0, len = this.length; i < len; i++) {
                        var elem = this[i];
                        var instance = $.data(elem, namespace);
                        if (!instance) {
                            logError("cannot call methods on " + namespace + " prior to initialization; " + "attempted to call '" + options + "'");
                            continue;
                        }
                        if (!$.isFunction(instance[options]) || options.charAt(0) === '_') {
                            logError("no such method '" + options + "' for " + namespace + " instance");
                            continue;
                        }
                        var returnValue = instance[options].apply(instance, args);
                        if (returnValue !== undefined) {
                            return returnValue;
                        }
                    }
                    return this;
                } else {
                    return this.each(function() {
                        var instance = $.data(this, namespace);
                        if (instance) {
                            instance.option(options);
                            instance._init();
                        } else {
                            instance = new PluginClass(this, options);
                            $.data(this, namespace, instance);
                        }
                    });
                }
            };
        }
        $.bridget = function(namespace, PluginClass) {
            addOptionMethod(PluginClass);
            bridge(namespace, PluginClass);
        };
        return $.bridget;
    }
    if (typeof define === 'function' && define.amd) {
        define('jquery-bridget/jquery.bridget', ['jquery'], defineBridget);
    } else if (typeof exports === 'object') {
        defineBridget(require('jquery'));
    } else {
        defineBridget(window.jQuery);
    }
})(window);
(function(window) {
    var docElem = document.documentElement;
    var bind = function() {};

    function getIEEvent(obj) {
        var event = window.event;
        event.target = event.target || event.srcElement || obj;
        return event;
    }
    if (docElem.addEventListener) {
        bind = function(obj, type, fn) {
            obj.addEventListener(type, fn, false);
        };
    } else if (docElem.attachEvent) {
        bind = function(obj, type, fn) {
            obj[type + fn] = fn.handleEvent ? function() {
                var event = getIEEvent(obj);
                fn.handleEvent.call(fn, event);
            } : function() {
                var event = getIEEvent(obj);
                fn.call(obj, event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
        };
    }
    var unbind = function() {};
    if (docElem.removeEventListener) {
        unbind = function(obj, type, fn) {
            obj.removeEventListener(type, fn, false);
        };
    } else if (docElem.detachEvent) {
        unbind = function(obj, type, fn) {
            obj.detachEvent("on" + type, obj[type + fn]);
            try {
                delete obj[type + fn];
            } catch (err) {
                obj[type + fn] = undefined;
            }
        };
    }
    var eventie = {
        bind: bind,
        unbind: unbind
    };
    if (typeof define === 'function' && define.amd) {
        define('eventie/eventie', eventie);
    } else if (typeof exports === 'object') {
        module.exports = eventie;
    } else {
        window.eventie = eventie;
    }
})(this);
(function(window) {
    var document = window.document;
    var queue = [];

    function docReady(fn) {
        if (typeof fn !== 'function') {
            return;
        }
        if (docReady.isReady) {
            fn();
        } else {
            queue.push(fn);
        }
    }
    docReady.isReady = false;

    function onReady(event) {
        var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
        if (docReady.isReady || isIE8NotReady) {
            return;
        }
        trigger();
    }

    function trigger() {
        docReady.isReady = true;
        for (var i = 0, len = queue.length; i < len; i++) {
            var fn = queue[i];
            fn();
        }
    }

    function defineDocReady(eventie) {
        if (document.readyState === 'complete') {
            trigger();
        } else {
            eventie.bind(document, 'DOMContentLoaded', onReady);
            eventie.bind(document, 'readystatechange', onReady);
            eventie.bind(window, 'load', onReady);
        }
        return docReady;
    }
    if (typeof define === 'function' && define.amd) {
        define('doc-ready/doc-ready', ['eventie/eventie'], defineDocReady);
    } else if (typeof exports === 'object') {
        module.exports = defineDocReady(require('eventie'));
    } else {
        window.docReady = defineDocReady(window.eventie);
    }
})(window);
(function() {
    function EventEmitter() {}
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }
        return -1;
    }

    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        } else {
            response = events[evt] || (events[evt] = []);
        }
        return response;
    };
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;
        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }
        return flatListeners;
    };
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;
        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }
        return response || listeners;
    };
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }
        return this;
    };
    proto.on = alias('addListener');
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };
    proto.once = alias('addOnceListener');
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);
                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }
        return this;
    };
    proto.off = alias('removeListener');
    proto.addListeners = function addListeners(evt, listeners) {
        return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function removeListeners(evt, listeners) {
        return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    } else {
                        multiple.call(this, i, value);
                    }
                }
            }
        } else {
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }
        return this;
    };
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;
        if (type === 'string') {
            delete events[evt];
        } else if (evt instanceof RegExp) {
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        } else {
            delete this._events;
        }
        return this;
    };
    proto.removeAllListeners = alias('removeEvent');
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;
        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;
                while (i--) {
                    listener = listeners[key][i];
                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }
                    response = listener.listener.apply(this, args || []);
                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }
        return this;
    };
    proto.trigger = alias('emitEvent');
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        } else {
            return true;
        }
    };
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter', [], function() {
            return EventEmitter;
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = EventEmitter;
    } else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));
(function(window) {
    var prefixes = 'Webkit Moz ms Ms O'.split(' ');
    var docElemStyle = document.documentElement.style;

    function getStyleProperty(propName) {
        if (!propName) {
            return;
        }
        if (typeof docElemStyle[propName] === 'string') {
            return propName;
        }
        propName = propName.charAt(0).toUpperCase() + propName.slice(1);
        var prefixed;
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof docElemStyle[prefixed] === 'string') {
                return prefixed;
            }
        }
    }
    if (typeof define === 'function' && define.amd) {
        define('get-style-property/get-style-property', [], function() {
            return getStyleProperty;
        });
    } else if (typeof exports === 'object') {
        module.exports = getStyleProperty;
    } else {
        window.getStyleProperty = getStyleProperty;
    }
})(window);
(function(window, undefined) {
    function getStyleSize(value) {
        var num = parseFloat(value);
        var isValid = value.indexOf('%') === -1 && !isNaN(num);
        return isValid && num;
    }

    function noop() {}
    var logError = typeof console === 'undefined' ? noop : function(message) {
        console.error(message);
    };
    var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];

    function getZeroSize() {
        var size = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        };
        for (var i = 0, len = measurements.length; i < len; i++) {
            var measurement = measurements[i];
            size[measurement] = 0;
        }
        return size;
    }

    function defineGetSize(getStyleProperty) {
        var isSetup = false;
        var getStyle, boxSizingProp, isBoxSizeOuter;

        function setup() {
            if (isSetup) {
                return;
            }
            isSetup = true;
            var getComputedStyle = window.getComputedStyle;
            getStyle = (function() {
                var getStyleFn = getComputedStyle ? function(elem) {
                    return getComputedStyle(elem, null);
                } : function(elem) {
                    return elem.currentStyle;
                };
                return function getStyle(elem) {
                    var style = getStyleFn(elem);
                    if (!style) {
                        logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1');
                    }
                    return style;
                };
            })();
            boxSizingProp = getStyleProperty('boxSizing');
            if (boxSizingProp) {
                var div = document.createElement('div');
                div.style.width = '200px';
                div.style.padding = '1px 2px 3px 4px';
                div.style.borderStyle = 'solid';
                div.style.borderWidth = '1px 2px 3px 4px';
                div.style[boxSizingProp] = 'border-box';
                var body = document.body || document.documentElement;
                body.appendChild(div);
                var style = getStyle(div);
                isBoxSizeOuter = getStyleSize(style.width) === 200;
                body.removeChild(div);
            }
        }

        function getSize(elem) {
            setup();
            if (typeof elem === 'string') {
                elem = document.querySelector(elem);
            }
            if (!elem || typeof elem !== 'object' || !elem.nodeType) {
                return;
            }
            var style = getStyle(elem);
            if (style.display === 'none') {
                return getZeroSize();
            }
            var size = {};
            size.width = elem.offsetWidth;
            size.height = elem.offsetHeight;
            var isBorderBox = size.isBorderBox = !!(boxSizingProp && style[boxSizingProp] && style[boxSizingProp] === 'border-box');
            for (var i = 0, len = measurements.length; i < len; i++) {
                var measurement = measurements[i];
                var value = style[measurement];
                value = mungeNonPixel(elem, value);
                var num = parseFloat(value);
                size[measurement] = !isNaN(num) ? num : 0;
            }
            var paddingWidth = size.paddingLeft + size.paddingRight;
            var paddingHeight = size.paddingTop + size.paddingBottom;
            var marginWidth = size.marginLeft + size.marginRight;
            var marginHeight = size.marginTop + size.marginBottom;
            var borderWidth = size.borderLeftWidth + size.borderRightWidth;
            var borderHeight = size.borderTopWidth + size.borderBottomWidth;
            var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
            var styleWidth = getStyleSize(style.width);
            if (styleWidth !== false) {
                size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
            }
            var styleHeight = getStyleSize(style.height);
            if (styleHeight !== false) {
                size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
            }
            size.innerWidth = size.width - (paddingWidth + borderWidth);
            size.innerHeight = size.height - (paddingHeight + borderHeight);
            size.outerWidth = size.width + marginWidth;
            size.outerHeight = size.height + marginHeight;
            return size;
        }

        function mungeNonPixel(elem, value) {
            if (window.getComputedStyle || value.indexOf('%') === -1) {
                return value;
            }
            var style = elem.style;
            var left = style.left;
            var rs = elem.runtimeStyle;
            var rsLeft = rs && rs.left;
            if (rsLeft) {
                rs.left = elem.currentStyle.left;
            }
            style.left = value;
            value = style.pixelLeft;
            style.left = left;
            if (rsLeft) {
                rs.left = rsLeft;
            }
            return value;
        }
        return getSize;
    }
    if (typeof define === 'function' && define.amd) {
        define('get-size/get-size', ['get-style-property/get-style-property'], defineGetSize);
    } else if (typeof exports === 'object') {
        module.exports = defineGetSize(require('desandro-get-style-property'));
    } else {
        window.getSize = defineGetSize(window.getStyleProperty);
    }
})(window);
(function(ElemProto) {
    var matchesMethod = (function() {
        if (ElemProto.matchesSelector) {
            return 'matchesSelector';
        }
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        for (var i = 0, len = prefixes.length; i < len; i++) {
            var prefix = prefixes[i];
            var method = prefix + 'MatchesSelector';
            if (ElemProto[method]) {
                return method;
            }
        }
    })();

    function match(elem, selector) {
        return elem[matchesMethod](selector);
    }

    function checkParent(elem) {
        if (elem.parentNode) {
            return;
        }
        var fragment = document.createDocumentFragment();
        fragment.appendChild(elem);
    }

    function query(elem, selector) {
        checkParent(elem);
        var elems = elem.parentNode.querySelectorAll(selector);
        for (var i = 0, len = elems.length; i < len; i++) {
            if (elems[i] === elem) {
                return true;
            }
        }
        return false;
    }

    function matchChild(elem, selector) {
        checkParent(elem);
        return match(elem, selector);
    }
    var matchesSelector;
    if (matchesMethod) {
        var div = document.createElement('div');
        var supportsOrphans = match(div, 'div');
        matchesSelector = supportsOrphans ? match : matchChild;
    } else {
        matchesSelector = query;
    }
    if (typeof define === 'function' && define.amd) {
        define('matches-selector/matches-selector', [], function() {
            return matchesSelector;
        });
    } else if (typeof exports === 'object') {
        module.exports = matchesSelector;
    } else {
        window.matchesSelector = matchesSelector;
    }
})(Element.prototype);
(function(window) {
    var getComputedStyle = window.getComputedStyle;
    var getStyle = getComputedStyle ? function(elem) {
        return getComputedStyle(elem, null);
    } : function(elem) {
        return elem.currentStyle;
    };

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }

    function isEmptyObj(obj) {
        for (var prop in obj) {
            return false;
        }
        prop = null;
        return true;
    }

    function toDash(str) {
        return str.replace(/([A-Z])/g, function($1) {
            return '-' + $1.toLowerCase();
        });
    }

    function outlayerItemDefinition(EventEmitter, getSize, getStyleProperty) {
        var transitionProperty = getStyleProperty('transition');
        var transformProperty = getStyleProperty('transform');
        var supportsCSS3 = transitionProperty && transformProperty;
        var is3d = !!getStyleProperty('perspective');
        var transitionEndEvent = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'otransitionend',
            transition: 'transitionend'
        }[transitionProperty];
        var prefixableProperties = ['transform', 'transition', 'transitionDuration', 'transitionProperty'];
        var vendorProperties = (function() {
            var cache = {};
            for (var i = 0, len = prefixableProperties.length; i < len; i++) {
                var prop = prefixableProperties[i];
                var supportedProp = getStyleProperty(prop);
                if (supportedProp && supportedProp !== prop) {
                    cache[prop] = supportedProp;
                }
            }
            return cache;
        })();

        function Item(element, layout) {
            if (!element) {
                return;
            }
            this.element = element;
            this.layout = layout;
            this.position = {
                x: 0,
                y: 0
            };
            this._create();
        }
        extend(Item.prototype, EventEmitter.prototype);
        Item.prototype._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            };
            this.css({
                position: 'absolute'
            });
        };
        Item.prototype.handleEvent = function(event) {
            var method = 'on' + event.type;
            if (this[method]) {
                this[method](event);
            }
        };
        Item.prototype.getSize = function() {
            this.size = getSize(this.element);
        };
        Item.prototype.css = function(style) {
            var elemStyle = this.element.style;
            for (var prop in style) {
                var supportedProp = vendorProperties[prop] || prop;
                elemStyle[supportedProp] = style[prop];
            }
        };
        Item.prototype.getPosition = function() {
            var style = getStyle(this.element);
            var layoutOptions = this.layout.options;
            var isOriginLeft = layoutOptions.isOriginLeft;
            var isOriginTop = layoutOptions.isOriginTop;
            var x = parseInt(style[isOriginLeft ? 'left' : 'right'], 10);
            var y = parseInt(style[isOriginTop ? 'top' : 'bottom'], 10);
            x = isNaN(x) ? 0 : x;
            y = isNaN(y) ? 0 : y;
            var layoutSize = this.layout.size;
            x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
            y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
            this.position.x = x;
            this.position.y = y;
        };
        Item.prototype.layoutPosition = function() {
            var layoutSize = this.layout.size;
            var layoutOptions = this.layout.options;
            var style = {};
            if (layoutOptions.isOriginLeft) {
                style.left = (this.position.x + layoutSize.paddingLeft) + 'px';
                style.right = '';
            } else {
                style.right = (this.position.x + layoutSize.paddingRight) + 'px';
                style.left = '';
            }
            if (layoutOptions.isOriginTop) {
                style.top = (this.position.y + layoutSize.paddingTop) + 'px';
                style.bottom = '';
            } else {
                style.bottom = (this.position.y + layoutSize.paddingBottom) + 'px';
                style.top = '';
            }
            this.css(style);
            this.emitEvent('layout', [this]);
        };
        var translate = is3d ? function(x, y) {
            return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        } : function(x, y) {
            return 'translate(' + x + 'px, ' + y + 'px)';
        };
        Item.prototype._transitionTo = function(x, y) {
            this.getPosition();
            var curX = this.position.x;
            var curY = this.position.y;
            var compareX = parseInt(x, 10);
            var compareY = parseInt(y, 10);
            var didNotMove = compareX === this.position.x && compareY === this.position.y;
            this.setPosition(x, y);
            if (didNotMove && !this.isTransitioning) {
                this.layoutPosition();
                return;
            }
            var transX = x - curX;
            var transY = y - curY;
            var transitionStyle = {};
            var layoutOptions = this.layout.options;
            transX = layoutOptions.isOriginLeft ? transX : -transX;
            transY = layoutOptions.isOriginTop ? transY : -transY;
            transitionStyle.transform = translate(transX, transY);
            this.transition({
                to: transitionStyle,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: true
            });
        };
        Item.prototype.goTo = function(x, y) {
            this.setPosition(x, y);
            this.layoutPosition();
        };
        Item.prototype.moveTo = supportsCSS3 ? Item.prototype._transitionTo : Item.prototype.goTo;
        Item.prototype.setPosition = function(x, y) {
            this.position.x = parseInt(x, 10);
            this.position.y = parseInt(y, 10);
        };
        Item.prototype._nonTransition = function(args) {
            this.css(args.to);
            if (args.isCleaning) {
                this._removeStyles(args.to);
            }
            for (var prop in args.onTransitionEnd) {
                args.onTransitionEnd[prop].call(this);
            }
        };
        Item.prototype._transition = function(args) {
            if (!parseFloat(this.layout.options.transitionDuration)) {
                this._nonTransition(args);
                return;
            }
            var _transition = this._transn;
            for (var prop in args.onTransitionEnd) {
                _transition.onEnd[prop] = args.onTransitionEnd[prop];
            }
            for (prop in args.to) {
                _transition.ingProperties[prop] = true;
                if (args.isCleaning) {
                    _transition.clean[prop] = true;
                }
            }
            if (args.from) {
                this.css(args.from);
                var h = this.element.offsetHeight;
                h = null;
            }
            this.enableTransition(args.to);
            this.css(args.to);
            this.isTransitioning = true;
        };
        var itemTransitionProperties = transformProperty && (toDash(transformProperty) + ',opacity');
        Item.prototype.enableTransition = function() {
            if (this.isTransitioning) {
                return;
            }
            this.css({
                transitionProperty: itemTransitionProperties,
                transitionDuration: this.layout.options.transitionDuration
            });
            this.element.addEventListener(transitionEndEvent, this, false);
        };
        Item.prototype.transition = Item.prototype[transitionProperty ? '_transition' : '_nonTransition'];
        Item.prototype.onwebkitTransitionEnd = function(event) {
            this.ontransitionend(event);
        };
        Item.prototype.onotransitionend = function(event) {
            this.ontransitionend(event);
        };
        var dashedVendorProperties = {
            '-webkit-transform': 'transform',
            '-moz-transform': 'transform',
            '-o-transform': 'transform'
        };
        Item.prototype.ontransitionend = function(event) {
            if (event.target !== this.element) {
                return;
            }
            var _transition = this._transn;
            var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;
            delete _transition.ingProperties[propertyName];
            if (isEmptyObj(_transition.ingProperties)) {
                this.disableTransition();
            }
            if (propertyName in _transition.clean) {
                this.element.style[event.propertyName] = '';
                delete _transition.clean[propertyName];
            }
            if (propertyName in _transition.onEnd) {
                var onTransitionEnd = _transition.onEnd[propertyName];
                onTransitionEnd.call(this);
                delete _transition.onEnd[propertyName];
            }
            this.emitEvent('transitionEnd', [this]);
        };
        Item.prototype.disableTransition = function() {
            this.removeTransitionStyles();
            this.element.removeEventListener(transitionEndEvent, this, false);
            this.isTransitioning = false;
        };
        Item.prototype._removeStyles = function(style) {
            var cleanStyle = {};
            for (var prop in style) {
                cleanStyle[prop] = '';
            }
            this.css(cleanStyle);
        };
        var cleanTransitionStyle = {
            transitionProperty: '',
            transitionDuration: ''
        };
        Item.prototype.removeTransitionStyles = function() {
            this.css(cleanTransitionStyle);
        };
        Item.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element);
            this.emitEvent('remove', [this]);
        };
        Item.prototype.remove = function() {
            if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
                this.removeElem();
                return;
            }
            var _this = this;
            this.on('transitionEnd', function() {
                _this.removeElem();
                return true;
            });
            this.hide();
        };
        Item.prototype.reveal = function() {
            delete this.isHidden;
            this.css({
                display: ''
            });
            var options = this.layout.options;
            this.transition({
                from: options.hiddenStyle,
                to: options.visibleStyle,
                isCleaning: true
            });
        };
        Item.prototype.hide = function() {
            this.isHidden = true;
            this.css({
                display: ''
            });
            var options = this.layout.options;
            this.transition({
                from: options.visibleStyle,
                to: options.hiddenStyle,
                isCleaning: true,
                onTransitionEnd: {
                    opacity: function() {}
                }
            });
        };
        Item.prototype.destroy = function() {
            this.css({
                position: '',
                left: '',
                right: '',
                top: '',
                bottom: '',
                transition: '',
                transform: ''
            });
        };
        return Item;
    }
    if (typeof define === 'function' && define.amd) {
        define('outlayer/item', ['eventEmitter/EventEmitter', 'get-size/get-size', 'get-style-property/get-style-property'], outlayerItemDefinition);
    } else if (typeof exports === 'object') {
        module.exports = outlayerItemDefinition(require('wolfy87-eventemitter'), require('get-size'), require('desandro-get-style-property'));
    } else {
        window.Outlayer = {};
        window.Outlayer.Item = outlayerItemDefinition(window.EventEmitter, window.getSize, window.getStyleProperty);
    }
})(window);
(function(window) {
    var document = window.document;
    var console = window.console;
    var jQuery = window.jQuery;
    var noop = function() {};

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }
    var objToString = Object.prototype.toString;

    function isArray(obj) {
        return objToString.call(obj) === '[object Array]';
    }

    function makeArray(obj) {
        var ary = [];
        if (isArray(obj)) {
            ary = obj;
        } else if (obj && typeof obj.length === 'number') {
            for (var i = 0, len = obj.length; i < len; i++) {
                ary.push(obj[i]);
            }
        } else {
            ary.push(obj);
        }
        return ary;
    }
    var isElement = (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') ? function isElementDOM2(obj) {
        return obj instanceof HTMLElement;
    } : function isElementQuirky(obj) {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    var indexOf = Array.prototype.indexOf ? function(ary, obj) {
        return ary.indexOf(obj);
    } : function(ary, obj) {
        for (var i = 0, len = ary.length; i < len; i++) {
            if (ary[i] === obj) {
                return i;
            }
        }
        return -1;
    };

    function removeFrom(obj, ary) {
        var index = indexOf(ary, obj);
        if (index !== -1) {
            ary.splice(index, 1);
        }
    }

    function toDashed(str) {
        return str.replace(/(.)([A-Z])/g, function(match, $1, $2) {
            return $1 + '-' + $2;
        }).toLowerCase();
    }

    function outlayerDefinition(eventie, docReady, EventEmitter, getSize, matchesSelector, Item) {
        var GUID = 0;
        var instances = {};

        function Outlayer(element, options) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (!element || !isElement(element)) {
                if (console) {
                    console.error('Bad ' + this.constructor.namespace + ' element: ' + element);
                }
                return;
            }
            this.element = element;
            this.options = extend({}, this.constructor.defaults);
            this.option(options);
            var id = ++GUID;
            this.element.outlayerGUID = id;
            instances[id] = this;
            this._create();
            if (this.options.isInitLayout) {
                this.layout();
            }
        }
        Outlayer.namespace = 'outlayer';
        Outlayer.Item = Item;
        Outlayer.defaults = {
            containerStyle: {
                position: 'relative'
            },
            isInitLayout: true,
            isOriginLeft: true,
            isOriginTop: true,
            isResizeBound: true,
            isResizingContainer: true,
            transitionDuration: '0.4s',
            hiddenStyle: {},
            visibleStyle: {}
        };
        extend(Outlayer.prototype, EventEmitter.prototype);
        Outlayer.prototype.option = function(opts) {
            extend(this.options, opts);
        };
        Outlayer.prototype._create = function() {
            this.reloadItems();
            this.stamps = [];
            this.stamp(this.options.stamp);
            extend(this.element.style, this.options.containerStyle);
            if (this.options.isResizeBound) {
                this.bindResize();
            }
        };
        Outlayer.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children);
        };
        Outlayer.prototype._itemize = function(elems) {
            var itemElems = this._filterFindItemElements(elems);
            var Item = this.constructor.Item;
            var items = [];
            for (var i = 0, len = itemElems.length; i < len; i++) {
                var elem = itemElems[i];
                var item = new Item(elem, this);
                items.push(item);
            }
            return items;
        };
        Outlayer.prototype._filterFindItemElements = function(elems) {
            elems = makeArray(elems);
            var itemSelector = this.options.itemSelector;
            var itemElems = [];
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                if (!isElement(elem)) {
                    continue;
                }
                if (itemSelector) {
                    if (matchesSelector(elem, itemSelector)) {
                        itemElems.push(elem);
                    }
                    var childElems = elem.querySelectorAll(itemSelector);
                    for (var j = 0, jLen = childElems.length; j < jLen; j++) {
                        itemElems.push(childElems[j]);
                    }
                } else {
                    itemElems.push(elem);
                }
            }
            return itemElems;
        };
        Outlayer.prototype.getItemElements = function() {
            var elems = [];
            for (var i = 0, len = this.items.length; i < len; i++) {
                elems.push(this.items[i].element);
            }
            return elems;
        };
        Outlayer.prototype.layout = function() {
            this._resetLayout();
            this._manageStamps();
            var isInstant = this.options.isLayoutInstant !== undefined ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, isInstant);
            this._isLayoutInited = true;
        };
        Outlayer.prototype._init = Outlayer.prototype.layout;
        Outlayer.prototype._resetLayout = function() {
            this.getSize();
        };
        Outlayer.prototype.getSize = function() {
            this.size = getSize(this.element);
        };
        Outlayer.prototype._getMeasurement = function(measurement, size) {
            var option = this.options[measurement];
            var elem;
            if (!option) {
                this[measurement] = 0;
            } else {
                if (typeof option === 'string') {
                    elem = this.element.querySelector(option);
                } else if (isElement(option)) {
                    elem = option;
                }
                this[measurement] = elem ? getSize(elem)[size] : option;
            }
        };
        Outlayer.prototype.layoutItems = function(items, isInstant) {
            items = this._getItemsForLayout(items);
            this._layoutItems(items, isInstant);
            this._postLayout();
        };
        Outlayer.prototype._getItemsForLayout = function(items) {
            var layoutItems = [];
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                if (!item.isIgnored) {
                    layoutItems.push(item);
                }
            }
            return layoutItems;
        };
        Outlayer.prototype._layoutItems = function(items, isInstant) {
            var _this = this;

            function onItemsLayout() {
                _this.emitEvent('layoutComplete', [_this, items]);
            }
            if (!items || !items.length) {
                onItemsLayout();
                return;
            }
            this._itemsOn(items, 'layout', onItemsLayout);
            var queue = [];
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var position = this._getItemLayoutPosition(item);
                position.item = item;
                position.isInstant = isInstant || item.isLayoutInstant;
                queue.push(position);
            }
            this._processLayoutQueue(queue);
        };
        Outlayer.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            };
        };
        Outlayer.prototype._processLayoutQueue = function(queue) {
            for (var i = 0, len = queue.length; i < len; i++) {
                var obj = queue[i];
                this._positionItem(obj.item, obj.x, obj.y, obj.isInstant);
            }
        };
        Outlayer.prototype._positionItem = function(item, x, y, isInstant) {
            if (isInstant) {
                item.goTo(x, y);
            } else {
                item.moveTo(x, y);
            }
        };
        Outlayer.prototype._postLayout = function() {
            this.resizeContainer();
        };
        Outlayer.prototype.resizeContainer = function() {
            if (!this.options.isResizingContainer) {
                return;
            }
            var size = this._getContainerSize();
            if (size) {
                this._setContainerMeasure(size.width, true);
                this._setContainerMeasure(size.height, false);
            }
        };
        Outlayer.prototype._getContainerSize = noop;
        Outlayer.prototype._setContainerMeasure = function(measure, isWidth) {
            if (measure === undefined) {
                return;
            }
            var elemSize = this.size;
            if (elemSize.isBorderBox) {
                measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
            }
            measure = Math.max(measure, 0);
            this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
        };
        Outlayer.prototype._itemsOn = function(items, eventName, callback) {
            var doneCount = 0;
            var count = items.length;
            var _this = this;

            function tick() {
                doneCount++;
                if (doneCount === count) {
                    callback.call(_this);
                }
                return true;
            }
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                item.on(eventName, tick);
            }
        };
        Outlayer.prototype.ignore = function(elem) {
            var item = this.getItem(elem);
            if (item) {
                item.isIgnored = true;
            }
        };
        Outlayer.prototype.unignore = function(elem) {
            var item = this.getItem(elem);
            if (item) {
                delete item.isIgnored;
            }
        };
        Outlayer.prototype.stamp = function(elems) {
            elems = this._find(elems);
            if (!elems) {
                return;
            }
            this.stamps = this.stamps.concat(elems);
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                this.ignore(elem);
            }
        };
        Outlayer.prototype.unstamp = function(elems) {
            elems = this._find(elems);
            if (!elems) {
                return;
            }
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                removeFrom(elem, this.stamps);
                this.unignore(elem);
            }
        };
        Outlayer.prototype._find = function(elems) {
            if (!elems) {
                return;
            }
            if (typeof elems === 'string') {
                elems = this.element.querySelectorAll(elems);
            }
            elems = makeArray(elems);
            return elems;
        };
        Outlayer.prototype._manageStamps = function() {
            if (!this.stamps || !this.stamps.length) {
                return;
            }
            this._getBoundingRect();
            for (var i = 0, len = this.stamps.length; i < len; i++) {
                var stamp = this.stamps[i];
                this._manageStamp(stamp);
            }
        };
        Outlayer.prototype._getBoundingRect = function() {
            var boundingRect = this.element.getBoundingClientRect();
            var size = this.size;
            this._boundingRect = {
                left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
                top: boundingRect.top + size.paddingTop + size.borderTopWidth,
                right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
                bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
            };
        };
        Outlayer.prototype._manageStamp = noop;
        Outlayer.prototype._getElementOffset = function(elem) {
            var boundingRect = elem.getBoundingClientRect();
            var thisRect = this._boundingRect;
            var size = getSize(elem);
            var offset = {
                left: boundingRect.left - thisRect.left - size.marginLeft,
                top: boundingRect.top - thisRect.top - size.marginTop,
                right: thisRect.right - boundingRect.right - size.marginRight,
                bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
            };
            return offset;
        };
        Outlayer.prototype.handleEvent = function(event) {
            var method = 'on' + event.type;
            if (this[method]) {
                this[method](event);
            }
        };
        Outlayer.prototype.bindResize = function() {
            if (this.isResizeBound) {
                return;
            }
            eventie.bind(window, 'resize', this);
            this.isResizeBound = true;
        };
        Outlayer.prototype.unbindResize = function() {
            if (this.isResizeBound) {
                eventie.unbind(window, 'resize', this);
            }
            this.isResizeBound = false;
        };
        Outlayer.prototype.onresize = function() {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            var _this = this;

            function delayed() {
                _this.resize();
                delete _this.resizeTimeout;
            }
            this.resizeTimeout = setTimeout(delayed, 100);
        };
        Outlayer.prototype.resize = function() {
            if (!this.isResizeBound || !this.needsResizeLayout()) {
                return;
            }
            this.layout();
        };
        Outlayer.prototype.needsResizeLayout = function() {
            var size = getSize(this.element);
            var hasSizes = this.size && size;
            return hasSizes && size.innerWidth !== this.size.innerWidth;
        };
        Outlayer.prototype.addItems = function(elems) {
            var items = this._itemize(elems);
            if (items.length) {
                this.items = this.items.concat(items);
            }
            return items;
        };
        Outlayer.prototype.appended = function(elems) {
            var items = this.addItems(elems);
            if (!items.length) {
                return;
            }
            this.layoutItems(items, true);
            this.reveal(items);
        };
        Outlayer.prototype.prepended = function(elems) {
            var items = this._itemize(elems);
            if (!items.length) {
                return;
            }
            var previousItems = this.items.slice(0);
            this.items = items.concat(previousItems);
            this._resetLayout();
            this._manageStamps();
            this.layoutItems(items, true);
            this.reveal(items);
            this.layoutItems(previousItems);
        };
        Outlayer.prototype.reveal = function(items) {
            var len = items && items.length;
            if (!len) {
                return;
            }
            for (var i = 0; i < len; i++) {
                var item = items[i];
                item.reveal();
            }
        };
        Outlayer.prototype.hide = function(items) {
            var len = items && items.length;
            if (!len) {
                return;
            }
            for (var i = 0; i < len; i++) {
                var item = items[i];
                item.hide();
            }
        };
        Outlayer.prototype.getItem = function(elem) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var item = this.items[i];
                if (item.element === elem) {
                    return item;
                }
            }
        };
        Outlayer.prototype.getItems = function(elems) {
            if (!elems || !elems.length) {
                return;
            }
            var items = [];
            for (var i = 0, len = elems.length; i < len; i++) {
                var elem = elems[i];
                var item = this.getItem(elem);
                if (item) {
                    items.push(item);
                }
            }
            return items;
        };
        Outlayer.prototype.remove = function(elems) {
            elems = makeArray(elems);
            var removeItems = this.getItems(elems);
            if (!removeItems || !removeItems.length) {
                return;
            }
            this._itemsOn(removeItems, 'remove', function() {
                this.emitEvent('removeComplete', [this, removeItems]);
            });
            for (var i = 0, len = removeItems.length; i < len; i++) {
                var item = removeItems[i];
                item.remove();
                removeFrom(item, this.items);
            }
        };
        Outlayer.prototype.destroy = function() {
            var style = this.element.style;
            style.height = '';
            style.position = '';
            style.width = '';
            for (var i = 0, len = this.items.length; i < len; i++) {
                var item = this.items[i];
                item.destroy();
            }
            this.unbindResize();
            var id = this.element.outlayerGUID;
            delete instances[id];
            delete this.element.outlayerGUID;
            if (jQuery) {
                jQuery.removeData(this.element, this.constructor.namespace);
            }
        };
        Outlayer.data = function(elem) {
            var id = elem && elem.outlayerGUID;
            return id && instances[id];
        };
        Outlayer.create = function(namespace, options) {
            function Layout() {
                Outlayer.apply(this, arguments);
            }
            if (Object.create) {
                Layout.prototype = Object.create(Outlayer.prototype);
            } else {
                extend(Layout.prototype, Outlayer.prototype);
            }
            Layout.prototype.constructor = Layout;
            Layout.defaults = extend({}, Outlayer.defaults);
            extend(Layout.defaults, options);
            Layout.prototype.settings = {};
            Layout.namespace = namespace;
            Layout.data = Outlayer.data;
            Layout.Item = function LayoutItem() {
                Item.apply(this, arguments);
            };
            Layout.Item.prototype = new Item();
            docReady(function() {
                var dashedNamespace = toDashed(namespace);
                var elems = document.querySelectorAll('.js-' + dashedNamespace);
                var dataAttr = 'data-' + dashedNamespace + '-options';
                for (var i = 0, len = elems.length; i < len; i++) {
                    var elem = elems[i];
                    var attr = elem.getAttribute(dataAttr);
                    var options;
                    try {
                        options = attr && JSON.parse(attr);
                    } catch (error) {
                        if (console) {
                            console.error('Error parsing ' + dataAttr + ' on ' + elem.nodeName.toLowerCase() + (elem.id ? '#' + elem.id : '') + ': ' + error);
                        }
                        continue;
                    }
                    var instance = new Layout(elem, options);
                    if (jQuery) {
                        jQuery.data(elem, namespace, instance);
                    }
                }
            });
            if (jQuery && jQuery.bridget) {
                jQuery.bridget(namespace, Layout);
            }
            return Layout;
        };
        Outlayer.Item = Item;
        return Outlayer;
    }
    if (typeof define === 'function' && define.amd) {
        define('outlayer/outlayer', ['eventie/eventie', 'doc-ready/doc-ready', 'eventEmitter/EventEmitter', 'get-size/get-size', 'matches-selector/matches-selector', './item'], outlayerDefinition);
    } else if (typeof exports === 'object') {
        module.exports = outlayerDefinition(require('eventie'), require('doc-ready'), require('wolfy87-eventemitter'), require('get-size'), require('desandro-matches-selector'), require('./item'));
    } else {
        window.Outlayer = outlayerDefinition(window.eventie, window.docReady, window.EventEmitter, window.getSize, window.matchesSelector, window.Outlayer.Item);
    }
})(window);
(function(window) {
    function itemDefinition(Outlayer) {
        function Item() {
            Outlayer.Item.apply(this, arguments);
        }
        Item.prototype = new Outlayer.Item();
        Item.prototype._create = function() {
            this.id = this.layout.itemGUID++;
            Outlayer.Item.prototype._create.call(this);
            this.sortData = {};
        };
        Item.prototype.updateSortData = function() {
            if (this.isIgnored) {
                return;
            }
            this.sortData.id = this.id;
            this.sortData['original-order'] = this.id;
            this.sortData.random = Math.random();
            var getSortData = this.layout.options.getSortData;
            var sorters = this.layout._sorters;
            for (var key in getSortData) {
                var sorter = sorters[key];
                this.sortData[key] = sorter(this.element, this);
            }
        };
        var _destroy = Item.prototype.destroy;
        Item.prototype.destroy = function() {
            _destroy.apply(this, arguments);
            this.css({
                display: ''
            });
        };
        return Item;
    }
    if (typeof define === 'function' && define.amd) {
        define('isotope/js/item', ['outlayer/outlayer'], itemDefinition);
    } else if (typeof exports === 'object') {
        module.exports = itemDefinition(require('outlayer'));
    } else {
        window.Isotope = window.Isotope || {};
        window.Isotope.Item = itemDefinition(window.Outlayer);
    }
})(window);
(function(window) {
    function layoutModeDefinition(getSize, Outlayer) {
        function LayoutMode(isotope) {
            this.isotope = isotope;
            if (isotope) {
                this.options = isotope.options[this.namespace];
                this.element = isotope.element;
                this.items = isotope.filteredItems;
                this.size = isotope.size;
            }
        }(function() {
            var facadeMethods = ['_resetLayout', '_getItemLayoutPosition', '_manageStamp', '_getContainerSize', '_getElementOffset', 'needsResizeLayout'];
            for (var i = 0, len = facadeMethods.length; i < len; i++) {
                var methodName = facadeMethods[i];
                LayoutMode.prototype[methodName] = getOutlayerMethod(methodName);
            }

            function getOutlayerMethod(methodName) {
                return function() {
                    return Outlayer.prototype[methodName].apply(this.isotope, arguments);
                };
            }
        })();
        LayoutMode.prototype.needsVerticalResizeLayout = function() {
            var size = getSize(this.isotope.element);
            var hasSizes = this.isotope.size && size;
            return hasSizes && size.innerHeight !== this.isotope.size.innerHeight;
        };
        LayoutMode.prototype._getMeasurement = function() {
            this.isotope._getMeasurement.apply(this, arguments);
        };
        LayoutMode.prototype.getColumnWidth = function() {
            this.getSegmentSize('column', 'Width');
        };
        LayoutMode.prototype.getRowHeight = function() {
            this.getSegmentSize('row', 'Height');
        };
        LayoutMode.prototype.getSegmentSize = function(segment, size) {
            var segmentName = segment + size;
            var outerSize = 'outer' + size;
            this._getMeasurement(segmentName, outerSize);
            if (this[segmentName]) {
                return;
            }
            var firstItemSize = this.getFirstItemSize();
            this[segmentName] = firstItemSize && firstItemSize[outerSize] || this.isotope.size['inner' + size];
        };
        LayoutMode.prototype.getFirstItemSize = function() {
            var firstItem = this.isotope.filteredItems[0];
            return firstItem && firstItem.element && getSize(firstItem.element);
        };
        LayoutMode.prototype.layout = function() {
            this.isotope.layout.apply(this.isotope, arguments);
        };
        LayoutMode.prototype.getSize = function() {
            this.isotope.getSize();
            this.size = this.isotope.size;
        };
        LayoutMode.modes = {};
        LayoutMode.create = function(namespace, options) {
            function Mode() {
                LayoutMode.apply(this, arguments);
            }
            Mode.prototype = new LayoutMode();
            if (options) {
                Mode.options = options;
            }
            Mode.prototype.namespace = namespace;
            LayoutMode.modes[namespace] = Mode;
            return Mode;
        };
        return LayoutMode;
    }
    if (typeof define === 'function' && define.amd) {
        define('isotope/js/layout-mode', ['get-size/get-size', 'outlayer/outlayer'], layoutModeDefinition);
    } else if (typeof exports === 'object') {
        module.exports = layoutModeDefinition(require('get-size'), require('outlayer'));
    } else {
        window.Isotope = window.Isotope || {};
        window.Isotope.LayoutMode = layoutModeDefinition(window.getSize, window.Outlayer);
    }
})(window);
(function(window) {
    var indexOf = Array.prototype.indexOf ? function(items, value) {
        return items.indexOf(value);
    } : function(items, value) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item === value) {
                return i;
            }
        }
        return -1;
    };

    function masonryDefinition(Outlayer, getSize) {
        var Masonry = Outlayer.create('masonry');
        Masonry.prototype._resetLayout = function() {
            this.getSize();
            this._getMeasurement('columnWidth', 'outerWidth');
            this._getMeasurement('gutter', 'outerWidth');
            this.measureColumns();
            var i = this.cols;
            this.colYs = [];
            while (i--) {
                this.colYs.push(0);
            }
            this.maxY = 0;
        };
        Masonry.prototype.measureColumns = function() {
            this.getContainerWidth();
            if (!this.columnWidth) {
                var firstItem = this.items[0];
                var firstItemElem = firstItem && firstItem.element;
                this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || this.containerWidth;
            }
            this.columnWidth += this.gutter;
            this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth);
            this.cols = Math.max(this.cols, 1);
        };
        Masonry.prototype.getContainerWidth = function() {
            var container = this.options.isFitWidth ? this.element.parentNode : this.element;
            var size = getSize(container);
            this.containerWidth = size && size.innerWidth;
        };
        Masonry.prototype._getItemLayoutPosition = function(item) {
            item.getSize();
            var remainder = item.size.outerWidth % this.columnWidth;
            var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
            var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
            colSpan = Math.min(colSpan, this.cols);
            var colGroup = this._getColGroup(colSpan);
            var minimumY = Math.min.apply(Math, colGroup);
            var shortColIndex = indexOf(colGroup, minimumY);
            var position = {
                x: this.columnWidth * shortColIndex,
                y: minimumY
            };
            var setHeight = minimumY + item.size.outerHeight;
            var setSpan = this.cols + 1 - colGroup.length;
            for (var i = 0; i < setSpan; i++) {
                this.colYs[shortColIndex + i] = setHeight;
            }
            return position;
        };
        Masonry.prototype._getColGroup = function(colSpan) {
            if (colSpan < 2) {
                return this.colYs;
            }
            var colGroup = [];
            var groupCount = this.cols + 1 - colSpan;
            for (var i = 0; i < groupCount; i++) {
                var groupColYs = this.colYs.slice(i, i + colSpan);
                colGroup[i] = Math.max.apply(Math, groupColYs);
            }
            return colGroup;
        };
        Masonry.prototype._manageStamp = function(stamp) {
            var stampSize = getSize(stamp);
            var offset = this._getElementOffset(stamp);
            var firstX = this.options.isOriginLeft ? offset.left : offset.right;
            var lastX = firstX + stampSize.outerWidth;
            var firstCol = Math.floor(firstX / this.columnWidth);
            firstCol = Math.max(0, firstCol);
            var lastCol = Math.floor(lastX / this.columnWidth);
            lastCol -= lastX % this.columnWidth ? 0 : 1;
            lastCol = Math.min(this.cols - 1, lastCol);
            var stampMaxY = (this.options.isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
            for (var i = firstCol; i <= lastCol; i++) {
                this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
            }
        };
        Masonry.prototype._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var size = {
                height: this.maxY
            };
            if (this.options.isFitWidth) {
                size.width = this._getContainerFitWidth();
            }
            return size;
        };
        Masonry.prototype._getContainerFitWidth = function() {
            var unusedCols = 0;
            var i = this.cols;
            while (--i) {
                if (this.colYs[i] !== 0) {
                    break;
                }
                unusedCols++;
            }
            return (this.cols - unusedCols) * this.columnWidth - this.gutter;
        };
        Masonry.prototype.needsResizeLayout = function() {
            var previousWidth = this.containerWidth;
            this.getContainerWidth();
            return previousWidth !== this.containerWidth;
        };
        return Masonry;
    }
    if (typeof define === 'function' && define.amd) {
        define('masonry/masonry', ['outlayer/outlayer', 'get-size/get-size'], masonryDefinition);
    } else if (typeof exports === 'object') {
        module.exports = masonryDefinition(require('outlayer'), require('get-size'));
    } else {
        window.Masonry = masonryDefinition(window.Outlayer, window.getSize);
    }
})(window);
(function(window) {
    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }

    function masonryDefinition(LayoutMode, Masonry) {
        var MasonryMode = LayoutMode.create('masonry');
        var _getElementOffset = MasonryMode.prototype._getElementOffset;
        var layout = MasonryMode.prototype.layout;
        var _getMeasurement = MasonryMode.prototype._getMeasurement;
        extend(MasonryMode.prototype, Masonry.prototype);
        MasonryMode.prototype._getElementOffset = _getElementOffset;
        MasonryMode.prototype.layout = layout;
        MasonryMode.prototype._getMeasurement = _getMeasurement;
        var measureColumns = MasonryMode.prototype.measureColumns;
        MasonryMode.prototype.measureColumns = function() {
            this.items = this.isotope.filteredItems;
            measureColumns.call(this);
        };
        var _manageStamp = MasonryMode.prototype._manageStamp;
        MasonryMode.prototype._manageStamp = function() {
            this.options.isOriginLeft = this.isotope.options.isOriginLeft;
            this.options.isOriginTop = this.isotope.options.isOriginTop;
            _manageStamp.apply(this, arguments);
        };
        return MasonryMode;
    }
    if (typeof define === 'function' && define.amd) {
        define('isotope/js/layout-modes/masonry', ['../layout-mode', 'masonry/masonry'], masonryDefinition);
    } else if (typeof exports === 'object') {
        module.exports = masonryDefinition(require('../layout-mode'), require('masonry-layout'));
    } else {
        masonryDefinition(window.Isotope.LayoutMode, window.Masonry);
    }
})(window);
(function(window) {
    function fitRowsDefinition(LayoutMode) {
        var FitRows = LayoutMode.create('fitRows');
        FitRows.prototype._resetLayout = function() {
            this.x = 0;
            this.y = 0;
            this.maxY = 0;
            this._getMeasurement('gutter', 'outerWidth');
        };
        FitRows.prototype._getItemLayoutPosition = function(item) {
            item.getSize();
            var itemWidth = item.size.outerWidth + this.gutter;
            var containerWidth = this.isotope.size.innerWidth + this.gutter;
            if (this.x !== 0 && itemWidth + this.x > containerWidth) {
                this.x = 0;
                this.y = this.maxY;
            }
            var position = {
                x: this.x,
                y: this.y
            };
            this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
            this.x += itemWidth;
            return position;
        };
        FitRows.prototype._getContainerSize = function() {
            return {
                height: this.maxY
            };
        };
        return FitRows;
    }
    if (typeof define === 'function' && define.amd) {
        define('isotope/js/layout-modes/fit-rows', ['../layout-mode'], fitRowsDefinition);
    } else if (typeof exports === 'object') {
        module.exports = fitRowsDefinition(require('../layout-mode'));
    } else {
        fitRowsDefinition(window.Isotope.LayoutMode);
    }
})(window);
(function(window) {
    function verticalDefinition(LayoutMode) {
        var Vertical = LayoutMode.create('vertical', {
            horizontalAlignment: 0
        });
        Vertical.prototype._resetLayout = function() {
            this.y = 0;
        };
        Vertical.prototype._getItemLayoutPosition = function(item) {
            item.getSize();
            var x = (this.isotope.size.innerWidth - item.size.outerWidth) * this.options.horizontalAlignment;
            var y = this.y;
            this.y += item.size.outerHeight;
            return {
                x: x,
                y: y
            };
        };
        Vertical.prototype._getContainerSize = function() {
            return {
                height: this.y
            };
        };
        return Vertical;
    }
    if (typeof define === 'function' && define.amd) {
        define('isotope/js/layout-modes/vertical', ['../layout-mode'], verticalDefinition);
    } else if (typeof exports === 'object') {
        module.exports = verticalDefinition(require('../layout-mode'));
    } else {
        verticalDefinition(window.Isotope.LayoutMode);
    }
})(window);
(function(window) {
    var jQuery = window.jQuery;

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    }
    var trim = String.prototype.trim ? function(str) {
        return str.trim();
    } : function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    var docElem = document.documentElement;
    var getText = docElem.textContent ? function(elem) {
        return elem.textContent;
    } : function(elem) {
        return elem.innerText;
    };
    var objToString = Object.prototype.toString;

    function isArray(obj) {
        return objToString.call(obj) === '[object Array]';
    }
    var indexOf = Array.prototype.indexOf ? function(ary, obj) {
        return ary.indexOf(obj);
    } : function(ary, obj) {
        for (var i = 0, len = ary.length; i < len; i++) {
            if (ary[i] === obj) {
                return i;
            }
        }
        return -1;
    };

    function makeArray(obj) {
        var ary = [];
        if (isArray(obj)) {
            ary = obj;
        } else if (obj && typeof obj.length === 'number') {
            for (var i = 0, len = obj.length; i < len; i++) {
                ary.push(obj[i]);
            }
        } else {
            ary.push(obj);
        }
        return ary;
    }

    function removeFrom(obj, ary) {
        var index = indexOf(ary, obj);
        if (index !== -1) {
            ary.splice(index, 1);
        }
    }

    function isotopeDefinition(Outlayer, getSize, matchesSelector, Item, LayoutMode) {
        var Isotope = Outlayer.create('isotope', {
            layoutMode: "masonry",
            isJQueryFiltering: true,
            sortAscending: true
        });
        Isotope.Item = Item;
        Isotope.LayoutMode = LayoutMode;
        Isotope.prototype._create = function() {
            this.itemGUID = 0;
            this._sorters = {};
            this._getSorters();
            Outlayer.prototype._create.call(this);
            this.modes = {};
            this.filteredItems = this.items;
            this.sortHistory = ['original-order'];
            for (var name in LayoutMode.modes) {
                this._initLayoutMode(name);
            }
        };
        Isotope.prototype.reloadItems = function() {
            this.itemGUID = 0;
            Outlayer.prototype.reloadItems.call(this);
        };
        Isotope.prototype._itemize = function() {
            var items = Outlayer.prototype._itemize.apply(this, arguments);
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                item.id = this.itemGUID++;
            }
            this._updateItemsSortData(items);
            return items;
        };
        Isotope.prototype._initLayoutMode = function(name) {
            var Mode = LayoutMode.modes[name];
            var initialOpts = this.options[name] || {};
            this.options[name] = Mode.options ? extend(Mode.options, initialOpts) : initialOpts;
            this.modes[name] = new Mode(this);
        };
        Isotope.prototype.layout = function() {
            if (!this._isLayoutInited && this.options.isInitLayout) {
                this.arrange();
                return;
            }
            this._layout();
        };
        Isotope.prototype._layout = function() {
            var isInstant = this._getIsInstant();
            this._resetLayout();
            this._manageStamps();
            this.layoutItems(this.filteredItems, isInstant);
            this._isLayoutInited = true;
        };
        Isotope.prototype.arrange = function(opts) {
            this.option(opts);
            this._getIsInstant();
            var filtered = this._filter(this.items);
            this.filteredItems = filtered.matches;
            var _this = this;

            function hideReveal() {
                _this.reveal(filtered.needReveal);
                _this.hide(filtered.needHide);
            }
            if (this._isInstant) {
                this._noTransition(hideReveal);
            } else {
                hideReveal();
            }
            this._sort();
            this._layout();
        };
        Isotope.prototype._init = Isotope.prototype.arrange;
        Isotope.prototype._getIsInstant = function() {
            var isInstant = this.options.isLayoutInstant !== undefined ? this.options.isLayoutInstant : !this._isLayoutInited;
            this._isInstant = isInstant;
            return isInstant;
        };
        Isotope.prototype._filter = function(items) {
            var filter = this.options.filter;
            filter = filter || '*';
            var matches = [];
            var hiddenMatched = [];
            var visibleUnmatched = [];
            var test = this._getFilterTest(filter);
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                if (item.isIgnored) {
                    continue;
                }
                var isMatched = test(item);
                if (isMatched) {
                    matches.push(item);
                }
                if (isMatched && item.isHidden) {
                    hiddenMatched.push(item);
                } else if (!isMatched && !item.isHidden) {
                    visibleUnmatched.push(item);
                }
            }
            return {
                matches: matches,
                needReveal: hiddenMatched,
                needHide: visibleUnmatched
            };
        };
        Isotope.prototype._getFilterTest = function(filter) {
            if (jQuery && this.options.isJQueryFiltering) {
                return function(item) {
                    return jQuery(item.element).is(filter);
                };
            }
            if (typeof filter === 'function') {
                return function(item) {
                    return filter(item.element);
                };
            }
            return function(item) {
                return matchesSelector(item.element, filter);
            };
        };
        Isotope.prototype.updateSortData = function(elems) {
            var items;
            if (elems) {
                elems = makeArray(elems);
                items = this.getItems(elems);
            } else {
                items = this.items;
            }
            this._getSorters();
            this._updateItemsSortData(items);
        };
        Isotope.prototype._getSorters = function() {
            var getSortData = this.options.getSortData;
            for (var key in getSortData) {
                var sorter = getSortData[key];
                this._sorters[key] = mungeSorter(sorter);
            }
        };
        Isotope.prototype._updateItemsSortData = function(items) {
            var len = items && items.length;
            for (var i = 0; len && i < len; i++) {
                var item = items[i];
                item.updateSortData();
            }
        };
        var mungeSorter = (function() {
            function mungeSorter(sorter) {
                if (typeof sorter !== 'string') {
                    return sorter;
                }
                var args = trim(sorter).split(' ');
                var query = args[0];
                var attrMatch = query.match(/^\[(.+)\]$/);
                var attr = attrMatch && attrMatch[1];
                var getValue = getValueGetter(attr, query);
                var parser = Isotope.sortDataParsers[args[1]];
                sorter = parser ? function(elem) {
                    return elem && parser(getValue(elem));
                } : function(elem) {
                    return elem && getValue(elem);
                };
                return sorter;
            }

            function getValueGetter(attr, query) {
                var getValue;
                if (attr) {
                    getValue = function(elem) {
                        return elem.getAttribute(attr);
                    };
                } else {
                    getValue = function(elem) {
                        var child = elem.querySelector(query);
                        return child && getText(child);
                    };
                }
                return getValue;
            }
            return mungeSorter;
        })();
        Isotope.sortDataParsers = {
            'parseInt': function(val) {
                return parseInt(val, 10);
            },
            'parseFloat': function(val) {
                return parseFloat(val);
            }
        };
        Isotope.prototype._sort = function() {
            var sortByOpt = this.options.sortBy;
            if (!sortByOpt) {
                return;
            }
            var sortBys = [].concat.apply(sortByOpt, this.sortHistory);
            var itemSorter = getItemSorter(sortBys, this.options.sortAscending);
            this.filteredItems.sort(itemSorter);
            if (sortByOpt !== this.sortHistory[0]) {
                this.sortHistory.unshift(sortByOpt);
            }
        };

        function getItemSorter(sortBys, sortAsc) {
            return function sorter(itemA, itemB) {
                for (var i = 0, len = sortBys.length; i < len; i++) {
                    var sortBy = sortBys[i];
                    var a = itemA.sortData[sortBy];
                    var b = itemB.sortData[sortBy];
                    if (a > b || a < b) {
                        var isAscending = sortAsc[sortBy] !== undefined ? sortAsc[sortBy] : sortAsc;
                        var direction = isAscending ? 1 : -1;
                        return (a > b ? 1 : -1) * direction;
                    }
                }
                return 0;
            };
        }
        Isotope.prototype._mode = function() {
            var layoutMode = this.options.layoutMode;
            var mode = this.modes[layoutMode];
            if (!mode) {
                throw new Error('No layout mode: ' + layoutMode);
            }
            mode.options = this.options[layoutMode];
            return mode;
        };
        Isotope.prototype._resetLayout = function() {
            Outlayer.prototype._resetLayout.call(this);
            this._mode()._resetLayout();
        };
        Isotope.prototype._getItemLayoutPosition = function(item) {
            return this._mode()._getItemLayoutPosition(item);
        };
        Isotope.prototype._manageStamp = function(stamp) {
            this._mode()._manageStamp(stamp);
        };
        Isotope.prototype._getContainerSize = function() {
            return this._mode()._getContainerSize();
        };
        Isotope.prototype.needsResizeLayout = function() {
            return this._mode().needsResizeLayout();
        };
        Isotope.prototype.appended = function(elems) {
            var items = this.addItems(elems);
            if (!items.length) {
                return;
            }
            var filteredItems = this._filterRevealAdded(items);
            this.filteredItems = this.filteredItems.concat(filteredItems);
        };
        Isotope.prototype.prepended = function(elems) {
            var items = this._itemize(elems);
            if (!items.length) {
                return;
            }
            this._resetLayout();
            this._manageStamps();
            var filteredItems = this._filterRevealAdded(items);
            this.layoutItems(this.filteredItems);
            this.filteredItems = filteredItems.concat(this.filteredItems);
            this.items = items.concat(this.items);
        };
        Isotope.prototype._filterRevealAdded = function(items) {
            var filtered = this._filter(items);
            this.hide(filtered.needHide);
            this.reveal(filtered.matches);
            this.layoutItems(filtered.matches, true);
            return filtered.matches;
        };
        Isotope.prototype.insert = function(elems) {
            var items = this.addItems(elems);
            if (!items.length) {
                return;
            }
            var i, item;
            var len = items.length;
            for (i = 0; i < len; i++) {
                item = items[i];
                this.element.appendChild(item.element);
            }
            var filteredInsertItems = this._filter(items).matches;
            for (i = 0; i < len; i++) {
                items[i].isLayoutInstant = true;
            }
            this.arrange();
            for (i = 0; i < len; i++) {
                delete items[i].isLayoutInstant;
            }
            this.reveal(filteredInsertItems);
        };
        var _remove = Isotope.prototype.remove;
        Isotope.prototype.remove = function(elems) {
            elems = makeArray(elems);
            var removeItems = this.getItems(elems);
            _remove.call(this, elems);
            if (!removeItems || !removeItems.length) {
                return;
            }
            for (var i = 0, len = removeItems.length; i < len; i++) {
                var item = removeItems[i];
                removeFrom(item, this.filteredItems);
            }
        };
        Isotope.prototype.shuffle = function() {
            for (var i = 0, len = this.items.length; i < len; i++) {
                var item = this.items[i];
                item.sortData.random = Math.random();
            }
            this.options.sortBy = 'random';
            this._sort();
            this._layout();
        };
        Isotope.prototype._noTransition = function(fn) {
            var transitionDuration = this.options.transitionDuration;
            this.options.transitionDuration = 0;
            var returnValue = fn.call(this);
            this.options.transitionDuration = transitionDuration;
            return returnValue;
        };
        Isotope.prototype.getFilteredItemElements = function() {
            var elems = [];
            for (var i = 0, len = this.filteredItems.length; i < len; i++) {
                elems.push(this.filteredItems[i].element);
            }
            return elems;
        };
        return Isotope;
    }
    if (typeof define === 'function' && define.amd) {
        define(['outlayer/outlayer', 'get-size/get-size', 'matches-selector/matches-selector', 'isotope/js/item', 'isotope/js/layout-mode', 'isotope/js/layout-modes/masonry', 'isotope/js/layout-modes/fit-rows', 'isotope/js/layout-modes/vertical'], isotopeDefinition);
    } else if (typeof exports === 'object') {
        module.exports = isotopeDefinition(require('outlayer'), require('get-size'), require('desandro-matches-selector'), require('./item'), require('./layout-mode'), require('./layout-modes/masonry'), require('./layout-modes/fit-rows'), require('./layout-modes/vertical'));
    } else {
        window.Isotope = isotopeDefinition(window.Outlayer, window.getSize, window.matchesSelector, window.Isotope.Item, window.Isotope.LayoutMode);
    }
})(window);
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function(a) {
    var b, c, d, e, f, g, h = "Close",
        i = "BeforeClose",
        j = "AfterClose",
        k = "BeforeAppend",
        l = "MarkupParse",
        m = "Open",
        n = "Change",
        o = "mfp",
        p = "." + o,
        q = "mfp-ready",
        r = "mfp-removing",
        s = "mfp-prevent-close",
        t = function() {},
        u = !!window.jQuery,
        v = a(window),
        w = function(a, c) {
            b.ev.on(o + a + p, c)
        },
        x = function(b, c, d, e) {
            var f = document.createElement("div");
            return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
        },
        y = function(c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
        },
        z = function(c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
        },
        A = function() {
            a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
        },
        B = function() {
            var a = document.createElement("p").style,
                b = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== a.transition) return !0;
            for (; b.length;)
                if (b.pop() + "Transition" in a) return !0;
            return !1
        };
    t.prototype = {
        constructor: t,
        init: function() {
            var c = navigator.appVersion;
            b.isIE7 = -1 !== c.indexOf("MSIE 7."), b.isIE8 = -1 !== c.indexOf("MSIE 8."), b.isLowIE = b.isIE7 || b.isIE8, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
        },
        open: function(c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var g, h = c.items;
                for (e = 0; e < h.length; e++)
                    if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                        b.index = e;
                        break
                    }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], f = "", b.ev = c.mainEl && c.mainEl.length ? c.mainEl.eq(0) : d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function() {
                b.close()
            }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function(a) {
                b._checkIfClose(a.target) && b.close()
            }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
            }
            y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function(a, b, c, d) {
                c.close_replaceWith = z(d.type)
            }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.wrap.css(b.fixedContentPos ? {
                overflow: b.st.overflowY,
                overflowX: "hidden",
                overflowY: b.st.overflowY
            } : {
                top: v.scrollTop(),
                position: "absolute"
            }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                height: d.height(),
                position: "absolute"
            }), b.st.enableEscapeKey && d.on("keyup" + p, function(a) {
                27 === a.keyCode && b.close()
            }), v.on("resize" + p, function() {
                b.updateSize()
            }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
            var k = b.wH = v.height(),
                n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
            var r = b.st.mainClass;
            return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function() {
                b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
            }, 16), b.isOpen = !0, b.updateSize(k), y(m), c
        },
        close: function() {
            b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function() {
                b._close()
            }, b.st.removalDelay)) : b._close())
        },
        _close: function() {
            y(h);
            var c = r + " " + q + " ";
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                var e = {
                    marginRight: ""
                };
                b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
            }
            d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
        },
        updateSize: function(a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth,
                    d = window.innerHeight * c;
                b.wrap.css("height", d), b.wH = d
            } else b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
        },
        updateItemHTML: function() {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y("FirstMarkupParse", f), b.currTemplate[d] = f ? a(f) : !0
            }
            e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
        },
        appendContent: function(a, c) {
            b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
        },
        parseEl: function(c) {
            var d, e = b.items[c];
            if (e.tagName ? e = {
                    el: a(e)
                } : (d = e.type, e = {
                    data: e,
                    src: e.src
                }), e.el) {
                for (var f = b.types, g = 0; g < f.length; g++)
                    if (e.el.hasClass("mfp-" + f[g])) {
                        d = f[g];
                        break
                    }
                e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
            }
            return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
        },
        addGroup: function(a, c) {
            var d = function(d) {
                d.mfpEl = this, b._openClick(d, a, c)
            };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
        },
        _openClick: function(c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || 2 !== c.which && !c.ctrlKey && !c.metaKey) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) {
                        if (!g.call(b)) return !0
                    } else if (v.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
            }
        },
        updateStatus: function(a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                var e = {
                    status: a,
                    text: d
                };
                y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function(a) {
                    a.stopImmediatePropagation()
                }), b.container.addClass("mfp-s-" + a), c = a
            }
        },
        _checkIfClose: function(c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick,
                    e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d) return !0
                } else if (e && a.contains(document, c)) return !0;
                return !1
            }
        },
        _addClassToMFP: function(a) {
            b.bgOverlay.addClass(a), b.wrap.addClass(a)
        },
        _removeClassFromMFP: function(a) {
            this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
        },
        _hasScrollBar: function(a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
        },
        _setFocus: function() {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        },
        _onFocusIn: function(c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
        },
        _parseMarkup: function(b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function(a, c) {
                if (void 0 === c || c === !1) return !0;
                if (e = a.split("_"), e.length > 1) {
                    var d = b.find(p + "-" + e[0]);
                    if (d.length > 0) {
                        var f = e[1];
                        "replaceWith" === f ? d[0] !== c[0] && d.replaceWith(c) : "img" === f ? d.is("img") ? d.attr("src", c) : d.replaceWith('<img src="' + c + '" class="' + d.attr("class") + '" />') : d.attr(e[1], c)
                    }
                } else b.find(p + "-" + a).html(c)
            })
        },
        _getScrollbarSize: function() {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    }, a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function(b, c) {
            return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
        },
        close: function() {
            return a.magnificPopup.instance && a.magnificPopup.instance.close()
        },
        registerModule: function(b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading..."
        }
    }, a.fn.magnificPopup = function(c) {
        A();
        var d = a(this);
        if ("string" == typeof c)
            if ("open" === c) {
                var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup,
                    g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({
                    mfpEl: e
                }, d, f)
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d
    };
    var C, D, E, F = "inline",
        G = function() {
            E && (D.after(E.addClass(C)).detach(), E = null)
        };
    a.magnificPopup.registerModule(F, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                b.types.push(F), w(h + "." + F, function() {
                    G()
                })
            },
            getInline: function(c, d) {
                if (G(), c.src) {
                    var e = b.st.inline,
                        f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
                    } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                    return c.inlineElement = f, f
                }
                return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
            }
        }
    });
    var H, I = "ajax",
        J = function() {
            H && a(document.body).removeClass(H)
        },
        K = function() {
            J(), b.req && b.req.abort()
        };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
            },
            getAjax: function(c) {
                H && a(document.body).addClass(H), b.updateStatus("loading");
                var d = a.extend({
                    url: c.src,
                    success: function(d, e, f) {
                        var g = {
                            data: d,
                            xhr: f
                        };
                        y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function() {
                            b.wrap.addClass(q)
                        }, 16), b.updateStatus("ready"), y("AjaxContentAdded")
                    },
                    error: function() {
                        J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d), ""
            }
        }
    });
    var L, M = function(c) {
        if (c.data && void 0 !== c.data.title) return c.data.title;
        var d = b.st.image.titleSrc;
        if (d) {
            if (a.isFunction(d)) return d.call(b, c);
            if (c.el) return c.el.attr(d) || ""
        }
        return ""
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var c = b.st.image,
                    d = ".image";
                b.types.push("image"), w(m + d, function() {
                    "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                }), w(h + d, function() {
                    c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
                }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
            },
            resizeImage: function() {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                }
            },
            _onImageHasSize: function(a) {
                a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
            },
            findImageSize: function(a) {
                var c = 0,
                    d = a.img[0],
                    e = function(f) {
                        L && clearInterval(L), L = setInterval(function() {
                            return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                        }, f)
                    };
                e(1)
            },
            getImage: function(c, d) {
                var e = 0,
                    f = function() {
                        c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g()))
                    },
                    g = function() {
                        c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
                    },
                    h = b.st.image,
                    i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                }
                return b._parseMarkup(d, {
                    title: M(c),
                    img_replaceWith: c.img
                }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
            }
        }
    });
    var N, O = function() {
        return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(a) {
                return a.is("img") ? a : a.find("img")
            }
        },
        proto: {
            initZoom: function() {
                var a, c = b.st.zoom,
                    d = ".zoom";
                if (c.enabled && b.supportsTransition) {
                    var e, f, g = c.duration,
                        j = function(a) {
                            var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                d = "all " + c.duration / 1e3 + "s " + c.easing,
                                e = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                f = "transition";
                            return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
                        },
                        k = function() {
                            b.content.css("visibility", "visible")
                        };
                    w("BuildControls" + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
                            f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function() {
                                f.css(b._getOffset(!0)), e = setTimeout(function() {
                                    k(), setTimeout(function() {
                                        f.remove(), a = f = null, y("ZoomAnimationEnded")
                                    }, 16)
                                }, g)
                            }, 16)
                        }
                    }), w(i + d, function() {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                if (a = b._getItemToZoom(), !a) return;
                                f = j(a)
                            }
                            f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function() {
                                f.css(b._getOffset())
                            }, 16)
                        }
                    }), w(h + d, function() {
                        b._allowZoom() && (k(), f && f.remove(), a = null)
                    })
                }
            },
            _allowZoom: function() {
                return "image" === b.currItem.type
            },
            _getItemToZoom: function() {
                return b.currItem.hasSize ? b.currItem.img : !1
            },
            _getOffset: function(c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(),
                    f = parseInt(d.css("padding-top"), 10),
                    g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = {
                    width: d.width(),
                    height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                };
                return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
            }
        }
    });
    var P = "iframe",
        Q = "//about:blank",
        R = function(a) {
            if (b.currTemplate[P]) {
                var c = b.currTemplate[P].find("iframe");
                c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
            }
        };
    a.magnificPopup.registerModule(P, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                b.types.push(P), w("BeforeChange", function(a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0))
                }), w(h + "." + P, function() {
                    R()
                })
            },
            getIframe: function(c, d) {
                var e = c.src,
                    f = b.st.iframe;
                a.each(f.patterns, function() {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
            }
        }
    });
    var S = function(a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a
        },
        T = function(a, b, c) {
            return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
        };
    a.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var c = b.st.gallery,
                    e = ".mfp-gallery",
                    g = Boolean(a.fn.mfpFastClick);
                return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function() {
                    c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function() {
                        return b.items.length > 1 ? (b.next(), !1) : void 0
                    }), d.on("keydown" + e, function(a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                    })
                }), w("UpdateStatus" + e, function(a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                }), w(l + e, function(a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                }), w("BuildControls" + e, function() {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                            f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s),
                            h = g ? "mfpFastClick" : "click";
                        e[h](function() {
                            b.prev()
                        }), f[h](function() {
                            b.next()
                        }), b.isIE7 && (x("b", e[0], !1, !0), x("a", e[0], !1, !0), x("b", f[0], !1, !0), x("a", f[0], !1, !0)), b.container.append(e.add(f))
                    }
                }), w(n + e, function() {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function() {
                        b.preloadNearbyImages(), b._preloadTimeout = null
                    }, 16)
                }), void w(h + e, function() {
                    d.off(e), b.wrap.off("click" + e), b.arrowLeft && g && b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(), b.arrowRight = b.arrowLeft = null
                })) : !1
            },
            next: function() {
                b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
            },
            prev: function() {
                b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
            },
            goTo: function(a) {
                b.direction = a >= b.index, b.index = a, b.updateItemHTML()
            },
            preloadNearbyImages: function() {
                var a, c = b.st.gallery.preload,
                    d = Math.min(c[0], b.items.length),
                    e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
            },
            _preloadItem: function(c) {
                if (c = S(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function() {
                        d.hasSize = !0
                    }).on("error.mfploader", function() {
                        d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
                    }).attr("src", d.src)), d.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    a.magnificPopup.registerModule(U, {
            options: {
                replaceSrc: function(a) {
                    return a.src.replace(/\.\w+$/, function(a) {
                        return "@2x" + a
                    })
                },
                ratio: 1
            },
            proto: {
                initRetina: function() {
                    if (window.devicePixelRatio > 1) {
                        var a = b.st.retina,
                            c = a.ratio;
                        c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function(a, b) {
                            b.img.css({
                                "max-width": b.img[0].naturalWidth / c,
                                width: "100%"
                            })
                        }), w("ElementParse." + U, function(b, d) {
                            d.src = a.replaceSrc(d, c)
                        }))
                    }
                }
            }
        }),
        function() {
            var b = 1e3,
                c = "ontouchstart" in window,
                d = function() {
                    v.off("touchmove" + f + " touchend" + f)
                },
                e = "mfpFastClick",
                f = "." + e;
            a.fn.mfpFastClick = function(e) {
                return a(this).each(function() {
                    var g, h = a(this);
                    if (c) {
                        var i, j, k, l, m, n;
                        h.on("touchstart" + f, function(a) {
                            l = !1, n = 1, m = a.originalEvent ? a.originalEvent.touches[0] : a.touches[0], j = m.clientX, k = m.clientY, v.on("touchmove" + f, function(a) {
                                m = a.originalEvent ? a.originalEvent.touches : a.touches, n = m.length, m = m[0], (Math.abs(m.clientX - j) > 10 || Math.abs(m.clientY - k) > 10) && (l = !0, d())
                            }).on("touchend" + f, function(a) {
                                d(), l || n > 1 || (g = !0, a.preventDefault(), clearTimeout(i), i = setTimeout(function() {
                                    g = !1
                                }, b), e())
                            })
                        })
                    }
                    h.on("click" + f, function() {
                        g || e()
                    })
                })
            }, a.fn.destroyMfpFastClick = function() {
                a(this).off("touchstart" + f + " click" + f), c && v.off("touchmove" + f + " touchend" + f)
            }
        }(), A()
});;
(function(g, i, j, b) {
    var h = "sharrre",
        f = {
            className: "sharrre",
            share: {
                googlePlus: false,
                facebook: false,
                twitter: false,
                digg: false,
                delicious: false,
                stumbleupon: false,
                linkedin: false,
                pinterest: false
            },
            shareTotal: 0,
            template: "",
            title: "",
            url: j.location.href,
            text: j.title,
            urlCurl: "sharrre.php",
            count: {},
            total: 0,
            shorterTotal: true,
            enableHover: true,
            enableCounter: true,
            enableTracking: false,
            hover: function() {},
            hide: function() {},
            click: function() {},
            render: function() {},
            buttons: {
                googlePlus: {
                    url: "",
                    urlCount: false,
                    size: "medium",
                    lang: "en-US",
                    annotation: ""
                },
                facebook: {
                    url: "",
                    urlCount: false,
                    action: "like",
                    layout: "button_count",
                    width: "",
                    send: "false",
                    faces: "false",
                    colorscheme: "",
                    font: "",
                    lang: "en_US"
                },
                twitter: {
                    url: "",
                    urlCount: false,
                    count: "horizontal",
                    hashtags: "",
                    via: "",
                    related: "",
                    lang: "en"
                },
                digg: {
                    url: "",
                    urlCount: false,
                    type: "DiggCompact"
                },
                delicious: {
                    url: "",
                    urlCount: false,
                    size: "medium"
                },
                stumbleupon: {
                    url: "",
                    urlCount: false,
                    layout: "1"
                },
                linkedin: {
                    url: "",
                    urlCount: false,
                    counter: ""
                },
                pinterest: {
                    url: "",
                    media: "",
                    description: "",
                    layout: "horizontal"
                }
            }
        },
        c = {
            googlePlus: "",
            facebook: "https://graph.facebook.com/fql?q=SELECT%20url,%20normalized_url,%20share_count,%20like_count,%20comment_count,%20total_count,commentsbox_count,%20comments_fbid,%20click_count%20FROM%20link_stat%20WHERE%20url=%27{url}%27&callback=?",
            twitter: "http://cdn.api.twitter.com/1/urls/count.json?url={url}&callback=?",
            digg: "http://services.digg.com/2.0/story.getInfo?links={url}&type=javascript&callback=?",
            delicious: "http://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?",
            stumbleupon: "",
            linkedin: "http://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",
            pinterest: "http://api.pinterest.com/v1/urls/count.json?url={url}&callback=?"
        },
        l = {
            googlePlus: function(m) {
                var n = m.options.buttons.googlePlus;
                g(m.element).find(".buttons").append('<div class="button googleplus"><div class="g-plusone" data-size="' + n.size + '" data-href="' + (n.url !== "" ? n.url : m.options.url) + '" data-annotation="' + n.annotation + '"></div></div>');
                i.___gcfg = {
                    lang: m.options.buttons.googlePlus.lang
                };
                var o = 0;
                if (typeof gapi === "undefined" && o == 0) {
                    o = 1;
                    (function() {
                        var p = j.createElement("script");
                        p.type = "text/javascript";
                        p.async = true;
                        p.src = "//apis.google.com/js/plusone.js";
                        var q = j.getElementsByTagName("script")[0];
                        q.parentNode.insertBefore(p, q)
                    })()
                } else {
                    gapi.plusone.go()
                }
            },
            facebook: function(m) {
                var n = m.options.buttons.facebook;
                g(m.element).find(".buttons").append('<div class="button facebook"><div id="fb-root"></div><div class="fb-like" data-href="' + (n.url !== "" ? n.url : m.options.url) + '" data-send="' + n.send + '" data-layout="' + n.layout + '" data-width="' + n.width + '" data-show-faces="' + n.faces + '" data-action="' + n.action + '" data-colorscheme="' + n.colorscheme + '" data-font="' + n.font + '" data-via="' + n.via + '"></div></div>');
                var o = 0;
                if (typeof FB === "undefined" && o == 0) {
                    o = 1;
                    (function(t, p, u) {
                        var r, q = t.getElementsByTagName(p)[0];
                        if (t.getElementById(u)) {
                            return
                        }
                        r = t.createElement(p);
                        r.id = u;
                        r.src = "//connect.facebook.net/" + n.lang + "/all.js#xfbml=1";
                        q.parentNode.insertBefore(r, q)
                    }(j, "script", "facebook-jssdk"))
                } else {
                    FB.XFBML.parse()
                }
            },
            twitter: function(m) {
                var n = m.options.buttons.twitter;
                g(m.element).find(".buttons").append('<div class="button twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="' + (n.url !== "" ? n.url : m.options.url) + '" data-count="' + n.count + '" data-text="' + m.options.text + '" data-via="' + n.via + '" data-hashtags="' + n.hashtags + '" data-related="' + n.related + '" data-lang="' + n.lang + '">Tweet</a></div>');
                var o = 0;
                if (typeof twttr === "undefined" && o == 0) {
                    o = 1;
                    (function() {
                        var q = j.createElement("script");
                        q.type = "text/javascript";
                        q.async = true;
                        q.src = "//platform.twitter.com/widgets.js";
                        var p = j.getElementsByTagName("script")[0];
                        p.parentNode.insertBefore(q, p)
                    })()
                } else {
                    g.ajax({
                        url: "//platform.twitter.com/widgets.js",
                        dataType: "script",
                        cache: true
                    })
                }
            },
            digg: function(m) {
                var n = m.options.buttons.digg;
                g(m.element).find(".buttons").append('<div class="button digg"><a class="DiggThisButton ' + n.type + '" rel="nofollow external" href="http://digg.com/submit?url=' + encodeURIComponent((n.url !== "" ? n.url : m.options.url)) + '"></a></div>');
                var o = 0;
                if (typeof __DBW === "undefined" && o == 0) {
                    o = 1;
                    (function() {
                        var q = j.createElement("SCRIPT"),
                            p = j.getElementsByTagName("SCRIPT")[0];
                        q.type = "text/javascript";
                        q.async = true;
                        q.src = "//widgets.digg.com/buttons.js";
                        p.parentNode.insertBefore(q, p)
                    })()
                }
            },
            delicious: function(o) {
                if (o.options.buttons.delicious.size == "tall") {
                    var p = "width:50px;",
                        n = "height:35px;width:50px;font-size:15px;line-height:35px;",
                        m = "height:18px;line-height:18px;margin-top:3px;"
                } else {
                    var p = "width:93px;",
                        n = "float:right;padding:0 3px;height:20px;width:26px;line-height:20px;",
                        m = "float:left;height:20px;line-height:20px;"
                }
                var q = o.shorterTotal(o.options.count.delicious);
                if (typeof q === "undefined") {
                    q = 0
                }
                g(o.element).find(".buttons").append('<div class="button delicious"><div style="' + p + 'font:12px Arial,Helvetica,sans-serif;cursor:pointer;color:#666666;display:inline-block;float:none;height:20px;line-height:normal;margin:0;padding:0;text-indent:0;vertical-align:baseline;"><div style="' + n + 'background-color:#fff;margin-bottom:5px;overflow:hidden;text-align:center;border:1px solid #ccc;border-radius:3px;">' + q + '</div><div style="' + m + 'display:block;padding:0;text-align:center;text-decoration:none;width:50px;background-color:#7EACEE;border:1px solid #40679C;border-radius:3px;color:#fff;"><img src="http://www.delicious.com/static/img/delicious.small.gif" height="10" width="10" alt="Delicious" /> Add</div></div></div>');
                g(o.element).find(".delicious").on("click", function() {
                    o.openPopup("delicious")
                })
            },
            stumbleupon: function(m) {
                var n = m.options.buttons.stumbleupon;
                g(m.element).find(".buttons").append('<div class="button stumbleupon"><su:badge layout="' + n.layout + '" location="' + (n.url !== "" ? n.url : m.options.url) + '"></su:badge></div>');
                var o = 0;
                if (typeof STMBLPN === "undefined" && o == 0) {
                    o = 1;
                    (function() {
                        var p = j.createElement("script");
                        p.type = "text/javascript";
                        p.async = true;
                        p.src = "//platform.stumbleupon.com/1/widgets.js";
                        var q = j.getElementsByTagName("script")[0];
                        q.parentNode.insertBefore(p, q)
                    })();
                    s = i.setTimeout(function() {
                        if (typeof STMBLPN !== "undefined") {
                            STMBLPN.processWidgets();
                            clearInterval(s)
                        }
                    }, 500)
                } else {
                    STMBLPN.processWidgets()
                }
            },
            linkedin: function(m) {
                var n = m.options.buttons.linkedin;
                g(m.element).find(".buttons").append('<div class="button linkedin"><script type="in/share" data-url="' + (n.url !== "" ? n.url : m.options.url) + '" data-counter="' + n.counter + '"><\/script></div>');
                var o = 0;
                if (typeof i.IN === "undefined" && o == 0) {
                    o = 1;
                    (function() {
                        var p = j.createElement("script");
                        p.type = "text/javascript";
                        p.async = true;
                        p.src = "//platform.linkedin.com/in.js";
                        var q = j.getElementsByTagName("script")[0];
                        q.parentNode.insertBefore(p, q)
                    })()
                } else {
                    i.IN.init()
                }
            },
            pinterest: function(m) {
                var n = m.options.buttons.pinterest;
                g(m.element).find(".buttons").append('<div class="button pinterest"><a href="http://pinterest.com/pin/create/button/?url=' + (n.url !== "" ? n.url : m.options.url) + "&media=" + n.media + "&description=" + n.description + '" class="pin-it-button" count-layout="' + n.layout + '">Pin It</a></div>');
                (function() {
                    var o = j.createElement("script");
                    o.type = "text/javascript";
                    o.async = true;
                    o.src = "//assets.pinterest.com/js/pinit.js";
                    var p = j.getElementsByTagName("script")[0];
                    p.parentNode.insertBefore(o, p)
                })()
            }
        },
        d = {
            googlePlus: function() {},
            facebook: function() {
                fb = i.setInterval(function() {
                    if (typeof FB !== "undefined") {
                        FB.Event.subscribe("edge.create", function(m) {
                            _gaq.push(["_trackSocial", "facebook", "like", m])
                        });
                        FB.Event.subscribe("edge.remove", function(m) {
                            _gaq.push(["_trackSocial", "facebook", "unlike", m])
                        });
                        FB.Event.subscribe("message.send", function(m) {
                            _gaq.push(["_trackSocial", "facebook", "send", m])
                        });
                        clearInterval(fb)
                    }
                }, 1000)
            },
            twitter: function() {
                tw = i.setInterval(function() {
                    if (typeof twttr !== "undefined") {
                        twttr.events.bind("tweet", function(m) {
                            if (m) {
                                _gaq.push(["_trackSocial", "twitter", "tweet"])
                            }
                        });
                        clearInterval(tw)
                    }
                }, 1000)
            },
            digg: function() {},
            delicious: function() {},
            stumbleupon: function() {},
            linkedin: function() {
                function m() {
                    _gaq.push(["_trackSocial", "linkedin", "share"])
                }
            },
            pinterest: function() {}
        },
        a = {
            googlePlus: function(m) {
                i.open("https://plus.google.com/share?hl=" + m.buttons.googlePlus.lang + "&url=" + encodeURIComponent((m.buttons.googlePlus.url !== "" ? m.buttons.googlePlus.url : m.url)), "", "toolbar=0, status=0, width=900, height=500")
            },
            facebook: function(m) {
                i.open("http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent((m.buttons.facebook.url !== "" ? m.buttons.facebook.url : m.url)) + "&t=" + m.text + "", "", "toolbar=0, status=0, width=900, height=500")
            },
            twitter: function(m) {
                i.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(m.text) + "&url=" + encodeURIComponent((m.buttons.twitter.url !== "" ? m.buttons.twitter.url : m.url)) + (m.buttons.twitter.via !== "" ? "&via=" + m.buttons.twitter.via : ""), "", "toolbar=0, status=0, width=650, height=360")
            },
            digg: function(m) {
                i.open("http://digg.com/tools/diggthis/submit?url=" + encodeURIComponent((m.buttons.digg.url !== "" ? m.buttons.digg.url : m.url)) + "&title=" + m.text + "&related=true&style=true", "", "toolbar=0, status=0, width=650, height=360")
            },
            delicious: function(m) {
                i.open("http://www.delicious.com/save?v=5&noui&jump=close&url=" + encodeURIComponent((m.buttons.delicious.url !== "" ? m.buttons.delicious.url : m.url)) + "&title=" + m.text, "delicious", "toolbar=no,width=550,height=550")
            },
            stumbleupon: function(m) {
                i.open("http://www.stumbleupon.com/badge/?url=" + encodeURIComponent((m.buttons.delicious.url !== "" ? m.buttons.delicious.url : m.url)), "stumbleupon", "toolbar=no,width=550,height=550")
            },
            linkedin: function(m) {
                i.open("https://www.linkedin.com/cws/share?url=" + encodeURIComponent((m.buttons.delicious.url !== "" ? m.buttons.delicious.url : m.url)) + "&token=&isFramed=true", "linkedin", "toolbar=no,width=550,height=550")
            },
            pinterest: function(m) {
                i.open("http://pinterest.com/pin/create/button/?url=" + encodeURIComponent((m.buttons.pinterest.url !== "" ? m.buttons.pinterest.url : m.url)) + "&media=" + encodeURIComponent(m.buttons.pinterest.media) + "&description=" + m.buttons.pinterest.description, "pinterest", "toolbar=no,width=700,height=300")
            }
        };

    function k(n, m) {
        this.element = n;
        this.options = g.extend(true, {}, f, m);
        this.options.share = m.share;
        this._defaults = f;
        this._name = h;
        this.init()
    }
    k.prototype.init = function() {
        var m = this;
        if (this.options.urlCurl !== "") {
            c.googlePlus = this.options.urlCurl + "?url={url}&type=googlePlus";
            c.stumbleupon = this.options.urlCurl + "?url={url}&type=stumbleupon"
        }
        g(this.element).addClass(this.options.className);
        if (typeof g(this.element).data("title") !== "undefined") {
            this.options.title = g(this.element).attr("data-title")
        }
        if (typeof g(this.element).data("url") !== "undefined") {
            this.options.url = g(this.element).data("url")
        }
        if (typeof g(this.element).data("text") !== "undefined") {
            this.options.text = g(this.element).data("text")
        }
        g.each(this.options.share, function(n, o) {
            if (o === true) {
                m.options.shareTotal++
            }
        });
        if (m.options.enableCounter === true) {
            g.each(this.options.share, function(n, p) {
                if (p === true) {
                    try {
                        m.getSocialJson(n)
                    } catch (o) {}
                }
            })
        } else {
            if (m.options.template !== "") {
                this.options.render(this, this.options)
            } else {
                this.loadButtons()
            }
        }
        g(this.element).hover(function() {
            if (g(this).find(".buttons").length === 0 && m.options.enableHover === true) {
                m.loadButtons()
            }
            m.options.hover(m, m.options)
        }, function() {
            m.options.hide(m, m.options)
        });
        g(this.element).click(function() {
            m.options.click(m, m.options);
            return false
        })
    };
    k.prototype.loadButtons = function() {
        var m = this;
        g(this.element).append('<div class="buttons"></div>');
        g.each(m.options.share, function(n, o) {
            if (o == true) {
                l[n](m);
                if (m.options.enableTracking === true) {
                    d[n]()
                }
            }
        })
    };
    k.prototype.getSocialJson = function(o) {
        var m = this,
            p = 0,
            n = c[o].replace("{url}", encodeURIComponent(this.options.url));
        if (this.options.buttons[o].urlCount === true && this.options.buttons[o].url !== "") {
            n = c[o].replace("{url}", this.options.buttons[o].url)
        }
        if (n != "" && m.options.urlCurl !== "") {
            g.getJSON(n, function(r) {
                if (typeof r.count !== "undefined") {
                    var q = r.count + "";
                    q = q.replace("\u00c2\u00a0", "");
                    p += parseInt(q, 10)
                } else {
                    if (r.data && r.data.length > 0 && typeof r.data[0].total_count !== "undefined") {
                        p += parseInt(r.data[0].total_count, 10)
                    } else {
                        if (typeof r[0] !== "undefined") {
                            p += parseInt(r[0].total_posts, 10)
                        } else {
                            if (typeof r[0] !== "undefined") {}
                        }
                    }
                }
                m.options.count[o] = p;
                m.options.total += p;
                m.renderer();
                m.rendererPerso()
            }).error(function() {
                m.options.count[o] = 0;
                m.rendererPerso()
            })
        } else {
            m.renderer();
            m.options.count[o] = 0;
            m.rendererPerso()
        }
    };
    k.prototype.rendererPerso = function() {
        var m = 0;
        for (e in this.options.count) {
            m++
        }
        if (m === this.options.shareTotal) {
            this.options.render(this, this.options)
        }
    };
    k.prototype.renderer = function() {
        var n = this.options.total,
            m = this.options.template;
        if (this.options.shorterTotal === true) {
            n = this.shorterTotal(n)
        }
        if (m !== "") {
            m = m.replace("{total}", n);
            g(this.element).html(m)
        } else {
            g(this.element).html('<div class="box"><a class="count" href="#">' + n + "</a>" + (this.options.title !== "" ? '<a class="share" href="#">' + this.options.title + "</a>" : "") + "</div>")
        }
    };
    k.prototype.shorterTotal = function(m) {
        if (m >= 1000000) {
            m = (m / 1000000).toFixed(2) + "M"
        } else {
            if (m >= 1000) {
                m = (m / 1000).toFixed(1) + "k"
            }
        }
        return m
    };
    k.prototype.openPopup = function(m) {
        a[m](this.options);
        if (this.options.enableTracking === true) {
            var n = {
                googlePlus: {
                    site: "Google",
                    action: "+1"
                },
                facebook: {
                    site: "facebook",
                    action: "like"
                },
                twitter: {
                    site: "twitter",
                    action: "tweet"
                },
                digg: {
                    site: "digg",
                    action: "add"
                },
                delicious: {
                    site: "delicious",
                    action: "add"
                },
                stumbleupon: {
                    site: "stumbleupon",
                    action: "add"
                },
                linkedin: {
                    site: "linkedin",
                    action: "share"
                },
                pinterest: {
                    site: "pinterest",
                    action: "pin"
                }
            };
            _gaq.push(["_trackSocial", n[m].site, n[m].action])
        }
    };
    k.prototype.simulateClick = function() {
        var m = g(this.element).html();
        g(this.element).html(m.replace(this.options.total, this.options.total + 1))
    };
    k.prototype.update = function(m, n) {
        if (m !== "") {
            this.options.url = m
        }
        if (n !== "") {
            this.options.text = n
        }
    };
    g.fn[h] = function(n) {
        var m = arguments;
        if (n === b || typeof n === "object") {
            return this.each(function() {
                if (!g.data(this, "plugin_" + h)) {
                    g.data(this, "plugin_" + h, new k(this, n))
                }
            })
        } else {
            if (typeof n === "string" && n[0] !== "_" && n !== "init") {
                return this.each(function() {
                    var o = g.data(this, "plugin_" + h);
                    if (o instanceof k && typeof o[n] === "function") {
                        o[n].apply(o, Array.prototype.slice.call(m, 1))
                    }
                })
            }
        }
    }
})(jQuery, window, document);;
(function($, window, document, undefined) {
    var pluginName = 'stellar',
        defaults = {
            scrollProperty: 'scroll',
            positionProperty: 'position',
            horizontalScrolling: true,
            verticalScrolling: true,
            horizontalOffset: 0,
            verticalOffset: 0,
            responsive: false,
            parallaxBackgrounds: true,
            parallaxElements: true,
            hideDistantElements: true,
            hideElement: function($elem) {
                $elem.hide();
            },
            showElement: function($elem) {
                $elem.show();
            }
        },
        scrollProperty = {
            scroll: {
                getLeft: function($elem) {
                    return $elem.scrollLeft();
                },
                setLeft: function($elem, val) {
                    $elem.scrollLeft(val);
                },
                getTop: function($elem) {
                    return $elem.scrollTop();
                },
                setTop: function($elem, val) {
                    $elem.scrollTop(val);
                }
            },
            position: {
                getLeft: function($elem) {
                    return parseInt($elem.css('left'), 10) * -1;
                },
                getTop: function($elem) {
                    return parseInt($elem.css('top'), 10) * -1;
                }
            },
            margin: {
                getLeft: function($elem) {
                    return parseInt($elem.css('margin-left'), 10) * -1;
                },
                getTop: function($elem) {
                    return parseInt($elem.css('margin-top'), 10) * -1;
                }
            },
            transform: {
                getLeft: function($elem) {
                    var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
                    return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[4], 10) * -1 : 0);
                },
                getTop: function($elem) {
                    var computedTransform = getComputedStyle($elem[0])[prefixedTransform];
                    return (computedTransform !== 'none' ? parseInt(computedTransform.match(/(-?[0-9]+)/g)[5], 10) * -1 : 0);
                }
            }
        },
        positionProperty = {
            position: {
                setLeft: function($elem, left) {
                    $elem.css('left', left);
                },
                setTop: function($elem, top) {
                    $elem.css('top', top);
                }
            },
            transform: {
                setPosition: function($elem, left, startingLeft, top, startingTop) {
                    $elem[0].style[prefixedTransform] = 'translate3d(' + (left - startingLeft) + 'px, ' + (top - startingTop) + 'px, 0)';
                }
            }
        },
        vendorPrefix = (function() {
            var prefixes = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
                style = $('script')[0].style,
                prefix = '',
                prop;
            for (prop in style) {
                if (prefixes.test(prop)) {
                    prefix = prop.match(prefixes)[0];
                    break;
                }
            }
            if ('WebkitOpacity' in style) {
                prefix = 'Webkit';
            }
            if ('KhtmlOpacity' in style) {
                prefix = 'Khtml';
            }
            return function(property) {
                return prefix + (prefix.length > 0 ? property.charAt(0).toUpperCase() + property.slice(1) : property);
            };
        }()),
        prefixedTransform = vendorPrefix('transform'),
        supportsBackgroundPositionXY = $('<div />', {
            style: 'background:#fff'
        }).css('background-position-x') !== undefined,
        setBackgroundPosition = (supportsBackgroundPositionXY ? function($elem, x, y) {
            $elem.css({
                'background-position-x': x,
                'background-position-y': y
            });
        } : function($elem, x, y) {
            $elem.css('background-position', x + ' ' + y);
        }),
        getBackgroundPosition = (supportsBackgroundPositionXY ? function($elem) {
            return [$elem.css('background-position-x'), $elem.css('background-position-y')];
        } : function($elem) {
            return $elem.css('background-position').split(' ');
        }),
        requestAnimFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            setTimeout(callback, 1000 / 60);
        });

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            this.options.name = pluginName + '_' + Math.floor(Math.random() * 1e9);
            this._defineElements();
            this._defineGetters();
            this._defineSetters();
            this._handleWindowLoadAndResize();
            this._detectViewport();
            this.refresh({
                firstLoad: true
            });
            if (this.options.scrollProperty === 'scroll') {
                this._handleScrollEvent();
            } else {
                this._startAnimationLoop();
            }
        },
        _defineElements: function() {
            if (this.element === document.body) this.element = window;
            this.$scrollElement = $(this.element);
            this.$element = (this.element === window ? $('body') : this.$scrollElement);
            this.$viewportElement = (this.options.viewportElement !== undefined ? $(this.options.viewportElement) : (this.$scrollElement[0] === window || this.options.scrollProperty === 'scroll' ? this.$scrollElement : this.$scrollElement.parent()));
        },
        _defineGetters: function() {
            var self = this,
                scrollPropertyAdapter = scrollProperty[self.options.scrollProperty];
            this._getScrollLeft = function() {
                return scrollPropertyAdapter.getLeft(self.$scrollElement);
            };
            this._getScrollTop = function() {
                return scrollPropertyAdapter.getTop(self.$scrollElement);
            };
        },
        _defineSetters: function() {
            var self = this,
                scrollPropertyAdapter = scrollProperty[self.options.scrollProperty],
                positionPropertyAdapter = positionProperty[self.options.positionProperty],
                setScrollLeft = scrollPropertyAdapter.setLeft,
                setScrollTop = scrollPropertyAdapter.setTop;
            this._setScrollLeft = (typeof setScrollLeft === 'function' ? function(val) {
                setScrollLeft(self.$scrollElement, val);
            } : $.noop);
            this._setScrollTop = (typeof setScrollTop === 'function' ? function(val) {
                setScrollTop(self.$scrollElement, val);
            } : $.noop);
            this._setPosition = positionPropertyAdapter.setPosition || function($elem, left, startingLeft, top, startingTop) {
                if (self.options.horizontalScrolling) {
                    positionPropertyAdapter.setLeft($elem, left, startingLeft);
                }
                if (self.options.verticalScrolling) {
                    positionPropertyAdapter.setTop($elem, top, startingTop);
                }
            };
        },
        _handleWindowLoadAndResize: function() {
            var self = this,
                $window = $(window);
            if (self.options.responsive) {
                $window.bind('load.' + this.name, function() {
                    self.refresh();
                });
            }
            $window.bind('resize.' + this.name, function() {
                self._detectViewport();
                if (self.options.responsive) {
                    self.refresh();
                }
            });
        },
        refresh: function(options) {
            var self = this,
                oldLeft = self._getScrollLeft(),
                oldTop = self._getScrollTop();
            if (!options || !options.firstLoad) {
                this._reset();
            }
            this._setScrollLeft(0);
            this._setScrollTop(0);
            this._setOffsets();
            this._findParticles();
            this._findBackgrounds();
            if (options && options.firstLoad && /WebKit/.test(navigator.userAgent)) {
                $(window).load(function() {
                    var oldLeft = self._getScrollLeft(),
                        oldTop = self._getScrollTop();
                    self._setScrollLeft(oldLeft + 1);
                    self._setScrollTop(oldTop + 1);
                    self._setScrollLeft(oldLeft);
                    self._setScrollTop(oldTop);
                });
            }
            this._setScrollLeft(oldLeft);
            this._setScrollTop(oldTop);
        },
        _detectViewport: function() {
            var viewportOffsets = this.$viewportElement.offset(),
                hasOffsets = viewportOffsets !== null && viewportOffsets !== undefined;
            this.viewportWidth = this.$viewportElement.width();
            this.viewportHeight = this.$viewportElement.height();
            this.viewportOffsetTop = (hasOffsets ? viewportOffsets.top : 0);
            this.viewportOffsetLeft = (hasOffsets ? viewportOffsets.left : 0);
        },
        _findParticles: function() {
            var self = this,
                scrollLeft = this._getScrollLeft(),
                scrollTop = this._getScrollTop();
            if (this.particles !== undefined) {
                for (var i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i].$element.data('stellar-elementIsActive', undefined);
                }
            }
            this.particles = [];
            if (!this.options.parallaxElements) return;
            this.$element.find('[data-stellar-ratio]').each(function(i) {
                var $this = $(this),
                    horizontalOffset, verticalOffset, positionLeft, positionTop, marginLeft, marginTop, $offsetParent, offsetLeft, offsetTop, parentOffsetLeft = 0,
                    parentOffsetTop = 0,
                    tempParentOffsetLeft = 0,
                    tempParentOffsetTop = 0;
                if (!$this.data('stellar-elementIsActive')) {
                    $this.data('stellar-elementIsActive', this);
                } else if ($this.data('stellar-elementIsActive') !== this) {
                    return;
                }
                self.options.showElement($this);
                if (!$this.data('stellar-startingLeft')) {
                    $this.data('stellar-startingLeft', $this.css('left'));
                    $this.data('stellar-startingTop', $this.css('top'));
                } else {
                    $this.css('left', $this.data('stellar-startingLeft'));
                    $this.css('top', $this.data('stellar-startingTop'));
                }
                positionLeft = $this.position().left;
                positionTop = $this.position().top;
                marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
                marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);
                offsetLeft = $this.offset().left - marginLeft;
                offsetTop = $this.offset().top - marginTop;
                $this.parents().each(function() {
                    var $this = $(this);
                    if ($this.data('stellar-offset-parent') === true) {
                        parentOffsetLeft = tempParentOffsetLeft;
                        parentOffsetTop = tempParentOffsetTop;
                        $offsetParent = $this;
                        return false;
                    } else {
                        tempParentOffsetLeft += $this.position().left;
                        tempParentOffsetTop += $this.position().top;
                    }
                });
                horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
                verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));
                self.particles.push({
                    $element: $this,
                    $offsetParent: $offsetParent,
                    isFixed: $this.css('position') === 'fixed',
                    horizontalOffset: horizontalOffset,
                    verticalOffset: verticalOffset,
                    startingPositionLeft: positionLeft,
                    startingPositionTop: positionTop,
                    startingOffsetLeft: offsetLeft,
                    startingOffsetTop: offsetTop,
                    parentOffsetLeft: parentOffsetLeft,
                    parentOffsetTop: parentOffsetTop,
                    stellarRatio: ($this.data('stellar-ratio') !== undefined ? $this.data('stellar-ratio') : 1),
                    width: $this.outerWidth(true),
                    height: $this.outerHeight(true),
                    isHidden: false
                });
            });
        },
        _findBackgrounds: function() {
            var self = this,
                scrollLeft = this._getScrollLeft(),
                scrollTop = this._getScrollTop(),
                $backgroundElements;
            this.backgrounds = [];
            if (!this.options.parallaxBackgrounds) return;
            $backgroundElements = this.$element.find('[data-stellar-background-ratio]');
            if (this.$element.data('stellar-background-ratio')) {
                $backgroundElements = $backgroundElements.add(this.$element);
            }
            $backgroundElements.each(function() {
                var $this = $(this),
                    backgroundPosition = getBackgroundPosition($this),
                    horizontalOffset, verticalOffset, positionLeft, positionTop, marginLeft, marginTop, offsetLeft, offsetTop, $offsetParent, parentOffsetLeft = 0,
                    parentOffsetTop = 0,
                    tempParentOffsetLeft = 0,
                    tempParentOffsetTop = 0;
                if (!$this.data('stellar-backgroundIsActive')) {
                    $this.data('stellar-backgroundIsActive', this);
                } else if ($this.data('stellar-backgroundIsActive') !== this) {
                    return;
                }
                if (!$this.data('stellar-backgroundStartingLeft')) {
                    $this.data('stellar-backgroundStartingLeft', backgroundPosition[0]);
                    $this.data('stellar-backgroundStartingTop', backgroundPosition[1]);
                } else {
                    setBackgroundPosition($this, $this.data('stellar-backgroundStartingLeft'), $this.data('stellar-backgroundStartingTop'));
                }
                marginLeft = ($this.css('margin-left') === 'auto') ? 0 : parseInt($this.css('margin-left'), 10);
                marginTop = ($this.css('margin-top') === 'auto') ? 0 : parseInt($this.css('margin-top'), 10);
                offsetLeft = $this.offset().left - marginLeft - scrollLeft;
                offsetTop = $this.offset().top - marginTop - scrollTop;
                $this.parents().each(function() {
                    var $this = $(this);
                    if ($this.data('stellar-offset-parent') === true) {
                        parentOffsetLeft = tempParentOffsetLeft;
                        parentOffsetTop = tempParentOffsetTop;
                        $offsetParent = $this;
                        return false;
                    } else {
                        tempParentOffsetLeft += $this.position().left;
                        tempParentOffsetTop += $this.position().top;
                    }
                });
                horizontalOffset = ($this.data('stellar-horizontal-offset') !== undefined ? $this.data('stellar-horizontal-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-horizontal-offset') !== undefined ? $offsetParent.data('stellar-horizontal-offset') : self.horizontalOffset));
                verticalOffset = ($this.data('stellar-vertical-offset') !== undefined ? $this.data('stellar-vertical-offset') : ($offsetParent !== undefined && $offsetParent.data('stellar-vertical-offset') !== undefined ? $offsetParent.data('stellar-vertical-offset') : self.verticalOffset));
                self.backgrounds.push({
                    $element: $this,
                    $offsetParent: $offsetParent,
                    isFixed: $this.css('background-attachment') === 'fixed',
                    horizontalOffset: horizontalOffset,
                    verticalOffset: verticalOffset,
                    startingValueLeft: backgroundPosition[0],
                    startingValueTop: backgroundPosition[1],
                    startingBackgroundPositionLeft: (isNaN(parseInt(backgroundPosition[0], 10)) ? 0 : parseInt(backgroundPosition[0], 10)),
                    startingBackgroundPositionTop: (isNaN(parseInt(backgroundPosition[1], 10)) ? 0 : parseInt(backgroundPosition[1], 10)),
                    startingPositionLeft: $this.position().left,
                    startingPositionTop: $this.position().top,
                    startingOffsetLeft: offsetLeft,
                    startingOffsetTop: offsetTop,
                    parentOffsetLeft: parentOffsetLeft,
                    parentOffsetTop: parentOffsetTop,
                    stellarRatio: ($this.data('stellar-background-ratio') === undefined ? 1 : $this.data('stellar-background-ratio'))
                });
            });
        },
        _reset: function() {
            var particle, startingPositionLeft, startingPositionTop, background, i;
            for (i = this.particles.length - 1; i >= 0; i--) {
                particle = this.particles[i];
                startingPositionLeft = particle.$element.data('stellar-startingLeft');
                startingPositionTop = particle.$element.data('stellar-startingTop');
                this._setPosition(particle.$element, startingPositionLeft, startingPositionLeft, startingPositionTop, startingPositionTop);
                this.options.showElement(particle.$element);
                particle.$element.data('stellar-startingLeft', null).data('stellar-elementIsActive', null).data('stellar-backgroundIsActive', null);
            }
            for (i = this.backgrounds.length - 1; i >= 0; i--) {
                background = this.backgrounds[i];
                background.$element.data('stellar-backgroundStartingLeft', null).data('stellar-backgroundStartingTop', null);
                setBackgroundPosition(background.$element, background.startingValueLeft, background.startingValueTop);
            }
        },
        destroy: function() {
            this._reset();
            this.$scrollElement.unbind('resize.' + this.name).unbind('scroll.' + this.name);
            this._animationLoop = $.noop;
            $(window).unbind('load.' + this.name).unbind('resize.' + this.name);
        },
        _setOffsets: function() {
            var self = this,
                $window = $(window);
            $window.unbind('resize.horizontal-' + this.name).unbind('resize.vertical-' + this.name);
            if (typeof this.options.horizontalOffset === 'function') {
                this.horizontalOffset = this.options.horizontalOffset();
                $window.bind('resize.horizontal-' + this.name, function() {
                    self.horizontalOffset = self.options.horizontalOffset();
                });
            } else {
                this.horizontalOffset = this.options.horizontalOffset;
            }
            if (typeof this.options.verticalOffset === 'function') {
                this.verticalOffset = this.options.verticalOffset();
                $window.bind('resize.vertical-' + this.name, function() {
                    self.verticalOffset = self.options.verticalOffset();
                });
            } else {
                this.verticalOffset = this.options.verticalOffset;
            }
        },
        _repositionElements: function() {
            var scrollLeft = this._getScrollLeft(),
                scrollTop = this._getScrollTop(),
                horizontalOffset, verticalOffset, particle, fixedRatioOffset, background, bgLeft, bgTop, isVisibleVertical = true,
                isVisibleHorizontal = true,
                newPositionLeft, newPositionTop, newOffsetLeft, newOffsetTop, i;
            if (this.currentScrollLeft === scrollLeft && this.currentScrollTop === scrollTop && this.currentWidth === this.viewportWidth && this.currentHeight === this.viewportHeight) {
                return;
            } else {
                this.currentScrollLeft = scrollLeft;
                this.currentScrollTop = scrollTop;
                this.currentWidth = this.viewportWidth;
                this.currentHeight = this.viewportHeight;
            }
            for (i = this.particles.length - 1; i >= 0; i--) {
                particle = this.particles[i];
                fixedRatioOffset = (particle.isFixed ? 1 : 0);
                if (this.options.horizontalScrolling) {
                    newPositionLeft = (scrollLeft + particle.horizontalOffset + this.viewportOffsetLeft + particle.startingPositionLeft - particle.startingOffsetLeft + particle.parentOffsetLeft) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionLeft;
                    newOffsetLeft = newPositionLeft - particle.startingPositionLeft + particle.startingOffsetLeft;
                } else {
                    newPositionLeft = particle.startingPositionLeft;
                    newOffsetLeft = particle.startingOffsetLeft;
                }
                if (this.options.verticalScrolling) {
                    newPositionTop = (scrollTop + particle.verticalOffset + this.viewportOffsetTop + particle.startingPositionTop - particle.startingOffsetTop + particle.parentOffsetTop) * -(particle.stellarRatio + fixedRatioOffset - 1) + particle.startingPositionTop;
                    newOffsetTop = newPositionTop - particle.startingPositionTop + particle.startingOffsetTop;
                } else {
                    newPositionTop = particle.startingPositionTop;
                    newOffsetTop = particle.startingOffsetTop;
                }
                if (this.options.hideDistantElements) {
                    isVisibleHorizontal = !this.options.horizontalScrolling || newOffsetLeft + particle.width > (particle.isFixed ? 0 : scrollLeft) && newOffsetLeft < (particle.isFixed ? 0 : scrollLeft) + this.viewportWidth + this.viewportOffsetLeft;
                    isVisibleVertical = !this.options.verticalScrolling || newOffsetTop + particle.height > (particle.isFixed ? 0 : scrollTop) && newOffsetTop < (particle.isFixed ? 0 : scrollTop) + this.viewportHeight + this.viewportOffsetTop;
                }
                if (isVisibleHorizontal && isVisibleVertical) {
                    if (particle.isHidden) {
                        this.options.showElement(particle.$element);
                        particle.isHidden = false;
                    }
                    this._setPosition(particle.$element, newPositionLeft, particle.startingPositionLeft, newPositionTop, particle.startingPositionTop);
                } else {
                    if (!particle.isHidden) {
                        this.options.hideElement(particle.$element);
                        particle.isHidden = true;
                    }
                }
            }
            for (i = this.backgrounds.length - 1; i >= 0; i--) {
                background = this.backgrounds[i];
                fixedRatioOffset = (background.isFixed ? 0 : 1);
                bgLeft = (this.options.horizontalScrolling ? (scrollLeft + background.horizontalOffset - this.viewportOffsetLeft - background.startingOffsetLeft + background.parentOffsetLeft - background.startingBackgroundPositionLeft) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueLeft);
                bgTop = (this.options.verticalScrolling ? (scrollTop + background.verticalOffset - this.viewportOffsetTop - background.startingOffsetTop + background.parentOffsetTop - background.startingBackgroundPositionTop) * (fixedRatioOffset - background.stellarRatio) + 'px' : background.startingValueTop);
                setBackgroundPosition(background.$element, bgLeft, bgTop);
            }
        },
        _handleScrollEvent: function() {
            var self = this,
                ticking = false;
            var update = function() {
                self._repositionElements();
                ticking = false;
            };
            var requestTick = function() {
                if (!ticking) {
                    requestAnimFrame(update);
                    ticking = true;
                }
            };
            this.$scrollElement.bind('scroll.' + this.name, requestTick);
            requestTick();
        },
        _startAnimationLoop: function() {
            var self = this;
            this._animationLoop = function() {
                requestAnimFrame(self._animationLoop);
                self._repositionElements();
            };
            this._animationLoop();
        }
    };
    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            return this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
        }
    };
    $[pluginName] = function(options) {
        var $window = $(window);
        return $window.stellar.apply($window, Array.prototype.slice.call(arguments, 0));
    };
    $[pluginName].scrollProperty = scrollProperty;
    $[pluginName].positionProperty = positionProperty;
    window.Stellar = Plugin;
}(jQuery, this, document));;
(function(e) {
    "use strict";
    var s = function() {
        var s = {
                bcClass: "sf-breadcrumb",
                menuClass: "sf-js-enabled",
                anchorClass: "sf-with-ul",
                menuArrowClass: "sf-arrows"
            },
            o = function() {
                var s = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                return s && e(window).load(function() {
                    e("body").children().on("click", e.noop)
                }), s
            }(),
            n = function() {
                var e = document.documentElement.style;
                return "behavior" in e && "fill" in e && /iemobile/i.test(navigator.userAgent)
            }(),
            t = function(e, o) {
                var n = s.menuClass;
                o.cssArrows && (n += " " + s.menuArrowClass), e.toggleClass(n)
            },
            i = function(o, n) {
                return o.find("li." + n.pathClass).slice(0, n.pathLevels).addClass(n.hoverClass + " " + s.bcClass).filter(function() {
                    return e(this).children(n.popUpSelector).hide().show().length
                }).removeClass(n.pathClass)
            },
            r = function(e) {
                e.children("a").toggleClass(s.anchorClass)
            },
            a = function(e) {
                var s = e.css("ms-touch-action");
                s = "pan-y" === s ? "auto" : "pan-y", e.css("ms-touch-action", s)
            },
            l = function(s, t) {
                var i = "li:has(" + t.popUpSelector + ")";
                e.fn.hoverIntent && !t.disableHI ? s.hoverIntent(u, p, i) : s.on("mouseenter.superfish", i, u).on("mouseleave.superfish", i, p);
                var r = "MSPointerDown.superfish";
                o || (r += " touchend.superfish"), n && (r += " mousedown.superfish"), s.on("focusin.superfish", "li", u).on("focusout.superfish", "li", p).on(r, "a", t, h)
            },
            h = function(s) {
                var o = e(this),
                    n = o.siblings(s.data.popUpSelector);
                n.length > 0 && n.is(":hidden") && (o.one("click.superfish", !1), "MSPointerDown" === s.type ? o.trigger("focus") : e.proxy(u, o.parent("li"))())
            },
            u = function() {
                var s = e(this),
                    o = d(s);
                clearTimeout(o.sfTimer), s.siblings().superfish("hide").end().superfish("show")
            },
            p = function() {
                var s = e(this),
                    n = d(s);
                o ? e.proxy(f, s, n)() : (clearTimeout(n.sfTimer), n.sfTimer = setTimeout(e.proxy(f, s, n), n.delay))
            },
            f = function(s) {
                s.retainPath = e.inArray(this[0], s.$path) > -1, this.superfish("hide"), this.parents("." + s.hoverClass).length || (s.onIdle.call(c(this)), s.$path.length && e.proxy(u, s.$path)())
            },
            c = function(e) {
                return e.closest("." + s.menuClass)
            },
            d = function(e) {
                return c(e).data("sf-options")
            };
        return {
            hide: function(s) {
                if (this.length) {
                    var o = this,
                        n = d(o);
                    if (!n) return this;
                    var t = n.retainPath === !0 ? n.$path : "",
                        i = o.find("li." + n.hoverClass).add(this).not(t).removeClass(n.hoverClass).children(n.popUpSelector),
                        r = n.speedOut;
                    s && (i.show(), r = 0), n.retainPath = !1, n.onBeforeHide.call(i), i.stop(!0, !0).animate(n.animationOut, r, function() {
                        var s = e(this);
                        n.onHide.call(s)
                    })
                }
                return this
            },
            show: function() {
                var e = d(this);
                if (!e) return this;
                var s = this.addClass(e.hoverClass),
                    o = s.children(e.popUpSelector);
                return e.onBeforeShow.call(o), o.stop(!0, !0).animate(e.animation, e.speed, function() {
                    e.onShow.call(o)
                }), this
            },
            destroy: function() {
                return this.each(function() {
                    var o, n = e(this),
                        i = n.data("sf-options");
                    return i ? (o = n.find(i.popUpSelector).parent("li"), clearTimeout(i.sfTimer), t(n, i), r(o), a(n), n.off(".superfish").off(".hoverIntent"), o.children(i.popUpSelector).attr("style", function(e, s) {
                        return s.replace(/display[^;]+;?/g, "")
                    }), i.$path.removeClass(i.hoverClass + " " + s.bcClass).addClass(i.pathClass), n.find("." + i.hoverClass).removeClass(i.hoverClass), i.onDestroy.call(n), n.removeData("sf-options"), void 0) : !1
                })
            },
            init: function(o) {
                return this.each(function() {
                    var n = e(this);
                    if (n.data("sf-options")) return !1;
                    var h = e.extend({}, e.fn.superfish.defaults, o),
                        u = n.find(h.popUpSelector).parent("li");
                    h.$path = i(n, h), n.data("sf-options", h), t(n, h), r(u), a(n), l(n, h), u.not("." + s.bcClass).superfish("hide", !0), h.onInit.call(this)
                })
            }
        }
    }();
    e.fn.superfish = function(o) {
        return s[o] ? s[o].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof o && o ? e.error("Method " + o + " does not exist on jQuery.fn.superfish") : s.init.apply(this, arguments)
    }, e.fn.superfish.defaults = {
        popUpSelector: "ul,.sf-mega",
        hoverClass: "sfHover",
        pathClass: "overrideThisToUse",
        pathLevels: 1,
        delay: 800,
        animation: {
            opacity: "show"
        },
        animationOut: {
            opacity: "hide"
        },
        speed: "normal",
        speedOut: "fast",
        cssArrows: !0,
        disableHI: !1,
        onInit: e.noop,
        onBeforeShow: e.noop,
        onShow: e.noop,
        onBeforeHide: e.noop,
        onHide: e.noop,
        onIdle: e.noop,
        onDestroy: e.noop
    }, e.fn.extend({
        hideSuperfishUl: s.hide,
        showSuperfishUl: s.show
    })
})(jQuery);;
(function($) {
    $.fn.supersubs = function(options) {
        var opts = $.extend({}, $.fn.supersubs.defaults, options);
        return this.each(function() {
            var $$ = $(this);
            var o = $.meta ? $.extend({}, opts, $$.data()) : opts;
            $ULs = $$.find('ul').show();
            var fontsize = $('<li id="menu-fontsize">&#8212;</li>').css({
                'padding': 0,
                'position': 'absolute',
                'top': '-999em',
                'width': 'auto'
            }).appendTo($$)[0].clientWidth;
            $('#menu-fontsize').remove();
            $ULs.each(function(i) {
                var $ul = $(this);
                var $LIs = $ul.children();
                var $As = $LIs.children('a');
                var liFloat = $LIs.css('white-space', 'nowrap').css('float');
                $ul.add($LIs).add($As).css({
                    'float': 'none',
                    'width': 'auto'
                });
                var emWidth = $ul[0].clientWidth / fontsize;
                emWidth += o.extraWidth;
                if (emWidth > o.maxWidth) {
                    emWidth = o.maxWidth;
                } else if (emWidth < o.minWidth) {
                    emWidth = o.minWidth;
                }
                emWidth += 'em';
                $ul.css('width', emWidth);
                $LIs.css({
                    'float': liFloat,
                    'width': '100%',
                    'white-space': 'normal'
                }).each(function() {
                    var $childUl = $(this).children('ul');
                    var offsetDirection = $childUl.css('left') !== undefined ? 'left' : 'right';
                    $childUl.css(offsetDirection, '100%');
                });
            }).hide();
        });
    };
    $.fn.supersubs.defaults = {
        minWidth: 9,
        maxWidth: 25,
        extraWidth: 0
    };
})(jQuery);;
(function() {
    function n(n, t, e) {
        e = (e || 0) - 1;
        for (var r = n ? n.length : 0; ++e < r;)
            if (n[e] === t) return e;
        return -1
    }

    function t(t, e) {
        var r = typeof e;
        if (t = t.l, "boolean" == r || null == e) return t[e] ? 0 : -1;
        "number" != r && "string" != r && (r = "object");
        var u = "number" == r ? e : m + e;
        return t = (t = t[r]) && t[u], "object" == r ? t && -1 < n(t, e) ? 0 : -1 : t ? 0 : -1
    }

    function e(n) {
        var t = this.l,
            e = typeof n;
        if ("boolean" == e || null == n) t[n] = true;
        else {
            "number" != e && "string" != e && (e = "object");
            var r = "number" == e ? n : m + n,
                t = t[e] || (t[e] = {});
            "object" == e ? (t[r] || (t[r] = [])).push(n) : t[r] = true
        }
    }

    function r(n) {
        return n.charCodeAt(0)
    }

    function u(n, t) {
        for (var e = n.m, r = t.m, u = -1, o = e.length; ++u < o;) {
            var i = e[u],
                a = r[u];
            if (i !== a) {
                if (i > a || typeof i == "undefined") return 1;
                if (i < a || typeof a == "undefined") return -1
            }
        }
        return n.n - t.n
    }

    function o(n) {
        var t = -1,
            r = n.length,
            u = n[0],
            o = n[r / 2 | 0],
            i = n[r - 1];
        if (u && typeof u == "object" && o && typeof o == "object" && i && typeof i == "object") return false;
        for (u = f(), u["false"] = u["null"] = u["true"] = u.undefined = false, o = f(), o.k = n, o.l = u, o.push = e; ++t < r;) o.push(n[t]);
        return o
    }

    function i(n) {
        return "\\" + U[n]
    }

    function a() {
        return h.pop() || []
    }

    function f() {
        return g.pop() || {
            k: null,
            l: null,
            m: null,
            "false": false,
            n: 0,
            "null": false,
            number: null,
            object: null,
            push: null,
            string: null,
            "true": false,
            undefined: false,
            o: null
        }
    }

    function l(n) {
        n.length = 0, h.length < _ && h.push(n)
    }

    function c(n) {
        var t = n.l;
        t && c(t), n.k = n.l = n.m = n.object = n.number = n.string = n.o = null, g.length < _ && g.push(n)
    }

    function p(n, t, e) {
        t || (t = 0), typeof e == "undefined" && (e = n ? n.length : 0);
        var r = -1;
        e = e - t || 0;
        for (var u = Array(0 > e ? 0 : e); ++r < e;) u[r] = n[t + r];
        return u
    }

    function s(e) {
        function h(n, t, e) {
            if (!n || !V[typeof n]) return n;
            t = t && typeof e == "undefined" ? t : tt(t, e, 3);
            for (var r = -1, u = V[typeof n] && Fe(n), o = u ? u.length : 0; ++r < o && (e = u[r], false !== t(n[e], e, n)););
            return n
        }

        function g(n, t, e) {
            var r;
            if (!n || !V[typeof n]) return n;
            t = t && typeof e == "undefined" ? t : tt(t, e, 3);
            for (r in n)
                if (false === t(n[r], r, n)) break;
            return n
        }

        function _(n, t, e) {
            var r, u = n,
                o = u;
            if (!u) return o;
            for (var i = arguments, a = 0, f = typeof e == "number" ? 2 : i.length; ++a < f;)
                if ((u = i[a]) && V[typeof u])
                    for (var l = -1, c = V[typeof u] && Fe(u), p = c ? c.length : 0; ++l < p;) r = c[l], "undefined" == typeof o[r] && (o[r] = u[r]);
            return o
        }

        function U(n, t, e) {
            var r, u = n,
                o = u;
            if (!u) return o;
            var i = arguments,
                a = 0,
                f = typeof e == "number" ? 2 : i.length;
            if (3 < f && "function" == typeof i[f - 2]) var l = tt(i[--f - 1], i[f--], 2);
            else 2 < f && "function" == typeof i[f - 1] && (l = i[--f]);
            for (; ++a < f;)
                if ((u = i[a]) && V[typeof u])
                    for (var c = -1, p = V[typeof u] && Fe(u), s = p ? p.length : 0; ++c < s;) r = p[c], o[r] = l ? l(o[r], u[r]) : u[r];
            return o
        }

        function H(n) {
            var t, e = [];
            if (!n || !V[typeof n]) return e;
            for (t in n) me.call(n, t) && e.push(t);
            return e
        }

        function J(n) {
            return n && typeof n == "object" && !Te(n) && me.call(n, "__wrapped__") ? n : new Q(n)
        }

        function Q(n, t) {
            this.__chain__ = !!t, this.__wrapped__ = n
        }

        function X(n) {
            function t() {
                if (r) {
                    var n = p(r);
                    be.apply(n, arguments)
                }
                if (this instanceof t) {
                    var o = nt(e.prototype),
                        n = e.apply(o, n || arguments);
                    return wt(n) ? n : o
                }
                return e.apply(u, n || arguments)
            }
            var e = n[0],
                r = n[2],
                u = n[4];
            return $e(t, n), t
        }

        function Z(n, t, e, r, u) {
            if (e) {
                var o = e(n);
                if (typeof o != "undefined") return o
            }
            if (!wt(n)) return n;
            var i = ce.call(n);
            if (!K[i]) return n;
            var f = Ae[i];
            switch (i) {
                case T:
                case F:
                    return new f(+n);
                case W:
                case P:
                    return new f(n);
                case z:
                    return o = f(n.source, C.exec(n)), o.lastIndex = n.lastIndex, o
            }
            if (i = Te(n), t) {
                var c = !r;
                r || (r = a()), u || (u = a());
                for (var s = r.length; s--;)
                    if (r[s] == n) return u[s];
                o = i ? f(n.length) : {}
            } else o = i ? p(n) : U({}, n);
            return i && (me.call(n, "index") && (o.index = n.index), me.call(n, "input") && (o.input = n.input)), t ? (r.push(n), u.push(o), (i ? St : h)(n, function(n, i) {
                o[i] = Z(n, t, e, r, u)
            }), c && (l(r), l(u)), o) : o
        }

        function nt(n) {
            return wt(n) ? ke(n) : {}
        }

        function tt(n, t, e) {
            if (typeof n != "function") return Ut;
            if (typeof t == "undefined" || !("prototype" in n)) return n;
            var r = n.__bindData__;
            if (typeof r == "undefined" && (De.funcNames && (r = !n.name), r = r || !De.funcDecomp, !r)) {
                var u = ge.call(n);
                De.funcNames || (r = !O.test(u)), r || (r = E.test(u), $e(n, r))
            }
            if (false === r || true !== r && 1 & r[1]) return n;
            switch (e) {
                case 1:
                    return function(e) {
                        return n.call(t, e)
                    };
                case 2:
                    return function(e, r) {
                        return n.call(t, e, r)
                    };
                case 3:
                    return function(e, r, u) {
                        return n.call(t, e, r, u)
                    };
                case 4:
                    return function(e, r, u, o) {
                        return n.call(t, e, r, u, o)
                    }
            }
            return Mt(n, t)
        }

        function et(n) {
            function t() {
                var n = f ? i : this;
                if (u) {
                    var h = p(u);
                    be.apply(h, arguments)
                }
                return (o || c) && (h || (h = p(arguments)), o && be.apply(h, o), c && h.length < a) ? (r |= 16, et([e, s ? r : -4 & r, h, null, i, a])) : (h || (h = arguments), l && (e = n[v]), this instanceof t ? (n = nt(e.prototype), h = e.apply(n, h), wt(h) ? h : n) : e.apply(n, h))
            }
            var e = n[0],
                r = n[1],
                u = n[2],
                o = n[3],
                i = n[4],
                a = n[5],
                f = 1 & r,
                l = 2 & r,
                c = 4 & r,
                s = 8 & r,
                v = e;
            return $e(t, n), t
        }

        function rt(e, r) {
            var u = -1,
                i = st(),
                a = e ? e.length : 0,
                f = a >= b && i === n,
                l = [];
            if (f) {
                var p = o(r);
                p ? (i = t, r = p) : f = false
            }
            for (; ++u < a;) p = e[u], 0 > i(r, p) && l.push(p);
            return f && c(r), l
        }

        function ut(n, t, e, r) {
            r = (r || 0) - 1;
            for (var u = n ? n.length : 0, o = []; ++r < u;) {
                var i = n[r];
                if (i && typeof i == "object" && typeof i.length == "number" && (Te(i) || yt(i))) {
                    t || (i = ut(i, t, e));
                    var a = -1,
                        f = i.length,
                        l = o.length;
                    for (o.length += f; ++a < f;) o[l++] = i[a]
                } else e || o.push(i)
            }
            return o
        }

        function ot(n, t, e, r, u, o) {
            if (e) {
                var i = e(n, t);
                if (typeof i != "undefined") return !!i
            }
            if (n === t) return 0 !== n || 1 / n == 1 / t;
            if (n === n && !(n && V[typeof n] || t && V[typeof t])) return false;
            if (null == n || null == t) return n === t;
            var f = ce.call(n),
                c = ce.call(t);
            if (f == D && (f = q), c == D && (c = q), f != c) return false;
            switch (f) {
                case T:
                case F:
                    return +n == +t;
                case W:
                    return n != +n ? t != +t : 0 == n ? 1 / n == 1 / t : n == +t;
                case z:
                case P:
                    return n == oe(t)
            }
            if (c = f == $, !c) {
                var p = me.call(n, "__wrapped__"),
                    s = me.call(t, "__wrapped__");
                if (p || s) return ot(p ? n.__wrapped__ : n, s ? t.__wrapped__ : t, e, r, u, o);
                if (f != q) return false;
                if (f = n.constructor, p = t.constructor, f != p && !(dt(f) && f instanceof f && dt(p) && p instanceof p) && "constructor" in n && "constructor" in t) return false
            }
            for (f = !u, u || (u = a()), o || (o = a()), p = u.length; p--;)
                if (u[p] == n) return o[p] == t;
            var v = 0,
                i = true;
            if (u.push(n), o.push(t), c) {
                if (p = n.length, v = t.length, (i = v == p) || r)
                    for (; v--;)
                        if (c = p, s = t[v], r)
                            for (; c-- && !(i = ot(n[c], s, e, r, u, o)););
                        else if (!(i = ot(n[v], s, e, r, u, o))) break
            } else g(t, function(t, a, f) {
                return me.call(f, a) ? (v++, i = me.call(n, a) && ot(n[a], t, e, r, u, o)) : void 0
            }), i && !r && g(n, function(n, t, e) {
                return me.call(e, t) ? i = -1 < --v : void 0
            });
            return u.pop(), o.pop(), f && (l(u), l(o)), i
        }

        function it(n, t, e, r, u) {
            (Te(t) ? St : h)(t, function(t, o) {
                var i, a, f = t,
                    l = n[o];
                if (t && ((a = Te(t)) || Pe(t))) {
                    for (f = r.length; f--;)
                        if (i = r[f] == t) {
                            l = u[f];
                            break
                        }
                    if (!i) {
                        var c;
                        e && (f = e(l, t), c = typeof f != "undefined") && (l = f), c || (l = a ? Te(l) ? l : [] : Pe(l) ? l : {}), r.push(t), u.push(l), c || it(l, t, e, r, u)
                    }
                } else e && (f = e(l, t), typeof f == "undefined" && (f = t)), typeof f != "undefined" && (l = f);
                n[o] = l
            })
        }

        function at(n, t) {
            return n + he(Re() * (t - n + 1))
        }

        function ft(e, r, u) {
            var i = -1,
                f = st(),
                p = e ? e.length : 0,
                s = [],
                v = !r && p >= b && f === n,
                h = u || v ? a() : s;
            for (v && (h = o(h), f = t); ++i < p;) {
                var g = e[i],
                    y = u ? u(g, i, e) : g;
                (r ? !i || h[h.length - 1] !== y : 0 > f(h, y)) && ((u || v) && h.push(y), s.push(g))
            }
            return v ? (l(h.k), c(h)) : u && l(h), s
        }

        function lt(n) {
            return function(t, e, r) {
                var u = {};
                e = J.createCallback(e, r, 3), r = -1;
                var o = t ? t.length : 0;
                if (typeof o == "number")
                    for (; ++r < o;) {
                        var i = t[r];
                        n(u, i, e(i, r, t), t)
                    } else h(t, function(t, r, o) {
                        n(u, t, e(t, r, o), o)
                    });
                return u
            }
        }

        function ct(n, t, e, r, u, o) {
            var i = 1 & t,
                a = 4 & t,
                f = 16 & t,
                l = 32 & t;
            if (!(2 & t || dt(n))) throw new ie;
            f && !e.length && (t &= -17, f = e = false), l && !r.length && (t &= -33, l = r = false);
            var c = n && n.__bindData__;
            return c && true !== c ? (c = p(c), c[2] && (c[2] = p(c[2])), c[3] && (c[3] = p(c[3])), !i || 1 & c[1] || (c[4] = u), !i && 1 & c[1] && (t |= 8), !a || 4 & c[1] || (c[5] = o), f && be.apply(c[2] || (c[2] = []), e), l && we.apply(c[3] || (c[3] = []), r), c[1] |= t, ct.apply(null, c)) : (1 == t || 17 === t ? X : et)([n, t, e, r, u, o])
        }

        function pt(n) {
            return Be[n]
        }

        function st() {
            var t = (t = J.indexOf) === Wt ? n : t;
            return t
        }

        function vt(n) {
            return typeof n == "function" && pe.test(n)
        }

        function ht(n) {
            var t, e;
            return n && ce.call(n) == q && (t = n.constructor, !dt(t) || t instanceof t) ? (g(n, function(n, t) {
                e = t
            }), typeof e == "undefined" || me.call(n, e)) : false
        }

        function gt(n) {
            return We[n]
        }

        function yt(n) {
            return n && typeof n == "object" && typeof n.length == "number" && ce.call(n) == D || false
        }

        function mt(n, t, e) {
            var r = Fe(n),
                u = r.length;
            for (t = tt(t, e, 3); u-- && (e = r[u], false !== t(n[e], e, n)););
            return n
        }

        function bt(n) {
            var t = [];
            return g(n, function(n, e) {
                dt(n) && t.push(e)
            }), t.sort()
        }

        function _t(n) {
            for (var t = -1, e = Fe(n), r = e.length, u = {}; ++t < r;) {
                var o = e[t];
                u[n[o]] = o
            }
            return u
        }

        function dt(n) {
            return typeof n == "function"
        }

        function wt(n) {
            return !(!n || !V[typeof n])
        }

        function jt(n) {
            return typeof n == "number" || n && typeof n == "object" && ce.call(n) == W || false
        }

        function kt(n) {
            return typeof n == "string" || n && typeof n == "object" && ce.call(n) == P || false
        }

        function xt(n) {
            for (var t = -1, e = Fe(n), r = e.length, u = Xt(r); ++t < r;) u[t] = n[e[t]];
            return u
        }

        function Ct(n, t, e) {
            var r = -1,
                u = st(),
                o = n ? n.length : 0,
                i = false;
            return e = (0 > e ? Ie(0, o + e) : e) || 0, Te(n) ? i = -1 < u(n, t, e) : typeof o == "number" ? i = -1 < (kt(n) ? n.indexOf(t, e) : u(n, t, e)) : h(n, function(n) {
                return ++r < e ? void 0 : !(i = n === t)
            }), i
        }

        function Ot(n, t, e) {
            var r = true;
            t = J.createCallback(t, e, 3), e = -1;
            var u = n ? n.length : 0;
            if (typeof u == "number")
                for (; ++e < u && (r = !!t(n[e], e, n)););
            else h(n, function(n, e, u) {
                return r = !!t(n, e, u)
            });
            return r
        }

        function Nt(n, t, e) {
            var r = [];
            t = J.createCallback(t, e, 3), e = -1;
            var u = n ? n.length : 0;
            if (typeof u == "number")
                for (; ++e < u;) {
                    var o = n[e];
                    t(o, e, n) && r.push(o)
                } else h(n, function(n, e, u) {
                    t(n, e, u) && r.push(n)
                });
            return r
        }

        function It(n, t, e) {
            t = J.createCallback(t, e, 3), e = -1;
            var r = n ? n.length : 0;
            if (typeof r != "number") {
                var u;
                return h(n, function(n, e, r) {
                    return t(n, e, r) ? (u = n, false) : void 0
                }), u
            }
            for (; ++e < r;) {
                var o = n[e];
                if (t(o, e, n)) return o
            }
        }

        function St(n, t, e) {
            var r = -1,
                u = n ? n.length : 0;
            if (t = t && typeof e == "undefined" ? t : tt(t, e, 3), typeof u == "number")
                for (; ++r < u && false !== t(n[r], r, n););
            else h(n, t);
            return n
        }

        function Et(n, t, e) {
            var r = n ? n.length : 0;
            if (t = t && typeof e == "undefined" ? t : tt(t, e, 3), typeof r == "number")
                for (; r-- && false !== t(n[r], r, n););
            else {
                var u = Fe(n),
                    r = u.length;
                h(n, function(n, e, o) {
                    return e = u ? u[--r] : --r, t(o[e], e, o)
                })
            }
            return n
        }

        function Rt(n, t, e) {
            var r = -1,
                u = n ? n.length : 0;
            if (t = J.createCallback(t, e, 3), typeof u == "number")
                for (var o = Xt(u); ++r < u;) o[r] = t(n[r], r, n);
            else o = [], h(n, function(n, e, u) {
                o[++r] = t(n, e, u)
            });
            return o
        }

        function At(n, t, e) {
            var u = -1 / 0,
                o = u;
            if (typeof t != "function" && e && e[t] === n && (t = null), null == t && Te(n)) {
                e = -1;
                for (var i = n.length; ++e < i;) {
                    var a = n[e];
                    a > o && (o = a)
                }
            } else t = null == t && kt(n) ? r : J.createCallback(t, e, 3), St(n, function(n, e, r) {
                e = t(n, e, r), e > u && (u = e, o = n)
            });
            return o
        }

        function Dt(n, t, e, r) {
            if (!n) return e;
            var u = 3 > arguments.length;
            t = J.createCallback(t, r, 4);
            var o = -1,
                i = n.length;
            if (typeof i == "number")
                for (u && (e = n[++o]); ++o < i;) e = t(e, n[o], o, n);
            else h(n, function(n, r, o) {
                e = u ? (u = false, n) : t(e, n, r, o)
            });
            return e
        }

        function $t(n, t, e, r) {
            var u = 3 > arguments.length;
            return t = J.createCallback(t, r, 4), Et(n, function(n, r, o) {
                e = u ? (u = false, n) : t(e, n, r, o)
            }), e
        }

        function Tt(n) {
            var t = -1,
                e = n ? n.length : 0,
                r = Xt(typeof e == "number" ? e : 0);
            return St(n, function(n) {
                var e = at(0, ++t);
                r[t] = r[e], r[e] = n
            }), r
        }

        function Ft(n, t, e) {
            var r;
            t = J.createCallback(t, e, 3), e = -1;
            var u = n ? n.length : 0;
            if (typeof u == "number")
                for (; ++e < u && !(r = t(n[e], e, n)););
            else h(n, function(n, e, u) {
                return !(r = t(n, e, u))
            });
            return !!r
        }

        function Bt(n, t, e) {
            var r = 0,
                u = n ? n.length : 0;
            if (typeof t != "number" && null != t) {
                var o = -1;
                for (t = J.createCallback(t, e, 3); ++o < u && t(n[o], o, n);) r++
            } else if (r = t, null == r || e) return n ? n[0] : v;
            return p(n, 0, Se(Ie(0, r), u))
        }

        function Wt(t, e, r) {
            if (typeof r == "number") {
                var u = t ? t.length : 0;
                r = 0 > r ? Ie(0, u + r) : r || 0
            } else if (r) return r = zt(t, e), t[r] === e ? r : -1;
            return n(t, e, r)
        }

        function qt(n, t, e) {
            if (typeof t != "number" && null != t) {
                var r = 0,
                    u = -1,
                    o = n ? n.length : 0;
                for (t = J.createCallback(t, e, 3); ++u < o && t(n[u], u, n);) r++
            } else r = null == t || e ? 1 : Ie(0, t);
            return p(n, r)
        }

        function zt(n, t, e, r) {
            var u = 0,
                o = n ? n.length : u;
            for (e = e ? J.createCallback(e, r, 1) : Ut, t = e(t); u < o;) r = u + o >>> 1, e(n[r]) < t ? u = r + 1 : o = r;
            return u
        }

        function Pt(n, t, e, r) {
            return typeof t != "boolean" && null != t && (r = e, e = typeof t != "function" && r && r[t] === n ? null : t, t = false), null != e && (e = J.createCallback(e, r, 3)), ft(n, t, e)
        }

        function Kt() {
            for (var n = 1 < arguments.length ? arguments : arguments[0], t = -1, e = n ? At(Ve(n, "length")) : 0, r = Xt(0 > e ? 0 : e); ++t < e;) r[t] = Ve(n, t);
            return r
        }

        function Lt(n, t) {
            var e = -1,
                r = n ? n.length : 0,
                u = {};
            for (t || !r || Te(n[0]) || (t = []); ++e < r;) {
                var o = n[e];
                t ? u[o] = t[e] : o && (u[o[0]] = o[1])
            }
            return u
        }

        function Mt(n, t) {
            return 2 < arguments.length ? ct(n, 17, p(arguments, 2), null, t) : ct(n, 1, null, null, t)
        }

        function Vt(n, t, e) {
            function r() {
                c && ve(c), i = c = p = v, (g || h !== t) && (s = Ue(), a = n.apply(l, o), c || i || (o = l = null))
            }

            function u() {
                var e = t - (Ue() - f);
                0 < e ? c = _e(u, e) : (i && ve(i), e = p, i = c = p = v, e && (s = Ue(), a = n.apply(l, o), c || i || (o = l = null)))
            }
            var o, i, a, f, l, c, p, s = 0,
                h = false,
                g = true;
            if (!dt(n)) throw new ie;
            if (t = Ie(0, t) || 0, true === e) var y = true,
                g = false;
            else wt(e) && (y = e.leading, h = "maxWait" in e && (Ie(t, e.maxWait) || 0), g = "trailing" in e ? e.trailing : g);
            return function() {
                if (o = arguments, f = Ue(), l = this, p = g && (c || !y), false === h) var e = y && !c;
                else {
                    i || y || (s = f);
                    var v = h - (f - s),
                        m = 0 >= v;
                    m ? (i && (i = ve(i)), s = f, a = n.apply(l, o)) : i || (i = _e(r, v))
                }
                return m && c ? c = ve(c) : c || t === h || (c = _e(u, t)), e && (m = true, a = n.apply(l, o)), !m || c || i || (o = l = null), a
            }
        }

        function Ut(n) {
            return n
        }

        function Gt(n, t, e) {
            var r = true,
                u = t && bt(t);
            t && (e || u.length) || (null == e && (e = t), o = Q, t = n, n = J, u = bt(t)), false === e ? r = false : wt(e) && "chain" in e && (r = e.chain);
            var o = n,
                i = dt(o);
            St(u, function(e) {
                var u = n[e] = t[e];
                i && (o.prototype[e] = function() {
                    var t = this.__chain__,
                        e = this.__wrapped__,
                        i = [e];
                    if (be.apply(i, arguments), i = u.apply(n, i), r || t) {
                        if (e === i && wt(i)) return this;
                        i = new o(i), i.__chain__ = t
                    }
                    return i
                })
            })
        }

        function Ht() {}

        function Jt(n) {
            return function(t) {
                return t[n]
            }
        }

        function Qt() {
            return this.__wrapped__
        }
        e = e ? Y.defaults(G.Object(), e, Y.pick(G, A)) : G;
        var Xt = e.Array,
            Yt = e.Boolean,
            Zt = e.Date,
            ne = e.Function,
            te = e.Math,
            ee = e.Number,
            re = e.Object,
            ue = e.RegExp,
            oe = e.String,
            ie = e.TypeError,
            ae = [],
            fe = re.prototype,
            le = e._,
            ce = fe.toString,
            pe = ue("^" + oe(ce).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$"),
            se = te.ceil,
            ve = e.clearTimeout,
            he = te.floor,
            ge = ne.prototype.toString,
            ye = vt(ye = re.getPrototypeOf) && ye,
            me = fe.hasOwnProperty,
            be = ae.push,
            _e = e.setTimeout,
            de = ae.splice,
            we = ae.unshift,
            je = function() {
                try {
                    var n = {},
                        t = vt(t = re.defineProperty) && t,
                        e = t(n, n, n) && t
                } catch (r) {}
                return e
            }(),
            ke = vt(ke = re.create) && ke,
            xe = vt(xe = Xt.isArray) && xe,
            Ce = e.isFinite,
            Oe = e.isNaN,
            Ne = vt(Ne = re.keys) && Ne,
            Ie = te.max,
            Se = te.min,
            Ee = e.parseInt,
            Re = te.random,
            Ae = {};
        Ae[$] = Xt, Ae[T] = Yt, Ae[F] = Zt, Ae[B] = ne, Ae[q] = re, Ae[W] = ee, Ae[z] = ue, Ae[P] = oe, Q.prototype = J.prototype;
        var De = J.support = {};
        De.funcDecomp = !vt(e.a) && E.test(s), De.funcNames = typeof ne.name == "string", J.templateSettings = {
            escape: /<%-([\s\S]+?)%>/g,
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: N,
            variable: "",
            imports: {
                _: J
            }
        }, ke || (nt = function() {
            function n() {}
            return function(t) {
                if (wt(t)) {
                    n.prototype = t;
                    var r = new n;
                    n.prototype = null
                }
                return r || e.Object()
            }
        }());
        var $e = je ? function(n, t) {
                M.value = t, je(n, "__bindData__", M)
            } : Ht,
            Te = xe || function(n) {
                return n && typeof n == "object" && typeof n.length == "number" && ce.call(n) == $ || false
            },
            Fe = Ne ? function(n) {
                return wt(n) ? Ne(n) : []
            } : H,
            Be = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            },
            We = _t(Be),
            qe = ue("(" + Fe(We).join("|") + ")", "g"),
            ze = ue("[" + Fe(Be).join("") + "]", "g"),
            Pe = ye ? function(n) {
                if (!n || ce.call(n) != q) return false;
                var t = n.valueOf,
                    e = vt(t) && (e = ye(t)) && ye(e);
                return e ? n == e || ye(n) == e : ht(n)
            } : ht,
            Ke = lt(function(n, t, e) {
                me.call(n, e) ? n[e]++ : n[e] = 1
            }),
            Le = lt(function(n, t, e) {
                (me.call(n, e) ? n[e] : n[e] = []).push(t)
            }),
            Me = lt(function(n, t, e) {
                n[e] = t
            }),
            Ve = Rt,
            Ue = vt(Ue = Zt.now) && Ue || function() {
                return (new Zt).getTime()
            },
            Ge = 8 == Ee(d + "08") ? Ee : function(n, t) {
                return Ee(kt(n) ? n.replace(I, "") : n, t || 0)
            };
        return J.after = function(n, t) {
            if (!dt(t)) throw new ie;
            return function() {
                return 1 > --n ? t.apply(this, arguments) : void 0
            }
        }, J.assign = U, J.at = function(n) {
            for (var t = arguments, e = -1, r = ut(t, true, false, 1), t = t[2] && t[2][t[1]] === n ? 1 : r.length, u = Xt(t); ++e < t;) u[e] = n[r[e]];
            return u
        }, J.bind = Mt, J.bindAll = function(n) {
            for (var t = 1 < arguments.length ? ut(arguments, true, false, 1) : bt(n), e = -1, r = t.length; ++e < r;) {
                var u = t[e];
                n[u] = ct(n[u], 1, null, null, n)
            }
            return n
        }, J.bindKey = function(n, t) {
            return 2 < arguments.length ? ct(t, 19, p(arguments, 2), null, n) : ct(t, 3, null, null, n)
        }, J.chain = function(n) {
            return n = new Q(n), n.__chain__ = true, n
        }, J.compact = function(n) {
            for (var t = -1, e = n ? n.length : 0, r = []; ++t < e;) {
                var u = n[t];
                u && r.push(u)
            }
            return r
        }, J.compose = function() {
            for (var n = arguments, t = n.length; t--;)
                if (!dt(n[t])) throw new ie;
            return function() {
                for (var t = arguments, e = n.length; e--;) t = [n[e].apply(this, t)];
                return t[0]
            }
        }, J.constant = function(n) {
            return function() {
                return n
            }
        }, J.countBy = Ke, J.create = function(n, t) {
            var e = nt(n);
            return t ? U(e, t) : e
        }, J.createCallback = function(n, t, e) {
            var r = typeof n;
            if (null == n || "function" == r) return tt(n, t, e);
            if ("object" != r) return Jt(n);
            var u = Fe(n),
                o = u[0],
                i = n[o];
            return 1 != u.length || i !== i || wt(i) ? function(t) {
                for (var e = u.length, r = false; e-- && (r = ot(t[u[e]], n[u[e]], null, true)););
                return r
            } : function(n) {
                return n = n[o], i === n && (0 !== i || 1 / i == 1 / n)
            }
        }, J.curry = function(n, t) {
            return t = typeof t == "number" ? t : +t || n.length, ct(n, 4, null, null, null, t)
        }, J.debounce = Vt, J.defaults = _, J.defer = function(n) {
            if (!dt(n)) throw new ie;
            var t = p(arguments, 1);
            return _e(function() {
                n.apply(v, t)
            }, 1)
        }, J.delay = function(n, t) {
            if (!dt(n)) throw new ie;
            var e = p(arguments, 2);
            return _e(function() {
                n.apply(v, e)
            }, t)
        }, J.difference = function(n) {
            return rt(n, ut(arguments, true, true, 1))
        }, J.filter = Nt, J.flatten = function(n, t, e, r) {
            return typeof t != "boolean" && null != t && (r = e, e = typeof t != "function" && r && r[t] === n ? null : t, t = false), null != e && (n = Rt(n, e, r)), ut(n, t)
        }, J.forEach = St, J.forEachRight = Et, J.forIn = g, J.forInRight = function(n, t, e) {
            var r = [];
            g(n, function(n, t) {
                r.push(t, n)
            });
            var u = r.length;
            for (t = tt(t, e, 3); u-- && false !== t(r[u--], r[u], n););
            return n
        }, J.forOwn = h, J.forOwnRight = mt, J.functions = bt, J.groupBy = Le, J.indexBy = Me, J.initial = function(n, t, e) {
            var r = 0,
                u = n ? n.length : 0;
            if (typeof t != "number" && null != t) {
                var o = u;
                for (t = J.createCallback(t, e, 3); o-- && t(n[o], o, n);) r++
            } else r = null == t || e ? 1 : t || r;
            return p(n, 0, Se(Ie(0, u - r), u))
        }, J.intersection = function() {
            for (var e = [], r = -1, u = arguments.length, i = a(), f = st(), p = f === n, s = a(); ++r < u;) {
                var v = arguments[r];
                (Te(v) || yt(v)) && (e.push(v), i.push(p && v.length >= b && o(r ? e[r] : s)))
            }
            var p = e[0],
                h = -1,
                g = p ? p.length : 0,
                y = [];
            n: for (; ++h < g;) {
                var m = i[0],
                    v = p[h];
                if (0 > (m ? t(m, v) : f(s, v))) {
                    for (r = u, (m || s).push(v); --r;)
                        if (m = i[r], 0 > (m ? t(m, v) : f(e[r], v))) continue n;
                    y.push(v)
                }
            }
            for (; u--;)(m = i[u]) && c(m);
            return l(i), l(s), y
        }, J.invert = _t, J.invoke = function(n, t) {
            var e = p(arguments, 2),
                r = -1,
                u = typeof t == "function",
                o = n ? n.length : 0,
                i = Xt(typeof o == "number" ? o : 0);
            return St(n, function(n) {
                i[++r] = (u ? t : n[t]).apply(n, e)
            }), i
        }, J.keys = Fe, J.map = Rt, J.mapValues = function(n, t, e) {
            var r = {};
            return t = J.createCallback(t, e, 3), h(n, function(n, e, u) {
                r[e] = t(n, e, u)
            }), r
        }, J.max = At, J.memoize = function(n, t) {
            function e() {
                var r = e.cache,
                    u = t ? t.apply(this, arguments) : m + arguments[0];
                return me.call(r, u) ? r[u] : r[u] = n.apply(this, arguments)
            }
            if (!dt(n)) throw new ie;
            return e.cache = {}, e
        }, J.merge = function(n) {
            var t = arguments,
                e = 2;
            if (!wt(n)) return n;
            if ("number" != typeof t[2] && (e = t.length), 3 < e && "function" == typeof t[e - 2]) var r = tt(t[--e - 1], t[e--], 2);
            else 2 < e && "function" == typeof t[e - 1] && (r = t[--e]);
            for (var t = p(arguments, 1, e), u = -1, o = a(), i = a(); ++u < e;) it(n, t[u], r, o, i);
            return l(o), l(i), n
        }, J.min = function(n, t, e) {
            var u = 1 / 0,
                o = u;
            if (typeof t != "function" && e && e[t] === n && (t = null), null == t && Te(n)) {
                e = -1;
                for (var i = n.length; ++e < i;) {
                    var a = n[e];
                    a < o && (o = a)
                }
            } else t = null == t && kt(n) ? r : J.createCallback(t, e, 3), St(n, function(n, e, r) {
                e = t(n, e, r), e < u && (u = e, o = n)
            });
            return o
        }, J.omit = function(n, t, e) {
            var r = {};
            if (typeof t != "function") {
                var u = [];
                g(n, function(n, t) {
                    u.push(t)
                });
                for (var u = rt(u, ut(arguments, true, false, 1)), o = -1, i = u.length; ++o < i;) {
                    var a = u[o];
                    r[a] = n[a]
                }
            } else t = J.createCallback(t, e, 3), g(n, function(n, e, u) {
                t(n, e, u) || (r[e] = n)
            });
            return r
        }, J.once = function(n) {
            var t, e;
            if (!dt(n)) throw new ie;
            return function() {
                return t ? e : (t = true, e = n.apply(this, arguments), n = null, e)
            }
        }, J.pairs = function(n) {
            for (var t = -1, e = Fe(n), r = e.length, u = Xt(r); ++t < r;) {
                var o = e[t];
                u[t] = [o, n[o]]
            }
            return u
        }, J.partial = function(n) {
            return ct(n, 16, p(arguments, 1))
        }, J.partialRight = function(n) {
            return ct(n, 32, null, p(arguments, 1))
        }, J.pick = function(n, t, e) {
            var r = {};
            if (typeof t != "function")
                for (var u = -1, o = ut(arguments, true, false, 1), i = wt(n) ? o.length : 0; ++u < i;) {
                    var a = o[u];
                    a in n && (r[a] = n[a])
                } else t = J.createCallback(t, e, 3), g(n, function(n, e, u) {
                    t(n, e, u) && (r[e] = n)
                });
            return r
        }, J.pluck = Ve, J.property = Jt, J.pull = function(n) {
            for (var t = arguments, e = 0, r = t.length, u = n ? n.length : 0; ++e < r;)
                for (var o = -1, i = t[e]; ++o < u;) n[o] === i && (de.call(n, o--, 1), u--);
            return n
        }, J.range = function(n, t, e) {
            n = +n || 0, e = typeof e == "number" ? e : +e || 1, null == t && (t = n, n = 0);
            var r = -1;
            t = Ie(0, se((t - n) / (e || 1)));
            for (var u = Xt(t); ++r < t;) u[r] = n, n += e;
            return u
        }, J.reject = function(n, t, e) {
            return t = J.createCallback(t, e, 3), Nt(n, function(n, e, r) {
                return !t(n, e, r)
            })
        }, J.remove = function(n, t, e) {
            var r = -1,
                u = n ? n.length : 0,
                o = [];
            for (t = J.createCallback(t, e, 3); ++r < u;) e = n[r], t(e, r, n) && (o.push(e), de.call(n, r--, 1), u--);
            return o
        }, J.rest = qt, J.shuffle = Tt, J.sortBy = function(n, t, e) {
            var r = -1,
                o = Te(t),
                i = n ? n.length : 0,
                p = Xt(typeof i == "number" ? i : 0);
            for (o || (t = J.createCallback(t, e, 3)), St(n, function(n, e, u) {
                    var i = p[++r] = f();
                    o ? i.m = Rt(t, function(t) {
                        return n[t]
                    }) : (i.m = a())[0] = t(n, e, u), i.n = r, i.o = n
                }), i = p.length, p.sort(u); i--;) n = p[i], p[i] = n.o, o || l(n.m), c(n);
            return p
        }, J.tap = function(n, t) {
            return t(n), n
        }, J.throttle = function(n, t, e) {
            var r = true,
                u = true;
            if (!dt(n)) throw new ie;
            return false === e ? r = false : wt(e) && (r = "leading" in e ? e.leading : r, u = "trailing" in e ? e.trailing : u), L.leading = r, L.maxWait = t, L.trailing = u, Vt(n, t, L)
        }, J.times = function(n, t, e) {
            n = -1 < (n = +n) ? n : 0;
            var r = -1,
                u = Xt(n);
            for (t = tt(t, e, 1); ++r < n;) u[r] = t(r);
            return u
        }, J.toArray = function(n) {
            return n && typeof n.length == "number" ? p(n) : xt(n)
        }, J.transform = function(n, t, e, r) {
            var u = Te(n);
            if (null == e)
                if (u) e = [];
                else {
                    var o = n && n.constructor;
                    e = nt(o && o.prototype)
                }
            return t && (t = J.createCallback(t, r, 4), (u ? St : h)(n, function(n, r, u) {
                return t(e, n, r, u)
            })), e
        }, J.union = function() {
            return ft(ut(arguments, true, true))
        }, J.uniq = Pt, J.values = xt, J.where = Nt, J.without = function(n) {
            return rt(n, p(arguments, 1))
        }, J.wrap = function(n, t) {
            return ct(t, 16, [n])
        }, J.xor = function() {
            for (var n = -1, t = arguments.length; ++n < t;) {
                var e = arguments[n];
                if (Te(e) || yt(e)) var r = r ? ft(rt(r, e).concat(rt(e, r))) : e
            }
            return r || []
        }, J.zip = Kt, J.zipObject = Lt, J.collect = Rt, J.drop = qt, J.each = St, J.eachRight = Et, J.extend = U, J.methods = bt, J.object = Lt, J.select = Nt, J.tail = qt, J.unique = Pt, J.unzip = Kt, Gt(J), J.clone = function(n, t, e, r) {
            return typeof t != "boolean" && null != t && (r = e, e = t, t = false), Z(n, t, typeof e == "function" && tt(e, r, 1))
        }, J.cloneDeep = function(n, t, e) {
            return Z(n, true, typeof t == "function" && tt(t, e, 1))
        }, J.contains = Ct, J.escape = function(n) {
            return null == n ? "" : oe(n).replace(ze, pt)
        }, J.every = Ot, J.find = It, J.findIndex = function(n, t, e) {
            var r = -1,
                u = n ? n.length : 0;
            for (t = J.createCallback(t, e, 3); ++r < u;)
                if (t(n[r], r, n)) return r;
            return -1
        }, J.findKey = function(n, t, e) {
            var r;
            return t = J.createCallback(t, e, 3), h(n, function(n, e, u) {
                return t(n, e, u) ? (r = e, false) : void 0
            }), r
        }, J.findLast = function(n, t, e) {
            var r;
            return t = J.createCallback(t, e, 3), Et(n, function(n, e, u) {
                return t(n, e, u) ? (r = n, false) : void 0
            }), r
        }, J.findLastIndex = function(n, t, e) {
            var r = n ? n.length : 0;
            for (t = J.createCallback(t, e, 3); r--;)
                if (t(n[r], r, n)) return r;
            return -1
        }, J.findLastKey = function(n, t, e) {
            var r;
            return t = J.createCallback(t, e, 3), mt(n, function(n, e, u) {
                return t(n, e, u) ? (r = e, false) : void 0
            }), r
        }, J.has = function(n, t) {
            return n ? me.call(n, t) : false
        }, J.identity = Ut, J.indexOf = Wt, J.isArguments = yt, J.isArray = Te, J.isBoolean = function(n) {
            return true === n || false === n || n && typeof n == "object" && ce.call(n) == T || false
        }, J.isDate = function(n) {
            return n && typeof n == "object" && ce.call(n) == F || false
        }, J.isElement = function(n) {
            return n && 1 === n.nodeType || false
        }, J.isEmpty = function(n) {
            var t = true;
            if (!n) return t;
            var e = ce.call(n),
                r = n.length;
            return e == $ || e == P || e == D || e == q && typeof r == "number" && dt(n.splice) ? !r : (h(n, function() {
                return t = false
            }), t)
        }, J.isEqual = function(n, t, e, r) {
            return ot(n, t, typeof e == "function" && tt(e, r, 2))
        }, J.isFinite = function(n) {
            return Ce(n) && !Oe(parseFloat(n))
        }, J.isFunction = dt, J.isNaN = function(n) {
            return jt(n) && n != +n
        }, J.isNull = function(n) {
            return null === n
        }, J.isNumber = jt, J.isObject = wt, J.isPlainObject = Pe, J.isRegExp = function(n) {
            return n && typeof n == "object" && ce.call(n) == z || false
        }, J.isString = kt, J.isUndefined = function(n) {
            return typeof n == "undefined"
        }, J.lastIndexOf = function(n, t, e) {
            var r = n ? n.length : 0;
            for (typeof e == "number" && (r = (0 > e ? Ie(0, r + e) : Se(e, r - 1)) + 1); r--;)
                if (n[r] === t) return r;
            return -1
        }, J.mixin = Gt, J.noConflict = function() {
            return e._ = le, this
        }, J.noop = Ht, J.now = Ue, J.parseInt = Ge, J.random = function(n, t, e) {
            var r = null == n,
                u = null == t;
            return null == e && (typeof n == "boolean" && u ? (e = n, n = 1) : u || typeof t != "boolean" || (e = t, u = true)), r && u && (t = 1), n = +n || 0, u ? (t = n, n = 0) : t = +t || 0, e || n % 1 || t % 1 ? (e = Re(), Se(n + e * (t - n + parseFloat("1e-" + ((e + "").length - 1))), t)) : at(n, t)
        }, J.reduce = Dt, J.reduceRight = $t, J.result = function(n, t) {
            if (n) {
                var e = n[t];
                return dt(e) ? n[t]() : e
            }
        }, J.runInContext = s, J.size = function(n) {
            var t = n ? n.length : 0;
            return typeof t == "number" ? t : Fe(n).length
        }, J.some = Ft, J.sortedIndex = zt, J.template = function(n, t, e) {
            var r = J.templateSettings;
            n = oe(n || ""), e = _({}, e, r);
            var u, o = _({}, e.imports, r.imports),
                r = Fe(o),
                o = xt(o),
                a = 0,
                f = e.interpolate || S,
                l = "__p+='",
                f = ue((e.escape || S).source + "|" + f.source + "|" + (f === N ? x : S).source + "|" + (e.evaluate || S).source + "|$", "g");
            n.replace(f, function(t, e, r, o, f, c) {
                return r || (r = o), l += n.slice(a, c).replace(R, i), e && (l += "'+__e(" + e + ")+'"), f && (u = true, l += "';" + f + ";\n__p+='"), r && (l += "'+((__t=(" + r + "))==null?'':__t)+'"), a = c + t.length, t
            }), l += "';", f = e = e.variable, f || (e = "obj", l = "with(" + e + "){" + l + "}"), l = (u ? l.replace(w, "") : l).replace(j, "$1").replace(k, "$1;"), l = "function(" + e + "){" + (f ? "" : e + "||(" + e + "={});") + "var __t,__p='',__e=_.escape" + (u ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + l + "return __p}";
            try {
                var c = ne(r, "return " + l).apply(v, o)
            } catch (p) {
                throw p.source = l, p
            }
            return t ? c(t) : (c.source = l, c)
        }, J.unescape = function(n) {
            return null == n ? "" : oe(n).replace(qe, gt)
        }, J.uniqueId = function(n) {
            var t = ++y;
            return oe(null == n ? "" : n) + t
        }, J.all = Ot, J.any = Ft, J.detect = It, J.findWhere = It, J.foldl = Dt, J.foldr = $t, J.include = Ct, J.inject = Dt, Gt(function() {
            var n = {};
            return h(J, function(t, e) {
                J.prototype[e] || (n[e] = t)
            }), n
        }(), false), J.first = Bt, J.last = function(n, t, e) {
            var r = 0,
                u = n ? n.length : 0;
            if (typeof t != "number" && null != t) {
                var o = u;
                for (t = J.createCallback(t, e, 3); o-- && t(n[o], o, n);) r++
            } else if (r = t, null == r || e) return n ? n[u - 1] : v;
            return p(n, Ie(0, u - r))
        }, J.sample = function(n, t, e) {
            return n && typeof n.length != "number" && (n = xt(n)), null == t || e ? n ? n[at(0, n.length - 1)] : v : (n = Tt(n), n.length = Se(Ie(0, t), n.length), n)
        }, J.take = Bt, J.head = Bt, h(J, function(n, t) {
            var e = "sample" !== t;
            J.prototype[t] || (J.prototype[t] = function(t, r) {
                var u = this.__chain__,
                    o = n(this.__wrapped__, t, r);
                return u || null != t && (!r || e && typeof t == "function") ? new Q(o, u) : o
            })
        }), J.VERSION = "2.4.1", J.prototype.chain = function() {
            return this.__chain__ = true, this
        }, J.prototype.toString = function() {
            return oe(this.__wrapped__)
        }, J.prototype.value = Qt, J.prototype.valueOf = Qt, St(["join", "pop", "shift"], function(n) {
            var t = ae[n];
            J.prototype[n] = function() {
                var n = this.__chain__,
                    e = t.apply(this.__wrapped__, arguments);
                return n ? new Q(e, n) : e
            }
        }), St(["push", "reverse", "sort", "unshift"], function(n) {
            var t = ae[n];
            J.prototype[n] = function() {
                return t.apply(this.__wrapped__, arguments), this
            }
        }), St(["concat", "slice", "splice"], function(n) {
            var t = ae[n];
            J.prototype[n] = function() {
                return new Q(t.apply(this.__wrapped__, arguments), this.__chain__)
            }
        }), J
    }
    var v, h = [],
        g = [],
        y = 0,
        m = +new Date + "",
        b = 75,
        _ = 40,
        d = " \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",
        w = /\b__p\+='';/g,
        j = /\b(__p\+=)''\+/g,
        k = /(__e\(.*?\)|\b__t\))\+'';/g,
        x = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
        C = /\w*$/,
        O = /^\s*function[ \n\r\t]+\w/,
        N = /<%=([\s\S]+?)%>/g,
        I = RegExp("^[" + d + "]*0+(?=.$)"),
        S = /($^)/,
        E = /\bthis\b/,
        R = /['\n\r\t\u2028\u2029\\]/g,
        A = "Array Boolean Date Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setTimeout".split(" "),
        D = "[object Arguments]",
        $ = "[object Array]",
        T = "[object Boolean]",
        F = "[object Date]",
        B = "[object Function]",
        W = "[object Number]",
        q = "[object Object]",
        z = "[object RegExp]",
        P = "[object String]",
        K = {};
    K[B] = false, K[D] = K[$] = K[T] = K[F] = K[W] = K[q] = K[z] = K[P] = true;
    var L = {
            leading: false,
            maxWait: 0,
            trailing: false
        },
        M = {
            configurable: false,
            enumerable: false,
            value: null,
            writable: false
        },
        V = {
            "boolean": false,
            "function": true,
            object: true,
            number: false,
            string: false,
            undefined: false
        },
        U = {
            "\\": "\\",
            "'": "'",
            "\n": "n",
            "\r": "r",
            "\t": "t",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        G = V[typeof window] && window || this,
        H = V[typeof exports] && exports && !exports.nodeType && exports,
        J = V[typeof module] && module && !module.nodeType && module,
        Q = J && J.exports === H && H,
        X = V[typeof global] && global;
    !X || X.global !== X && X.window !== X || (G = X);
    var Y = s();
    typeof define == "function" && typeof define.amd == "object" && define.amd ? (G._ = Y, define(function() {
        return Y
    })) : H && J ? Q ? (J.exports = Y)._ = Y : H._ = Y : G._ = Y
}).call(this);
((function($) {
    "use strict";
    $.fn.midnight = function(customOptions) {
        if (typeof customOptions !== "object") {
            customOptions = {};
        }
        return this.each(function() {
            var settings = {
                headerClass: 'midnightHeader',
                innerClass: 'midnightInner',
                defaultClass: 'default',
                classPrefix: ''
            };
            $.extend(settings, customOptions);
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var documentHeight = $(document).height();
            var $originalHeader = $(this);
            var headers = {};
            var headerInfo = {
                top: 0,
                height: $originalHeader.outerHeight()
            };
            var $sections = $('[data-midnight]');
            var sections = [];
            var getSupportedTransform = function() {
                var prefixes = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
                for (var ix = 0; ix < prefixes.length; ix++) {
                    if (document.createElement('div').style[prefixes[ix]] !== undefined) {
                        return prefixes[ix];
                    }
                }
                return false;
            }
            var transformMode = getSupportedTransform();
            if ($sections.length == 0) {
                return;
            }
            var getContainerHeight = function() {
                var $customHeaders = $originalHeader.find('> .' + settings['headerClass']);
                var maxHeight = 0;
                var height = 0;
                if ($customHeaders.length) {
                    $customHeaders.each(function() {
                        var $header = $(this);
                        var $inner = $header.find('> .' + settings['innerClass']);
                        if ($inner.length) {
                            $inner.css('bottom', 'auto');
                            height = $inner.outerHeight();
                            $inner.css('bottom', '0');
                        } else {
                            $header.css('bottom', 'auto');
                            height = $header.outerHeight();
                            $header.css('bottom', '0');
                        }
                        maxHeight = (height > maxHeight) ? height : maxHeight;
                    });
                } else {
                    maxHeight = height = $originalHeader.outerHeight();
                }
                return maxHeight;
            };
            var updateHeaderHeight = function() {
                headerInfo.height = getContainerHeight();
                $originalHeader.css('height', headerInfo.height + 'px');
            };
            var setupHeaders = function() {
                headers['default'] = {};
                $sections.each(function() {
                    var $section = $(this);
                    var headerClass = $section.data('midnight');
                    if (typeof headerClass !== 'string') {
                        return;
                    }
                    headerClass = headerClass.trim();
                    if (headerClass === '') {
                        return;
                    }
                    headers[headerClass] = {};
                });
                var defaultPaddings = {
                    top: $originalHeader.css("padding-top"),
                    right: $originalHeader.css("padding-right"),
                    bottom: $originalHeader.css("padding-bottom"),
                    left: $originalHeader.css("padding-left")
                };
                $originalHeader.css({
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    overflow: 'hidden'
                });
                updateHeaderHeight();
                var $customHeaders = $originalHeader.find('> .' + settings['headerClass']);
                if ($customHeaders.length) {
                    if (!$customHeaders.filter('.' + settings['defaultClass']).length) {
                        $customHeaders.filter('.' + settings['headerClass'] + ':first').clone(true, true).attr('class', settings['headerClass'] + ' ' + settings['defaultClass']);
                    }
                } else {
                    $originalHeader.wrapInner('<div class="' + settings['headerClass'] + ' ' + settings['defaultClass'] + '"></div>');
                }
                var $customHeaders = $originalHeader.find('> .' + settings['headerClass']);
                var $defaultHeader = $customHeaders.filter('.' + settings['defaultClass']).clone(true, true);
                for (var headerClass in headers) {
                    if (!headers.hasOwnProperty(headerClass)) {
                        continue;
                    }
                    if (typeof headers[headerClass].element === 'undefined') {
                        var $existingHeader = $customHeaders.filter('.' + headerClass);
                        if ($existingHeader.length) {
                            headers[headerClass].element = $existingHeader;
                        } else {
                            headers[headerClass].element = $defaultHeader.clone(true, true).removeClass(settings['defaultClass']).addClass(headerClass).appendTo($originalHeader);
                        }
                        var resetStyles = {
                            position: 'absolute',
                            overflow: 'hidden',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        };
                        headers[headerClass].element.css(resetStyles);
                        if (transformMode !== false) {
                            headers[headerClass].element.css(transformMode, 'translateZ(0)');
                        }
                        if (!headers[headerClass].element.find('> .' + settings['innerClass']).length) {
                            headers[headerClass].element.wrapInner('<div class="' + settings['innerClass'] + '"></div>');
                        }
                        headers[headerClass].inner = headers[headerClass].element.find('> .' + settings['innerClass'])
                        headers[headerClass].inner.css(resetStyles);
                        if (transformMode !== false) {
                            headers[headerClass].inner.css(transformMode, 'translateZ(0)');
                        }
                        headers[headerClass].from = '';
                        headers[headerClass].progress = 0.0;
                    }
                }
                $customHeaders.each(function() {
                    var $header = $(this);
                    var hasAnyClass = false;
                    for (var headerClass in headers) {
                        if (!headers.hasOwnProperty(headerClass)) {
                            continue;
                        }
                        if ($header.hasClass(headerClass)) {
                            hasAnyClass = true;
                        }
                    }
                    if (!$header.find('> .' + settings['innerClass']).length) {
                        $header.wrapInner('<div class="' + settings['innerClass'] + '"></div>');
                    }
                    if (!hasAnyClass) {
                        $header.hide();
                    }
                });
            };
            setupHeaders();
            var recalculateSections = function() {
                documentHeight = $(document).height();
                sections = [];
                for (var ix = 0; ix < $sections.length; ix++) {
                    var $section = $($sections[ix]);
                    sections.push({
                        element: $section,
                        className: $section.data('midnight'),
                        start: $section.offset().top,
                        end: $section.offset().top + $section.outerHeight()
                    });
                }
            };
            setInterval(recalculateSections, 1000);
            var recalculateHeaders = function() {
                scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                scrollTop = Math.max(scrollTop, 0);
                scrollTop = Math.min(scrollTop, documentHeight);
                var headerHeight = headerInfo.height;
                var headerStart = scrollTop + headerInfo.top;
                var headerEnd = scrollTop + headerInfo.top + headerHeight;
                for (var headerClass in headers) {
                    if (!headers.hasOwnProperty(headerClass)) {
                        continue;
                    }
                    headers[headerClass].from = '';
                    headers[headerClass].progress = 0.0;
                }
                for (var ix = 0; ix < sections.length; ix++) {
                    if (headerEnd >= sections[ix].start && headerStart <= sections[ix].end) {
                        headers[sections[ix].className].visible = true;
                        if (headerStart >= sections[ix].start && headerEnd <= sections[ix].end) {
                            headers[sections[ix].className].from = 'top';
                            headers[sections[ix].className].progress += 1.0;
                        } else if (headerEnd > sections[ix].end && headerStart < sections[ix].end) {
                            headers[sections[ix].className].from = 'top';
                            headers[sections[ix].className].progress = 1.0 - (headerEnd - sections[ix].end) / headerHeight;
                        } else if (headerEnd > sections[ix].start && headerStart < sections[ix].start) {
                            if (headers[sections[ix].className].from === 'top') {
                                headers[sections[ix].className].progress += (headerEnd - sections[ix].start) / headerHeight;
                            } else {
                                headers[sections[ix].className].from = 'bottom';
                                headers[sections[ix].className].progress = (headerEnd - sections[ix].start) / headerHeight;
                            }
                        }
                    }
                }
            };
            var updateHeaders = function() {
                var totalProgress = 0.0;
                var lastActiveClass = '';
                for (var headerClass in headers) {
                    if (!headers.hasOwnProperty(headerClass)) {
                        continue;
                    }
                    if (!headers[headerClass].from === '') {
                        continue;
                    }
                    totalProgress += headers[headerClass].progress;
                    lastActiveClass = headerClass;
                }
                if (totalProgress < 1.0) {
                    if (headers[settings['defaultClass']].from === '') {
                        headers[settings['defaultClass']].from = (headers[lastActiveClass].from === 'top') ? 'bottom' : 'top';
                        headers[settings['defaultClass']].progress = 1.0 - totalProgress;
                    } else {
                        headers[settings['defaultClass']].progress += 1.0 - totalProgress;
                    }
                }
                for (var ix in headers) {
                    if (!headers.hasOwnProperty(ix)) {
                        continue;
                    }
                    if (!headers[ix].from === '') {
                        continue;
                    }
                    var offset = (1.0 - headers[ix].progress) * 100.0;
                    if (headers[ix].from === 'top') {
                        if (transformMode !== false) {
                            headers[ix].element[0].style[transformMode] = 'translateY(-' + offset + '%) translateZ(0)';
                            headers[ix].inner[0].style[transformMode] = 'translateY(+' + offset + '%) translateZ(0)';
                        } else {
                            headers[ix].element[0].style['top'] = '-' + offset + '%';
                            headers[ix].inner[0].style['top'] = '+' + offset + '%';
                        }
                    } else {
                        if (transformMode !== false) {
                            headers[ix].element[0].style[transformMode] = 'translateY(+' + offset + '%) translateZ(0)';
                            headers[ix].inner[0].style[transformMode] = 'translateY(-' + offset + '%) translateZ(0)';
                        } else {
                            headers[ix].element.style['top'] = '+' + offset + '%';
                            headers[ix].inner.style['top'] = '-' + offset + '%';
                        }
                    }
                }
            };
            $(window).resize(function() {
                recalculateSections();
                updateHeaderHeight();
                recalculateHeaders();
                updateHeaders();
            }).trigger('resize');
            var requestAnimationFrame = window.requestAnimationFrame || (function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
            var updateHeadersLoop = function() {
                requestAnimationFrame(updateHeadersLoop);
                recalculateHeaders();
                updateHeaders();
            };
            updateHeadersLoop();
        });
    };
})(jQuery));
"function" !== typeof Object.create && (Object.create = function(f) {
    function g() {}
    g.prototype = f;
    return new g
});
(function(f, g, k) {
    var l = {
        init: function(a, b) {
            this.$elem = f(b);
            this.options = f.extend({}, f.fn.owlCarousel.options, this.$elem.data(), a);
            this.userOptions = a;
            this.loadContent()
        },
        loadContent: function() {
            function a(a) {
                var d, e = "";
                if ("function" === typeof b.options.jsonSuccess) b.options.jsonSuccess.apply(this, [a]);
                else {
                    for (d in a.owl) a.owl.hasOwnProperty(d) && (e += a.owl[d].item);
                    b.$elem.html(e)
                }
                b.logIn()
            }
            var b = this,
                e;
            "function" === typeof b.options.beforeInit && b.options.beforeInit.apply(this, [b.$elem]);
            "string" === typeof b.options.jsonPath ? (e = b.options.jsonPath, f.getJSON(e, a)) : b.logIn()
        },
        logIn: function() {
            this.$elem.data("owl-originalStyles", this.$elem.attr("style"));
            this.$elem.data("owl-originalClasses", this.$elem.attr("class"));
            this.$elem.css({
                opacity: 0
            });
            this.orignalItems = this.options.items;
            this.checkBrowser();
            this.wrapperWidth = 0;
            this.checkVisible = null;
            this.setVars()
        },
        setVars: function() {
            if (0 === this.$elem.children().length) return !1;
            this.baseClass();
            this.eventTypes();
            this.$userItems = this.$elem.children();
            this.itemsAmount = this.$userItems.length;
            this.wrapItems();
            this.$owlItems = this.$elem.find(".owl-item");
            this.$owlWrapper = this.$elem.find(".owl-wrapper");
            this.playDirection = "next";
            this.prevItem = 0;
            this.prevArr = [0];
            this.currentItem = 0;
            this.customEvents();
            this.onStartup()
        },
        onStartup: function() {
            this.updateItems();
            this.calculateAll();
            this.buildControls();
            this.updateControls();
            this.response();
            this.moveEvents();
            this.stopOnHover();
            this.owlStatus();
            !1 !== this.options.transitionStyle && this.transitionTypes(this.options.transitionStyle);
            !0 === this.options.autoPlay && (this.options.autoPlay = 5E3);
            this.play();
            this.$elem.find(".owl-wrapper").css("display", "block");
            this.$elem.is(":visible") ? this.$elem.css("opacity", 1) : this.watchVisibility();
            this.onstartup = !1;
            this.eachMoveUpdate();
            "function" === typeof this.options.afterInit && this.options.afterInit.apply(this, [this.$elem])
        },
        eachMoveUpdate: function() {
            !0 === this.options.lazyLoad && this.lazyLoad();
            !0 === this.options.autoHeight && this.autoHeight();
            this.onVisibleItems();
            "function" === typeof this.options.afterAction && this.options.afterAction.apply(this, [this.$elem])
        },
        updateVars: function() {
            "function" === typeof this.options.beforeUpdate && this.options.beforeUpdate.apply(this, [this.$elem]);
            this.watchVisibility();
            this.updateItems();
            this.calculateAll();
            this.updatePosition();
            this.updateControls();
            this.eachMoveUpdate();
            "function" === typeof this.options.afterUpdate && this.options.afterUpdate.apply(this, [this.$elem])
        },
        reload: function() {
            var a = this;
            g.setTimeout(function() {
                a.updateVars()
            }, 0)
        },
        watchVisibility: function() {
            var a = this;
            if (!1 === a.$elem.is(":visible")) a.$elem.css({
                opacity: 0
            }), g.clearInterval(a.autoPlayInterval), g.clearInterval(a.checkVisible);
            else return !1;
            a.checkVisible = g.setInterval(function() {
                a.$elem.is(":visible") && (a.reload(), a.$elem.animate({
                    opacity: 1
                }, 200), g.clearInterval(a.checkVisible))
            }, 500)
        },
        wrapItems: function() {
            this.$userItems.wrapAll('<div class="owl-wrapper">').wrap('<div class="owl-item"></div>');
            this.$elem.find(".owl-wrapper").wrap('<div class="owl-wrapper-outer">');
            this.wrapperOuter = this.$elem.find(".owl-wrapper-outer");
            this.$elem.css("display", "block")
        },
        baseClass: function() {
            var a = this.$elem.hasClass(this.options.baseClass),
                b = this.$elem.hasClass(this.options.theme);
            a || this.$elem.addClass(this.options.baseClass);
            b || this.$elem.addClass(this.options.theme)
        },
        updateItems: function() {
            var a, b;
            if (!1 === this.options.responsive) return !1;
            if (!0 === this.options.singleItem) return this.options.items = this.orignalItems = 1, this.options.itemsCustom = !1, this.options.itemsDesktop = !1, this.options.itemsDesktopSmall = !1, this.options.itemsTablet = !1, this.options.itemsTabletSmall = !1, this.options.itemsMobile = !1;
            a = f(this.options.responsiveBaseWidth).width();
            a > (this.options.itemsDesktop[0] || this.orignalItems) && (this.options.items = this.orignalItems);
            if (!1 !== this.options.itemsCustom)
                for (this.options.itemsCustom.sort(function(a, b) {
                        return a[0] - b[0]
                    }), b = 0; b < this.options.itemsCustom.length; b += 1) this.options.itemsCustom[b][0] <= a && (this.options.items = this.options.itemsCustom[b][1]);
            else a <= this.options.itemsDesktop[0] && !1 !== this.options.itemsDesktop && (this.options.items = this.options.itemsDesktop[1]), a <= this.options.itemsDesktopSmall[0] && !1 !== this.options.itemsDesktopSmall && (this.options.items = this.options.itemsDesktopSmall[1]), a <= this.options.itemsTablet[0] && !1 !== this.options.itemsTablet && (this.options.items = this.options.itemsTablet[1]), a <= this.options.itemsTabletSmall[0] && !1 !== this.options.itemsTabletSmall && (this.options.items = this.options.itemsTabletSmall[1]), a <= this.options.itemsMobile[0] && !1 !== this.options.itemsMobile && (this.options.items = this.options.itemsMobile[1]);
            this.options.items > this.itemsAmount && !0 === this.options.itemsScaleUp && (this.options.items = this.itemsAmount)
        },
        response: function() {
            var a = this,
                b, e;
            if (!0 !== a.options.responsive) return !1;
            e = f(g).width();
            a.resizer = function() {
                f(g).width() !== e && (!1 !== a.options.autoPlay && g.clearInterval(a.autoPlayInterval), g.clearTimeout(b), b = g.setTimeout(function() {
                    e = f(g).width();
                    a.updateVars()
                }, a.options.responsiveRefreshRate))
            };
            f(g).resize(a.resizer)
        },
        updatePosition: function() {
            this.jumpTo(this.currentItem);
            !1 !== this.options.autoPlay && this.checkAp()
        },
        appendItemsSizes: function() {
            var a = this,
                b = 0,
                e = a.itemsAmount - a.options.items;
            a.$owlItems.each(function(c) {
                var d = f(this);
                d.css({
                    width: a.itemWidth
                }).data("owl-item", Number(c));
                if (0 === c % a.options.items || c === e) c > e || (b += 1);
                d.data("owl-roundPages", b)
            })
        },
        appendWrapperSizes: function() {
            this.$owlWrapper.css({
                width: this.$owlItems.length * this.itemWidth * 2,
                left: 0
            });
            this.appendItemsSizes()
        },
        calculateAll: function() {
            this.calculateWidth();
            this.appendWrapperSizes();
            this.loops();
            this.max()
        },
        calculateWidth: function() {
            this.itemWidth = Math.round(this.$elem.width() / this.options.items)
        },
        max: function() {
            var a = -1 * (this.itemsAmount * this.itemWidth - this.options.items * this.itemWidth);
            this.options.items > this.itemsAmount ? this.maximumPixels = a = this.maximumItem = 0 : (this.maximumItem = this.itemsAmount - this.options.items, this.maximumPixels = a);
            return a
        },
        min: function() {
            return 0
        },
        loops: function() {
            var a = 0,
                b = 0,
                e, c;
            this.positionsInArray = [0];
            this.pagesInArray = [];
            for (e = 0; e < this.itemsAmount; e += 1) b += this.itemWidth, this.positionsInArray.push(-b), !0 === this.options.scrollPerPage && (c = f(this.$owlItems[e]), c = c.data("owl-roundPages"), c !== a && (this.pagesInArray[a] = this.positionsInArray[e], a = c))
        },
        buildControls: function() {
            if (!0 === this.options.navigation || !0 === this.options.pagination) this.owlControls = f('<div class="owl-controls"/>').toggleClass("clickable", !this.browser.isTouch).appendTo(this.$elem);
            !0 === this.options.pagination && this.buildPagination();
            !0 === this.options.navigation && this.buildButtons()
        },
        buildButtons: function() {
            var a = this,
                b = f('<div class="owl-buttons"/>');
            a.owlControls.append(b);
            a.buttonPrev = f("<div/>", {
                "class": "owl-prev",
                html: a.options.navigationText[0] || ""
            });
            a.buttonNext = f("<div/>", {
                "class": "owl-next",
                html: a.options.navigationText[1] || ""
            });
            b.append(a.buttonPrev).append(a.buttonNext);
            b.on("touchstart.owlControls mousedown.owlControls", 'div[class^="owl"]', function(a) {
                a.preventDefault()
            });
            b.on("touchend.owlControls mouseup.owlControls", 'div[class^="owl"]', function(b) {
                b.preventDefault();
                f(this).hasClass("owl-next") ? a.next() : a.prev()
            })
        },
        buildPagination: function() {
            var a = this;
            a.paginationWrapper = f('<div class="owl-pagination"/>');
            a.owlControls.append(a.paginationWrapper);
            a.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(b) {
                b.preventDefault();
                Number(f(this).data("owl-page")) !== a.currentItem && a.goTo(Number(f(this).data("owl-page")), !0)
            })
        },
        updatePagination: function() {
            var a, b, e, c, d, g;
            if (!1 === this.options.pagination) return !1;
            this.paginationWrapper.html("");
            a = 0;
            b = this.itemsAmount - this.itemsAmount % this.options.items;
            for (c = 0; c < this.itemsAmount; c += 1) 0 === c % this.options.items && (a += 1, b === c && (e = this.itemsAmount - this.options.items), d = f("<div/>", {
                "class": "owl-page"
            }), g = f("<span></span>", {
                text: !0 === this.options.paginationNumbers ? a : "",
                "class": !0 === this.options.paginationNumbers ? "owl-numbers" : ""
            }), d.append(g), d.data("owl-page", b === c ? e : c), d.data("owl-roundPages", a), this.paginationWrapper.append(d));
            this.checkPagination()
        },
        checkPagination: function() {
            var a = this;
            if (!1 === a.options.pagination) return !1;
            a.paginationWrapper.find(".owl-page").each(function() {
                f(this).data("owl-roundPages") === f(a.$owlItems[a.currentItem]).data("owl-roundPages") && (a.paginationWrapper.find(".owl-page").removeClass("active"), f(this).addClass("active"))
            })
        },
        checkNavigation: function() {
            if (!1 === this.options.navigation) return !1;
            !1 === this.options.rewindNav && (0 === this.currentItem && 0 === this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.addClass("disabled")) : 0 === this.currentItem && 0 !== this.maximumItem ? (this.buttonPrev.addClass("disabled"), this.buttonNext.removeClass("disabled")) : this.currentItem === this.maximumItem ? (this.buttonPrev.removeClass("disabled"), this.buttonNext.addClass("disabled")) : 0 !== this.currentItem && this.currentItem !== this.maximumItem && (this.buttonPrev.removeClass("disabled"), this.buttonNext.removeClass("disabled")))
        },
        updateControls: function() {
            this.updatePagination();
            this.checkNavigation();
            this.owlControls && (this.options.items >= this.itemsAmount ? this.owlControls.hide() : this.owlControls.show())
        },
        destroyControls: function() {
            this.owlControls && this.owlControls.remove()
        },
        next: function(a) {
            if (this.isTransition) return !1;
            this.currentItem += !0 === this.options.scrollPerPage ? this.options.items : 1;
            if (this.currentItem > this.maximumItem + (!0 === this.options.scrollPerPage ? this.options.items - 1 : 0))
                if (!0 === this.options.rewindNav) this.currentItem = 0, a = "rewind";
                else return this.currentItem = this.maximumItem, !1;
            this.goTo(this.currentItem, a)
        },
        prev: function(a) {
            if (this.isTransition) return !1;
            this.currentItem = !0 === this.options.scrollPerPage && 0 < this.currentItem && this.currentItem < this.options.items ? 0 : this.currentItem - (!0 === this.options.scrollPerPage ? this.options.items : 1);
            if (0 > this.currentItem)
                if (!0 === this.options.rewindNav) this.currentItem = this.maximumItem, a = "rewind";
                else return this.currentItem = 0, !1;
            this.goTo(this.currentItem, a)
        },
        goTo: function(a, b, e) {
            var c = this;
            if (c.isTransition) return !1;
            "function" === typeof c.options.beforeMove && c.options.beforeMove.apply(this, [c.$elem]);
            a >= c.maximumItem ? a = c.maximumItem : 0 >= a && (a = 0);
            c.currentItem = c.owl.currentItem = a;
            if (!1 !== c.options.transitionStyle && "drag" !== e && 1 === c.options.items && !0 === c.browser.support3d) return c.swapSpeed(0), !0 === c.browser.support3d ? c.transition3d(c.positionsInArray[a]) : c.css2slide(c.positionsInArray[a], 1), c.afterGo(), c.singleItemTransition(), !1;
            a = c.positionsInArray[a];
            !0 === c.browser.support3d ? (c.isCss3Finish = !1, !0 === b ? (c.swapSpeed("paginationSpeed"), g.setTimeout(function() {
                c.isCss3Finish = !0
            }, c.options.paginationSpeed)) : "rewind" === b ? (c.swapSpeed(c.options.rewindSpeed), g.setTimeout(function() {
                c.isCss3Finish = !0
            }, c.options.rewindSpeed)) : (c.swapSpeed("slideSpeed"), g.setTimeout(function() {
                c.isCss3Finish = !0
            }, c.options.slideSpeed)), c.transition3d(a)) : !0 === b ? c.css2slide(a, c.options.paginationSpeed) : "rewind" === b ? c.css2slide(a, c.options.rewindSpeed) : c.css2slide(a, c.options.slideSpeed);
            c.afterGo()
        },
        jumpTo: function(a) {
            "function" === typeof this.options.beforeMove && this.options.beforeMove.apply(this, [this.$elem]);
            a >= this.maximumItem || -1 === a ? a = this.maximumItem : 0 >= a && (a = 0);
            this.swapSpeed(0);
            !0 === this.browser.support3d ? this.transition3d(this.positionsInArray[a]) : this.css2slide(this.positionsInArray[a], 1);
            this.currentItem = this.owl.currentItem = a;
            this.afterGo()
        },
        afterGo: function() {
            this.prevArr.push(this.currentItem);
            this.prevItem = this.owl.prevItem = this.prevArr[this.prevArr.length - 2];
            this.prevArr.shift(0);
            this.prevItem !== this.currentItem && (this.checkPagination(), this.checkNavigation(), this.eachMoveUpdate(), !1 !== this.options.autoPlay && this.checkAp());
            "function" === typeof this.options.afterMove && this.prevItem !== this.currentItem && this.options.afterMove.apply(this, [this.$elem])
        },
        stop: function() {
            this.apStatus = "stop";
            g.clearInterval(this.autoPlayInterval)
        },
        checkAp: function() {
            "stop" !== this.apStatus && this.play()
        },
        play: function() {
            var a = this;
            a.apStatus = "play";
            if (!1 === a.options.autoPlay) return !1;
            g.clearInterval(a.autoPlayInterval);
            a.autoPlayInterval = g.setInterval(function() {
                a.next(!0)
            }, a.options.autoPlay)
        },
        swapSpeed: function(a) {
            "slideSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.slideSpeed)) : "paginationSpeed" === a ? this.$owlWrapper.css(this.addCssSpeed(this.options.paginationSpeed)) : "string" !== typeof a && this.$owlWrapper.css(this.addCssSpeed(a))
        },
        addCssSpeed: function(a) {
            return {
                "-webkit-transition": "all " + a + "ms ease",
                "-moz-transition": "all " + a + "ms ease",
                "-o-transition": "all " + a + "ms ease",
                transition: "all " + a + "ms ease"
            }
        },
        removeTransition: function() {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                transition: ""
            }
        },
        doTranslate: function(a) {
            return {
                "-webkit-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + a + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + a + "px, 0px, 0px)",
                transform: "translate3d(" + a + "px, 0px,0px)"
            }
        },
        transition3d: function(a) {
            this.$owlWrapper.css(this.doTranslate(a))
        },
        css2move: function(a) {
            this.$owlWrapper.css({
                left: a
            })
        },
        css2slide: function(a, b) {
            var e = this;
            e.isCssFinish = !1;
            e.$owlWrapper.stop(!0, !0).animate({
                left: a
            }, {
                duration: b || e.options.slideSpeed,
                complete: function() {
                    e.isCssFinish = !0
                }
            })
        },
        checkBrowser: function() {
            var a = k.createElement("div");
            a.style.cssText = "  -moz-transform:translate3d(0px, 0px, 0px); -ms-transform:translate3d(0px, 0px, 0px); -o-transform:translate3d(0px, 0px, 0px); -webkit-transform:translate3d(0px, 0px, 0px); transform:translate3d(0px, 0px, 0px)";
            a = a.style.cssText.match(/translate3d\(0px, 0px, 0px\)/g);
            this.browser = {
                support3d: null !== a && 1 === a.length,
                isTouch: "ontouchstart" in g || g.navigator.msMaxTouchPoints
            }
        },
        moveEvents: function() {
            if (!1 !== this.options.mouseDrag || !1 !== this.options.touchDrag) this.gestures(), this.disabledEvents()
        },
        eventTypes: function() {
            var a = ["s", "e", "x"];
            this.ev_types = {};
            !0 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"] : !1 === this.options.mouseDrag && !0 === this.options.touchDrag ? a = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"] : !0 === this.options.mouseDrag && !1 === this.options.touchDrag && (a = ["mousedown.owl", "mousemove.owl", "mouseup.owl"]);
            this.ev_types.start = a[0];
            this.ev_types.move = a[1];
            this.ev_types.end = a[2]
        },
        disabledEvents: function() {
            this.$elem.on("dragstart.owl", function(a) {
                a.preventDefault()
            });
            this.$elem.on("mousedown.disableTextSelect", function(a) {
                return f(a.target).is("input, textarea, select, option")
            })
        },
        gestures: function() {
            function a(a) {
                if (void 0 !== a.touches) return {
                    x: a.touches[0].pageX,
                    y: a.touches[0].pageY
                };
                if (void 0 === a.touches) {
                    if (void 0 !== a.pageX) return {
                        x: a.pageX,
                        y: a.pageY
                    };
                    if (void 0 === a.pageX) return {
                        x: a.clientX,
                        y: a.clientY
                    }
                }
            }

            function b(a) {
                "on" === a ? (f(k).on(d.ev_types.move, e), f(k).on(d.ev_types.end, c)) : "off" === a && (f(k).off(d.ev_types.move), f(k).off(d.ev_types.end))
            }

            function e(b) {
                b = b.originalEvent || b || g.event;
                d.newPosX = a(b).x - h.offsetX;
                d.newPosY = a(b).y - h.offsetY;
                d.newRelativeX = d.newPosX - h.relativePos;
                "function" === typeof d.options.startDragging && !0 !== h.dragging && 0 !== d.newRelativeX && (h.dragging = !0, d.options.startDragging.apply(d, [d.$elem]));
                (8 < d.newRelativeX || -8 > d.newRelativeX) && !0 === d.browser.isTouch && (void 0 !== b.preventDefault ? b.preventDefault() : b.returnValue = !1, h.sliding = !0);
                (10 < d.newPosY || -10 > d.newPosY) && !1 === h.sliding && f(k).off("touchmove.owl");
                d.newPosX = Math.max(Math.min(d.newPosX, d.newRelativeX / 5), d.maximumPixels + d.newRelativeX / 5);
                !0 === d.browser.support3d ? d.transition3d(d.newPosX) : d.css2move(d.newPosX)
            }

            function c(a) {
                a = a.originalEvent || a || g.event;
                var c;
                a.target = a.target || a.srcElement;
                h.dragging = !1;
                !0 !== d.browser.isTouch && d.$owlWrapper.removeClass("grabbing");
                d.dragDirection = 0 > d.newRelativeX ? d.owl.dragDirection = "left" : d.owl.dragDirection = "right";
                0 !== d.newRelativeX && (c = d.getNewPosition(), d.goTo(c, !1, "drag"), h.targetElement === a.target && !0 !== d.browser.isTouch && (f(a.target).on("click.disable", function(a) {
                    a.stopImmediatePropagation();
                    a.stopPropagation();
                    a.preventDefault();
                    f(a.target).off("click.disable")
                }), a = f._data(a.target, "events").click, c = a.pop(), a.splice(0, 0, c)));
                b("off")
            }
            var d = this,
                h = {
                    offsetX: 0,
                    offsetY: 0,
                    baseElWidth: 0,
                    relativePos: 0,
                    position: null,
                    minSwipe: null,
                    maxSwipe: null,
                    sliding: null,
                    dargging: null,
                    targetElement: null
                };
            d.isCssFinish = !0;
            d.$elem.on(d.ev_types.start, ".owl-wrapper", function(c) {
                c = c.originalEvent || c || g.event;
                var e;
                if (3 === c.which) return !1;
                if (!(d.itemsAmount <= d.options.items)) {
                    if (!1 === d.isCssFinish && !d.options.dragBeforeAnimFinish || !1 === d.isCss3Finish && !d.options.dragBeforeAnimFinish) return !1;
                    !1 !== d.options.autoPlay && g.clearInterval(d.autoPlayInterval);
                    !0 === d.browser.isTouch || d.$owlWrapper.hasClass("grabbing") || d.$owlWrapper.addClass("grabbing");
                    d.newPosX = 0;
                    d.newRelativeX = 0;
                    f(this).css(d.removeTransition());
                    e = f(this).position();
                    h.relativePos = e.left;
                    h.offsetX = a(c).x - e.left;
                    h.offsetY = a(c).y - e.top;
                    b("on");
                    h.sliding = !1;
                    h.targetElement = c.target || c.srcElement
                }
            })
        },
        getNewPosition: function() {
            var a = this.closestItem();
            a > this.maximumItem ? a = this.currentItem = this.maximumItem : 0 <= this.newPosX && (this.currentItem = a = 0);
            return a
        },
        closestItem: function() {
            var a = this,
                b = !0 === a.options.scrollPerPage ? a.pagesInArray : a.positionsInArray,
                e = a.newPosX,
                c = null;
            f.each(b, function(d, g) {
                e - a.itemWidth / 20 > b[d + 1] && e - a.itemWidth / 20 < g && "left" === a.moveDirection() ? (c = g, a.currentItem = !0 === a.options.scrollPerPage ? f.inArray(c, a.positionsInArray) : d) : e + a.itemWidth / 20 < g && e + a.itemWidth / 20 > (b[d + 1] || b[d] - a.itemWidth) && "right" === a.moveDirection() && (!0 === a.options.scrollPerPage ? (c = b[d + 1] || b[b.length - 1], a.currentItem = f.inArray(c, a.positionsInArray)) : (c = b[d + 1], a.currentItem = d + 1))
            });
            return a.currentItem
        },
        moveDirection: function() {
            var a;
            0 > this.newRelativeX ? (a = "right", this.playDirection = "next") : (a = "left", this.playDirection = "prev");
            return a
        },
        customEvents: function() {
            var a = this;
            a.$elem.on("owl.next", function() {
                a.next()
            });
            a.$elem.on("owl.prev", function() {
                a.prev()
            });
            a.$elem.on("owl.play", function(b, e) {
                a.options.autoPlay = e;
                a.play();
                a.hoverStatus = "play"
            });
            a.$elem.on("owl.stop", function() {
                a.stop();
                a.hoverStatus = "stop"
            });
            a.$elem.on("owl.goTo", function(b, e) {
                a.goTo(e)
            });
            a.$elem.on("owl.jumpTo", function(b, e) {
                a.jumpTo(e)
            })
        },
        stopOnHover: function() {
            var a = this;
            !0 === a.options.stopOnHover && !0 !== a.browser.isTouch && !1 !== a.options.autoPlay && (a.$elem.on("mouseover", function() {
                a.stop()
            }), a.$elem.on("mouseout", function() {
                "stop" !== a.hoverStatus && a.play()
            }))
        },
        lazyLoad: function() {
            var a, b, e, c, d;
            if (!1 === this.options.lazyLoad) return !1;
            for (a = 0; a < this.itemsAmount; a += 1) b = f(this.$owlItems[a]), "loaded" !== b.data("owl-loaded") && (e = b.data("owl-item"), c = b.find(".lazyOwl"), "string" !== typeof c.data("src") ? b.data("owl-loaded", "loaded") : (void 0 === b.data("owl-loaded") && (c.hide(), b.addClass("loading").data("owl-loaded", "checked")), (d = !0 === this.options.lazyFollow ? e >= this.currentItem : !0) && e < this.currentItem + this.options.items && c.length && this.lazyPreload(b, c)))
        },
        lazyPreload: function(a, b) {
            function e() {
                a.data("owl-loaded", "loaded").removeClass("loading");
                b.removeAttr("data-src");
                "fade" === d.options.lazyEffect ? b.fadeIn(400) : b.show();
                "function" === typeof d.options.afterLazyLoad && d.options.afterLazyLoad.apply(this, [d.$elem])
            }

            function c() {
                f += 1;
                d.completeImg(b.get(0)) || !0 === k ? e() : 100 >= f ? g.setTimeout(c, 100) : e()
            }
            var d = this,
                f = 0,
                k;
            "DIV" === b.prop("tagName") ? (b.css("background-image", "url(" + b.data("src") + ")"), k = !0) : b[0].src = b.data("src");
            c()
        },
        autoHeight: function() {
            function a() {
                var a = f(e.$owlItems[e.currentItem]).height();
                e.wrapperOuter.css("height", a + "px");
                e.wrapperOuter.hasClass("autoHeight") || g.setTimeout(function() {
                    e.wrapperOuter.addClass("autoHeight")
                }, 0)
            }

            function b() {
                d += 1;
                e.completeImg(c.get(0)) ? a() : 100 >= d ? g.setTimeout(b, 100) : e.wrapperOuter.css("height", "")
            }
            var e = this,
                c = f(e.$owlItems[e.currentItem]).find("img"),
                d;
            void 0 !== c.get(0) ? (d = 0, b()) : a()
        },
        completeImg: function(a) {
            return !a.complete || "undefined" !== typeof a.naturalWidth && 0 === a.naturalWidth ? !1 : !0
        },
        onVisibleItems: function() {
            var a;
            !0 === this.options.addClassActive && this.$owlItems.removeClass("active");
            this.visibleItems = [];
            for (a = this.currentItem; a < this.currentItem + this.options.items; a += 1) this.visibleItems.push(a), !0 === this.options.addClassActive && f(this.$owlItems[a]).addClass("active");
            this.owl.visibleItems = this.visibleItems
        },
        transitionTypes: function(a) {
            this.outClass = "owl-" + a + "-out";
            this.inClass = "owl-" + a + "-in"
        },
        singleItemTransition: function() {
            var a = this,
                b = a.outClass,
                e = a.inClass,
                c = a.$owlItems.eq(a.currentItem),
                d = a.$owlItems.eq(a.prevItem),
                f = Math.abs(a.positionsInArray[a.currentItem]) + a.positionsInArray[a.prevItem],
                g = Math.abs(a.positionsInArray[a.currentItem]) + a.itemWidth / 2;
            a.isTransition = !0;
            a.$owlWrapper.addClass("owl-origin").css({
                "-webkit-transform-origin": g + "px",
                "-moz-perspective-origin": g + "px",
                "perspective-origin": g + "px"
            });
            d.css({
                position: "relative",
                left: f + "px"
            }).addClass(b).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
                a.endPrev = !0;
                d.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(d, b)
            });
            c.addClass(e).on("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend", function() {
                a.endCurrent = !0;
                c.off("webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend");
                a.clearTransStyle(c, e)
            })
        },
        clearTransStyle: function(a, b) {
            a.css({
                position: "",
                left: ""
            }).removeClass(b);
            this.endPrev && this.endCurrent && (this.$owlWrapper.removeClass("owl-origin"), this.isTransition = this.endCurrent = this.endPrev = !1)
        },
        owlStatus: function() {
            this.owl = {
                userOptions: this.userOptions,
                baseElement: this.$elem,
                userItems: this.$userItems,
                owlItems: this.$owlItems,
                currentItem: this.currentItem,
                prevItem: this.prevItem,
                visibleItems: this.visibleItems,
                isTouch: this.browser.isTouch,
                browser: this.browser,
                dragDirection: this.dragDirection
            }
        },
        clearEvents: function() {
            this.$elem.off(".owl owl mousedown.disableTextSelect");
            f(k).off(".owl owl");
            f(g).off("resize", this.resizer)
        },
        unWrap: function() {
            0 !== this.$elem.children().length && (this.$owlWrapper.unwrap(), this.$userItems.unwrap().unwrap(), this.owlControls && this.owlControls.remove());
            this.clearEvents();
            this.$elem.attr("style", this.$elem.data("owl-originalStyles") || "").attr("class", this.$elem.data("owl-originalClasses"))
        },
        destroy: function() {
            this.stop();
            g.clearInterval(this.checkVisible);
            this.unWrap();
            this.$elem.removeData()
        },
        reinit: function(a) {
            a = f.extend({}, this.userOptions, a);
            this.unWrap();
            this.init(a, this.$elem)
        },
        addItem: function(a, b) {
            var e;
            if (!a) return !1;
            if (0 === this.$elem.children().length) return this.$elem.append(a), this.setVars(), !1;
            this.unWrap();
            e = void 0 === b || -1 === b ? -1 : b;
            e >= this.$userItems.length || -1 === e ? this.$userItems.eq(-1).after(a) : this.$userItems.eq(e).before(a);
            this.setVars()
        },
        removeItem: function(a) {
            if (0 === this.$elem.children().length) return !1;
            a = void 0 === a || -1 === a ? -1 : a;
            this.unWrap();
            this.$userItems.eq(a).remove();
            this.setVars()
        }
    };
    f.fn.owlCarousel = function(a) {
        return this.each(function() {
            if (!0 === f(this).data("owl-init")) return !1;
            f(this).data("owl-init", !0);
            var b = Object.create(l);
            b.init(a, this);
            f.data(this, "owlCarousel", b)
        })
    };
    f.fn.owlCarousel.options = {
        items: 5,
        itemsCustom: !1,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: !1,
        itemsMobile: [479, 1],
        singleItem: !1,
        itemsScaleUp: !1,
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1E3,
        autoPlay: !1,
        stopOnHover: !1,
        navigation: !1,
        navigationText: ["prev", "next"],
        rewindNav: !0,
        scrollPerPage: !1,
        pagination: !0,
        paginationNumbers: !1,
        responsive: !0,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: g,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: !1,
        lazyFollow: !0,
        lazyEffect: "fade",
        autoHeight: !1,
        jsonPath: !1,
        jsonSuccess: !1,
        dragBeforeAnimFinish: !0,
        mouseDrag: !0,
        touchDrag: !0,
        addClassActive: !1,
        transitionStyle: !1,
        beforeUpdate: !1,
        afterUpdate: !1,
        beforeInit: !1,
        afterInit: !1,
        beforeMove: !1,
        afterMove: !1,
        afterAction: !1,
        startDragging: !1,
        afterLazyLoad: !1
    }
})(jQuery, window, document); + function($) {
    'use strict';

    function ScrollSpy(element, options) {
        this.$body = $(document.body)
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0
        this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
        this.refresh()
        this.process()
    }
    ScrollSpy.VERSION = '3.3.2'
    ScrollSpy.DEFAULTS = {
        offset: 10
    }
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }
    ScrollSpy.prototype.refresh = function() {
        var that = this
        var offsetMethod = 'offset'
        var offsetBase = 0
        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
        }
        this.$body.find(this.selector).map(function() {
            var $el = $(this)
            var url = $el.attr('href').indexOf("#") !== -1 ? $el.attr('href').substring($el.attr('href').indexOf("#") + 1) : ''
            var href = $el.data('target') || url
            var $href = $('#' + href)
            return ($href && $href.length && $href.is(':visible') && [
                [$href[offsetMethod]().top - $('.header').outerHeight() - $('#wpadminbar').outerHeight(), href]
            ]) || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            that.offsets.push(this[0])
            that.targets.push(this[1])
        })
    }
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i
        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }
        for (i = offsets.length; i--;) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i])
        }
    }
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target
        this.clear()
        var url = $(this.selector).attr('href')
        var href = url.substr(0, url.indexOf('#'))
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + href + '#' + target + '"]'
        var active = $(selector).parents('li').addClass('active')
        active.trigger('activate.bs.scrollspy')
    }
    ScrollSpy.prototype.clear = function() {
        $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active')
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.scrollspy
    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old
        return this
    }
    $(window).on('load.bs.scrollspy.data-api', function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })
}(jQuery);