/* Minification failed. Returning unminified contents.
(4551,72-73): run-time error JS1013: Syntax error in regular expression: ,
(4550,70-71): run-time error JS1013: Syntax error in regular expression: ,
 */
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Helpers = /** @class */ (function () {
                function Helpers() {
                }
                Helpers.isFunction = function (obj) {
                    return typeof obj == 'function' || false;
                };
                Helpers.formatGuid = function (guid) {
                    var output = guid.replace(/[{}\-()]/g, "").toLowerCase();
                    return output;
                };
                Helpers.getDateTime = function () {
                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    var day = date.getDate();
                    var minutesText = minutes < 10 ? "0" + minutes : minutes.toString();
                    var strTime = year + "-" + month + "-" + day + " " + hours + ":" + minutesText + ":" + seconds;
                    return strTime;
                };
                Helpers.cookieExists = function (cookieName) {
                    var match = Helpers.matchCookie(cookieName);
                    return !!match;
                };
                Helpers.cookieValue = function (cookieName, defaultValue) {
                    var match = Helpers.matchCookie(cookieName);
                    if (match) {
                        return match[2];
                    }
                    return defaultValue || "";
                };
                Helpers.matchCookie = function (cookieName) {
                    var pattern = new RegExp("^(.*;)?\\s*" + cookieName + "\\s*=\\s*([^;]+).*$");
                    var isMatch = pattern.exec(window.document.cookie);
                    return isMatch;
                };
                return Helpers;
            }());
            Presentation.Helpers = Helpers;
            var Context = /** @class */ (function () {
                function Context() {
                }
                Context.getFlagStatus = function (flagName) {
                    return Helpers.cookieExists(flagName);
                };
                Context.getSetting = function (setting, defaultValue) {
                    return Helpers.cookieValue(setting, defaultValue);
                };
                return Context;
            }());
            Presentation.Context = Context;
            var Performance = /** @class */ (function () {
                function Performance() {
                }
                // Will check if timeout exists and replace it with new one
                // Only last timeout will be executed
                Performance.debounce = function (params) {
                    var timeoutId = Performance.delayTimeouts[params.id];
                    if (timeoutId > -1) {
                        clearTimeout(timeoutId);
                    }
                    Performance.delayTimeouts[params.id] = setTimeout(function () {
                        params.callback();
                        Performance.delayTimeouts[params.id] = -1;
                    }, params.timeout);
                };
                ;
                // Execute Callback function when :
                //  - Value changed
                //  - specified time elapsed
                // This prevents redraw caused by quick sequential setting of same value
                Performance.debounceValue = function (params) {
                    var currentValue = params.value.current();
                    var desired = params.value.desired();
                    // Exit if new value is smaller than minValue
                    if (params.value.min && desired < params.value.min)
                        return;
                    if (params.value.rememberLast && Performance.lastValueStore[params.id] === desired)
                        return;
                    Performance.lastValueStore[params.id] = desired;
                    //            console.log("Desired: " + params.id + " " + desired);
                    // Exit if value change is smaller than threshold
                    if (Math.abs(desired - currentValue) < params.threshold)
                        return;
                    Performance.debounce(params);
                };
                // Waits with resolving the promise until the check function will return true;
                // If check() function do not return true after given period of time, it will timeout.
                // Check() function is passed as a parameter into the method.
                // Method returns jQuery Promise object.
                Performance.waitUntilWithPromise = function (params) {
                    var untilParams = $.extend({}, Performance.defaultsWaitUntil, params);
                    var $deferred = jQuery.Deferred();
                    // if the check returns true, execute onComplete immediately
                    if (untilParams.check()) {
                        $deferred.resolve();
                        return $deferred.promise();
                    }
                    if (!untilParams.delay)
                        untilParams.delay = 100;
                    var timeoutPointer;
                    var intervalPointer = setInterval(function () {
                        if (!untilParams.check())
                            return;
                        // if check return false, means we need another check in the next interval
                        // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
                        clearInterval(intervalPointer);
                        if (timeoutPointer)
                            clearTimeout(timeoutPointer);
                        $deferred.resolve();
                    }, untilParams.delay);
                    // if after timeout milliseconds function doesn't return true, abort
                    if (untilParams.timeout)
                        timeoutPointer = setTimeout(function () {
                            if (untilParams.executeBeforeTimeout) {
                                $deferred.resolve();
                            }
                            clearInterval(intervalPointer);
                            $deferred.fail();
                        }, untilParams.timeout);
                    return $deferred.promise();
                };
                Performance.delayTimeouts = {};
                Performance.lastValueStore = {};
                Performance.defaultsWaitUntil = {
                    delay: 100,
                    timeout: 0,
                    executeBeforeTimeout: false
                };
                return Performance;
            }());
            Presentation.Performance = Performance;
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
;
/// <reference path="Helpers.ts"/>
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var LogLevel;
            (function (LogLevel) {
                LogLevel[LogLevel["Debug"] = 0] = "Debug";
                LogLevel[LogLevel["Info"] = 1] = "Info";
                LogLevel[LogLevel["Warn"] = 2] = "Warn";
                LogLevel[LogLevel["Error"] = 3] = "Error";
            })(LogLevel || (LogLevel = {}));
            var Logging = /** @class */ (function () {
                function Logging() {
                }
                Logging.ShouldLog = function (level) {
                    var setting = Presentation.Context.getSetting(Logging.LogLevel, "Warn");
                    var settingsLevel = LogLevel[setting];
                    return settingsLevel <= level;
                };
                Logging.Warn = function (msg, component) {
                    Logging.Log(LogLevel.Warn, msg, component);
                };
                Logging.Info = function (msg, component) {
                    Logging.Log(LogLevel.Info, msg, component);
                };
                Logging.Debug = function (msg, component) {
                    Logging.Log(LogLevel.Debug, msg, component);
                };
                Logging.Log = function (level, msg, component) {
                    if (Logging.ShouldLog(level)) {
                        var levelName = LogLevel[level];
                        console.debug(Presentation.Helpers.getDateTime() + " - [" + levelName + "][" + component + "] - " + msg);
                    }
                };
                Logging.LogLevel = "merck_log_level";
                return Logging;
            }());
            Presentation.Logging = Logging;
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Logging.js.map;
/// <reference path="Logging.ts"/>
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Log = MManual.Foundation.Presentation.Logging;
            var ListenerMap = /** @class */ (function () {
                function ListenerMap(eventName) {
                    this.eventName = eventName;
                    this.listeners = new Array();
                }
                ListenerMap.prototype.Add = function (listener) {
                    if (this.listeners) {
                        this.listeners.push(listener);
                    }
                };
                ListenerMap.prototype.Emit = function (params) {
                    if (this.listeners) {
                        this.listeners.forEach(function (listener) {
                            listener(!!params ? params : null);
                        });
                    }
                };
                ListenerMap.prototype.Delete = function () {
                    this.listeners = new Array();
                    delete this.listeners;
                };
                return ListenerMap;
            }());
            var EventBusImpl = /** @class */ (function () {
                /**
                 *  Create an Event Bus object which has the registration and publishing API.
                 *  addEventListener and emitEvent functions
                 *  lets the subscriber and publisher to subscribe and publish on events respectively.
                 */
                function EventBusImpl() {
                    this.eventTopics = new Array();
                }
                EventBusImpl.prototype.findListeners = function (eventName) {
                    var listenerMap = this.eventTopics.filter(function (lm) { return lm.eventName === eventName; });
                    if (listenerMap.length > 0) {
                        return listenerMap[0];
                    }
                    return null;
                };
                EventBusImpl.prototype.findOrAddListener = function (eventName) {
                    var map = this.findListeners(eventName);
                    if (!map) {
                        map = new ListenerMap(eventName);
                        this.eventTopics.push(map);
                    }
                    return map;
                };
                EventBusImpl.prototype.addEventListener = function (eventName, listener) {
                    var listenerMap = this.findOrAddListener(eventName);
                    Log.Debug("Adding event listener '" + listener + "' to event '" + eventName + "'. listeners : " + listenerMap, "EventBus");
                    listenerMap.Add(listener);
                };
                ;
                EventBusImpl.prototype.emitEvent = function (eventName, params) {
                    var listenerMap = this.findListeners(eventName);
                    Log.Debug("Emitting event '" + eventName + "' ... ", "EventBus");
                    if (!listenerMap) {
                        Log.Info("No event listeners for event '" + eventName + "'.", "EventBus");
                        return;
                    }
                    listenerMap.Emit(params);
                };
                EventBusImpl.prototype.removeListener = function (eventName, listener) {
                    var listenerMap = this.findListeners(eventName);
                    if (!listenerMap) {
                        return;
                    }
                    listenerMap.Delete();
                };
                ;
                EventBusImpl.prototype.getListener = function (eventName) {
                    return this.findListeners(eventName).listeners;
                };
                return EventBusImpl;
            }());
            Presentation.EventBusImpl = EventBusImpl;
            Presentation.EventBus = new EventBusImpl();
            var Events = /** @class */ (function () {
                function Events() {
                }
                Events.windowResizeCallback = function () {
                    // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
                    if ($(window).height() !== Events.lastWindowHeight) {
                        // Update the window width for next time
                        Events.lastWindowHeight = $(window).height();
                        Presentation.EventBus.emitEvent("window.size.changed");
                    }
                    // Otherwise do nothing
                };
                ;
                Events.subscribeToWindowResize = function () {
                    $(window).on("resize", Events.windowResizeCallback);
                };
                Events.lastWindowHeight = 0;
                return Events;
            }());
            Presentation.Events = Events;
            Events.subscribeToWindowResize();
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=EventBus.js.map;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Log = Foundation.Presentation.Logging;
        var LazyLoad = /** @class */ (function () {
            function LazyLoad() {
            }
            LazyLoad.initialize = function () {
                var elements = document.querySelectorAll("[data-lazy-load-url]");
                elements.forEach(function (element) {
                    var observe = lozad(element, {
                        load: function (elem) {
                            var url = elem.dataset.lazyLoadUrl;
                            var containerSelector = elem.dataset.lazyLoadContainer;
                            var container = elem;
                            if (containerSelector) {
                                container = document.querySelector(containerSelector);
                                if (!container) {
                                    Log.Warn("Unable to find container for lazy loading with selector " + container + ". Url " + url + ".");
                                    container = elem;
                                }
                            }
                            jQuery.get(url)
                                .done(function (data) {
                                container.innerHTML = data;
                                Foundation.Presentation.EventBus.emitEvent("mmanual.lazyload.loaded", container);
                            });
                        }
                    });
                    observe.observe();
                });
            };
            return LazyLoad;
        }());
        Foundation.LazyLoad = LazyLoad;
        Foundation.Presentation.EventBus.addEventListener("merck.deferred.loaded", function () {
            LazyLoad.initialize();
        });
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Ajax.js.map;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Data = /** @class */ (function () {
                function Data() {
                }
                Data.Get = function (element, name) {
                    return jQuery(element).data(name);
                };
                return Data;
            }());
            Presentation.Data = Data;
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Data.js.map;
String.prototype.trimCharLeft = function (charlist) {
    var s = this;
    if (charlist === undefined)
        charlist = "\s";
    return s.replace(new RegExp("^[" + charlist + "]+"), "");
};
String.prototype.trimChar = function (charlist) {
    var s = this;
    return s.trimCharLeft(charlist).trimCharRight(charlist);
};
String.prototype.trimCharRight = function (charlist) {
    var s = this;
    if (charlist === undefined)
        charlist = "\s";
    return s.replace(new RegExp("[" + charlist + "]+$"), "");
};
String.prototype.decodeHtml = function () {
    var s = this;
    var doc = new DOMParser().parseFromString(s, "text/html");
    return doc.documentElement.textContent;
};
//# sourceMappingURL=Extensions.js.map;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Language = /** @class */ (function () {
                function Language() {
                }
                Language.getDirection = function () {
                    return window.document.querySelector("html").getAttribute("dir");
                };
                Language.isRightToLeft = function () {
                    return Language.getDirection() === "rtl";
                };
                return Language;
            }());
            Presentation.Language = Language;
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
;
/// <reference path="Helpers.ts"/>
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var MediaQuery = /** @class */ (function () {
                function MediaQuery() {
                }
                MediaQuery.maxWidth = function (width) {
                    return window.matchMedia("screen and (max-width: " + width + "px)");
                };
                MediaQuery.onMatch = function (mql, whenSmaller, whenBigger) {
                    if (mql.matches) {
                        if (Presentation.Helpers.isFunction(whenSmaller))
                            return whenSmaller.call(this);
                    }
                    else {
                        if (Presentation.Helpers.isFunction(whenBigger))
                            return whenBigger.call(this);
                    }
                };
                MediaQuery.onBreakPoint = function (breakpoint, whenSmaller, whenBigger, context) {
                    var mql = MediaQuery.maxWidth(breakpoint);
                    context = context || this;
                    mql.addListener(function () { MediaQuery.onMatch.call(context, mql, whenSmaller, whenBigger); });
                    return MediaQuery.onMatch.call(context, mql, whenSmaller, whenBigger);
                };
                // min-width breakpoint constants,
                // please sync it up according to Styles/Redesign/media.less
                MediaQuery.SMALLMOBILE = 480;
                MediaQuery.MOBILE = 720;
                //here desktop version starts
                MediaQuery.SMALLTABLET = 960;
                MediaQuery.TABLET = 1024;
                MediaQuery.DESKTOP = 1280;
                //larger screens
                MediaQuery.HUGE = 1680;
                return MediaQuery;
            }());
            Presentation.MediaQuery = MediaQuery;
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=MediaQuery.js.map;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Url = /** @class */ (function () {
            function Url() {
            }
            Url.getLocation = function (href) {
                var l = document.createElement("a");
                l.href = href;
                return l;
            };
            Url.isCurrentUrl = function (href) {
                // if links to same topic, don't render
                var currentPath = location.pathname;
                var hrefLocation = this.getLocation(href);
                var hasHash = hrefLocation.hash !== '';
                var isSamePath = hrefLocation.pathname === currentPath;
                var isCurrentUrl = hasHash || isSamePath;
                return isCurrentUrl;
            };
            Url.AddCultureToUrl = function (url) {
                var language = Foundation.Context.Language.Name;
            };
            Url.IsAbsoluteUrl = function (url) {
                var absUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                return absUrl.test(url);
            };
            Url.RemoveProtocol = function (url) {
                var protocolRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
                return url.replace(protocolRegex, "");
            };
            return Url;
        }());
        Foundation.Url = Url;
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var View = /** @class */ (function () {
            function View() {
            }
            // https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
            // Check whether element is fully visible in the view port
            View.isElementInViewport = function (element) {
                var rect = element.getBoundingClientRect();
                return (rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth));
            };
            ;
            View.isElementVisible = function (element) {
                if (element.clientHeight <= 0 || element.clientWidth <= 0)
                    return false;
                var jQueryElement = jQuery(element);
                return jQueryElement.is(":visible");
            };
            View.getInnerWidth = function () {
                var width = window.innerWidth || document.documentElement.clientWidth;
                return width;
            };
            View.getInnerHeight = function () {
                var height = window.innerHeight || document.documentElement.clientHeight;
                return height;
            };
            View.getContentViewportTop = function () {
                var windowScroll = $(window).scrollTop();
                var headerHeight = MManual.Foundation.Components.Header.getHeight();
                return windowScroll + headerHeight;
            };
            return View;
        }());
        Foundation.View = View;
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
;
/// <reference path="../../typings/manual/amplify.d.ts"/>
/// <reference path="../../typings/Context.d.ts"/>
/// <reference path="Compression.ts"/>
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Caching;
            (function (Caching) {
                var CacheOptions = /** @class */ (function () {
                    function CacheOptions() {
                    }
                    return CacheOptions;
                }());
                Caching.CacheOptions = CacheOptions;
                var StorageCache = /** @class */ (function () {
                    function StorageCache() {
                    }
                    StorageCache.prototype.getItem = function (key) {
                        return amplify.store(key);
                    };
                    StorageCache.prototype.setItem = function (key, value, timeout) {
                        return amplify.store(key, value, { expires: timeout * 60 * 1000 });
                    };
                    StorageCache.prototype.remove = function (key) {
                        return amplify.store(key, "", { expires: 1 });
                    };
                    StorageCache.prototype.getOrSetItem = function (key, valueFunction, timeout) {
                        if (Presentation.Context.getFlagStatus(StorageCache.DisableCachingFlag)) {
                            return valueFunction();
                        }
                        var value = this.getItem(key);
                        if (value) {
                            return value;
                        }
                        value = valueFunction();
                        this.setItem(key, value, timeout);
                        return value;
                    };
                    StorageCache.prototype.getOrSetItemFromPromiseGeneric = function (key, valuePromise, options) {
                        if (Presentation.Context.getFlagStatus(StorageCache.DisableCachingFlag)) {
                            return valuePromise();
                        }
                        var deferred = jQuery.Deferred();
                        var getItemFunc = options.compress
                            ? this.getItemDecompressed
                            : this.getItem;
                        getItemFunc = getItemFunc.bind(this);
                        var value = getItemFunc(key);
                        if (value) {
                            if (options.transformFunction) {
                                value = options.transformFunction(value);
                            }
                            deferred.resolve(value);
                            return deferred.promise();
                        }
                        var setItemFunc = options.compress
                            ? this.setItemAndCompress
                            : this.setItem;
                        setItemFunc = setItemFunc.bind(this);
                        var promise = valuePromise();
                        var callback = function (value) {
                            var shouldCache = true;
                            if (options.shouldCachePredicate) {
                                shouldCache = options.shouldCachePredicate(value);
                            }
                            if (shouldCache) {
                                setItemFunc(key, value, options.timeout);
                            }
                            if (options.transformFunction) {
                                value = options.transformFunction(value);
                            }
                            deferred.resolve(value);
                        };
                        promise.done(callback);
                        return deferred.promise();
                    };
                    StorageCache.prototype.getOrSetItemFromPromise = function (key, valuePromise, options) {
                        return this.getOrSetItemFromPromiseGeneric(key, valuePromise, options);
                    };
                    StorageCache.prototype.setItemAndCompress = function (key, value, timeout) {
                        if (!value)
                            return;
                        if (typeof value !== "string") {
                            value = JSON.stringify(value);
                        }
                        var compressed = Caching.Compression.compressText(value);
                        this.setItem(key, compressed, timeout);
                    };
                    StorageCache.prototype.getItemDecompressed = function (key) {
                        var item = this.getItem(key);
                        if (item) {
                            return Caching.Compression.decompressText(item);
                        }
                        return null;
                    };
                    StorageCache.DisableCachingFlag = "MManuals.Caching.Disable";
                    return StorageCache;
                }());
                Caching.Cache = new StorageCache();
            })(Caching = Presentation.Caching || (Presentation.Caching = {}));
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Cache.js.map;
/// <reference path="../../typings/manual/LZString.d.ts"/>
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Presentation;
        (function (Presentation) {
            var Caching;
            (function (Caching) {
                var Compression = /** @class */ (function () {
                    function Compression() {
                    }
                    Compression.compressText = function (text) {
                        // Edge and IE doesn't handle UTF8 characters in localStorage
                        // var htmlCompressed = LZString.compress(html);
                        // Compressing this to BASE64
                        var textCompressed = LZString.compressToBase64(text);
                        return textCompressed;
                    };
                    Compression.decompressText = function (text) {
                        // Edge and IE doesn't handle UTF8 characters in localStorage
                        // var htmlCompressed = LZString.compress(html);
                        // Compressing this to BASE64
                        var textDecompressed = LZString.decompressFromBase64(text);
                        return textDecompressed;
                    };
                    return Compression;
                }());
                Caching.Compression = Compression;
            })(Caching = Presentation.Caching || (Presentation.Caching = {}));
        })(Presentation = Foundation.Presentation || (Foundation.Presentation = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Compression.js.map;
var MManual;
(function (MManual) {
    var Foundation;
    (function (Foundation) {
        var Components;
        (function (Components) {
            var Presentation = Foundation.Presentation;
            var Header = /** @class */ (function () {
                function Header() {
                }
                // This function is a replacement for counting getBoundingClientRect of Breadcrumb
                // as this function behaves strangely on iOS
                Header.getHeight = function (order) {
                    var visibleElements = Header.getHeaderElements();
                    var offset = 0;
                    if (order) {
                        visibleElements = visibleElements.filter(function (element) {
                            var headerElement = element.dataset["headerElementOrder"];
                            var elementOrder = Number(headerElement);
                            return elementOrder < order;
                        });
                    }
                    visibleElements.forEach(function (element) {
                        offset += $(element).height();
                    });
                    return offset;
                };
                Header.subscribeToScroll = function () {
                    $(window).on("scroll", Header.raiseChanged);
                };
                Header.raiseChanged = function () {
                    Foundation.Presentation.Performance.debounce({
                        id: "components.header.changed",
                        callback: function () {
                            var height = Header.getHeight();
                            if (Header.lastHeight !== height) {
                                Header.lastHeight = height;
                                Presentation.EventBus.emitEvent("components.header.changed", height);
                            }
                        },
                        timeout: 1
                    });
                };
                Header.getHeaderElements = function () {
                    var visibleItems = jQuery("[data-header-element-order]")
                        .toArray();
                    visibleItems = visibleItems.filter(function (elem) { return Foundation.View.isElementInViewport(elem)
                        && Foundation.View.isElementVisible(elem); });
                    return visibleItems;
                };
                Header.staticElements = "static";
                Header.fixedElements = "fixed";
                Header.lastHeight = 0;
                return Header;
            }());
            Components.Header = Header;
        })(Components = Foundation.Components || (Foundation.Components = {}));
    })(Foundation = MManual.Foundation || (MManual.Foundation = {}));
})(MManual || (MManual = {}));
;
ko.bindingHandlers.shortClick = {
    // This binding to ensure that click on element was not a scroll or a drag 
    // E.g. In carousels when swipping with curser left and right we need to know that it was a swipe and not a click
    init: function (element, valueAccessor) {
        var defaults = {
            method: "distance",
            timeout: 300,
            radius: 25,
            callback: function () { }
        }

        var stopwatchStart = null;

        var startPositionX = 0;
        var startPositionY = 0;
        var stopPositionX = 0;
        var stopPositionY = 0;

        var context = ko.contextFor(element);

        var value = valueAccessor();

        var options = {};
        if (value !== null) {
            if (typeof value === "function") {
                $.extend(options, defaults, { callback: value });
            } else if (typeof value === "object") {
                $.extend(options, defaults, value);
            }
        }

        var elem = $(element);
        if (options.method === defaults.method) {
            elem.mousedown(function (event) {
                if (event.which === 1) { // Left mouse click
                    startPositionX = event.pageX;
                    startPositionY = event.pageY;
                };
            }).mouseup(function (event) {
                stopPositionX = event.pageX;
                stopPositionY = event.pageY;
                if (Math.abs(stopPositionX - startPositionX) < options.radius &&
                    Math.abs(stopPositionY - startPositionY) < options.radius) {
                    options.callback.call(context.$data);
                }
            });
        } else {
            elem.mousedown(function () {
                stopwatchStart = (new Date()).getTime();
            }).mouseup(function () {
                var stopwatchEnd = (new Date()).getTime();
                if (stopwatchEnd - stopwatchStart < options.timeout) {
                    options.callback.call(context.$data);
                }
            });
        }
    }
};
;

ko.bindingHandlers.objectFitImages = {
    init: function (element, valueAccessor, allBindings) {
        objectFitImages(element, { watchMQ: true });
    }
};



ko.bindingHandlers.scroll = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var deadzone = 10;
        setTimeout(function () {
            var value = valueAccessor();
            var $element = $(element);

            function scrollHandler() {
                var width = $element.outerWidth();
                var available = $element[0].scrollWidth;
                var scroll = $element.scrollLeft();

                var position = Math.round((scroll / (available - width)) * 100);
                var atStart = scroll < deadzone;
                var atEnd = (width >= available) || (scroll > available - width - deadzone);

                value({ position: position, atStart: atStart, atEnd: atEnd });
                return position;
            }

            $element.on("scroll", scrollHandler);
            scrollHandler();
            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    $element.off("scroll", scrollHandler);
                });

        },
            0);
    }
}

ko.bindingHandlers.onScroll = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();

        var callback = value.callback;
        var $parent = $(value.parentSelector);

        $(window).scroll(function () {
            var parentOffsetFromTop = $parent.offset();
            var parentHeight = $parent.height();
            var parentBottomPosition = parentOffsetFromTop.top + parentHeight - $(window).height();

            var currentScrollPosition = MManual.helpers.getScrollTop();

            if (currentScrollPosition > parentOffsetFromTop && currentScrollPosition < parentBottomPosition) {
                var position = Math.round((currentScrollPosition / parentHeight) * 100);
                callback(position);
            } else {
                callback(-1);
            }

        });
    }
};

(function () {
    function refreshSections(value) {
        if (MManual.Helpers.objects.isFunction(value.sections)) {
            return value.sections();
        } else {
            return value.sections;
        }
    }

    ko.bindingHandlers.currentSection = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            var selector = refreshSections(value);

            var params = {
                offset: value.offset,
                selector: selector,
                callback: value.showSection,
            };

            var observer = new MManual.Helpers.CurrentTopElementObserver(params);
            observer.init();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                // This will be called when the element is removed by Knockout or
                // if some other part of your code calls ko.removeNode(element)
                observer.destroy();
            });
        },
        update: function (element, valueAccessor) {
            refreshSections(valueAccessor());
        }
    }
})();

ko.bindingHandlers.windowHeight = {
    init: function (element, valueAccessor) {
        var onResize = valueAccessor();

        MManual.events.windowResize(onResize, element);
    }
};


//deprecated
ko.bindingHandlers.resizeIframeOnBeforePrint = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var windowHeight;
        var iframeHeight;

        function resizeBeforePrint() {
            windowHeight = window.innerHeight;
            iframeHeight = element.contentWindow.document.body.scrollHeight;
            element.style.height = (Math.ceil(iframeHeight / windowHeight)) * windowHeight + 'px';
        }

        function clearAfterPrint() {
            element.style.height = "";
        }

        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function (mql) {
            if (mql.matches) {
                iframeHeight = element.contentWindow.document.body.scrollHeight;
                element.style.height =
                    (Math.ceil(iframeHeight / windowHeight) - 1) * windowHeight + windowHeight - 150 + 'px';
            }
        });
        window.addEventListener('beforeprint', resizeBeforePrint);
        window.addEventListener('afterprint', clearAfterPrint);
        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                window.removeEventListener('beforeprint', resizeBeforePrint);
                window.removeEventListener('afterprint', clearAfterPrint);
                clearAfterPrint();
            });
    }
};

ko.bindingHandlers.setIframePrintTarget = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        valueAccessor()(element.contentWindow);
    }
}

//Not really solution from, but related to the problem: https://stackoverflow.com/questions/49749442/workaround-to-ios-11-webkit-iframe-bugs
ko.bindingHandlers.iOSresizeIframeToParent = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var iOS = MManual.utils.browser.isIos;
        if (iOS) {
            valueAccessor()(function () {
                $(element).css("height", $(element).parent().height());
                $(element).css("width", $(element).parent().width());
            });
            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    $(element).css("height", "");
                    $(element).css("width", "");
                });
        }
    }
}
ko.bindingHandlers.getDivRef = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        valueAccessor()(element);
        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                valueAccessor()(null);
            });
    }
}

ko.bindingHandlers.ellipsis = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        if (value !== null && $(element).ellipsis != null) {
            $(element).ellipsis();
        }
    }
}

ko.bindingHandlers.hoverTargetId = {};
ko.bindingHandlers.hoverVisible = {
    init: function (element, valueAccessor, allBindingAccessor) {

        function showOrHideElement(show) {
            var canShow = ko.utils.unwrapObservable(valueAccessor());
            $(element).toggle(show && canShow);
        }

        var hideElement = showOrHideElement.bind(null, false);
        var showElement = showOrHideElement.bind(null, true);

        var parentClass = ko.utils.unwrapObservable(allBindingAccessor().hoverTargetId);
        var $hoverTarget = $(element).closest(parentClass);
        ko.utils.registerEventHandler($hoverTarget, "mouseover", showElement);
        ko.utils.registerEventHandler($hoverTarget, "mouseout", hideElement);
        hideElement();
    }
};

ko.bindingHandlers.stopProp = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).click(function (event) {
            event.stopPropagation();
        });
    }
};

ko.bindingHandlers.toolTip = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var value = ko.unwrap(valueAccessor());

        var thumbnailUrl = ko.unwrap(value.thumbnail);
        var showToolTip = ko.unwrap(value.show);
        var cssClass = ko.unwrap(value.css) || "";

        if (!Modernizr.touchevents) {
            if (showToolTip) {
                $(element).tooltip({
                    content: '<img src="' + thumbnailUrl + '" class="' + cssClass + '"/>'
                });
            }
        }
    }
};

ko.bindingHandlers.lexicompScroll = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var el = $(element);
        var nav = el.find('.lexi-navigation');
        var mainContent = el.find('.lexi-main');

        mainContent.children("p").each(function (index, value) {
            var newId = 'section_' + index;
            var linkTitle = $(value).first().text().trim();
            $(value).attr('id', newId);
            if (linkTitle) {
                $('.lexi-navigation-items')
                    .append('<li><a href="#' +
                        newId +
                        '" id="nav_' +
                        newId +
                        '" onclick="navigateDrugPopup(this);">' +
                        linkTitle +
                        '</a></li>');
            }
        });

        $('.lexi-navigation-items').find('li').first().addClass('active');

        mainContent.scroll(function () {
            var isFirstSection = true;
            var navigationScrollPadding = 15;

            $($('.lexi-main p[id^="section_"]').get().reverse()).each(function () {
                var currSection = $(this);
                var refElement = $('#nav_' + currSection.attr("id"));
                if (currSection.position().top < 25) {
                    isFirstSection = false;
                    var targetPosition = refElement.offset().top +
                        nav.scrollTop() -
                        nav.offset().top -
                        navigationScrollPadding;
                    var currentPosition = nav.scrollTop();
                    if (Math.abs(targetPosition - currentPosition) > 5) {
                        nav.scrollTop(targetPosition);
                        if (checkClickEvent == undefined) {
                            $('.lexi-navigation-items').find('li').removeClass('active');
                            refElement.parent().addClass('active');
                        }
                        else {
                            checkClickEvent = undefined;
                        }
                    }
                    return false;
                }
            });
            if (isFirstSection) {
                nav.scrollTop($('#nav_section_0').offset().top + nav.scrollTop() - nav.offset().top);
            }
        });


    }
};
ko.bindingHandlers.collapsableSearchType = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (viewModel.firstRender()) {
            var totalCount = bindingContext.$root.typeFilters.availableTypes().length;
            bindingContext.$root.typeFilters.typesListElement = $(element).parent();
            setTimeout(function () {
                viewModel.typeWidth = $(element)[0].offsetWidth;
                viewModel.firstRender(false);
                bindingContext.$root.typeFilters.completeCount++;
                if (bindingContext.$root.typeFilters.completeCount === totalCount) {
                    bindingContext.$root.typeFilters.updateVisibleFilters();
                    if (!bindingContext.$root.typeFilters.resizeListenerAttached) {
                        window.addEventListener('resize',
                            function () {
                                bindingContext.$root.typeFilters.updateVisibleFilters();
                            });
                        bindingContext.$root.typeFilters.resizeListenerAttached = true;
                    }
                }
            },
                0);

        }
    }
};
ko.bindingHandlers.getImageDimensions = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var parent = $(element).parent();
        setTimeout(function () {
            MManual.utils.imgLoaded(element,
                function () {
                    var updateDimensions = function () {
                        var result = {
                            parentHeight: parent.height(),
                            parentWidth: parent.width(),
                            naturalHeight: element.naturalHeight,
                            naturalWidth: element.naturalWidth,
                        };
                        valueAccessor()(result);
                    }
                    updateDimensions();
                    window.addEventListener('resize', updateDimensions);
                });
        },
            0);
    }
};
ko.bindingHandlers.scrollIntoView = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var isActive = ko.unwrap(valueAccessor());
        setTimeout(function () {
            if (isActive) {
                element.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                    inline: 'center'
                });
            }
        },
            0);
    }
};
ko.bindingHandlers.modalCarousel = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (Modernizr.touchevents) return;
        var $element = $(element);
        if ($element !== undefined && $element !== null && $element.length > 0) {
            $element.tooltip({
                position: { my: 'center bottom', at: 'center top+50' },
                classes: {
                    'ui-tooltip': 'modaltooltip',
                    'ui-tooltip-content': 'modaltooltip__content'
                },
                content: function () {
                    var element = $(this);
                    var text = element.attr('title');
                    //console.log(text);
                    return '<div class="modaltooltip__area"><div class="modaltooltip__text">' +
                        text +
                        '</div></div><div class="modaltooltip__arrow--background"></div><div class="modaltooltip__arrow"></div>';
                },
                open: function (event, ui) {
                    if (typeof (event.originalEvent) === 'undefined') {
                        return false;
                    }

                    var $id = $(ui.tooltip).attr('id');

                    // close any lingering tooltips
                    $('div.ui-tooltip').not('#' + $id).remove();

                    // ajax function to pull in data and add it to the tooltip goes here
                },
                close: function (event, ui) {
                    ui.tooltip.hover(function () {
                        $(this).stop(true).fadeTo(400, 1);
                    },
                        function () {
                            $(this).fadeOut('400',
                                function () {
                                    $(this).remove();
                                });
                        });
                }
            });
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                if ($element !== undefined && $element.length > 0) {
                    $element.tooltip('destroy');
                }
            });
    }
};

ko.bindingHandlers.modalLocations = {
    update: function(element, valueAccessor, allBindings) {
        if (MManual.utils.browser.isIphone5) {
        var valueUnwrapped = ko.unwrap(valueAccessor());
        var $multimediaDescriptionList = $(element); // .multimedia__description--locations
            var $multimediaDescription = $multimediaDescriptionList.parent(); // .multimedia__description
            var multimediaDescriptionHeight = $multimediaDescriptionList.height();
            

            if (multimediaDescriptionHeight >= 150) {
                $multimediaDescription.css("height", "150px");
            } 
        }
    }
};

ko.bindingHandlers.scrollTick = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var throttleTimeout;
        $(element).on("scroll",
            function () {
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(function () {
                        value(value() + 1);
                        throttleTimeout = null;
                    },
                        100);
                }
            });
    }
}

ko.bindingHandlers.stickyHeaderTable = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        if (!value) return;      
    }
}
ko.bindingHandlers.lexicompDrugsOnClick = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        if (!value) return;
        if (!MManual.settings.LexicompEnabled)
            return;
        $(element).find('.resolvedDrug').on("click",
            function () {
                ShowLexicompMonograph(this);
            });
    }
}
ko.bindingHandlers.stopBubble = {
    init: function (element) {
        ko.utils.registerEventHandler(element,
            "click",
            function (event) {
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            });
    }
};

ko.bindingHandlers.setTop = {
    init: function (element) {
        var header = $('#l-layer--header').height() + 10;
        var bc = MManual.domCache().breadcrumb;
        if (bc.exists) {
            $(element).css("top", header + bc.container.height());
            letterNavigationHeightCalc();
        } else {
            $(element).css("top", header);
            letterNavigationHeightCalc();
        }
    }
}
function letterNavigationHeightCalc() {
    var letterNavigation = $('#letter-navigation');
    var header = $('#l-layer--header').height();
    var bc = MManual.domCache().breadcrumb;
    var windowHeight = $(window).height();
    if (letterNavigation.length) {
        if (bc.exists) {
            letterNavigation.css("height", windowHeight - header - bc.container.height() - 25);
        } else {
            letterNavigation.css("height", windowHeight - header - 25);
        }
    }
}
$(window).on("resize scroll", function () {
    letterNavigationHeightCalc();
});;
(function () {
    // HIDE ELEMENT ON BLUR (USER CLICKED OUTSIDE OF THE BINDED ELEMENT)
    // Allows to set action that will be executed on click on element (on focus)
    // And another action that will be executed on click outside of the element (on blur)
    // valueAccessor : {
    //      onBlur: function(){},
    //      onFocus: function(){},
    //      // will treat click on those elements as focus click
    //      includeElements: ['.exampleClassName'] 
    // }

    ko.bindingHandlers.hideOnBlur = {
        init: function (element, valueAccessor) {
            if (!valueAccessor)
                return;

            var settings = ko.unwrap(valueAccessor());
            if (!settings)
                return;

            var elementCallback = setOnFocus(settings.onFocus, element);

            var bodyCallback = setOnBlur(settings.onBlur, settings.includeElements);

            onDestroy(element, elementCallback, bodyCallback);
        }
    }

    function setOnFocus(onFocus, element) {
        var existsAndIsFunction = onFocus && MManual.Helpers.objects.isFunction(onFocus);

        $(element).on("click",
            function (event) {
                if (existsAndIsFunction) {
                    onFocus();
                }
                event.cancelBubble = true;
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
            });
    }

    function matchesClass(includeByClass, event) {
        var target = $(event.target);
        if (target.length < 1)
            return false;

        var isIncluded = includeByClass
            .some(function (includeClass) {
                return target.closest(includeClass).length > 0;
            });

        return isIncluded;
    }

    function setOnBlur(onBlur, includeByClass) {
        var existsAndIsFunction = onBlur && MManual.Helpers.objects.isFunction(onBlur);
        if (!existsAndIsFunction)
            return;

        var hasInclude = includeByClass && includeByClass.length > 0;
        var outSideClick;

        if (hasInclude) {
            outSideClick = function (event) {
                if (matchesClass(includeByClass, event))
                    return;

                onBlur();
            };
        } else {
            outSideClick = onBlur;
        }

        $("body").on("click", outSideClick);
    }

    function onDestroy(element, elementCallback, bodyCallback) {
        ko.utils.domNodeDisposal.addDisposeCallback(element,
            function () {
                $(element).off("click", elementCallback);
                $("body").off("click", bodyCallback);
            });
    }
})();
(function () {

    function calculateScale(element) {
        if (element == null) return;
        var $element = $(element);
        var scrollWidth = element.scrollWidth;
        var scale = 1;
        if (scrollWidth > 0) {
            scale = ($element.width() + $element.outerWidth()) / scrollWidth / 2;
        }
        if (scale < 1) {
            $element.css("transform", "scale(" + scale + ")");
        } else {
            $element.css("transform", "");
        }
    }

    ko.bindingHandlers.scaleText = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var boundCalculate = calculateScale.bind(this, element);
            $(window).on("resize", boundCalculate);
            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    $(window).off("resize", boundCalculate);
                    $(element).css("transform", "");
                });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = ko.unwrap(valueAccessor());
            if (value == null) return;
            calculateScale(element);
        }
    };
})();
;
ko.bindingHandlers.shortClick = {
    // This binding to ensure that click on element was not a scroll or a drag 
    // E.g. In carousels when swipping with curser left and right we need to know that it was a swipe and not a click
    init: function (element, valueAccessor) {
        var defaults = {
            method: "distance",
            timeout: 300,
            radius: 25,
            callback: function () { }
        }

        var stopwatchStart = null;

        var startPositionX = 0;
        var startPositionY = 0;
        var stopPositionX = 0;
        var stopPositionY = 0;

        var context = ko.contextFor(element);

        var value = valueAccessor();

        var options = {};
        if (value !== null) {
            if (typeof value === "function") {
                $.extend(options, defaults, { callback: value });
            } else if (typeof value === "object") {
                $.extend(options, defaults, value);
            }
        }

        var elem = $(element);
        if (options.method === defaults.method) {
            elem.mousedown(function (event) {
                if (event.which === 1) { // Left mouse click
                    startPositionX = event.pageX;
                    startPositionY = event.pageY;
                };
            }).mouseup(function (event) {
                stopPositionX = event.pageX;
                stopPositionY = event.pageY;
                if (Math.abs(stopPositionX - startPositionX) < options.radius &&
                    Math.abs(stopPositionY - startPositionY) < options.radius) {
                    options.callback.call(context.$data);
                }
            });
        } else {
            elem.mousedown(function () {
                stopwatchStart = (new Date()).getTime();
            }).mouseup(function () {
                var stopwatchEnd = (new Date()).getTime();
                if (stopwatchEnd - stopwatchStart < options.timeout) {
                    options.callback.call(context.$data);
                }
            });
        }
        elem.keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                options.callback.call(context.$data);
                return false;
            }
            return true;
        });
    }
};
;

(function () {

    var hammerManagerKey = "Hammer.Manager";
    var deltaX = 0;
    var scale;
    var isRtl = MManual.Foundation.Presentation.Language.isRightToLeft();


    function ensureHammerManager(element) {
        var $element = $(element);
        var hammerManager = element.hammerManager;
        if (!hammerManager) {
            hammerManager = new Hammer.Manager(element,
                {
                    touchAction: "pan-x pan-y"
                });
            element.hammerManager = hammerManager;
            
        }
        return hammerManager;
    }


    function hammerItSwipe(element, swipeActions) {
        var hammerManager = ensureHammerManager(element);

        hammerManager.add(new Hammer.Swipe({
            direction: Hammer.DIRECTION_ALL,
            velocity: 0.01,
            pointers: 1
        }));

        var goToNext = isRtl ? swipeActions.prev : swipeActions.next;
        var goToPrev = isRtl ? swipeActions.next  : swipeActions.prev;
        var canSwipe = swipeActions.canSwipe;

        hammerManager.on("hammer.input", function (swipeEvent) {
            if (!swipeEvent.isFinal)
                return;
            if (canSwipe() === false)
                return;

            if (element.PinchScale > 1)
                return;
            else {
                switch (swipeEvent.direction) {
                    case Hammer.DIRECTION_LEFT:
                        goToNext();
                        break;

                    case Hammer.DIRECTION_RIGHT:
                        goToPrev();
                        break;
                }
            }
        });
        function destroy() {
            hammerManager.destroy();
        }

        var result = {
            plugin: hammerManager,
            destroy: destroy,
        }
        return result;
    }

    function hammerIt(element, args) {
        var pinchZoomActive = args.pinchZoomActive;
        var isZoomed = args.isZoomed;

        var self = this;

        pinchZoomActive(true);
        var mc = ensureHammerManager(element);

        mc.add(new Hammer.Pinch({ enable: true }));
        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2, posThreshold: 50 }));


        var originX = 0;
        var originY = 0;

        var last_scale = 1;
        scale = 1;
        var el = element;
        var pinchParentCenter;
        var pinchImageCenter;
        var parent = el.parentElement;
        var iOS = MManual.utils.browser.isIos;
        element.PinchScale = scale;


        function applyTransform() {
            el.style.webkitTransform =
                "translate3d(" +
                originX +
                "px," +
                originY +
                "px, 0) " +
                "scale3d(" +
                scale +
                ", " +
                scale +
                ", 1)";
        }

        function applyOriginOffset() {
            originX = Math.ceil((scale - 1) * el.clientWidth / 2);
            originY = Math.ceil((scale - 1) * el.clientHeight / 2);
        }

        function resetWrapperSizeSafari() {
            $(el).css("position", "relative");
            setTimeout(function () {
                $(el).css("position", "");
            },
                0);
        }

        var resizeThrottleTimeout;

        function throttledResetWrapperSizeSafari() {
            if (iOS) {
                if (!resizeThrottleTimeout) {
                    resizeThrottleTimeout = setTimeout(function () {
                        resetWrapperSizeSafari();
                        resizeThrottleTimeout = null;
                    },
                        20);
                }
            }
        }

        function getGestureParentCenter(ev) {
            var x = ev.center.x - $(parent).offset().left;
            var y = ev.center.y - $(parent).offset().top;
            return { x: x, y: y };
        }

        function mapParentPointToImage(parentPoint) {
            var x = (parentPoint.x + parent.scrollLeft) / scale;
            var y = (parentPoint.y + parent.scrollTop) / scale;
            return { x: x, y: y };
        }

        function updateIsZoomed() {
            isZoomed(Math.abs(scale - 1 ) > 0.01);
        }

        mc.on('doubletap',
            function (ev) {
                var parentCenter = getGestureParentCenter(ev);
                var imageCenter = mapParentPointToImage(parentCenter);

                if (scale >= 2) {
                    scale = 1;
                    last_scale = 1;
                } else {
                    scale = 2;
                    last_scale = 2;
                }

                applyOriginOffset();
                applyTransform();
                updateIsZoomed();
                resetWrapperSizeSafari();

                var newPosX = (imageCenter.x * scale - parentCenter.x);
                var newPosY = (imageCenter.y * scale - parentCenter.y);
                parent.scrollLeft = newPosX;
                parent.scrollTop = newPosY;
            });
        mc.on('pinchstart',
            function (ev) {
                pinchParentCenter = getGestureParentCenter(ev);
                pinchImageCenter = mapParentPointToImage(pinchParentCenter);
                ev.preventDefault();
            });
        mc.on('pinch',
            function (ev) {
                scale = Math.max(1, Math.min(last_scale * (ev.scale), 8));
                applyOriginOffset();
                applyTransform();
                updateIsZoomed();

                var newPinchParentCenter = getGestureParentCenter(ev);
                var newPosX = (pinchImageCenter.x * scale - newPinchParentCenter.x);
                var newPosY = (pinchImageCenter.y * scale - newPinchParentCenter.y);
                parent.scrollLeft = newPosX;
                parent.scrollTop = newPosY;
                throttledResetWrapperSizeSafari();
                ev.preventDefault();
            });
        mc.on('pinchend',
            function (ev) {
                last_scale = scale;
                throttledResetWrapperSizeSafari();
                ev.preventDefault();
            });

        applyOriginOffset();
        applyTransform();

        function destroy() {
            mc.destroy();
        }

        var result = {
            plugin: mc,
            destroy: destroy,
        }
        return result;
    }

    function startHammer(valueAccessor, element, callback) {
        var hammerManager = element.hammerManager;
        hammerManager = callback(element, valueAccessor());
        parent.scrollTop = 0;
        parent.scrollLeft = 0;
    }

    function disableHammer(valueAccessor, element) {
        var hammerManager = element.hammerManager;

        if (hammerManager) {
            hammerManager.destroy();
            element.hammerManager = null;
            element.css("margin", "");
            element.css("transform", "");
            element.css("touch-action", "");
            element.css("user-select", "");
            element.css("-webkit-user-drag", "");
            element.css("-webkit-tap-highlight-color", "");
            valueAccessor()(false);
        }
    }

    ko.bindingHandlers.pinchZoom = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $element = $(element);
            var mq = MManual.Helpers.mq;
            var mqlPortrait = window.matchMedia("screen and (max-width: " + mq.SMALLMOBILE + "px)");
            var mqlLandscape = window.matchMedia("screen and (max-height: " +
                mq.SMALLMOBILE +
                "px) and (min-width: " +
                mq.SMALLMOBILE +
                "px)");
            var parent = element.parentElement;

            var setupPinch = function () {
                if (mqlPortrait.matches || mqlLandscape.matches) {
                    startHammer(valueAccessor, element, hammerIt);
                }
                else {
                    disableHammer(valueAccessor, element);
                }
            }
            mqlPortrait.addListener(setupPinch);
            mqlLandscape.addListener(setupPinch);
            setupPinch();
            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    if (element.hammerManager) {
                        element.hammerManager.destroy();
                        element.hammerManager = null;
                    }
                });
        }
    };
    ko.bindingHandlers["css-static"] = ko.bindingHandlers["css"];
    ko.bindingHandlers.swipe = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var mq = MManual.Helpers.mq;
            var setupSwipe = function () {
                mq.onBreakPoint(mq.SMALLTABLET,
                    function () {
                        startHammer(valueAccessor, element, hammerItSwipe);
                    },
                    function () { disableHammer(valueAccessor, element) });
            };
            setupSwipe();
            ko.utils.domNodeDisposal.addDisposeCallback(element,
                function () {
                    if (element.hammerManager) {
                        element.hammerManager.destroy();
                        element.hammerManager = null;
                    }
                });
        }
    };
})();
;
(function (MManual, amplify) {
    MManual.navigationHistory = {
        cookieName: "MManualNavigationHistory",

        getHistory: function () {
            return amplify.store(MManual.navigationHistory.cookieName);
        },

        storeHistory: function (historyData) {
            amplify.store(MManual.navigationHistory.cookieName, historyData);
        },

        updateMManualNavigationHistory: function (itemData) {
            var historyData = MManual.navigationHistory.getHistory();
            if (!historyData) {
                historyData = {
                    current: itemData,
                    previous: null
                }
            } else {
                if (!historyData.previous || (historyData.current.itemId != itemData.itemId)) {
                    historyData.previous = historyData.current;
                    historyData.current = itemData;
                }
            }

            MManual.navigationHistory.storeHistory(historyData);
        }
    }

}(window.MManual = window.MManual || {}, window.amplify));
;
(function ($, MM) {
    MM.settings = MM.settings || {};

    MM.settings.mediaMobile = 720;

    MM.settings.main = {
        stickyMargin: 8
    }

    MM.settings.component = {
        mobile: {
            backToTopHeight: 10 // px
        }
    }

}(jQuery, window.MManual = window.MManual || {}));;
//polyfill for location origin for IE as of https://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/
if (!window.location.origin) {
    window.location.origin = window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
}

function hashCode(input) {
    var stringInput = input;
    if ((typeof input) !== "string") {
        stringInput = JSON.stringify(input);
    }
    var hash = 0;
    if (stringInput.length == 0) {
        return hash;
    }
    for (var i = 0; i < stringInput.length; i++) {
        var char = stringInput.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

(function(MManual, $) {
    // detect what version of iOS and Safari we are currently on
    // https://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript
    var iOSversion = function() {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
    };

    MManual.utils = {
        addDaysToDate: function(date, days) {
            var value = date.valueOf();
            value += 86400000 * days;
            return new Date(value);
        },

        getClosestDiv: function(selector) {
            var currentScript = MManual.utils.getCurrentScript();
            if (currentScript) {
                return $(currentScript).closest(selector);
            } else {
                return $(selector).last();
            }
        },

        /** Returns currently executing script **/
        getCurrentScript: function() {
            var currentScript = document.currentScript;
            if (!currentScript) {
                // IE workaround
                var scripts = document.getElementsByTagName("script");
                currentScript = scripts[scripts.length - 1];
                // IE10 occasional race condition workaround
                if (currentScript.innerHTML === "" && scripts.length >= 2)
                    currentScript = scripts[scripts.length - 2];

            }
            return currentScript;
        },

        getUrlParameter: function(paramName) {
            if (!paramName) {
                return null;
            }

            paramName = paramName.toLowerCase();
            var uri = new URI(window.location.href.toLowerCase());
            var params = uri.search(true);
            if (!params || !params[paramName]) {
                return null;
            }
            return params[paramName];
        },

        updateURLParameter: function(url, param, paramVal) {
            var TheAnchor = null;
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                var tmpAnchor = additionalURL.split("#");
                var TheParams = tmpAnchor[0];
                TheAnchor = tmpAnchor[1];
                if (TheAnchor)
                    additionalURL = TheParams;

                tempArray = additionalURL.split("&");

                for (i = 0; i < tempArray.length; i++) {
                    if (tempArray[i].split('=')[0] != param) {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }
            } else {
                var tmpAnchor = baseURL.split("#");
                var TheParams = tmpAnchor[0];
                TheAnchor = tmpAnchor[1];

                if (TheParams)
                    baseURL = TheParams;
            }
            if (TheAnchor)
                paramVal += "#" + TheAnchor;

            var rows_txt = paramVal != null ? temp + "" + param + "=" + paramVal : "";
            return baseURL + "?" + newAdditionalURL + rows_txt;
        },

        replaceState: function(data, clearIfFalsyValue) {
            if (!data || !history || !history.replaceState) {
                return;
            }

            var uri = new URI(window.location.href.toLowerCase());
            for (var p in data) {
                if (p && data.hasOwnProperty(p)) {
                    var value = data[p];
                    p = p.toLowerCase();
                    if (value || !clearIfFalsyValue) {
                        if (typeof value === "string") {
                            value = value.toLowerCase();
                        }
                        uri.setSearch(p, value);
                    } else {
                        uri.removeSearch(p);
                    }
                }
            }

            try {
                var currentState = history.state;
                history.replaceState(currentState, '', uri.href());
            } catch (e) {
                if (console && console.error) {
                    console.error(e);
                } 
            }
        },

        tryParseInt: function(str, defaultValue) {
            var retValue = defaultValue;
            if (str !== null) {
                if (str.length > 0) {
                    if (!isNaN(str)) {
                        retValue = parseInt(str);
                    }
                }
            }
            return retValue;
        },
        imgLoaded: function(element, callback) {
            if (element.complete) {
                callback();
            } else {
                element.addEventListener('load', callback);
            }
        },
        getImageDimensions: function(imageNode) {
            if (imageNode.naturalHeight && imageNode.naturalWidth) {
                return { width: imageNode.naturalWidth, height: imageNode.naturalHeight };
            }
            var source = imageNode.src;
            var imgClone = document.createElement("img");
            imgClone.src = source;
            return { width: imgClone.width, height: imgClone.height };
        },
        encodeText: function(text) {
            return text.split('')
                .map(function(letter) { return letter.charCodeAt(0); })
                .join("_");
        },
        firstLetter: function(text) {
            //match first non-special character (not only in latin) in the string based on https://stackoverflow.com/questions/150033/regular-expression-to-match-non-english-characters/35743562#35743562
            var firstLetter = MManual.utils.stripHtml(text)
                .match(/[^\x00-\x7F]|\w/)[0]
                .charAt(0)
                .toUpperCase();
            return firstLetter;
        },
        startsWith: function(text, prefix) {
            var prefixLength = prefix.length;
            return text.substring(0, prefixLength) === prefix;
        },
        stripHtml: function(html) {
            var div = document.createElement("div");
            div.innerHTML = html;
            return div.textContent || div.innerText || "";
        },
        browser: {
            isIos: (function() {
                return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
            })(),
            isChrome: (function() {
                return /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
            })(),
            iOSversion: iOSversion,
            isIos10AndLower: (function() {
                var version = iOSversion();
                return version && version.length > 0 && version[0] <= 10;
            })(),
            isIE: (function() {
                return window.navigator.userAgent.indexOf("MSIE ") > 0 ||
                    !!navigator.userAgent.match(/Trident.*rv\:11\./);
            })(),
            isIphone5: (function() {
                return window.screen.height == (1136 / 2) && window.screen.width == (640 / 2);
            })()
},
        getInnerWidth: function() {
            var width = window.innerWidth || document.documentElement.clientWidth;
            return width;
        },

        getInnerHeight: function() {
            var height = window.innerHeight || document.documentElement.clientHeight;
            return height;
        },
        getMaxWidth: function() {
            var width = window.innerWidth || document.documentElement.clientWidth;
            if (width > 1200) {
                return 1200;
            }
            return width - 28;
        },
        getItemsHeight: function(items, count, startIndex) {
            startIndex = startIndex || 0;
            var height = 0;

            var itemsArray = items.get().slice(startIndex, count);
            itemsArray.forEach(function(element) {
                height = height + $(element).outerHeight();
            });

            return height;
        },
        getVideoWidth: function() {
            var width = window.innerWidth || document.documentElement.clientWidth;
            if (width > 1200) {
                return 700;
            }
            if (window.innerHeight > window.innerWidth) {
                return Math.floor(width * 0.9);
            }
            return Math.floor(width * 0.55);
        },
        loadScripts: function(array, callback) {
            var loader = function(src, handler) {
                var script = document.createElement("script");
                script.src = src;
                script.classList.add("optanon-category-C0002");
                script.onload = script.onreadystatechange = function() {
                    script.onreadystatechange = script.onload = null;
                    handler();
                };
                var head = document.getElementsByTagName("head")[0];
                (head || document.body).appendChild(script);
            };
            (function run() {
                if (array.length != 0) {
                    loader(array.shift(), run);
                } else {
                    callback && callback();
                    MManual.Foundation.Presentation.EventBus.emitEvent("merck.deferred.loaded");
                }
            })();
        },
        loadScriptsPromise: function (array) {
            var $deferred = jQuery.Deferred();
            var loader = function (src, handler) {
                var script = document.createElement("script");
                script.src = src;
                script.onload = script.onreadystatechange = function () {
                    script.onreadystatechange = script.onload = null;
                    handler();
                };
                var head = document.getElementsByTagName("head")[0];
                (head || document.body).appendChild(script);
            };
            (function run() {
                if (array.length != 0) {
                    loader(array.shift(), run);
                } else {
                    $deferred.resolve();
                }
            })();
            return $deferred.promise();
        },
        isInViewport: function(element) {
            var rect = element.getBoundingClientRect();
            return rect.bottom > -(window.innerHeight || document.documentElement.clientHeight) &&
                rect.right > -(window.innerWidth || document.documentElement.clientWidth) &&
                rect.top < 2 * (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left < 2 * (window.innerWidth || document.documentElement.clientWidth);
        },
        getScrollParent: function(node) {
            if (!node) {
                return null;
            } else if (node.scrollHeight > node.clientHeight) {
                if (node === document.body) return window;
                return node;
            }
            return MManual.utils.getScrollParent(node.parentNode) || window;
        },
        waitUntil: function(check, onComplete, delay, timeout) {
            // if the check returns true, execute onComplete immediately
            if (check()) {
                onComplete();
                return;
            }

            if (!delay) delay = 100;

            var timeoutPointer;
            var intervalPointer = setInterval(function() {
                    if (!check()
                    ) return; // if check didn't return true, means we need another check in the next interval

                    // if the check returned true, means we're done here. clear the interval and the timeout and execute onComplete
                    clearInterval(intervalPointer);
                    if (timeoutPointer) clearTimeout(timeoutPointer);
                    onComplete();
                },
                delay);
            // if after timeout milliseconds function doesn't return true, abort
            if (timeout)
                timeoutPointer = setTimeout(function() {
                        clearInterval(intervalPointer);
                    },
                    timeout);
        },
        guid: {
            checkIfCorrect: function(guid) {
                var regexGuid = /^{?[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}}?$$/gi;
                return regexGuid.test(guid);
            },
            hasValue: function (guid) {
                var noValue = "00000000-0000-0000-0000-000000000000";
                return guid !== noValue;
            }
        },
        isMacOS: function() {
            return navigator.userAgent.toLowerCase().indexOf("mac") != -1;
        }
    };

    var afterAnimation = MManual.utils.browser.isIos
        ? 'body:not(:animated)'
        : 'html:not(:animated), body:not(:animated)';

    var instantAnimation = MManual.utils.browser.isIos
        ? 'body'
        : 'html, body';

    var animateScrollDefaults = {
        position: 0,
        offset: 0,
        timeout: 0,
        container: instantAnimation,
        afterAnimations: false
    };

    function animateScroll(options) {
        var opts = $.extend({}, animateScrollDefaults, options);

        var container = $(opts.container);
        if (opts.afterAnimations) {
            container = $(afterAnimation);
        }

        var containerScroll = container.scrollTop();
        var newPosition = opts.position - opts.offset;

        if (Math.abs(containerScroll - newPosition) < 2) {
            return $.Deferred().resolve().promise();
        }

        var deferred = $.Deferred();

        var mq = MManual.Helpers.mq;
        var mql = mq.maxWidth(mq.SMALLTABLET);
        if(mql.matches) {
            window.scrollTo(0, opts.position - opts.offset);
        } else {
            $(container).animate(
                { scrollTop: newPosition },
                opts.timeout,
                function() {
                    deferred.resolve();
                });
        }


        // IMPORTANT
        // -----------------------------------------------------------------------
        // scrollIntoView is not implemented in all browsers and doesn't work well with
        // boxes that are scrollable ( like 'stickybar widget')
        // --------------------------------------------------------
        //            $element[0].scrollIntoView({
        //                behavior: 'smooth',
        //                block: 'start',
        //                inline: 'nearest'
        //            });

        var promise = deferred.promise();

        if (MManual.Helpers.objects.isFunction(opts.callback)) {
            promise.done(opts.callback);
        }

        return promise;
    }

    MManual.scroll = {
        scrollPosition: 0,
        bringScroll: function() {
            $(document).scrollTop(MManual.scroll.scrollPosition);
        },
        saveScroll: function() {
            if (!$("body").hasClass("popup")) {
                MManual.scroll.scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) -
                    (document.documentElement.clientTop || 0);
            }
        },
        to: function(position, timeout, callback) {
            return animateScroll({
                position: position,
                timeout: timeout,
                callback: callback
            });
        },
        elementTo: function($element, options) {
            if (!$element || $element.length < 1 || $.isEmptyObject($element.offset()))
                return $.Deferred().resolve().promise();

            // If container is not empty, then assume a scrollable container and get offsetTop
            var position = options && options.container
                // When scroll inside a scrollable container use
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop
                ? $element.get(0).offsetTop
                // When scroll inside a html, body then user jQuery
                : $element.offset().top;

            var opts = $.extend({}, options, { position: position });

            return animateScroll(opts);
        },
        elementToHeader: function($element, options) {
//            var offset = MManual.Foundation.View.getContentViewportTop();
            var baseHeight = 141;
            var mq = MManual.Helpers.mq;
            var mql = mq.maxWidth(mq.SMALLTABLET);
            if(mql.matches) {
                var headerOffset = 76 + $('.l-layer--breadcrumb.sticky').height();
                if(headerOffset > baseHeight){
                    baseHeight = headerOffset;
                }
            }

            var offset = MManual.Foundation.Components.Header.getHeight();
            if(offset < baseHeight){
                offset = baseHeight;
            }
            var opts = $.extend({}, options, { offset: offset });

            return MManual.scroll.elementTo($element, opts);
        }
    };

    $(document).ready(function () {
        function getInternetExplorerVersion(){
            var rv = 'noniebrowser';
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
                if (re.exec(ua) != null)
                rv = 'iebrowser';
            }
            else if (navigator.appName == 'Netscape')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
                if (re.exec(ua) != null)   
                rv = 'iebrowser';
            }
            return rv
        }
        var checkBrowser = getInternetExplorerVersion();
        if(checkBrowser == 'iebrowser'){
            var imageCont = ['.landing__manuals .version__picture','.box__picture','.landing__manuals .version__picture','#topicResources img','.featured__picture','.resources__container--link img','.news__list-view--picture','.resources--tooltip','.headerhat img']
            imageCont.forEach(function(element) {
                ieImageSize(element);
            });
            $('.box--marketing .box__content img').each(function() {
                if(!$(this)[0].hasAttribute("usemap")){
                    $(this).css({'width':'100%','height':'auto'});
                }
            });
            function ieImageSize(element) {
                $(element).each(function(){
                    var imgWidth = $(this).width();
                    var imgHeight = $(this).height();
                    $(this).wrap( "<div class='dynamic-imageWrapper' style='width:"+imgWidth+"px; height:"+imgHeight+"px;'></div>");
                });
            }
        }

        $('.scroll-to-bottom a').click(function(e){
            e.preventDefault();
            $(window).scrollTop(($('.footer__copyright__text').offset().top + $('.footer__copyright__text').outerHeight()) - $(window).height());
        });
    });

}(window.MManual = window.MManual || {}, jQuery));


function decodeURIComponentSafe(s) {
    if (!s) {
        return s;
    }
    var escapeText = s.replace(/%(?![0-9a-fA-F]{2,})/g, '%25');
    try {
        return decodeURIComponent(escapeText);
    } catch (error) {       
        if (console && console.error) {
            console.error(error);
        }
    }
}

$(document).ready(function () {
    var fontSize = localStorage.getItem('fontSize');
    if(fontSize != undefined){
        $('html').addClass(fontSize);
        $('.change-font a').removeClass('active');
        $('.'+fontSize).addClass('active');
    }
    $('.change-font').on('click', 'a', function (e) {
        e.preventDefault();
        $('.change-font a').removeClass('active');
        if ($(this).hasClass('font-size-1')) {
            $('html').removeClass('font-size-2').removeClass('font-size-3');
            localStorage.setItem('fontSize', 'font-size-1');
        } else if ($(this).hasClass('font-size-2')) {
            $('html').removeClass('font-size-1').removeClass('font-size-3').addClass('font-size-2');
            localStorage.setItem('fontSize', 'font-size-2');
        } else if ($(this).hasClass('font-size-3')) {
            $('html').removeClass('font-size-1').removeClass('font-size-2').addClass('font-size-3');
            localStorage.setItem('fontSize', 'font-size-3');
        }
        var currentItem = $(this).attr("class");
        $('.' + currentItem).addClass('active');
    });
    
    $('.news__refine--wrapper .ui-datepicker-trigger').attr('tabindex', '0').attr('role', 'button').attr('aria-label', 'Calendar');

    $(".news__refine--wrapper").on('keydown', '.ui-datepicker-trigger', function(e) {
        if (e.which == 13) {
            $(this).trigger("click").focus();
        }
    });

    $(".news__refine--wrapper").on('focus', '.ui-datepicker-trigger', function(e) {
        if(!$(this).parents('.news__refine--wrapper').find('#ui-datepicker-div').length) {
            $( ".hasDatepicker" ).datepicker( "hide" );
        }
    });

    $("#ui-datepicker-div").on('keydown', '.ui-state-default', function(e) {
        if (e.which == 13) {
            $(this).trigger("click");
            $('.news__refine--wrapper .ui-datepicker-trigger').attr('tabindex', '0').attr('role', 'button').attr('aria-label', 'Calendar');
            $(".ui-datepicker-prev").attr("tabindex", "0").attr('role', 'button');
            $(".ui-datepicker-next").attr("tabindex", "0").attr('role', 'button');
            $(".ui-datepicker-calendar tr td a.ui-state-active").focus();
            var labelTitleID = $("#ui-datepicker-div").attr('aria-labelledby');
            $('.ui-datepicker-title').attr('id', labelTitleID);
        }
    });

    $("#ui-datepicker-div").on('keydown', '.ui-datepicker-prev', function(e) {
        if (e.which == 13) {
            $(this).trigger("click");
            $('.news__refine--wrapper .ui-datepicker-trigger').attr('tabindex', '0').attr('role', 'button').attr('aria-label', 'Calendar');
            $(".ui-datepicker-prev").attr("tabindex", "0").attr('role', 'button').focus();
            $(".ui-datepicker-next").attr("tabindex", "0").attr('role', 'button');
            var labelTitleID = $("#ui-datepicker-div").attr('aria-labelledby');
            $('.ui-datepicker-title').attr('id', labelTitleID);
        }
    });
    $("#ui-datepicker-div").on('keydown', '.ui-datepicker-next', function(e) {
        if (e.which == 13) {
            $(this).trigger("click");
            $('.news__refine--wrapper .ui-datepicker-trigger').attr('tabindex', '0').attr('role', 'button').attr('aria-label', 'Calendar');
            $(".ui-datepicker-next").attr("tabindex", "0").attr('role', 'button').focus();
            $(".ui-datepicker-prev").attr("tabindex", "0").attr('role', 'button');
            var labelTitleID = $("#ui-datepicker-div").attr('aria-labelledby');
            $('.ui-datepicker-title').attr('id', labelTitleID);
        }
    });

    function settingsDropdownAutoClose(e) {
        var settingsDropdownHandler = $(".settings--dropdown, .settings--opt-button");
        if (!settingsDropdownHandler.is(e.target) && settingsDropdownHandler.has(e.target).length === 0) {
            $('.settings--opt-button').attr('aria-expanded', false);
            $(".settings--dropdown").removeClass('show');
        }
    }
    $(document).on('keyup', function(e) {
        var container = $(".hasDatepicker, .ui-datepicker-calendar tr td a, .ui-datepicker-header a, .ui-datepicker-trigger");   
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $( ".hasDatepicker" ).datepicker( "hide" );
        }
        settingsDropdownAutoClose(e);
    });
    $(document).on('click', function (e) {
        settingsDropdownAutoClose(e);
    });

    $('.othertopics__content .othertopics__link').each(function () {
      if ($(this).hasClass('othertopics__link--active')) {
        $(this).attr('aria-current', 'true');
      }
    });

    $('.settings--opt-button').on('click', function () {
        var ele = $(this);
        if (ele.attr('aria-expanded') != 'true') {
            ele.attr('aria-expanded', true);
        } else {
            ele.attr('aria-expanded', false);
        }
        ele.next('.settings--dropdown').toggleClass('show');
    });
    $('.settings--dropdown-close').on('click', function () {
        var ele = $(this);
        ele.parents('.settings--opt-list').find('.settings--opt-button').attr('aria-expanded', false);
        ele.parent('.settings--dropdown').removeClass('show');
    });

    var themeSwitcherEle = localStorage.getItem('themeSwitcherVal');
    if (themeSwitcherEle != undefined) {
        $(".themeSwitcher input").prop('checked', true);
        $('html').addClass('dark-theme');
    }
    $(".themeSwitcher input").on('change', function () {
        if ($(this).prop('checked')) {
            $('html').addClass('dark-theme');
            localStorage.setItem('themeSwitcherVal', true);
        } else {
            $('html').removeClass('dark-theme');
            localStorage.removeItem('themeSwitcherVal');
        }
    });
    $(function () {
        var topicDrugTableBtn = $(".topic__section #topic-drug-table-button");
        var topicDrugTableImg = $(".topic__section #topic-drug-table-button .topic-drug-table-img");
        var topicDrugTableWrp = $(".topic__section #topic-drug-table-wrapper");
        var topicDrugTableCont = $(".topic__section #topic-drug-table-content");

        topicDrugTableWrp.height(topicDrugTableCont.outerHeight(false));

        topicDrugTableBtn.click(function () {

            if (topicDrugTableWrp.hasClass('close')) {
                topicDrugTableWrp.css('display', 'block');
                topicDrugTableBtn.attr('aria-expanded', 'true');
                topicDrugTableImg.css('background-image', 'url(/Content/Images/Redesign/icon_minus.png)');
                topicDrugTableWrp.removeClass('close');
                topicDrugTableWrp.height(topicDrugTableCont.outerHeight(true));

            } else {
                topicDrugTableWrp.css('display', 'none');
                topicDrugTableBtn.attr('aria-expanded', 'false');
                topicDrugTableWrp.addClass('close');
                topicDrugTableImg.css('background-image', 'url(/Content/Images/Redesign/icon_plus.png)');
                topicDrugTableWrp.height(0);
            }

        });
    });

    //Disable Dark theme on IE browsers
    var ua = window.navigator.userAgent;
    var isIE = /MSIE|Trident/.test(ua);
    if ( isIE ) {
        $('.settings--dropdown').addClass('ie-browser');
    }



    var $cell = $('.health-wellness-card');

    //open and close card when clicked on card
    $cell.find('.js-expander').click(function() {
        var $thisCell = $(this).closest('.health-wellness-card');

        if ($thisCell.hasClass('is-collapsed')) {
            $cell.not($thisCell).removeClass('is-expanded').addClass('is-collapsed').find('.js-expander').attr('aria-expanded', false);
            $thisCell.removeClass('is-collapsed').addClass('is-expanded').find('.js-expander').attr('aria-expanded', true);

        } else {
            $thisCell.removeClass('is-expanded').addClass('is-collapsed').find('.js-expander').attr('aria-expanded', false);
        }
    });

    //close card when click on cross
    $cell.find('.js-collapser').click(function() {
        var $thisCell = $(this).closest('.health-wellness-card');
        $thisCell.removeClass('is-expanded').addClass('is-collapsed').find('.js-expander').attr('aria-expanded', false).focus();
    });

    $cell.find('.js-expander, .js-collapser').keypress(function() {
        var keyCode = (event.which ? event.which : event.keyCode);
        if (keyCode === 13) {
            $(this).trigger("click");
        }
    });

    if ($('.labelspine__item--clickable.labelspine__item--active').length > 0) {
        $('.labelspine__item--active').attr('aria-selected', 'true');
    }
});


    $(".actiontoolbar__icon--share").click(function (e) {
      var rightToolbarShareBtn = $(e.currentTarget);
      if (rightToolbarShareBtn.attr("aria-expanded") === "true") {
        $(this).attr("aria-expanded", "false");
      } else {
        $(this).attr("aria-expanded", "true");
      }

      $(".a2a_more").attr("role", "button").attr("aria-expanded", "false");
  
      $(".a2a_overlay").click(function () {
        $(".actiontoolbar__icon--share").attr("aria-expanded", "false");
      });
  
      $(".a2a_more").click(function (e) {
        var a2aMoreBtn = $(e.currentTarget);
        if (a2aMoreBtn.attr("aria-expanded") === "true") {
          $(this).attr("aria-expanded", "false");
        } else {
          $(this).attr("aria-expanded", "true");
        }
        $(".a2a_overlay").click(function () {
          $(".a2a_more").attr("aria-expanded", "false");
        });
      });
    });


window.onload = function () {
    var commonCloseText = $("#commonCloseText").val();
    setTimeout(function () {
        $("#a2apage_dropdown").append("<div id='closebtncustom' tabindex='0' aria-label="+commonCloseText+" role='button' onclick='removedropdownclosebtn(this)' onkeyup='removedropdownclosebtnEnter(this)'><img src='/Content/Images/Redesign/modal/icon_modal_close_white.png'/></div>");

        $("#a2apage_full").append("<div id='closebtnfullcustom' tabindex='0' aria-label="+commonCloseText+" role='button' onclick='removeFullCloseBtn(this)' onkeyup='removeFullCloseBtnEnter(this)'><img src='/Content/Images/Redesign/modal/icon_modal_close_white.png'/></div>");
    }, 2000);
};

removeFullCloseBtn = function (btn) {
    btn.parentNode.style.display = 'none';
    $('#a2a_overlay').css('display', 'none');
}
removeFullCloseBtnEnter = function (btn) {
    event.which = event.which || event.keyCode;
    if (event.which == 13) {
        btn.parentNode.style.display = 'none';
        $('#a2a_overlay').css('display', 'none');
        $('.actiontoolbar__icon--share').focus();
    }
}
removedropdownclosebtn = function (btn) {
    btn.parentNode.style.display = 'none';
}
removedropdownclosebtnEnter = function (btn) {
    event.which = event.which || event.keyCode;
    if (event.which == 13) {
        btn.parentNode.style.display = 'none';
        $('.actiontoolbar__icon--share').focus();
    }
}

function setSelectedState() {
    $('.labelspine__item--clickable').each(function () {
        if ($(this).hasClass('labelspine__item--active')) {
            $(this).attr('aria-selected', 'true');
        }
        else {
            $(this).attr('aria-selected', 'false');
        }
    });
}
window.scrollTo(0, 0);
window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
});


$(document).on("keypress", ".search__images--cell > a, .search__videos--cell > a, .search__calculator--left > a", function(event){
    var keyCode = (event.which ? event.which : event.keyCode);
    if (keyCode === 13) {
        $(this).trigger("click");
    }
});





;
(function(MManual) {
    MManual.analytics = {
        eventParticipateInQuizz: "ParticipateInAQuiz",
        eventParticipateInCaseStudy: "ParticipateInACaseStudy",
        eventUseCalculator: "UseACalculator",
        eventUseBiodigital: "UseABiodigital",
        eventUseLabTest: "UseALabTest",
        eventUsePodcast: "UseAPodcast",
        eventUseInfographic: "UseAnInfographic",
        eventToggleEditions: "ToggleEditions",
        eventShareAnArticleMail: "ShareAnArticleMail",
        eventShareAnArticleFb: "ShareAnArticleFb",
        eventShareAnArticleTw: "ShareAnArticleTw",
        eventShareAnArticleGp: "ShareAnArticleGp",
        eventShareAnArticleLi: "ShareAnArticleLi",
        eventShareAnArticleWb: "ShareAnArticleWb",
        eventShareAnArticleQQ: "ShareAnArticleQQ",
        eventShareAnArticleOk: "ShareAnArticleOk",
        eventShareAnArticleVk: "ShareAnArticleVk",
        eventPrintAnArticle: "PrintAnArticle",
        eventRateATopic: "RateATopic",
        eventVideoStarted: "VideoStarted",
        eventVideoCompleted: "VideoCompleted",
        eventNone: "None",
        
        notifyOpenModal: function (modalType, title, vasontId) {
            var currentLanguageInput = $("#currentLanguage");
            var analyticsPathInput = $("#currentEdition");
            if (currentLanguageInput.length === 0 ||
                analyticsPathInput.length === 0 ||
                title == null ||
                modalType == null) return;
            var currentLanguage = currentLanguageInput.val().toLowerCase();
            var analyticPathWithNoLanguage = (analyticsPathInput.val() + "/" + modalType + "/" + title.replace(/\s+/g, '-')).toLowerCase();
            var analyticPath = window.location.pathname.toLowerCase().indexOf("/" + currentLanguage) > -1 ? currentLanguage + "/" + analyticPathWithNoLanguage: analyticPathWithNoLanguage;
		
            if (window.dataLayer) {
                if (vasontId != undefined && vasontId != null && vasontId != "") {
                    dataLayer.push({
                        'event': 'VirtualPageview',
                        'virtualPageURL': analyticPath,
                        'virtualPageTitle': modalType + " - " + title,
                        'virtualVasontID': vasontId
                    });
                }
                else {
                    dataLayer.push({
                        'event': 'VirtualPageview',
                        'virtualPageURL': analyticPath,
                        'virtualPageTitle': modalType + " - " + title
                    });
                }
            }  
            else {
                console.log("Google Analytic is not enable on the site and for Media with Path:  " + analyticPath);
            }
        }
    };

}(window.MManual = window.MManual || {}));;
(function ($, MM) {
    var EventBus = MM.Foundation.Presentation.EventBus;
    var Header = MM.Foundation.Components.Header;

    $(document).ready(function(){
        //var clonedLetterSpine = $('#l-group--header-letterpine .l-layer--letterspine').clone();
        //var clonedHeader = $('#l-group--header-letterpine .l-header').clone();
        //var cloneNavigationbar = $('#l-group--header-letterpine .l-layer--mainmenu').clone();
        //clonedHeader.insertAfter('#l-group--header-letterpine--fixed .l-layer--fixed .l-layer__padding:first-child');
        //$('.l-group--letterspinefixed').append(clonedLetterSpine);
        //$('.l-layer--fixed').append(cloneNavigationbar);
    });

    $(function () {
        var previousHidden = true;
        var staticHeader = $('#l-group--header-letterpine');
        var headerFixed = $("#l-group--header-letterpine--fixed");
        var fixedSearchbar = headerFixed.find(".l-layer--searchbar");
        var fixedSearchbarInput = fixedSearchbar.find(".searchbar__input");
        var header = $(".l-group--header");
        var searchbar = header.find(".l-layer--searchbar");
        var searchbarInput = searchbar.find(".searchbar__input");
        var hamburger = $(".mainnav__hamburger");
        var letterSpineButton = $(".letterspine__button");
        var letterSpine = $(".l-layer--letterspine");
        var searchButton = $(".searchbar__button--popout");
        var underskirt = $(".l-layer--underskirt");


        // Topic title is added here because of slow event propagation that create delay of animation
        var title = $(".topic__header--title");

        var isFixedHeaderShowed = false;

        EventBus.addEventListener("components.loaded", function () {
            Header.raiseChanged();
        });

        function mobileSearchBarActive() {
            return fixedSearchbarInput.is(':focus');
        }

        var fixedOffset = 0;
        function calculateFixedOffset() {
            var headerHeight = $('.l-layer--header').outerHeight();
            fixedOffset = 0;
        }

        function displayFixedHeader() {
            EventBus.emitEvent("header.sticky:on");
            Header.raiseChanged();

            if (mobileSearchBarActive()) {
                headerFixed.removeClass("l-layer--folded");
            }

            title.addClass("topic__header--title--sticky");
            //headerFixed.removeClass("l-group--header-letterpine-fixed--hidden");
            //staticHeader.addClass('sticky-header');

            if (header.find('.langswitcher__selector').selectmenu("instance")) {
                header.find('.langswitcher__selector').selectmenu("close");
            }

            if (previousHidden) {
                if (searchbarInput.data("ui-autocomplete")) {
                    searchbarInput.autocomplete("close");
                }
                searchbarInput.blur();
                previousHidden = false;
            }
            isFixedHeaderShowed = true;
        }

        function scrollHandler() {
            var isPopup = $('body').hasClass('popup');
            if (isPopup) return;

            if (!mobileSearchBarActive()) {
                //headerFixed.addClass("l-layer--folded");
                letterSpine.addClass("l-layer--letterspine--hidden");
                var headerHeight = $('#l-group--header-letterpine').outerHeight();
                var breadcrumSticky = $('.l-layer--breadcrumb.sticky');
                breadcrumSticky.css("top", headerHeight);
                showSearchButton();
                Header.raiseChanged();
            }
            if (window.pageYOffset > fixedOffset) {               
                if (isFixedHeaderShowed)
                    return;

                displayFixedHeader();

            } else {
                EventBus.emitEvent("components.header.sticky:off");

                if (mobileSearchBarActive()) {
                    headerFixed.addClass("l-layer--folded");
                }

                title.removeClass("topic__header--title--sticky");
                //headerFixed.addClass("l-group--header-letterpine-fixed--hidden");
                //staticHeader.removeClass('sticky-header');

                EventBus.emitEvent("letterspine.changed");
                Header.raiseChanged();

                if (staticHeader.find('.langswitcher__selector').selectmenu("instance")) {
                    staticHeader.find('.langswitcher__selector').not(".mainmenu__switcher--desktop .langswitcher__selector").selectmenu("close");
                }

                if (!previousHidden) {
                    staticHeader.find('.l-layer--mainmenu').removeClass('flyout__desktop-menu__open');
                    $('.mainnav__hamburger').removeClass('mainnav__hamburger--open');
                    fixedSearchbarInput.autocomplete("close");
                    fixedSearchbarInput.blur();
                    previousHidden = true;
                    $(".mainmenu__switcher--desktop").empty();
                }
                $(".l-layer__content mainmenu .mainmenu__switcher--desktop").empty();

                isFixedHeaderShowed = false;
                hamburger.removeClass("mainnav__hamburger--open");
            }
        }

        function showLetterSpine() {
                letterSpineButton.on("click", function () {
                event.preventDefault();
                letterSpine.removeClass("l-layer--letterspine--hidden");
                //searchButton.css("visibility", "hidden");
                $('.searchBar-container').removeClass('active');
                EventBus.emitEvent("letterspine.changed");
                Header.raiseChanged();
                var breadcrumSticky = $('.l-layer--breadcrumb.sticky');
                var fixedHeaderHeight = $('.l-layer--header').outerHeight();
                breadcrumSticky.css("top", fixedHeaderHeight + letterSpine.height());
            });
        }

        function showSearchButton() {
            if (!letterSpine.is(":visible")) {
               //searchButton.css("visibility", "visible");
            }
        }

        function setUnderskirtHeight() {
            if (letterSpine.length) {
                underskirt.addClass("l-layer--underskirt--letterspine-active");
            } else {
                underskirt.addClass("l-layer--underskirt--letterspine-hidden");
            }
            EventBus.emitEvent("components.letterspine.changed");
            Header.raiseChanged();
        }

        $(window).on("scroll", scrollHandler);
        $(window).on("resize", calculateFixedOffset);
        calculateFixedOffset();
        showLetterSpine();
        scrollHandler();
        headerFixed.addClass("l-layer--folded");
        letterSpine.addClass("l-layer--letterspine--hidden");
        setUnderskirtHeight();
        $(window).resize(function(){
            scrollHandler();
        });
          
    });
})(jQuery, MManual);
;
(function(MM){
	//initialize helpers module
	MM.Helpers = {};
}(window.MManual = window.MManual || {}));;
(function (MM) {
    //expose module API
    MM.Helpers.array = {
        toMatrix: toMatrix
    };

    // Splits array of items into evenly distributed matrix with given number of columns
    function toMatrix(array, numOfColumns) {
        var result = [];
        var previousColumnsTotal = 0;
        var remainingSections = array.length;
        for (var i = numOfColumns; i > 0; i--) {
            var columnHeight = Math.ceil(remainingSections / i);
            var columnArray = array.slice(previousColumnsTotal, previousColumnsTotal + columnHeight);
            previousColumnsTotal += columnHeight;
            remainingSections -= columnHeight;
            result.push(columnArray);
        }
        return result;
    };

    function last(array) {
        return array.slice(-1).pop();
    }

    window.Array.prototype.last = Array.prototype.last || function() {
        return last(this);
    }
}(MManual));;
(function (Helpers) {
    Helpers.objects = {
        isFunction: isFunction,
        isEmpty: isEmpty
    };

    function isFunction(obj) {
        return typeof obj == 'function' || false;
    }

    function isEmpty(obj) {
        return obj === undefined || obj === null || obj.length === 0;
    }

    Number.isInteger = Number.isInteger || function (value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };

    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

}(MManual.Helpers = MManual.Helpers || {}));;
(function (Helpers) {

    Helpers.performance = {};


    Helpers.performance.markAndMeasure = function (measureThis, markName) {
        performance.mark(markName + "-START");

        measureThis();

        performance.mark(markName + "-END");
        performance.measure(markName, markName + "-START", markName + "-END");
    }
}(MManual.Helpers = MManual.Helpers || {}));


// Mocking this for IE browser
window.performance = window.performance || {};
window.performance.mark = window.performance.mark || function () { }
window.performance.measure = window.performance.measure || function () { }
;
(function (Helpers) {
    //mq - media query
    Helpers.mq = {
        //API

        minWidth: minWidth,
        maxWidth: maxWidth,
        onBreakPoint: onBreakpoint,
        isMobile: isMobile,

        // min-width breakpoint constants,
        // please sync it up according to Styles/Redesign/media.less
        SMALLMOBILE: 480,
        MOBILE: 720,
        //here desktop version starts
        SMALLTABLET: 960,
        TABLET: 1024,
        DESKTOP: 1280,
        //larger screens
        HUGE: 1680

    };

    function minWidth(width) {
        return window.matchMedia("screen and (min-width: " + width + "px)");
    }

    function maxWidth(width) {
        return window.matchMedia("screen and (max-width: " + width + "px)");
    }

    // Obsolete : use  MManual.Foundation.Presentation.MediaQuery;
    function onBreakpoint(breakpoint, whenSmaller, whenBigger, context) {
        MManual.Foundation.Presentation.MediaQuery.onBreakPoint(breakpoint, whenSmaller, whenBigger, context);
    }

    function isMobile() {
        var mql = Helpers.mq.maxWidth(Helpers.mq.MOBILE);
        return mql.matches;
    }

    // Dont use onresize event. You should use 
    // for specific media query breakpoint.
    //callback has one parameter, called mql - mediaquerylist. 
    //u can check mql.matches to implement logic
    //  
    // function onMinWidth(width, callback) {
    //  	return minWidth(width).addListener(callback);
    // }

	/* example of onMinWidth usage & callback  
	onMinWidth(720, function(mql){ 
		if (mql.matches) {
			//some code for 720 screen or bigger
		} else {
			//some code for 719 screen or smaller
		}
	});
	*/


}(MManual.Helpers = MManual.Helpers || {}));;
//seeks for sortable elements & sorts component list on specific circumstances
//and puts into one place

/*usage 
$ var someOrder = new Orderize({
    container: '.andPutThemHere',
    candidates: '.takeTheseElements',
    orderBy': 'data-orderize'
}).init();

*/
(function (MM) {
    //expose module API
    MM.Helpers.orderize = {
        Orderize: Orderize
    };

    //constructor
    function Orderize(opts) {
        this.container = opts.container;
        this.candidates = opts.candidates;

        return this;
    }

    //public instance API
    Orderize.prototype.init = init;
    Orderize.prototype.destroy = destroy;
    Orderize.prototype.sortByOrder = sortByOrder;
    Orderize.prototype.getOrder = getOrder;

    function reBindKoContext(koContextSourceElement, koContextTargetElement) {
        var matchingKoContext = ko.contextFor(koContextSourceElement);
        if (matchingKoContext) {
            var oldContext = ko.contextFor(koContextTargetElement);
            if (oldContext) {
                ko.cleanNode(koContextTargetElement);
            }

            ko.applyBindings(matchingKoContext, koContextTargetElement);
            ko.cleanNode(koContextSourceElement);
        }
    }

    //init/destroy lifecycle
    function init() {

        this.$candidates = $(this.candidates);
        this.$container = $(this.container);

        if (this.$container.children().length > 0) {
            // already contains elements
            return this;
        }

        var candidates = this.$candidates;
        var sorted = candidates.clone(true).sort(sortByOrder);

        this.$candidates.addClass('orderize__candidate--hide');
        this.$container.append(sorted);

        $(".orderize *[id]").each(function () {
            var id = $(this).attr('id');
            var mobileId = 'mobile_' + id;
            $(this).attr('id', mobileId);
            $('.orderize label[for=' + id + ']').attr('for', mobileId);
        });

        // find elements in $container to re-bind knockout context
        this.$container.find("[data-ko-rebind]")
            .each(function (index, orderizeElement) {
                // for each element, find corresponding element in $candidates
                var koRebindValue = $(orderizeElement).data('ko-rebind');
                if (koRebindValue === undefined || koRebindValue === "") {
                    MManual.Foundation.Presentation.Logging.Warn("re-bind value not available");
                    return;
                }
                var $matchingCandidate = candidates.find("[data-ko-rebind='" + koRebindValue + "']");
                if ($matchingCandidate.length >= 0) {
                    reBindKoContext($matchingCandidate.get(0), orderizeElement);
                    MManual.Foundation.Presentation.Logging.Debug("Re-bound " + koRebindValue);
                } else {
                    MManual.Foundation.Presentation.Logging.Warn("No re-bind candidate for " + koRebindValue);

                }
            });

        return this;
    }


    function destroy() {
        var candidates = this.$candidates;

        this.$container.find("[data-ko-rebind]")
            .each(function (index, orderizeElement) {
                // for each element, find corresponding element in $candidates
                var koRebindValue = $(orderizeElement).data('ko-rebind');
                if (koRebindValue === undefined || koRebindValue === "") {
                    MManual.Foundation.Presentation.Logging.Warn("re-bind value not available");
                    return;
                }
                var $matchingCandidate = candidates.find("[data-ko-rebind='" + koRebindValue + "']");
                if ($matchingCandidate.length >= 0) {
                    reBindKoContext($(orderizeElement).get(0), $matchingCandidate.get(0));
                    MManual.Foundation.Presentation.Logging.Debug("Re-bound " + koRebindValue);
                } else {
                    MManual.Foundation.Presentation.Logging.Warn("No re-bind candidate for " + koRebindValue);

                }
            });

        this.$container.empty();
        this.$candidates = $(this.candidates);
        this.$candidates.removeClass('orderize__candidate--hide');
    }

    //private module methods
    function sortByOrder(a, b) {
        return getOrder(a) - getOrder(b);
    }

    function getOrder(element) {
        return parseInt($(element).data('orderize'));
    }

}(MManual));;
$(function () {
    MManual.helpers = MManual.helpers || {}

    var el = MManual.domCache();

    var Header = MManual.Foundation.Components.Header;
    var EventBus = MManual.Foundation.Presentation.EventBus;

    MManual.helpers.options = MManual.helpers.options || {};
    

    MManual.helpers.setScrollOverride = function (offsetOverrideValue) {
        if (offsetOverrideValue && !isNaN(offsetOverrideValue)) {
            MManual.helpers.options.offsetOverride = offsetOverrideValue;
        } else {
            MManual.helpers.options.offsetOverride = null;
        }

    }

    MManual.helpers.getScrollOverride = function () {
        var overrideValue = MManual.helpers.options.offsetOverride;
        if (typeof (overrideValue) !== "undefined" && !isNaN(overrideValue)) {
            return overrideValue;
        } else {
            return 10;
        }
    }

    MManual.helpers.scrollToAnchor = function () {

        // BAETB003-4198 - this line was commented due to possible iOS changes
        // that prevented anchor from working
        // Do not adjust scroll position on Safari 10 and lower 
        // It causes very strange behaviour like page jumping and wrong anchor clicks
        // if (MManual.utils.browser.isIos10AndLower && MManual.Helpers.mq.isMobile()) {
        // return true;
        // }

        // don't catch anchors on lexicomp drug popup
        if ($('.lexi-main').length > 0) {
            return false;
        }
        // don't catch anchors on calculator/self-assessment tabs on homepage
        if (this.className && this.className.indexOf("calculators__link") >= 0) {
            return false;
        }
        if (this.pathname && this.hostname &&
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname) {
            var hashTarget = $(this.hash);
            if (hashTarget.length == 0 && this.hash.indexOf('#') > -1) {
                var anchorName = this.hash.replace('#', '');
                hashTarget = $("a[name='" + anchorName + "']");
            }

            expandToDestination(hashTarget);
            scrollToDestination(hashTarget);
        }
    };

    MManual.helpers.getScrollTop = function () {
        var offset = $(window).scrollTop();
        var headerHeight = MManual.Foundation.Components.Header.getHeight();
        if(headerHeight < 141){
            headerHeight = 141
        }
        offset += headerHeight
        return offset;
    }

    $('body').on('click',
        'a[href*=\\#]:not([href=\\#])', MManual.helpers.scrollToAnchor);


    function expandToDestination(target) {

        if (target.length) {
            if (window.innerWidth <= 1024) {
                
                expandHeader(target);

                target.parents(".header")
                    .each(function () {
                        expandHeader($(this));
                    });
            }
            return false;
        }

    };

    function expandHeader(header) {
        if (header.length > 0) {
            $("header", header).addClass("expanded");
            $("div.header-body", header).show();
        }
    }

    function callOnScrollingToFragment(fragment) {
        var event = jQuery.Event("scrollingToFragment");
        event.fragment = fragment;
        $(window).trigger(event);
        if (event.isPropagationStopped()) {
            return true;
        }
        return false;
    }

    function getFragmentPosition(fragment) {
        var breadcrumbHeight = $(".l-layer--breadcrumb").outerHeight() || 0;
        var letterpineHeight = $('#l-group--header-letterpine').height() || 0;
        var destination = $(fragment).offset().top - letterpineHeight - breadcrumbHeight;
        if (window.location.hash == !!window.MSInputMethodContext && !!document.documentMode) {
            destination = destination -33;
        }
        return destination;
    }

    function scrollToDestination(fragment, immediately) {
        if (fragment.length === 0) {
            return false;
        }

        if (callOnScrollingToFragment(fragment))
            return false;

        var destination = getFragmentPosition(fragment);

        if ($(fragment).parent().attr('class') !== "table-box") {
            $(fragment).parent().height('auto');
        }

        var scroll = function () {
            MManual.scroll.to(destination)
                .done(function () { //after scroll callback
                    var newDestination = getFragmentPosition(fragment);
                    // compare destinations with tolerance to 5 pixels
                    if (Math.abs(newDestination - destination) > 5) {
                        adjustPositionToFixedHeader(fragment);
                    } else {
                        //                        EventBus.emitEvent("scrolledToDestination");
                        EventBus.emitEvent("scroll.finished");
                    }
                });
        }

        if (immediately) {
            scroll();
        } else {
            setTimeout(scroll, 10);
        }
        return false;
    }

    function adjustPositionToFixedHeader(fragment) {
        var destination = getFragmentPosition(fragment);

        MManual.scroll.to(destination)
            .done(function () {  //after scroll callback
                EventBus.emitEvent("scroll.finished");
                $(window).trigger("scroll.finished");
            });
    }

    function getLocation(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }

    //exports
    MManual.helpers.scrollToDestination = scrollToDestination;
    MManual.helpers.expandToDestination = expandToDestination;
    MManual.helpers.getLocation = getLocation;

    MManual.helpers.onScrollingToFragment = function (callback) {
        $(window).on("scrollingToFragment", callback);
    }

    MManual.helpers.onNotScrolling = function (callback) {
        $(window).on("notScrollingToFragment", callback);
    }

    MManual.helpers.onScrolledToFragment = function (callback) {
        EventBus.addEventListener("scroll.finished", callback);
    }

    MManual.helpers.offScrollingToFragment = function (callback) {
        $(window).off("scrollingToFragment", callback);
    }

    MManual.helpers.offScrolledToFragment = function (callback) {
        EventBus.removeListener("scroll.finished", callback);
    }

    function getHashTarget() {
        var $target = $(window.location.hash);
        $target = $target.length ? $target : $('[name="' + window.location.hash.slice(1) + '"]');
        return $target;
    }
    MManual.helpers.getHashTarget = getHashTarget;

    $(window)
        .on('load', function () {
            if (window.location.hash) {
                var $target = getHashTarget();
                expandToDestination($target);
                scrollToDestination($target);
            } else {
                $(window).trigger("notScrollingToFragment");
            }
            return false;
        });
});



jQuery(document).ready(function ($) {
    //Ensure all external links open in new window.
    $('a')
        .filter('[href^="http"], [href^="//"]')
        .not('[href*="' + window.location.host + '"]')
        .not('.h-keep-target')
        .attr('target', '_blank');

    var query = URI.parseQuery(URI.parse(document.location.href).query);
    if (query != null && query["media"] != null && query["media"] == "print") {
        $("a[href]").each(function (index, value) {
            if ($(this).attr("target") != "_blank") {
                var href = $(this).attr("href");
                var uri = new URI(href);
                href = uri.addSearch("media", "print").toString();
                $(this).attr("href", href);
            }
        });
    }
    if (query != null && query["media"] != null && query["media"] == "hybrid") {
        $("a[href]").each(function (index, value) {
            if ($(this).attr("target") != "_blank") {
                var href = $(this).attr("href");
                if(href.charAt(0) != "#"){
                    var uri = new URI(href);                    
                    if (query["client"] != null && query["client"] == "vin") {
                        if (href.indexOf('#') > -1) {
                            href = uri.addSearch("media", "hybrid").toString();
                            var urlPath = href.substring(0, href.indexOf('#'));
                            var vasontID = href.substring(href.indexOf('#'), href.length);
                            var newUri = new URI(urlPath);
                            urlPath = newUri.addSearch("media", "hybrid").toString();
                            var vinUser = "&client=vin";
                            urlPath = urlPath.concat(vinUser, vasontID);
                            $(this).attr("href", urlPath);
                        } else {
                            href = uri.addSearch("media", "hybrid").toString();
                            var vinUser = "&client=vin";
                            href = href.concat(vinUser);
                            $(this).attr("href", href);
                        }                        
                    } else {
                        href = uri.addSearch("media", "hybrid").toString();
                        $(this).attr("href", href);
                    }
                }
            }
        });
    }
    if (query != null && query["media"] != null && query["media"] == "full") {
        $("a[href]").each(function (index, value) {
            if ($(this).attr("target") != "_blank") {
                var href = $(this).attr("href");
                var uri = new URI(href);
                href = uri.addSearch("media", "full").toString();;
                $(this).attr("href", href);
            }
        });
    } 
});
;
(function (Helpers) {
    Helpers.translation = {
        translateNumber: translateNumber
    };

    function translateNumber(number) {
        // ensure number is a string
        var numberString = number.toString();

        return numberString.replace(/[0-9]/g,
            function(w) {
                return MManual.CommonNumbers[+w];
            });
    }


}(MManual.Helpers = MManual.Helpers || {}));;
(function (MM) {
    var EventBus = MM.Foundation.Presentation.EventBus;
    var Log = MM.Foundation.Presentation.Logging;

    //initialize helpers module
    MM.Components = {};
    MM.Components.Breadcrumb = {
    }

    var elements;

    // Cache for DOM elements
    // Will be initialized only once
    // Can be a place to attach to events of particular elements like breadcrumb
    MM.domCache = function () {
        if (elements)
            return elements;

        var breadcrumb = $('.l-layer--breadcrumb');


        elements = {
            $header: $(".l-group--header"),
            $headerFixed: $(".l-group--headerfixed .l-layer--header"),
            // Obsolete : $letterSpine
            $letterSpine: $(".letterspine"),
            letterSpine: {
                container: $(".l-layer--letterspine"),
                component: $(".letterspine")
            },
            breadcrumb: {
                container: breadcrumb,
                exists: breadcrumb.length > 0,
            },
            layers: {
                mainMenu: $(".l-layer--mainmenu").get(0)
            },
            topic: {
                $mainSidebar: $(".main__sidebar--topic")
            }
        }

        initBreadcrumb(breadcrumb);

        return elements;
    };

    function initBreadcrumb(breadcrumb) {
        var callback = function (offset) {
            offset = MManual.Foundation.Components.Header.getHeight(300);

            var currentTop = parseInt(breadcrumb.css("top"), 10);
            if (currentTop !== offset) {
                Log.Debug("Setting top height for breadcrumb = " + offset, "Breadcrumb");
                var headerHeight =  $('#l-group--header-letterpine').outerHeight();
                var letterSpineHeight = $(".l-layer--letterspine").height();
                var searchBarHeight = $('.l-layer--searchbar').height();

                function checkUndefined(value){
                    if(value == undefined){
                        return 0;
                    } else {
                        return value;
                    }
                }
                letterSpineHeight = checkUndefined(letterSpineHeight);
                searchBarHeight = checkUndefined(searchBarHeight);

                breadcrumb.css("top", headerHeight);
            }
        };

        EventBus.addEventListener("components.header.changed", callback);
    }


    function stickySocial(){
        var trustSdkBanner = $('#onetrust-banner-sdk');
        var headerLetterSpine = $('#l-group--header-letterpine');
        var headerNoLetterSpine = $('#l-group--header-letterpine--fixed');
        var headerNoLetterSpineCont = $('.l-layer--header.l-layer--fixed');
        var smartBanner = $('.smartbanner');
        var mobileSocial = $('.home-share .l-layer--actiontoolbar');
        var bannerCheck = $('.l-layer--banner');
    
        var trustSdkBannerHeight, headerLetterSpineHeight, headerNoLetterSpineHeight, smartBannerHeight, bannerCloseHeight = 0;
    
        function calcElementHeight(item){
            if(item.css('display') != 'none' && $(item).length != undefined && $(item).length != 0) {
                     return item.height();
            } else {
                 return 0;
            }
        }
    
        if($(window).width() < 1025){
            mobileSocial.insertAfter(headerNoLetterSpine);
            trustSdkBannerHeight = calcElementHeight(trustSdkBanner);
            headerLetterSpineHeight = calcElementHeight(headerLetterSpine);
            headerNoLetterSpineHeight = calcElementHeight(headerNoLetterSpineCont);
            smartBannerHeight = calcElementHeight(smartBanner);
    
            if(bannerCheck.length == 1){
                bannerCloseHeight = 24;
            } else {
                bannerCloseHeight = 0;
                }
        
    
            var docTop = $(document).scrollTop() + headerLetterSpineHeight;
    
            if(docTop >= headerLetterSpineHeight + trustSdkBannerHeight + smartBannerHeight + bannerCloseHeight){
                  var socialShareTop = headerLetterSpineHeight + 14;
                  mobileSocial.css({'position':'fixed','top': socialShareTop + 'px'});
            } else {
                  var socialShareTop =  headerLetterSpineHeight + smartBannerHeight + bannerCloseHeight + 14;
                  mobileSocial.css({'position':'absolute','top': socialShareTop + 'px'});
            }
        } else {
            mobileSocial.insertBefore('.l-layer--main');
            mobileSocial.removeAttr('style');
            }
    }
    
    $(document).ready(function(){
       stickySocial();
    });
    $(window).scroll(function(){
        setTimeout(function(){
            stickySocial();
        },100);
    });
    $(document).click(function(){
       stickySocial();
    });


}(window.MManual = window.MManual || {}, jQuery));;
(function($) {
    $(document).ready(function() {
        $.fn.mmAutocomplete = function(options) {
            var me = this;
            var options = $.extend({},
                {
                    classes: {
                        'ui-autocomplete': 'autocomplete',
                        //not overriden
                        'ui-autocomplete-input':'ui-autocomplete-input',
                        'ui-autocomplete-loading':'ui-autocomplete-loading'
                    },
                    open: function () {
                        $(".autocomplete").css({
                            'width': 'auto',
                            'left':'14px',
                            'right':'14px',
                            'top': '30px'
                        });
                     },
                },
                options);
            me.autocomplete(options).focus(function () {
                $(this).autocomplete("search", this.value);
            });
            return me;
        };
    });
})(jQuery);;
function isIE(version, comparison) {
    var cc = 'IE',
        b = document.createElement('B'),
        docElem = document.documentElement,
        isIE;

    if (version) {
        cc += ' ' + version;
        if (comparison) { cc = comparison + ' ' + cc; }
    }

    b.innerHTML = '<!--[if ' + cc + ']><b id="iecctest"></b><![endif]-->';
    docElem.appendChild(b);
    isIE = !!document.getElementById('iecctest');
    docElem.removeChild(b);
    return isIE;
}

(function (MManual) {

    MManual.getTopicsForResource = function (itemId, resultObservableArray, loadingFlagObservable) {
        if (!itemId) {
            return;
        }

        var serviceUrl = "https://mmuatmobileapp01.azurewebsites.net/api/content/Gettopicresource";

        loadingFlagObservable(true);
        resultObservableArray.removeAll();

        var getFilterParams = '';        
        var newParam = localStorage.getItem('vet_param');
        if (newParam != null && newParam.length) {
            newParam = JSON.parse(newParam).join(' ');
            getFilterParams = newParam;              
        }

        var dataObj;
        if (getFilterParams.length > 0) {
            dataObj = {
                resourceId: itemId,
                species: getFilterParams
            };
        }
        else {
            dataObj = { resourceId: itemId };
        }

        $.ajax({
            showSplashScreen: false,
            type: "GET",
            dataType: "json",
            url: serviceUrl,
            data: dataObj,
            traditional: true
        }).done(function (data) {
            if (!data || !data.TopicsList) {
                return;
            }

            for (var i = 0; i < data.TopicsList.length; i++) {
                var item = data.TopicsList[i];
                if (item.ItemId !== MManual.Context.Item.SitecoreId) {
                    resultObservableArray.push(item);
                }
            }
        }).fail(function (jqxhr, textStatus) {            
            console.error(jqxhr.responseText);
        }).always(function () {
            loadingFlagObservable(false);
        });
    };
}(window.MManual = window.MManual || {}));
;
(function (MM) {
    //initialize helpers module
    MM.Print = {

        isMediaPrint: function () {
            var requestUrl = window.location.href;
            return requestUrl.indexOf("media=print") > -1;
        }
    };
}(window.MManual = window.MManual || {}));

;
(function (Helpers, $) {

    var Log = MManual.Foundation.Presentation.Logging;

    // Class can be used to observed given set of element
    // params : 
    // {
    //      selector : '.test_class',
    //  
    //      // return array of HTML Elements 
    //      getElements : function  - function that will be called to get elements to observe
    //      callback : function     - will be called when current top element will change
    //      offset : number         - offset from the bottom of header to check for current element
    //      enableCache : boolean   - cache the elements and they offset
    // }

    function CurrentTopElementObserver(params) {
        this.defaults = {
            enableCache: true,
            getElements: this._selectElements,
            onNone: function () {},
            offset: 20
        };

        this.settings = $.extend({}, this.defaults, params);

        this.callback = this.settings.callback;
        this.onNone = this.settings.onNone;
        this._getElements = this.settings.getElements;
        this.elementToOffsetMap = [];
        this.topElementId = null;
        this.lasttopElementId = null;
    }

    CurrentTopElementObserver.prototype._selectElements = function () {
        return $(this.settings.selector);
    }

    CurrentTopElementObserver.prototype._mapElementToOffset = function () {
        this.elements = this._getElements().get()
            .map(function (element) { return $(element) });

        this.elementToOffsetMap = this.elements.map(function (element) {
            return {
                id: element.get(0).id,
                offsetTop: element.offset().top
            };
        });
    };

    CurrentTopElementObserver.prototype.refreshItems = function (elements) {
        setTimeout(function () {
            this.elements = elements;
            this.refreshMap();
            this._checkTopSection();
        },
            10);
    }

    CurrentTopElementObserver.prototype.refreshMap = function () {
        this._mapElementToOffset();
    }

    CurrentTopElementObserver.prototype._currentElement = function () {
        var scroll = MManual.helpers.getScrollTop() + this.settings.offset;

        if (this.settings.enableCache === false) {
            this._mapElementToOffset();
        }

        var elementsAboveScreen = this.elementToOffsetMap.filter(
            function (element) {
                return element.offsetTop < scroll;
            });

        var last = elementsAboveScreen.last();
        this.topElementId = last ? last.id : "";
    };

    CurrentTopElementObserver.prototype.getCurrentElement = function () {
        return this.topElementId;
    }

    CurrentTopElementObserver.prototype._checkTopSection = function () {
        this._currentElement();

        if (!this.topElementId) {
            this.onNone();
            this.lasttopElementId = this.topElementId;
            return;
        }

        if (this.lasttopElementId !== this.topElementId) {
            this.callback(this.topElementId);
            this.lasttopElementId = this.topElementId;
        }
    }

    CurrentTopElementObserver.prototype.init = function () {
        this._mapElementToOffset();

        this._checkTopSectionBound = this._checkTopSection.bind(this);
        this._refreshBound = this.refreshMap.bind(this);

        $(window).scroll(this._checkTopSectionBound);
        $(window).resize(this._refreshBound);

        this._checkTopSection();
    }

    CurrentTopElementObserver.prototype.destroy = function () {
        $(window).off("scroll", this._checkTopSectionBound);
        $(window).off("resize", this._refreshBound);
    }

    Helpers.CurrentTopElementObserver = CurrentTopElementObserver;

}(MManual.Helpers = MManual.Helpers || {}, jQuery));;
(function ($, MM) {
    var mq = MM.Helpers.mq;

    var $dots;
    var $wrapped;
    var $container;
    var $segment;
    var $breadcrumb;
    var fixedHeaderHeight;
    var fixedLetterSpineHeight;

    $(document).ready(function () {

        if ($(".breadcrumb__segment").hasClass("breadcrumb__segment--active")) {
            $(".breadcrumb__segment--active .breadcrumb__link").attr("aria-current", "page");
        }

        var mql = mq.minWidth(mq.SMALLTABLET);

        $dots = $('.breadcrumb__segment--dots');
        $wrapped = $('.breadcrumb__segment--wrapped');
        $container = $('.breadcrumb__wrapper--container');
        $segment = $('.breadcrumb__segment');
        $breadcrumb = $('.l-layer--breadcrumb');
        fixedHeaderHeight = $('#l-group--header-letterpine').outerHeight();
        fixedLetterSpineHeight = $('.l-layer--letterspine').outerHeight();

        render(mql);
        var topicMobileSidebar = $('.main-sidebar-topic-cont');
        $(document).on('click', '.breadcrumb__icons--sidebar', function(){
            $('.main__sidebar--topic').addClass('mobileSidebar');
            $('.mobileSidebar .additional-content').addClass('collapsed').find('.additional-content__toggle').removeClass('expanded');
            $('.topicmenu__accordion .topicmenu__item').removeClass('topicmenu__item--displayed');
            bodyScrollLock.disableBodyScroll(topicMobileSidebar[0]);
        });
    });

    function handleBreadcrumbsMobile() {
        setBreadcrumbTop(true);
        $(document).on('orientationchange', function () { setBreadcrumbTop(true) });

        $(".l-layer__content.breadcrumb").attr("tabindex", "0");

        //showCrumbs();
        collapseCrumbs();
        handleScrollEvents();
        
        $dots.click(function (e) {
            $(this).hide();
            $(this).parent().find($wrapped).fadeIn().css("display", "inline");
            e.preventDefault();
        });
    }

    function showCrumbs() {
        $dots.hide();
        $dots.parent().find($wrapped).fadeIn().css('display', 'inline');
    }

    function collapseCrumbs() {
        $dots.show();
        $dots.fadeIn().css("display", "inline");
        $wrapped.hide(400);
        if($('.topic__header--section').length){
            setTimeout(function(){
                stickyAccordionTitle();
            },410);
        }

    }

    function handleScrollEvents() {
        $(window).scroll(function () {
            MManual.Foundation.Presentation.Performance.debounce({
                id: "breadcrumb.collapse",
                callback: collapseIfNeeded,
                timeout: 400
            });
        });
    }

    var scrollPosition = $(window).scrollTop();

    function collapseIfNeeded() {

        // if ($(window).scrollTop() === 0) {
        //     showCrumbs();
        //     $(overlay).hide();
        // } else {
        //     if (checkIfCollapse()) {
        //         var current = $(window).scrollTop();
        //         var scrollMove = scrollPosition - current;

        //         if (Math.abs(scrollMove) > 1) {
        //             collapseCrumbs();
        //         }

        //         scrollPosition = current;
        //     }
        // }
        collapseCrumbs();
    }

    function checkIfCollapse() {
        var activeHeight = $segment.first().height() * 2;
        var wrapperHeight = $container.height();

        return wrapperHeight > activeHeight;
    }

    function initMobile() {
        handleBreadcrumbsMobile();
    }

    function initDesktop() {
        setBreadcrumbTop(false);
        showCrumbs();
    }

    function setBreadcrumbTop(isMobile) {
        if (isMobile || !fixedLetterSpineHeight) {
            $breadcrumb.css({ top: fixedHeaderHeight + "px" });
        } else {
            $breadcrumb.css({ top: fixedHeaderHeight + "px" });
        }
    }

    function render(mql) {
        if (!mql.matches) {
            initMobile();
        } else {
            initDesktop();
        }
    }
}(jQuery, MManual));
;
var accessConfirmationPopup = {
    cookieName: "",
    checkIfAlreadyConfirmed: function () {
        var self = this;
        var $viewport = $(".l-viewport");
        var cookieValue = self.readCookie();
        if (cookieValue) {
            $viewport.removeClass('blur');
            return true;
        }
        else {
            $viewport.addClass('blur');
            return false;
        }

    },

    removeTrailingSlash: function (url) {
        return url.replace(/\/$/, "");
    },

    isChina: function (urls) {
        return urls.indexOf("msdmanuals/zh") > 0 || urls.indexOf("msdmanuals.cn") > 0 || urls.indexOf("msdmanuals.com/zh") > 0;
    },

    showConfirmationModal: function (cookieName) {
        var self = this;
        var $viewport = $(".l-viewport");
        
        $viewport.addClass('blur');

        $('.confirmationpopup__button--yes').click(function () {
            document.cookie = cookieName + "=true;path=/";
            accessConfirmationPopup.checkIfAlreadyConfirmed();
            $(".ZebraDialog").hide();
            self.dialog.close();
            $viewport.removeClass("blur");
            return true;
        });
        $('.confirmationpopup__button--no').click(function () {
            var windowLocation = window.location;
            var windowHistory = window.history;
            var windowUrls = window.location.href;
            var previousPageUrls = self.removeTrailingSlash(document.referrer);
            var landingPageUrl = self.removeTrailingSlash($('#landingPageUrl').val());

            if (self.isChina(windowUrls)) {
                if (windowHistory.length > 1 && previousPageUrls !== landingPageUrl && (self.isChina(previousPageUrls))) {
                    windowHistory.back();
                }
                else {
                    window.location.href = $('.versionSwitcher__text a').attr('href');
                }
            }
            else {
                if (windowHistory.length > 1) {
                    windowHistory.back();
                }
                else {
                    window.location.href = landingPageUrl;
                }
            }
            self.dialog.close();
            return false;
        });
        self.dialog = $.Zebra_Dialog({
            source: { inline: $('#access-confirmation-popup') },
            overlay_close: false,
            show_close_button: false,
            reposition_speed: 10,
            type: false,
            buttons: false,
            keyboard: false, // prevents close on ESC
            modal: true,
            custom_class: 'confirmationpopup'
        });

    },
    readCookie: function () {
        var nameEQ = this.cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};
var externalLinkConfirmation = {

    showConfirmationModal: function (url) {
        var self = this;
        var $viewport = $(".l-viewport");
        $viewport.addClass('blur');

        self.dialog = new $.Zebra_Dialog({
            source: { inline: $('#external-link-confirmation-popup').clone() },
            overlay_close: false,
            show_close_button: false,
            reposition_speed: 10,
            type: false,
            buttons: false,
            keyboard: false, // prevents close on ESC
            modal: true,
            custom_class: 'confirmationpopup'
        });
        $('.confirmationpopup__button--yes').click(function () {
            self.dialog.close();
            $viewport.removeClass("blur");
            window.open(url);
            return true;
        });
        $('.confirmationpopup__button--no').click(function () {
            self.dialog.close();
            $viewport.removeClass("blur");
            return false;
        });

    },
};;
(function (MManual) {
    var defaults = {
        sectionIdParser: function (sectionId) {
            return sectionId.slice(-1).toUpperCase();
        },
        sectionIdBuilder: function (letter) {
            return "lettergroup-" + letter.toLowerCase();
        },
        visibility: function () { return true; },
        topOffset: 20
    }

    MManual.ViewModels = MManual.ViewModels || {};

    MManual.ViewModels.LetterMobileNavigation = {
        createViewModel: function (options) {
            var self = this;
            this.options = $.extend({}, defaults, options);

            this.letters = ko.observableArray(options.letters || []);
            this.current = ko.observable("");
            this.letterSpace = ko.observable(20);

            this.showSection = function (sectionId) {
                var letter = self.options.sectionIdParser(sectionId);
                self.current(letter);
            }

            this.isCurrent = function (letter) {
                if (self.current() && letter) {
                    return self.current() === letter;
                }
                return false;
            }

            this.href = function (letter) {
                if (letter === defaults.fillCharacter) {
                    return "#";
                }
                return "#" + self.options.sectionIdBuilder(letter);
            }

            this.heightChanged = function (height) {
                var spacePerLetter = 32;
                self.options.maxLetters = height / spacePerLetter;
            }

            this.calculateLetterSpace = function (heights) {
                var availableSpace = Math.max(312, Math.min(heights.content, 520));
                var space = Math.floor(availableSpace / self.letters().length);
                self.letterSpace(space);
            }

            return this;
        }
    }

}(window.MManual = window.MManual || {}));

ko.components.register('letter-navigation',
    {
        template: { element: 'letter-navigation-template' },
        viewModel: MManual.ViewModels.LetterMobileNavigation
    });
;
(function (MManual) {
    MManual.InlinemediaBaseViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params);

            self.isInline = ko.computed(function () {
                return self.Placement() === "inline";
            });

            self.isText = ko.computed(function () {
                return self.Placement() === "text";
            });

            self.isSideline = ko.computed(function () {
                return self.Placement() === "sideline";
            });

            self.ImageWidth = self.ImageWidth || ko.observable("");
            self.ImageHeight = self.ImageHeight || ko.observable("");

            if (!self.IsInCarousel) {
                self.IsInCarousel = ko.computed(function () {
                    return false;
                });
            }

            self.isPrint = ko.computed(function () {
                return MManual.Print.isMediaPrint();
            });

            self.multimediaLinkComponentName = ko.computed(function () {
                return self.isText() ? "multimedia-link-text" : "multimedia-link-block";
            });

            self.detailsVisible = ko.observable(true);

            self.propertyHasValue = function (property) {
                return (property !== undefined && typeof property === "function" && property() !== "");
            };

            self.detailsAvailable = ko.computed(function () {
                return self.propertyHasValue(self.Credits) || self.propertyHasValue(self.Description);
            });

            self.toggleDetails = function () {
                self.detailsVisible(!self.detailsVisible());
            };

            self.toggleDetailsFunction = function (item, event) {
                $(event.target).parent('.inlinemedia__action').toggleClass('inlinemedia__action--show').toggleClass('inlinemedia__action--hide');
            };

            self.multimediaPopup = MManual.Feature.MultimediaPopup.ViewModel;

            self.multimediaLinkModel = new MManual.MultimediaLinkViewModel({
                item: params,
                linkText: self.Title(),
                listName: self.MediaType() !== undefined && self.MediaType() !== null && self.MediaType() === "featuredlink" ? '' : '',
                options: {
                    loadLocations: false,
                    singleItem: true,
                    hideCarousel: true
                }
            });

            if (self.MediaType() !== undefined && self.MediaType() !== null && self.MediaType() !== "featuredlink") {
                self.multimediaPopup.addToList(self.multimediaLinkModel);
            }

            self.componentClasses = ko.computed(function () {
                var typeClass = 'inlinemedia--' + self.MediaType();
                var placementClass = self.isSideline() && !self.IsInCarousel() ? 'inlinemedia--right' : 'inlinemedia--full';

                return [typeClass, placementClass].join(' ');
            });

            return self;
        }
    };
}(window.MManual = window.MManual || {}));;
(function (MManual) {
    MManual.InlinemediaFeaturedLinkViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));
            self.isModal = ko.computed(function () {
                return self.Target() === "modal";
            });
            self.IframeSrcComputed = ko.computed(function () {
                return self.IsRelativePath() && self.IframeSrc() !== undefined && self.IframeSrc() !== null ? "/" + $("#currentLanguage").val() + "/" + $("#currentEdition").val() + self.IframeSrc() : self.IframeSrc();
            });
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-featuredlink',
    {
        template: { element: 'inlinemedia-featuredlink-template' },
        viewModel: MManual.InlinemediaFeaturedLinkViewModel
    });;
/// <reference path="../../../../../Foundation/Presentation/code/MultimediaPopup/PopupOptions.cs.d.ts" />
/// <reference path="../../../../../Foundation/Presentation/code/Media/MultimediaModel.cs.d.ts" />
/// <reference path="../../../../../Foundation/Presentation/code/Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../../../../Foundation/Presentation/code/Scripts/Common/Extensions.d.ts" />
var MManual;
(function (MManual) {
    var Feature;
    (function (Feature) {
        var MultimediaPopup;
        (function (MultimediaPopup) {
            var Common = /** @class */ (function () {
                function Common() {
                }
                Common.GetModel = function (element, dataPrefix) {
                    if (dataPrefix === void 0) { dataPrefix = "popup"; }
                    var modelSerialized = element.getAttribute("data-" + dataPrefix + "-model").trimChar("'");
                    var model = JSON.parse(modelSerialized);
                    model.Title = decodeURIComponent(model.Title);
                    model.Description = decodeURIComponent(model.Description);
                    model.MediaNameTranslated = decodeURIComponent(model.MediaNameTranslated);
                    var koModel = ko.mapping.fromJS(model);
                    var optionsAttr = element.getAttribute("data-" + dataPrefix + "-options").trimChar("'");
                    var options = JSON.parse(optionsAttr);
                    options.LinkText = decodeURIComponent(options.LinkText);
                    options.PopupTitle = decodeURIComponent(options.PopupTitle);
                    options = jQuery.extend({}, this.defaultOptions, options);
                    var viewModel = {
                        item: koModel,
                        options: options
                    };
                    // TODO remove below line when refactign this.
                    viewModel = jQuery.extend({}, this.defaultOptions, viewModel);
                    return viewModel;
                };
                Common.defaultOptions = {
                    hideTitle: false,
                    hideCarousel: false,
                    genericPopupTitle: true,
                    loadLocations: true,
                    displaySingleItem: false,
                };
                Common.popupAttr = "data-popup-model";
                return Common;
            }());
            MultimediaPopup.Common = Common;
        })(MultimediaPopup = Feature.MultimediaPopup || (Feature.MultimediaPopup = {}));
    })(Feature = MManual.Feature || (MManual.Feature = {}));
})(MManual || (MManual = {}));
//# sourceMappingURL=Common.js.map;
(function (MManual) {
    MManual.MultimediaLinkViewModel = function (params) {
        var self = this;
        var options = params.options;
        //
        self.item = params.item;
        if (!self.item) {
            var elem = params.element;
            var viewModel = MManual.Feature.MultimediaPopup.Common.GetModel(elem);
            self.item = viewModel.item;
            self.options = viewModel.options;
            options = self.options;
        } else {
            options = jQuery.extend({}, MManual.Feature.MultimediaPopup.Common.defaultOptions, params.options);
        }

        if (!self.item.ItemId) {
            self.item.ItemId = ko.observable(hashCode(self.item));
        }
        if (!self.item.ImageUrl) {
            self.item.ImageUrl = ko.observable();
        }
        if (!self.item.VideoId) {
            self.item.VideoId = ko.observable();
        }
        if (!self.item.Placement) {
            self.item.Placement = ko.observable('sideline');
        }

        self.options = options;

        // Below section should be removed after full Vasont reimport ( 2021-02-08 )
        var linkText = params.linkText || options.LinkText || "";
        self.linkText = decodeURIComponentSafe(linkText);
        self.showTooltip = params.showTooltip || options.ShowTooltip || false;
        self.target = params.target || options.Target || "modal";
        if (self.target == "modal") {
            self.isModal = true;
        }
        else {
            self.isModal = false;
        }
        self.url = params.url || options.Url|| "";
        self.cssClass = params.cssClass || options.CssClass || "";
        self.listName = params.listName || options.ListName || "other";
        self.displaySingleItem = params.displaySingleItem || options.singleItem || false;
        self.hideTitle = params.hideTitle || options.hideTitle || true;
        self.hideMainArrows = params.hideMainArrows || options.HideMainArrows || false;

        // Unescape multiple times to just to be sure :D
        self.options.PopupTitle = decodeURIComponentSafe(options.PopupTitle || self.item.MediaNameTranslated());
        self.options.hideCarousel = params.hideCarousel || options.HideCarousel || false;
        self.options.displaySingleItem = params.displaySingleItem || options.SingleItem || options.displaySingleItem || false;
        self.options.hideMainArrows = params.hideMainArrows || options.HideMainArrows || false;

        if (self.item.Description) {
            self.item.Description(decodeURIComponentSafe(self.item.Description()));
        }
        // END

        var title = decodeURIComponentSafe(self.item.Title());
        self.item.Title(title);

        self.updateTick = params.updateTick || ko.observable();

        self.multimediaPopup = MManual.Feature.MultimediaPopup.ViewModel;

        self.showPlayer = function () {
            $('.multimedia__link--block, .multimedia__link--text').attr('aria-expanded', $('.multimedia__link--block, .multimedia__link--text').attr('aria-expanded') === 'true' ? 'false' : 'true');
            self.multimediaPopup.showPopup(self);
        };

        self.multimediaPopup.addToList(self);

        self.hover = ko.observable();

        self.enableHover = ko.observable(self.options.modalIndicatorOnHover || self.options.ShowModalIndicator || false);
    };
}(window.MManual = window.MManual || {})
);

ko.components.register('multimedia-link-text',
    {
        template: { element: 'multimedia-link-text-template' },
        viewModel: MManual.MultimediaLinkViewModel
    });

ko.components.register('multimedia-link-block',
    {
        template: { element: 'multimedia-link-block-template' },
        viewModel: MManual.MultimediaLinkViewModel
    });

ko.components.register('resources-page-link-text',
    {
        template: { element: 'resources-page-link-text-template' },
        viewModel: MManual.MultimediaLinkViewModel
    });

ko.components.register('resources-page-link-block',
    {
        template: { element: 'resources-page-link-block-template' },
        viewModel: MManual.MultimediaLinkViewModel
    });

//Register mlink
ko.components.register('m-link-text',
    {
        template: { element: 'm-link-text-template' },
        viewModel: MManual.MultimediaLinkViewModel
    });;
(function (MManual, $) {
    MManual.Feature.MultimediaPopup = MManual.Feature.MultimediaPopup || {};
    MManual.Feature.MultimediaPopup.ViewModel = {};

    var mq = MManual.Helpers.mq;
    var model = MManual.Feature.MultimediaPopup.ViewModel;
    var previousElement = null;
    var mql = mq.maxWidth(mq.TABLET);

    $(document).ready(function () {
        if (mql.matches) {
            setTimeout(function () {
                $('.multimedia__link--text').removeAttr('title');
            }, 2000);
        }
    });

    $.extend(model, {
        lists: {},
        parametersStack: [],
        activeList: ko.observableArray([]),
        activeEntry: ko.observable(),
        activeIndex: ko.observable(),
        popupTitle: ko.observable(),
        hideCarousel: ko.observable(false),
        playerVisible: ko.observable(false),
        clearIframeSrc: ko.observable(false),
        displaySingle: ko.observable(false),
        hideMainArrows: ko.observable(false),
        enableShare: ko.observable(MManual.settings.socialMedia.enableMultimediaPopupShareButton),
        expanded: ko.observable(false),
        expandTransitionEnd: ko.observable(false),
        descriptionDivRef: ko.observable(),
        detailsAvailable: ko.observable(false),
        shareUrl: ko.observable(''),
        shareTitle: ko.observable(''),

        isZoomed: ko.observable(false),
        canSwipe: function () {
            var isNotOnTopic = MManual.Foundation.Context.Item.TemplateId !== MManual.Foundation.TemplateIds.Topic;
            var isNotZoomed = model.isZoomed() === false;
            return isNotOnTopic && isNotZoomed;
        },

        printTarget: window,
        openForParams: function (params) {
            bodyScrollLock.clearAllBodyScrollLocks();
            MManual.scroll.saveScroll();
            $("body").addClass("popup");
            var model = MManual.Feature.MultimediaPopup.ViewModel;

            model.setActiveList(params);

            model.activeEntry({
                item: params.item,
                options: params.options,
                index: model.activeIndex()
            });

            model.playerVisible(true);
            model.clearIframeSrc(false);
        },
        setShareUrl: function (baseUrl, uniqueId, shareTitle) {
            var landingInput = $('#landingPageUrl');
            var standaloneMultimediaInput = $('#standaloneMultimediaBaseUrl');
            if (landingInput.length === 0 || standaloneMultimediaInput.length === 0) return;
            var landingUrl = landingInput.val().replace(/\/$/, "");
            var standaloneMultimediaBaseUrl = standaloneMultimediaInput.val().replace(/\/$/, "");
            var shareUrl = '';
            if (landingUrl && baseUrl && uniqueId && standaloneMultimediaBaseUrl) {
                // trim extension
                if (uniqueId.indexOf('.') >= 0) {
                    uniqueId = uniqueId.split('.').slice(0, -1).join('.');
                }
                shareUrl = landingUrl + standaloneMultimediaBaseUrl + '/' + baseUrl + uniqueId;
            }
            model.shareUrl(shareUrl);
            model.shareTitle(shareTitle);

            if (typeof a2a != "undefined") {
                a2a.init('page');
            }
        },
        setSharePageUrl: function (iframeSrcComputed, isRelativePath, shareTitle) {
            var landingInput = $('#landingPageUrl');
            var landingUrl = landingInput.val().replace(/\/$/, "");
            var shareUrl = '';
            if (isRelativePath) {
                iframeSrcComputed = iframeSrcComputed.replace("//", "/");
                iframeSrcComputed = iframeSrcComputed.toLowerCase();
                shareUrl = landingUrl + iframeSrcComputed;
            }

            else {
                shareUrl = iframeSrcComputed;
            }
            
            model.shareUrl(shareUrl);
            model.shareTitle(shareTitle);

            if (typeof a2a != "undefined") {
                a2a.init('page');
            }
        },
        setShareUrlWithTitle: function (baseUrl, shareTitle, optimizedTitle) {
            var landingInput = $('#landingPageUrl');
            var standaloneMultimediaInput = $('#standaloneMultimediaBaseUrl');
            if (landingInput.length === 0 || standaloneMultimediaInput.length === 0) return;
            var landingUrl = landingInput.val().replace(/\/$/, "");
            var standaloneMultimediaBaseUrl = standaloneMultimediaInput.val().replace(/\/$/, "");
            var shareUrl = '';
            optimizedTitle = optimizedTitle.replace(/(<rt([^]+)rt>)/g, "");
            optimizedTitle = optimizedTitle.replace(/(<sup([^]+)sup>)/g, "");
            optimizedTitle = optimizedTitle.replace(/(<([^>]+)>)/g, "");
            var title = shareTitle.replace(/\s+/g, '-');
            if (landingUrl && baseUrl && shareTitle && standaloneMultimediaBaseUrl) {
                shareUrl = landingUrl + standaloneMultimediaBaseUrl + '/' + baseUrl + title;
            }
            model.shareUrl(shareUrl);
            model.shareTitle(optimizedTitle);

            if (typeof a2a != "undefined") {
                a2a.init('page');
            }
        },
        showPopup: function (params) {
            previousElement = (document.activeElement || document.body);
            model.parametersStack.push(params);
            model.openForParams(params);

            var focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            var modal = document.querySelector('.modal'); // select the modal by it's id

            var firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
            var focusableContent = modal.querySelectorAll(focusableElements);
            var lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

            document.addEventListener('keydown', function (e) {
                var isTabPressed = e.key === 'Tab' || e.keyCode === 9;

                if (!isTabPressed) {
                    return;
                }

                if (e.shiftKey) {
                    // if shift key pressed for shift + tab combination
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus(); // add focus for the last focusable element
                        e.preventDefault();
                    }
                } else {
                    // if tab key is pressed
                    if (document.activeElement === lastFocusableElement) {
                        // if focused has reached to last focusable element then focus first focusable element after pressing tab
                        firstFocusableElement.focus(); // add focus for the first focusable element
                        e.preventDefault();
                    }
                }
            });

            firstFocusableElement.focus();

            document.addEventListener('keydown', function (e) {
                if (e.key === 'ESC' || e.keyCode === 27) {
                    model.hidePopup();
                }
            });

            if (mql.matches) {
                //$('body').addClass('trap-mobile-focus');
                $("body *:not('.multimedia__popup'):not('.multimedia__popup *')").attr('aria-hidden', 'true');
            }

        },
        setActiveList: function (params) {
            if (!params.listName || !model.lists[params.listName]) {
                return;
            }

            var list = model.lists[params.listName];
            var items = list.items;
            if (!items) {
                return;
            }
            model.activeList(items);

            var itemIndex = items.findIndex(
                function (item) {
                    return list.comparer(item.item, params.item);
                });

            model.activeIndex(itemIndex > 0 ? itemIndex : 0);
        },
        hidePopup: function () {
            $('.quiz__form .quiz__submit, .multimedia__link--block, .multimedia__link--text').attr('aria-expanded', 'false');
            var closeModal = model.parametersStack.length <= 1;
            model.parametersStack.pop();
            var paramsToBind = model.parametersStack.last();

            if (closeModal) {
                $("body").removeClass("popup");
                model.playerVisible(false);
                model.clearIframeSrc(true);
                MManual.scroll.bringScroll();
                $(".box.quiz").find(".quiz__checkbox").prop('checked', false);
            } else {
                model.openForParams(paramsToBind);
            }

            if (previousElement) {
                previousElement.focus();
                previousElement = null;
            }

            if (mql.matches) {
                //$('body').removeClass('trap-mobile-focus');
                $("body *:not('.multimedia__popup'):not('.multimedia__popup *')").removeAttr('aria-hidden');
            }
        },
        hidePopupKeyPress: function (data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.hidePopup();
                return false;
            }
            return true;
        },
        toggleExpanded: function () {
            model.expanded(!model.expanded());
        },
        updateActiveIndex: function (nextEntryIndex) {
            if (model.activeIndex() === nextEntryIndex)
                return;

            var entry = model.activeList()[nextEntryIndex];

            model.activeEntry(entry);
            model.activeIndex(nextEntryIndex);
        },
        updateCommon: function (entry) {
            if (!entry.options.PopupTitle) {
                if (entry.options.genericPopupTitle) {
                    entry.options.PopupTitle = entry.item.MediaNameTranslated();
                } else {
                    entry.options.PopupTitle = entry.item.Title();
                }
            }
            model.popupTitle(entry.options.PopupTitle);
            model.hideCarousel(entry.options.hideCarousel);
            model.displaySingle(model.activeList() == null || model.activeList().length <= 1 || entry.options.displaySingleItem);
            model.hideMainArrows(entry.options.hideMainArrows);
        },
        showNext: function () {
            var next = getNextIndex(model.activeIndex());
            model.updateActiveIndex(next);
        },
        showNextKeyPress: function () {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.showNext();
            }
        },
        showPrev: function () {
            var nextEntryIndex = getPrevIndex(model.activeIndex());
            model.updateActiveIndex(nextEntryIndex);
        },
        showPrevKeyPress: function () {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.showPrev();
            }
        },
        showPrevClass: function () {
            var isFirst = model.activeIndex() === 0;
            return "modaldialog__icon--leftarrow" + (isFirst ? "--disabled" : "");
        },
        showNextClass: function () {
            var isLast = model.activeIndex() === model.activeList().length - 1;
            return "modaldialog__icon--rightarrow" + (isLast ? "--disabled" : "");
        },
        showFirst: function () {
            model.updateActiveIndex(0);
        },
        showLast: function () {
            model.updateActiveIndex(model.activeList().length - 1);
        },
        navToClick: function (entry) {
            model.activeEntry(entry);
            model.activeIndex(entry.index);
        },
        navToClickKeyPress: function (entry) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                model.activeEntry(entry);
                model.activeIndex(entry.index);
            }
        },
        addToList: function (link) {
            var list = model.lists[link.listName];

            if (typeof (list) === 'undefined' || list === null) {
                model.createList(link);
            } else {
                var alreadyExists = list.items.some(
                    function (item) {
                        return list.comparer(link.item, item.item);
                    });

                if (!alreadyExists) {
                    list.items.push({ item: link.item, options: link.options, index: list.items.length });
                }
            }
        },
        createList: function (link) {
            model.lists[link.listName] = {
                items: [{ item: link.item, options: link.options, index: 0 }],
                comparer: MManual.utils.startsWith(link.listName, "Search")
                    ? itemsHasSameId
                    : itemsHasSameIdAndUrl
            }
        },
        printPopupContent: function () {
            //var clearPrintContent = function () {
            //    window.removeEventListener('afterprint', clearPrintContent);
            //}
            //window.addEventListener('afterprint', clearPrintContent);
            if (model.printTarget && model.printTarget.print) {
                model.printTarget.print();
            } else {
                window.print();
            }
        },
        printPopupContentKeyPress: function (data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.printPopupContent();
            }
        },

        clearListByPrefix: function (prefix) {
            var searchKeys = getListsByPrefix(prefix);

            model.activeList.removeAll();

            searchKeys.forEach(
                function (key) {
                    model.lists[key].items = [];
                });
        },

        // Carousel
        carouselScrollTick: ko.observable(0),
        isCarouselShowPrevDisabled: ko.observable(true),
        isCarouselShowNextDisabled: ko.observable(true),
        carouselShowPrev: function () {
            $modalcarousel = $('.modalcarousel');
            var width = $modalcarousel.width();
            $modalcarousel.animate({ scrollLeft: $modalcarousel.scrollLeft() - Math.ceil(width / 2) }, 200);
        },
        carouselShowPrevKeyPress: function () {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.carouselShowPrev();
            }
        },
        carouselShowNext: function () {
            $modalcarousel = $('.modalcarousel');
            var width = $modalcarousel.width();
            $modalcarousel.animate({ scrollLeft: $modalcarousel.scrollLeft() + Math.ceil(width / 2) }, 200);
        },
        carouselShowNextKeyPress: function () {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === "Enter" || keyCode === 13) {
                this.carouselShowNext();
            }
        },
        carouselIsScrolled: function (scrollState) {
            model.isCarouselShowPrevDisabled(scrollState.atStart);
            model.isCarouselShowNextDisabled(scrollState.atEnd);
        },
    });

    model.activeEntry.subscribe(function (newEntry) {
        model.updateCommon(newEntry);
    }, null, "change");

    model.descriptionDivRef.subscribe(function (oldDivRef) {
        if (oldDivRef) {
            $(oldDivRef).off("transitionend");
        }
    }, null, "beforeChange");

    model.descriptionDivRef.subscribe(function (newDifRev) {
        if (newDifRev && model.expandTransitionEnd) {
            $(newDifRev).on("transitionend", function () {
                model.expandTransitionEnd(!model.expandTransitionEnd());
            });
        }
    }, null, "change");

    function shareMultimedia(shareData) {
        return {
            url: model.shareUrl()
        };
    }

    function itemsHasSameId(item1, item2) {
        return item2.ItemId() && item2.ItemId() === item1.ItemId();
    }

    function itemsHasSameIdAndUrl(item1, item2) {
        var resource;
        var result;

        if (!MManual.utils.guid.hasValue(item1.ItemId()) || !MManual.utils.guid.hasValue(item2.ItemId())) {
            result = item1.UniqueId() === item2.UniqueId();
        } else {
            result = (item2.ItemId() && item2.ItemId() === item1.ItemId()) ||
                (item2.ImageUrl && item2.ImageUrl() && item2.ImageUrl() === item1.ImageUrl()) ||
                (item2.VideoId && item2.VideoId() && item2.VideoId() === item1.VideoId()) ||
                (item2.AudioUrl && item1.AudioUrl &&
                    item2.AudioUrl() && item1.AudioUrl() &&
                    item2.AudioUrl().split('?')[0] === item1.AudioUrl().split('?')[0]);
        }

        //Assigning Guid for items which have only uniqueIds
        if (!MManual.utils.guid.checkIfCorrect(item1.ItemId()) && window.resourcesIdList && item1.UniqueId) {
            resource = window.resourcesIdList.find(function (element) {
                return element.uniqueId === item1.UniqueId();
            });
            if (resource) {
                item1.ItemId(resource.itemId);
            }
        }
        if (!MManual.utils.guid.checkIfCorrect(item2.ItemId()) && window.resourcesIdList && item2.UniqueId) {
            resource = window.resourcesIdList.find(function (element) {
                return element.uniqueId === item2.UniqueId();
            });

            if (resource) {
                item2.ItemId(resource.itemId);
            }
        }
        return result;
    }

    function getListsByPrefix(prefix) {
        if (model.lists == undefined) {
            return [];
        }

        var listKeys = Object.keys(model.lists);

        var searchKeys = listKeys.filter(
            function (key) { return MManual.utils.startsWith(key, prefix); });

        return searchKeys;
    }

    function getPrevIndex(currentIndex, step) {
        step = step || 1;
        return Math.max(0, currentIndex - step);
    }
    function getNextIndex(currentIndex, step) {
        step = step || 1;
        return Math.min(model.activeList().length - 1, currentIndex + step);
    }

    // attach add to any callback
    window.a2a_config = window.a2a_config || {};
    window.a2a_config.callbacks = window.a2a_config.callbacks || [];
    window.a2a_config.callbacks.push({
        share: function () {
            if (model.playerVisible()) {
                var shareObject = { url: model.shareUrl() };
                if (model.shareTitle() !== undefined && model.shareTitle() !== '') {
                    shareObject.title = model.shareTitle();
                }
                return shareObject;
            }
        }
    }); 
}(window.MManual = window.MManual || {}, jQuery));

ko.components.register('multimedia-popup',
    {
        template: { element: 'multimedia-popup-template' },
        viewModel: { instance: MManual.Feature.MultimediaPopup.ViewModel }
    });

ko.components.register('multimedia-thumbnail',
    {
        template: { element: 'multimedia-thumbnail-template' }
    });;
(function (MManual) {
    MManual.FeaturedLinkPlayerDefaultOptions = {
        hideTitle: false,
        hideCarousel: true,
        genericPopupTitle: true,
        loadLocations: false,
        displaySingleItem: true,
        shareUrlBase: 'article/',
        analyticsType: "Article",
    };
    MManual.FeaturedLinkPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.FeaturedLinkPlayerDefaultOptions, params.options);

            self.IframeSrcComputed = ko.computed(function () {
                return self.IsRelativePath() && self.IframeSrc() !== undefined && self.IframeSrc() !== null ? "/" + $("#currentLanguage").val() + "/" + $("#currentEdition").val() + self.IframeSrc() : self.IframeSrc();
            });

            self.parentContext.popupTitle(self.genericPopupTitle ? self.MediaNameTranslated : self.Title);
            self.parentContext.hideCarousel(true);
            self.parentContext.displaySingle(self.displaySingleItem);

            if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.resizeCallback = null;
            self.attachResizeCallback = function (callback) {
                self.resizeCallback = callback;
            }

            self.parentContext.expandTransitionEnd.subscribe(function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });

            $(window).on("resize", function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });
            $('.modaldialog__icon--share.a2a_dd').show();
            //MManual.analytics.notifyOpenModal(self.analyticsType, self.Title());
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('featuredlink-player',
    {
        template: { element: 'featuredlink-player-template' },
        viewModel: MManual.FeaturedLinkPlayerViewModel
    });;
(function (MManual) {
    MManual.IframePlayerDefaultOptions = {
        hideTitle: false,
        hideCarousel: false,
        genericPopupTitle: true,
        loadLocations: false,
        displaySingleItem: true
    };
    MManual.IframePlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.IframePlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });
            self.parentContext.popupTitle(self.genericPopupTitle ? self.MediaNameTranslated : self.Title);
            self.parentContext.hideCarousel(self.hideCarousel);
            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            self.parentContext.displaySingle(self.parentContext.activeList() == null || self.parentContext.activeList().length <= 1 || self.displaySingleItem);
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();
            $('.modaldialog__icon--share.a2a_dd').show();

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('iframe-player',
    {
        template: { element: 'iframe-player-template' },
        viewModel: MManual.IframePlayerViewModel
    });;
(function (MManual) {
    MManual.TextPlayerDefaultOptions = {
        hideTitle: false,
        hideCarousel: true,
        genericPopupTitle: false,
        loadLocations: false,
        displaySingleItem: true,
        enableShare: false,
    };
    MManual.TextPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.TextPlayerDefaultOptions, params.options);
            $('.modaldialog__icon--share.a2a_dd').show();
            //self.parentContext.enableShare(self.enableShare);
            self.parentContext.popupTitle(self.genericPopupTitle ? self.MediaNameTranslated : self.Title);
            self.parentContext.hideCarousel(self.hideCarousel);
            self.parentContext.displaySingle(self.parentContext.activeList() == null || self.parentContext.activeList().length <= 1 || self.displaySingleItem);
            
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('text-player',
    {
        template: { element: 'text-player-template' },
        viewModel: MManual.TextPlayerViewModel
    });;
(function (MManual) {
    MManual.InlinemediaAudioViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            var $element = $(componentInfo.element);

            function applyAudioSkin() {
                setTimeout(function () {
                    $('audio').mediaelementplayer();
                }, 0);
            }

            function initializePlayer() {
                applyAudioSkin();
            }

            self.Placement.subscribe(function () {
                initializePlayer();
            });

            initializePlayer();

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-audio',
    {
        template: { element: 'inlinemedia-audio-template' },
        viewModel: MManual.InlinemediaAudioViewModel
    });;
(function (MManual) {
    MManual.AudioPlayerDefaultOptions = {
        shareUrlBase: 'audio/',
        analyticsType: "Audios",
    };
    MManual.AudioPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            function applyAudioSkin() {
                setTimeout(function () {
                    $('audio').mediaelementplayer();
                }, 0);
            }

            applyAudioSkin();

            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.AudioPlayerDefaultOptions, params.options);

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('audio-player',
    {
        template: { element: 'audio-player-template' },
        viewModel: MManual.AudioPlayerViewModel
    });;
(function (MManual) {
    MManual.InlinemediaBiodigitalViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-biodigital',
    {
        template: { element: 'inlinemedia-biodigital-template' },
        viewModel: MManual.InlinemediaBiodigitalViewModel
    });;
(function (MManual) {
    MManual.BiodigitalPlayerDefaultOptions = {
        hideTitle: true,
        shareUrlBase: '3dmodel/',
        analyticsType: "3dModels",
    };

    MManual.BiodigitalPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.BiodigitalPlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }
            self.resizeCallback = null;
            self.attachResizeCallback = function (callback) {
                self.resizeCallback = callback;
            }

            self.parentContext.expandTransitionEnd.subscribe(function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });

            self.topicsWithResource.subscribe(function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });

            $(window).on("resize", function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('biodigital-player',
    {
        template: { element: 'biodigital-player-template' },
        viewModel: MManual.BiodigitalPlayerViewModel
    });;
(function (MManual) {
    MManual.CaseStudyPlayerDefaultOptions = {
        hideTitle: true,
        displaySingleItem: true,
        shareUrlBase: 'case-study/',
        analyticsType: "CaseStudies",
        hideMainArrows: true,
    };
    MManual.CaseStudyPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.CaseStudyPlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            self.setIframePrintTarget = function (element) {
                self.parentContext.printTarget = element;
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('casestudy-player',
    {
        template: { element: 'casestudy-player-template' },
        viewModel: MManual.CaseStudyPlayerViewModel
    });;
(function (MManual) {
    MManual.EasterEggPlayerDefaultOptions = {
        loadLocations: false,
        displaySingleItem: true,
    };
    MManual.EasterEggPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            function setupEasterEggs() {
                setTimeout(function () {
                    renderQtips();
                    renderMapster();
                    var image = $(".imap:not(.mapster_el)")[0];
                    MManual.utils.imgLoaded(image, resizeMapster);
                }, 0);
            }
            if (typeof MManual.EasterEggPlayerScriptsInitialized === 'undefined') {
                MManual.utils.loadScripts(MManual.EasterEggPlayerScripts, setupEasterEggs);
                MManual.EasterEggPlayerScriptsInitialized = true;
            } else {
                setupEasterEggs();
            }
            var self = this;

            var mq = MManual.Helpers.mq;
            var mql = mq.minWidth(mq.MOBILE);
            var qtipTarget = 'mouse';
            function changeQtipTarget(mql) {
                if (!mql.matches) {
                    qtipTarget = $('.multimedia__easteregg');
                } else {
                    qtipTarget = 'mouse';
                }
            }

            mql.addListener(changeQtipTarget);
            changeQtipTarget(mql);

            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.EasterEggPlayerDefaultOptions, params.options);

            var throttleTimeout;

            function throttledResizeMapster() {
                if (!throttleTimeout) {
                    throttleTimeout = setTimeout(function () {
                        resizeMapster();
                        throttleTimeout = null;
                    }, 50);
                }
            };
            function resizeMapster() {
                var image = $(".imap:not(.mapster_el)");
                MManual.utils.imgLoaded(image[0], function () {
                    var wrapper = $(".multimedia__image--wrapper");
                    var wrapperHeight = wrapper.height();
                    var wrapperWidth = wrapper.width();
                    var dimensions = MManual.utils.getImageDimensions(image[0]);
                    var naturalHeight = dimensions.height;
                    var naturalWidth = dimensions.width;
                    var resultHeight;
                    var resultWidth;
                    if (wrapperWidth / wrapperHeight > naturalHeight / naturalWidth) {
                        resultHeight = wrapperHeight;
                        resultWidth = wrapperHeight / naturalHeight * naturalWidth;
                    } else {
                        resultHeight = wrapperWidth / naturalWidth * naturalHeight;
                        resultWidth = wrapperWidth;
                    }
                    image.mapster("resize", resultWidth, resultHeight);
                });
            }

            function renderMapster() {
                $(".imap:not(.mapster_el)").mapster({
                    fillColor: "333333",
                    fillOpacity: 0.50,
                    stroke: true,
                    strokeColor: "ffffff",
                    staticState: true,
                    render_highlight: {
                        stroke: true,
                        strokeColor: "053D5B",
                        fillOpacity: 0.5
                    }
                });
            }
            function renderQtips() {
                $("#easter-egg-map area").each(function (i) {
                    $(this).qtip({
                        content: {
                            text: $("#hotspot-content" + i).html(),
                            title: $(this).attr("alt"),
                            button: 'Close'
                        },
                        style: {
                            classes: 'qtip-custom',
                            widget: false,
                            def: false
                        },
                        position: {
                            my: 'center center',
                            at: 'center center',
                            target: qtipTarget,
                            container: $('.multimedia__easteregg'),
                            adjust: {
                                method: 'shift',
                                mouse: false,
                                scroll: false
                            }
                        },
                        show: {
                            solo: true,
                            delay: 250
                        },
                        hide: {
                            fixed: true,
                            delay: 100
                        },
                        events: {
                            visible: function (event, api) {
                                var qtip = $(event.target);
                                if (qtip.css("left").indexOf("-") > -1) {
                                    qtip.css("left", "0");
                                }
                                if (qtip.css("top").indexOf("-") > -1) {
                                    qtip.css("top", "0");
                                }
                                if (qtip.css("bottom").indexOf("-") > -1) {
                                    var bottom = parseFloat(qtip.css("bottom"));
                                    var top = parseFloat(qtip.css("top"));
                                    var topValue = top + bottom;
                                    qtip.css("top", topValue + "px");
                                }

                                var img = $(event.target).find(".qTip__img");
                                if ((img.width()) > $(event.target).width() * 0.75) {
                                    img.css("float", "none").css("margin", "auto").css("display", "block");
                                }
                            }
                        }
                    });
                });
                $("#easter-egg-map area").bind("click", function (event) { event.preventDefault(); });
            }
            $(window).on("resize", throttledResizeMapster);
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('easteregg-player',
    {
        template: { element: 'easteregg-player-template' },
        viewModel: MManual.EasterEggPlayerViewModel
    });;
(function (MManual) {
    MManual.ImagePlayerDefaultOptions = {
        defaultZoom: "fit",
        shareUrlBase: 'image/',
        analyticsType: "Images",
    };
    MManual.ImagePlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.ImagePlayerDefaultOptions, params.options);
            self.options = params.options;

            self.zoom = ko.observable(self.defaultZoom);
            self.toggleZoom = function () {
                switch (self.zoom()) {
                    case "width":
                        self.zoom("fit");
                        break;
                    //                    case "full":
                    //                        self.zoom("fit");
                    //                        break;
                    case "fit":
                        self.zoom("width");
                        break;
                    default:
                        self.zoom("fit");
                        break;
                }
            }
            self.pinchZoomActive = ko.observable(false);
            self.isZoomed = function (value) { self.parentContext.isZoomed(value); };
            self.imageDimensions = ko.observable({});
            self.zoomEnabled = ko.computed(function () {
                if ($.isEmptyObject(self.imageDimensions())) return false;
                if (self.pinchZoomActive()) return false;
                return (self.imageDimensions().naturalHeight > self.imageDimensions().parentHeight) &&
                    ((self.imageDimensions().naturalHeight / self.imageDimensions().naturalWidth) >
                        (self.imageDimensions().parentHeight / self.imageDimensions().parentWidth));
            });
            self.zoomClass = ko.computed(function () {
                if (self.pinchZoomActive()) return "multimedia__image--zoom" + "pinch";
                if (!self.zoomEnabled()) return "multimedia__image--zoom" + "fit";
                return "multimedia__image--zoom" + self.zoom();
            });

            self.parentContext.hideCarousel(self.hideCarousel);
            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }
            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            if (typeof self.IsRestricted !== 'undefined' && self.IsRestricted != null) {
                if (self.IsRestricted()) {
                    $('.modaldialog__icon--share.a2a_dd').hide();
                }
                else if (!self.IsRestricted()) {
                    $('.modaldialog__icon--share.a2a_dd').show();
                }
                //self.parentContext.enableShare(!self.IsRestricted());
            }
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('image-player',
    {
        template: { element: 'image-player-template' },
        viewModel: MManual.ImagePlayerViewModel
    });;
(function (MManual) {
    MManual.InlinemediaPhotoViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-photo',
    {
        template: { element: 'inlinemedia-photo-template' },
        viewModel: MManual.InlinemediaPhotoViewModel
    });;
(function (MManual) {
    MManual.InfographicPlayerDefaultOptions = {
        loadLocations: false,
        defaultZoom: "width",
        shareUrlBase: 'infographic/',
        analyticsType: "Infographics",
    };
    MManual.InfographicPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.InfographicPlayerDefaultOptions, params.options);

            self.zoom = ko.observable(self.defaultZoom);
            self.toggleZoom = function () {
                switch (self.zoom()) {
                    case "width":
                        self.zoom("fit");
                        break;
                    //                    case "full":
                    //                        self.zoom("fit");
                    //                        break;
                    case "fit":
                        self.zoom("width");
                        break;
                    default:
                        self.zoom("fit");
                        break;
                }
            }
            self.pinchZoomActive = ko.observable(false);
            self.isZoomed = function (value) { self.parentContext.isZoomed(value); };
            self.imageDimensions = ko.observable({});
            self.zoomEnabled = ko.computed(function () {
                if ($.isEmptyObject(self.imageDimensions())) return false;
                if (self.pinchZoomActive()) return false;
                return (self.imageDimensions().naturalHeight > self.imageDimensions().parentHeight) &&
                    ((self.imageDimensions().naturalHeight / self.imageDimensions().naturalWidth) >
                        (self.imageDimensions().parentHeight / self.imageDimensions().parentWidth));
            });
            self.zoomClass = ko.computed(function () {
                if (self.pinchZoomActive()) return "multimedia__image--zoom" + "width";
                if (!self.zoomEnabled()) return "multimedia__image--zoom" + "fit";
                return "multimedia__image--zoom" + self.zoom();
            });
            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0) ||
                    (self.CitationLink != null && self.CitationLink() != null && self.CitationLink().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title());
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('infographic-player',
    {
        template: { element: 'infographic-player-template' },
        viewModel: MManual.InfographicPlayerViewModel
    });;
(function (MManual) {
    MManual.InlinemediaLabTestViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-labtest',
    {
        template: { element: 'inlinemedia-labtest-template' },
        viewModel: MManual.InlinemediaLabTestViewModel
    });;
(function (MManual) {
    MManual.LabTestPlayerDefaultOptions = {
        hideTitle: true,
        // MSMER-25027 - Labtest item name is 'lab-tests' - Whatsapp share
        shareUrlBase: 'lab-tests/',
        analyticsType: "LabTest",
    };
    MManual.LabTestPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.LabTestPlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });
            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            self.setIframePrintTarget = function (element) {
                self.parentContext.printTarget = element;
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('labtest-player',
    {
        template: { element: 'labtest-player-template' },
        viewModel: MManual.LabTestPlayerViewModel
    });;
(function (MManual) {
    MManual.InlinemediaPodcastViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));
            self.isModal = ko.computed(function () {
                return self.Target() === "modal";
            });
            self.IframeSrcComputed = ko.computed(function () {
                return self.IsRelativePath() && self.IframeSrc() !== undefined && self.IframeSrc() !== null ? "/" + $("#currentLanguage").val() + self.IframeSrc() : self.IframeSrc();
            });
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-podcast',
    {
        template: { element: 'inlinemedia-featuredlink-template' },
        viewModel: MManual.InlinemediaPodcastViewModel
    });;
(function (MManual) {
    MManual.PodcastPlayerDefaultOptions = {
        hideTitle: false,
        hideCarousel: true,
        genericPopupTitle: true,
        loadLocations: false,
        displaySingleItem: true,
        shareUrlBase: 'podcast/',
        analyticsType: "Podcasts",
    };
    MManual.PodcastPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.PodcastPlayerDefaultOptions, params.options);

            self.IframeSrcComputed = ko.computed(function () {
                return self.IsRelativePath() && self.IframeSrc() !== undefined && self.IframeSrc() !== null ? "/" + $("#currentLanguage").val() + "/" + self.IframeSrc() : self.IframeSrc();
            });

            self.parentContext.popupTitle(self.genericPopupTitle ? self.MediaNameTranslated : self.Title);
            self.parentContext.hideCarousel(true);
            self.parentContext.displaySingle(self.displaySingleItem);

            self.parentContext.setSharePageUrl(self.IframeSrcComputed(), self.IsRelativePath(), self.Title());
            
            self.resizeCallback = null;
            self.attachResizeCallback = function (callback) {
                self.resizeCallback = callback;
            }

            self.parentContext.expandTransitionEnd.subscribe(function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });

            $(window).on("resize", function () {
                if (self.resizeCallback) {
                    self.resizeCallback();
                }
            });
            $('.modaldialog__icon--share.a2a_dd').show();
            //MManual.analytics.notifyOpenModal(self.analyticsType, self.Title());
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('podcast-player',
    {
        template: { element: 'featuredlink-player-template' },//ToDO Vasont refactoring using featured-player-template since podcast and featured are same
        viewModel: MManual.PodcastPlayerViewModel
    });;
(function (MManual) {
    MManual.QuizzPlayerDefaultOptions = {
        hideTitle: true,
        loadLocations: false,
        displaySingleItem: true,
        hideMainArrows: true,
        shareUrlBase: 'quiz/',
        analyticsType: "Quizzes",
    };
    MManual.QuizzPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.QuizzPlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title());
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('quiz-player',
    {
        template: { element: 'quiz-player-template' },
        viewModel: MManual.QuizzPlayerViewModel
    });;
(function () {
    function SearchPager(options) {
        var self = this;

        self.categoryName = ko.observable();
        self.pageSizeSettings = $.extend({}, options, {
            default: 10
        });

        self.page = ko.observable();
        self.totalResults = ko.observable();
        self.pageSize = ko.pureComputed(function () {
            if (self.pageSizeSettings.hasOwnProperty(self.categoryName())) {
                return self.pageSizeSettings[self.categoryName()];
            }
            return self.pageSizeSettings["default"];
        });
        self.pageCount = ko.pureComputed(function () {
            return Math.ceil(self.totalResults() / self.pageSize());
        });
        self.previousPagesCount = ko.observable(1);
        self.nextPagesCount = ko.observable(1);

        self.displayedPageRanges = ko.computed(function () {
            var results = [];
            var subrange = [];
            if (self.page() - self.previousPagesCount() <= 2) {
                for (var i = 1; i <= self.page(); i++) {
                    subrange.push(i);
                }
            } else {
                subrange.push(1);
                results.push(subrange);
                subrange = [];
                for (var i = self.page() - self.previousPagesCount(); i <= self.page(); i++) {
                    subrange.push(i);
                }
            }
            if (self.page() + self.nextPagesCount() >= self.pageCount() - 1) {
                for (var i = self.page() + 1; i <= self.pageCount(); i++) {
                    subrange.push(i);
                }
            } else {
                for (var i = self.page() + 1; i <= self.page() + self.nextPagesCount(); i++) {
                    subrange.push(i);
                }
                results.push(subrange);
                subrange = [];
                subrange.push(self.pageCount());
            }
            results.push(subrange);
            return results;
        });

        self.skip = ko.pureComputed(function () {
            return (self.page() - 1) * self.pageSize();
        });
        self.take = ko.pureComputed(function () {
            return self.pageSize();
        });
    }

    MManual.search = MManual.search || {};
    MManual.search.SearchPager = SearchPager;
})(MManual);
(function (MManual) {
    MManual.RelatedSearchUrlBase = '';
    MManual.RelatedSearchModel = function (query, title, species) {
        var self = this;

        self.query = query;
        self.title = title;
        self.species = species;
        self.href = ko.computed(function () {
            if (self.species != null || self.species != undefined) {
                return new URI(MManual.RelatedSearchUrlBase).addSearch('query', self.query)
                    .addSearch('species', self.species).toString();
            }
            return MManual.RelatedSearchUrlBase + '?query=' + self.query;
        }, self);
        return self;
    }
    MManual.RelatedSearchesViewModel = function (query, searchAddress, species) {
        var self = this;

        self.searchAdress = searchAddress;
        self.query = ko.observable(query);
        self.species = species;

        self.relatedSearchesLeft = ko.observableArray([]);

        self.relatedSearchesRight = ko.observableArray([]);

        self.relatedSearchesExist = ko.computed(function () {
            if (self.relatedSearchesLeft().length > 0 || self.relatedSearchesRight().length > 0) {
                return true;
            }
            return false;
        });

        self.init = function () {
            $.getJSON(self.searchAdress,
                {
                    query: self.query()
                },
                function (data, status, xhr) {
                    var maxIndex = data.length >= 7 ? 7 : data.length;

                    for (var i = 1; i < maxIndex; i++) {
                        var rsm = new MManual.RelatedSearchModel(data[i], data[i], self.species);
                        if (i % 2 === 0) {
                            self.relatedSearchesLeft.push(rsm);
                        } else {
                            self.relatedSearchesRight.push(rsm);
                        }
                    }
                });
        }

        return self;
    }
}(window.MManual = window.MManual || {}));;
(function (MManual) {
    function isSelected(section) {
        return section.isCheckedObservable();
    }

    function isVisible(section) {
        return section.isVisible();
    }

    function toVasontId(section) {
        return section.vasontId;
    }

    function SectionFilterViewModel(section) {
        this.section = section;

        this.vasontId = section.vasontId;
        this.isCheckedObservable = ko.observable(true);
        this.isVisible = ko.observable(true);
        this.aggregateCountObs = ko.observable(section.aggregateCount);

        this.label = ko.computed(function () {
            return this.section.title + "&nbsp;(" + this.aggregateCountObs() + ")";
        }, this);
    }

    SectionFilterViewModel.prototype.update = function (section) {
        this.isVisible(true);
        this.aggregateCountObs(section.aggregateCount);
    }

    function SectionFilters() {
        var self = this;

        self.availableSections = ko.observableArray([]);

        self._areAllSectionSelected = function () {
            return self._getVisible().every(isSelected);
        }

        self._changeStateOfAllTo = function (state) {
            // by default select all
            if (state === undefined) {
                state = true;
            }
            var sections = self._getVisible();
            sections.forEach(function (section) {
                section.isCheckedObservable(state);
            });
        }
        self._getVisible = function () {
            return self.availableSections().filter(isVisible);
        }

        // Using writable computed observable
        // https://knockoutjs.com/documentation/computed-writable.html
        self.allSectionsSelected = ko.computed({
            read: function () {
                return self._areAllSectionSelected();
            },
            write: function (value) {
                self._changeStateOfAllTo(value);
            }
        }).extend({ rateLimit: 1 });

        self.allSectionsSelectedEnabled = ko.computed(function () {
            return self._getVisible().length > 0;
        });

        self.columns = ko.observable(4);

        self.reset = function () {
            // nothing
        }

        self._getById = function (sectionId) {
            return self.availableSections()
                .filter(function (section) {
                    return section.vasontId === sectionId;
                })[0];
        }

        self._prepareSection = function (section) {
            var model = self._getById(section.vasontId);
            if (model) {
                model.update(section);
            } else {
                model = new SectionFilterViewModel(section);
                self.availableSections.push(model);
            }
        }

        self.prepareSections = function (sections) {
            self.availableSections().forEach(function (section) {
                section.isVisible(false);
            });

            sections.forEach(self._prepareSection);
        }

        self.getSelectedSections = function () {
            if (self.availableSections().every(isSelected)) {
                return [];
            }

            return self._getSelected().map(toVasontId);
        }

        self._getSelected = function () {
            return self.availableSections().filter(isSelected);
        }

        self._getSelectedAndVisible = function () {
            var selected = self.availableSections()
                .filter(isSelected)
                .filter(isVisible);
            return selected;
        }

        self.disableFilter = function () {
            return self._getSelectedAndVisible().length === 0;
        }

        self.applyFilter = null;
        self.apply = function () {
            if (self.sectionFilters.isAnySelected()) {
                self.applyFilter();
            }
        }

        self.sectionColumns = ko.computed(function () {
            return MManual.Helpers.array.toMatrix(
                self._getVisible(),
                self.columns());
        });
    }

    MManual.search = MManual.search || {};
    MManual.search.SectionFilters = SectionFilters;
})(MManual);
(function (MManual) {
    function TypeFilters(parent, element) {
        var self = this;
        self.parent = parent;

        self.availableTypes = ko.observableArray([]);
        self.visibleTypes = ko.computed(function () {
            return self.availableTypes().filter(function (el) { return el.visible() });
        });

        self.moreTypes = ko.computed(function () {
            return self.availableTypes().filter(function (el) { return !el.visible() });
        });

        self.moreTypesOpen = ko.observable(false);

        self.reset = function () {
            self.availableTypes([]);
        }

        self._unselectAll = function () {
            self.availableTypes().forEach(
                function (type) {
                    type.isCheckedObservable(false);
                });
        }

        self.prepareTypes = function (types) {
            var typesPrepared = [];
            self.completeCount = 0;
            for (var j = 0; j < types.length; j++) {
                var type = types[j];
                type.isCheckedObservable = ko.observable(type.isChecked);
                if (type.isChecked) {
                    var typeKey = type.key;
                    var oevm = MManual.searchController.otherEditionViewModel;
                    if (oevm !== undefined && oevm != null) {
                        if (typeKey === "images" || typeKey === "videos") {
                            oevm.isVisible(false);
                        } else {
                            oevm.isVisible(true);
                        }
                    }
                }

                type.totalhitDisplayString = (function () {
                    if (type.totalhit < 0) return "";
                    return " (" + type.totalhit + ")";
                })();
                typesPrepared.push(type);
                type.setTypeFilter = function (event) {
                    if (this.totalhit > 0) {
                        self._unselectAll();

                        this.isCheckedObservable(true);
                        self.moreTypesOpen(false);
                        parent.applyFilters();
                    }
                }
                type.firstRender = ko.observable(true);
                type.visible = ko.observable(true);
            }

            // replace self.availableTypes before calling self.selectAllTypes()
            self.availableTypes(typesPrepared);
        }
        self.moreExpandFn = function (data, event) {
            if (event.type == "keypress") {
                var keyCode = (event.which ? event.which : event.keyCode);
                if (keyCode === 13) {
                    self.moreTypesOpen(!self.moreTypesOpen());
                    if (self.moreTypesOpen() == true) {
                        $(event.target).attr('aria-expanded', "true");
                    }
                    else {
                        $(event.target).attr('aria-expanded', "false");
                    }
                }
            }
            else {
                self.moreTypesOpen(!self.moreTypesOpen());
                if (self.moreTypesOpen() == true) {
                    $(event.target).attr('aria-expanded', "true");
                }
                else {
                    $(event.target).attr('aria-expanded', "false");
                }
            }
            
        }

        self.getSelectedTypes = function () {
            var selected = self._getSelected();
            if (selected.length > 0) {
                return selected.map(
                    function (type) {
                        return type.key;
                    });
            }

            return ["all"];
        }

        self._getSelected = function () {
            if (self.availableTypes().length < 1)
                return [];

            var selected = self.availableTypes().filter(
                function (type) {
                    return type.isCheckedObservable();
                });
            return selected;
        }

        self.fullWidth = ko.observable(1280);
        self.morePopupWidth = ko.observable(200);
        self.moreTypesOpen.subscribe(function () {
            setTimeout(function () {
                if (self.moreTypesOpen()) {
                    var morePopup = $('.search__list');
                    self.morePopupWidth(morePopup.outerWidth());
                }
            }, 0);
        });
        self.moreListPosition = ko.computed(function () {
            if (self.moreTypesOpen() && self.moreTypes().length > 0) {
                var moreButton = $('.search__more');
                setTimeout(function () {
                    var morePopup = $('.search__list');
                    self.morePopupWidth(morePopup.outerWidth());
                }, 0);
                return (self.fullWidth() - (moreButton.position().left + moreButton.outerWidth() / 2) - self.morePopupWidth() / 2);
            } else {
                return 0;
            }
        });

        self.refineResultsButtonWidth = function () {
            var refineResultsWidth = $('.search__refine').outerWidth(true);
            // ensure default spacing
            if (isNaN(refineResultsWidth) || refineResultsWidth === undefined || refineResultsWidth === 0) {
                refineResultsWidth = 270;
            }
            return refineResultsWidth;
        }

        self.updateVisibleFilters = function () {
            var maxIndex = 0;
            self.fullWidth(self.typesListElement.outerWidth());

            var moreButtonWidth = $(".search__type.search__more").outerWidth();
            //TODO don't hardcode the width of 450px for filters and the "more" button
            var remainingWidth = self.fullWidth() - self.refineResultsButtonWidth() - moreButtonWidth;

            var checkedCount = 0;
            var i = 0;

            var selected = self._getSelected();

            selected.forEach(
                function (type) {
                    type.visible(true);
                    remainingWidth -= type.typeWidth;
                    checkedCount++;
                });

            for (i = 0; i < self.availableTypes().length; i++) {
                if (self.fullWidth() < 720) {
                    self.availableTypes()[i].visible(true);
                }
                else if (remainingWidth >= self.availableTypes()[i].typeWidth) {
                    if (self.availableTypes()[i].isCheckedObservable()) {
                        checkedCount--;
                        continue;
                    }

                    remainingWidth -= self.availableTypes()[i].typeWidth;

                    self.availableTypes()[i].visible(true);
                } else {
                    break;
                }
            }
            for (; i < self.availableTypes().length; i++) {
                if (!self.availableTypes()[i].isCheckedObservable()) {
                    self.availableTypes()[i].visible(false);
                }
            }
        };
    }

    MManual.search = MManual.search || {};
    MManual.search.TypeFilters = TypeFilters;
})(MManual);
(function (MManual) {
    function SearchResultsViewModel(showSplashScreen, data, pageSize, lazyLoadItems, searchServiceUrl) {
        var self = this;

        var fullWidthTypes = ["images", "videos"];

        self.loading = ko.observable(true);
        self.error = ko.observable(false);
        self.redirecting = ko.observable(false);

        self.query = ko.observable('');
        self.isFirstTimeSearch = true;
        self.shouldResetResults = true;

        self.query_showPronDef = ko.observable(false);
        self.query_pron = ko.observable('');
        self.query_url = ko.observable('');
        self.query_def = ko.observable('');

        self.sectionFilters = new MManual.search.SectionFilters();
        self.typeFilters = new MManual.search.TypeFilters(self);
        self.searchPager = new MManual.search.SearchPager({
            images: 36,
            videos: 36,
            default: pageSize || 10
        });

        self.results = ko.observableArray([]);
        self.totalResults = ko.observable(-1);
        self.totalResultsDisplayString = ko.pureComputed(function () {
            if (self.totalResults() <= 0) return "";
            return " (" + self.totalResults() + ")";
        });
        self.searchPager.totalResults(self.totalResults());

        self.searchPager.page(data.page == null ? 1 : data.page);
        if (window.history.replaceState != undefined || window.history.replaceState != null) {
            window.history.replaceState({ 'page': self.searchPager.page() }, "");
        }

        if (typeof data.oldQuery != 'undefined') {
            self.oldQuery = data.oldQuery;
            self.queryLink = MManual.utils.updateURLParameter(data.queryLink, "query", self.oldQuery);
            self.queryLink = MManual.utils.updateURLParameter(self.queryLink, "force", "true");
        }

        self.fullWidthResults = ko.observable(false);

        var resetModel = function () {
            self.typeFilters.reset();
            self.sectionFilters.reset();
            self.results([]);
            self.totalResults(-1);
            self.searchPager.totalResults(-1);
            self.redirecting(false);
        };

        var handleSearchResults = function (resultData) {
            if (self === MManual.searchController.mainSearchViewModel) {
                MManual.Feature.MultimediaPopup.ViewModel.clearListByPrefix("Search");
            }

            self.query(resultData.query);
            self.typeFilters.prepareTypes(resultData.filters || []);
            self.sectionFilters.prepareSections(resultData.availableSections || []);

            self.results(resultData.results);
            self.totalResults(resultData.totalSearchResults || 0);
            self.searchPager.totalResults(resultData.totalSearchResults || 0);
            $(window).scrollTop(0);

            var elements = document.querySelectorAll("[data-search-popup-model]");
            elements.forEach(function (elem) {
                var viewModel = MManual.Feature.MultimediaPopup.Common.GetModel(elem, "search-popup");

                var options = viewModel.options;
                // TODO Below section should be removed after full Vasont reimport ( 2021-02-08 )
                viewModel.showTooltip = options.ShowTooltip || false;
                viewModel.cssClass = options.CssClass || "";
                viewModel.listName = options.ListName || "other";
                viewModel.displaySingleItem = options.SingleItem || false;

                elem.onclick = function () {
                    MManual.Feature.MultimediaPopup.ViewModel.showPopup(viewModel);
                };
            });
        };

        self.applyFilters = function () {
            self.shouldResetResults = true;
            self.searchPager.page(1);
            self.queryLink = MManual.utils.updateURLParameter(data.queryLink, "page", self.searchPager.page());
            if (window.history.pushState != undefined || window.history.pushState != null) {
                window.history.pushState({ 'page': self.searchPager.page() }, "", self.queryLink);
            }
            self.load();
        }

        self.sectionFilters.applyFilter = self.applyFilters;

        self.loadPage = function (page) {
            self.searchPager.page(page);
            self.queryLink = MManual.utils.updateURLParameter(data.queryLink, "page", self.searchPager.page());
            if (window.history.pushState != undefined || window.history.pushState != null) {
                window.history.pushState({ 'page': page }, "", self.queryLink);
            }
            self.load();
        }

        self._includeSectionsFilter = function () {
        }

        self.lastSelectedSections = [];
        self.lastSelectedType = "";

        self.load = function () {
            self.redirecting(false);
            self.loading(true);

            data = data || {};
            data.isFirstTimeSearch = self.isFirstTimeSearch;
            data.selectedFilters = self.typeFilters.getSelectedTypes();

            var selectedSections = self.sectionFilters.getSelectedSections();

            var isAnySectionSelected = selectedSections.length > 0;
            if (isAnySectionSelected) {
                data.selectedSections = selectedSections;
            } else {
                data.selectedSections = [];
            }

            self.lastSelectedSections = selectedSections;
            self.lastSelectedType = data.selectedFilters;

            self.searchPager.categoryName(self.typeFilters.getSelectedTypes());

            data.skipItems = self.searchPager.skip();
            data.itemsToLoad = self.searchPager.take();
            // Add referer to make ajax see difference between home and pro editions (may be useful when cache is enabled)
            data.referrer = window.location.href;

            var deferred = $.ajax({
                showSplashScreen: showSplashScreen,
                type: 'GET',
                dataType: 'json',
                url: searchServiceUrl,
                data: data,
                traditional: true,
                cache: false
            }).done(function (resultData) {
                self.isFirstTimeSearch = false;
                self.redirecting(false);

                if (!resultData) {
                    self.error(true);
                }
                else if (resultData.redirectUrl) {
                    self.redirecting(true);
                    window.location.href = resultData.redirectUrl;
                    return;
                }
                if (self.shouldResetResults) {
                    resetModel();
                    self.shouldResetResults = false;
                }

				var retrived_param = sessionStorage.getItem('vet_param');
				if(retrived_param != null && retrived_param.length){
					for (var i = 0; i < resultData.results.length; i++) {
					
						var newPar = JSON.parse(retrived_param).join(' ');
						var decodedItem = decodeURIComponentSafe(resultData.results[i].html);
						var newitem = $('<div />',{html:decodedItem});
						newitem.find('a[href]').each(function(){
							var ele = $(this);
							var url = new window.URL(ele.prop('href'));
							url.searchParams.set('species', newPar);
							url.toString().substring(url.origin.length);
							ele.prop('href', url);
						});
						resultData.results[i].html = newitem.html();
					}
                }
				
				handleSearchResults(resultData);
				
                var selectedTypes = self.typeFilters.getSelectedTypes();
                var fullWidthTypeFound = false;
                for (var i = 0; i < fullWidthTypes.length; i++) {                   
                    if (selectedTypes.indexOf(fullWidthTypes[i]) > -1) {
                        fullWidthTypeFound = true;
                        break;
                    }
                }
                self.fullWidthResults(fullWidthTypeFound);
                $('.search__main--half .search__result').each(function () {
                    if (!($(this).children('div.search__images--cell').length)) {
                        $(this).css('clear', 'both');
                    }
                });
                self.error(false);
                self.hideRefine();
            }).fail(function (jqxhr, textStatus) {
                self.error(true);
            }).always(function () {
                MManual.Foundation.Presentation.EventBus.emitEvent("searchpage.search.complete");
                self.loading(false);
            });

            return deferred;
        };

        self.showLexicompMonograph = function (item, event) {
            ShowLexicompMonograph($(event.target));
        };

        window.addEventListener('popstate', function (event) {
            if (event.state.page) {
                self.searchPager.page(event.state.page);
                self.load();
            }
        });

        self.newClass = ko.observable(false);
        var refineResultsButton = $('.search__type.search__refine .search__type--name');
        self.changeClass = function () {
            self.newClass(!self.newClass());
            if (self.newClass()) {
                refineResultsButton.attr('aria-expanded', true);
            } else {
                refineResultsButton.attr('aria-expanded', false);
            }
        }
        self.hideRefine = function () {
            self.newClass(false);
            refineResultsButton.attr('aria-expanded', false);
        }

        self.isVisible = ko.observable(true);
    }

    MManual.search = MManual.search || {};
    MManual.search.SearchResultsViewModel = SearchResultsViewModel;
    // For compatibility with older
    MManual.SearchResultsViewModel = SearchResultsViewModel;
})(MManual);
function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function validateAndSubmitSearchQuery(self) {
    return validateAndSubmitSearchQueryImpl($(self).find('[name="query"]')[0]);
}

function validateAndSubmitSearchQueryImpl(queryInput) {
    var queryValue = queryInput.value;
    if (queryValue == null || queryValue.length === 0 || !queryValue.trim()) {
        return false;
    }

    var encodedQuery = htmlEncode(queryValue);
    $(queryInput).val(encodedQuery);
    return true;
}

$(function () {
    var searchbarButtonPopout = $(".searchbar__button--popout");
    var headerFixed = $(".l-group--header-letterpine-fixed");
    searchbarButtonPopout.on("click", function (event) {
        var mainHeader = $(this).parents('.main-header');
        //headerFixed.removeClass("l-layer--folded");
        $(".l-layer--letterspine").addClass("l-layer--letterspine--hidden");
        $(this).prev('.searchBar-container').addClass('active');
        $(this).prev('.searchBar-container').find('.searchbar__input').focus();
        var breadcrumSticky = $('.l-layer--breadcrumb.sticky');
        var headerHeight = $('#l-group--header-letterpine').outerHeight();
        var fixedHeaderHeight = $('.l-layer--header').outerHeight();
        var searchBarHeight = 55;
        if (mainHeader.prop('id') == 'l-group--header-letterpine') {
            breadcrumSticky.css("top", headerHeight + searchBarHeight);
        } else {
            breadcrumSticky.css("top", fixedHeaderHeight + searchBarHeight);
        }
        event.preventDefault();
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() <= 0) {
            $('.searchBar-container').removeClass('active').find('.searchbar__input').blur();
        }
    });
    $('input.searchbar__input').on('keyup paste', function () {
        $('input.searchbar__input').not(this).val($(this).val());
    });
});

(function (MManual) {
    function SearchResultsController() {
        var self = this;

        var immediateItemsDeferred = $.Deferred();
        var immediateItemsReady = 0;

        var immediateItems = [];
        var nextOrderItems = [];

        self.mainSearchViewModel = null;
        self.otherEditionViewModel = null;
        self.register = function (viewModel, loadImmediately) {
            if (loadImmediately) {
                immediateItems.push(viewModel);
            } else {
                nextOrderItems.push(viewModel);
            }
        };

        immediateItemsDeferred.always(function () {
            for (var i = 0; i < nextOrderItems.length; i++) {
                nextOrderItems[i].load();
            }
        });

        $(document).ready(function () {
            if (immediateItems.length === 0) {
                immediateItemsDeferred.resolve();
            }

            for (var i = 0; i < immediateItems.length; i++) {
                immediateItems[i].load().always(function () {
                    if (++immediateItemsReady === immediateItems.length) {
                        immediateItemsDeferred.resolve();
                    }
                });
            }
        });
    };

    MManual.searchController = new SearchResultsController();
})(window.MManual = window.MManual || {});

(function ($) {
    $(document).ready(function () {
        var searchbars = $('.searchbar');
        searchbars.each(function () {
            var searchAdress = $(this).attr("searchadress");

            function requestData(request, response) {
                return jQuery.get(searchAdress, {
                    query: request.term
                }, function (data) {
                    var json = jQuery.parseJSON(data);
                    response(json);

                    MManual.Foundation.Presentation.EventBus.emitEvent("search.autocomplete.done");
                });
            }

            $(this).find('.searchbar__input').mmAutocomplete({
                appendTo: $(this).find('.searchbar__inputwrapper'),
                source: requestData,
                minLength: 3,
                select: function (event, ui) {
                    if (ui.item) {
                        $(event.target).val(ui.item.value);
                    }
                    $(event.target.form).submit();
                }
            });
        });

        var mq = MManual.Helpers.mq;
        var mql = mq.minWidth(mq.SMALLTABLET);

        var textMobile = $('.searchbar__input').data("placeholder-mobile");
        var textDesktop = $('.searchbar__input').data("placeholder-desktop");

        function adjustHint() {
            if (!mql.matches) {
                $('.searchbar__input').attr("placeholder", textMobile);
            }
            else {
                $('.searchbar__input').attr("placeholder", textDesktop);
            }
        }

        adjustHint();
        mql.addListener(adjustHint);
    });
})(jQuery);;
(function (MManual) {
    MManual.CalculatorPlayerDefaultOptions = {
        hideTitle: true,
        shareUrlBase: 'clinical-calculator/',
        analyticsType: "ClinicalCalculators",
    };
    MManual.CalculatorPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.CalculatorPlayerDefaultOptions, params.options);
            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : self.IframeSrc();
            });

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits     != null && self.Credits()     != null && self.Credits().length     > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();

            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            self.setIframePrintTarget = function(element) {
                self.parentContext.printTarget = element;
            }
            if (self.UniqueId) {
                MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            }
            else {
                MManual.analytics.notifyOpenModal(self.analyticsType, self.Title());
            }
            $('.modaldialog__icon--share.a2a_dd').show();
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('clinicalcalculator-player',
    {
        template: { element: 'clinicalcalculator-player-template' },
        viewModel: MManual.CalculatorPlayerViewModel
    });
;
(function (MManual) {
    MManual.InlinemediaCalculatorViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-calculator',
    {
        template: { element: 'inlinemedia-calculator-template' },
        viewModel: MManual.InlinemediaCalculatorViewModel
    });
;
(function (MManual) {
    MManual.InlinemediaVideoViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;

            ko.utils.extend(self, new MManual.InlinemediaBaseViewModel.createViewModel(params, componentInfo));

            self.IframeSrc = ko.computed(function () {
                return 'https://players.brightcove.net/3850378299001/' + self.PlayerId() + '/index.html?videoId=' + self.VideoId();
            });
            self.Credits(decodeURIComponent(self.Credits()));
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('inlinemedia-video',
    {
        template: { element: 'inlinemedia-video-template' },
        viewModel: MManual.InlinemediaVideoViewModel
    });;
(function (MManual) {
    MManual.VideoPlayerDefaultOptions = {
        hideTitle: false,
        loadImageUrlWithAjax: false,
        shareUrlBase: 'video/',
        analyticsType: "Videos",
    };
    MManual.VideoPlayerViewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            self.parentContext = ko.contextFor(componentInfo.element).$data;

            $.extend(self, params.item);
            $.extend(self, MManual.VideoPlayerDefaultOptions, params.options);

            if (self.loadImageUrlWithAjax) {
                $.ajax({
                    url: '/Custom/Topic/GetBrightcoveVideosThumbnails',
                    type: 'POST',
                    data: { videoId: self.VideoId },
                    async: true,
                    success: function (data) {
                        self.ImageUrl(data);
                    }
                });
            }

            self.IframeSrcComputed = ko.computed(function () {
                return self.parentContext.clearIframeSrc() ? '' : '//players.brightcove.net/3850378299001/' + self.PlayerId() + '/index.html?videoId=' + self.VideoId();
            });

            self.Credits(decodeURIComponent(self.Credits()));

            self.topicsWithResource = ko.observableArray([]);
            self.topicsWithResourceLoading = ko.observable();
            function updateDetailsAvailability() {
                self.parentContext.detailsAvailable(self.topicsWithResource().length > 0 ||
                    (self.Description != null && self.Description() != null && self.Description().length > 0) ||
                    (self.Credits != null && self.Credits() != null && self.Credits().length > 0));
            }
            self.topicsWithResource.subscribe(updateDetailsAvailability);
            updateDetailsAvailability();
            if (self.ShareUrlTitle != null && self.ShareUrlTitle() != null && self.ShareUrlTitle().length > 0) {
                self.parentContext.setShareUrlWithTitle(self.shareUrlBase, self.ShareUrlTitle(), self.Title());
            } else if (self.UniqueId) {
                self.parentContext.setShareUrl(self.shareUrlBase, self.UniqueId(), self.Title());
            }

            self.loadLocations = MManual.settings.loadLocationsGlobal || self.loadLocations;

            if (self.loadLocations) {
                MManual.getTopicsForResource(self.ItemId, self.topicsWithResource, self.topicsWithResourceLoading);
            }

            MManual.analytics.notifyOpenModal(self.analyticsType, self.Title(), self.UniqueId());
            if (typeof self.IsRestricted !== 'undefined' && self.IsRestricted != null) {
                //self.parentContext.enableShare(!self.IsRestricted());
                if (self.IsRestricted()) {
                    self.parentContext.enableShare = false;
                    $('.modaldialog__icon--share.a2a_dd').hide();
                }
                else if (!self.IsRestricted()) {
                    self.parentContext.enableShare = true;
                    $('.modaldialog__icon--share.a2a_dd').show();
                }
            }
            return self;
        }
    };
}(window.MManual = window.MManual || {}));

ko.components.register('video-player',
    {
        template: { element: 'video-player-template' },
        viewModel: MManual.VideoPlayerViewModel
    });;
