/*! version: "0.0.5" */
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(); else if (typeof define === "function" && define.amd) define([], factory); else {
        var a = factory();
        for (var i in a) (typeof exports === "object" ? exports : root)[i] = a[i];
    }
})(this, function() {
    return function(modules) {
        var parentHotUpdateCallback = this["webpackHotUpdate"];
        this["webpackHotUpdate"] = function webpackHotUpdateCallback(chunkId, moreModules) {
            hotAddUpdateChunk(chunkId, moreModules);
            if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
        };
        function hotDownloadUpdateChunk(chunkId) {
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
            head.appendChild(script);
        }
        function hotDownloadManifest(callback) {
            if (typeof XMLHttpRequest === "undefined") return callback(new Error("No browser support"));
            try {
                var request = new XMLHttpRequest();
                var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
                request.open("GET", requestPath, true);
                request.timeout = 1e4;
                request.send(null);
            } catch (err) {
                return callback(err);
            }
            request.onreadystatechange = function() {
                if (request.readyState !== 4) return;
                if (request.status === 0) {
                    callback(new Error("Manifest request to " + requestPath + " timed out."));
                } else if (request.status === 404) {
                    callback();
                } else if (request.status !== 200 && request.status !== 304) {
                    callback(new Error("Manifest request to " + requestPath + " failed."));
                } else {
                    try {
                        var update = JSON.parse(request.responseText);
                    } catch (e) {
                        callback(e);
                        return;
                    }
                    callback(null, update);
                }
            };
        }
        var canDefineProperty = false;
        try {
            Object.defineProperty({}, "x", {
                get: function() {}
            });
            canDefineProperty = true;
        } catch (x) {}
        var hotApplyOnUpdate = true;
        var hotCurrentHash = "0d0521551e07c2a73498";
        var hotCurrentModuleData = {};
        var hotCurrentParents = [];
        function hotCreateRequire(moduleId) {
            var me = installedModules[moduleId];
            if (!me) return __webpack_require__;
            var fn = function(request) {
                if (me.hot.active) {
                    if (installedModules[request]) {
                        if (installedModules[request].parents.indexOf(moduleId) < 0) installedModules[request].parents.push(moduleId);
                        if (me.children.indexOf(request) < 0) me.children.push(request);
                    } else hotCurrentParents = [ moduleId ];
                } else {
                    console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
                    hotCurrentParents = [];
                }
                return __webpack_require__(request);
            };
            for (var name in __webpack_require__) {
                if (Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
                    if (canDefineProperty) {
                        Object.defineProperty(fn, name, function(name) {
                            return {
                                configurable: true,
                                enumerable: true,
                                get: function() {
                                    return __webpack_require__[name];
                                },
                                set: function(value) {
                                    __webpack_require__[name] = value;
                                }
                            };
                        }(name));
                    } else {
                        fn[name] = __webpack_require__[name];
                    }
                }
            }
            function ensure(chunkId, callback) {
                if (hotStatus === "ready") hotSetStatus("prepare");
                hotChunksLoading++;
                __webpack_require__.e(chunkId, function() {
                    try {
                        callback.call(null, fn);
                    } finally {
                        finishChunkLoading();
                    }
                    function finishChunkLoading() {
                        hotChunksLoading--;
                        if (hotStatus === "prepare") {
                            if (!hotWaitingFilesMap[chunkId]) {
                                hotEnsureUpdateChunk(chunkId);
                            }
                            if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
                                hotUpdateDownloaded();
                            }
                        }
                    }
                });
            }
            if (canDefineProperty) {
                Object.defineProperty(fn, "e", {
                    enumerable: true,
                    value: ensure
                });
            } else {
                fn.e = ensure;
            }
            return fn;
        }
        function hotCreateModule(moduleId) {
            var hot = {
                _acceptedDependencies: {},
                _declinedDependencies: {},
                _selfAccepted: false,
                _selfDeclined: false,
                _disposeHandlers: [],
                active: true,
                accept: function(dep, callback) {
                    if (typeof dep === "undefined") hot._selfAccepted = true; else if (typeof dep === "function") hot._selfAccepted = dep; else if (typeof dep === "object") for (var i = 0; i < dep.length; i++) hot._acceptedDependencies[dep[i]] = callback; else hot._acceptedDependencies[dep] = callback;
                },
                decline: function(dep) {
                    if (typeof dep === "undefined") hot._selfDeclined = true; else if (typeof dep === "number") hot._declinedDependencies[dep] = true; else for (var i = 0; i < dep.length; i++) hot._declinedDependencies[dep[i]] = true;
                },
                dispose: function(callback) {
                    hot._disposeHandlers.push(callback);
                },
                addDisposeHandler: function(callback) {
                    hot._disposeHandlers.push(callback);
                },
                removeDisposeHandler: function(callback) {
                    var idx = hot._disposeHandlers.indexOf(callback);
                    if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
                },
                check: hotCheck,
                apply: hotApply,
                status: function(l) {
                    if (!l) return hotStatus;
                    hotStatusHandlers.push(l);
                },
                addStatusHandler: function(l) {
                    hotStatusHandlers.push(l);
                },
                removeStatusHandler: function(l) {
                    var idx = hotStatusHandlers.indexOf(l);
                    if (idx >= 0) hotStatusHandlers.splice(idx, 1);
                },
                data: hotCurrentModuleData[moduleId]
            };
            return hot;
        }
        var hotStatusHandlers = [];
        var hotStatus = "idle";
        function hotSetStatus(newStatus) {
            hotStatus = newStatus;
            for (var i = 0; i < hotStatusHandlers.length; i++) hotStatusHandlers[i].call(null, newStatus);
        }
        var hotWaitingFiles = 0;
        var hotChunksLoading = 0;
        var hotWaitingFilesMap = {};
        var hotRequestedFilesMap = {};
        var hotAvailibleFilesMap = {};
        var hotCallback;
        var hotUpdate, hotUpdateNewHash;
        function toModuleId(id) {
            var isNumber = +id + "" === id;
            return isNumber ? +id : id;
        }
        function hotCheck(apply, callback) {
            if (hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
            if (typeof apply === "function") {
                hotApplyOnUpdate = false;
                callback = apply;
            } else {
                hotApplyOnUpdate = apply;
                callback = callback || function(err) {
                    if (err) throw err;
                };
            }
            hotSetStatus("check");
            hotDownloadManifest(function(err, update) {
                if (err) return callback(err);
                if (!update) {
                    hotSetStatus("idle");
                    callback(null, null);
                    return;
                }
                hotRequestedFilesMap = {};
                hotAvailibleFilesMap = {};
                hotWaitingFilesMap = {};
                for (var i = 0; i < update.c.length; i++) hotAvailibleFilesMap[update.c[i]] = true;
                hotUpdateNewHash = update.h;
                hotSetStatus("prepare");
                hotCallback = callback;
                hotUpdate = {};
                var chunkId = 0;
                {
                    hotEnsureUpdateChunk(chunkId);
                }
                if (hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
                    hotUpdateDownloaded();
                }
            });
        }
        function hotAddUpdateChunk(chunkId, moreModules) {
            if (!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId]) return;
            hotRequestedFilesMap[chunkId] = false;
            for (var moduleId in moreModules) {
                if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                    hotUpdate[moduleId] = moreModules[moduleId];
                }
            }
            if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
                hotUpdateDownloaded();
            }
        }
        function hotEnsureUpdateChunk(chunkId) {
            if (!hotAvailibleFilesMap[chunkId]) {
                hotWaitingFilesMap[chunkId] = true;
            } else {
                hotRequestedFilesMap[chunkId] = true;
                hotWaitingFiles++;
                hotDownloadUpdateChunk(chunkId);
            }
        }
        function hotUpdateDownloaded() {
            hotSetStatus("ready");
            var callback = hotCallback;
            hotCallback = null;
            if (!callback) return;
            if (hotApplyOnUpdate) {
                hotApply(hotApplyOnUpdate, callback);
            } else {
                var outdatedModules = [];
                for (var id in hotUpdate) {
                    if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
                        outdatedModules.push(toModuleId(id));
                    }
                }
                callback(null, outdatedModules);
            }
        }
        function hotApply(options, callback) {
            if (hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
            if (typeof options === "function") {
                callback = options;
                options = {};
            } else if (options && typeof options === "object") {
                callback = callback || function(err) {
                    if (err) throw err;
                };
            } else {
                options = {};
                callback = callback || function(err) {
                    if (err) throw err;
                };
            }
            function getAffectedStuff(module) {
                var outdatedModules = [ module ];
                var outdatedDependencies = {};
                var queue = outdatedModules.slice();
                while (queue.length > 0) {
                    var moduleId = queue.pop();
                    var module = installedModules[moduleId];
                    if (!module || module.hot._selfAccepted) continue;
                    if (module.hot._selfDeclined) {
                        return new Error("Aborted because of self decline: " + moduleId);
                    }
                    if (moduleId === 0) {
                        return;
                    }
                    for (var i = 0; i < module.parents.length; i++) {
                        var parentId = module.parents[i];
                        var parent = installedModules[parentId];
                        if (parent.hot._declinedDependencies[moduleId]) {
                            return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
                        }
                        if (outdatedModules.indexOf(parentId) >= 0) continue;
                        if (parent.hot._acceptedDependencies[moduleId]) {
                            if (!outdatedDependencies[parentId]) outdatedDependencies[parentId] = [];
                            addAllToSet(outdatedDependencies[parentId], [ moduleId ]);
                            continue;
                        }
                        delete outdatedDependencies[parentId];
                        outdatedModules.push(parentId);
                        queue.push(parentId);
                    }
                }
                return [ outdatedModules, outdatedDependencies ];
            }
            function addAllToSet(a, b) {
                for (var i = 0; i < b.length; i++) {
                    var item = b[i];
                    if (a.indexOf(item) < 0) a.push(item);
                }
            }
            var outdatedDependencies = {};
            var outdatedModules = [];
            var appliedUpdate = {};
            for (var id in hotUpdate) {
                if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
                    var moduleId = toModuleId(id);
                    var result = getAffectedStuff(moduleId);
                    if (!result) {
                        if (options.ignoreUnaccepted) continue;
                        hotSetStatus("abort");
                        return callback(new Error("Aborted because " + moduleId + " is not accepted"));
                    }
                    if (result instanceof Error) {
                        hotSetStatus("abort");
                        return callback(result);
                    }
                    appliedUpdate[moduleId] = hotUpdate[moduleId];
                    addAllToSet(outdatedModules, result[0]);
                    for (var moduleId in result[1]) {
                        if (Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
                            if (!outdatedDependencies[moduleId]) outdatedDependencies[moduleId] = [];
                            addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
                        }
                    }
                }
            }
            var outdatedSelfAcceptedModules = [];
            for (var i = 0; i < outdatedModules.length; i++) {
                var moduleId = outdatedModules[i];
                if (installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted) outdatedSelfAcceptedModules.push({
                    module: moduleId,
                    errorHandler: installedModules[moduleId].hot._selfAccepted
                });
            }
            hotSetStatus("dispose");
            var queue = outdatedModules.slice();
            while (queue.length > 0) {
                var moduleId = queue.pop();
                var module = installedModules[moduleId];
                if (!module) continue;
                var data = {};
                var disposeHandlers = module.hot._disposeHandlers;
                for (var j = 0; j < disposeHandlers.length; j++) {
                    var cb = disposeHandlers[j];
                    cb(data);
                }
                hotCurrentModuleData[moduleId] = data;
                module.hot.active = false;
                delete installedModules[moduleId];
                for (var j = 0; j < module.children.length; j++) {
                    var child = installedModules[module.children[j]];
                    if (!child) continue;
                    var idx = child.parents.indexOf(moduleId);
                    if (idx >= 0) {
                        child.parents.splice(idx, 1);
                    }
                }
            }
            for (var moduleId in outdatedDependencies) {
                if (Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
                    var module = installedModules[moduleId];
                    var moduleOutdatedDependencies = outdatedDependencies[moduleId];
                    for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
                        var dependency = moduleOutdatedDependencies[j];
                        var idx = module.children.indexOf(dependency);
                        if (idx >= 0) module.children.splice(idx, 1);
                    }
                }
            }
            hotSetStatus("apply");
            hotCurrentHash = hotUpdateNewHash;
            for (var moduleId in appliedUpdate) {
                if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
                    modules[moduleId] = appliedUpdate[moduleId];
                }
            }
            var error = null;
            for (var moduleId in outdatedDependencies) {
                if (Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
                    var module = installedModules[moduleId];
                    var moduleOutdatedDependencies = outdatedDependencies[moduleId];
                    var callbacks = [];
                    for (var i = 0; i < moduleOutdatedDependencies.length; i++) {
                        var dependency = moduleOutdatedDependencies[i];
                        var cb = module.hot._acceptedDependencies[dependency];
                        if (callbacks.indexOf(cb) >= 0) continue;
                        callbacks.push(cb);
                    }
                    for (var i = 0; i < callbacks.length; i++) {
                        var cb = callbacks[i];
                        try {
                            cb(outdatedDependencies);
                        } catch (err) {
                            if (!error) error = err;
                        }
                    }
                }
            }
            for (var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
                var item = outdatedSelfAcceptedModules[i];
                var moduleId = item.module;
                hotCurrentParents = [ moduleId ];
                try {
                    __webpack_require__(moduleId);
                } catch (err) {
                    if (typeof item.errorHandler === "function") {
                        try {
                            item.errorHandler(err);
                        } catch (err) {
                            if (!error) error = err;
                        }
                    } else if (!error) error = err;
                }
            }
            if (error) {
                hotSetStatus("fail");
                return callback(error);
            }
            hotSetStatus("idle");
            callback(null, outdatedModules);
        }
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false,
                hot: hotCreateModule(moduleId),
                parents: hotCurrentParents,
                children: []
            };
            modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
            module.loaded = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "/static/";
        __webpack_require__.h = function() {
            return hotCurrentHash;
        };
        return hotCreateRequire(0)(0);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var modal_module_1 = __webpack_require__(1);
        exports.ModalModule = modal_module_1.ModalModule;
        var modal_window_service_1 = __webpack_require__(29);
        exports.ModalWindowService = modal_window_service_1.ModalWindowService;
        var modal_window_component_1 = __webpack_require__(24);
        exports.ModalWindowComponent = modal_window_component_1.ModalWindowComponent;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var core_1 = __webpack_require__(2);
        var common_1 = __webpack_require__(20);
        var rx_pubsub_1 = __webpack_require__(21);
        var trust_html_pipe_1 = __webpack_require__(22);
        var modal_window_component_1 = __webpack_require__(24);
        var modal_window_service_1 = __webpack_require__(29);
        var ModalModule = function() {
            function ModalModule() {}
            return ModalModule;
        }();
        ModalModule = __decorate([ core_1.NgModule({
            imports: [ common_1.CommonModule ],
            declarations: [ modal_window_component_1.ModalWindowComponent, trust_html_pipe_1.TrustHtmlPipe ],
            providers: [ rx_pubsub_1.RxPubSub, modal_window_service_1.ModalWindowService ],
            exports: [ modal_window_component_1.ModalWindowComponent ]
        }) ], ModalModule);
        exports.ModalModule = ModalModule;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            (function(global, factory) {
                true ? factory(exports, __webpack_require__(3), __webpack_require__(5), __webpack_require__(6)) : typeof define === "function" && define.amd ? define([ "exports", "rxjs/symbol/observable", "rxjs/Subject", "rxjs/Observable" ], factory) : factory((global.ng = global.ng || {}, 
                global.ng.core = global.ng.core || {}), global.rxjs_symbol_observable, global.Rx, global.Rx);
            })(this, function(exports, rxjs_symbol_observable, rxjs_Subject, rxjs_Observable) {
                "use strict";
                var globalScope;
                if (typeof window === "undefined") {
                    if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
                        globalScope = self;
                    } else {
                        globalScope = global;
                    }
                } else {
                    globalScope = window;
                }
                function scheduleMicroTask(fn) {
                    Zone.current.scheduleMicroTask("scheduleMicrotask", fn);
                }
                var global$1 = globalScope;
                function getTypeNameForDebugging(type) {
                    return type["name"] || typeof type;
                }
                global$1.assert = function assert(condition) {};
                function isPresent(obj) {
                    return obj != null;
                }
                function isBlank(obj) {
                    return obj == null;
                }
                function stringify(token) {
                    if (typeof token === "string") {
                        return token;
                    }
                    if (token == null) {
                        return "" + token;
                    }
                    if (token.overriddenName) {
                        return "" + token.overriddenName;
                    }
                    if (token.name) {
                        return "" + token.name;
                    }
                    var res = token.toString();
                    var newLineIndex = res.indexOf("\n");
                    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
                }
                function looseIdentical(a, b) {
                    return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
                }
                function isJsObject(o) {
                    return o !== null && (typeof o === "function" || typeof o === "object");
                }
                function print(obj) {
                    console.log(obj);
                }
                function warn(obj) {
                    console.warn(obj);
                }
                var _symbolIterator = null;
                function getSymbolIterator() {
                    if (!_symbolIterator) {
                        if (globalScope.Symbol && Symbol.iterator) {
                            _symbolIterator = Symbol.iterator;
                        } else {
                            var keys = Object.getOwnPropertyNames(Map.prototype);
                            for (var i = 0; i < keys.length; ++i) {
                                var key = keys[i];
                                if (key !== "entries" && key !== "size" && Map.prototype[key] === Map.prototype["entries"]) {
                                    _symbolIterator = key;
                                }
                            }
                        }
                    }
                    return _symbolIterator;
                }
                function isPrimitive(obj) {
                    return !isJsObject(obj);
                }
                var _nextClassId = 0;
                var Reflect = global$1.Reflect;
                function extractAnnotation(annotation) {
                    if (typeof annotation === "function" && annotation.hasOwnProperty("annotation")) {
                        annotation = annotation.annotation;
                    }
                    return annotation;
                }
                function applyParams(fnOrArray, key) {
                    if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function || fnOrArray === Number || fnOrArray === Array) {
                        throw new Error("Can not use native " + stringify(fnOrArray) + " as constructor");
                    }
                    if (typeof fnOrArray === "function") {
                        return fnOrArray;
                    }
                    if (Array.isArray(fnOrArray)) {
                        var annotations = fnOrArray;
                        var annoLength = annotations.length - 1;
                        var fn = fnOrArray[annoLength];
                        if (typeof fn !== "function") {
                            throw new Error("Last position of Class method array must be Function in key " + key + " was '" + stringify(fn) + "'");
                        }
                        if (annoLength != fn.length) {
                            throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + stringify(fn));
                        }
                        var paramsAnnotations = [];
                        for (var i = 0, ii = annotations.length - 1; i < ii; i++) {
                            var paramAnnotations = [];
                            paramsAnnotations.push(paramAnnotations);
                            var annotation = annotations[i];
                            if (Array.isArray(annotation)) {
                                for (var j = 0; j < annotation.length; j++) {
                                    paramAnnotations.push(extractAnnotation(annotation[j]));
                                }
                            } else if (typeof annotation === "function") {
                                paramAnnotations.push(extractAnnotation(annotation));
                            } else {
                                paramAnnotations.push(annotation);
                            }
                        }
                        Reflect.defineMetadata("parameters", paramsAnnotations, fn);
                        return fn;
                    }
                    throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + stringify(fnOrArray) + "'");
                }
                function Class(clsDef) {
                    var constructor = applyParams(clsDef.hasOwnProperty("constructor") ? clsDef.constructor : undefined, "constructor");
                    var proto = constructor.prototype;
                    if (clsDef.hasOwnProperty("extends")) {
                        if (typeof clsDef.extends === "function") {
                            constructor.prototype = proto = Object.create(clsDef.extends.prototype);
                        } else {
                            throw new Error("Class definition 'extends' property must be a constructor function was: " + stringify(clsDef.extends));
                        }
                    }
                    for (var key in clsDef) {
                        if (key !== "extends" && key !== "prototype" && clsDef.hasOwnProperty(key)) {
                            proto[key] = applyParams(clsDef[key], key);
                        }
                    }
                    if (this && this.annotations instanceof Array) {
                        Reflect.defineMetadata("annotations", this.annotations, constructor);
                    }
                    var constructorName = constructor["name"];
                    if (!constructorName || constructorName === "constructor") {
                        constructor["overriddenName"] = "class" + _nextClassId++;
                    }
                    return constructor;
                }
                function makeDecorator(name, props, parentClass, chainFn) {
                    if (chainFn === void 0) {
                        chainFn = null;
                    }
                    var metaCtor = makeMetadataCtor([ props ]);
                    function DecoratorFactory(objOrType) {
                        if (!(Reflect && Reflect.getOwnMetadata)) {
                            throw "reflect-metadata shim is required when using class decorators";
                        }
                        if (this instanceof DecoratorFactory) {
                            metaCtor.call(this, objOrType);
                            return this;
                        }
                        var annotationInstance = new DecoratorFactory(objOrType);
                        var chainAnnotation = typeof this === "function" && Array.isArray(this.annotations) ? this.annotations : [];
                        chainAnnotation.push(annotationInstance);
                        var TypeDecorator = function TypeDecorator(cls) {
                            var annotations = Reflect.getOwnMetadata("annotations", cls) || [];
                            annotations.push(annotationInstance);
                            Reflect.defineMetadata("annotations", annotations, cls);
                            return cls;
                        };
                        TypeDecorator.annotations = chainAnnotation;
                        TypeDecorator.Class = Class;
                        if (chainFn) chainFn(TypeDecorator);
                        return TypeDecorator;
                    }
                    if (parentClass) {
                        DecoratorFactory.prototype = Object.create(parentClass.prototype);
                    }
                    DecoratorFactory.prototype.toString = function() {
                        return "@" + name;
                    };
                    DecoratorFactory.annotationCls = DecoratorFactory;
                    return DecoratorFactory;
                }
                function makeMetadataCtor(props) {
                    return function ctor() {
                        var _this = this;
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        props.forEach(function(prop, i) {
                            var argVal = args[i];
                            if (Array.isArray(prop)) {
                                _this[prop[0]] = argVal === undefined ? prop[1] : argVal;
                            } else {
                                for (var propName in prop) {
                                    _this[propName] = argVal && argVal.hasOwnProperty(propName) ? argVal[propName] : prop[propName];
                                }
                            }
                        });
                    };
                }
                function makeParamDecorator(name, props, parentClass) {
                    var metaCtor = makeMetadataCtor(props);
                    function ParamDecoratorFactory() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        if (this instanceof ParamDecoratorFactory) {
                            metaCtor.apply(this, args);
                            return this;
                        }
                        var annotationInstance = new ((_a = ParamDecoratorFactory).bind.apply(_a, [ void 0 ].concat(args)))();
                        ParamDecorator.annotation = annotationInstance;
                        return ParamDecorator;
                        function ParamDecorator(cls, unusedKey, index) {
                            var parameters = Reflect.getOwnMetadata("parameters", cls) || [];
                            while (parameters.length <= index) {
                                parameters.push(null);
                            }
                            parameters[index] = parameters[index] || [];
                            parameters[index].push(annotationInstance);
                            Reflect.defineMetadata("parameters", parameters, cls);
                            return cls;
                        }
                        var _a;
                    }
                    if (parentClass) {
                        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
                    }
                    ParamDecoratorFactory.prototype.toString = function() {
                        return "@" + name;
                    };
                    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
                    return ParamDecoratorFactory;
                }
                function makePropDecorator(name, props, parentClass) {
                    var metaCtor = makeMetadataCtor(props);
                    function PropDecoratorFactory() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i - 0] = arguments[_i];
                        }
                        if (this instanceof PropDecoratorFactory) {
                            metaCtor.apply(this, args);
                            return this;
                        }
                        var decoratorInstance = new ((_a = PropDecoratorFactory).bind.apply(_a, [ void 0 ].concat(args)))();
                        return function PropDecorator(target, name) {
                            var meta = Reflect.getOwnMetadata("propMetadata", target.constructor) || {};
                            meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
                            meta[name].unshift(decoratorInstance);
                            Reflect.defineMetadata("propMetadata", meta, target.constructor);
                        };
                        var _a;
                    }
                    if (parentClass) {
                        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
                    }
                    PropDecoratorFactory.prototype.toString = function() {
                        return "@" + name;
                    };
                    PropDecoratorFactory.annotationCls = PropDecoratorFactory;
                    return PropDecoratorFactory;
                }
                var Inject = makeParamDecorator("Inject", [ [ "token", undefined ] ]);
                var Optional = makeParamDecorator("Optional", []);
                var Injectable = makeDecorator("Injectable", []);
                var Self = makeParamDecorator("Self", []);
                var SkipSelf = makeParamDecorator("SkipSelf", []);
                var Host = makeParamDecorator("Host", []);
                var OpaqueToken = function() {
                    function OpaqueToken(_desc) {
                        this._desc = _desc;
                    }
                    OpaqueToken.prototype.toString = function() {
                        return "Token " + this._desc;
                    };
                    OpaqueToken.decorators = [ {
                        type: Injectable
                    } ];
                    OpaqueToken.ctorParameters = function() {
                        return [ null ];
                    };
                    return OpaqueToken;
                }();
                var ANALYZE_FOR_ENTRY_COMPONENTS = new OpaqueToken("AnalyzeForEntryComponents");
                var Attribute = makeParamDecorator("Attribute", [ [ "attributeName", undefined ] ]);
                var Query = function() {
                    function Query() {}
                    return Query;
                }();
                var ContentChildren = makePropDecorator("ContentChildren", [ [ "selector", undefined ], {
                    first: false,
                    isViewQuery: false,
                    descendants: false,
                    read: undefined
                } ], Query);
                var ContentChild = makePropDecorator("ContentChild", [ [ "selector", undefined ], {
                    first: true,
                    isViewQuery: false,
                    descendants: true,
                    read: undefined
                } ], Query);
                var ViewChildren = makePropDecorator("ViewChildren", [ [ "selector", undefined ], {
                    first: false,
                    isViewQuery: true,
                    descendants: true,
                    read: undefined
                } ], Query);
                var ViewChild = makePropDecorator("ViewChild", [ [ "selector", undefined ], {
                    first: true,
                    isViewQuery: true,
                    descendants: true,
                    read: undefined
                } ], Query);
                var ChangeDetectionStrategy = {};
                ChangeDetectionStrategy.OnPush = 0;
                ChangeDetectionStrategy.Default = 1;
                ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = "OnPush";
                ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = "Default";
                var ChangeDetectorStatus = {};
                ChangeDetectorStatus.CheckOnce = 0;
                ChangeDetectorStatus.Checked = 1;
                ChangeDetectorStatus.CheckAlways = 2;
                ChangeDetectorStatus.Detached = 3;
                ChangeDetectorStatus.Errored = 4;
                ChangeDetectorStatus.Destroyed = 5;
                ChangeDetectorStatus[ChangeDetectorStatus.CheckOnce] = "CheckOnce";
                ChangeDetectorStatus[ChangeDetectorStatus.Checked] = "Checked";
                ChangeDetectorStatus[ChangeDetectorStatus.CheckAlways] = "CheckAlways";
                ChangeDetectorStatus[ChangeDetectorStatus.Detached] = "Detached";
                ChangeDetectorStatus[ChangeDetectorStatus.Errored] = "Errored";
                ChangeDetectorStatus[ChangeDetectorStatus.Destroyed] = "Destroyed";
                function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
                    return isBlank(changeDetectionStrategy) || changeDetectionStrategy === ChangeDetectionStrategy.Default;
                }
                var Directive = makeDecorator("Directive", {
                    selector: undefined,
                    inputs: undefined,
                    outputs: undefined,
                    host: undefined,
                    providers: undefined,
                    exportAs: undefined,
                    queries: undefined
                });
                var Component = makeDecorator("Component", {
                    selector: undefined,
                    inputs: undefined,
                    outputs: undefined,
                    host: undefined,
                    exportAs: undefined,
                    moduleId: undefined,
                    providers: undefined,
                    viewProviders: undefined,
                    changeDetection: ChangeDetectionStrategy.Default,
                    queries: undefined,
                    templateUrl: undefined,
                    template: undefined,
                    styleUrls: undefined,
                    styles: undefined,
                    animations: undefined,
                    encapsulation: undefined,
                    interpolation: undefined,
                    entryComponents: undefined
                }, Directive);
                var Pipe = makeDecorator("Pipe", {
                    name: undefined,
                    pure: true
                });
                var Input = makePropDecorator("Input", [ [ "bindingPropertyName", undefined ] ]);
                var Output = makePropDecorator("Output", [ [ "bindingPropertyName", undefined ] ]);
                var HostBinding = makePropDecorator("HostBinding", [ [ "hostPropertyName", undefined ] ]);
                var HostListener = makePropDecorator("HostListener", [ [ "eventName", undefined ], [ "args", [] ] ]);
                var LifecycleHooks = {};
                LifecycleHooks.OnInit = 0;
                LifecycleHooks.OnDestroy = 1;
                LifecycleHooks.DoCheck = 2;
                LifecycleHooks.OnChanges = 3;
                LifecycleHooks.AfterContentInit = 4;
                LifecycleHooks.AfterContentChecked = 5;
                LifecycleHooks.AfterViewInit = 6;
                LifecycleHooks.AfterViewChecked = 7;
                LifecycleHooks[LifecycleHooks.OnInit] = "OnInit";
                LifecycleHooks[LifecycleHooks.OnDestroy] = "OnDestroy";
                LifecycleHooks[LifecycleHooks.DoCheck] = "DoCheck";
                LifecycleHooks[LifecycleHooks.OnChanges] = "OnChanges";
                LifecycleHooks[LifecycleHooks.AfterContentInit] = "AfterContentInit";
                LifecycleHooks[LifecycleHooks.AfterContentChecked] = "AfterContentChecked";
                LifecycleHooks[LifecycleHooks.AfterViewInit] = "AfterViewInit";
                LifecycleHooks[LifecycleHooks.AfterViewChecked] = "AfterViewChecked";
                var LIFECYCLE_HOOKS_VALUES = [ LifecycleHooks.OnInit, LifecycleHooks.OnDestroy, LifecycleHooks.DoCheck, LifecycleHooks.OnChanges, LifecycleHooks.AfterContentInit, LifecycleHooks.AfterContentChecked, LifecycleHooks.AfterViewInit, LifecycleHooks.AfterViewChecked ];
                var OnChanges = function() {
                    function OnChanges() {}
                    OnChanges.prototype.ngOnChanges = function(changes) {};
                    return OnChanges;
                }();
                var OnInit = function() {
                    function OnInit() {}
                    OnInit.prototype.ngOnInit = function() {};
                    return OnInit;
                }();
                var DoCheck = function() {
                    function DoCheck() {}
                    DoCheck.prototype.ngDoCheck = function() {};
                    return DoCheck;
                }();
                var OnDestroy = function() {
                    function OnDestroy() {}
                    OnDestroy.prototype.ngOnDestroy = function() {};
                    return OnDestroy;
                }();
                var AfterContentInit = function() {
                    function AfterContentInit() {}
                    AfterContentInit.prototype.ngAfterContentInit = function() {};
                    return AfterContentInit;
                }();
                var AfterContentChecked = function() {
                    function AfterContentChecked() {}
                    AfterContentChecked.prototype.ngAfterContentChecked = function() {};
                    return AfterContentChecked;
                }();
                var AfterViewInit = function() {
                    function AfterViewInit() {}
                    AfterViewInit.prototype.ngAfterViewInit = function() {};
                    return AfterViewInit;
                }();
                var AfterViewChecked = function() {
                    function AfterViewChecked() {}
                    AfterViewChecked.prototype.ngAfterViewChecked = function() {};
                    return AfterViewChecked;
                }();
                var CUSTOM_ELEMENTS_SCHEMA = {
                    name: "custom-elements"
                };
                var NO_ERRORS_SCHEMA = {
                    name: "no-errors-schema"
                };
                var NgModule = makeDecorator("NgModule", {
                    providers: undefined,
                    declarations: undefined,
                    imports: undefined,
                    exports: undefined,
                    entryComponents: undefined,
                    bootstrap: undefined,
                    schemas: undefined,
                    id: undefined
                });
                var ViewEncapsulation = {};
                ViewEncapsulation.Emulated = 0;
                ViewEncapsulation.Native = 1;
                ViewEncapsulation.None = 2;
                ViewEncapsulation[ViewEncapsulation.Emulated] = "Emulated";
                ViewEncapsulation[ViewEncapsulation.Native] = "Native";
                ViewEncapsulation[ViewEncapsulation.None] = "None";
                var ViewMetadata = function() {
                    function ViewMetadata(_a) {
                        var _b = _a === void 0 ? {} : _a, templateUrl = _b.templateUrl, template = _b.template, encapsulation = _b.encapsulation, styles = _b.styles, styleUrls = _b.styleUrls, animations = _b.animations, interpolation = _b.interpolation;
                        this.templateUrl = templateUrl;
                        this.template = template;
                        this.styleUrls = styleUrls;
                        this.styles = styles;
                        this.encapsulation = encapsulation;
                        this.animations = animations;
                        this.interpolation = interpolation;
                    }
                    return ViewMetadata;
                }();
                var Version = function() {
                    function Version(full) {
                        this.full = full;
                    }
                    Object.defineProperty(Version.prototype, "major", {
                        get: function() {
                            return this.full.split(".")[0];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Version.prototype, "minor", {
                        get: function() {
                            return this.full.split(".")[1];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Version.prototype, "patch", {
                        get: function() {
                            return this.full.split(".").slice(2).join(".");
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return Version;
                }();
                var VERSION = new Version("2.4.10");
                function forwardRef(forwardRefFn) {
                    forwardRefFn.__forward_ref__ = forwardRef;
                    forwardRefFn.toString = function() {
                        return stringify(this());
                    };
                    return forwardRefFn;
                }
                function resolveForwardRef(type) {
                    if (typeof type === "function" && type.hasOwnProperty("__forward_ref__") && type.__forward_ref__ === forwardRef) {
                        return type();
                    } else {
                        return type;
                    }
                }
                var _THROW_IF_NOT_FOUND = new Object();
                var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
                var _NullInjector = function() {
                    function _NullInjector() {}
                    _NullInjector.prototype.get = function(token, notFoundValue) {
                        if (notFoundValue === void 0) {
                            notFoundValue = _THROW_IF_NOT_FOUND;
                        }
                        if (notFoundValue === _THROW_IF_NOT_FOUND) {
                            throw new Error("No provider for " + stringify(token) + "!");
                        }
                        return notFoundValue;
                    };
                    return _NullInjector;
                }();
                var Injector = function() {
                    function Injector() {}
                    Injector.prototype.get = function(token, notFoundValue) {};
                    Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
                    Injector.NULL = new _NullInjector();
                    return Injector;
                }();
                var __extends$1 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var BaseError = function(_super) {
                    __extends$1(BaseError, _super);
                    function BaseError(message) {
                        _super.call(this, message);
                        var nativeError = new Error(message);
                        this._nativeError = nativeError;
                    }
                    Object.defineProperty(BaseError.prototype, "message", {
                        get: function() {
                            return this._nativeError.message;
                        },
                        set: function(message) {
                            this._nativeError.message = message;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BaseError.prototype, "name", {
                        get: function() {
                            return this._nativeError.name;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BaseError.prototype, "stack", {
                        get: function() {
                            return this._nativeError.stack;
                        },
                        set: function(value) {
                            this._nativeError.stack = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BaseError.prototype.toString = function() {
                        return this._nativeError.toString();
                    };
                    return BaseError;
                }(Error);
                var WrappedError = function(_super) {
                    __extends$1(WrappedError, _super);
                    function WrappedError(message, error) {
                        _super.call(this, message + " caused by: " + (error instanceof Error ? error.message : error));
                        this.originalError = error;
                    }
                    Object.defineProperty(WrappedError.prototype, "stack", {
                        get: function() {
                            return (this.originalError instanceof Error ? this.originalError : this._nativeError).stack;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return WrappedError;
                }(BaseError);
                var __extends = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                function findFirstClosedCycle(keys) {
                    var res = [];
                    for (var i = 0; i < keys.length; ++i) {
                        if (res.indexOf(keys[i]) > -1) {
                            res.push(keys[i]);
                            return res;
                        }
                        res.push(keys[i]);
                    }
                    return res;
                }
                function constructResolvingPath(keys) {
                    if (keys.length > 1) {
                        var reversed = findFirstClosedCycle(keys.slice().reverse());
                        var tokenStrs = reversed.map(function(k) {
                            return stringify(k.token);
                        });
                        return " (" + tokenStrs.join(" -> ") + ")";
                    }
                    return "";
                }
                var AbstractProviderError = function(_super) {
                    __extends(AbstractProviderError, _super);
                    function AbstractProviderError(injector, key, constructResolvingMessage) {
                        _super.call(this, "DI Error");
                        this.keys = [ key ];
                        this.injectors = [ injector ];
                        this.constructResolvingMessage = constructResolvingMessage;
                        this.message = this.constructResolvingMessage(this.keys);
                    }
                    AbstractProviderError.prototype.addKey = function(injector, key) {
                        this.injectors.push(injector);
                        this.keys.push(key);
                        this.message = this.constructResolvingMessage(this.keys);
                    };
                    return AbstractProviderError;
                }(BaseError);
                var NoProviderError = function(_super) {
                    __extends(NoProviderError, _super);
                    function NoProviderError(injector, key) {
                        _super.call(this, injector, key, function(keys) {
                            var first = stringify(keys[0].token);
                            return "No provider for " + first + "!" + constructResolvingPath(keys);
                        });
                    }
                    return NoProviderError;
                }(AbstractProviderError);
                var CyclicDependencyError = function(_super) {
                    __extends(CyclicDependencyError, _super);
                    function CyclicDependencyError(injector, key) {
                        _super.call(this, injector, key, function(keys) {
                            return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
                        });
                    }
                    return CyclicDependencyError;
                }(AbstractProviderError);
                var InstantiationError = function(_super) {
                    __extends(InstantiationError, _super);
                    function InstantiationError(injector, originalException, originalStack, key) {
                        _super.call(this, "DI Error", originalException);
                        this.keys = [ key ];
                        this.injectors = [ injector ];
                    }
                    InstantiationError.prototype.addKey = function(injector, key) {
                        this.injectors.push(injector);
                        this.keys.push(key);
                    };
                    Object.defineProperty(InstantiationError.prototype, "message", {
                        get: function() {
                            var first = stringify(this.keys[0].token);
                            return this.originalError.message + ": Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(InstantiationError.prototype, "causeKey", {
                        get: function() {
                            return this.keys[0];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return InstantiationError;
                }(WrappedError);
                var InvalidProviderError = function(_super) {
                    __extends(InvalidProviderError, _super);
                    function InvalidProviderError(provider) {
                        _super.call(this, "Invalid provider - only instances of Provider and Type are allowed, got: " + provider);
                    }
                    return InvalidProviderError;
                }(BaseError);
                var NoAnnotationError = function(_super) {
                    __extends(NoAnnotationError, _super);
                    function NoAnnotationError(typeOrFunc, params) {
                        _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
                    }
                    NoAnnotationError._genMessage = function(typeOrFunc, params) {
                        var signature = [];
                        for (var i = 0, ii = params.length; i < ii; i++) {
                            var parameter = params[i];
                            if (!parameter || parameter.length == 0) {
                                signature.push("?");
                            } else {
                                signature.push(parameter.map(stringify).join(" "));
                            }
                        }
                        return "Cannot resolve all parameters for '" + stringify(typeOrFunc) + "'(" + signature.join(", ") + "). " + "Make sure that all the parameters are decorated with Inject or have valid type annotations and that '" + stringify(typeOrFunc) + "' is decorated with Injectable.";
                    };
                    return NoAnnotationError;
                }(BaseError);
                var OutOfBoundsError = function(_super) {
                    __extends(OutOfBoundsError, _super);
                    function OutOfBoundsError(index) {
                        _super.call(this, "Index " + index + " is out-of-bounds.");
                    }
                    return OutOfBoundsError;
                }(BaseError);
                var MixingMultiProvidersWithRegularProvidersError = function(_super) {
                    __extends(MixingMultiProvidersWithRegularProvidersError, _super);
                    function MixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
                        _super.call(this, "Cannot mix multi providers and regular providers, got: " + provider1.toString() + " " + provider2.toString());
                    }
                    return MixingMultiProvidersWithRegularProvidersError;
                }(BaseError);
                var ReflectiveKey = function() {
                    function ReflectiveKey(token, id) {
                        this.token = token;
                        this.id = id;
                        if (!token) {
                            throw new Error("Token must be defined!");
                        }
                    }
                    Object.defineProperty(ReflectiveKey.prototype, "displayName", {
                        get: function() {
                            return stringify(this.token);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ReflectiveKey.get = function(token) {
                        return _globalKeyRegistry.get(resolveForwardRef(token));
                    };
                    Object.defineProperty(ReflectiveKey, "numberOfKeys", {
                        get: function() {
                            return _globalKeyRegistry.numberOfKeys;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return ReflectiveKey;
                }();
                var KeyRegistry = function() {
                    function KeyRegistry() {
                        this._allKeys = new Map();
                    }
                    KeyRegistry.prototype.get = function(token) {
                        if (token instanceof ReflectiveKey) return token;
                        if (this._allKeys.has(token)) {
                            return this._allKeys.get(token);
                        }
                        var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
                        this._allKeys.set(token, newKey);
                        return newKey;
                    };
                    Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
                        get: function() {
                            return this._allKeys.size;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return KeyRegistry;
                }();
                var _globalKeyRegistry = new KeyRegistry();
                var Type = Function;
                function isType(v) {
                    return typeof v === "function";
                }
                var DELEGATE_CTOR = /^function\s+\S+\(\)\s*{\s*("use strict";)?\s*(return\s+)?\S+\.apply\(this,\s*arguments\)/;
                var ReflectionCapabilities = function() {
                    function ReflectionCapabilities(reflect) {
                        this._reflect = reflect || global$1.Reflect;
                    }
                    ReflectionCapabilities.prototype.isReflectionEnabled = function() {
                        return true;
                    };
                    ReflectionCapabilities.prototype.factory = function(t) {
                        return function() {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i - 0] = arguments[_i];
                            }
                            return new (t.bind.apply(t, [ void 0 ].concat(args)))();
                        };
                    };
                    ReflectionCapabilities.prototype._zipTypesAndAnnotations = function(paramTypes, paramAnnotations) {
                        var result;
                        if (typeof paramTypes === "undefined") {
                            result = new Array(paramAnnotations.length);
                        } else {
                            result = new Array(paramTypes.length);
                        }
                        for (var i = 0; i < result.length; i++) {
                            if (typeof paramTypes === "undefined") {
                                result[i] = [];
                            } else if (paramTypes[i] != Object) {
                                result[i] = [ paramTypes[i] ];
                            } else {
                                result[i] = [];
                            }
                            if (paramAnnotations && isPresent(paramAnnotations[i])) {
                                result[i] = result[i].concat(paramAnnotations[i]);
                            }
                        }
                        return result;
                    };
                    ReflectionCapabilities.prototype._ownParameters = function(type, parentCtor) {
                        if (DELEGATE_CTOR.exec(type.toString())) {
                            return null;
                        }
                        if (type.parameters && type.parameters !== parentCtor.parameters) {
                            return type.parameters;
                        }
                        var tsickleCtorParams = type.ctorParameters;
                        if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
                            var ctorParameters = typeof tsickleCtorParams === "function" ? tsickleCtorParams() : tsickleCtorParams;
                            var paramTypes = ctorParameters.map(function(ctorParam) {
                                return ctorParam && ctorParam.type;
                            });
                            var paramAnnotations = ctorParameters.map(function(ctorParam) {
                                return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators);
                            });
                            return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
                        }
                        if (isPresent(this._reflect) && isPresent(this._reflect.getOwnMetadata)) {
                            var paramAnnotations = this._reflect.getOwnMetadata("parameters", type);
                            var paramTypes = this._reflect.getOwnMetadata("design:paramtypes", type);
                            if (paramTypes || paramAnnotations) {
                                return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
                            }
                        }
                        return new Array(type.length).fill(undefined);
                    };
                    ReflectionCapabilities.prototype.parameters = function(type) {
                        if (!isType(type)) {
                            return [];
                        }
                        var parentCtor = getParentCtor(type);
                        var parameters = this._ownParameters(type, parentCtor);
                        if (!parameters && parentCtor !== Object) {
                            parameters = this.parameters(parentCtor);
                        }
                        return parameters || [];
                    };
                    ReflectionCapabilities.prototype._ownAnnotations = function(typeOrFunc, parentCtor) {
                        if (typeOrFunc.annotations && typeOrFunc.annotations !== parentCtor.annotations) {
                            var annotations = typeOrFunc.annotations;
                            if (typeof annotations === "function" && annotations.annotations) {
                                annotations = annotations.annotations;
                            }
                            return annotations;
                        }
                        if (typeOrFunc.decorators && typeOrFunc.decorators !== parentCtor.decorators) {
                            return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
                        }
                        if (this._reflect && this._reflect.getOwnMetadata) {
                            return this._reflect.getOwnMetadata("annotations", typeOrFunc);
                        }
                    };
                    ReflectionCapabilities.prototype.annotations = function(typeOrFunc) {
                        if (!isType(typeOrFunc)) {
                            return [];
                        }
                        var parentCtor = getParentCtor(typeOrFunc);
                        var ownAnnotations = this._ownAnnotations(typeOrFunc, parentCtor) || [];
                        var parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];
                        return parentAnnotations.concat(ownAnnotations);
                    };
                    ReflectionCapabilities.prototype._ownPropMetadata = function(typeOrFunc, parentCtor) {
                        if (typeOrFunc.propMetadata && typeOrFunc.propMetadata !== parentCtor.propMetadata) {
                            var propMetadata = typeOrFunc.propMetadata;
                            if (typeof propMetadata === "function" && propMetadata.propMetadata) {
                                propMetadata = propMetadata.propMetadata;
                            }
                            return propMetadata;
                        }
                        if (typeOrFunc.propDecorators && typeOrFunc.propDecorators !== parentCtor.propDecorators) {
                            var propDecorators_1 = typeOrFunc.propDecorators;
                            var propMetadata_1 = {};
                            Object.keys(propDecorators_1).forEach(function(prop) {
                                propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
                            });
                            return propMetadata_1;
                        }
                        if (this._reflect && this._reflect.getOwnMetadata) {
                            return this._reflect.getOwnMetadata("propMetadata", typeOrFunc);
                        }
                    };
                    ReflectionCapabilities.prototype.propMetadata = function(typeOrFunc) {
                        if (!isType(typeOrFunc)) {
                            return {};
                        }
                        var parentCtor = getParentCtor(typeOrFunc);
                        var propMetadata = {};
                        if (parentCtor !== Object) {
                            var parentPropMetadata_1 = this.propMetadata(parentCtor);
                            Object.keys(parentPropMetadata_1).forEach(function(propName) {
                                propMetadata[propName] = parentPropMetadata_1[propName];
                            });
                        }
                        var ownPropMetadata = this._ownPropMetadata(typeOrFunc, parentCtor);
                        if (ownPropMetadata) {
                            Object.keys(ownPropMetadata).forEach(function(propName) {
                                var decorators = [];
                                if (propMetadata.hasOwnProperty(propName)) {
                                    decorators.push.apply(decorators, propMetadata[propName]);
                                }
                                decorators.push.apply(decorators, ownPropMetadata[propName]);
                                propMetadata[propName] = decorators;
                            });
                        }
                        return propMetadata;
                    };
                    ReflectionCapabilities.prototype.hasLifecycleHook = function(type, lcProperty) {
                        return type instanceof Type && lcProperty in type.prototype;
                    };
                    ReflectionCapabilities.prototype.getter = function(name) {
                        return new Function("o", "return o." + name + ";");
                    };
                    ReflectionCapabilities.prototype.setter = function(name) {
                        return new Function("o", "v", "return o." + name + " = v;");
                    };
                    ReflectionCapabilities.prototype.method = function(name) {
                        var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
                        return new Function("o", "args", functionBody);
                    };
                    ReflectionCapabilities.prototype.importUri = function(type) {
                        if (typeof type === "object" && type["filePath"]) {
                            return type["filePath"];
                        }
                        return "./" + stringify(type);
                    };
                    ReflectionCapabilities.prototype.resolveIdentifier = function(name, moduleUrl, runtime) {
                        return runtime;
                    };
                    ReflectionCapabilities.prototype.resolveEnum = function(enumIdentifier, name) {
                        return enumIdentifier[name];
                    };
                    return ReflectionCapabilities;
                }();
                function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
                    if (!decoratorInvocations) {
                        return [];
                    }
                    return decoratorInvocations.map(function(decoratorInvocation) {
                        var decoratorType = decoratorInvocation.type;
                        var annotationCls = decoratorType.annotationCls;
                        var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
                        return new (annotationCls.bind.apply(annotationCls, [ void 0 ].concat(annotationArgs)))();
                    });
                }
                function getParentCtor(ctor) {
                    var parentProto = Object.getPrototypeOf(ctor.prototype);
                    var parentCtor = parentProto ? parentProto.constructor : null;
                    return parentCtor || Object;
                }
                var ReflectorReader = function() {
                    function ReflectorReader() {}
                    ReflectorReader.prototype.parameters = function(typeOrFunc) {};
                    ReflectorReader.prototype.annotations = function(typeOrFunc) {};
                    ReflectorReader.prototype.propMetadata = function(typeOrFunc) {};
                    ReflectorReader.prototype.importUri = function(typeOrFunc) {};
                    ReflectorReader.prototype.resolveIdentifier = function(name, moduleUrl, runtime) {};
                    ReflectorReader.prototype.resolveEnum = function(identifier, name) {};
                    return ReflectorReader;
                }();
                var __extends$2 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var Reflector = function(_super) {
                    __extends$2(Reflector, _super);
                    function Reflector(reflectionCapabilities) {
                        _super.call(this);
                        this.reflectionCapabilities = reflectionCapabilities;
                    }
                    Reflector.prototype.updateCapabilities = function(caps) {
                        this.reflectionCapabilities = caps;
                    };
                    Reflector.prototype.factory = function(type) {
                        return this.reflectionCapabilities.factory(type);
                    };
                    Reflector.prototype.parameters = function(typeOrFunc) {
                        return this.reflectionCapabilities.parameters(typeOrFunc);
                    };
                    Reflector.prototype.annotations = function(typeOrFunc) {
                        return this.reflectionCapabilities.annotations(typeOrFunc);
                    };
                    Reflector.prototype.propMetadata = function(typeOrFunc) {
                        return this.reflectionCapabilities.propMetadata(typeOrFunc);
                    };
                    Reflector.prototype.hasLifecycleHook = function(type, lcProperty) {
                        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
                    };
                    Reflector.prototype.getter = function(name) {
                        return this.reflectionCapabilities.getter(name);
                    };
                    Reflector.prototype.setter = function(name) {
                        return this.reflectionCapabilities.setter(name);
                    };
                    Reflector.prototype.method = function(name) {
                        return this.reflectionCapabilities.method(name);
                    };
                    Reflector.prototype.importUri = function(type) {
                        return this.reflectionCapabilities.importUri(type);
                    };
                    Reflector.prototype.resolveIdentifier = function(name, moduleUrl, runtime) {
                        return this.reflectionCapabilities.resolveIdentifier(name, moduleUrl, runtime);
                    };
                    Reflector.prototype.resolveEnum = function(identifier, name) {
                        return this.reflectionCapabilities.resolveEnum(identifier, name);
                    };
                    return Reflector;
                }(ReflectorReader);
                var reflector = new Reflector(new ReflectionCapabilities());
                var ReflectiveDependency = function() {
                    function ReflectiveDependency(key, optional, visibility) {
                        this.key = key;
                        this.optional = optional;
                        this.visibility = visibility;
                    }
                    ReflectiveDependency.fromKey = function(key) {
                        return new ReflectiveDependency(key, false, null);
                    };
                    return ReflectiveDependency;
                }();
                var _EMPTY_LIST = [];
                var ResolvedReflectiveProvider_ = function() {
                    function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
                        this.key = key;
                        this.resolvedFactories = resolvedFactories;
                        this.multiProvider = multiProvider;
                    }
                    Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
                        get: function() {
                            return this.resolvedFactories[0];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return ResolvedReflectiveProvider_;
                }();
                var ResolvedReflectiveFactory = function() {
                    function ResolvedReflectiveFactory(factory, dependencies) {
                        this.factory = factory;
                        this.dependencies = dependencies;
                    }
                    return ResolvedReflectiveFactory;
                }();
                function resolveReflectiveFactory(provider) {
                    var factoryFn;
                    var resolvedDeps;
                    if (provider.useClass) {
                        var useClass = resolveForwardRef(provider.useClass);
                        factoryFn = reflector.factory(useClass);
                        resolvedDeps = _dependenciesFor(useClass);
                    } else if (provider.useExisting) {
                        factoryFn = function(aliasInstance) {
                            return aliasInstance;
                        };
                        resolvedDeps = [ ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting)) ];
                    } else if (provider.useFactory) {
                        factoryFn = provider.useFactory;
                        resolvedDeps = constructDependencies(provider.useFactory, provider.deps);
                    } else {
                        factoryFn = function() {
                            return provider.useValue;
                        };
                        resolvedDeps = _EMPTY_LIST;
                    }
                    return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
                }
                function resolveReflectiveProvider(provider) {
                    return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.provide), [ resolveReflectiveFactory(provider) ], provider.multi);
                }
                function resolveReflectiveProviders(providers) {
                    var normalized = _normalizeProviders(providers, []);
                    var resolved = normalized.map(resolveReflectiveProvider);
                    var resolvedProviderMap = mergeResolvedReflectiveProviders(resolved, new Map());
                    return Array.from(resolvedProviderMap.values());
                }
                function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
                    for (var i = 0; i < providers.length; i++) {
                        var provider = providers[i];
                        var existing = normalizedProvidersMap.get(provider.key.id);
                        if (existing) {
                            if (provider.multiProvider !== existing.multiProvider) {
                                throw new MixingMultiProvidersWithRegularProvidersError(existing, provider);
                            }
                            if (provider.multiProvider) {
                                for (var j = 0; j < provider.resolvedFactories.length; j++) {
                                    existing.resolvedFactories.push(provider.resolvedFactories[j]);
                                }
                            } else {
                                normalizedProvidersMap.set(provider.key.id, provider);
                            }
                        } else {
                            var resolvedProvider = void 0;
                            if (provider.multiProvider) {
                                resolvedProvider = new ResolvedReflectiveProvider_(provider.key, provider.resolvedFactories.slice(), provider.multiProvider);
                            } else {
                                resolvedProvider = provider;
                            }
                            normalizedProvidersMap.set(provider.key.id, resolvedProvider);
                        }
                    }
                    return normalizedProvidersMap;
                }
                function _normalizeProviders(providers, res) {
                    providers.forEach(function(b) {
                        if (b instanceof Type) {
                            res.push({
                                provide: b,
                                useClass: b
                            });
                        } else if (b && typeof b == "object" && b.provide !== undefined) {
                            res.push(b);
                        } else if (b instanceof Array) {
                            _normalizeProviders(b, res);
                        } else {
                            throw new InvalidProviderError(b);
                        }
                    });
                    return res;
                }
                function constructDependencies(typeOrFunc, dependencies) {
                    if (!dependencies) {
                        return _dependenciesFor(typeOrFunc);
                    } else {
                        var params_1 = dependencies.map(function(t) {
                            return [ t ];
                        });
                        return dependencies.map(function(t) {
                            return _extractToken(typeOrFunc, t, params_1);
                        });
                    }
                }
                function _dependenciesFor(typeOrFunc) {
                    var params = reflector.parameters(typeOrFunc);
                    if (!params) return [];
                    if (params.some(function(p) {
                        return p == null;
                    })) {
                        throw new NoAnnotationError(typeOrFunc, params);
                    }
                    return params.map(function(p) {
                        return _extractToken(typeOrFunc, p, params);
                    });
                }
                function _extractToken(typeOrFunc, metadata, params) {
                    var token = null;
                    var optional = false;
                    if (!Array.isArray(metadata)) {
                        if (metadata instanceof Inject) {
                            return _createDependency(metadata.token, optional, null);
                        } else {
                            return _createDependency(metadata, optional, null);
                        }
                    }
                    var visibility = null;
                    for (var i = 0; i < metadata.length; ++i) {
                        var paramMetadata = metadata[i];
                        if (paramMetadata instanceof Type) {
                            token = paramMetadata;
                        } else if (paramMetadata instanceof Inject) {
                            token = paramMetadata.token;
                        } else if (paramMetadata instanceof Optional) {
                            optional = true;
                        } else if (paramMetadata instanceof Self || paramMetadata instanceof SkipSelf) {
                            visibility = paramMetadata;
                        }
                    }
                    token = resolveForwardRef(token);
                    if (token != null) {
                        return _createDependency(token, optional, visibility);
                    } else {
                        throw new NoAnnotationError(typeOrFunc, params);
                    }
                }
                function _createDependency(token, optional, visibility) {
                    return new ReflectiveDependency(ReflectiveKey.get(token), optional, visibility);
                }
                var UNDEFINED = new Object();
                var ReflectiveInjector = function() {
                    function ReflectiveInjector() {}
                    ReflectiveInjector.resolve = function(providers) {
                        return resolveReflectiveProviders(providers);
                    };
                    ReflectiveInjector.resolveAndCreate = function(providers, parent) {
                        if (parent === void 0) {
                            parent = null;
                        }
                        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
                        return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
                    };
                    ReflectiveInjector.fromResolvedProviders = function(providers, parent) {
                        if (parent === void 0) {
                            parent = null;
                        }
                        return new ReflectiveInjector_(providers, parent);
                    };
                    ReflectiveInjector.prototype.parent = function() {};
                    ReflectiveInjector.prototype.resolveAndCreateChild = function(providers) {};
                    ReflectiveInjector.prototype.createChildFromResolved = function(providers) {};
                    ReflectiveInjector.prototype.resolveAndInstantiate = function(provider) {};
                    ReflectiveInjector.prototype.instantiateResolved = function(provider) {};
                    ReflectiveInjector.prototype.get = function(token, notFoundValue) {};
                    return ReflectiveInjector;
                }();
                var ReflectiveInjector_ = function() {
                    function ReflectiveInjector_(_providers, _parent) {
                        if (_parent === void 0) {
                            _parent = null;
                        }
                        this._constructionCounter = 0;
                        this._providers = _providers;
                        this._parent = _parent;
                        var len = _providers.length;
                        this.keyIds = new Array(len);
                        this.objs = new Array(len);
                        for (var i = 0; i < len; i++) {
                            this.keyIds[i] = _providers[i].key.id;
                            this.objs[i] = UNDEFINED;
                        }
                    }
                    ReflectiveInjector_.prototype.get = function(token, notFoundValue) {
                        if (notFoundValue === void 0) {
                            notFoundValue = THROW_IF_NOT_FOUND;
                        }
                        return this._getByKey(ReflectiveKey.get(token), null, notFoundValue);
                    };
                    Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
                        get: function() {
                            return this._parent;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ReflectiveInjector_.prototype.resolveAndCreateChild = function(providers) {
                        var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
                        return this.createChildFromResolved(ResolvedReflectiveProviders);
                    };
                    ReflectiveInjector_.prototype.createChildFromResolved = function(providers) {
                        var inj = new ReflectiveInjector_(providers);
                        inj._parent = this;
                        return inj;
                    };
                    ReflectiveInjector_.prototype.resolveAndInstantiate = function(provider) {
                        return this.instantiateResolved(ReflectiveInjector.resolve([ provider ])[0]);
                    };
                    ReflectiveInjector_.prototype.instantiateResolved = function(provider) {
                        return this._instantiateProvider(provider);
                    };
                    ReflectiveInjector_.prototype.getProviderAtIndex = function(index) {
                        if (index < 0 || index >= this._providers.length) {
                            throw new OutOfBoundsError(index);
                        }
                        return this._providers[index];
                    };
                    ReflectiveInjector_.prototype._new = function(provider) {
                        if (this._constructionCounter++ > this._getMaxNumberOfObjects()) {
                            throw new CyclicDependencyError(this, provider.key);
                        }
                        return this._instantiateProvider(provider);
                    };
                    ReflectiveInjector_.prototype._getMaxNumberOfObjects = function() {
                        return this.objs.length;
                    };
                    ReflectiveInjector_.prototype._instantiateProvider = function(provider) {
                        if (provider.multiProvider) {
                            var res = new Array(provider.resolvedFactories.length);
                            for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                                res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
                            }
                            return res;
                        } else {
                            return this._instantiate(provider, provider.resolvedFactories[0]);
                        }
                    };
                    ReflectiveInjector_.prototype._instantiate = function(provider, ResolvedReflectiveFactory) {
                        var _this = this;
                        var factory = ResolvedReflectiveFactory.factory;
                        var deps;
                        try {
                            deps = ResolvedReflectiveFactory.dependencies.map(function(dep) {
                                return _this._getByReflectiveDependency(dep);
                            });
                        } catch (e) {
                            if (e instanceof AbstractProviderError || e instanceof InstantiationError) {
                                e.addKey(this, provider.key);
                            }
                            throw e;
                        }
                        var obj;
                        try {
                            obj = factory.apply(void 0, deps);
                        } catch (e) {
                            throw new InstantiationError(this, e, e.stack, provider.key);
                        }
                        return obj;
                    };
                    ReflectiveInjector_.prototype._getByReflectiveDependency = function(dep) {
                        return this._getByKey(dep.key, dep.visibility, dep.optional ? null : THROW_IF_NOT_FOUND);
                    };
                    ReflectiveInjector_.prototype._getByKey = function(key, visibility, notFoundValue) {
                        if (key === INJECTOR_KEY) {
                            return this;
                        }
                        if (visibility instanceof Self) {
                            return this._getByKeySelf(key, notFoundValue);
                        } else {
                            return this._getByKeyDefault(key, notFoundValue, visibility);
                        }
                    };
                    ReflectiveInjector_.prototype._getObjByKeyId = function(keyId) {
                        for (var i = 0; i < this.keyIds.length; i++) {
                            if (this.keyIds[i] === keyId) {
                                if (this.objs[i] === UNDEFINED) {
                                    this.objs[i] = this._new(this._providers[i]);
                                }
                                return this.objs[i];
                            }
                        }
                        return UNDEFINED;
                    };
                    ReflectiveInjector_.prototype._throwOrNull = function(key, notFoundValue) {
                        if (notFoundValue !== THROW_IF_NOT_FOUND) {
                            return notFoundValue;
                        } else {
                            throw new NoProviderError(this, key);
                        }
                    };
                    ReflectiveInjector_.prototype._getByKeySelf = function(key, notFoundValue) {
                        var obj = this._getObjByKeyId(key.id);
                        return obj !== UNDEFINED ? obj : this._throwOrNull(key, notFoundValue);
                    };
                    ReflectiveInjector_.prototype._getByKeyDefault = function(key, notFoundValue, visibility) {
                        var inj;
                        if (visibility instanceof SkipSelf) {
                            inj = this._parent;
                        } else {
                            inj = this;
                        }
                        while (inj instanceof ReflectiveInjector_) {
                            var inj_ = inj;
                            var obj = inj_._getObjByKeyId(key.id);
                            if (obj !== UNDEFINED) return obj;
                            inj = inj_._parent;
                        }
                        if (inj !== null) {
                            return inj.get(key.token, notFoundValue);
                        } else {
                            return this._throwOrNull(key, notFoundValue);
                        }
                    };
                    Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
                        get: function() {
                            var providers = _mapProviders(this, function(b) {
                                return ' "' + b.key.displayName + '" ';
                            }).join(", ");
                            return "ReflectiveInjector(providers: [" + providers + "])";
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ReflectiveInjector_.prototype.toString = function() {
                        return this.displayName;
                    };
                    return ReflectiveInjector_;
                }();
                var INJECTOR_KEY = ReflectiveKey.get(Injector);
                function _mapProviders(injector, fn) {
                    var res = new Array(injector._providers.length);
                    for (var i = 0; i < injector._providers.length; ++i) {
                        res[i] = fn(injector.getProviderAtIndex(i));
                    }
                    return res;
                }
                var ErrorHandler = function() {
                    function ErrorHandler(rethrowError) {
                        if (rethrowError === void 0) {
                            rethrowError = true;
                        }
                        this._console = console;
                        this.rethrowError = rethrowError;
                    }
                    ErrorHandler.prototype.handleError = function(error) {
                        var originalError = this._findOriginalError(error);
                        var originalStack = this._findOriginalStack(error);
                        var context = this._findContext(error);
                        this._console.error("EXCEPTION: " + this._extractMessage(error));
                        if (originalError) {
                            this._console.error("ORIGINAL EXCEPTION: " + this._extractMessage(originalError));
                        }
                        if (originalStack) {
                            this._console.error("ORIGINAL STACKTRACE:");
                            this._console.error(originalStack);
                        }
                        if (context) {
                            this._console.error("ERROR CONTEXT:");
                            this._console.error(context);
                        }
                        if (this.rethrowError) throw error;
                    };
                    ErrorHandler.prototype._extractMessage = function(error) {
                        return error instanceof Error ? error.message : error.toString();
                    };
                    ErrorHandler.prototype._findContext = function(error) {
                        if (error) {
                            return error.context ? error.context : this._findContext(error.originalError);
                        }
                        return null;
                    };
                    ErrorHandler.prototype._findOriginalError = function(error) {
                        var e = error.originalError;
                        while (e && e.originalError) {
                            e = e.originalError;
                        }
                        return e;
                    };
                    ErrorHandler.prototype._findOriginalStack = function(error) {
                        if (!(error instanceof Error)) return null;
                        var e = error;
                        var stack = e.stack;
                        while (e instanceof Error && e.originalError) {
                            e = e.originalError;
                            if (e instanceof Error && e.stack) {
                                stack = e.stack;
                            }
                        }
                        return stack;
                    };
                    return ErrorHandler;
                }();
                var StringMapWrapper = function() {
                    function StringMapWrapper() {}
                    StringMapWrapper.merge = function(m1, m2) {
                        var m = {};
                        for (var _i = 0, _a = Object.keys(m1); _i < _a.length; _i++) {
                            var k = _a[_i];
                            m[k] = m1[k];
                        }
                        for (var _b = 0, _c = Object.keys(m2); _b < _c.length; _b++) {
                            var k = _c[_b];
                            m[k] = m2[k];
                        }
                        return m;
                    };
                    StringMapWrapper.equals = function(m1, m2) {
                        var k1 = Object.keys(m1);
                        var k2 = Object.keys(m2);
                        if (k1.length != k2.length) {
                            return false;
                        }
                        for (var i = 0; i < k1.length; i++) {
                            var key = k1[i];
                            if (m1[key] !== m2[key]) {
                                return false;
                            }
                        }
                        return true;
                    };
                    return StringMapWrapper;
                }();
                var ListWrapper = function() {
                    function ListWrapper() {}
                    ListWrapper.findLast = function(arr, condition) {
                        for (var i = arr.length - 1; i >= 0; i--) {
                            if (condition(arr[i])) {
                                return arr[i];
                            }
                        }
                        return null;
                    };
                    ListWrapper.removeAll = function(list, items) {
                        for (var i = 0; i < items.length; ++i) {
                            var index = list.indexOf(items[i]);
                            if (index > -1) {
                                list.splice(index, 1);
                            }
                        }
                    };
                    ListWrapper.remove = function(list, el) {
                        var index = list.indexOf(el);
                        if (index > -1) {
                            list.splice(index, 1);
                            return true;
                        }
                        return false;
                    };
                    ListWrapper.equals = function(a, b) {
                        if (a.length != b.length) return false;
                        for (var i = 0; i < a.length; ++i) {
                            if (a[i] !== b[i]) return false;
                        }
                        return true;
                    };
                    ListWrapper.flatten = function(list) {
                        return list.reduce(function(flat, item) {
                            var flatItem = Array.isArray(item) ? ListWrapper.flatten(item) : item;
                            return flat.concat(flatItem);
                        }, []);
                    };
                    return ListWrapper;
                }();
                function isListLikeIterable(obj) {
                    if (!isJsObject(obj)) return false;
                    return Array.isArray(obj) || !(obj instanceof Map) && getSymbolIterator() in obj;
                }
                function areIterablesEqual(a, b, comparator) {
                    var iterator1 = a[getSymbolIterator()]();
                    var iterator2 = b[getSymbolIterator()]();
                    while (true) {
                        var item1 = iterator1.next();
                        var item2 = iterator2.next();
                        if (item1.done && item2.done) return true;
                        if (item1.done || item2.done) return false;
                        if (!comparator(item1.value, item2.value)) return false;
                    }
                }
                function iterateListLike(obj, fn) {
                    if (Array.isArray(obj)) {
                        for (var i = 0; i < obj.length; i++) {
                            fn(obj[i]);
                        }
                    } else {
                        var iterator = obj[getSymbolIterator()]();
                        var item = void 0;
                        while (!(item = iterator.next()).done) {
                            fn(item.value);
                        }
                    }
                }
                function isPromise(obj) {
                    return !!obj && typeof obj.then === "function";
                }
                function isObservable(obj) {
                    return !!(obj && obj[rxjs_symbol_observable.$$observable]);
                }
                var APP_INITIALIZER = new OpaqueToken("Application Initializer");
                var ApplicationInitStatus = function() {
                    function ApplicationInitStatus(appInits) {
                        var _this = this;
                        this._done = false;
                        var asyncInitPromises = [];
                        if (appInits) {
                            for (var i = 0; i < appInits.length; i++) {
                                var initResult = appInits[i]();
                                if (isPromise(initResult)) {
                                    asyncInitPromises.push(initResult);
                                }
                            }
                        }
                        this._donePromise = Promise.all(asyncInitPromises).then(function() {
                            _this._done = true;
                        });
                        if (asyncInitPromises.length === 0) {
                            this._done = true;
                        }
                    }
                    Object.defineProperty(ApplicationInitStatus.prototype, "done", {
                        get: function() {
                            return this._done;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ApplicationInitStatus.prototype, "donePromise", {
                        get: function() {
                            return this._donePromise;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ApplicationInitStatus.decorators = [ {
                        type: Injectable
                    } ];
                    ApplicationInitStatus.ctorParameters = function() {
                        return [ {
                            type: Array,
                            decorators: [ {
                                type: Inject,
                                args: [ APP_INITIALIZER ]
                            }, {
                                type: Optional
                            } ]
                        } ];
                    };
                    return ApplicationInitStatus;
                }();
                var APP_ID = new OpaqueToken("AppId");
                function _appIdRandomProviderFactory() {
                    return "" + _randomChar() + _randomChar() + _randomChar();
                }
                var APP_ID_RANDOM_PROVIDER = {
                    provide: APP_ID,
                    useFactory: _appIdRandomProviderFactory,
                    deps: []
                };
                function _randomChar() {
                    return String.fromCharCode(97 + Math.floor(Math.random() * 25));
                }
                var PLATFORM_INITIALIZER = new OpaqueToken("Platform Initializer");
                var APP_BOOTSTRAP_LISTENER = new OpaqueToken("appBootstrapListener");
                var PACKAGE_ROOT_URL = new OpaqueToken("Application Packages Root URL");
                var Console = function() {
                    function Console() {}
                    Console.prototype.log = function(message) {
                        print(message);
                    };
                    Console.prototype.warn = function(message) {
                        warn(message);
                    };
                    Console.decorators = [ {
                        type: Injectable
                    } ];
                    Console.ctorParameters = function() {
                        return [];
                    };
                    return Console;
                }();
                var __extends$4 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var ComponentStillLoadingError = function(_super) {
                    __extends$4(ComponentStillLoadingError, _super);
                    function ComponentStillLoadingError(compType) {
                        _super.call(this, "Can't compile synchronously as " + stringify(compType) + " is still being loaded!");
                        this.compType = compType;
                    }
                    return ComponentStillLoadingError;
                }(BaseError);
                var ModuleWithComponentFactories = function() {
                    function ModuleWithComponentFactories(ngModuleFactory, componentFactories) {
                        this.ngModuleFactory = ngModuleFactory;
                        this.componentFactories = componentFactories;
                    }
                    return ModuleWithComponentFactories;
                }();
                function _throwError() {
                    throw new Error("Runtime compiler is not loaded");
                }
                var Compiler = function() {
                    function Compiler() {}
                    Compiler.prototype.compileModuleSync = function(moduleType) {
                        throw _throwError();
                    };
                    Compiler.prototype.compileModuleAsync = function(moduleType) {
                        throw _throwError();
                    };
                    Compiler.prototype.compileModuleAndAllComponentsSync = function(moduleType) {
                        throw _throwError();
                    };
                    Compiler.prototype.compileModuleAndAllComponentsAsync = function(moduleType) {
                        throw _throwError();
                    };
                    Compiler.prototype.getNgContentSelectors = function(component) {
                        throw _throwError();
                    };
                    Compiler.prototype.clearCache = function() {};
                    Compiler.prototype.clearCacheFor = function(type) {};
                    Compiler.decorators = [ {
                        type: Injectable
                    } ];
                    Compiler.ctorParameters = function() {
                        return [];
                    };
                    return Compiler;
                }();
                var COMPILER_OPTIONS = new OpaqueToken("compilerOptions");
                var CompilerFactory = function() {
                    function CompilerFactory() {}
                    CompilerFactory.prototype.createCompiler = function(options) {};
                    return CompilerFactory;
                }();
                var ElementRef = function() {
                    function ElementRef(nativeElement) {
                        this.nativeElement = nativeElement;
                    }
                    return ElementRef;
                }();
                var __extends$6 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var EventEmitter = function(_super) {
                    __extends$6(EventEmitter, _super);
                    function EventEmitter(isAsync) {
                        if (isAsync === void 0) {
                            isAsync = false;
                        }
                        _super.call(this);
                        this.__isAsync = isAsync;
                    }
                    EventEmitter.prototype.emit = function(value) {
                        _super.prototype.next.call(this, value);
                    };
                    EventEmitter.prototype.subscribe = function(generatorOrNext, error, complete) {
                        var schedulerFn;
                        var errorFn = function(err) {
                            return null;
                        };
                        var completeFn = function() {
                            return null;
                        };
                        if (generatorOrNext && typeof generatorOrNext === "object") {
                            schedulerFn = this.__isAsync ? function(value) {
                                setTimeout(function() {
                                    return generatorOrNext.next(value);
                                });
                            } : function(value) {
                                generatorOrNext.next(value);
                            };
                            if (generatorOrNext.error) {
                                errorFn = this.__isAsync ? function(err) {
                                    setTimeout(function() {
                                        return generatorOrNext.error(err);
                                    });
                                } : function(err) {
                                    generatorOrNext.error(err);
                                };
                            }
                            if (generatorOrNext.complete) {
                                completeFn = this.__isAsync ? function() {
                                    setTimeout(function() {
                                        return generatorOrNext.complete();
                                    });
                                } : function() {
                                    generatorOrNext.complete();
                                };
                            }
                        } else {
                            schedulerFn = this.__isAsync ? function(value) {
                                setTimeout(function() {
                                    return generatorOrNext(value);
                                });
                            } : function(value) {
                                generatorOrNext(value);
                            };
                            if (error) {
                                errorFn = this.__isAsync ? function(err) {
                                    setTimeout(function() {
                                        return error(err);
                                    });
                                } : function(err) {
                                    error(err);
                                };
                            }
                            if (complete) {
                                completeFn = this.__isAsync ? function() {
                                    setTimeout(function() {
                                        return complete();
                                    });
                                } : function() {
                                    complete();
                                };
                            }
                        }
                        return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
                    };
                    return EventEmitter;
                }(rxjs_Subject.Subject);
                var NgZone = function() {
                    function NgZone(_a) {
                        var _b = _a.enableLongStackTrace, enableLongStackTrace = _b === void 0 ? false : _b;
                        this._hasPendingMicrotasks = false;
                        this._hasPendingMacrotasks = false;
                        this._isStable = true;
                        this._nesting = 0;
                        this._onUnstable = new EventEmitter(false);
                        this._onMicrotaskEmpty = new EventEmitter(false);
                        this._onStable = new EventEmitter(false);
                        this._onErrorEvents = new EventEmitter(false);
                        if (typeof Zone == "undefined") {
                            throw new Error("Angular requires Zone.js prolyfill.");
                        }
                        Zone.assertZonePatched();
                        this.outer = this.inner = Zone.current;
                        if (Zone["wtfZoneSpec"]) {
                            this.inner = this.inner.fork(Zone["wtfZoneSpec"]);
                        }
                        if (enableLongStackTrace && Zone["longStackTraceZoneSpec"]) {
                            this.inner = this.inner.fork(Zone["longStackTraceZoneSpec"]);
                        }
                        this.forkInnerZoneWithAngularBehavior();
                    }
                    NgZone.isInAngularZone = function() {
                        return Zone.current.get("isAngularZone") === true;
                    };
                    NgZone.assertInAngularZone = function() {
                        if (!NgZone.isInAngularZone()) {
                            throw new Error("Expected to be in Angular Zone, but it is not!");
                        }
                    };
                    NgZone.assertNotInAngularZone = function() {
                        if (NgZone.isInAngularZone()) {
                            throw new Error("Expected to not be in Angular Zone, but it is!");
                        }
                    };
                    NgZone.prototype.run = function(fn) {
                        return this.inner.run(fn);
                    };
                    NgZone.prototype.runGuarded = function(fn) {
                        return this.inner.runGuarded(fn);
                    };
                    NgZone.prototype.runOutsideAngular = function(fn) {
                        return this.outer.run(fn);
                    };
                    Object.defineProperty(NgZone.prototype, "onUnstable", {
                        get: function() {
                            return this._onUnstable;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "onMicrotaskEmpty", {
                        get: function() {
                            return this._onMicrotaskEmpty;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "onStable", {
                        get: function() {
                            return this._onStable;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "onError", {
                        get: function() {
                            return this._onErrorEvents;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "isStable", {
                        get: function() {
                            return this._isStable;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "hasPendingMicrotasks", {
                        get: function() {
                            return this._hasPendingMicrotasks;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgZone.prototype, "hasPendingMacrotasks", {
                        get: function() {
                            return this._hasPendingMacrotasks;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgZone.prototype.checkStable = function() {
                        var _this = this;
                        if (this._nesting == 0 && !this._hasPendingMicrotasks && !this._isStable) {
                            try {
                                this._nesting++;
                                this._onMicrotaskEmpty.emit(null);
                            } finally {
                                this._nesting--;
                                if (!this._hasPendingMicrotasks) {
                                    try {
                                        this.runOutsideAngular(function() {
                                            return _this._onStable.emit(null);
                                        });
                                    } finally {
                                        this._isStable = true;
                                    }
                                }
                            }
                        }
                    };
                    NgZone.prototype.forkInnerZoneWithAngularBehavior = function() {
                        var _this = this;
                        this.inner = this.inner.fork({
                            name: "angular",
                            properties: {
                                isAngularZone: true
                            },
                            onInvokeTask: function(delegate, current, target, task, applyThis, applyArgs) {
                                try {
                                    _this.onEnter();
                                    return delegate.invokeTask(target, task, applyThis, applyArgs);
                                } finally {
                                    _this.onLeave();
                                }
                            },
                            onInvoke: function(delegate, current, target, callback, applyThis, applyArgs, source) {
                                try {
                                    _this.onEnter();
                                    return delegate.invoke(target, callback, applyThis, applyArgs, source);
                                } finally {
                                    _this.onLeave();
                                }
                            },
                            onHasTask: function(delegate, current, target, hasTaskState) {
                                delegate.hasTask(target, hasTaskState);
                                if (current === target) {
                                    if (hasTaskState.change == "microTask") {
                                        _this.setHasMicrotask(hasTaskState.microTask);
                                    } else if (hasTaskState.change == "macroTask") {
                                        _this.setHasMacrotask(hasTaskState.macroTask);
                                    }
                                }
                            },
                            onHandleError: function(delegate, current, target, error) {
                                delegate.handleError(target, error);
                                _this.triggerError(error);
                                return false;
                            }
                        });
                    };
                    NgZone.prototype.onEnter = function() {
                        this._nesting++;
                        if (this._isStable) {
                            this._isStable = false;
                            this._onUnstable.emit(null);
                        }
                    };
                    NgZone.prototype.onLeave = function() {
                        this._nesting--;
                        this.checkStable();
                    };
                    NgZone.prototype.setHasMicrotask = function(hasMicrotasks) {
                        this._hasPendingMicrotasks = hasMicrotasks;
                        this.checkStable();
                    };
                    NgZone.prototype.setHasMacrotask = function(hasMacrotasks) {
                        this._hasPendingMacrotasks = hasMacrotasks;
                    };
                    NgZone.prototype.triggerError = function(error) {
                        this._onErrorEvents.emit(error);
                    };
                    return NgZone;
                }();
                var AnimationQueue = function() {
                    function AnimationQueue(_zone) {
                        this._zone = _zone;
                        this.entries = [];
                    }
                    AnimationQueue.prototype.enqueue = function(player) {
                        this.entries.push(player);
                    };
                    AnimationQueue.prototype.flush = function() {
                        var _this = this;
                        if (this.entries.length) {
                            this._zone.runOutsideAngular(function() {
                                Promise.resolve(null).then(function() {
                                    return _this._triggerAnimations();
                                });
                            });
                        }
                    };
                    AnimationQueue.prototype._triggerAnimations = function() {
                        NgZone.assertNotInAngularZone();
                        while (this.entries.length) {
                            var player = this.entries.shift();
                            if (!player.hasStarted()) {
                                player.play();
                            }
                        }
                    };
                    AnimationQueue.decorators = [ {
                        type: Injectable
                    } ];
                    AnimationQueue.ctorParameters = function() {
                        return [ {
                            type: NgZone
                        } ];
                    };
                    return AnimationQueue;
                }();
                var DefaultIterableDifferFactory = function() {
                    function DefaultIterableDifferFactory() {}
                    DefaultIterableDifferFactory.prototype.supports = function(obj) {
                        return isListLikeIterable(obj);
                    };
                    DefaultIterableDifferFactory.prototype.create = function(cdRef, trackByFn) {
                        return new DefaultIterableDiffer(trackByFn);
                    };
                    return DefaultIterableDifferFactory;
                }();
                var trackByIdentity = function(index, item) {
                    return item;
                };
                var DefaultIterableDiffer = function() {
                    function DefaultIterableDiffer(_trackByFn) {
                        this._trackByFn = _trackByFn;
                        this._length = null;
                        this._collection = null;
                        this._linkedRecords = null;
                        this._unlinkedRecords = null;
                        this._previousItHead = null;
                        this._itHead = null;
                        this._itTail = null;
                        this._additionsHead = null;
                        this._additionsTail = null;
                        this._movesHead = null;
                        this._movesTail = null;
                        this._removalsHead = null;
                        this._removalsTail = null;
                        this._identityChangesHead = null;
                        this._identityChangesTail = null;
                        this._trackByFn = this._trackByFn || trackByIdentity;
                    }
                    Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
                        get: function() {
                            return this._collection;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
                        get: function() {
                            return this._length;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DefaultIterableDiffer.prototype.forEachItem = function(fn) {
                        var record;
                        for (record = this._itHead; record !== null; record = record._next) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachOperation = function(fn) {
                        var nextIt = this._itHead;
                        var nextRemove = this._removalsHead;
                        var addRemoveOffset = 0;
                        var moveOffsets = null;
                        while (nextIt || nextRemove) {
                            var record = !nextRemove || nextIt && nextIt.currentIndex < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets) ? nextIt : nextRemove;
                            var adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
                            var currentIndex = record.currentIndex;
                            if (record === nextRemove) {
                                addRemoveOffset--;
                                nextRemove = nextRemove._nextRemoved;
                            } else {
                                nextIt = nextIt._next;
                                if (record.previousIndex == null) {
                                    addRemoveOffset++;
                                } else {
                                    if (!moveOffsets) moveOffsets = [];
                                    var localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
                                    var localCurrentIndex = currentIndex - addRemoveOffset;
                                    if (localMovePreviousIndex != localCurrentIndex) {
                                        for (var i = 0; i < localMovePreviousIndex; i++) {
                                            var offset = i < moveOffsets.length ? moveOffsets[i] : moveOffsets[i] = 0;
                                            var index = offset + i;
                                            if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                                                moveOffsets[i] = offset + 1;
                                            }
                                        }
                                        var previousIndex = record.previousIndex;
                                        moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
                                    }
                                }
                            }
                            if (adjPreviousIndex !== currentIndex) {
                                fn(record, adjPreviousIndex, currentIndex);
                            }
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachPreviousItem = function(fn) {
                        var record;
                        for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachAddedItem = function(fn) {
                        var record;
                        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachMovedItem = function(fn) {
                        var record;
                        for (record = this._movesHead; record !== null; record = record._nextMoved) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachRemovedItem = function(fn) {
                        var record;
                        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.forEachIdentityChange = function(fn) {
                        var record;
                        for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
                            fn(record);
                        }
                    };
                    DefaultIterableDiffer.prototype.diff = function(collection) {
                        if (isBlank(collection)) collection = [];
                        if (!isListLikeIterable(collection)) {
                            throw new Error("Error trying to diff '" + collection + "'");
                        }
                        if (this.check(collection)) {
                            return this;
                        } else {
                            return null;
                        }
                    };
                    DefaultIterableDiffer.prototype.onDestroy = function() {};
                    DefaultIterableDiffer.prototype.check = function(collection) {
                        var _this = this;
                        this._reset();
                        var record = this._itHead;
                        var mayBeDirty = false;
                        var index;
                        var item;
                        var itemTrackBy;
                        if (Array.isArray(collection)) {
                            var list = collection;
                            this._length = collection.length;
                            for (var index_1 = 0; index_1 < this._length; index_1++) {
                                item = list[index_1];
                                itemTrackBy = this._trackByFn(index_1, item);
                                if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                                    record = this._mismatch(record, item, itemTrackBy, index_1);
                                    mayBeDirty = true;
                                } else {
                                    if (mayBeDirty) {
                                        record = this._verifyReinsertion(record, item, itemTrackBy, index_1);
                                    }
                                    if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
                                }
                                record = record._next;
                            }
                        } else {
                            index = 0;
                            iterateListLike(collection, function(item) {
                                itemTrackBy = _this._trackByFn(index, item);
                                if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                                    record = _this._mismatch(record, item, itemTrackBy, index);
                                    mayBeDirty = true;
                                } else {
                                    if (mayBeDirty) {
                                        record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                                    }
                                    if (!looseIdentical(record.item, item)) _this._addIdentityChange(record, item);
                                }
                                record = record._next;
                                index++;
                            });
                            this._length = index;
                        }
                        this._truncate(record);
                        this._collection = collection;
                        return this.isDirty;
                    };
                    Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
                        get: function() {
                            return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DefaultIterableDiffer.prototype._reset = function() {
                        if (this.isDirty) {
                            var record = void 0;
                            var nextRecord = void 0;
                            for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                                record._nextPrevious = record._next;
                            }
                            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                                record.previousIndex = record.currentIndex;
                            }
                            this._additionsHead = this._additionsTail = null;
                            for (record = this._movesHead; record !== null; record = nextRecord) {
                                record.previousIndex = record.currentIndex;
                                nextRecord = record._nextMoved;
                            }
                            this._movesHead = this._movesTail = null;
                            this._removalsHead = this._removalsTail = null;
                            this._identityChangesHead = this._identityChangesTail = null;
                        }
                    };
                    DefaultIterableDiffer.prototype._mismatch = function(record, item, itemTrackBy, index) {
                        var previousRecord;
                        if (record === null) {
                            previousRecord = this._itTail;
                        } else {
                            previousRecord = record._prev;
                            this._remove(record);
                        }
                        record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
                        if (record !== null) {
                            if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
                            this._moveAfter(record, previousRecord, index);
                        } else {
                            record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
                            if (record !== null) {
                                if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
                                this._reinsertAfter(record, previousRecord, index);
                            } else {
                                record = this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
                            }
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._verifyReinsertion = function(record, item, itemTrackBy, index) {
                        var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
                        if (reinsertRecord !== null) {
                            record = this._reinsertAfter(reinsertRecord, record._prev, index);
                        } else if (record.currentIndex != index) {
                            record.currentIndex = index;
                            this._addToMoves(record, index);
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._truncate = function(record) {
                        while (record !== null) {
                            var nextRecord = record._next;
                            this._addToRemovals(this._unlink(record));
                            record = nextRecord;
                        }
                        if (this._unlinkedRecords !== null) {
                            this._unlinkedRecords.clear();
                        }
                        if (this._additionsTail !== null) {
                            this._additionsTail._nextAdded = null;
                        }
                        if (this._movesTail !== null) {
                            this._movesTail._nextMoved = null;
                        }
                        if (this._itTail !== null) {
                            this._itTail._next = null;
                        }
                        if (this._removalsTail !== null) {
                            this._removalsTail._nextRemoved = null;
                        }
                        if (this._identityChangesTail !== null) {
                            this._identityChangesTail._nextIdentityChange = null;
                        }
                    };
                    DefaultIterableDiffer.prototype._reinsertAfter = function(record, prevRecord, index) {
                        if (this._unlinkedRecords !== null) {
                            this._unlinkedRecords.remove(record);
                        }
                        var prev = record._prevRemoved;
                        var next = record._nextRemoved;
                        if (prev === null) {
                            this._removalsHead = next;
                        } else {
                            prev._nextRemoved = next;
                        }
                        if (next === null) {
                            this._removalsTail = prev;
                        } else {
                            next._prevRemoved = prev;
                        }
                        this._insertAfter(record, prevRecord, index);
                        this._addToMoves(record, index);
                        return record;
                    };
                    DefaultIterableDiffer.prototype._moveAfter = function(record, prevRecord, index) {
                        this._unlink(record);
                        this._insertAfter(record, prevRecord, index);
                        this._addToMoves(record, index);
                        return record;
                    };
                    DefaultIterableDiffer.prototype._addAfter = function(record, prevRecord, index) {
                        this._insertAfter(record, prevRecord, index);
                        if (this._additionsTail === null) {
                            this._additionsTail = this._additionsHead = record;
                        } else {
                            this._additionsTail = this._additionsTail._nextAdded = record;
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._insertAfter = function(record, prevRecord, index) {
                        var next = prevRecord === null ? this._itHead : prevRecord._next;
                        record._next = next;
                        record._prev = prevRecord;
                        if (next === null) {
                            this._itTail = record;
                        } else {
                            next._prev = record;
                        }
                        if (prevRecord === null) {
                            this._itHead = record;
                        } else {
                            prevRecord._next = record;
                        }
                        if (this._linkedRecords === null) {
                            this._linkedRecords = new _DuplicateMap();
                        }
                        this._linkedRecords.put(record);
                        record.currentIndex = index;
                        return record;
                    };
                    DefaultIterableDiffer.prototype._remove = function(record) {
                        return this._addToRemovals(this._unlink(record));
                    };
                    DefaultIterableDiffer.prototype._unlink = function(record) {
                        if (this._linkedRecords !== null) {
                            this._linkedRecords.remove(record);
                        }
                        var prev = record._prev;
                        var next = record._next;
                        if (prev === null) {
                            this._itHead = next;
                        } else {
                            prev._next = next;
                        }
                        if (next === null) {
                            this._itTail = prev;
                        } else {
                            next._prev = prev;
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._addToMoves = function(record, toIndex) {
                        if (record.previousIndex === toIndex) {
                            return record;
                        }
                        if (this._movesTail === null) {
                            this._movesTail = this._movesHead = record;
                        } else {
                            this._movesTail = this._movesTail._nextMoved = record;
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._addToRemovals = function(record) {
                        if (this._unlinkedRecords === null) {
                            this._unlinkedRecords = new _DuplicateMap();
                        }
                        this._unlinkedRecords.put(record);
                        record.currentIndex = null;
                        record._nextRemoved = null;
                        if (this._removalsTail === null) {
                            this._removalsTail = this._removalsHead = record;
                            record._prevRemoved = null;
                        } else {
                            record._prevRemoved = this._removalsTail;
                            this._removalsTail = this._removalsTail._nextRemoved = record;
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype._addIdentityChange = function(record, item) {
                        record.item = item;
                        if (this._identityChangesTail === null) {
                            this._identityChangesTail = this._identityChangesHead = record;
                        } else {
                            this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
                        }
                        return record;
                    };
                    DefaultIterableDiffer.prototype.toString = function() {
                        var list = [];
                        this.forEachItem(function(record) {
                            return list.push(record);
                        });
                        var previous = [];
                        this.forEachPreviousItem(function(record) {
                            return previous.push(record);
                        });
                        var additions = [];
                        this.forEachAddedItem(function(record) {
                            return additions.push(record);
                        });
                        var moves = [];
                        this.forEachMovedItem(function(record) {
                            return moves.push(record);
                        });
                        var removals = [];
                        this.forEachRemovedItem(function(record) {
                            return removals.push(record);
                        });
                        var identityChanges = [];
                        this.forEachIdentityChange(function(record) {
                            return identityChanges.push(record);
                        });
                        return "collection: " + list.join(", ") + "\n" + "previous: " + previous.join(", ") + "\n" + "additions: " + additions.join(", ") + "\n" + "moves: " + moves.join(", ") + "\n" + "removals: " + removals.join(", ") + "\n" + "identityChanges: " + identityChanges.join(", ") + "\n";
                    };
                    return DefaultIterableDiffer;
                }();
                var CollectionChangeRecord = function() {
                    function CollectionChangeRecord(item, trackById) {
                        this.item = item;
                        this.trackById = trackById;
                        this.currentIndex = null;
                        this.previousIndex = null;
                        this._nextPrevious = null;
                        this._prev = null;
                        this._next = null;
                        this._prevDup = null;
                        this._nextDup = null;
                        this._prevRemoved = null;
                        this._nextRemoved = null;
                        this._nextAdded = null;
                        this._nextMoved = null;
                        this._nextIdentityChange = null;
                    }
                    CollectionChangeRecord.prototype.toString = function() {
                        return this.previousIndex === this.currentIndex ? stringify(this.item) : stringify(this.item) + "[" + stringify(this.previousIndex) + "->" + stringify(this.currentIndex) + "]";
                    };
                    return CollectionChangeRecord;
                }();
                var _DuplicateItemRecordList = function() {
                    function _DuplicateItemRecordList() {
                        this._head = null;
                        this._tail = null;
                    }
                    _DuplicateItemRecordList.prototype.add = function(record) {
                        if (this._head === null) {
                            this._head = this._tail = record;
                            record._nextDup = null;
                            record._prevDup = null;
                        } else {
                            this._tail._nextDup = record;
                            record._prevDup = this._tail;
                            record._nextDup = null;
                            this._tail = record;
                        }
                    };
                    _DuplicateItemRecordList.prototype.get = function(trackById, afterIndex) {
                        var record;
                        for (record = this._head; record !== null; record = record._nextDup) {
                            if ((afterIndex === null || afterIndex < record.currentIndex) && looseIdentical(record.trackById, trackById)) {
                                return record;
                            }
                        }
                        return null;
                    };
                    _DuplicateItemRecordList.prototype.remove = function(record) {
                        var prev = record._prevDup;
                        var next = record._nextDup;
                        if (prev === null) {
                            this._head = next;
                        } else {
                            prev._nextDup = next;
                        }
                        if (next === null) {
                            this._tail = prev;
                        } else {
                            next._prevDup = prev;
                        }
                        return this._head === null;
                    };
                    return _DuplicateItemRecordList;
                }();
                var _DuplicateMap = function() {
                    function _DuplicateMap() {
                        this.map = new Map();
                    }
                    _DuplicateMap.prototype.put = function(record) {
                        var key = record.trackById;
                        var duplicates = this.map.get(key);
                        if (!duplicates) {
                            duplicates = new _DuplicateItemRecordList();
                            this.map.set(key, duplicates);
                        }
                        duplicates.add(record);
                    };
                    _DuplicateMap.prototype.get = function(trackById, afterIndex) {
                        if (afterIndex === void 0) {
                            afterIndex = null;
                        }
                        var key = trackById;
                        var recordList = this.map.get(key);
                        return recordList ? recordList.get(trackById, afterIndex) : null;
                    };
                    _DuplicateMap.prototype.remove = function(record) {
                        var key = record.trackById;
                        var recordList = this.map.get(key);
                        if (recordList.remove(record)) {
                            this.map.delete(key);
                        }
                        return record;
                    };
                    Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
                        get: function() {
                            return this.map.size === 0;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    _DuplicateMap.prototype.clear = function() {
                        this.map.clear();
                    };
                    _DuplicateMap.prototype.toString = function() {
                        return "_DuplicateMap(" + stringify(this.map) + ")";
                    };
                    return _DuplicateMap;
                }();
                function getPreviousIndex(item, addRemoveOffset, moveOffsets) {
                    var previousIndex = item.previousIndex;
                    if (previousIndex === null) return previousIndex;
                    var moveOffset = 0;
                    if (moveOffsets && previousIndex < moveOffsets.length) {
                        moveOffset = moveOffsets[previousIndex];
                    }
                    return previousIndex + addRemoveOffset + moveOffset;
                }
                var DefaultKeyValueDifferFactory = function() {
                    function DefaultKeyValueDifferFactory() {}
                    DefaultKeyValueDifferFactory.prototype.supports = function(obj) {
                        return obj instanceof Map || isJsObject(obj);
                    };
                    DefaultKeyValueDifferFactory.prototype.create = function(cdRef) {
                        return new DefaultKeyValueDiffer();
                    };
                    return DefaultKeyValueDifferFactory;
                }();
                var DefaultKeyValueDiffer = function() {
                    function DefaultKeyValueDiffer() {
                        this._records = new Map();
                        this._mapHead = null;
                        this._previousMapHead = null;
                        this._changesHead = null;
                        this._changesTail = null;
                        this._additionsHead = null;
                        this._additionsTail = null;
                        this._removalsHead = null;
                        this._removalsTail = null;
                    }
                    Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
                        get: function() {
                            return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DefaultKeyValueDiffer.prototype.forEachItem = function(fn) {
                        var record;
                        for (record = this._mapHead; record !== null; record = record._next) {
                            fn(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype.forEachPreviousItem = function(fn) {
                        var record;
                        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                            fn(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype.forEachChangedItem = function(fn) {
                        var record;
                        for (record = this._changesHead; record !== null; record = record._nextChanged) {
                            fn(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype.forEachAddedItem = function(fn) {
                        var record;
                        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                            fn(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype.forEachRemovedItem = function(fn) {
                        var record;
                        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                            fn(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype.diff = function(map) {
                        if (!map) {
                            map = new Map();
                        } else if (!(map instanceof Map || isJsObject(map))) {
                            throw new Error("Error trying to diff '" + map + "'");
                        }
                        return this.check(map) ? this : null;
                    };
                    DefaultKeyValueDiffer.prototype.onDestroy = function() {};
                    DefaultKeyValueDiffer.prototype.check = function(map) {
                        var _this = this;
                        this._reset();
                        var records = this._records;
                        var oldSeqRecord = this._mapHead;
                        var lastOldSeqRecord = null;
                        var lastNewSeqRecord = null;
                        var seqChanged = false;
                        this._forEach(map, function(value, key) {
                            var newSeqRecord;
                            if (oldSeqRecord && key === oldSeqRecord.key) {
                                newSeqRecord = oldSeqRecord;
                                _this._maybeAddToChanges(newSeqRecord, value);
                            } else {
                                seqChanged = true;
                                if (oldSeqRecord !== null) {
                                    _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                                    _this._addToRemovals(oldSeqRecord);
                                }
                                if (records.has(key)) {
                                    newSeqRecord = records.get(key);
                                    _this._maybeAddToChanges(newSeqRecord, value);
                                } else {
                                    newSeqRecord = new KeyValueChangeRecord(key);
                                    records.set(key, newSeqRecord);
                                    newSeqRecord.currentValue = value;
                                    _this._addToAdditions(newSeqRecord);
                                }
                            }
                            if (seqChanged) {
                                if (_this._isInRemovals(newSeqRecord)) {
                                    _this._removeFromRemovals(newSeqRecord);
                                }
                                if (lastNewSeqRecord == null) {
                                    _this._mapHead = newSeqRecord;
                                } else {
                                    lastNewSeqRecord._next = newSeqRecord;
                                }
                            }
                            lastOldSeqRecord = oldSeqRecord;
                            lastNewSeqRecord = newSeqRecord;
                            oldSeqRecord = oldSeqRecord && oldSeqRecord._next;
                        });
                        this._truncate(lastOldSeqRecord, oldSeqRecord);
                        return this.isDirty;
                    };
                    DefaultKeyValueDiffer.prototype._reset = function() {
                        if (this.isDirty) {
                            var record = void 0;
                            for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                                record._nextPrevious = record._next;
                            }
                            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                                record.previousValue = record.currentValue;
                            }
                            for (record = this._additionsHead; record != null; record = record._nextAdded) {
                                record.previousValue = record.currentValue;
                            }
                            this._changesHead = this._changesTail = null;
                            this._additionsHead = this._additionsTail = null;
                            this._removalsHead = this._removalsTail = null;
                        }
                    };
                    DefaultKeyValueDiffer.prototype._truncate = function(lastRecord, record) {
                        while (record !== null) {
                            if (lastRecord === null) {
                                this._mapHead = null;
                            } else {
                                lastRecord._next = null;
                            }
                            var nextRecord = record._next;
                            this._addToRemovals(record);
                            lastRecord = record;
                            record = nextRecord;
                        }
                        for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
                            rec.previousValue = rec.currentValue;
                            rec.currentValue = null;
                            this._records.delete(rec.key);
                        }
                    };
                    DefaultKeyValueDiffer.prototype._maybeAddToChanges = function(record, newValue) {
                        if (!looseIdentical(newValue, record.currentValue)) {
                            record.previousValue = record.currentValue;
                            record.currentValue = newValue;
                            this._addToChanges(record);
                        }
                    };
                    DefaultKeyValueDiffer.prototype._isInRemovals = function(record) {
                        return record === this._removalsHead || record._nextRemoved !== null || record._prevRemoved !== null;
                    };
                    DefaultKeyValueDiffer.prototype._addToRemovals = function(record) {
                        if (this._removalsHead === null) {
                            this._removalsHead = this._removalsTail = record;
                        } else {
                            this._removalsTail._nextRemoved = record;
                            record._prevRemoved = this._removalsTail;
                            this._removalsTail = record;
                        }
                    };
                    DefaultKeyValueDiffer.prototype._removeFromSeq = function(prev, record) {
                        var next = record._next;
                        if (prev === null) {
                            this._mapHead = next;
                        } else {
                            prev._next = next;
                        }
                        record._next = null;
                    };
                    DefaultKeyValueDiffer.prototype._removeFromRemovals = function(record) {
                        var prev = record._prevRemoved;
                        var next = record._nextRemoved;
                        if (prev === null) {
                            this._removalsHead = next;
                        } else {
                            prev._nextRemoved = next;
                        }
                        if (next === null) {
                            this._removalsTail = prev;
                        } else {
                            next._prevRemoved = prev;
                        }
                        record._prevRemoved = record._nextRemoved = null;
                    };
                    DefaultKeyValueDiffer.prototype._addToAdditions = function(record) {
                        if (this._additionsHead === null) {
                            this._additionsHead = this._additionsTail = record;
                        } else {
                            this._additionsTail._nextAdded = record;
                            this._additionsTail = record;
                        }
                    };
                    DefaultKeyValueDiffer.prototype._addToChanges = function(record) {
                        if (this._changesHead === null) {
                            this._changesHead = this._changesTail = record;
                        } else {
                            this._changesTail._nextChanged = record;
                            this._changesTail = record;
                        }
                    };
                    DefaultKeyValueDiffer.prototype.toString = function() {
                        var items = [];
                        var previous = [];
                        var changes = [];
                        var additions = [];
                        var removals = [];
                        var record;
                        for (record = this._mapHead; record !== null; record = record._next) {
                            items.push(stringify(record));
                        }
                        for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                            previous.push(stringify(record));
                        }
                        for (record = this._changesHead; record !== null; record = record._nextChanged) {
                            changes.push(stringify(record));
                        }
                        for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                            additions.push(stringify(record));
                        }
                        for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                            removals.push(stringify(record));
                        }
                        return "map: " + items.join(", ") + "\n" + "previous: " + previous.join(", ") + "\n" + "additions: " + additions.join(", ") + "\n" + "changes: " + changes.join(", ") + "\n" + "removals: " + removals.join(", ") + "\n";
                    };
                    DefaultKeyValueDiffer.prototype._forEach = function(obj, fn) {
                        if (obj instanceof Map) {
                            obj.forEach(fn);
                        } else {
                            Object.keys(obj).forEach(function(k) {
                                return fn(obj[k], k);
                            });
                        }
                    };
                    return DefaultKeyValueDiffer;
                }();
                var KeyValueChangeRecord = function() {
                    function KeyValueChangeRecord(key) {
                        this.key = key;
                        this.previousValue = null;
                        this.currentValue = null;
                        this._nextPrevious = null;
                        this._next = null;
                        this._nextAdded = null;
                        this._nextRemoved = null;
                        this._prevRemoved = null;
                        this._nextChanged = null;
                    }
                    KeyValueChangeRecord.prototype.toString = function() {
                        return looseIdentical(this.previousValue, this.currentValue) ? stringify(this.key) : stringify(this.key) + "[" + stringify(this.previousValue) + "->" + stringify(this.currentValue) + "]";
                    };
                    return KeyValueChangeRecord;
                }();
                var IterableDiffers = function() {
                    function IterableDiffers(factories) {
                        this.factories = factories;
                    }
                    IterableDiffers.create = function(factories, parent) {
                        if (isPresent(parent)) {
                            var copied = parent.factories.slice();
                            factories = factories.concat(copied);
                            return new IterableDiffers(factories);
                        } else {
                            return new IterableDiffers(factories);
                        }
                    };
                    IterableDiffers.extend = function(factories) {
                        return {
                            provide: IterableDiffers,
                            useFactory: function(parent) {
                                if (!parent) {
                                    throw new Error("Cannot extend IterableDiffers without a parent injector");
                                }
                                return IterableDiffers.create(factories, parent);
                            },
                            deps: [ [ IterableDiffers, new SkipSelf(), new Optional() ] ]
                        };
                    };
                    IterableDiffers.prototype.find = function(iterable) {
                        var factory = this.factories.find(function(f) {
                            return f.supports(iterable);
                        });
                        if (isPresent(factory)) {
                            return factory;
                        } else {
                            throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
                        }
                    };
                    return IterableDiffers;
                }();
                var KeyValueDiffers = function() {
                    function KeyValueDiffers(factories) {
                        this.factories = factories;
                    }
                    KeyValueDiffers.create = function(factories, parent) {
                        if (isPresent(parent)) {
                            var copied = parent.factories.slice();
                            factories = factories.concat(copied);
                            return new KeyValueDiffers(factories);
                        } else {
                            return new KeyValueDiffers(factories);
                        }
                    };
                    KeyValueDiffers.extend = function(factories) {
                        return {
                            provide: KeyValueDiffers,
                            useFactory: function(parent) {
                                if (!parent) {
                                    throw new Error("Cannot extend KeyValueDiffers without a parent injector");
                                }
                                return KeyValueDiffers.create(factories, parent);
                            },
                            deps: [ [ KeyValueDiffers, new SkipSelf(), new Optional() ] ]
                        };
                    };
                    KeyValueDiffers.prototype.find = function(kv) {
                        var factory = this.factories.find(function(f) {
                            return f.supports(kv);
                        });
                        if (isPresent(factory)) {
                            return factory;
                        } else {
                            throw new Error("Cannot find a differ supporting object '" + kv + "'");
                        }
                    };
                    return KeyValueDiffers;
                }();
                var UNINITIALIZED = {
                    toString: function() {
                        return "CD_INIT_VALUE";
                    }
                };
                function devModeEqual(a, b) {
                    if (isListLikeIterable(a) && isListLikeIterable(b)) {
                        return areIterablesEqual(a, b, devModeEqual);
                    } else if (!isListLikeIterable(a) && !isPrimitive(a) && !isListLikeIterable(b) && !isPrimitive(b)) {
                        return true;
                    } else {
                        return looseIdentical(a, b);
                    }
                }
                var WrappedValue = function() {
                    function WrappedValue(wrapped) {
                        this.wrapped = wrapped;
                    }
                    WrappedValue.wrap = function(value) {
                        return new WrappedValue(value);
                    };
                    return WrappedValue;
                }();
                var ValueUnwrapper = function() {
                    function ValueUnwrapper() {
                        this.hasWrappedValue = false;
                    }
                    ValueUnwrapper.prototype.unwrap = function(value) {
                        if (value instanceof WrappedValue) {
                            this.hasWrappedValue = true;
                            return value.wrapped;
                        }
                        return value;
                    };
                    ValueUnwrapper.prototype.reset = function() {
                        this.hasWrappedValue = false;
                    };
                    return ValueUnwrapper;
                }();
                var SimpleChange = function() {
                    function SimpleChange(previousValue, currentValue) {
                        this.previousValue = previousValue;
                        this.currentValue = currentValue;
                    }
                    SimpleChange.prototype.isFirstChange = function() {
                        return this.previousValue === UNINITIALIZED;
                    };
                    return SimpleChange;
                }();
                var ChangeDetectorRef = function() {
                    function ChangeDetectorRef() {}
                    ChangeDetectorRef.prototype.markForCheck = function() {};
                    ChangeDetectorRef.prototype.detach = function() {};
                    ChangeDetectorRef.prototype.detectChanges = function() {};
                    ChangeDetectorRef.prototype.checkNoChanges = function() {};
                    ChangeDetectorRef.prototype.reattach = function() {};
                    return ChangeDetectorRef;
                }();
                var keyValDiff = [ new DefaultKeyValueDifferFactory() ];
                var iterableDiff = [ new DefaultIterableDifferFactory() ];
                var defaultIterableDiffers = new IterableDiffers(iterableDiff);
                var defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
                var RenderComponentType = function() {
                    function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles, animations) {
                        this.id = id;
                        this.templateUrl = templateUrl;
                        this.slotCount = slotCount;
                        this.encapsulation = encapsulation;
                        this.styles = styles;
                        this.animations = animations;
                    }
                    return RenderComponentType;
                }();
                var RenderDebugInfo = function() {
                    function RenderDebugInfo() {}
                    RenderDebugInfo.prototype.injector = function() {};
                    RenderDebugInfo.prototype.component = function() {};
                    RenderDebugInfo.prototype.providerTokens = function() {};
                    RenderDebugInfo.prototype.references = function() {};
                    RenderDebugInfo.prototype.context = function() {};
                    RenderDebugInfo.prototype.source = function() {};
                    return RenderDebugInfo;
                }();
                var Renderer = function() {
                    function Renderer() {}
                    Renderer.prototype.selectRootElement = function(selectorOrNode, debugInfo) {};
                    Renderer.prototype.createElement = function(parentElement, name, debugInfo) {};
                    Renderer.prototype.createViewRoot = function(hostElement) {};
                    Renderer.prototype.createTemplateAnchor = function(parentElement, debugInfo) {};
                    Renderer.prototype.createText = function(parentElement, value, debugInfo) {};
                    Renderer.prototype.projectNodes = function(parentElement, nodes) {};
                    Renderer.prototype.attachViewAfter = function(node, viewRootNodes) {};
                    Renderer.prototype.detachView = function(viewRootNodes) {};
                    Renderer.prototype.destroyView = function(hostElement, viewAllNodes) {};
                    Renderer.prototype.listen = function(renderElement, name, callback) {};
                    Renderer.prototype.listenGlobal = function(target, name, callback) {};
                    Renderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {};
                    Renderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {};
                    Renderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {};
                    Renderer.prototype.setElementClass = function(renderElement, className, isAdd) {};
                    Renderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {};
                    Renderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {};
                    Renderer.prototype.setText = function(renderNode, text) {};
                    Renderer.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {};
                    return Renderer;
                }();
                var RootRenderer = function() {
                    function RootRenderer() {}
                    RootRenderer.prototype.renderComponent = function(componentType) {};
                    return RootRenderer;
                }();
                var SecurityContext = {};
                SecurityContext.NONE = 0;
                SecurityContext.HTML = 1;
                SecurityContext.STYLE = 2;
                SecurityContext.SCRIPT = 3;
                SecurityContext.URL = 4;
                SecurityContext.RESOURCE_URL = 5;
                SecurityContext[SecurityContext.NONE] = "NONE";
                SecurityContext[SecurityContext.HTML] = "HTML";
                SecurityContext[SecurityContext.STYLE] = "STYLE";
                SecurityContext[SecurityContext.SCRIPT] = "SCRIPT";
                SecurityContext[SecurityContext.URL] = "URL";
                SecurityContext[SecurityContext.RESOURCE_URL] = "RESOURCE_URL";
                var Sanitizer = function() {
                    function Sanitizer() {}
                    Sanitizer.prototype.sanitize = function(context, value) {};
                    return Sanitizer;
                }();
                var __extends$7 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var ExpressionChangedAfterItHasBeenCheckedError = function(_super) {
                    __extends$7(ExpressionChangedAfterItHasBeenCheckedError, _super);
                    function ExpressionChangedAfterItHasBeenCheckedError(oldValue, currValue) {
                        var msg = "Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
                        if (oldValue === UNINITIALIZED) {
                            msg += " It seems like the view has been created after its parent and its children have been dirty checked." + " Has it been created in a change detection hook ?";
                        }
                        _super.call(this, msg);
                    }
                    return ExpressionChangedAfterItHasBeenCheckedError;
                }(BaseError);
                var ViewWrappedError = function(_super) {
                    __extends$7(ViewWrappedError, _super);
                    function ViewWrappedError(originalError, context) {
                        _super.call(this, "Error in " + context.source, originalError);
                        this.context = context;
                    }
                    return ViewWrappedError;
                }(WrappedError);
                var ViewDestroyedError = function(_super) {
                    __extends$7(ViewDestroyedError, _super);
                    function ViewDestroyedError(details) {
                        _super.call(this, "Attempt to use a destroyed view: " + details);
                    }
                    return ViewDestroyedError;
                }(BaseError);
                var ViewUtils = function() {
                    function ViewUtils(_renderer, sanitizer, animationQueue) {
                        this._renderer = _renderer;
                        this.animationQueue = animationQueue;
                        this.sanitizer = sanitizer;
                    }
                    ViewUtils.prototype.renderComponent = function(renderComponentType) {
                        return this._renderer.renderComponent(renderComponentType);
                    };
                    ViewUtils.decorators = [ {
                        type: Injectable
                    } ];
                    ViewUtils.ctorParameters = function() {
                        return [ {
                            type: RootRenderer
                        }, {
                            type: Sanitizer
                        }, {
                            type: AnimationQueue
                        } ];
                    };
                    return ViewUtils;
                }();
                var nextRenderComponentTypeId = 0;
                function createRenderComponentType(templateUrl, slotCount, encapsulation, styles, animations) {
                    return new RenderComponentType("" + nextRenderComponentTypeId++, templateUrl, slotCount, encapsulation, styles, animations);
                }
                function addToArray(e, array) {
                    array.push(e);
                }
                function interpolate(valueCount, constAndInterp) {
                    var result = "";
                    for (var i = 0; i < valueCount * 2; i = i + 2) {
                        result = result + constAndInterp[i] + _toStringWithNull(constAndInterp[i + 1]);
                    }
                    return result + constAndInterp[valueCount * 2];
                }
                function inlineInterpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
                    switch (valueCount) {
                      case 1:
                        return c0 + _toStringWithNull(a1) + c1;

                      case 2:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;

                      case 3:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3;

                      case 4:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4;

                      case 5:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;

                      case 6:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6;

                      case 7:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7;

                      case 8:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;

                      case 9:
                        return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) + c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) + c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) + c9;

                      default:
                        throw new Error("Does not support more than 9 expressions");
                    }
                }
                function _toStringWithNull(v) {
                    return v != null ? v.toString() : "";
                }
                function checkBinding(throwOnChange, oldValue, newValue) {
                    if (throwOnChange) {
                        if (!devModeEqual(oldValue, newValue)) {
                            throw new ExpressionChangedAfterItHasBeenCheckedError(oldValue, newValue);
                        }
                        return false;
                    } else {
                        return !looseIdentical(oldValue, newValue);
                    }
                }
                function castByValue(input, value) {
                    return input;
                }
                var EMPTY_ARRAY = [];
                var EMPTY_MAP = {};
                function pureProxy1(fn) {
                    var result;
                    var v0 = UNINITIALIZED;
                    return function(p0) {
                        if (!looseIdentical(v0, p0)) {
                            v0 = p0;
                            result = fn(p0);
                        }
                        return result;
                    };
                }
                function pureProxy2(fn) {
                    var result;
                    var v0 = UNINITIALIZED;
                    var v1 = UNINITIALIZED;
                    return function(p0, p1) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1)) {
                            v0 = p0;
                            v1 = p1;
                            result = fn(p0, p1);
                        }
                        return result;
                    };
                }
                function pureProxy3(fn) {
                    var result;
                    var v0 = UNINITIALIZED;
                    var v1 = UNINITIALIZED;
                    var v2 = UNINITIALIZED;
                    return function(p0, p1, p2) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            result = fn(p0, p1, p2);
                        }
                        return result;
                    };
                }
                function pureProxy4(fn) {
                    var result;
                    var v0, v1, v2, v3;
                    v0 = v1 = v2 = v3 = UNINITIALIZED;
                    return function(p0, p1, p2, p3) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            result = fn(p0, p1, p2, p3);
                        }
                        return result;
                    };
                }
                function pureProxy5(fn) {
                    var result;
                    var v0, v1, v2, v3, v4;
                    v0 = v1 = v2 = v3 = v4 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            result = fn(p0, p1, p2, p3, p4);
                        }
                        return result;
                    };
                }
                function pureProxy6(fn) {
                    var result;
                    var v0, v1, v2, v3, v4, v5;
                    v0 = v1 = v2 = v3 = v4 = v5 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4, p5) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            v5 = p5;
                            result = fn(p0, p1, p2, p3, p4, p5);
                        }
                        return result;
                    };
                }
                function pureProxy7(fn) {
                    var result;
                    var v0, v1, v2, v3, v4, v5, v6;
                    v0 = v1 = v2 = v3 = v4 = v5 = v6 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4, p5, p6) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            v5 = p5;
                            v6 = p6;
                            result = fn(p0, p1, p2, p3, p4, p5, p6);
                        }
                        return result;
                    };
                }
                function pureProxy8(fn) {
                    var result;
                    var v0, v1, v2, v3, v4, v5, v6, v7;
                    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4, p5, p6, p7) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            v5 = p5;
                            v6 = p6;
                            v7 = p7;
                            result = fn(p0, p1, p2, p3, p4, p5, p6, p7);
                        }
                        return result;
                    };
                }
                function pureProxy9(fn) {
                    var result;
                    var v0, v1, v2, v3, v4, v5, v6, v7, v8;
                    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4, p5, p6, p7, p8) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            v5 = p5;
                            v6 = p6;
                            v7 = p7;
                            v8 = p8;
                            result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8);
                        }
                        return result;
                    };
                }
                function pureProxy10(fn) {
                    var result;
                    var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9;
                    v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = UNINITIALIZED;
                    return function(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
                        if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) || !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) || !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8) || !looseIdentical(v9, p9)) {
                            v0 = p0;
                            v1 = p1;
                            v2 = p2;
                            v3 = p3;
                            v4 = p4;
                            v5 = p5;
                            v6 = p6;
                            v7 = p7;
                            v8 = p8;
                            v9 = p9;
                            result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
                        }
                        return result;
                    };
                }
                function setBindingDebugInfoForChanges(renderer, el, changes) {
                    Object.keys(changes).forEach(function(propName) {
                        setBindingDebugInfo(renderer, el, propName, changes[propName].currentValue);
                    });
                }
                function setBindingDebugInfo(renderer, el, propName, value) {
                    try {
                        renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), value ? value.toString() : null);
                    } catch (e) {
                        renderer.setBindingDebugInfo(el, "ng-reflect-" + camelCaseToDashCase(propName), "[ERROR] Exception while trying to serialize the value");
                    }
                }
                var CAMEL_CASE_REGEXP = /([A-Z])/g;
                function camelCaseToDashCase(input) {
                    return input.replace(CAMEL_CASE_REGEXP, function() {
                        var m = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            m[_i - 0] = arguments[_i];
                        }
                        return "-" + m[1].toLowerCase();
                    });
                }
                function createRenderElement(renderer, parentElement, name, attrs, debugInfo) {
                    var el = renderer.createElement(parentElement, name, debugInfo);
                    for (var i = 0; i < attrs.length; i += 2) {
                        renderer.setElementAttribute(el, attrs.get(i), attrs.get(i + 1));
                    }
                    return el;
                }
                function selectOrCreateRenderHostElement(renderer, elementName, attrs, rootSelectorOrNode, debugInfo) {
                    var hostElement;
                    if (isPresent(rootSelectorOrNode)) {
                        hostElement = renderer.selectRootElement(rootSelectorOrNode, debugInfo);
                        for (var i = 0; i < attrs.length; i += 2) {
                            renderer.setElementAttribute(hostElement, attrs.get(i), attrs.get(i + 1));
                        }
                        renderer.setElementAttribute(hostElement, "ng-version", VERSION.full);
                    } else {
                        hostElement = createRenderElement(renderer, null, elementName, attrs, debugInfo);
                    }
                    return hostElement;
                }
                function subscribeToRenderElement(view, element, eventNamesAndTargets, listener) {
                    var disposables = createEmptyInlineArray(eventNamesAndTargets.length / 2);
                    for (var i = 0; i < eventNamesAndTargets.length; i += 2) {
                        var eventName = eventNamesAndTargets.get(i);
                        var eventTarget = eventNamesAndTargets.get(i + 1);
                        var disposable = void 0;
                        if (eventTarget) {
                            disposable = view.renderer.listenGlobal(eventTarget, eventName, listener.bind(view, eventTarget + ":" + eventName));
                        } else {
                            disposable = view.renderer.listen(element, eventName, listener.bind(view, eventName));
                        }
                        disposables.set(i / 2, disposable);
                    }
                    return disposeInlineArray.bind(null, disposables);
                }
                function disposeInlineArray(disposables) {
                    for (var i = 0; i < disposables.length; i++) {
                        disposables.get(i)();
                    }
                }
                function noop() {}
                function createEmptyInlineArray(length) {
                    var ctor;
                    if (length <= 2) {
                        ctor = InlineArray2;
                    } else if (length <= 4) {
                        ctor = InlineArray4;
                    } else if (length <= 8) {
                        ctor = InlineArray8;
                    } else if (length <= 16) {
                        ctor = InlineArray16;
                    } else {
                        ctor = InlineArrayDynamic;
                    }
                    return new ctor(length);
                }
                var InlineArray0 = function() {
                    function InlineArray0() {
                        this.length = 0;
                    }
                    InlineArray0.prototype.get = function(index) {
                        return undefined;
                    };
                    InlineArray0.prototype.set = function(index, value) {};
                    return InlineArray0;
                }();
                var InlineArray2 = function() {
                    function InlineArray2(length, _v0, _v1) {
                        this.length = length;
                        this._v0 = _v0;
                        this._v1 = _v1;
                    }
                    InlineArray2.prototype.get = function(index) {
                        switch (index) {
                          case 0:
                            return this._v0;

                          case 1:
                            return this._v1;

                          default:
                            return undefined;
                        }
                    };
                    InlineArray2.prototype.set = function(index, value) {
                        switch (index) {
                          case 0:
                            this._v0 = value;
                            break;

                          case 1:
                            this._v1 = value;
                            break;
                        }
                    };
                    return InlineArray2;
                }();
                var InlineArray4 = function() {
                    function InlineArray4(length, _v0, _v1, _v2, _v3) {
                        this.length = length;
                        this._v0 = _v0;
                        this._v1 = _v1;
                        this._v2 = _v2;
                        this._v3 = _v3;
                    }
                    InlineArray4.prototype.get = function(index) {
                        switch (index) {
                          case 0:
                            return this._v0;

                          case 1:
                            return this._v1;

                          case 2:
                            return this._v2;

                          case 3:
                            return this._v3;

                          default:
                            return undefined;
                        }
                    };
                    InlineArray4.prototype.set = function(index, value) {
                        switch (index) {
                          case 0:
                            this._v0 = value;
                            break;

                          case 1:
                            this._v1 = value;
                            break;

                          case 2:
                            this._v2 = value;
                            break;

                          case 3:
                            this._v3 = value;
                            break;
                        }
                    };
                    return InlineArray4;
                }();
                var InlineArray8 = function() {
                    function InlineArray8(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7) {
                        this.length = length;
                        this._v0 = _v0;
                        this._v1 = _v1;
                        this._v2 = _v2;
                        this._v3 = _v3;
                        this._v4 = _v4;
                        this._v5 = _v5;
                        this._v6 = _v6;
                        this._v7 = _v7;
                    }
                    InlineArray8.prototype.get = function(index) {
                        switch (index) {
                          case 0:
                            return this._v0;

                          case 1:
                            return this._v1;

                          case 2:
                            return this._v2;

                          case 3:
                            return this._v3;

                          case 4:
                            return this._v4;

                          case 5:
                            return this._v5;

                          case 6:
                            return this._v6;

                          case 7:
                            return this._v7;

                          default:
                            return undefined;
                        }
                    };
                    InlineArray8.prototype.set = function(index, value) {
                        switch (index) {
                          case 0:
                            this._v0 = value;
                            break;

                          case 1:
                            this._v1 = value;
                            break;

                          case 2:
                            this._v2 = value;
                            break;

                          case 3:
                            this._v3 = value;
                            break;

                          case 4:
                            this._v4 = value;
                            break;

                          case 5:
                            this._v5 = value;
                            break;

                          case 6:
                            this._v6 = value;
                            break;

                          case 7:
                            this._v7 = value;
                            break;
                        }
                    };
                    return InlineArray8;
                }();
                var InlineArray16 = function() {
                    function InlineArray16(length, _v0, _v1, _v2, _v3, _v4, _v5, _v6, _v7, _v8, _v9, _v10, _v11, _v12, _v13, _v14, _v15) {
                        this.length = length;
                        this._v0 = _v0;
                        this._v1 = _v1;
                        this._v2 = _v2;
                        this._v3 = _v3;
                        this._v4 = _v4;
                        this._v5 = _v5;
                        this._v6 = _v6;
                        this._v7 = _v7;
                        this._v8 = _v8;
                        this._v9 = _v9;
                        this._v10 = _v10;
                        this._v11 = _v11;
                        this._v12 = _v12;
                        this._v13 = _v13;
                        this._v14 = _v14;
                        this._v15 = _v15;
                    }
                    InlineArray16.prototype.get = function(index) {
                        switch (index) {
                          case 0:
                            return this._v0;

                          case 1:
                            return this._v1;

                          case 2:
                            return this._v2;

                          case 3:
                            return this._v3;

                          case 4:
                            return this._v4;

                          case 5:
                            return this._v5;

                          case 6:
                            return this._v6;

                          case 7:
                            return this._v7;

                          case 8:
                            return this._v8;

                          case 9:
                            return this._v9;

                          case 10:
                            return this._v10;

                          case 11:
                            return this._v11;

                          case 12:
                            return this._v12;

                          case 13:
                            return this._v13;

                          case 14:
                            return this._v14;

                          case 15:
                            return this._v15;

                          default:
                            return undefined;
                        }
                    };
                    InlineArray16.prototype.set = function(index, value) {
                        switch (index) {
                          case 0:
                            this._v0 = value;
                            break;

                          case 1:
                            this._v1 = value;
                            break;

                          case 2:
                            this._v2 = value;
                            break;

                          case 3:
                            this._v3 = value;
                            break;

                          case 4:
                            this._v4 = value;
                            break;

                          case 5:
                            this._v5 = value;
                            break;

                          case 6:
                            this._v6 = value;
                            break;

                          case 7:
                            this._v7 = value;
                            break;

                          case 8:
                            this._v8 = value;
                            break;

                          case 9:
                            this._v9 = value;
                            break;

                          case 10:
                            this._v10 = value;
                            break;

                          case 11:
                            this._v11 = value;
                            break;

                          case 12:
                            this._v12 = value;
                            break;

                          case 13:
                            this._v13 = value;
                            break;

                          case 14:
                            this._v14 = value;
                            break;

                          case 15:
                            this._v15 = value;
                            break;
                        }
                    };
                    return InlineArray16;
                }();
                var InlineArrayDynamic = function() {
                    function InlineArrayDynamic(length) {
                        var values = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            values[_i - 1] = arguments[_i];
                        }
                        this.length = length;
                        this._values = values;
                    }
                    InlineArrayDynamic.prototype.get = function(index) {
                        return this._values[index];
                    };
                    InlineArrayDynamic.prototype.set = function(index, value) {
                        this._values[index] = value;
                    };
                    return InlineArrayDynamic;
                }();
                var EMPTY_INLINE_ARRAY = new InlineArray0();
                var view_utils = Object.freeze({
                    ViewUtils: ViewUtils,
                    createRenderComponentType: createRenderComponentType,
                    addToArray: addToArray,
                    interpolate: interpolate,
                    inlineInterpolate: inlineInterpolate,
                    checkBinding: checkBinding,
                    castByValue: castByValue,
                    EMPTY_ARRAY: EMPTY_ARRAY,
                    EMPTY_MAP: EMPTY_MAP,
                    pureProxy1: pureProxy1,
                    pureProxy2: pureProxy2,
                    pureProxy3: pureProxy3,
                    pureProxy4: pureProxy4,
                    pureProxy5: pureProxy5,
                    pureProxy6: pureProxy6,
                    pureProxy7: pureProxy7,
                    pureProxy8: pureProxy8,
                    pureProxy9: pureProxy9,
                    pureProxy10: pureProxy10,
                    setBindingDebugInfoForChanges: setBindingDebugInfoForChanges,
                    setBindingDebugInfo: setBindingDebugInfo,
                    createRenderElement: createRenderElement,
                    selectOrCreateRenderHostElement: selectOrCreateRenderHostElement,
                    subscribeToRenderElement: subscribeToRenderElement,
                    noop: noop,
                    InlineArray2: InlineArray2,
                    InlineArray4: InlineArray4,
                    InlineArray8: InlineArray8,
                    InlineArray16: InlineArray16,
                    InlineArrayDynamic: InlineArrayDynamic,
                    EMPTY_INLINE_ARRAY: EMPTY_INLINE_ARRAY
                });
                var __extends$5 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var ComponentRef = function() {
                    function ComponentRef() {}
                    ComponentRef.prototype.location = function() {};
                    ComponentRef.prototype.injector = function() {};
                    ComponentRef.prototype.instance = function() {};
                    ComponentRef.prototype.hostView = function() {};
                    ComponentRef.prototype.changeDetectorRef = function() {};
                    ComponentRef.prototype.componentType = function() {};
                    ComponentRef.prototype.destroy = function() {};
                    ComponentRef.prototype.onDestroy = function(callback) {};
                    return ComponentRef;
                }();
                var ComponentRef_ = function(_super) {
                    __extends$5(ComponentRef_, _super);
                    function ComponentRef_(_index, _parentView, _nativeElement, _component) {
                        _super.call(this);
                        this._index = _index;
                        this._parentView = _parentView;
                        this._nativeElement = _nativeElement;
                        this._component = _component;
                    }
                    Object.defineProperty(ComponentRef_.prototype, "location", {
                        get: function() {
                            return new ElementRef(this._nativeElement);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ComponentRef_.prototype, "injector", {
                        get: function() {
                            return this._parentView.injector(this._index);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ComponentRef_.prototype, "instance", {
                        get: function() {
                            return this._component;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ComponentRef_.prototype, "hostView", {
                        get: function() {
                            return this._parentView.ref;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
                        get: function() {
                            return this._parentView.ref;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ComponentRef_.prototype, "componentType", {
                        get: function() {
                            return this._component.constructor;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ComponentRef_.prototype.destroy = function() {
                        this._parentView.detachAndDestroy();
                    };
                    ComponentRef_.prototype.onDestroy = function(callback) {
                        this.hostView.onDestroy(callback);
                    };
                    return ComponentRef_;
                }(ComponentRef);
                var ComponentFactory = function() {
                    function ComponentFactory(selector, _viewClass, _componentType) {
                        this.selector = selector;
                        this._viewClass = _viewClass;
                        this._componentType = _componentType;
                    }
                    Object.defineProperty(ComponentFactory.prototype, "componentType", {
                        get: function() {
                            return this._componentType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ComponentFactory.prototype.create = function(injector, projectableNodes, rootSelectorOrNode) {
                        if (projectableNodes === void 0) {
                            projectableNodes = null;
                        }
                        if (rootSelectorOrNode === void 0) {
                            rootSelectorOrNode = null;
                        }
                        var vu = injector.get(ViewUtils);
                        if (!projectableNodes) {
                            projectableNodes = [];
                        }
                        var hostView = new this._viewClass(vu, null, null, null);
                        return hostView.createHostView(rootSelectorOrNode, injector, projectableNodes);
                    };
                    return ComponentFactory;
                }();
                var __extends$8 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var NoComponentFactoryError = function(_super) {
                    __extends$8(NoComponentFactoryError, _super);
                    function NoComponentFactoryError(component) {
                        _super.call(this, "No component factory found for " + stringify(component) + ". Did you add it to @NgModule.entryComponents?");
                        this.component = component;
                    }
                    return NoComponentFactoryError;
                }(BaseError);
                var _NullComponentFactoryResolver = function() {
                    function _NullComponentFactoryResolver() {}
                    _NullComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
                        throw new NoComponentFactoryError(component);
                    };
                    return _NullComponentFactoryResolver;
                }();
                var ComponentFactoryResolver = function() {
                    function ComponentFactoryResolver() {}
                    ComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {};
                    ComponentFactoryResolver.NULL = new _NullComponentFactoryResolver();
                    return ComponentFactoryResolver;
                }();
                var CodegenComponentFactoryResolver = function() {
                    function CodegenComponentFactoryResolver(factories, _parent) {
                        this._parent = _parent;
                        this._factories = new Map();
                        for (var i = 0; i < factories.length; i++) {
                            var factory = factories[i];
                            this._factories.set(factory.componentType, factory);
                        }
                    }
                    CodegenComponentFactoryResolver.prototype.resolveComponentFactory = function(component) {
                        var result = this._factories.get(component);
                        if (!result) {
                            result = this._parent.resolveComponentFactory(component);
                        }
                        return result;
                    };
                    return CodegenComponentFactoryResolver;
                }();
                var trace;
                var events;
                function detectWTF() {
                    var wtf = global$1["wtf"];
                    if (wtf) {
                        trace = wtf["trace"];
                        if (trace) {
                            events = trace["events"];
                            return true;
                        }
                    }
                    return false;
                }
                function createScope(signature, flags) {
                    if (flags === void 0) {
                        flags = null;
                    }
                    return events.createScope(signature, flags);
                }
                function leave(scope, returnValue) {
                    trace.leaveScope(scope, returnValue);
                    return returnValue;
                }
                function startTimeRange(rangeType, action) {
                    return trace.beginTimeRange(rangeType, action);
                }
                function endTimeRange(range) {
                    trace.endTimeRange(range);
                }
                var wtfEnabled = detectWTF();
                function noopScope(arg0, arg1) {
                    return null;
                }
                var wtfCreateScope = wtfEnabled ? createScope : function(signature, flags) {
                    return noopScope;
                };
                var wtfLeave = wtfEnabled ? leave : function(s, r) {
                    return r;
                };
                var wtfStartTimeRange = wtfEnabled ? startTimeRange : function(rangeType, action) {
                    return null;
                };
                var wtfEndTimeRange = wtfEnabled ? endTimeRange : function(r) {
                    return null;
                };
                var Testability = function() {
                    function Testability(_ngZone) {
                        this._ngZone = _ngZone;
                        this._pendingCount = 0;
                        this._isZoneStable = true;
                        this._didWork = false;
                        this._callbacks = [];
                        this._watchAngularEvents();
                    }
                    Testability.prototype._watchAngularEvents = function() {
                        var _this = this;
                        this._ngZone.onUnstable.subscribe({
                            next: function() {
                                _this._didWork = true;
                                _this._isZoneStable = false;
                            }
                        });
                        this._ngZone.runOutsideAngular(function() {
                            _this._ngZone.onStable.subscribe({
                                next: function() {
                                    NgZone.assertNotInAngularZone();
                                    scheduleMicroTask(function() {
                                        _this._isZoneStable = true;
                                        _this._runCallbacksIfReady();
                                    });
                                }
                            });
                        });
                    };
                    Testability.prototype.increasePendingRequestCount = function() {
                        this._pendingCount += 1;
                        this._didWork = true;
                        return this._pendingCount;
                    };
                    Testability.prototype.decreasePendingRequestCount = function() {
                        this._pendingCount -= 1;
                        if (this._pendingCount < 0) {
                            throw new Error("pending async requests below zero");
                        }
                        this._runCallbacksIfReady();
                        return this._pendingCount;
                    };
                    Testability.prototype.isStable = function() {
                        return this._isZoneStable && this._pendingCount == 0 && !this._ngZone.hasPendingMacrotasks;
                    };
                    Testability.prototype._runCallbacksIfReady = function() {
                        var _this = this;
                        if (this.isStable()) {
                            scheduleMicroTask(function() {
                                while (_this._callbacks.length !== 0) {
                                    _this._callbacks.pop()(_this._didWork);
                                }
                                _this._didWork = false;
                            });
                        } else {
                            this._didWork = true;
                        }
                    };
                    Testability.prototype.whenStable = function(callback) {
                        this._callbacks.push(callback);
                        this._runCallbacksIfReady();
                    };
                    Testability.prototype.getPendingRequestCount = function() {
                        return this._pendingCount;
                    };
                    Testability.prototype.findBindings = function(using, provider, exactMatch) {
                        return [];
                    };
                    Testability.prototype.findProviders = function(using, provider, exactMatch) {
                        return [];
                    };
                    Testability.decorators = [ {
                        type: Injectable
                    } ];
                    Testability.ctorParameters = function() {
                        return [ {
                            type: NgZone
                        } ];
                    };
                    return Testability;
                }();
                var TestabilityRegistry = function() {
                    function TestabilityRegistry() {
                        this._applications = new Map();
                        _testabilityGetter.addToWindow(this);
                    }
                    TestabilityRegistry.prototype.registerApplication = function(token, testability) {
                        this._applications.set(token, testability);
                    };
                    TestabilityRegistry.prototype.getTestability = function(elem) {
                        return this._applications.get(elem);
                    };
                    TestabilityRegistry.prototype.getAllTestabilities = function() {
                        return Array.from(this._applications.values());
                    };
                    TestabilityRegistry.prototype.getAllRootElements = function() {
                        return Array.from(this._applications.keys());
                    };
                    TestabilityRegistry.prototype.findTestabilityInTree = function(elem, findInAncestors) {
                        if (findInAncestors === void 0) {
                            findInAncestors = true;
                        }
                        return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
                    };
                    TestabilityRegistry.decorators = [ {
                        type: Injectable
                    } ];
                    TestabilityRegistry.ctorParameters = function() {
                        return [];
                    };
                    return TestabilityRegistry;
                }();
                var _NoopGetTestability = function() {
                    function _NoopGetTestability() {}
                    _NoopGetTestability.prototype.addToWindow = function(registry) {};
                    _NoopGetTestability.prototype.findTestabilityInTree = function(registry, elem, findInAncestors) {
                        return null;
                    };
                    return _NoopGetTestability;
                }();
                function setTestabilityGetter(getter) {
                    _testabilityGetter = getter;
                }
                var _testabilityGetter = new _NoopGetTestability();
                var __extends$3 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var _devMode = true;
                var _runModeLocked = false;
                var _platform;
                function enableProdMode() {
                    if (_runModeLocked) {
                        throw new Error("Cannot enable prod mode after platform setup.");
                    }
                    _devMode = false;
                }
                function isDevMode() {
                    _runModeLocked = true;
                    return _devMode;
                }
                var NgProbeToken = function() {
                    function NgProbeToken(name, token) {
                        this.name = name;
                        this.token = token;
                    }
                    return NgProbeToken;
                }();
                function createPlatform(injector) {
                    if (_platform && !_platform.destroyed) {
                        throw new Error("There can be only one platform. Destroy the previous one to create a new one.");
                    }
                    _platform = injector.get(PlatformRef);
                    var inits = injector.get(PLATFORM_INITIALIZER, null);
                    if (inits) inits.forEach(function(init) {
                        return init();
                    });
                    return _platform;
                }
                function createPlatformFactory(parentPlatformFactory, name, providers) {
                    if (providers === void 0) {
                        providers = [];
                    }
                    var marker = new OpaqueToken("Platform: " + name);
                    return function(extraProviders) {
                        if (extraProviders === void 0) {
                            extraProviders = [];
                        }
                        if (!getPlatform()) {
                            if (parentPlatformFactory) {
                                parentPlatformFactory(providers.concat(extraProviders).concat({
                                    provide: marker,
                                    useValue: true
                                }));
                            } else {
                                createPlatform(ReflectiveInjector.resolveAndCreate(providers.concat(extraProviders).concat({
                                    provide: marker,
                                    useValue: true
                                })));
                            }
                        }
                        return assertPlatform(marker);
                    };
                }
                function assertPlatform(requiredToken) {
                    var platform = getPlatform();
                    if (!platform) {
                        throw new Error("No platform exists!");
                    }
                    if (!platform.injector.get(requiredToken, null)) {
                        throw new Error("A platform with a different configuration has been created. Please destroy it first.");
                    }
                    return platform;
                }
                function destroyPlatform() {
                    if (_platform && !_platform.destroyed) {
                        _platform.destroy();
                    }
                }
                function getPlatform() {
                    return _platform && !_platform.destroyed ? _platform : null;
                }
                var PlatformRef = function() {
                    function PlatformRef() {}
                    PlatformRef.prototype.bootstrapModuleFactory = function(moduleFactory) {};
                    PlatformRef.prototype.bootstrapModule = function(moduleType, compilerOptions) {};
                    PlatformRef.prototype.onDestroy = function(callback) {};
                    PlatformRef.prototype.injector = function() {};
                    PlatformRef.prototype.destroy = function() {};
                    PlatformRef.prototype.destroyed = function() {};
                    return PlatformRef;
                }();
                function _callAndReportToErrorHandler(errorHandler, callback) {
                    try {
                        var result = callback();
                        if (isPromise(result)) {
                            return result.catch(function(e) {
                                errorHandler.handleError(e);
                                throw e;
                            });
                        }
                        return result;
                    } catch (e) {
                        errorHandler.handleError(e);
                        throw e;
                    }
                }
                var PlatformRef_ = function(_super) {
                    __extends$3(PlatformRef_, _super);
                    function PlatformRef_(_injector) {
                        _super.call(this);
                        this._injector = _injector;
                        this._modules = [];
                        this._destroyListeners = [];
                        this._destroyed = false;
                    }
                    PlatformRef_.prototype.onDestroy = function(callback) {
                        this._destroyListeners.push(callback);
                    };
                    Object.defineProperty(PlatformRef_.prototype, "injector", {
                        get: function() {
                            return this._injector;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(PlatformRef_.prototype, "destroyed", {
                        get: function() {
                            return this._destroyed;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    PlatformRef_.prototype.destroy = function() {
                        if (this._destroyed) {
                            throw new Error("The platform has already been destroyed!");
                        }
                        this._modules.slice().forEach(function(module) {
                            return module.destroy();
                        });
                        this._destroyListeners.forEach(function(listener) {
                            return listener();
                        });
                        this._destroyed = true;
                    };
                    PlatformRef_.prototype.bootstrapModuleFactory = function(moduleFactory) {
                        return this._bootstrapModuleFactoryWithZone(moduleFactory, null);
                    };
                    PlatformRef_.prototype._bootstrapModuleFactoryWithZone = function(moduleFactory, ngZone) {
                        var _this = this;
                        if (!ngZone) ngZone = new NgZone({
                            enableLongStackTrace: isDevMode()
                        });
                        return ngZone.run(function() {
                            var ngZoneInjector = ReflectiveInjector.resolveAndCreate([ {
                                provide: NgZone,
                                useValue: ngZone
                            } ], _this.injector);
                            var moduleRef = moduleFactory.create(ngZoneInjector);
                            var exceptionHandler = moduleRef.injector.get(ErrorHandler, null);
                            if (!exceptionHandler) {
                                throw new Error("No ErrorHandler. Is platform module (BrowserModule) included?");
                            }
                            moduleRef.onDestroy(function() {
                                return ListWrapper.remove(_this._modules, moduleRef);
                            });
                            ngZone.onError.subscribe({
                                next: function(error) {
                                    exceptionHandler.handleError(error);
                                }
                            });
                            return _callAndReportToErrorHandler(exceptionHandler, function() {
                                var initStatus = moduleRef.injector.get(ApplicationInitStatus);
                                return initStatus.donePromise.then(function() {
                                    _this._moduleDoBootstrap(moduleRef);
                                    return moduleRef;
                                });
                            });
                        });
                    };
                    PlatformRef_.prototype.bootstrapModule = function(moduleType, compilerOptions) {
                        if (compilerOptions === void 0) {
                            compilerOptions = [];
                        }
                        return this._bootstrapModuleWithZone(moduleType, compilerOptions, null);
                    };
                    PlatformRef_.prototype._bootstrapModuleWithZone = function(moduleType, compilerOptions, ngZone, componentFactoryCallback) {
                        var _this = this;
                        if (compilerOptions === void 0) {
                            compilerOptions = [];
                        }
                        var compilerFactory = this.injector.get(CompilerFactory);
                        var compiler = compilerFactory.createCompiler(Array.isArray(compilerOptions) ? compilerOptions : [ compilerOptions ]);
                        if (componentFactoryCallback) {
                            return compiler.compileModuleAndAllComponentsAsync(moduleType).then(function(_a) {
                                var ngModuleFactory = _a.ngModuleFactory, componentFactories = _a.componentFactories;
                                componentFactoryCallback(componentFactories);
                                return _this._bootstrapModuleFactoryWithZone(ngModuleFactory, ngZone);
                            });
                        }
                        return compiler.compileModuleAsync(moduleType).then(function(moduleFactory) {
                            return _this._bootstrapModuleFactoryWithZone(moduleFactory, ngZone);
                        });
                    };
                    PlatformRef_.prototype._moduleDoBootstrap = function(moduleRef) {
                        var appRef = moduleRef.injector.get(ApplicationRef);
                        if (moduleRef.bootstrapFactories.length > 0) {
                            moduleRef.bootstrapFactories.forEach(function(compFactory) {
                                return appRef.bootstrap(compFactory);
                            });
                        } else if (moduleRef.instance.ngDoBootstrap) {
                            moduleRef.instance.ngDoBootstrap(appRef);
                        } else {
                            throw new Error("The module " + stringify(moduleRef.instance.constructor) + ' was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. ' + "Please define one of these.");
                        }
                        this._modules.push(moduleRef);
                    };
                    PlatformRef_.decorators = [ {
                        type: Injectable
                    } ];
                    PlatformRef_.ctorParameters = function() {
                        return [ {
                            type: Injector
                        } ];
                    };
                    return PlatformRef_;
                }(PlatformRef);
                var ApplicationRef = function() {
                    function ApplicationRef() {}
                    ApplicationRef.prototype.bootstrap = function(componentFactory) {};
                    ApplicationRef.prototype.tick = function() {};
                    ApplicationRef.prototype.componentTypes = function() {};
                    ApplicationRef.prototype.components = function() {};
                    ApplicationRef.prototype.attachView = function(view) {};
                    ApplicationRef.prototype.detachView = function(view) {};
                    ApplicationRef.prototype.viewCount = function() {};
                    return ApplicationRef;
                }();
                var ApplicationRef_ = function(_super) {
                    __extends$3(ApplicationRef_, _super);
                    function ApplicationRef_(_zone, _console, _injector, _exceptionHandler, _componentFactoryResolver, _initStatus, _testabilityRegistry, _testability) {
                        var _this = this;
                        _super.call(this);
                        this._zone = _zone;
                        this._console = _console;
                        this._injector = _injector;
                        this._exceptionHandler = _exceptionHandler;
                        this._componentFactoryResolver = _componentFactoryResolver;
                        this._initStatus = _initStatus;
                        this._testabilityRegistry = _testabilityRegistry;
                        this._testability = _testability;
                        this._bootstrapListeners = [];
                        this._rootComponents = [];
                        this._rootComponentTypes = [];
                        this._views = [];
                        this._runningTick = false;
                        this._enforceNoNewChanges = false;
                        this._enforceNoNewChanges = isDevMode();
                        this._zone.onMicrotaskEmpty.subscribe({
                            next: function() {
                                _this._zone.run(function() {
                                    _this.tick();
                                });
                            }
                        });
                    }
                    ApplicationRef_.prototype.attachView = function(viewRef) {
                        var view = viewRef.internalView;
                        this._views.push(view);
                        view.attachToAppRef(this);
                    };
                    ApplicationRef_.prototype.detachView = function(viewRef) {
                        var view = viewRef.internalView;
                        ListWrapper.remove(this._views, view);
                        view.detach();
                    };
                    ApplicationRef_.prototype.bootstrap = function(componentOrFactory) {
                        var _this = this;
                        if (!this._initStatus.done) {
                            throw new Error("Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.");
                        }
                        var componentFactory;
                        if (componentOrFactory instanceof ComponentFactory) {
                            componentFactory = componentOrFactory;
                        } else {
                            componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentOrFactory);
                        }
                        this._rootComponentTypes.push(componentFactory.componentType);
                        var compRef = componentFactory.create(this._injector, [], componentFactory.selector);
                        compRef.onDestroy(function() {
                            _this._unloadComponent(compRef);
                        });
                        var testability = compRef.injector.get(Testability, null);
                        if (testability) {
                            compRef.injector.get(TestabilityRegistry).registerApplication(compRef.location.nativeElement, testability);
                        }
                        this._loadComponent(compRef);
                        if (isDevMode()) {
                            this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode.");
                        }
                        return compRef;
                    };
                    ApplicationRef_.prototype._loadComponent = function(componentRef) {
                        this.attachView(componentRef.hostView);
                        this.tick();
                        this._rootComponents.push(componentRef);
                        var listeners = this._injector.get(APP_BOOTSTRAP_LISTENER, []).concat(this._bootstrapListeners);
                        listeners.forEach(function(listener) {
                            return listener(componentRef);
                        });
                    };
                    ApplicationRef_.prototype._unloadComponent = function(componentRef) {
                        this.detachView(componentRef.hostView);
                        ListWrapper.remove(this._rootComponents, componentRef);
                    };
                    ApplicationRef_.prototype.tick = function() {
                        if (this._runningTick) {
                            throw new Error("ApplicationRef.tick is called recursively");
                        }
                        var scope = ApplicationRef_._tickScope();
                        try {
                            this._runningTick = true;
                            this._views.forEach(function(view) {
                                return view.ref.detectChanges();
                            });
                            if (this._enforceNoNewChanges) {
                                this._views.forEach(function(view) {
                                    return view.ref.checkNoChanges();
                                });
                            }
                        } finally {
                            this._runningTick = false;
                            wtfLeave(scope);
                        }
                    };
                    ApplicationRef_.prototype.ngOnDestroy = function() {
                        this._views.slice().forEach(function(view) {
                            return view.destroy();
                        });
                    };
                    Object.defineProperty(ApplicationRef_.prototype, "viewCount", {
                        get: function() {
                            return this._views.length;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
                        get: function() {
                            return this._rootComponentTypes;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ApplicationRef_.prototype, "components", {
                        get: function() {
                            return this._rootComponents;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ApplicationRef_._tickScope = wtfCreateScope("ApplicationRef#tick()");
                    ApplicationRef_.decorators = [ {
                        type: Injectable
                    } ];
                    ApplicationRef_.ctorParameters = function() {
                        return [ {
                            type: NgZone
                        }, {
                            type: Console
                        }, {
                            type: Injector
                        }, {
                            type: ErrorHandler
                        }, {
                            type: ComponentFactoryResolver
                        }, {
                            type: ApplicationInitStatus
                        }, {
                            type: TestabilityRegistry,
                            decorators: [ {
                                type: Optional
                            } ]
                        }, {
                            type: Testability,
                            decorators: [ {
                                type: Optional
                            } ]
                        } ];
                    };
                    return ApplicationRef_;
                }(ApplicationRef);
                var __extends$9 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var NgModuleRef = function() {
                    function NgModuleRef() {}
                    NgModuleRef.prototype.injector = function() {};
                    NgModuleRef.prototype.componentFactoryResolver = function() {};
                    NgModuleRef.prototype.instance = function() {};
                    NgModuleRef.prototype.destroy = function() {};
                    NgModuleRef.prototype.onDestroy = function(callback) {};
                    return NgModuleRef;
                }();
                var NgModuleFactory = function() {
                    function NgModuleFactory(_injectorClass, _moduleType) {
                        this._injectorClass = _injectorClass;
                        this._moduleType = _moduleType;
                    }
                    Object.defineProperty(NgModuleFactory.prototype, "moduleType", {
                        get: function() {
                            return this._moduleType;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgModuleFactory.prototype.create = function(parentInjector) {
                        if (!parentInjector) {
                            parentInjector = Injector.NULL;
                        }
                        var instance = new this._injectorClass(parentInjector);
                        instance.create();
                        return instance;
                    };
                    return NgModuleFactory;
                }();
                var _UNDEFINED = new Object();
                var NgModuleInjector = function(_super) {
                    __extends$9(NgModuleInjector, _super);
                    function NgModuleInjector(parent, factories, bootstrapFactories) {
                        _super.call(this, factories, parent.get(ComponentFactoryResolver, ComponentFactoryResolver.NULL));
                        this.parent = parent;
                        this.bootstrapFactories = bootstrapFactories;
                        this._destroyListeners = [];
                        this._destroyed = false;
                    }
                    NgModuleInjector.prototype.create = function() {
                        this.instance = this.createInternal();
                    };
                    NgModuleInjector.prototype.createInternal = function() {};
                    NgModuleInjector.prototype.get = function(token, notFoundValue) {
                        if (notFoundValue === void 0) {
                            notFoundValue = THROW_IF_NOT_FOUND;
                        }
                        if (token === Injector || token === ComponentFactoryResolver) {
                            return this;
                        }
                        var result = this.getInternal(token, _UNDEFINED);
                        return result === _UNDEFINED ? this.parent.get(token, notFoundValue) : result;
                    };
                    NgModuleInjector.prototype.getInternal = function(token, notFoundValue) {};
                    Object.defineProperty(NgModuleInjector.prototype, "injector", {
                        get: function() {
                            return this;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgModuleInjector.prototype, "componentFactoryResolver", {
                        get: function() {
                            return this;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgModuleInjector.prototype.destroy = function() {
                        if (this._destroyed) {
                            throw new Error("The ng module " + stringify(this.instance.constructor) + " has already been destroyed.");
                        }
                        this._destroyed = true;
                        this.destroyInternal();
                        this._destroyListeners.forEach(function(listener) {
                            return listener();
                        });
                    };
                    NgModuleInjector.prototype.onDestroy = function(callback) {
                        this._destroyListeners.push(callback);
                    };
                    NgModuleInjector.prototype.destroyInternal = function() {};
                    return NgModuleInjector;
                }(CodegenComponentFactoryResolver);
                var NgModuleFactoryLoader = function() {
                    function NgModuleFactoryLoader() {}
                    NgModuleFactoryLoader.prototype.load = function(path) {};
                    return NgModuleFactoryLoader;
                }();
                var moduleFactories = new Map();
                function registerModuleFactory(id, factory) {
                    var existing = moduleFactories.get(id);
                    if (existing) {
                        throw new Error("Duplicate module registered for " + id + " - " + existing.moduleType.name + " vs " + factory.moduleType.name);
                    }
                    moduleFactories.set(id, factory);
                }
                function getModuleFactory(id) {
                    var factory = moduleFactories.get(id);
                    if (!factory) throw new Error("No module with ID " + id + " loaded");
                    return factory;
                }
                var QueryList = function() {
                    function QueryList() {
                        this._dirty = true;
                        this._results = [];
                        this._emitter = new EventEmitter();
                    }
                    Object.defineProperty(QueryList.prototype, "changes", {
                        get: function() {
                            return this._emitter;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(QueryList.prototype, "length", {
                        get: function() {
                            return this._results.length;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(QueryList.prototype, "first", {
                        get: function() {
                            return this._results[0];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(QueryList.prototype, "last", {
                        get: function() {
                            return this._results[this.length - 1];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    QueryList.prototype.map = function(fn) {
                        return this._results.map(fn);
                    };
                    QueryList.prototype.filter = function(fn) {
                        return this._results.filter(fn);
                    };
                    QueryList.prototype.find = function(fn) {
                        return this._results.find(fn);
                    };
                    QueryList.prototype.reduce = function(fn, init) {
                        return this._results.reduce(fn, init);
                    };
                    QueryList.prototype.forEach = function(fn) {
                        this._results.forEach(fn);
                    };
                    QueryList.prototype.some = function(fn) {
                        return this._results.some(fn);
                    };
                    QueryList.prototype.toArray = function() {
                        return this._results.slice();
                    };
                    QueryList.prototype[getSymbolIterator()] = function() {
                        return this._results[getSymbolIterator()]();
                    };
                    QueryList.prototype.toString = function() {
                        return this._results.toString();
                    };
                    QueryList.prototype.reset = function(res) {
                        this._results = ListWrapper.flatten(res);
                        this._dirty = false;
                    };
                    QueryList.prototype.notifyOnChanges = function() {
                        this._emitter.emit(this);
                    };
                    QueryList.prototype.setDirty = function() {
                        this._dirty = true;
                    };
                    Object.defineProperty(QueryList.prototype, "dirty", {
                        get: function() {
                            return this._dirty;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return QueryList;
                }();
                var _SEPARATOR = "#";
                var FACTORY_CLASS_SUFFIX = "NgFactory";
                var SystemJsNgModuleLoaderConfig = function() {
                    function SystemJsNgModuleLoaderConfig() {}
                    return SystemJsNgModuleLoaderConfig;
                }();
                var DEFAULT_CONFIG = {
                    factoryPathPrefix: "",
                    factoryPathSuffix: ".ngfactory"
                };
                var SystemJsNgModuleLoader = function() {
                    function SystemJsNgModuleLoader(_compiler, config) {
                        this._compiler = _compiler;
                        this._config = config || DEFAULT_CONFIG;
                    }
                    SystemJsNgModuleLoader.prototype.load = function(path) {
                        var offlineMode = this._compiler instanceof Compiler;
                        return offlineMode ? this.loadFactory(path) : this.loadAndCompile(path);
                    };
                    SystemJsNgModuleLoader.prototype.loadAndCompile = function(path) {
                        var _this = this;
                        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
                        if (exportName === undefined) {
                            exportName = "default";
                        }
                        return System.import(module).then(function(module) {
                            return module[exportName];
                        }).then(function(type) {
                            return checkNotEmpty(type, module, exportName);
                        }).then(function(type) {
                            return _this._compiler.compileModuleAsync(type);
                        });
                    };
                    SystemJsNgModuleLoader.prototype.loadFactory = function(path) {
                        var _a = path.split(_SEPARATOR), module = _a[0], exportName = _a[1];
                        var factoryClassSuffix = FACTORY_CLASS_SUFFIX;
                        if (exportName === undefined) {
                            exportName = "default";
                            factoryClassSuffix = "";
                        }
                        return System.import(this._config.factoryPathPrefix + module + this._config.factoryPathSuffix).then(function(module) {
                            return module[exportName + factoryClassSuffix];
                        }).then(function(factory) {
                            return checkNotEmpty(factory, module, exportName);
                        });
                    };
                    SystemJsNgModuleLoader.decorators = [ {
                        type: Injectable
                    } ];
                    SystemJsNgModuleLoader.ctorParameters = function() {
                        return [ {
                            type: Compiler
                        }, {
                            type: SystemJsNgModuleLoaderConfig,
                            decorators: [ {
                                type: Optional
                            } ]
                        } ];
                    };
                    return SystemJsNgModuleLoader;
                }();
                function checkNotEmpty(value, modulePath, exportName) {
                    if (!value) {
                        throw new Error("Cannot find '" + exportName + "' in '" + modulePath + "'");
                    }
                    return value;
                }
                var __extends$10 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var TemplateRef = function() {
                    function TemplateRef() {}
                    TemplateRef.prototype.elementRef = function() {};
                    TemplateRef.prototype.createEmbeddedView = function(context) {};
                    return TemplateRef;
                }();
                var TemplateRef_ = function(_super) {
                    __extends$10(TemplateRef_, _super);
                    function TemplateRef_(_parentView, _nodeIndex, _nativeElement) {
                        _super.call(this);
                        this._parentView = _parentView;
                        this._nodeIndex = _nodeIndex;
                        this._nativeElement = _nativeElement;
                    }
                    TemplateRef_.prototype.createEmbeddedView = function(context) {
                        var view = this._parentView.createEmbeddedViewInternal(this._nodeIndex);
                        view.create(context || {});
                        return view.ref;
                    };
                    Object.defineProperty(TemplateRef_.prototype, "elementRef", {
                        get: function() {
                            return new ElementRef(this._nativeElement);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return TemplateRef_;
                }(TemplateRef);
                var ViewContainerRef = function() {
                    function ViewContainerRef() {}
                    ViewContainerRef.prototype.element = function() {};
                    ViewContainerRef.prototype.injector = function() {};
                    ViewContainerRef.prototype.parentInjector = function() {};
                    ViewContainerRef.prototype.clear = function() {};
                    ViewContainerRef.prototype.get = function(index) {};
                    ViewContainerRef.prototype.length = function() {};
                    ViewContainerRef.prototype.createEmbeddedView = function(templateRef, context, index) {};
                    ViewContainerRef.prototype.createComponent = function(componentFactory, index, injector, projectableNodes) {};
                    ViewContainerRef.prototype.insert = function(viewRef, index) {};
                    ViewContainerRef.prototype.move = function(viewRef, currentIndex) {};
                    ViewContainerRef.prototype.indexOf = function(viewRef) {};
                    ViewContainerRef.prototype.remove = function(index) {};
                    ViewContainerRef.prototype.detach = function(index) {};
                    return ViewContainerRef;
                }();
                var ViewContainerRef_ = function() {
                    function ViewContainerRef_(_element) {
                        this._element = _element;
                        this._createComponentInContainerScope = wtfCreateScope("ViewContainerRef#createComponent()");
                        this._insertScope = wtfCreateScope("ViewContainerRef#insert()");
                        this._removeScope = wtfCreateScope("ViewContainerRef#remove()");
                        this._detachScope = wtfCreateScope("ViewContainerRef#detach()");
                    }
                    ViewContainerRef_.prototype.get = function(index) {
                        return this._element.nestedViews[index].ref;
                    };
                    Object.defineProperty(ViewContainerRef_.prototype, "length", {
                        get: function() {
                            var views = this._element.nestedViews;
                            return isPresent(views) ? views.length : 0;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainerRef_.prototype, "element", {
                        get: function() {
                            return this._element.elementRef;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainerRef_.prototype, "injector", {
                        get: function() {
                            return this._element.injector;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
                        get: function() {
                            return this._element.parentInjector;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ViewContainerRef_.prototype.createEmbeddedView = function(templateRef, context, index) {
                        if (context === void 0) {
                            context = null;
                        }
                        if (index === void 0) {
                            index = -1;
                        }
                        var viewRef = templateRef.createEmbeddedView(context);
                        this.insert(viewRef, index);
                        return viewRef;
                    };
                    ViewContainerRef_.prototype.createComponent = function(componentFactory, index, injector, projectableNodes) {
                        if (index === void 0) {
                            index = -1;
                        }
                        if (injector === void 0) {
                            injector = null;
                        }
                        if (projectableNodes === void 0) {
                            projectableNodes = null;
                        }
                        var s = this._createComponentInContainerScope();
                        var contextInjector = injector || this._element.parentInjector;
                        var componentRef = componentFactory.create(contextInjector, projectableNodes);
                        this.insert(componentRef.hostView, index);
                        return wtfLeave(s, componentRef);
                    };
                    ViewContainerRef_.prototype.insert = function(viewRef, index) {
                        if (index === void 0) {
                            index = -1;
                        }
                        var s = this._insertScope();
                        if (index == -1) index = this.length;
                        var viewRef_ = viewRef;
                        this._element.attachView(viewRef_.internalView, index);
                        return wtfLeave(s, viewRef_);
                    };
                    ViewContainerRef_.prototype.move = function(viewRef, currentIndex) {
                        var s = this._insertScope();
                        if (currentIndex == -1) return;
                        var viewRef_ = viewRef;
                        this._element.moveView(viewRef_.internalView, currentIndex);
                        return wtfLeave(s, viewRef_);
                    };
                    ViewContainerRef_.prototype.indexOf = function(viewRef) {
                        return this.length ? this._element.nestedViews.indexOf(viewRef.internalView) : -1;
                    };
                    ViewContainerRef_.prototype.remove = function(index) {
                        if (index === void 0) {
                            index = -1;
                        }
                        var s = this._removeScope();
                        if (index == -1) index = this.length - 1;
                        var view = this._element.detachView(index);
                        view.destroy();
                        wtfLeave(s);
                    };
                    ViewContainerRef_.prototype.detach = function(index) {
                        if (index === void 0) {
                            index = -1;
                        }
                        var s = this._detachScope();
                        if (index == -1) index = this.length - 1;
                        var view = this._element.detachView(index);
                        return wtfLeave(s, view.ref);
                    };
                    ViewContainerRef_.prototype.clear = function() {
                        for (var i = this.length - 1; i >= 0; i--) {
                            this.remove(i);
                        }
                    };
                    return ViewContainerRef_;
                }();
                var __extends$11 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var ViewRef = function(_super) {
                    __extends$11(ViewRef, _super);
                    function ViewRef() {
                        _super.apply(this, arguments);
                    }
                    ViewRef.prototype.destroy = function() {};
                    ViewRef.prototype.destroyed = function() {};
                    ViewRef.prototype.onDestroy = function(callback) {};
                    return ViewRef;
                }(ChangeDetectorRef);
                var EmbeddedViewRef = function(_super) {
                    __extends$11(EmbeddedViewRef, _super);
                    function EmbeddedViewRef() {
                        _super.apply(this, arguments);
                    }
                    EmbeddedViewRef.prototype.context = function() {};
                    EmbeddedViewRef.prototype.rootNodes = function() {};
                    return EmbeddedViewRef;
                }(ViewRef);
                var ViewRef_ = function() {
                    function ViewRef_(_view, animationQueue) {
                        this._view = _view;
                        this.animationQueue = animationQueue;
                        this._view = _view;
                        this._originalMode = this._view.cdMode;
                    }
                    Object.defineProperty(ViewRef_.prototype, "internalView", {
                        get: function() {
                            return this._view;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewRef_.prototype, "rootNodes", {
                        get: function() {
                            return this._view.flatRootNodes;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewRef_.prototype, "context", {
                        get: function() {
                            return this._view.context;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewRef_.prototype, "destroyed", {
                        get: function() {
                            return this._view.destroyed;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ViewRef_.prototype.markForCheck = function() {
                        this._view.markPathToRootAsCheckOnce();
                    };
                    ViewRef_.prototype.detach = function() {
                        this._view.cdMode = ChangeDetectorStatus.Detached;
                    };
                    ViewRef_.prototype.detectChanges = function() {
                        this._view.detectChanges(false);
                        this.animationQueue.flush();
                    };
                    ViewRef_.prototype.checkNoChanges = function() {
                        this._view.detectChanges(true);
                    };
                    ViewRef_.prototype.reattach = function() {
                        this._view.cdMode = this._originalMode;
                        this.markForCheck();
                    };
                    ViewRef_.prototype.onDestroy = function(callback) {
                        if (!this._view.disposables) {
                            this._view.disposables = [];
                        }
                        this._view.disposables.push(callback);
                    };
                    ViewRef_.prototype.destroy = function() {
                        this._view.detachAndDestroy();
                    };
                    return ViewRef_;
                }();
                var __extends$12 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var EventListener = function() {
                    function EventListener(name, callback) {
                        this.name = name;
                        this.callback = callback;
                    }
                    return EventListener;
                }();
                var DebugNode = function() {
                    function DebugNode(nativeNode, parent, _debugInfo) {
                        this._debugInfo = _debugInfo;
                        this.nativeNode = nativeNode;
                        if (parent && parent instanceof DebugElement) {
                            parent.addChild(this);
                        } else {
                            this.parent = null;
                        }
                        this.listeners = [];
                    }
                    Object.defineProperty(DebugNode.prototype, "injector", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.injector : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugNode.prototype, "componentInstance", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.component : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugNode.prototype, "context", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.context : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugNode.prototype, "references", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.references : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugNode.prototype, "providerTokens", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.providerTokens : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugNode.prototype, "source", {
                        get: function() {
                            return this._debugInfo ? this._debugInfo.source : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return DebugNode;
                }();
                var DebugElement = function(_super) {
                    __extends$12(DebugElement, _super);
                    function DebugElement(nativeNode, parent, _debugInfo) {
                        _super.call(this, nativeNode, parent, _debugInfo);
                        this.properties = {};
                        this.attributes = {};
                        this.classes = {};
                        this.styles = {};
                        this.childNodes = [];
                        this.nativeElement = nativeNode;
                    }
                    DebugElement.prototype.addChild = function(child) {
                        if (child) {
                            this.childNodes.push(child);
                            child.parent = this;
                        }
                    };
                    DebugElement.prototype.removeChild = function(child) {
                        var childIndex = this.childNodes.indexOf(child);
                        if (childIndex !== -1) {
                            child.parent = null;
                            this.childNodes.splice(childIndex, 1);
                        }
                    };
                    DebugElement.prototype.insertChildrenAfter = function(child, newChildren) {
                        var siblingIndex = this.childNodes.indexOf(child);
                        if (siblingIndex !== -1) {
                            var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
                            var nextChildren = this.childNodes.slice(siblingIndex + 1);
                            this.childNodes = previousChildren.concat(newChildren, nextChildren);
                            for (var i = 0; i < newChildren.length; ++i) {
                                var newChild = newChildren[i];
                                if (newChild.parent) {
                                    newChild.parent.removeChild(newChild);
                                }
                                newChild.parent = this;
                            }
                        }
                    };
                    DebugElement.prototype.query = function(predicate) {
                        var results = this.queryAll(predicate);
                        return results[0] || null;
                    };
                    DebugElement.prototype.queryAll = function(predicate) {
                        var matches = [];
                        _queryElementChildren(this, predicate, matches);
                        return matches;
                    };
                    DebugElement.prototype.queryAllNodes = function(predicate) {
                        var matches = [];
                        _queryNodeChildren(this, predicate, matches);
                        return matches;
                    };
                    Object.defineProperty(DebugElement.prototype, "children", {
                        get: function() {
                            return this.childNodes.filter(function(node) {
                                return node instanceof DebugElement;
                            });
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DebugElement.prototype.triggerEventHandler = function(eventName, eventObj) {
                        this.listeners.forEach(function(listener) {
                            if (listener.name == eventName) {
                                listener.callback(eventObj);
                            }
                        });
                    };
                    return DebugElement;
                }(DebugNode);
                function asNativeElements(debugEls) {
                    return debugEls.map(function(el) {
                        return el.nativeElement;
                    });
                }
                function _queryElementChildren(element, predicate, matches) {
                    element.childNodes.forEach(function(node) {
                        if (node instanceof DebugElement) {
                            if (predicate(node)) {
                                matches.push(node);
                            }
                            _queryElementChildren(node, predicate, matches);
                        }
                    });
                }
                function _queryNodeChildren(parentNode, predicate, matches) {
                    if (parentNode instanceof DebugElement) {
                        parentNode.childNodes.forEach(function(node) {
                            if (predicate(node)) {
                                matches.push(node);
                            }
                            if (node instanceof DebugElement) {
                                _queryNodeChildren(node, predicate, matches);
                            }
                        });
                    }
                }
                var _nativeNodeToDebugNode = new Map();
                function getDebugNode(nativeNode) {
                    return _nativeNodeToDebugNode.get(nativeNode);
                }
                function indexDebugNode(node) {
                    _nativeNodeToDebugNode.set(node.nativeNode, node);
                }
                function removeDebugNodeFromIndex(node) {
                    _nativeNodeToDebugNode.delete(node.nativeNode);
                }
                function _reflector() {
                    return reflector;
                }
                var _CORE_PLATFORM_PROVIDERS = [ PlatformRef_, {
                    provide: PlatformRef,
                    useExisting: PlatformRef_
                }, {
                    provide: Reflector,
                    useFactory: _reflector,
                    deps: []
                }, {
                    provide: ReflectorReader,
                    useExisting: Reflector
                }, TestabilityRegistry, Console ];
                var platformCore = createPlatformFactory(null, "core", _CORE_PLATFORM_PROVIDERS);
                var LOCALE_ID = new OpaqueToken("LocaleId");
                var TRANSLATIONS = new OpaqueToken("Translations");
                var TRANSLATIONS_FORMAT = new OpaqueToken("TranslationsFormat");
                function _iterableDiffersFactory() {
                    return defaultIterableDiffers;
                }
                function _keyValueDiffersFactory() {
                    return defaultKeyValueDiffers;
                }
                function _localeFactory(locale) {
                    return locale || "en-US";
                }
                var ApplicationModule = function() {
                    function ApplicationModule() {}
                    ApplicationModule.decorators = [ {
                        type: NgModule,
                        args: [ {
                            providers: [ ApplicationRef_, {
                                provide: ApplicationRef,
                                useExisting: ApplicationRef_
                            }, ApplicationInitStatus, Compiler, APP_ID_RANDOM_PROVIDER, ViewUtils, AnimationQueue, {
                                provide: IterableDiffers,
                                useFactory: _iterableDiffersFactory
                            }, {
                                provide: KeyValueDiffers,
                                useFactory: _keyValueDiffersFactory
                            }, {
                                provide: LOCALE_ID,
                                useFactory: _localeFactory,
                                deps: [ [ new Inject(LOCALE_ID), new Optional(), new SkipSelf() ] ]
                            } ]
                        } ]
                    } ];
                    ApplicationModule.ctorParameters = function() {
                        return [];
                    };
                    return ApplicationModule;
                }();
                var FILL_STYLE_FLAG = "true";
                var ANY_STATE = "*";
                var DEFAULT_STATE = "*";
                var EMPTY_STATE = "void";
                var AnimationGroupPlayer = function() {
                    function AnimationGroupPlayer(_players) {
                        var _this = this;
                        this._players = _players;
                        this._onDoneFns = [];
                        this._onStartFns = [];
                        this._finished = false;
                        this._started = false;
                        this._destroyed = false;
                        this.parentPlayer = null;
                        var count = 0;
                        var total = this._players.length;
                        if (total == 0) {
                            scheduleMicroTask(function() {
                                return _this._onFinish();
                            });
                        } else {
                            this._players.forEach(function(player) {
                                player.parentPlayer = _this;
                                player.onDone(function() {
                                    if (++count >= total) {
                                        _this._onFinish();
                                    }
                                });
                            });
                        }
                    }
                    AnimationGroupPlayer.prototype._onFinish = function() {
                        if (!this._finished) {
                            this._finished = true;
                            this._onDoneFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onDoneFns = [];
                        }
                    };
                    AnimationGroupPlayer.prototype.init = function() {
                        this._players.forEach(function(player) {
                            return player.init();
                        });
                    };
                    AnimationGroupPlayer.prototype.onStart = function(fn) {
                        this._onStartFns.push(fn);
                    };
                    AnimationGroupPlayer.prototype.onDone = function(fn) {
                        this._onDoneFns.push(fn);
                    };
                    AnimationGroupPlayer.prototype.hasStarted = function() {
                        return this._started;
                    };
                    AnimationGroupPlayer.prototype.play = function() {
                        if (!isPresent(this.parentPlayer)) {
                            this.init();
                        }
                        if (!this.hasStarted()) {
                            this._onStartFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onStartFns = [];
                            this._started = true;
                        }
                        this._players.forEach(function(player) {
                            return player.play();
                        });
                    };
                    AnimationGroupPlayer.prototype.pause = function() {
                        this._players.forEach(function(player) {
                            return player.pause();
                        });
                    };
                    AnimationGroupPlayer.prototype.restart = function() {
                        this._players.forEach(function(player) {
                            return player.restart();
                        });
                    };
                    AnimationGroupPlayer.prototype.finish = function() {
                        this._onFinish();
                        this._players.forEach(function(player) {
                            return player.finish();
                        });
                    };
                    AnimationGroupPlayer.prototype.destroy = function() {
                        if (!this._destroyed) {
                            this._onFinish();
                            this._players.forEach(function(player) {
                                return player.destroy();
                            });
                            this._destroyed = true;
                        }
                    };
                    AnimationGroupPlayer.prototype.reset = function() {
                        this._players.forEach(function(player) {
                            return player.reset();
                        });
                        this._destroyed = false;
                        this._finished = false;
                        this._started = false;
                    };
                    AnimationGroupPlayer.prototype.setPosition = function(p) {
                        this._players.forEach(function(player) {
                            player.setPosition(p);
                        });
                    };
                    AnimationGroupPlayer.prototype.getPosition = function() {
                        var min = 0;
                        this._players.forEach(function(player) {
                            var p = player.getPosition();
                            min = Math.min(p, min);
                        });
                        return min;
                    };
                    Object.defineProperty(AnimationGroupPlayer.prototype, "players", {
                        get: function() {
                            return this._players;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationGroupPlayer;
                }();
                var AnimationKeyframe = function() {
                    function AnimationKeyframe(offset, styles) {
                        this.offset = offset;
                        this.styles = styles;
                    }
                    return AnimationKeyframe;
                }();
                var AnimationPlayer = function() {
                    function AnimationPlayer() {}
                    AnimationPlayer.prototype.onDone = function(fn) {};
                    AnimationPlayer.prototype.onStart = function(fn) {};
                    AnimationPlayer.prototype.init = function() {};
                    AnimationPlayer.prototype.hasStarted = function() {};
                    AnimationPlayer.prototype.play = function() {};
                    AnimationPlayer.prototype.pause = function() {};
                    AnimationPlayer.prototype.restart = function() {};
                    AnimationPlayer.prototype.finish = function() {};
                    AnimationPlayer.prototype.destroy = function() {};
                    AnimationPlayer.prototype.reset = function() {};
                    AnimationPlayer.prototype.setPosition = function(p) {};
                    AnimationPlayer.prototype.getPosition = function() {};
                    Object.defineProperty(AnimationPlayer.prototype, "parentPlayer", {
                        get: function() {
                            throw new Error("NOT IMPLEMENTED: Base Class");
                        },
                        set: function(player) {
                            throw new Error("NOT IMPLEMENTED: Base Class");
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationPlayer;
                }();
                var NoOpAnimationPlayer = function() {
                    function NoOpAnimationPlayer() {
                        var _this = this;
                        this._onDoneFns = [];
                        this._onStartFns = [];
                        this._started = false;
                        this.parentPlayer = null;
                        scheduleMicroTask(function() {
                            return _this._onFinish();
                        });
                    }
                    NoOpAnimationPlayer.prototype._onFinish = function() {
                        this._onDoneFns.forEach(function(fn) {
                            return fn();
                        });
                        this._onDoneFns = [];
                    };
                    NoOpAnimationPlayer.prototype.onStart = function(fn) {
                        this._onStartFns.push(fn);
                    };
                    NoOpAnimationPlayer.prototype.onDone = function(fn) {
                        this._onDoneFns.push(fn);
                    };
                    NoOpAnimationPlayer.prototype.hasStarted = function() {
                        return this._started;
                    };
                    NoOpAnimationPlayer.prototype.init = function() {};
                    NoOpAnimationPlayer.prototype.play = function() {
                        if (!this.hasStarted()) {
                            this._onStartFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onStartFns = [];
                        }
                        this._started = true;
                    };
                    NoOpAnimationPlayer.prototype.pause = function() {};
                    NoOpAnimationPlayer.prototype.restart = function() {};
                    NoOpAnimationPlayer.prototype.finish = function() {
                        this._onFinish();
                    };
                    NoOpAnimationPlayer.prototype.destroy = function() {};
                    NoOpAnimationPlayer.prototype.reset = function() {};
                    NoOpAnimationPlayer.prototype.setPosition = function(p) {};
                    NoOpAnimationPlayer.prototype.getPosition = function() {
                        return 0;
                    };
                    return NoOpAnimationPlayer;
                }();
                var AnimationSequencePlayer = function() {
                    function AnimationSequencePlayer(_players) {
                        var _this = this;
                        this._players = _players;
                        this._currentIndex = 0;
                        this._onDoneFns = [];
                        this._onStartFns = [];
                        this._finished = false;
                        this._started = false;
                        this._destroyed = false;
                        this.parentPlayer = null;
                        this._players.forEach(function(player) {
                            player.parentPlayer = _this;
                        });
                        this._onNext(false);
                    }
                    AnimationSequencePlayer.prototype._onNext = function(start) {
                        var _this = this;
                        if (this._finished) return;
                        if (this._players.length == 0) {
                            this._activePlayer = new NoOpAnimationPlayer();
                            scheduleMicroTask(function() {
                                return _this._onFinish();
                            });
                        } else if (this._currentIndex >= this._players.length) {
                            this._activePlayer = new NoOpAnimationPlayer();
                            this._onFinish();
                        } else {
                            var player = this._players[this._currentIndex++];
                            player.onDone(function() {
                                return _this._onNext(true);
                            });
                            this._activePlayer = player;
                            if (start) {
                                player.play();
                            }
                        }
                    };
                    AnimationSequencePlayer.prototype._onFinish = function() {
                        if (!this._finished) {
                            this._finished = true;
                            this._onDoneFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onDoneFns = [];
                        }
                    };
                    AnimationSequencePlayer.prototype.init = function() {
                        this._players.forEach(function(player) {
                            return player.init();
                        });
                    };
                    AnimationSequencePlayer.prototype.onStart = function(fn) {
                        this._onStartFns.push(fn);
                    };
                    AnimationSequencePlayer.prototype.onDone = function(fn) {
                        this._onDoneFns.push(fn);
                    };
                    AnimationSequencePlayer.prototype.hasStarted = function() {
                        return this._started;
                    };
                    AnimationSequencePlayer.prototype.play = function() {
                        if (!isPresent(this.parentPlayer)) {
                            this.init();
                        }
                        if (!this.hasStarted()) {
                            this._onStartFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onStartFns = [];
                            this._started = true;
                        }
                        this._activePlayer.play();
                    };
                    AnimationSequencePlayer.prototype.pause = function() {
                        this._activePlayer.pause();
                    };
                    AnimationSequencePlayer.prototype.restart = function() {
                        this.reset();
                        if (this._players.length > 0) {
                            this._players[0].restart();
                        }
                    };
                    AnimationSequencePlayer.prototype.reset = function() {
                        this._players.forEach(function(player) {
                            return player.reset();
                        });
                        this._destroyed = false;
                        this._finished = false;
                        this._started = false;
                    };
                    AnimationSequencePlayer.prototype.finish = function() {
                        this._onFinish();
                        this._players.forEach(function(player) {
                            return player.finish();
                        });
                    };
                    AnimationSequencePlayer.prototype.destroy = function() {
                        if (!this._destroyed) {
                            this._onFinish();
                            this._players.forEach(function(player) {
                                return player.destroy();
                            });
                            this._destroyed = true;
                            this._activePlayer = new NoOpAnimationPlayer();
                        }
                    };
                    AnimationSequencePlayer.prototype.setPosition = function(p) {
                        this._players[0].setPosition(p);
                    };
                    AnimationSequencePlayer.prototype.getPosition = function() {
                        return this._players[0].getPosition();
                    };
                    Object.defineProperty(AnimationSequencePlayer.prototype, "players", {
                        get: function() {
                            return this._players;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationSequencePlayer;
                }();
                var __extends$13 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var AUTO_STYLE = "*";
                var AnimationEntryMetadata = function() {
                    function AnimationEntryMetadata(name, definitions) {
                        this.name = name;
                        this.definitions = definitions;
                    }
                    return AnimationEntryMetadata;
                }();
                var AnimationStateMetadata = function() {
                    function AnimationStateMetadata() {}
                    return AnimationStateMetadata;
                }();
                var AnimationStateDeclarationMetadata = function(_super) {
                    __extends$13(AnimationStateDeclarationMetadata, _super);
                    function AnimationStateDeclarationMetadata(stateNameExpr, styles) {
                        _super.call(this);
                        this.stateNameExpr = stateNameExpr;
                        this.styles = styles;
                    }
                    return AnimationStateDeclarationMetadata;
                }(AnimationStateMetadata);
                var AnimationStateTransitionMetadata = function(_super) {
                    __extends$13(AnimationStateTransitionMetadata, _super);
                    function AnimationStateTransitionMetadata(stateChangeExpr, steps) {
                        _super.call(this);
                        this.stateChangeExpr = stateChangeExpr;
                        this.steps = steps;
                    }
                    return AnimationStateTransitionMetadata;
                }(AnimationStateMetadata);
                var AnimationMetadata = function() {
                    function AnimationMetadata() {}
                    return AnimationMetadata;
                }();
                var AnimationKeyframesSequenceMetadata = function(_super) {
                    __extends$13(AnimationKeyframesSequenceMetadata, _super);
                    function AnimationKeyframesSequenceMetadata(steps) {
                        _super.call(this);
                        this.steps = steps;
                    }
                    return AnimationKeyframesSequenceMetadata;
                }(AnimationMetadata);
                var AnimationStyleMetadata = function(_super) {
                    __extends$13(AnimationStyleMetadata, _super);
                    function AnimationStyleMetadata(styles, offset) {
                        if (offset === void 0) {
                            offset = null;
                        }
                        _super.call(this);
                        this.styles = styles;
                        this.offset = offset;
                    }
                    return AnimationStyleMetadata;
                }(AnimationMetadata);
                var AnimationAnimateMetadata = function(_super) {
                    __extends$13(AnimationAnimateMetadata, _super);
                    function AnimationAnimateMetadata(timings, styles) {
                        _super.call(this);
                        this.timings = timings;
                        this.styles = styles;
                    }
                    return AnimationAnimateMetadata;
                }(AnimationMetadata);
                var AnimationWithStepsMetadata = function(_super) {
                    __extends$13(AnimationWithStepsMetadata, _super);
                    function AnimationWithStepsMetadata() {
                        _super.call(this);
                    }
                    Object.defineProperty(AnimationWithStepsMetadata.prototype, "steps", {
                        get: function() {
                            throw new Error("NOT IMPLEMENTED: Base Class");
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationWithStepsMetadata;
                }(AnimationMetadata);
                var AnimationSequenceMetadata = function(_super) {
                    __extends$13(AnimationSequenceMetadata, _super);
                    function AnimationSequenceMetadata(_steps) {
                        _super.call(this);
                        this._steps = _steps;
                    }
                    Object.defineProperty(AnimationSequenceMetadata.prototype, "steps", {
                        get: function() {
                            return this._steps;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationSequenceMetadata;
                }(AnimationWithStepsMetadata);
                var AnimationGroupMetadata = function(_super) {
                    __extends$13(AnimationGroupMetadata, _super);
                    function AnimationGroupMetadata(_steps) {
                        _super.call(this);
                        this._steps = _steps;
                    }
                    Object.defineProperty(AnimationGroupMetadata.prototype, "steps", {
                        get: function() {
                            return this._steps;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return AnimationGroupMetadata;
                }(AnimationWithStepsMetadata);
                function animate(timing, styles) {
                    if (styles === void 0) {
                        styles = null;
                    }
                    var stylesEntry = styles;
                    if (!isPresent(stylesEntry)) {
                        var EMPTY_STYLE = {};
                        stylesEntry = new AnimationStyleMetadata([ EMPTY_STYLE ], 1);
                    }
                    return new AnimationAnimateMetadata(timing, stylesEntry);
                }
                function group(steps) {
                    return new AnimationGroupMetadata(steps);
                }
                function sequence(steps) {
                    return new AnimationSequenceMetadata(steps);
                }
                function style(tokens) {
                    var input;
                    var offset = null;
                    if (typeof tokens === "string") {
                        input = [ tokens ];
                    } else {
                        if (Array.isArray(tokens)) {
                            input = tokens;
                        } else {
                            input = [ tokens ];
                        }
                        input.forEach(function(entry) {
                            var entryOffset = entry["offset"];
                            if (isPresent(entryOffset)) {
                                offset = offset == null ? parseFloat(entryOffset) : offset;
                            }
                        });
                    }
                    return new AnimationStyleMetadata(input, offset);
                }
                function state(stateNameExpr, styles) {
                    return new AnimationStateDeclarationMetadata(stateNameExpr, styles);
                }
                function keyframes(steps) {
                    return new AnimationKeyframesSequenceMetadata(steps);
                }
                function transition(stateChangeExpr, steps) {
                    var animationData = Array.isArray(steps) ? new AnimationSequenceMetadata(steps) : steps;
                    return new AnimationStateTransitionMetadata(stateChangeExpr, animationData);
                }
                function trigger(name, animation) {
                    return new AnimationEntryMetadata(name, animation);
                }
                function prepareFinalAnimationStyles(previousStyles, newStyles, nullValue) {
                    if (nullValue === void 0) {
                        nullValue = null;
                    }
                    var finalStyles = {};
                    Object.keys(newStyles).forEach(function(prop) {
                        var value = newStyles[prop];
                        finalStyles[prop] = value == AUTO_STYLE ? nullValue : value.toString();
                    });
                    Object.keys(previousStyles).forEach(function(prop) {
                        if (!isPresent(finalStyles[prop])) {
                            finalStyles[prop] = nullValue;
                        }
                    });
                    return finalStyles;
                }
                function balanceAnimationKeyframes(collectedStyles, finalStateStyles, keyframes) {
                    var limit = keyframes.length - 1;
                    var firstKeyframe = keyframes[0];
                    var flatenedFirstKeyframeStyles = flattenStyles(firstKeyframe.styles.styles);
                    var extraFirstKeyframeStyles = {};
                    var hasExtraFirstStyles = false;
                    Object.keys(collectedStyles).forEach(function(prop) {
                        var value = collectedStyles[prop];
                        if (!flatenedFirstKeyframeStyles[prop]) {
                            flatenedFirstKeyframeStyles[prop] = value;
                            extraFirstKeyframeStyles[prop] = value;
                            hasExtraFirstStyles = true;
                        }
                    });
                    var keyframeCollectedStyles = StringMapWrapper.merge({}, flatenedFirstKeyframeStyles);
                    var finalKeyframe = keyframes[limit];
                    finalKeyframe.styles.styles.unshift(finalStateStyles);
                    var flatenedFinalKeyframeStyles = flattenStyles(finalKeyframe.styles.styles);
                    var extraFinalKeyframeStyles = {};
                    var hasExtraFinalStyles = false;
                    Object.keys(keyframeCollectedStyles).forEach(function(prop) {
                        if (!isPresent(flatenedFinalKeyframeStyles[prop])) {
                            extraFinalKeyframeStyles[prop] = AUTO_STYLE;
                            hasExtraFinalStyles = true;
                        }
                    });
                    if (hasExtraFinalStyles) {
                        finalKeyframe.styles.styles.push(extraFinalKeyframeStyles);
                    }
                    Object.keys(flatenedFinalKeyframeStyles).forEach(function(prop) {
                        if (!isPresent(flatenedFirstKeyframeStyles[prop])) {
                            extraFirstKeyframeStyles[prop] = AUTO_STYLE;
                            hasExtraFirstStyles = true;
                        }
                    });
                    if (hasExtraFirstStyles) {
                        firstKeyframe.styles.styles.push(extraFirstKeyframeStyles);
                    }
                    collectAndResolveStyles(collectedStyles, [ finalStateStyles ]);
                    return keyframes;
                }
                function clearStyles(styles) {
                    var finalStyles = {};
                    Object.keys(styles).forEach(function(key) {
                        finalStyles[key] = null;
                    });
                    return finalStyles;
                }
                function collectAndResolveStyles(collection, styles) {
                    return styles.map(function(entry) {
                        var stylesObj = {};
                        Object.keys(entry).forEach(function(prop) {
                            var value = entry[prop];
                            if (value == FILL_STYLE_FLAG) {
                                value = collection[prop];
                                if (!isPresent(value)) {
                                    value = AUTO_STYLE;
                                }
                            }
                            collection[prop] = value;
                            stylesObj[prop] = value;
                        });
                        return stylesObj;
                    });
                }
                function renderStyles(element, renderer, styles) {
                    Object.keys(styles).forEach(function(prop) {
                        renderer.setElementStyle(element, prop, styles[prop]);
                    });
                }
                function flattenStyles(styles) {
                    var finalStyles = {};
                    styles.forEach(function(entry) {
                        Object.keys(entry).forEach(function(prop) {
                            finalStyles[prop] = entry[prop];
                        });
                    });
                    return finalStyles;
                }
                var AnimationStyles = function() {
                    function AnimationStyles(styles) {
                        this.styles = styles;
                    }
                    return AnimationStyles;
                }();
                var AnimationTransitionEvent = function() {
                    function AnimationTransitionEvent(_a) {
                        var fromState = _a.fromState, toState = _a.toState, totalTime = _a.totalTime, phaseName = _a.phaseName;
                        this.fromState = fromState;
                        this.toState = toState;
                        this.totalTime = totalTime;
                        this.phaseName = phaseName;
                    }
                    return AnimationTransitionEvent;
                }();
                var AnimationTransition = function() {
                    function AnimationTransition(_player, _fromState, _toState, _totalTime) {
                        this._player = _player;
                        this._fromState = _fromState;
                        this._toState = _toState;
                        this._totalTime = _totalTime;
                    }
                    AnimationTransition.prototype._createEvent = function(phaseName) {
                        return new AnimationTransitionEvent({
                            fromState: this._fromState,
                            toState: this._toState,
                            totalTime: this._totalTime,
                            phaseName: phaseName
                        });
                    };
                    AnimationTransition.prototype.onStart = function(callback) {
                        var _this = this;
                        var fn = Zone.current.wrap(function() {
                            return callback(_this._createEvent("start"));
                        }, "player.onStart");
                        this._player.onStart(fn);
                    };
                    AnimationTransition.prototype.onDone = function(callback) {
                        var _this = this;
                        var fn = Zone.current.wrap(function() {
                            return callback(_this._createEvent("done"));
                        }, "player.onDone");
                        this._player.onDone(fn);
                    };
                    return AnimationTransition;
                }();
                var DebugDomRootRenderer = function() {
                    function DebugDomRootRenderer(_delegate) {
                        this._delegate = _delegate;
                    }
                    DebugDomRootRenderer.prototype.renderComponent = function(componentProto) {
                        return new DebugDomRenderer(this._delegate.renderComponent(componentProto));
                    };
                    return DebugDomRootRenderer;
                }();
                var DebugDomRenderer = function() {
                    function DebugDomRenderer(_delegate) {
                        this._delegate = _delegate;
                    }
                    DebugDomRenderer.prototype.selectRootElement = function(selectorOrNode, debugInfo) {
                        var nativeEl = this._delegate.selectRootElement(selectorOrNode, debugInfo);
                        var debugEl = new DebugElement(nativeEl, null, debugInfo);
                        indexDebugNode(debugEl);
                        return nativeEl;
                    };
                    DebugDomRenderer.prototype.createElement = function(parentElement, name, debugInfo) {
                        var nativeEl = this._delegate.createElement(parentElement, name, debugInfo);
                        var debugEl = new DebugElement(nativeEl, getDebugNode(parentElement), debugInfo);
                        debugEl.name = name;
                        indexDebugNode(debugEl);
                        return nativeEl;
                    };
                    DebugDomRenderer.prototype.createViewRoot = function(hostElement) {
                        return this._delegate.createViewRoot(hostElement);
                    };
                    DebugDomRenderer.prototype.createTemplateAnchor = function(parentElement, debugInfo) {
                        var comment = this._delegate.createTemplateAnchor(parentElement, debugInfo);
                        var debugEl = new DebugNode(comment, getDebugNode(parentElement), debugInfo);
                        indexDebugNode(debugEl);
                        return comment;
                    };
                    DebugDomRenderer.prototype.createText = function(parentElement, value, debugInfo) {
                        var text = this._delegate.createText(parentElement, value, debugInfo);
                        var debugEl = new DebugNode(text, getDebugNode(parentElement), debugInfo);
                        indexDebugNode(debugEl);
                        return text;
                    };
                    DebugDomRenderer.prototype.projectNodes = function(parentElement, nodes) {
                        var debugParent = getDebugNode(parentElement);
                        if (isPresent(debugParent) && debugParent instanceof DebugElement) {
                            var debugElement_1 = debugParent;
                            nodes.forEach(function(node) {
                                debugElement_1.addChild(getDebugNode(node));
                            });
                        }
                        this._delegate.projectNodes(parentElement, nodes);
                    };
                    DebugDomRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
                        var debugNode = getDebugNode(node);
                        if (isPresent(debugNode)) {
                            var debugParent = debugNode.parent;
                            if (viewRootNodes.length > 0 && isPresent(debugParent)) {
                                var debugViewRootNodes_1 = [];
                                viewRootNodes.forEach(function(rootNode) {
                                    return debugViewRootNodes_1.push(getDebugNode(rootNode));
                                });
                                debugParent.insertChildrenAfter(debugNode, debugViewRootNodes_1);
                            }
                        }
                        this._delegate.attachViewAfter(node, viewRootNodes);
                    };
                    DebugDomRenderer.prototype.detachView = function(viewRootNodes) {
                        viewRootNodes.forEach(function(node) {
                            var debugNode = getDebugNode(node);
                            if (isPresent(debugNode) && isPresent(debugNode.parent)) {
                                debugNode.parent.removeChild(debugNode);
                            }
                        });
                        this._delegate.detachView(viewRootNodes);
                    };
                    DebugDomRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
                        viewAllNodes = viewAllNodes || [];
                        viewAllNodes.forEach(function(node) {
                            removeDebugNodeFromIndex(getDebugNode(node));
                        });
                        this._delegate.destroyView(hostElement, viewAllNodes);
                    };
                    DebugDomRenderer.prototype.listen = function(renderElement, name, callback) {
                        var debugEl = getDebugNode(renderElement);
                        if (isPresent(debugEl)) {
                            debugEl.listeners.push(new EventListener(name, callback));
                        }
                        return this._delegate.listen(renderElement, name, callback);
                    };
                    DebugDomRenderer.prototype.listenGlobal = function(target, name, callback) {
                        return this._delegate.listenGlobal(target, name, callback);
                    };
                    DebugDomRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
                        var debugEl = getDebugNode(renderElement);
                        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                            debugEl.properties[propertyName] = propertyValue;
                        }
                        this._delegate.setElementProperty(renderElement, propertyName, propertyValue);
                    };
                    DebugDomRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
                        var debugEl = getDebugNode(renderElement);
                        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                            debugEl.attributes[attributeName] = attributeValue;
                        }
                        this._delegate.setElementAttribute(renderElement, attributeName, attributeValue);
                    };
                    DebugDomRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
                        this._delegate.setBindingDebugInfo(renderElement, propertyName, propertyValue);
                    };
                    DebugDomRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
                        var debugEl = getDebugNode(renderElement);
                        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                            debugEl.classes[className] = isAdd;
                        }
                        this._delegate.setElementClass(renderElement, className, isAdd);
                    };
                    DebugDomRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
                        var debugEl = getDebugNode(renderElement);
                        if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                            debugEl.styles[styleName] = styleValue;
                        }
                        this._delegate.setElementStyle(renderElement, styleName, styleValue);
                    };
                    DebugDomRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
                        this._delegate.invokeElementMethod(renderElement, methodName, args);
                    };
                    DebugDomRenderer.prototype.setText = function(renderNode, text) {
                        this._delegate.setText(renderNode, text);
                    };
                    DebugDomRenderer.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
                        if (previousPlayers === void 0) {
                            previousPlayers = [];
                        }
                        return this._delegate.animate(element, startingStyles, keyframes, duration, delay, easing, previousPlayers);
                    };
                    return DebugDomRenderer;
                }();
                var ViewType = {};
                ViewType.HOST = 0;
                ViewType.COMPONENT = 1;
                ViewType.EMBEDDED = 2;
                ViewType[ViewType.HOST] = "HOST";
                ViewType[ViewType.COMPONENT] = "COMPONENT";
                ViewType[ViewType.EMBEDDED] = "EMBEDDED";
                var StaticNodeDebugInfo = function() {
                    function StaticNodeDebugInfo(providerTokens, componentToken, refTokens) {
                        this.providerTokens = providerTokens;
                        this.componentToken = componentToken;
                        this.refTokens = refTokens;
                    }
                    return StaticNodeDebugInfo;
                }();
                var DebugContext = function() {
                    function DebugContext(_view, _nodeIndex, _tplRow, _tplCol) {
                        this._view = _view;
                        this._nodeIndex = _nodeIndex;
                        this._tplRow = _tplRow;
                        this._tplCol = _tplCol;
                    }
                    Object.defineProperty(DebugContext.prototype, "_staticNodeInfo", {
                        get: function() {
                            return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "context", {
                        get: function() {
                            return this._view.context;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "component", {
                        get: function() {
                            var staticNodeInfo = this._staticNodeInfo;
                            if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
                                return this.injector.get(staticNodeInfo.componentToken);
                            }
                            return null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "componentRenderElement", {
                        get: function() {
                            var componentView = this._view;
                            while (isPresent(componentView.parentView) && componentView.type !== ViewType.COMPONENT) {
                                componentView = componentView.parentView;
                            }
                            return componentView.parentElement;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "injector", {
                        get: function() {
                            return this._view.injector(this._nodeIndex);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "renderNode", {
                        get: function() {
                            if (isPresent(this._nodeIndex) && this._view.allNodes) {
                                return this._view.allNodes[this._nodeIndex];
                            } else {
                                return null;
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "providerTokens", {
                        get: function() {
                            var staticNodeInfo = this._staticNodeInfo;
                            return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "source", {
                        get: function() {
                            return this._view.componentType.templateUrl + ":" + this._tplRow + ":" + this._tplCol;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DebugContext.prototype, "references", {
                        get: function() {
                            var _this = this;
                            var varValues = {};
                            var staticNodeInfo = this._staticNodeInfo;
                            if (isPresent(staticNodeInfo)) {
                                var refs_1 = staticNodeInfo.refTokens;
                                Object.keys(refs_1).forEach(function(refName) {
                                    var refToken = refs_1[refName];
                                    var varValue;
                                    if (isBlank(refToken)) {
                                        varValue = _this._view.allNodes ? _this._view.allNodes[_this._nodeIndex] : null;
                                    } else {
                                        varValue = _this._view.injectorGet(refToken, _this._nodeIndex, null);
                                    }
                                    varValues[refName] = varValue;
                                });
                            }
                            return varValues;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return DebugContext;
                }();
                var ViewAnimationMap = function() {
                    function ViewAnimationMap() {
                        this._map = new Map();
                        this._allPlayers = [];
                    }
                    ViewAnimationMap.prototype.find = function(element, animationName) {
                        var playersByAnimation = this._map.get(element);
                        if (isPresent(playersByAnimation)) {
                            return playersByAnimation[animationName];
                        }
                    };
                    ViewAnimationMap.prototype.findAllPlayersByElement = function(element) {
                        var el = this._map.get(element);
                        return el ? Object.keys(el).map(function(k) {
                            return el[k];
                        }) : [];
                    };
                    ViewAnimationMap.prototype.set = function(element, animationName, player) {
                        var playersByAnimation = this._map.get(element);
                        if (!isPresent(playersByAnimation)) {
                            playersByAnimation = {};
                        }
                        var existingEntry = playersByAnimation[animationName];
                        if (isPresent(existingEntry)) {
                            this.remove(element, animationName);
                        }
                        playersByAnimation[animationName] = player;
                        this._allPlayers.push(player);
                        this._map.set(element, playersByAnimation);
                    };
                    ViewAnimationMap.prototype.getAllPlayers = function() {
                        return this._allPlayers;
                    };
                    ViewAnimationMap.prototype.remove = function(element, animationName, targetPlayer) {
                        if (targetPlayer === void 0) {
                            targetPlayer = null;
                        }
                        var playersByAnimation = this._map.get(element);
                        if (playersByAnimation) {
                            var player = playersByAnimation[animationName];
                            if (!targetPlayer || player === targetPlayer) {
                                delete playersByAnimation[animationName];
                                var index = this._allPlayers.indexOf(player);
                                this._allPlayers.splice(index, 1);
                                if (Object.keys(playersByAnimation).length === 0) {
                                    this._map.delete(element);
                                }
                            }
                        }
                    };
                    return ViewAnimationMap;
                }();
                var AnimationViewContext = function() {
                    function AnimationViewContext(_animationQueue) {
                        this._animationQueue = _animationQueue;
                        this._players = new ViewAnimationMap();
                    }
                    AnimationViewContext.prototype.onAllActiveAnimationsDone = function(callback) {
                        var activeAnimationPlayers = this._players.getAllPlayers();
                        if (activeAnimationPlayers.length) {
                            new AnimationGroupPlayer(activeAnimationPlayers).onDone(function() {
                                return callback();
                            });
                        } else {
                            callback();
                        }
                    };
                    AnimationViewContext.prototype.queueAnimation = function(element, animationName, player) {
                        var _this = this;
                        this._animationQueue.enqueue(player);
                        this._players.set(element, animationName, player);
                        player.onDone(function() {
                            return _this._players.remove(element, animationName, player);
                        });
                    };
                    AnimationViewContext.prototype.getAnimationPlayers = function(element, animationName) {
                        if (animationName === void 0) {
                            animationName = null;
                        }
                        var players = [];
                        if (animationName) {
                            var currentPlayer = this._players.find(element, animationName);
                            if (currentPlayer) {
                                _recursePlayers(currentPlayer, players);
                            }
                        } else {
                            this._players.findAllPlayersByElement(element).forEach(function(player) {
                                return _recursePlayers(player, players);
                            });
                        }
                        return players;
                    };
                    return AnimationViewContext;
                }();
                function _recursePlayers(player, collectedPlayers) {
                    if (player instanceof AnimationGroupPlayer || player instanceof AnimationSequencePlayer) {
                        player.players.forEach(function(player) {
                            return _recursePlayers(player, collectedPlayers);
                        });
                    } else {
                        collectedPlayers.push(player);
                    }
                }
                var __extends$15 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var ElementInjector = function(_super) {
                    __extends$15(ElementInjector, _super);
                    function ElementInjector(_view, _nodeIndex) {
                        _super.call(this);
                        this._view = _view;
                        this._nodeIndex = _nodeIndex;
                    }
                    ElementInjector.prototype.get = function(token, notFoundValue) {
                        if (notFoundValue === void 0) {
                            notFoundValue = THROW_IF_NOT_FOUND;
                        }
                        return this._view.injectorGet(token, this._nodeIndex, notFoundValue);
                    };
                    return ElementInjector;
                }(Injector);
                var __extends$14 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var _scope_check = wtfCreateScope("AppView#check(ascii id)");
                var EMPTY_CONTEXT = new Object();
                var UNDEFINED$1 = new Object();
                var AppView = function() {
                    function AppView(clazz, componentType, type, viewUtils, parentView, parentIndex, parentElement, cdMode, declaredViewContainer) {
                        if (declaredViewContainer === void 0) {
                            declaredViewContainer = null;
                        }
                        this.clazz = clazz;
                        this.componentType = componentType;
                        this.type = type;
                        this.viewUtils = viewUtils;
                        this.parentView = parentView;
                        this.parentIndex = parentIndex;
                        this.parentElement = parentElement;
                        this.cdMode = cdMode;
                        this.declaredViewContainer = declaredViewContainer;
                        this.numberOfChecks = 0;
                        this.ref = new ViewRef_(this, viewUtils.animationQueue);
                        if (type === ViewType.COMPONENT || type === ViewType.HOST) {
                            this.renderer = viewUtils.renderComponent(componentType);
                        } else {
                            this.renderer = parentView.renderer;
                        }
                        this._directRenderer = this.renderer.directRenderer;
                    }
                    Object.defineProperty(AppView.prototype, "animationContext", {
                        get: function() {
                            if (!this._animationContext) {
                                this._animationContext = new AnimationViewContext(this.viewUtils.animationQueue);
                            }
                            return this._animationContext;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(AppView.prototype, "destroyed", {
                        get: function() {
                            return this.cdMode === ChangeDetectorStatus.Destroyed;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    AppView.prototype.create = function(context) {
                        this.context = context;
                        return this.createInternal(null);
                    };
                    AppView.prototype.createHostView = function(rootSelectorOrNode, hostInjector, projectableNodes) {
                        this.context = EMPTY_CONTEXT;
                        this._hasExternalHostElement = isPresent(rootSelectorOrNode);
                        this._hostInjector = hostInjector;
                        this._hostProjectableNodes = projectableNodes;
                        return this.createInternal(rootSelectorOrNode);
                    };
                    AppView.prototype.createInternal = function(rootSelectorOrNode) {
                        return null;
                    };
                    AppView.prototype.createEmbeddedViewInternal = function(templateNodeIndex) {
                        return null;
                    };
                    AppView.prototype.init = function(lastRootNode, allNodes, disposables) {
                        this.lastRootNode = lastRootNode;
                        this.allNodes = allNodes;
                        this.disposables = disposables;
                        if (this.type === ViewType.COMPONENT) {
                            this.dirtyParentQueriesInternal();
                        }
                    };
                    AppView.prototype.injectorGet = function(token, nodeIndex, notFoundValue) {
                        if (notFoundValue === void 0) {
                            notFoundValue = THROW_IF_NOT_FOUND;
                        }
                        var result = UNDEFINED$1;
                        var view = this;
                        while (result === UNDEFINED$1) {
                            if (isPresent(nodeIndex)) {
                                result = view.injectorGetInternal(token, nodeIndex, UNDEFINED$1);
                            }
                            if (result === UNDEFINED$1 && view.type === ViewType.HOST) {
                                result = view._hostInjector.get(token, notFoundValue);
                            }
                            nodeIndex = view.parentIndex;
                            view = view.parentView;
                        }
                        return result;
                    };
                    AppView.prototype.injectorGetInternal = function(token, nodeIndex, notFoundResult) {
                        return notFoundResult;
                    };
                    AppView.prototype.injector = function(nodeIndex) {
                        return new ElementInjector(this, nodeIndex);
                    };
                    AppView.prototype.detachAndDestroy = function() {
                        if (this.viewContainer) {
                            this.viewContainer.detachView(this.viewContainer.nestedViews.indexOf(this));
                        } else if (this.appRef) {
                            this.appRef.detachView(this.ref);
                        } else if (this._hasExternalHostElement) {
                            this.detach();
                        }
                        this.destroy();
                    };
                    AppView.prototype.destroy = function() {
                        var _this = this;
                        if (this.cdMode === ChangeDetectorStatus.Destroyed) {
                            return;
                        }
                        var hostElement = this.type === ViewType.COMPONENT ? this.parentElement : null;
                        if (this.disposables) {
                            for (var i = 0; i < this.disposables.length; i++) {
                                this.disposables[i]();
                            }
                        }
                        this.destroyInternal();
                        this.dirtyParentQueriesInternal();
                        if (this._animationContext) {
                            this._animationContext.onAllActiveAnimationsDone(function() {
                                return _this.renderer.destroyView(hostElement, _this.allNodes);
                            });
                        } else {
                            this.renderer.destroyView(hostElement, this.allNodes);
                        }
                        this.cdMode = ChangeDetectorStatus.Destroyed;
                    };
                    AppView.prototype.destroyInternal = function() {};
                    AppView.prototype.detachInternal = function() {};
                    AppView.prototype.detach = function() {
                        var _this = this;
                        this.detachInternal();
                        if (this._animationContext) {
                            this._animationContext.onAllActiveAnimationsDone(function() {
                                return _this._renderDetach();
                            });
                        } else {
                            this._renderDetach();
                        }
                        if (this.declaredViewContainer && this.declaredViewContainer !== this.viewContainer && this.declaredViewContainer.projectedViews) {
                            var projectedViews = this.declaredViewContainer.projectedViews;
                            var index = projectedViews.indexOf(this);
                            if (index >= projectedViews.length - 1) {
                                projectedViews.pop();
                            } else {
                                projectedViews.splice(index, 1);
                            }
                        }
                        this.appRef = null;
                        this.viewContainer = null;
                        this.dirtyParentQueriesInternal();
                    };
                    AppView.prototype._renderDetach = function() {
                        if (this._directRenderer) {
                            this.visitRootNodesInternal(this._directRenderer.remove, null);
                        } else {
                            this.renderer.detachView(this.flatRootNodes);
                        }
                    };
                    AppView.prototype.attachToAppRef = function(appRef) {
                        if (this.viewContainer) {
                            throw new Error("This view is already attached to a ViewContainer!");
                        }
                        this.appRef = appRef;
                        this.dirtyParentQueriesInternal();
                    };
                    AppView.prototype.attachAfter = function(viewContainer, prevView) {
                        if (this.appRef) {
                            throw new Error("This view is already attached directly to the ApplicationRef!");
                        }
                        this._renderAttach(viewContainer, prevView);
                        this.viewContainer = viewContainer;
                        if (this.declaredViewContainer && this.declaredViewContainer !== viewContainer) {
                            if (!this.declaredViewContainer.projectedViews) {
                                this.declaredViewContainer.projectedViews = [];
                            }
                            this.declaredViewContainer.projectedViews.push(this);
                        }
                        this.dirtyParentQueriesInternal();
                    };
                    AppView.prototype.moveAfter = function(viewContainer, prevView) {
                        this._renderAttach(viewContainer, prevView);
                        this.dirtyParentQueriesInternal();
                    };
                    AppView.prototype._renderAttach = function(viewContainer, prevView) {
                        var prevNode = prevView ? prevView.lastRootNode : viewContainer.nativeElement;
                        if (this._directRenderer) {
                            var nextSibling = this._directRenderer.nextSibling(prevNode);
                            if (nextSibling) {
                                this.visitRootNodesInternal(this._directRenderer.insertBefore, nextSibling);
                            } else {
                                var parentElement = this._directRenderer.parentElement(prevNode);
                                if (parentElement) {
                                    this.visitRootNodesInternal(this._directRenderer.appendChild, parentElement);
                                }
                            }
                        } else {
                            this.renderer.attachViewAfter(prevNode, this.flatRootNodes);
                        }
                    };
                    Object.defineProperty(AppView.prototype, "changeDetectorRef", {
                        get: function() {
                            return this.ref;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(AppView.prototype, "flatRootNodes", {
                        get: function() {
                            var nodes = [];
                            this.visitRootNodesInternal(addToArray, nodes);
                            return nodes;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    AppView.prototype.projectNodes = function(parentElement, ngContentIndex) {
                        if (this._directRenderer) {
                            this.visitProjectedNodes(ngContentIndex, this._directRenderer.appendChild, parentElement);
                        } else {
                            var nodes = [];
                            this.visitProjectedNodes(ngContentIndex, addToArray, nodes);
                            this.renderer.projectNodes(parentElement, nodes);
                        }
                    };
                    AppView.prototype.visitProjectedNodes = function(ngContentIndex, cb, c) {
                        switch (this.type) {
                          case ViewType.EMBEDDED:
                            this.parentView.visitProjectedNodes(ngContentIndex, cb, c);
                            break;

                          case ViewType.COMPONENT:
                            if (this.parentView.type === ViewType.HOST) {
                                var nodes = this.parentView._hostProjectableNodes[ngContentIndex] || [];
                                for (var i = 0; i < nodes.length; i++) {
                                    cb(nodes[i], c);
                                }
                            } else {
                                this.parentView.visitProjectableNodesInternal(this.parentIndex, ngContentIndex, cb, c);
                            }
                            break;
                        }
                    };
                    AppView.prototype.visitRootNodesInternal = function(cb, c) {};
                    AppView.prototype.visitProjectableNodesInternal = function(nodeIndex, ngContentIndex, cb, c) {};
                    AppView.prototype.dirtyParentQueriesInternal = function() {};
                    AppView.prototype.internalDetectChanges = function(throwOnChange) {
                        if (this.cdMode !== ChangeDetectorStatus.Detached) {
                            this.detectChanges(throwOnChange);
                        }
                    };
                    AppView.prototype.detectChanges = function(throwOnChange) {
                        var s = _scope_check(this.clazz);
                        if (this.cdMode === ChangeDetectorStatus.Checked || this.cdMode === ChangeDetectorStatus.Errored) return;
                        if (this.cdMode === ChangeDetectorStatus.Destroyed) {
                            this.throwDestroyedError("detectChanges");
                        }
                        this.detectChangesInternal(throwOnChange);
                        if (this.cdMode === ChangeDetectorStatus.CheckOnce) this.cdMode = ChangeDetectorStatus.Checked;
                        this.numberOfChecks++;
                        wtfLeave(s);
                    };
                    AppView.prototype.detectChangesInternal = function(throwOnChange) {};
                    AppView.prototype.markAsCheckOnce = function() {
                        this.cdMode = ChangeDetectorStatus.CheckOnce;
                    };
                    AppView.prototype.markPathToRootAsCheckOnce = function() {
                        var c = this;
                        while (isPresent(c) && c.cdMode !== ChangeDetectorStatus.Detached) {
                            if (c.cdMode === ChangeDetectorStatus.Checked) {
                                c.cdMode = ChangeDetectorStatus.CheckOnce;
                            }
                            if (c.type === ViewType.COMPONENT) {
                                c = c.parentView;
                            } else {
                                c = c.viewContainer ? c.viewContainer.parentView : null;
                            }
                        }
                    };
                    AppView.prototype.eventHandler = function(cb) {
                        return cb;
                    };
                    AppView.prototype.throwDestroyedError = function(details) {
                        throw new ViewDestroyedError(details);
                    };
                    return AppView;
                }();
                var DebugAppView = function(_super) {
                    __extends$14(DebugAppView, _super);
                    function DebugAppView(clazz, componentType, type, viewUtils, parentView, parentIndex, parentNode, cdMode, staticNodeDebugInfos, declaredViewContainer) {
                        if (declaredViewContainer === void 0) {
                            declaredViewContainer = null;
                        }
                        _super.call(this, clazz, componentType, type, viewUtils, parentView, parentIndex, parentNode, cdMode, declaredViewContainer);
                        this.staticNodeDebugInfos = staticNodeDebugInfos;
                        this._currentDebugContext = null;
                    }
                    DebugAppView.prototype.create = function(context) {
                        this._resetDebug();
                        try {
                            return _super.prototype.create.call(this, context);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype.createHostView = function(rootSelectorOrNode, injector, projectableNodes) {
                        if (projectableNodes === void 0) {
                            projectableNodes = null;
                        }
                        this._resetDebug();
                        try {
                            return _super.prototype.createHostView.call(this, rootSelectorOrNode, injector, projectableNodes);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype.injectorGet = function(token, nodeIndex, notFoundResult) {
                        this._resetDebug();
                        try {
                            return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype.detach = function() {
                        this._resetDebug();
                        try {
                            _super.prototype.detach.call(this);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype.destroy = function() {
                        this._resetDebug();
                        try {
                            _super.prototype.destroy.call(this);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype.detectChanges = function(throwOnChange) {
                        this._resetDebug();
                        try {
                            _super.prototype.detectChanges.call(this, throwOnChange);
                        } catch (e) {
                            this._rethrowWithContext(e);
                            throw e;
                        }
                    };
                    DebugAppView.prototype._resetDebug = function() {
                        this._currentDebugContext = null;
                    };
                    DebugAppView.prototype.debug = function(nodeIndex, rowNum, colNum) {
                        return this._currentDebugContext = new DebugContext(this, nodeIndex, rowNum, colNum);
                    };
                    DebugAppView.prototype._rethrowWithContext = function(e) {
                        if (!(e instanceof ViewWrappedError)) {
                            if (!(e instanceof ExpressionChangedAfterItHasBeenCheckedError)) {
                                this.cdMode = ChangeDetectorStatus.Errored;
                            }
                            if (isPresent(this._currentDebugContext)) {
                                throw new ViewWrappedError(e, this._currentDebugContext);
                            }
                        }
                    };
                    DebugAppView.prototype.eventHandler = function(cb) {
                        var _this = this;
                        var superHandler = _super.prototype.eventHandler.call(this, cb);
                        return function(eventName, event) {
                            _this._resetDebug();
                            try {
                                return superHandler.call(_this, eventName, event);
                            } catch (e) {
                                _this._rethrowWithContext(e);
                                throw e;
                            }
                        };
                    };
                    return DebugAppView;
                }(AppView);
                var ViewContainer = function() {
                    function ViewContainer(index, parentIndex, parentView, nativeElement) {
                        this.index = index;
                        this.parentIndex = parentIndex;
                        this.parentView = parentView;
                        this.nativeElement = nativeElement;
                    }
                    Object.defineProperty(ViewContainer.prototype, "elementRef", {
                        get: function() {
                            return new ElementRef(this.nativeElement);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainer.prototype, "vcRef", {
                        get: function() {
                            return new ViewContainerRef_(this);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainer.prototype, "parentInjector", {
                        get: function() {
                            return this.parentView.injector(this.parentIndex);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(ViewContainer.prototype, "injector", {
                        get: function() {
                            return this.parentView.injector(this.index);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ViewContainer.prototype.detectChangesInNestedViews = function(throwOnChange) {
                        if (this.nestedViews) {
                            for (var i = 0; i < this.nestedViews.length; i++) {
                                this.nestedViews[i].detectChanges(throwOnChange);
                            }
                        }
                    };
                    ViewContainer.prototype.destroyNestedViews = function() {
                        if (this.nestedViews) {
                            for (var i = 0; i < this.nestedViews.length; i++) {
                                this.nestedViews[i].destroy();
                            }
                        }
                    };
                    ViewContainer.prototype.visitNestedViewRootNodes = function(cb, c) {
                        if (this.nestedViews) {
                            for (var i = 0; i < this.nestedViews.length; i++) {
                                this.nestedViews[i].visitRootNodesInternal(cb, c);
                            }
                        }
                    };
                    ViewContainer.prototype.mapNestedViews = function(nestedViewClass, callback) {
                        var result = [];
                        if (this.nestedViews) {
                            for (var i = 0; i < this.nestedViews.length; i++) {
                                var nestedView = this.nestedViews[i];
                                if (nestedView.clazz === nestedViewClass) {
                                    result.push(callback(nestedView));
                                }
                            }
                        }
                        if (this.projectedViews) {
                            for (var i = 0; i < this.projectedViews.length; i++) {
                                var projectedView = this.projectedViews[i];
                                if (projectedView.clazz === nestedViewClass) {
                                    result.push(callback(projectedView));
                                }
                            }
                        }
                        return result;
                    };
                    ViewContainer.prototype.moveView = function(view, currentIndex) {
                        var previousIndex = this.nestedViews.indexOf(view);
                        if (view.type === ViewType.COMPONENT) {
                            throw new Error("Component views can't be moved!");
                        }
                        var nestedViews = this.nestedViews;
                        if (nestedViews == null) {
                            nestedViews = [];
                            this.nestedViews = nestedViews;
                        }
                        nestedViews.splice(previousIndex, 1);
                        nestedViews.splice(currentIndex, 0, view);
                        var prevView = currentIndex > 0 ? nestedViews[currentIndex - 1] : null;
                        view.moveAfter(this, prevView);
                    };
                    ViewContainer.prototype.attachView = function(view, viewIndex) {
                        if (view.type === ViewType.COMPONENT) {
                            throw new Error("Component views can't be moved!");
                        }
                        var nestedViews = this.nestedViews;
                        if (nestedViews == null) {
                            nestedViews = [];
                            this.nestedViews = nestedViews;
                        }
                        if (viewIndex >= nestedViews.length) {
                            nestedViews.push(view);
                        } else {
                            nestedViews.splice(viewIndex, 0, view);
                        }
                        var prevView = viewIndex > 0 ? nestedViews[viewIndex - 1] : null;
                        view.attachAfter(this, prevView);
                    };
                    ViewContainer.prototype.detachView = function(viewIndex) {
                        var view = this.nestedViews[viewIndex];
                        if (viewIndex >= this.nestedViews.length - 1) {
                            this.nestedViews.pop();
                        } else {
                            this.nestedViews.splice(viewIndex, 1);
                        }
                        if (view.type === ViewType.COMPONENT) {
                            throw new Error("Component views can't be moved!");
                        }
                        view.detach();
                        return view;
                    };
                    return ViewContainer;
                }();
                var __core_private__ = {
                    isDefaultChangeDetectionStrategy: isDefaultChangeDetectionStrategy,
                    ChangeDetectorStatus: ChangeDetectorStatus,
                    constructDependencies: constructDependencies,
                    LifecycleHooks: LifecycleHooks,
                    LIFECYCLE_HOOKS_VALUES: LIFECYCLE_HOOKS_VALUES,
                    ReflectorReader: ReflectorReader,
                    CodegenComponentFactoryResolver: CodegenComponentFactoryResolver,
                    ComponentRef_: ComponentRef_,
                    ViewContainer: ViewContainer,
                    AppView: AppView,
                    DebugAppView: DebugAppView,
                    NgModuleInjector: NgModuleInjector,
                    registerModuleFactory: registerModuleFactory,
                    ViewType: ViewType,
                    view_utils: view_utils,
                    ViewMetadata: ViewMetadata,
                    DebugContext: DebugContext,
                    StaticNodeDebugInfo: StaticNodeDebugInfo,
                    devModeEqual: devModeEqual,
                    UNINITIALIZED: UNINITIALIZED,
                    ValueUnwrapper: ValueUnwrapper,
                    RenderDebugInfo: RenderDebugInfo,
                    TemplateRef_: TemplateRef_,
                    ReflectionCapabilities: ReflectionCapabilities,
                    makeDecorator: makeDecorator,
                    DebugDomRootRenderer: DebugDomRootRenderer,
                    Console: Console,
                    reflector: reflector,
                    Reflector: Reflector,
                    NoOpAnimationPlayer: NoOpAnimationPlayer,
                    AnimationPlayer: AnimationPlayer,
                    AnimationSequencePlayer: AnimationSequencePlayer,
                    AnimationGroupPlayer: AnimationGroupPlayer,
                    AnimationKeyframe: AnimationKeyframe,
                    prepareFinalAnimationStyles: prepareFinalAnimationStyles,
                    balanceAnimationKeyframes: balanceAnimationKeyframes,
                    flattenStyles: flattenStyles,
                    clearStyles: clearStyles,
                    renderStyles: renderStyles,
                    collectAndResolveStyles: collectAndResolveStyles,
                    APP_ID_RANDOM_PROVIDER: APP_ID_RANDOM_PROVIDER,
                    AnimationStyles: AnimationStyles,
                    ANY_STATE: ANY_STATE,
                    DEFAULT_STATE: DEFAULT_STATE,
                    EMPTY_STATE: EMPTY_STATE,
                    FILL_STYLE_FLAG: FILL_STYLE_FLAG,
                    ComponentStillLoadingError: ComponentStillLoadingError,
                    isPromise: isPromise,
                    isObservable: isObservable,
                    AnimationTransition: AnimationTransition
                };
                exports.createPlatform = createPlatform;
                exports.assertPlatform = assertPlatform;
                exports.destroyPlatform = destroyPlatform;
                exports.getPlatform = getPlatform;
                exports.PlatformRef = PlatformRef;
                exports.ApplicationRef = ApplicationRef;
                exports.enableProdMode = enableProdMode;
                exports.isDevMode = isDevMode;
                exports.createPlatformFactory = createPlatformFactory;
                exports.NgProbeToken = NgProbeToken;
                exports.APP_ID = APP_ID;
                exports.PACKAGE_ROOT_URL = PACKAGE_ROOT_URL;
                exports.PLATFORM_INITIALIZER = PLATFORM_INITIALIZER;
                exports.APP_BOOTSTRAP_LISTENER = APP_BOOTSTRAP_LISTENER;
                exports.APP_INITIALIZER = APP_INITIALIZER;
                exports.ApplicationInitStatus = ApplicationInitStatus;
                exports.DebugElement = DebugElement;
                exports.DebugNode = DebugNode;
                exports.asNativeElements = asNativeElements;
                exports.getDebugNode = getDebugNode;
                exports.Testability = Testability;
                exports.TestabilityRegistry = TestabilityRegistry;
                exports.setTestabilityGetter = setTestabilityGetter;
                exports.TRANSLATIONS = TRANSLATIONS;
                exports.TRANSLATIONS_FORMAT = TRANSLATIONS_FORMAT;
                exports.LOCALE_ID = LOCALE_ID;
                exports.ApplicationModule = ApplicationModule;
                exports.wtfCreateScope = wtfCreateScope;
                exports.wtfLeave = wtfLeave;
                exports.wtfStartTimeRange = wtfStartTimeRange;
                exports.wtfEndTimeRange = wtfEndTimeRange;
                exports.Type = Type;
                exports.EventEmitter = EventEmitter;
                exports.ErrorHandler = ErrorHandler;
                exports.AnimationTransitionEvent = AnimationTransitionEvent;
                exports.AnimationPlayer = AnimationPlayer;
                exports.AnimationStyles = AnimationStyles;
                exports.AnimationKeyframe = AnimationKeyframe;
                exports.Sanitizer = Sanitizer;
                exports.SecurityContext = SecurityContext;
                exports.ANALYZE_FOR_ENTRY_COMPONENTS = ANALYZE_FOR_ENTRY_COMPONENTS;
                exports.Attribute = Attribute;
                exports.ContentChild = ContentChild;
                exports.ContentChildren = ContentChildren;
                exports.Query = Query;
                exports.ViewChild = ViewChild;
                exports.ViewChildren = ViewChildren;
                exports.Component = Component;
                exports.Directive = Directive;
                exports.HostBinding = HostBinding;
                exports.HostListener = HostListener;
                exports.Input = Input;
                exports.Output = Output;
                exports.Pipe = Pipe;
                exports.AfterContentChecked = AfterContentChecked;
                exports.AfterContentInit = AfterContentInit;
                exports.AfterViewChecked = AfterViewChecked;
                exports.AfterViewInit = AfterViewInit;
                exports.DoCheck = DoCheck;
                exports.OnChanges = OnChanges;
                exports.OnDestroy = OnDestroy;
                exports.OnInit = OnInit;
                exports.CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
                exports.NO_ERRORS_SCHEMA = NO_ERRORS_SCHEMA;
                exports.NgModule = NgModule;
                exports.ViewEncapsulation = ViewEncapsulation;
                exports.Version = Version;
                exports.VERSION = VERSION;
                exports.Class = Class;
                exports.forwardRef = forwardRef;
                exports.resolveForwardRef = resolveForwardRef;
                exports.Injector = Injector;
                exports.ReflectiveInjector = ReflectiveInjector;
                exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
                exports.ReflectiveKey = ReflectiveKey;
                exports.OpaqueToken = OpaqueToken;
                exports.Inject = Inject;
                exports.Optional = Optional;
                exports.Injectable = Injectable;
                exports.Self = Self;
                exports.SkipSelf = SkipSelf;
                exports.Host = Host;
                exports.NgZone = NgZone;
                exports.RenderComponentType = RenderComponentType;
                exports.Renderer = Renderer;
                exports.RootRenderer = RootRenderer;
                exports.COMPILER_OPTIONS = COMPILER_OPTIONS;
                exports.Compiler = Compiler;
                exports.CompilerFactory = CompilerFactory;
                exports.ModuleWithComponentFactories = ModuleWithComponentFactories;
                exports.ComponentFactory = ComponentFactory;
                exports.ComponentRef = ComponentRef;
                exports.ComponentFactoryResolver = ComponentFactoryResolver;
                exports.ElementRef = ElementRef;
                exports.NgModuleFactory = NgModuleFactory;
                exports.NgModuleRef = NgModuleRef;
                exports.NgModuleFactoryLoader = NgModuleFactoryLoader;
                exports.getModuleFactory = getModuleFactory;
                exports.QueryList = QueryList;
                exports.SystemJsNgModuleLoader = SystemJsNgModuleLoader;
                exports.SystemJsNgModuleLoaderConfig = SystemJsNgModuleLoaderConfig;
                exports.TemplateRef = TemplateRef;
                exports.ViewContainerRef = ViewContainerRef;
                exports.EmbeddedViewRef = EmbeddedViewRef;
                exports.ViewRef = ViewRef;
                exports.ChangeDetectionStrategy = ChangeDetectionStrategy;
                exports.ChangeDetectorRef = ChangeDetectorRef;
                exports.CollectionChangeRecord = CollectionChangeRecord;
                exports.DefaultIterableDiffer = DefaultIterableDiffer;
                exports.IterableDiffers = IterableDiffers;
                exports.KeyValueChangeRecord = KeyValueChangeRecord;
                exports.KeyValueDiffers = KeyValueDiffers;
                exports.SimpleChange = SimpleChange;
                exports.WrappedValue = WrappedValue;
                exports.platformCore = platformCore;
                exports.__core_private__ = __core_private__;
                exports.AUTO_STYLE = AUTO_STYLE;
                exports.AnimationEntryMetadata = AnimationEntryMetadata;
                exports.AnimationStateMetadata = AnimationStateMetadata;
                exports.AnimationStateDeclarationMetadata = AnimationStateDeclarationMetadata;
                exports.AnimationStateTransitionMetadata = AnimationStateTransitionMetadata;
                exports.AnimationMetadata = AnimationMetadata;
                exports.AnimationKeyframesSequenceMetadata = AnimationKeyframesSequenceMetadata;
                exports.AnimationStyleMetadata = AnimationStyleMetadata;
                exports.AnimationAnimateMetadata = AnimationAnimateMetadata;
                exports.AnimationWithStepsMetadata = AnimationWithStepsMetadata;
                exports.AnimationSequenceMetadata = AnimationSequenceMetadata;
                exports.AnimationGroupMetadata = AnimationGroupMetadata;
                exports.animate = animate;
                exports.group = group;
                exports.sequence = sequence;
                exports.style = style;
                exports.state = state;
                exports.keyframes = keyframes;
                exports.transition = transition;
                exports.trigger = trigger;
            });
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var root_1 = __webpack_require__(4);
        function getSymbolObservable(context) {
            var $$observable;
            var Symbol = context.Symbol;
            if (typeof Symbol === "function") {
                if (Symbol.observable) {
                    $$observable = Symbol.observable;
                } else {
                    $$observable = Symbol("observable");
                    Symbol.observable = $$observable;
                }
            } else {
                $$observable = "@@observable";
            }
            return $$observable;
        }
        exports.getSymbolObservable = getSymbolObservable;
        exports.observable = getSymbolObservable(root_1.root);
        exports.$$observable = exports.observable;
    }, function(module, exports) {
        (function(global) {
            "use strict";
            var __window = typeof window !== "undefined" && window;
            var __self = typeof self !== "undefined" && typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && self;
            var __global = typeof global !== "undefined" && global;
            var _root = __window || __global || __self;
            exports.root = _root;
            (function() {
                if (!_root) {
                    throw new Error("RxJS could not find any global context (window, self, global)");
                }
            })();
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __extends = this && this.__extends || function(d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Observable_1 = __webpack_require__(6);
        var Subscriber_1 = __webpack_require__(8);
        var Subscription_1 = __webpack_require__(10);
        var ObjectUnsubscribedError_1 = __webpack_require__(18);
        var SubjectSubscription_1 = __webpack_require__(19);
        var rxSubscriber_1 = __webpack_require__(17);
        var SubjectSubscriber = function(_super) {
            __extends(SubjectSubscriber, _super);
            function SubjectSubscriber(destination) {
                _super.call(this, destination);
                this.destination = destination;
            }
            return SubjectSubscriber;
        }(Subscriber_1.Subscriber);
        exports.SubjectSubscriber = SubjectSubscriber;
        var Subject = function(_super) {
            __extends(Subject, _super);
            function Subject() {
                _super.call(this);
                this.observers = [];
                this.closed = false;
                this.isStopped = false;
                this.hasError = false;
                this.thrownError = null;
            }
            Subject.prototype[rxSubscriber_1.rxSubscriber] = function() {
                return new SubjectSubscriber(this);
            };
            Subject.prototype.lift = function(operator) {
                var subject = new AnonymousSubject(this, this);
                subject.operator = operator;
                return subject;
            };
            Subject.prototype.next = function(value) {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                }
                if (!this.isStopped) {
                    var observers = this.observers;
                    var len = observers.length;
                    var copy = observers.slice();
                    for (var i = 0; i < len; i++) {
                        copy[i].next(value);
                    }
                }
            };
            Subject.prototype.error = function(err) {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                }
                this.hasError = true;
                this.thrownError = err;
                this.isStopped = true;
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].error(err);
                }
                this.observers.length = 0;
            };
            Subject.prototype.complete = function() {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                }
                this.isStopped = true;
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].complete();
                }
                this.observers.length = 0;
            };
            Subject.prototype.unsubscribe = function() {
                this.isStopped = true;
                this.closed = true;
                this.observers = null;
            };
            Subject.prototype._trySubscribe = function(subscriber) {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                } else {
                    return _super.prototype._trySubscribe.call(this, subscriber);
                }
            };
            Subject.prototype._subscribe = function(subscriber) {
                if (this.closed) {
                    throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
                } else if (this.hasError) {
                    subscriber.error(this.thrownError);
                    return Subscription_1.Subscription.EMPTY;
                } else if (this.isStopped) {
                    subscriber.complete();
                    return Subscription_1.Subscription.EMPTY;
                } else {
                    this.observers.push(subscriber);
                    return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
                }
            };
            Subject.prototype.asObservable = function() {
                var observable = new Observable_1.Observable();
                observable.source = this;
                return observable;
            };
            Subject.create = function(destination, source) {
                return new AnonymousSubject(destination, source);
            };
            return Subject;
        }(Observable_1.Observable);
        exports.Subject = Subject;
        var AnonymousSubject = function(_super) {
            __extends(AnonymousSubject, _super);
            function AnonymousSubject(destination, source) {
                _super.call(this);
                this.destination = destination;
                this.source = source;
            }
            AnonymousSubject.prototype.next = function(value) {
                var destination = this.destination;
                if (destination && destination.next) {
                    destination.next(value);
                }
            };
            AnonymousSubject.prototype.error = function(err) {
                var destination = this.destination;
                if (destination && destination.error) {
                    this.destination.error(err);
                }
            };
            AnonymousSubject.prototype.complete = function() {
                var destination = this.destination;
                if (destination && destination.complete) {
                    this.destination.complete();
                }
            };
            AnonymousSubject.prototype._subscribe = function(subscriber) {
                var source = this.source;
                if (source) {
                    return this.source.subscribe(subscriber);
                } else {
                    return Subscription_1.Subscription.EMPTY;
                }
            };
            return AnonymousSubject;
        }(Subject);
        exports.AnonymousSubject = AnonymousSubject;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var root_1 = __webpack_require__(4);
        var toSubscriber_1 = __webpack_require__(7);
        var observable_1 = __webpack_require__(3);
        var Observable = function() {
            function Observable(subscribe) {
                this._isScalar = false;
                if (subscribe) {
                    this._subscribe = subscribe;
                }
            }
            Observable.prototype.lift = function(operator) {
                var observable = new Observable();
                observable.source = this;
                observable.operator = operator;
                return observable;
            };
            Observable.prototype.subscribe = function(observerOrNext, error, complete) {
                var operator = this.operator;
                var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
                if (operator) {
                    operator.call(sink, this.source);
                } else {
                    sink.add(this._trySubscribe(sink));
                }
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
                return sink;
            };
            Observable.prototype._trySubscribe = function(sink) {
                try {
                    return this._subscribe(sink);
                } catch (err) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                    sink.error(err);
                }
            };
            Observable.prototype.forEach = function(next, PromiseCtor) {
                var _this = this;
                if (!PromiseCtor) {
                    if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                        PromiseCtor = root_1.root.Rx.config.Promise;
                    } else if (root_1.root.Promise) {
                        PromiseCtor = root_1.root.Promise;
                    }
                }
                if (!PromiseCtor) {
                    throw new Error("no Promise impl found");
                }
                return new PromiseCtor(function(resolve, reject) {
                    var subscription;
                    subscription = _this.subscribe(function(value) {
                        if (subscription) {
                            try {
                                next(value);
                            } catch (err) {
                                reject(err);
                                subscription.unsubscribe();
                            }
                        } else {
                            next(value);
                        }
                    }, reject, resolve);
                });
            };
            Observable.prototype._subscribe = function(subscriber) {
                return this.source.subscribe(subscriber);
            };
            Observable.prototype[observable_1.observable] = function() {
                return this;
            };
            Observable.create = function(subscribe) {
                return new Observable(subscribe);
            };
            return Observable;
        }();
        exports.Observable = Observable;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var Subscriber_1 = __webpack_require__(8);
        var rxSubscriber_1 = __webpack_require__(17);
        var Observer_1 = __webpack_require__(16);
        function toSubscriber(nextOrObserver, error, complete) {
            if (nextOrObserver) {
                if (nextOrObserver instanceof Subscriber_1.Subscriber) {
                    return nextOrObserver;
                }
                if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
                    return nextOrObserver[rxSubscriber_1.rxSubscriber]();
                }
            }
            if (!nextOrObserver && !error && !complete) {
                return new Subscriber_1.Subscriber(Observer_1.empty);
            }
            return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
        }
        exports.toSubscriber = toSubscriber;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __extends = this && this.__extends || function(d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var isFunction_1 = __webpack_require__(9);
        var Subscription_1 = __webpack_require__(10);
        var Observer_1 = __webpack_require__(16);
        var rxSubscriber_1 = __webpack_require__(17);
        var Subscriber = function(_super) {
            __extends(Subscriber, _super);
            function Subscriber(destinationOrNext, error, complete) {
                _super.call(this);
                this.syncErrorValue = null;
                this.syncErrorThrown = false;
                this.syncErrorThrowable = false;
                this.isStopped = false;
                switch (arguments.length) {
                  case 0:
                    this.destination = Observer_1.empty;
                    break;

                  case 1:
                    if (!destinationOrNext) {
                        this.destination = Observer_1.empty;
                        break;
                    }
                    if (typeof destinationOrNext === "object") {
                        if (destinationOrNext instanceof Subscriber) {
                            this.destination = destinationOrNext;
                            this.destination.add(this);
                        } else {
                            this.syncErrorThrowable = true;
                            this.destination = new SafeSubscriber(this, destinationOrNext);
                        }
                        break;
                    }

                  default:
                    this.syncErrorThrowable = true;
                    this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                    break;
                }
            }
            Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function() {
                return this;
            };
            Subscriber.create = function(next, error, complete) {
                var subscriber = new Subscriber(next, error, complete);
                subscriber.syncErrorThrowable = false;
                return subscriber;
            };
            Subscriber.prototype.next = function(value) {
                if (!this.isStopped) {
                    this._next(value);
                }
            };
            Subscriber.prototype.error = function(err) {
                if (!this.isStopped) {
                    this.isStopped = true;
                    this._error(err);
                }
            };
            Subscriber.prototype.complete = function() {
                if (!this.isStopped) {
                    this.isStopped = true;
                    this._complete();
                }
            };
            Subscriber.prototype.unsubscribe = function() {
                if (this.closed) {
                    return;
                }
                this.isStopped = true;
                _super.prototype.unsubscribe.call(this);
            };
            Subscriber.prototype._next = function(value) {
                this.destination.next(value);
            };
            Subscriber.prototype._error = function(err) {
                this.destination.error(err);
                this.unsubscribe();
            };
            Subscriber.prototype._complete = function() {
                this.destination.complete();
                this.unsubscribe();
            };
            Subscriber.prototype._unsubscribeAndRecycle = function() {
                var _a = this, _parent = _a._parent, _parents = _a._parents;
                this._parent = null;
                this._parents = null;
                this.unsubscribe();
                this.closed = false;
                this.isStopped = false;
                this._parent = _parent;
                this._parents = _parents;
                return this;
            };
            return Subscriber;
        }(Subscription_1.Subscription);
        exports.Subscriber = Subscriber;
        var SafeSubscriber = function(_super) {
            __extends(SafeSubscriber, _super);
            function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
                _super.call(this);
                this._parentSubscriber = _parentSubscriber;
                var next;
                var context = this;
                if (isFunction_1.isFunction(observerOrNext)) {
                    next = observerOrNext;
                } else if (observerOrNext) {
                    next = observerOrNext.next;
                    error = observerOrNext.error;
                    complete = observerOrNext.complete;
                    if (observerOrNext !== Observer_1.empty) {
                        context = Object.create(observerOrNext);
                        if (isFunction_1.isFunction(context.unsubscribe)) {
                            this.add(context.unsubscribe.bind(context));
                        }
                        context.unsubscribe = this.unsubscribe.bind(this);
                    }
                }
                this._context = context;
                this._next = next;
                this._error = error;
                this._complete = complete;
            }
            SafeSubscriber.prototype.next = function(value) {
                if (!this.isStopped && this._next) {
                    var _parentSubscriber = this._parentSubscriber;
                    if (!_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._next, value);
                    } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                        this.unsubscribe();
                    }
                }
            };
            SafeSubscriber.prototype.error = function(err) {
                if (!this.isStopped) {
                    var _parentSubscriber = this._parentSubscriber;
                    if (this._error) {
                        if (!_parentSubscriber.syncErrorThrowable) {
                            this.__tryOrUnsub(this._error, err);
                            this.unsubscribe();
                        } else {
                            this.__tryOrSetError(_parentSubscriber, this._error, err);
                            this.unsubscribe();
                        }
                    } else if (!_parentSubscriber.syncErrorThrowable) {
                        this.unsubscribe();
                        throw err;
                    } else {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                        this.unsubscribe();
                    }
                }
            };
            SafeSubscriber.prototype.complete = function() {
                var _this = this;
                if (!this.isStopped) {
                    var _parentSubscriber = this._parentSubscriber;
                    if (this._complete) {
                        var wrappedComplete = function() {
                            return _this._complete.call(_this._context);
                        };
                        if (!_parentSubscriber.syncErrorThrowable) {
                            this.__tryOrUnsub(wrappedComplete);
                            this.unsubscribe();
                        } else {
                            this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                            this.unsubscribe();
                        }
                    } else {
                        this.unsubscribe();
                    }
                }
            };
            SafeSubscriber.prototype.__tryOrUnsub = function(fn, value) {
                try {
                    fn.call(this._context, value);
                } catch (err) {
                    this.unsubscribe();
                    throw err;
                }
            };
            SafeSubscriber.prototype.__tryOrSetError = function(parent, fn, value) {
                try {
                    fn.call(this._context, value);
                } catch (err) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                return false;
            };
            SafeSubscriber.prototype._unsubscribe = function() {
                var _parentSubscriber = this._parentSubscriber;
                this._context = null;
                this._parentSubscriber = null;
                _parentSubscriber.unsubscribe();
            };
            return SafeSubscriber;
        }(Subscriber);
    }, function(module, exports) {
        "use strict";
        function isFunction(x) {
            return typeof x === "function";
        }
        exports.isFunction = isFunction;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var isArray_1 = __webpack_require__(11);
        var isObject_1 = __webpack_require__(12);
        var isFunction_1 = __webpack_require__(9);
        var tryCatch_1 = __webpack_require__(13);
        var errorObject_1 = __webpack_require__(14);
        var UnsubscriptionError_1 = __webpack_require__(15);
        var Subscription = function() {
            function Subscription(unsubscribe) {
                this.closed = false;
                this._parent = null;
                this._parents = null;
                this._subscriptions = null;
                if (unsubscribe) {
                    this._unsubscribe = unsubscribe;
                }
            }
            Subscription.prototype.unsubscribe = function() {
                var hasErrors = false;
                var errors;
                if (this.closed) {
                    return;
                }
                var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
                this.closed = true;
                this._parent = null;
                this._parents = null;
                this._subscriptions = null;
                var index = -1;
                var len = _parents ? _parents.length : 0;
                while (_parent) {
                    _parent.remove(this);
                    _parent = ++index < len && _parents[index] || null;
                }
                if (isFunction_1.isFunction(_unsubscribe)) {
                    var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [ errorObject_1.errorObject.e ]);
                    }
                }
                if (isArray_1.isArray(_subscriptions)) {
                    index = -1;
                    len = _subscriptions.length;
                    while (++index < len) {
                        var sub = _subscriptions[index];
                        if (isObject_1.isObject(sub)) {
                            var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                            if (trial === errorObject_1.errorObject) {
                                hasErrors = true;
                                errors = errors || [];
                                var err = errorObject_1.errorObject.e;
                                if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                                    errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                                } else {
                                    errors.push(err);
                                }
                            }
                        }
                    }
                }
                if (hasErrors) {
                    throw new UnsubscriptionError_1.UnsubscriptionError(errors);
                }
            };
            Subscription.prototype.add = function(teardown) {
                if (!teardown || teardown === Subscription.EMPTY) {
                    return Subscription.EMPTY;
                }
                if (teardown === this) {
                    return this;
                }
                var subscription = teardown;
                switch (typeof teardown) {
                  case "function":
                    subscription = new Subscription(teardown);

                  case "object":
                    if (subscription.closed || typeof subscription.unsubscribe !== "function") {
                        return subscription;
                    } else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    } else if (typeof subscription._addParent !== "function") {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [ tmp ];
                    }
                    break;

                  default:
                    throw new Error("unrecognized teardown " + teardown + " added to Subscription.");
                }
                var subscriptions = this._subscriptions || (this._subscriptions = []);
                subscriptions.push(subscription);
                subscription._addParent(this);
                return subscription;
            };
            Subscription.prototype.remove = function(subscription) {
                var subscriptions = this._subscriptions;
                if (subscriptions) {
                    var subscriptionIndex = subscriptions.indexOf(subscription);
                    if (subscriptionIndex !== -1) {
                        subscriptions.splice(subscriptionIndex, 1);
                    }
                }
            };
            Subscription.prototype._addParent = function(parent) {
                var _a = this, _parent = _a._parent, _parents = _a._parents;
                if (!_parent || _parent === parent) {
                    this._parent = parent;
                } else if (!_parents) {
                    this._parents = [ parent ];
                } else if (_parents.indexOf(parent) === -1) {
                    _parents.push(parent);
                }
            };
            Subscription.EMPTY = function(empty) {
                empty.closed = true;
                return empty;
            }(new Subscription());
            return Subscription;
        }();
        exports.Subscription = Subscription;
        function flattenUnsubscriptionErrors(errors) {
            return errors.reduce(function(errs, err) {
                return errs.concat(err instanceof UnsubscriptionError_1.UnsubscriptionError ? err.errors : err);
            }, []);
        }
    }, function(module, exports) {
        "use strict";
        exports.isArray = Array.isArray || function(x) {
            return x && typeof x.length === "number";
        };
    }, function(module, exports) {
        "use strict";
        function isObject(x) {
            return x != null && typeof x === "object";
        }
        exports.isObject = isObject;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var errorObject_1 = __webpack_require__(14);
        var tryCatchTarget;
        function tryCatcher() {
            try {
                return tryCatchTarget.apply(this, arguments);
            } catch (e) {
                errorObject_1.errorObject.e = e;
                return errorObject_1.errorObject;
            }
        }
        function tryCatch(fn) {
            tryCatchTarget = fn;
            return tryCatcher;
        }
        exports.tryCatch = tryCatch;
    }, function(module, exports) {
        "use strict";
        exports.errorObject = {
            e: {}
        };
    }, function(module, exports) {
        "use strict";
        var __extends = this && this.__extends || function(d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var UnsubscriptionError = function(_super) {
            __extends(UnsubscriptionError, _super);
            function UnsubscriptionError(errors) {
                _super.call(this);
                this.errors = errors;
                var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function(err, i) {
                    return i + 1 + ") " + err.toString();
                }).join("\n  ") : "");
                this.name = err.name = "UnsubscriptionError";
                this.stack = err.stack;
                this.message = err.message;
            }
            return UnsubscriptionError;
        }(Error);
        exports.UnsubscriptionError = UnsubscriptionError;
    }, function(module, exports) {
        "use strict";
        exports.empty = {
            closed: true,
            next: function(value) {},
            error: function(err) {
                throw err;
            },
            complete: function() {}
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var root_1 = __webpack_require__(4);
        var Symbol = root_1.root.Symbol;
        exports.rxSubscriber = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("rxSubscriber") : "@@rxSubscriber";
        exports.$$rxSubscriber = exports.rxSubscriber;
    }, function(module, exports) {
        "use strict";
        var __extends = this && this.__extends || function(d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var ObjectUnsubscribedError = function(_super) {
            __extends(ObjectUnsubscribedError, _super);
            function ObjectUnsubscribedError() {
                var err = _super.call(this, "object unsubscribed");
                this.name = err.name = "ObjectUnsubscribedError";
                this.stack = err.stack;
                this.message = err.message;
            }
            return ObjectUnsubscribedError;
        }(Error);
        exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __extends = this && this.__extends || function(d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        var Subscription_1 = __webpack_require__(10);
        var SubjectSubscription = function(_super) {
            __extends(SubjectSubscription, _super);
            function SubjectSubscription(subject, subscriber) {
                _super.call(this);
                this.subject = subject;
                this.subscriber = subscriber;
                this.closed = false;
            }
            SubjectSubscription.prototype.unsubscribe = function() {
                if (this.closed) {
                    return;
                }
                this.closed = true;
                var subject = this.subject;
                var observers = subject.observers;
                this.subject = null;
                if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                    return;
                }
                var subscriberIndex = observers.indexOf(this.subscriber);
                if (subscriberIndex !== -1) {
                    observers.splice(subscriberIndex, 1);
                }
            };
            return SubjectSubscription;
        }(Subscription_1.Subscription);
        exports.SubjectSubscription = SubjectSubscription;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            (function(global, factory) {
                true ? factory(exports, __webpack_require__(2)) : typeof define === "function" && define.amd ? define([ "exports", "@angular/core" ], factory) : factory((global.ng = global.ng || {}, 
                global.ng.common = global.ng.common || {}), global.ng.core);
            })(this, function(exports, _angular_core) {
                "use strict";
                var PlatformLocation = function() {
                    function PlatformLocation() {}
                    PlatformLocation.prototype.getBaseHrefFromDOM = function() {};
                    PlatformLocation.prototype.onPopState = function(fn) {};
                    PlatformLocation.prototype.onHashChange = function(fn) {};
                    Object.defineProperty(PlatformLocation.prototype, "pathname", {
                        get: function() {
                            return null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(PlatformLocation.prototype, "search", {
                        get: function() {
                            return null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(PlatformLocation.prototype, "hash", {
                        get: function() {
                            return null;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    PlatformLocation.prototype.replaceState = function(state, title, url) {};
                    PlatformLocation.prototype.pushState = function(state, title, url) {};
                    PlatformLocation.prototype.forward = function() {};
                    PlatformLocation.prototype.back = function() {};
                    return PlatformLocation;
                }();
                var LOCATION_INITIALIZED = new _angular_core.OpaqueToken("Location Initialized");
                var LocationStrategy = function() {
                    function LocationStrategy() {}
                    LocationStrategy.prototype.path = function(includeHash) {};
                    LocationStrategy.prototype.prepareExternalUrl = function(internal) {};
                    LocationStrategy.prototype.pushState = function(state, title, url, queryParams) {};
                    LocationStrategy.prototype.replaceState = function(state, title, url, queryParams) {};
                    LocationStrategy.prototype.forward = function() {};
                    LocationStrategy.prototype.back = function() {};
                    LocationStrategy.prototype.onPopState = function(fn) {};
                    LocationStrategy.prototype.getBaseHref = function() {};
                    return LocationStrategy;
                }();
                var APP_BASE_HREF = new _angular_core.OpaqueToken("appBaseHref");
                var globalScope;
                if (typeof window === "undefined") {
                    if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
                        globalScope = self;
                    } else {
                        globalScope = global;
                    }
                } else {
                    globalScope = window;
                }
                var _global = globalScope;
                function getTypeNameForDebugging(type) {
                    return type["name"] || typeof type;
                }
                _global.assert = function assert(condition) {};
                function isPresent(obj) {
                    return obj != null;
                }
                function isBlank(obj) {
                    return obj == null;
                }
                function stringify(token) {
                    if (typeof token === "string") {
                        return token;
                    }
                    if (token == null) {
                        return "" + token;
                    }
                    if (token.overriddenName) {
                        return "" + token.overriddenName;
                    }
                    if (token.name) {
                        return "" + token.name;
                    }
                    var res = token.toString();
                    var newLineIndex = res.indexOf("\n");
                    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
                }
                var NumberWrapper = function() {
                    function NumberWrapper() {}
                    NumberWrapper.parseIntAutoRadix = function(text) {
                        var result = parseInt(text);
                        if (isNaN(result)) {
                            throw new Error("Invalid integer literal when parsing " + text);
                        }
                        return result;
                    };
                    NumberWrapper.isNumeric = function(value) {
                        return !isNaN(value - parseFloat(value));
                    };
                    return NumberWrapper;
                }();
                function isJsObject(o) {
                    return o !== null && (typeof o === "function" || typeof o === "object");
                }
                var _symbolIterator = null;
                function getSymbolIterator() {
                    if (!_symbolIterator) {
                        if (globalScope.Symbol && Symbol.iterator) {
                            _symbolIterator = Symbol.iterator;
                        } else {
                            var keys = Object.getOwnPropertyNames(Map.prototype);
                            for (var i = 0; i < keys.length; ++i) {
                                var key = keys[i];
                                if (key !== "entries" && key !== "size" && Map.prototype[key] === Map.prototype["entries"]) {
                                    _symbolIterator = key;
                                }
                            }
                        }
                    }
                    return _symbolIterator;
                }
                var Location = function() {
                    function Location(platformStrategy) {
                        var _this = this;
                        this._subject = new _angular_core.EventEmitter();
                        this._platformStrategy = platformStrategy;
                        var browserBaseHref = this._platformStrategy.getBaseHref();
                        this._baseHref = Location.stripTrailingSlash(_stripIndexHtml(browserBaseHref));
                        this._platformStrategy.onPopState(function(ev) {
                            _this._subject.emit({
                                url: _this.path(true),
                                pop: true,
                                type: ev.type
                            });
                        });
                    }
                    Location.prototype.path = function(includeHash) {
                        if (includeHash === void 0) {
                            includeHash = false;
                        }
                        return this.normalize(this._platformStrategy.path(includeHash));
                    };
                    Location.prototype.isCurrentPathEqualTo = function(path, query) {
                        if (query === void 0) {
                            query = "";
                        }
                        return this.path() == this.normalize(path + Location.normalizeQueryParams(query));
                    };
                    Location.prototype.normalize = function(url) {
                        return Location.stripTrailingSlash(_stripBaseHref(this._baseHref, _stripIndexHtml(url)));
                    };
                    Location.prototype.prepareExternalUrl = function(url) {
                        if (url && url[0] !== "/") {
                            url = "/" + url;
                        }
                        return this._platformStrategy.prepareExternalUrl(url);
                    };
                    Location.prototype.go = function(path, query) {
                        if (query === void 0) {
                            query = "";
                        }
                        this._platformStrategy.pushState(null, "", path, query);
                    };
                    Location.prototype.replaceState = function(path, query) {
                        if (query === void 0) {
                            query = "";
                        }
                        this._platformStrategy.replaceState(null, "", path, query);
                    };
                    Location.prototype.forward = function() {
                        this._platformStrategy.forward();
                    };
                    Location.prototype.back = function() {
                        this._platformStrategy.back();
                    };
                    Location.prototype.subscribe = function(onNext, onThrow, onReturn) {
                        if (onThrow === void 0) {
                            onThrow = null;
                        }
                        if (onReturn === void 0) {
                            onReturn = null;
                        }
                        return this._subject.subscribe({
                            next: onNext,
                            error: onThrow,
                            complete: onReturn
                        });
                    };
                    Location.normalizeQueryParams = function(params) {
                        return params && params[0] !== "?" ? "?" + params : params;
                    };
                    Location.joinWithSlash = function(start, end) {
                        if (start.length == 0) {
                            return end;
                        }
                        if (end.length == 0) {
                            return start;
                        }
                        var slashes = 0;
                        if (start.endsWith("/")) {
                            slashes++;
                        }
                        if (end.startsWith("/")) {
                            slashes++;
                        }
                        if (slashes == 2) {
                            return start + end.substring(1);
                        }
                        if (slashes == 1) {
                            return start + end;
                        }
                        return start + "/" + end;
                    };
                    Location.stripTrailingSlash = function(url) {
                        return url.replace(/\/$/, "");
                    };
                    Location.decorators = [ {
                        type: _angular_core.Injectable
                    } ];
                    Location.ctorParameters = function() {
                        return [ {
                            type: LocationStrategy
                        } ];
                    };
                    return Location;
                }();
                function _stripBaseHref(baseHref, url) {
                    return baseHref && url.startsWith(baseHref) ? url.substring(baseHref.length) : url;
                }
                function _stripIndexHtml(url) {
                    return url.replace(/\/index.html$/, "");
                }
                var __extends = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var HashLocationStrategy = function(_super) {
                    __extends(HashLocationStrategy, _super);
                    function HashLocationStrategy(_platformLocation, _baseHref) {
                        _super.call(this);
                        this._platformLocation = _platformLocation;
                        this._baseHref = "";
                        if (isPresent(_baseHref)) {
                            this._baseHref = _baseHref;
                        }
                    }
                    HashLocationStrategy.prototype.onPopState = function(fn) {
                        this._platformLocation.onPopState(fn);
                        this._platformLocation.onHashChange(fn);
                    };
                    HashLocationStrategy.prototype.getBaseHref = function() {
                        return this._baseHref;
                    };
                    HashLocationStrategy.prototype.path = function(includeHash) {
                        if (includeHash === void 0) {
                            includeHash = false;
                        }
                        var path = this._platformLocation.hash;
                        if (!isPresent(path)) path = "#";
                        return path.length > 0 ? path.substring(1) : path;
                    };
                    HashLocationStrategy.prototype.prepareExternalUrl = function(internal) {
                        var url = Location.joinWithSlash(this._baseHref, internal);
                        return url.length > 0 ? "#" + url : url;
                    };
                    HashLocationStrategy.prototype.pushState = function(state, title, path, queryParams) {
                        var url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
                        if (url.length == 0) {
                            url = this._platformLocation.pathname;
                        }
                        this._platformLocation.pushState(state, title, url);
                    };
                    HashLocationStrategy.prototype.replaceState = function(state, title, path, queryParams) {
                        var url = this.prepareExternalUrl(path + Location.normalizeQueryParams(queryParams));
                        if (url.length == 0) {
                            url = this._platformLocation.pathname;
                        }
                        this._platformLocation.replaceState(state, title, url);
                    };
                    HashLocationStrategy.prototype.forward = function() {
                        this._platformLocation.forward();
                    };
                    HashLocationStrategy.prototype.back = function() {
                        this._platformLocation.back();
                    };
                    HashLocationStrategy.decorators = [ {
                        type: _angular_core.Injectable
                    } ];
                    HashLocationStrategy.ctorParameters = function() {
                        return [ {
                            type: PlatformLocation
                        }, {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Optional
                            }, {
                                type: _angular_core.Inject,
                                args: [ APP_BASE_HREF ]
                            } ]
                        } ];
                    };
                    return HashLocationStrategy;
                }(LocationStrategy);
                var __extends$1 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var PathLocationStrategy = function(_super) {
                    __extends$1(PathLocationStrategy, _super);
                    function PathLocationStrategy(_platformLocation, href) {
                        _super.call(this);
                        this._platformLocation = _platformLocation;
                        if (isBlank(href)) {
                            href = this._platformLocation.getBaseHrefFromDOM();
                        }
                        if (isBlank(href)) {
                            throw new Error("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
                        }
                        this._baseHref = href;
                    }
                    PathLocationStrategy.prototype.onPopState = function(fn) {
                        this._platformLocation.onPopState(fn);
                        this._platformLocation.onHashChange(fn);
                    };
                    PathLocationStrategy.prototype.getBaseHref = function() {
                        return this._baseHref;
                    };
                    PathLocationStrategy.prototype.prepareExternalUrl = function(internal) {
                        return Location.joinWithSlash(this._baseHref, internal);
                    };
                    PathLocationStrategy.prototype.path = function(includeHash) {
                        if (includeHash === void 0) {
                            includeHash = false;
                        }
                        var pathname = this._platformLocation.pathname + Location.normalizeQueryParams(this._platformLocation.search);
                        var hash = this._platformLocation.hash;
                        return hash && includeHash ? "" + pathname + hash : pathname;
                    };
                    PathLocationStrategy.prototype.pushState = function(state, title, url, queryParams) {
                        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
                        this._platformLocation.pushState(state, title, externalUrl);
                    };
                    PathLocationStrategy.prototype.replaceState = function(state, title, url, queryParams) {
                        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
                        this._platformLocation.replaceState(state, title, externalUrl);
                    };
                    PathLocationStrategy.prototype.forward = function() {
                        this._platformLocation.forward();
                    };
                    PathLocationStrategy.prototype.back = function() {
                        this._platformLocation.back();
                    };
                    PathLocationStrategy.decorators = [ {
                        type: _angular_core.Injectable
                    } ];
                    PathLocationStrategy.ctorParameters = function() {
                        return [ {
                            type: PlatformLocation
                        }, {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Optional
                            }, {
                                type: _angular_core.Inject,
                                args: [ APP_BASE_HREF ]
                            } ]
                        } ];
                    };
                    return PathLocationStrategy;
                }(LocationStrategy);
                var __extends$2 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var NgLocalization = function() {
                    function NgLocalization() {}
                    NgLocalization.prototype.getPluralCategory = function(value) {};
                    return NgLocalization;
                }();
                function getPluralCategory(value, cases, ngLocalization) {
                    var key = "=" + value;
                    if (cases.indexOf(key) > -1) {
                        return key;
                    }
                    key = ngLocalization.getPluralCategory(value);
                    if (cases.indexOf(key) > -1) {
                        return key;
                    }
                    if (cases.indexOf("other") > -1) {
                        return "other";
                    }
                    throw new Error('No plural message found for value "' + value + '"');
                }
                var NgLocaleLocalization = function(_super) {
                    __extends$2(NgLocaleLocalization, _super);
                    function NgLocaleLocalization(_locale) {
                        _super.call(this);
                        this._locale = _locale;
                    }
                    NgLocaleLocalization.prototype.getPluralCategory = function(value) {
                        var plural = getPluralCase(this._locale, value);
                        switch (plural) {
                          case Plural.Zero:
                            return "zero";

                          case Plural.One:
                            return "one";

                          case Plural.Two:
                            return "two";

                          case Plural.Few:
                            return "few";

                          case Plural.Many:
                            return "many";

                          default:
                            return "other";
                        }
                    };
                    NgLocaleLocalization.decorators = [ {
                        type: _angular_core.Injectable
                    } ];
                    NgLocaleLocalization.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Inject,
                                args: [ _angular_core.LOCALE_ID ]
                            } ]
                        } ];
                    };
                    return NgLocaleLocalization;
                }(NgLocalization);
                var Plural = {};
                Plural.Zero = 0;
                Plural.One = 1;
                Plural.Two = 2;
                Plural.Few = 3;
                Plural.Many = 4;
                Plural.Other = 5;
                Plural[Plural.Zero] = "Zero";
                Plural[Plural.One] = "One";
                Plural[Plural.Two] = "Two";
                Plural[Plural.Few] = "Few";
                Plural[Plural.Many] = "Many";
                Plural[Plural.Other] = "Other";
                function getPluralCase(locale, nLike) {
                    if (typeof nLike === "string") {
                        nLike = parseInt(nLike, 10);
                    }
                    var n = nLike;
                    var nDecimal = n.toString().replace(/^[^.]*\.?/, "");
                    var i = Math.floor(Math.abs(n));
                    var v = nDecimal.length;
                    var f = parseInt(nDecimal, 10);
                    var t = parseInt(n.toString().replace(/^[^.]*\.?|0+$/g, ""), 10) || 0;
                    var lang = locale.split("-")[0].toLowerCase();
                    switch (lang) {
                      case "af":
                      case "asa":
                      case "az":
                      case "bem":
                      case "bez":
                      case "bg":
                      case "brx":
                      case "ce":
                      case "cgg":
                      case "chr":
                      case "ckb":
                      case "ee":
                      case "el":
                      case "eo":
                      case "es":
                      case "eu":
                      case "fo":
                      case "fur":
                      case "gsw":
                      case "ha":
                      case "haw":
                      case "hu":
                      case "jgo":
                      case "jmc":
                      case "ka":
                      case "kk":
                      case "kkj":
                      case "kl":
                      case "ks":
                      case "ksb":
                      case "ky":
                      case "lb":
                      case "lg":
                      case "mas":
                      case "mgo":
                      case "ml":
                      case "mn":
                      case "nb":
                      case "nd":
                      case "ne":
                      case "nn":
                      case "nnh":
                      case "nyn":
                      case "om":
                      case "or":
                      case "os":
                      case "ps":
                      case "rm":
                      case "rof":
                      case "rwk":
                      case "saq":
                      case "seh":
                      case "sn":
                      case "so":
                      case "sq":
                      case "ta":
                      case "te":
                      case "teo":
                      case "tk":
                      case "tr":
                      case "ug":
                      case "uz":
                      case "vo":
                      case "vun":
                      case "wae":
                      case "xog":
                        if (n === 1) return Plural.One;
                        return Plural.Other;

                      case "agq":
                      case "bas":
                      case "cu":
                      case "dav":
                      case "dje":
                      case "dua":
                      case "dyo":
                      case "ebu":
                      case "ewo":
                      case "guz":
                      case "kam":
                      case "khq":
                      case "ki":
                      case "kln":
                      case "kok":
                      case "ksf":
                      case "lrc":
                      case "lu":
                      case "luo":
                      case "luy":
                      case "mer":
                      case "mfe":
                      case "mgh":
                      case "mua":
                      case "mzn":
                      case "nmg":
                      case "nus":
                      case "qu":
                      case "rn":
                      case "rw":
                      case "sbp":
                      case "twq":
                      case "vai":
                      case "yav":
                      case "yue":
                      case "zgh":
                      case "ak":
                      case "ln":
                      case "mg":
                      case "pa":
                      case "ti":
                        if (n === Math.floor(n) && n >= 0 && n <= 1) return Plural.One;
                        return Plural.Other;

                      case "am":
                      case "as":
                      case "bn":
                      case "fa":
                      case "gu":
                      case "hi":
                      case "kn":
                      case "mr":
                      case "zu":
                        if (i === 0 || n === 1) return Plural.One;
                        return Plural.Other;

                      case "ar":
                        if (n === 0) return Plural.Zero;
                        if (n === 1) return Plural.One;
                        if (n === 2) return Plural.Two;
                        if (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10) return Plural.Few;
                        if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99) return Plural.Many;
                        return Plural.Other;

                      case "ast":
                      case "ca":
                      case "de":
                      case "en":
                      case "et":
                      case "fi":
                      case "fy":
                      case "gl":
                      case "it":
                      case "nl":
                      case "sv":
                      case "sw":
                      case "ur":
                      case "yi":
                        if (i === 1 && v === 0) return Plural.One;
                        return Plural.Other;

                      case "be":
                        if (n % 10 === 1 && !(n % 100 === 11)) return Plural.One;
                        if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) return Plural.Few;
                        if (n % 10 === 0 || n % 10 === Math.floor(n % 10) && n % 10 >= 5 && n % 10 <= 9 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 14) return Plural.Many;
                        return Plural.Other;

                      case "br":
                        if (n % 10 === 1 && !(n % 100 === 11 || n % 100 === 71 || n % 100 === 91)) return Plural.One;
                        if (n % 10 === 2 && !(n % 100 === 12 || n % 100 === 72 || n % 100 === 92)) return Plural.Two;
                        if (n % 10 === Math.floor(n % 10) && (n % 10 >= 3 && n % 10 <= 4 || n % 10 === 9) && !(n % 100 >= 10 && n % 100 <= 19 || n % 100 >= 70 && n % 100 <= 79 || n % 100 >= 90 && n % 100 <= 99)) return Plural.Few;
                        if (!(n === 0) && n % 1e6 === 0) return Plural.Many;
                        return Plural.Other;

                      case "bs":
                      case "hr":
                      case "sr":
                        if (v === 0 && i % 10 === 1 && !(i % 100 === 11) || f % 10 === 1 && !(f % 100 === 11)) return Plural.One;
                        if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14) || f % 10 === Math.floor(f % 10) && f % 10 >= 2 && f % 10 <= 4 && !(f % 100 >= 12 && f % 100 <= 14)) return Plural.Few;
                        return Plural.Other;

                      case "cs":
                      case "sk":
                        if (i === 1 && v === 0) return Plural.One;
                        if (i === Math.floor(i) && i >= 2 && i <= 4 && v === 0) return Plural.Few;
                        if (!(v === 0)) return Plural.Many;
                        return Plural.Other;

                      case "cy":
                        if (n === 0) return Plural.Zero;
                        if (n === 1) return Plural.One;
                        if (n === 2) return Plural.Two;
                        if (n === 3) return Plural.Few;
                        if (n === 6) return Plural.Many;
                        return Plural.Other;

                      case "da":
                        if (n === 1 || !(t === 0) && (i === 0 || i === 1)) return Plural.One;
                        return Plural.Other;

                      case "dsb":
                      case "hsb":
                        if (v === 0 && i % 100 === 1 || f % 100 === 1) return Plural.One;
                        if (v === 0 && i % 100 === 2 || f % 100 === 2) return Plural.Two;
                        if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || f % 100 === Math.floor(f % 100) && f % 100 >= 3 && f % 100 <= 4) return Plural.Few;
                        return Plural.Other;

                      case "ff":
                      case "fr":
                      case "hy":
                      case "kab":
                        if (i === 0 || i === 1) return Plural.One;
                        return Plural.Other;

                      case "fil":
                        if (v === 0 && (i === 1 || i === 2 || i === 3) || v === 0 && !(i % 10 === 4 || i % 10 === 6 || i % 10 === 9) || !(v === 0) && !(f % 10 === 4 || f % 10 === 6 || f % 10 === 9)) return Plural.One;
                        return Plural.Other;

                      case "ga":
                        if (n === 1) return Plural.One;
                        if (n === 2) return Plural.Two;
                        if (n === Math.floor(n) && n >= 3 && n <= 6) return Plural.Few;
                        if (n === Math.floor(n) && n >= 7 && n <= 10) return Plural.Many;
                        return Plural.Other;

                      case "gd":
                        if (n === 1 || n === 11) return Plural.One;
                        if (n === 2 || n === 12) return Plural.Two;
                        if (n === Math.floor(n) && (n >= 3 && n <= 10 || n >= 13 && n <= 19)) return Plural.Few;
                        return Plural.Other;

                      case "gv":
                        if (v === 0 && i % 10 === 1) return Plural.One;
                        if (v === 0 && i % 10 === 2) return Plural.Two;
                        if (v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80)) return Plural.Few;
                        if (!(v === 0)) return Plural.Many;
                        return Plural.Other;

                      case "he":
                        if (i === 1 && v === 0) return Plural.One;
                        if (i === 2 && v === 0) return Plural.Two;
                        if (v === 0 && !(n >= 0 && n <= 10) && n % 10 === 0) return Plural.Many;
                        return Plural.Other;

                      case "is":
                        if (t === 0 && i % 10 === 1 && !(i % 100 === 11) || !(t === 0)) return Plural.One;
                        return Plural.Other;

                      case "ksh":
                        if (n === 0) return Plural.Zero;
                        if (n === 1) return Plural.One;
                        return Plural.Other;

                      case "kw":
                      case "naq":
                      case "se":
                      case "smn":
                        if (n === 1) return Plural.One;
                        if (n === 2) return Plural.Two;
                        return Plural.Other;

                      case "lag":
                        if (n === 0) return Plural.Zero;
                        if ((i === 0 || i === 1) && !(n === 0)) return Plural.One;
                        return Plural.Other;

                      case "lt":
                        if (n % 10 === 1 && !(n % 100 >= 11 && n % 100 <= 19)) return Plural.One;
                        if (n % 10 === Math.floor(n % 10) && n % 10 >= 2 && n % 10 <= 9 && !(n % 100 >= 11 && n % 100 <= 19)) return Plural.Few;
                        if (!(f === 0)) return Plural.Many;
                        return Plural.Other;

                      case "lv":
                      case "prg":
                        if (n % 10 === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19 || v === 2 && f % 100 === Math.floor(f % 100) && f % 100 >= 11 && f % 100 <= 19) return Plural.Zero;
                        if (n % 10 === 1 && !(n % 100 === 11) || v === 2 && f % 10 === 1 && !(f % 100 === 11) || !(v === 2) && f % 10 === 1) return Plural.One;
                        return Plural.Other;

                      case "mk":
                        if (v === 0 && i % 10 === 1 || f % 10 === 1) return Plural.One;
                        return Plural.Other;

                      case "mt":
                        if (n === 1) return Plural.One;
                        if (n === 0 || n % 100 === Math.floor(n % 100) && n % 100 >= 2 && n % 100 <= 10) return Plural.Few;
                        if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 19) return Plural.Many;
                        return Plural.Other;

                      case "pl":
                        if (i === 1 && v === 0) return Plural.One;
                        if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return Plural.Few;
                        if (v === 0 && !(i === 1) && i % 10 === Math.floor(i % 10) && i % 10 >= 0 && i % 10 <= 1 || v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 12 && i % 100 <= 14) return Plural.Many;
                        return Plural.Other;

                      case "pt":
                        if (n === Math.floor(n) && n >= 0 && n <= 2 && !(n === 2)) return Plural.One;
                        return Plural.Other;

                      case "ro":
                        if (i === 1 && v === 0) return Plural.One;
                        if (!(v === 0) || n === 0 || !(n === 1) && n % 100 === Math.floor(n % 100) && n % 100 >= 1 && n % 100 <= 19) return Plural.Few;
                        return Plural.Other;

                      case "ru":
                      case "uk":
                        if (v === 0 && i % 10 === 1 && !(i % 100 === 11)) return Plural.One;
                        if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 && !(i % 100 >= 12 && i % 100 <= 14)) return Plural.Few;
                        if (v === 0 && i % 10 === 0 || v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 || v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14) return Plural.Many;
                        return Plural.Other;

                      case "shi":
                        if (i === 0 || n === 1) return Plural.One;
                        if (n === Math.floor(n) && n >= 2 && n <= 10) return Plural.Few;
                        return Plural.Other;

                      case "si":
                        if (n === 0 || n === 1 || i === 0 && f === 1) return Plural.One;
                        return Plural.Other;

                      case "sl":
                        if (v === 0 && i % 100 === 1) return Plural.One;
                        if (v === 0 && i % 100 === 2) return Plural.Two;
                        if (v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 3 && i % 100 <= 4 || !(v === 0)) return Plural.Few;
                        return Plural.Other;

                      case "tzm":
                        if (n === Math.floor(n) && n >= 0 && n <= 1 || n === Math.floor(n) && n >= 11 && n <= 99) return Plural.One;
                        return Plural.Other;

                      default:
                        return Plural.Other;
                    }
                }
                function isListLikeIterable(obj) {
                    if (!isJsObject(obj)) return false;
                    return Array.isArray(obj) || !(obj instanceof Map) && getSymbolIterator() in obj;
                }
                var NgClass = function() {
                    function NgClass(_iterableDiffers, _keyValueDiffers, _ngEl, _renderer) {
                        this._iterableDiffers = _iterableDiffers;
                        this._keyValueDiffers = _keyValueDiffers;
                        this._ngEl = _ngEl;
                        this._renderer = _renderer;
                        this._initialClasses = [];
                    }
                    Object.defineProperty(NgClass.prototype, "klass", {
                        set: function(v) {
                            this._applyInitialClasses(true);
                            this._initialClasses = typeof v === "string" ? v.split(/\s+/) : [];
                            this._applyInitialClasses(false);
                            this._applyClasses(this._rawClass, false);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgClass.prototype, "ngClass", {
                        set: function(v) {
                            this._cleanupClasses(this._rawClass);
                            this._iterableDiffer = null;
                            this._keyValueDiffer = null;
                            this._rawClass = typeof v === "string" ? v.split(/\s+/) : v;
                            if (this._rawClass) {
                                if (isListLikeIterable(this._rawClass)) {
                                    this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create(null);
                                } else {
                                    this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create(null);
                                }
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgClass.prototype.ngDoCheck = function() {
                        if (this._iterableDiffer) {
                            var changes = this._iterableDiffer.diff(this._rawClass);
                            if (changes) {
                                this._applyIterableChanges(changes);
                            }
                        } else if (this._keyValueDiffer) {
                            var changes = this._keyValueDiffer.diff(this._rawClass);
                            if (changes) {
                                this._applyKeyValueChanges(changes);
                            }
                        }
                    };
                    NgClass.prototype._cleanupClasses = function(rawClassVal) {
                        this._applyClasses(rawClassVal, true);
                        this._applyInitialClasses(false);
                    };
                    NgClass.prototype._applyKeyValueChanges = function(changes) {
                        var _this = this;
                        changes.forEachAddedItem(function(record) {
                            return _this._toggleClass(record.key, record.currentValue);
                        });
                        changes.forEachChangedItem(function(record) {
                            return _this._toggleClass(record.key, record.currentValue);
                        });
                        changes.forEachRemovedItem(function(record) {
                            if (record.previousValue) {
                                _this._toggleClass(record.key, false);
                            }
                        });
                    };
                    NgClass.prototype._applyIterableChanges = function(changes) {
                        var _this = this;
                        changes.forEachAddedItem(function(record) {
                            if (typeof record.item === "string") {
                                _this._toggleClass(record.item, true);
                            } else {
                                throw new Error("NgClass can only toggle CSS classes expressed as strings, got " + stringify(record.item));
                            }
                        });
                        changes.forEachRemovedItem(function(record) {
                            return _this._toggleClass(record.item, false);
                        });
                    };
                    NgClass.prototype._applyInitialClasses = function(isCleanup) {
                        var _this = this;
                        this._initialClasses.forEach(function(klass) {
                            return _this._toggleClass(klass, !isCleanup);
                        });
                    };
                    NgClass.prototype._applyClasses = function(rawClassVal, isCleanup) {
                        var _this = this;
                        if (rawClassVal) {
                            if (Array.isArray(rawClassVal) || rawClassVal instanceof Set) {
                                rawClassVal.forEach(function(klass) {
                                    return _this._toggleClass(klass, !isCleanup);
                                });
                            } else {
                                Object.keys(rawClassVal).forEach(function(klass) {
                                    if (rawClassVal[klass] != null) _this._toggleClass(klass, !isCleanup);
                                });
                            }
                        }
                    };
                    NgClass.prototype._toggleClass = function(klass, enabled) {
                        var _this = this;
                        klass = klass.trim();
                        if (klass) {
                            klass.split(/\s+/g).forEach(function(klass) {
                                _this._renderer.setElementClass(_this._ngEl.nativeElement, klass, enabled);
                            });
                        }
                    };
                    NgClass.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngClass]"
                        } ]
                    } ];
                    NgClass.ctorParameters = function() {
                        return [ {
                            type: _angular_core.IterableDiffers
                        }, {
                            type: _angular_core.KeyValueDiffers
                        }, {
                            type: _angular_core.ElementRef
                        }, {
                            type: _angular_core.Renderer
                        } ];
                    };
                    NgClass.propDecorators = {
                        klass: [ {
                            type: _angular_core.Input,
                            args: [ "class" ]
                        } ],
                        ngClass: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgClass;
                }();
                var NgForRow = function() {
                    function NgForRow($implicit, index, count) {
                        this.$implicit = $implicit;
                        this.index = index;
                        this.count = count;
                    }
                    Object.defineProperty(NgForRow.prototype, "first", {
                        get: function() {
                            return this.index === 0;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgForRow.prototype, "last", {
                        get: function() {
                            return this.index === this.count - 1;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgForRow.prototype, "even", {
                        get: function() {
                            return this.index % 2 === 0;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgForRow.prototype, "odd", {
                        get: function() {
                            return !this.even;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return NgForRow;
                }();
                var NgFor = function() {
                    function NgFor(_viewContainer, _template, _differs, _cdr) {
                        this._viewContainer = _viewContainer;
                        this._template = _template;
                        this._differs = _differs;
                        this._cdr = _cdr;
                        this._differ = null;
                    }
                    Object.defineProperty(NgFor.prototype, "ngForTrackBy", {
                        get: function() {
                            return this._trackByFn;
                        },
                        set: function(fn) {
                            if (_angular_core.isDevMode() && fn != null && typeof fn !== "function") {
                                if (console && console.warn) {
                                    console.warn("trackBy must be a function, but received " + JSON.stringify(fn) + ". " + "See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information.");
                                }
                            }
                            this._trackByFn = fn;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgFor.prototype, "ngForTemplate", {
                        set: function(value) {
                            if (value) {
                                this._template = value;
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgFor.prototype.ngOnChanges = function(changes) {
                        if ("ngForOf" in changes) {
                            var value = changes["ngForOf"].currentValue;
                            if (!this._differ && value) {
                                try {
                                    this._differ = this._differs.find(value).create(this._cdr, this.ngForTrackBy);
                                } catch (e) {
                                    throw new Error("Cannot find a differ supporting object '" + value + "' of type '" + getTypeNameForDebugging(value) + "'. NgFor only supports binding to Iterables such as Arrays.");
                                }
                            }
                        }
                    };
                    NgFor.prototype.ngDoCheck = function() {
                        if (this._differ) {
                            var changes = this._differ.diff(this.ngForOf);
                            if (changes) this._applyChanges(changes);
                        }
                    };
                    NgFor.prototype._applyChanges = function(changes) {
                        var _this = this;
                        var insertTuples = [];
                        changes.forEachOperation(function(item, adjustedPreviousIndex, currentIndex) {
                            if (item.previousIndex == null) {
                                var view = _this._viewContainer.createEmbeddedView(_this._template, new NgForRow(null, null, null), currentIndex);
                                var tuple = new RecordViewTuple(item, view);
                                insertTuples.push(tuple);
                            } else if (currentIndex == null) {
                                _this._viewContainer.remove(adjustedPreviousIndex);
                            } else {
                                var view = _this._viewContainer.get(adjustedPreviousIndex);
                                _this._viewContainer.move(view, currentIndex);
                                var tuple = new RecordViewTuple(item, view);
                                insertTuples.push(tuple);
                            }
                        });
                        for (var i = 0; i < insertTuples.length; i++) {
                            this._perViewChange(insertTuples[i].view, insertTuples[i].record);
                        }
                        for (var i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
                            var viewRef = this._viewContainer.get(i);
                            viewRef.context.index = i;
                            viewRef.context.count = ilen;
                        }
                        changes.forEachIdentityChange(function(record) {
                            var viewRef = _this._viewContainer.get(record.currentIndex);
                            viewRef.context.$implicit = record.item;
                        });
                    };
                    NgFor.prototype._perViewChange = function(view, record) {
                        view.context.$implicit = record.item;
                    };
                    NgFor.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngFor][ngForOf]"
                        } ]
                    } ];
                    NgFor.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ViewContainerRef
                        }, {
                            type: _angular_core.TemplateRef
                        }, {
                            type: _angular_core.IterableDiffers
                        }, {
                            type: _angular_core.ChangeDetectorRef
                        } ];
                    };
                    NgFor.propDecorators = {
                        ngForOf: [ {
                            type: _angular_core.Input
                        } ],
                        ngForTrackBy: [ {
                            type: _angular_core.Input
                        } ],
                        ngForTemplate: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgFor;
                }();
                var RecordViewTuple = function() {
                    function RecordViewTuple(record, view) {
                        this.record = record;
                        this.view = view;
                    }
                    return RecordViewTuple;
                }();
                var NgIf = function() {
                    function NgIf(_viewContainer, _template) {
                        this._viewContainer = _viewContainer;
                        this._template = _template;
                        this._hasView = false;
                    }
                    Object.defineProperty(NgIf.prototype, "ngIf", {
                        set: function(condition) {
                            if (condition && !this._hasView) {
                                this._hasView = true;
                                this._viewContainer.createEmbeddedView(this._template);
                            } else if (!condition && this._hasView) {
                                this._hasView = false;
                                this._viewContainer.clear();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgIf.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngIf]"
                        } ]
                    } ];
                    NgIf.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ViewContainerRef
                        }, {
                            type: _angular_core.TemplateRef
                        } ];
                    };
                    NgIf.propDecorators = {
                        ngIf: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgIf;
                }();
                var SwitchView = function() {
                    function SwitchView(_viewContainerRef, _templateRef) {
                        this._viewContainerRef = _viewContainerRef;
                        this._templateRef = _templateRef;
                        this._created = false;
                    }
                    SwitchView.prototype.create = function() {
                        this._created = true;
                        this._viewContainerRef.createEmbeddedView(this._templateRef);
                    };
                    SwitchView.prototype.destroy = function() {
                        this._created = false;
                        this._viewContainerRef.clear();
                    };
                    SwitchView.prototype.enforceState = function(created) {
                        if (created && !this._created) {
                            this.create();
                        } else if (!created && this._created) {
                            this.destroy();
                        }
                    };
                    return SwitchView;
                }();
                var NgSwitch = function() {
                    function NgSwitch() {
                        this._defaultUsed = false;
                        this._caseCount = 0;
                        this._lastCaseCheckIndex = 0;
                        this._lastCasesMatched = false;
                    }
                    Object.defineProperty(NgSwitch.prototype, "ngSwitch", {
                        set: function(newValue) {
                            this._ngSwitch = newValue;
                            if (this._caseCount === 0) {
                                this._updateDefaultCases(true);
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgSwitch.prototype._addCase = function() {
                        return this._caseCount++;
                    };
                    NgSwitch.prototype._addDefault = function(view) {
                        if (!this._defaultViews) {
                            this._defaultViews = [];
                        }
                        this._defaultViews.push(view);
                    };
                    NgSwitch.prototype._matchCase = function(value) {
                        var matched = value == this._ngSwitch;
                        this._lastCasesMatched = this._lastCasesMatched || matched;
                        this._lastCaseCheckIndex++;
                        if (this._lastCaseCheckIndex === this._caseCount) {
                            this._updateDefaultCases(!this._lastCasesMatched);
                            this._lastCaseCheckIndex = 0;
                            this._lastCasesMatched = false;
                        }
                        return matched;
                    };
                    NgSwitch.prototype._updateDefaultCases = function(useDefault) {
                        if (this._defaultViews && useDefault !== this._defaultUsed) {
                            this._defaultUsed = useDefault;
                            for (var i = 0; i < this._defaultViews.length; i++) {
                                var defaultView = this._defaultViews[i];
                                defaultView.enforceState(useDefault);
                            }
                        }
                    };
                    NgSwitch.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngSwitch]"
                        } ]
                    } ];
                    NgSwitch.ctorParameters = function() {
                        return [];
                    };
                    NgSwitch.propDecorators = {
                        ngSwitch: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgSwitch;
                }();
                var NgSwitchCase = function() {
                    function NgSwitchCase(viewContainer, templateRef, ngSwitch) {
                        this.ngSwitch = ngSwitch;
                        ngSwitch._addCase();
                        this._view = new SwitchView(viewContainer, templateRef);
                    }
                    NgSwitchCase.prototype.ngDoCheck = function() {
                        this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
                    };
                    NgSwitchCase.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngSwitchCase]"
                        } ]
                    } ];
                    NgSwitchCase.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ViewContainerRef
                        }, {
                            type: _angular_core.TemplateRef
                        }, {
                            type: NgSwitch,
                            decorators: [ {
                                type: _angular_core.Host
                            } ]
                        } ];
                    };
                    NgSwitchCase.propDecorators = {
                        ngSwitchCase: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgSwitchCase;
                }();
                var NgSwitchDefault = function() {
                    function NgSwitchDefault(viewContainer, templateRef, ngSwitch) {
                        ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
                    }
                    NgSwitchDefault.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngSwitchDefault]"
                        } ]
                    } ];
                    NgSwitchDefault.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ViewContainerRef
                        }, {
                            type: _angular_core.TemplateRef
                        }, {
                            type: NgSwitch,
                            decorators: [ {
                                type: _angular_core.Host
                            } ]
                        } ];
                    };
                    return NgSwitchDefault;
                }();
                var NgPlural = function() {
                    function NgPlural(_localization) {
                        this._localization = _localization;
                        this._caseViews = {};
                    }
                    Object.defineProperty(NgPlural.prototype, "ngPlural", {
                        set: function(value) {
                            this._switchValue = value;
                            this._updateView();
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgPlural.prototype.addCase = function(value, switchView) {
                        this._caseViews[value] = switchView;
                    };
                    NgPlural.prototype._updateView = function() {
                        this._clearViews();
                        var cases = Object.keys(this._caseViews);
                        var key = getPluralCategory(this._switchValue, cases, this._localization);
                        this._activateView(this._caseViews[key]);
                    };
                    NgPlural.prototype._clearViews = function() {
                        if (this._activeView) this._activeView.destroy();
                    };
                    NgPlural.prototype._activateView = function(view) {
                        if (view) {
                            this._activeView = view;
                            this._activeView.create();
                        }
                    };
                    NgPlural.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngPlural]"
                        } ]
                    } ];
                    NgPlural.ctorParameters = function() {
                        return [ {
                            type: NgLocalization
                        } ];
                    };
                    NgPlural.propDecorators = {
                        ngPlural: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgPlural;
                }();
                var NgPluralCase = function() {
                    function NgPluralCase(value, template, viewContainer, ngPlural) {
                        this.value = value;
                        var isANumber = !isNaN(Number(value));
                        ngPlural.addCase(isANumber ? "=" + value : value, new SwitchView(viewContainer, template));
                    }
                    NgPluralCase.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngPluralCase]"
                        } ]
                    } ];
                    NgPluralCase.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Attribute,
                                args: [ "ngPluralCase" ]
                            } ]
                        }, {
                            type: _angular_core.TemplateRef
                        }, {
                            type: _angular_core.ViewContainerRef
                        }, {
                            type: NgPlural,
                            decorators: [ {
                                type: _angular_core.Host
                            } ]
                        } ];
                    };
                    return NgPluralCase;
                }();
                var NgStyle = function() {
                    function NgStyle(_differs, _ngEl, _renderer) {
                        this._differs = _differs;
                        this._ngEl = _ngEl;
                        this._renderer = _renderer;
                    }
                    Object.defineProperty(NgStyle.prototype, "ngStyle", {
                        set: function(v) {
                            this._ngStyle = v;
                            if (!this._differ && v) {
                                this._differ = this._differs.find(v).create(null);
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgStyle.prototype.ngDoCheck = function() {
                        if (this._differ) {
                            var changes = this._differ.diff(this._ngStyle);
                            if (changes) {
                                this._applyChanges(changes);
                            }
                        }
                    };
                    NgStyle.prototype._applyChanges = function(changes) {
                        var _this = this;
                        changes.forEachRemovedItem(function(record) {
                            return _this._setStyle(record.key, null);
                        });
                        changes.forEachAddedItem(function(record) {
                            return _this._setStyle(record.key, record.currentValue);
                        });
                        changes.forEachChangedItem(function(record) {
                            return _this._setStyle(record.key, record.currentValue);
                        });
                    };
                    NgStyle.prototype._setStyle = function(nameAndUnit, value) {
                        var _a = nameAndUnit.split("."), name = _a[0], unit = _a[1];
                        value = value && unit ? "" + value + unit : value;
                        this._renderer.setElementStyle(this._ngEl.nativeElement, name, value);
                    };
                    NgStyle.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngStyle]"
                        } ]
                    } ];
                    NgStyle.ctorParameters = function() {
                        return [ {
                            type: _angular_core.KeyValueDiffers
                        }, {
                            type: _angular_core.ElementRef
                        }, {
                            type: _angular_core.Renderer
                        } ];
                    };
                    NgStyle.propDecorators = {
                        ngStyle: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgStyle;
                }();
                var NgTemplateOutlet = function() {
                    function NgTemplateOutlet(_viewContainerRef) {
                        this._viewContainerRef = _viewContainerRef;
                    }
                    Object.defineProperty(NgTemplateOutlet.prototype, "ngOutletContext", {
                        set: function(context) {
                            this._context = context;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(NgTemplateOutlet.prototype, "ngTemplateOutlet", {
                        set: function(templateRef) {
                            this._templateRef = templateRef;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    NgTemplateOutlet.prototype.ngOnChanges = function(changes) {
                        if (this._viewRef) {
                            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
                        }
                        if (this._templateRef) {
                            this._viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, this._context);
                        }
                    };
                    NgTemplateOutlet.decorators = [ {
                        type: _angular_core.Directive,
                        args: [ {
                            selector: "[ngTemplateOutlet]"
                        } ]
                    } ];
                    NgTemplateOutlet.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ViewContainerRef
                        } ];
                    };
                    NgTemplateOutlet.propDecorators = {
                        ngOutletContext: [ {
                            type: _angular_core.Input
                        } ],
                        ngTemplateOutlet: [ {
                            type: _angular_core.Input
                        } ]
                    };
                    return NgTemplateOutlet;
                }();
                var COMMON_DIRECTIVES = [ NgClass, NgFor, NgIf, NgTemplateOutlet, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgPlural, NgPluralCase ];
                var isPromise = _angular_core.__core_private__.isPromise;
                var isObservable = _angular_core.__core_private__.isObservable;
                var __extends$4 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var BaseError = function(_super) {
                    __extends$4(BaseError, _super);
                    function BaseError(message) {
                        _super.call(this, message);
                        var nativeError = new Error(message);
                        this._nativeError = nativeError;
                    }
                    Object.defineProperty(BaseError.prototype, "message", {
                        get: function() {
                            return this._nativeError.message;
                        },
                        set: function(message) {
                            this._nativeError.message = message;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BaseError.prototype, "name", {
                        get: function() {
                            return this._nativeError.name;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BaseError.prototype, "stack", {
                        get: function() {
                            return this._nativeError.stack;
                        },
                        set: function(value) {
                            this._nativeError.stack = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BaseError.prototype.toString = function() {
                        return this._nativeError.toString();
                    };
                    return BaseError;
                }(Error);
                var WrappedError = function(_super) {
                    __extends$4(WrappedError, _super);
                    function WrappedError(message, error) {
                        _super.call(this, message + " caused by: " + (error instanceof Error ? error.message : error));
                        this.originalError = error;
                    }
                    Object.defineProperty(WrappedError.prototype, "stack", {
                        get: function() {
                            return (this.originalError instanceof Error ? this.originalError : this._nativeError).stack;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return WrappedError;
                }(BaseError);
                var __extends$3 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var InvalidPipeArgumentError = function(_super) {
                    __extends$3(InvalidPipeArgumentError, _super);
                    function InvalidPipeArgumentError(type, value) {
                        _super.call(this, "Invalid argument '" + value + "' for pipe '" + stringify(type) + "'");
                    }
                    return InvalidPipeArgumentError;
                }(BaseError);
                var ObservableStrategy = function() {
                    function ObservableStrategy() {}
                    ObservableStrategy.prototype.createSubscription = function(async, updateLatestValue) {
                        return async.subscribe({
                            next: updateLatestValue,
                            error: function(e) {
                                throw e;
                            }
                        });
                    };
                    ObservableStrategy.prototype.dispose = function(subscription) {
                        subscription.unsubscribe();
                    };
                    ObservableStrategy.prototype.onDestroy = function(subscription) {
                        subscription.unsubscribe();
                    };
                    return ObservableStrategy;
                }();
                var PromiseStrategy = function() {
                    function PromiseStrategy() {}
                    PromiseStrategy.prototype.createSubscription = function(async, updateLatestValue) {
                        return async.then(updateLatestValue, function(e) {
                            throw e;
                        });
                    };
                    PromiseStrategy.prototype.dispose = function(subscription) {};
                    PromiseStrategy.prototype.onDestroy = function(subscription) {};
                    return PromiseStrategy;
                }();
                var _promiseStrategy = new PromiseStrategy();
                var _observableStrategy = new ObservableStrategy();
                var AsyncPipe = function() {
                    function AsyncPipe(_ref) {
                        this._ref = _ref;
                        this._latestValue = null;
                        this._latestReturnedValue = null;
                        this._subscription = null;
                        this._obj = null;
                        this._strategy = null;
                    }
                    AsyncPipe.prototype.ngOnDestroy = function() {
                        if (this._subscription) {
                            this._dispose();
                        }
                    };
                    AsyncPipe.prototype.transform = function(obj) {
                        if (!this._obj) {
                            if (obj) {
                                this._subscribe(obj);
                            }
                            this._latestReturnedValue = this._latestValue;
                            return this._latestValue;
                        }
                        if (obj !== this._obj) {
                            this._dispose();
                            return this.transform(obj);
                        }
                        if (this._latestValue === this._latestReturnedValue) {
                            return this._latestReturnedValue;
                        }
                        this._latestReturnedValue = this._latestValue;
                        return _angular_core.WrappedValue.wrap(this._latestValue);
                    };
                    AsyncPipe.prototype._subscribe = function(obj) {
                        var _this = this;
                        this._obj = obj;
                        this._strategy = this._selectStrategy(obj);
                        this._subscription = this._strategy.createSubscription(obj, function(value) {
                            return _this._updateLatestValue(obj, value);
                        });
                    };
                    AsyncPipe.prototype._selectStrategy = function(obj) {
                        if (isPromise(obj)) {
                            return _promiseStrategy;
                        }
                        if (isObservable(obj)) {
                            return _observableStrategy;
                        }
                        throw new InvalidPipeArgumentError(AsyncPipe, obj);
                    };
                    AsyncPipe.prototype._dispose = function() {
                        this._strategy.dispose(this._subscription);
                        this._latestValue = null;
                        this._latestReturnedValue = null;
                        this._subscription = null;
                        this._obj = null;
                    };
                    AsyncPipe.prototype._updateLatestValue = function(async, value) {
                        if (async === this._obj) {
                            this._latestValue = value;
                            this._ref.markForCheck();
                        }
                    };
                    AsyncPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "async",
                            pure: false
                        } ]
                    } ];
                    AsyncPipe.ctorParameters = function() {
                        return [ {
                            type: _angular_core.ChangeDetectorRef
                        } ];
                    };
                    return AsyncPipe;
                }();
                var NumberFormatStyle = {};
                NumberFormatStyle.Decimal = 0;
                NumberFormatStyle.Percent = 1;
                NumberFormatStyle.Currency = 2;
                NumberFormatStyle[NumberFormatStyle.Decimal] = "Decimal";
                NumberFormatStyle[NumberFormatStyle.Percent] = "Percent";
                NumberFormatStyle[NumberFormatStyle.Currency] = "Currency";
                var NumberFormatter = function() {
                    function NumberFormatter() {}
                    NumberFormatter.format = function(num, locale, style, _a) {
                        var _b = _a === void 0 ? {} : _a, minimumIntegerDigits = _b.minimumIntegerDigits, minimumFractionDigits = _b.minimumFractionDigits, maximumFractionDigits = _b.maximumFractionDigits, currency = _b.currency, _c = _b.currencyAsSymbol, currencyAsSymbol = _c === void 0 ? false : _c;
                        var options = {
                            minimumIntegerDigits: minimumIntegerDigits,
                            minimumFractionDigits: minimumFractionDigits,
                            maximumFractionDigits: maximumFractionDigits,
                            style: NumberFormatStyle[style].toLowerCase()
                        };
                        if (style == NumberFormatStyle.Currency) {
                            options.currency = currency;
                            options.currencyDisplay = currencyAsSymbol ? "symbol" : "code";
                        }
                        return new Intl.NumberFormat(locale, options).format(num);
                    };
                    return NumberFormatter;
                }();
                var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsazZEwGjJ']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|J+|j+|m+|s+|a|z|Z|G+|w+))(.*)/;
                var PATTERN_ALIASES = {
                    yMMMdjms: datePartGetterFactory(combine([ digitCondition("year", 1), nameCondition("month", 3), digitCondition("day", 1), digitCondition("hour", 1), digitCondition("minute", 1), digitCondition("second", 1) ])),
                    yMdjm: datePartGetterFactory(combine([ digitCondition("year", 1), digitCondition("month", 1), digitCondition("day", 1), digitCondition("hour", 1), digitCondition("minute", 1) ])),
                    yMMMMEEEEd: datePartGetterFactory(combine([ digitCondition("year", 1), nameCondition("month", 4), nameCondition("weekday", 4), digitCondition("day", 1) ])),
                    yMMMMd: datePartGetterFactory(combine([ digitCondition("year", 1), nameCondition("month", 4), digitCondition("day", 1) ])),
                    yMMMd: datePartGetterFactory(combine([ digitCondition("year", 1), nameCondition("month", 3), digitCondition("day", 1) ])),
                    yMd: datePartGetterFactory(combine([ digitCondition("year", 1), digitCondition("month", 1), digitCondition("day", 1) ])),
                    jms: datePartGetterFactory(combine([ digitCondition("hour", 1), digitCondition("second", 1), digitCondition("minute", 1) ])),
                    jm: datePartGetterFactory(combine([ digitCondition("hour", 1), digitCondition("minute", 1) ]))
                };
                var DATE_FORMATS = {
                    yyyy: datePartGetterFactory(digitCondition("year", 4)),
                    yy: datePartGetterFactory(digitCondition("year", 2)),
                    y: datePartGetterFactory(digitCondition("year", 1)),
                    MMMM: datePartGetterFactory(nameCondition("month", 4)),
                    MMM: datePartGetterFactory(nameCondition("month", 3)),
                    MM: datePartGetterFactory(digitCondition("month", 2)),
                    M: datePartGetterFactory(digitCondition("month", 1)),
                    LLLL: datePartGetterFactory(nameCondition("month", 4)),
                    L: datePartGetterFactory(nameCondition("month", 1)),
                    dd: datePartGetterFactory(digitCondition("day", 2)),
                    d: datePartGetterFactory(digitCondition("day", 1)),
                    HH: digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition("hour", 2), false)))),
                    H: hourExtractor(datePartGetterFactory(hour12Modify(digitCondition("hour", 1), false))),
                    hh: digitModifier(hourExtractor(datePartGetterFactory(hour12Modify(digitCondition("hour", 2), true)))),
                    h: hourExtractor(datePartGetterFactory(hour12Modify(digitCondition("hour", 1), true))),
                    jj: datePartGetterFactory(digitCondition("hour", 2)),
                    j: datePartGetterFactory(digitCondition("hour", 1)),
                    mm: digitModifier(datePartGetterFactory(digitCondition("minute", 2))),
                    m: datePartGetterFactory(digitCondition("minute", 1)),
                    ss: digitModifier(datePartGetterFactory(digitCondition("second", 2))),
                    s: datePartGetterFactory(digitCondition("second", 1)),
                    sss: datePartGetterFactory(digitCondition("second", 3)),
                    EEEE: datePartGetterFactory(nameCondition("weekday", 4)),
                    EEE: datePartGetterFactory(nameCondition("weekday", 3)),
                    EE: datePartGetterFactory(nameCondition("weekday", 2)),
                    E: datePartGetterFactory(nameCondition("weekday", 1)),
                    a: hourClockExtractor(datePartGetterFactory(hour12Modify(digitCondition("hour", 1), true))),
                    Z: timeZoneGetter("short"),
                    z: timeZoneGetter("long"),
                    ww: datePartGetterFactory({}),
                    w: datePartGetterFactory({}),
                    G: datePartGetterFactory(nameCondition("era", 1)),
                    GG: datePartGetterFactory(nameCondition("era", 2)),
                    GGG: datePartGetterFactory(nameCondition("era", 3)),
                    GGGG: datePartGetterFactory(nameCondition("era", 4))
                };
                function digitModifier(inner) {
                    return function(date, locale) {
                        var result = inner(date, locale);
                        return result.length == 1 ? "0" + result : result;
                    };
                }
                function hourClockExtractor(inner) {
                    return function(date, locale) {
                        return inner(date, locale).split(" ")[1];
                    };
                }
                function hourExtractor(inner) {
                    return function(date, locale) {
                        return inner(date, locale).split(" ")[0];
                    };
                }
                function intlDateFormat(date, locale, options) {
                    return new Intl.DateTimeFormat(locale, options).format(date).replace(/[\u200e\u200f]/g, "");
                }
                function timeZoneGetter(timezone) {
                    var options = {
                        hour: "2-digit",
                        hour12: false,
                        timeZoneName: timezone
                    };
                    return function(date, locale) {
                        var result = intlDateFormat(date, locale, options);
                        return result ? result.substring(3) : "";
                    };
                }
                function hour12Modify(options, value) {
                    options.hour12 = value;
                    return options;
                }
                function digitCondition(prop, len) {
                    var result = {};
                    result[prop] = len === 2 ? "2-digit" : "numeric";
                    return result;
                }
                function nameCondition(prop, len) {
                    var result = {};
                    if (len < 4) {
                        result[prop] = len > 1 ? "short" : "narrow";
                    } else {
                        result[prop] = "long";
                    }
                    return result;
                }
                function combine(options) {
                    return (_a = Object).assign.apply(_a, [ {} ].concat(options));
                    var _a;
                }
                function datePartGetterFactory(ret) {
                    return function(date, locale) {
                        return intlDateFormat(date, locale, ret);
                    };
                }
                var DATE_FORMATTER_CACHE = new Map();
                function dateFormatter(format, date, locale) {
                    var fn = PATTERN_ALIASES[format];
                    if (fn) return fn(date, locale);
                    var cacheKey = format;
                    var parts = DATE_FORMATTER_CACHE.get(cacheKey);
                    if (!parts) {
                        parts = [];
                        var match = void 0;
                        DATE_FORMATS_SPLIT.exec(format);
                        while (format) {
                            match = DATE_FORMATS_SPLIT.exec(format);
                            if (match) {
                                parts = parts.concat(match.slice(1));
                                format = parts.pop();
                            } else {
                                parts.push(format);
                                format = null;
                            }
                        }
                        DATE_FORMATTER_CACHE.set(cacheKey, parts);
                    }
                    return parts.reduce(function(text, part) {
                        var fn = DATE_FORMATS[part];
                        return text + (fn ? fn(date, locale) : partToTime(part));
                    }, "");
                }
                function partToTime(part) {
                    return part === "''" ? "'" : part.replace(/(^'|'$)/g, "").replace(/''/g, "'");
                }
                var DateFormatter = function() {
                    function DateFormatter() {}
                    DateFormatter.format = function(date, locale, pattern) {
                        return dateFormatter(pattern, date, locale);
                    };
                    return DateFormatter;
                }();
                var ISO8601_DATE_REGEX = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                var DatePipe = function() {
                    function DatePipe(_locale) {
                        this._locale = _locale;
                    }
                    DatePipe.prototype.transform = function(value, pattern) {
                        if (pattern === void 0) {
                            pattern = "mediumDate";
                        }
                        var date;
                        if (isBlank$1(value) || value !== value) return null;
                        if (typeof value === "string") {
                            value = value.trim();
                        }
                        if (isDate(value)) {
                            date = value;
                        } else if (NumberWrapper.isNumeric(value)) {
                            date = new Date(parseFloat(value));
                        } else if (typeof value === "string" && /^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
                            var _a = value.split("-").map(function(val) {
                                return parseInt(val, 10);
                            }), y = _a[0], m = _a[1], d = _a[2];
                            date = new Date(y, m - 1, d);
                        } else {
                            date = new Date(value);
                        }
                        if (!isDate(date)) {
                            var match = void 0;
                            if (typeof value === "string" && (match = value.match(ISO8601_DATE_REGEX))) {
                                date = isoStringToDate(match);
                            } else {
                                throw new InvalidPipeArgumentError(DatePipe, value);
                            }
                        }
                        return DateFormatter.format(date, this._locale, DatePipe._ALIASES[pattern] || pattern);
                    };
                    DatePipe._ALIASES = {
                        medium: "yMMMdjms",
                        short: "yMdjm",
                        fullDate: "yMMMMEEEEd",
                        longDate: "yMMMMd",
                        mediumDate: "yMMMd",
                        shortDate: "yMd",
                        mediumTime: "jms",
                        shortTime: "jm"
                    };
                    DatePipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "date",
                            pure: true
                        } ]
                    } ];
                    DatePipe.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Inject,
                                args: [ _angular_core.LOCALE_ID ]
                            } ]
                        } ];
                    };
                    return DatePipe;
                }();
                function isBlank$1(obj) {
                    return obj == null || obj === "";
                }
                function isDate(obj) {
                    return obj instanceof Date && !isNaN(obj.valueOf());
                }
                function isoStringToDate(match) {
                    var date = new Date(0);
                    var tzHour = 0;
                    var tzMin = 0;
                    var dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
                    var timeSetter = match[8] ? date.setUTCHours : date.setHours;
                    if (match[9]) {
                        tzHour = toInt(match[9] + match[10]);
                        tzMin = toInt(match[9] + match[11]);
                    }
                    dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
                    var h = toInt(match[4] || "0") - tzHour;
                    var m = toInt(match[5] || "0") - tzMin;
                    var s = toInt(match[6] || "0");
                    var ms = Math.round(parseFloat("0." + (match[7] || 0)) * 1e3);
                    timeSetter.call(date, h, m, s, ms);
                    return date;
                }
                function toInt(str) {
                    return parseInt(str, 10);
                }
                var _INTERPOLATION_REGEXP = /#/g;
                var I18nPluralPipe = function() {
                    function I18nPluralPipe(_localization) {
                        this._localization = _localization;
                    }
                    I18nPluralPipe.prototype.transform = function(value, pluralMap) {
                        if (value == null) return "";
                        if (typeof pluralMap !== "object" || pluralMap === null) {
                            throw new InvalidPipeArgumentError(I18nPluralPipe, pluralMap);
                        }
                        var key = getPluralCategory(value, Object.keys(pluralMap), this._localization);
                        return pluralMap[key].replace(_INTERPOLATION_REGEXP, value.toString());
                    };
                    I18nPluralPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "i18nPlural",
                            pure: true
                        } ]
                    } ];
                    I18nPluralPipe.ctorParameters = function() {
                        return [ {
                            type: NgLocalization
                        } ];
                    };
                    return I18nPluralPipe;
                }();
                var I18nSelectPipe = function() {
                    function I18nSelectPipe() {}
                    I18nSelectPipe.prototype.transform = function(value, mapping) {
                        if (value == null) return "";
                        if (typeof mapping !== "object" || typeof value !== "string") {
                            throw new InvalidPipeArgumentError(I18nSelectPipe, mapping);
                        }
                        if (mapping.hasOwnProperty(value)) {
                            return mapping[value];
                        }
                        if (mapping.hasOwnProperty("other")) {
                            return mapping["other"];
                        }
                        return "";
                    };
                    I18nSelectPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "i18nSelect",
                            pure: true
                        } ]
                    } ];
                    I18nSelectPipe.ctorParameters = function() {
                        return [];
                    };
                    return I18nSelectPipe;
                }();
                var JsonPipe = function() {
                    function JsonPipe() {}
                    JsonPipe.prototype.transform = function(value) {
                        return JSON.stringify(value, null, 2);
                    };
                    JsonPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "json",
                            pure: false
                        } ]
                    } ];
                    JsonPipe.ctorParameters = function() {
                        return [];
                    };
                    return JsonPipe;
                }();
                var LowerCasePipe = function() {
                    function LowerCasePipe() {}
                    LowerCasePipe.prototype.transform = function(value) {
                        if (isBlank(value)) return value;
                        if (typeof value !== "string") {
                            throw new InvalidPipeArgumentError(LowerCasePipe, value);
                        }
                        return value.toLowerCase();
                    };
                    LowerCasePipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "lowercase"
                        } ]
                    } ];
                    LowerCasePipe.ctorParameters = function() {
                        return [];
                    };
                    return LowerCasePipe;
                }();
                var _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
                function formatNumber(pipe, locale, value, style, digits, currency, currencyAsSymbol) {
                    if (currency === void 0) {
                        currency = null;
                    }
                    if (currencyAsSymbol === void 0) {
                        currencyAsSymbol = false;
                    }
                    if (value == null) return null;
                    value = typeof value === "string" && NumberWrapper.isNumeric(value) ? +value : value;
                    if (typeof value !== "number") {
                        throw new InvalidPipeArgumentError(pipe, value);
                    }
                    var minInt;
                    var minFraction;
                    var maxFraction;
                    if (style !== NumberFormatStyle.Currency) {
                        minInt = 1;
                        minFraction = 0;
                        maxFraction = 3;
                    }
                    if (digits) {
                        var parts = digits.match(_NUMBER_FORMAT_REGEXP);
                        if (parts === null) {
                            throw new Error(digits + " is not a valid digit info for number pipes");
                        }
                        if (parts[1] != null) {
                            minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
                        }
                        if (parts[3] != null) {
                            minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
                        }
                        if (parts[5] != null) {
                            maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
                        }
                    }
                    return NumberFormatter.format(value, locale, style, {
                        minimumIntegerDigits: minInt,
                        minimumFractionDigits: minFraction,
                        maximumFractionDigits: maxFraction,
                        currency: currency,
                        currencyAsSymbol: currencyAsSymbol
                    });
                }
                var DecimalPipe = function() {
                    function DecimalPipe(_locale) {
                        this._locale = _locale;
                    }
                    DecimalPipe.prototype.transform = function(value, digits) {
                        if (digits === void 0) {
                            digits = null;
                        }
                        return formatNumber(DecimalPipe, this._locale, value, NumberFormatStyle.Decimal, digits);
                    };
                    DecimalPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "number"
                        } ]
                    } ];
                    DecimalPipe.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Inject,
                                args: [ _angular_core.LOCALE_ID ]
                            } ]
                        } ];
                    };
                    return DecimalPipe;
                }();
                var PercentPipe = function() {
                    function PercentPipe(_locale) {
                        this._locale = _locale;
                    }
                    PercentPipe.prototype.transform = function(value, digits) {
                        if (digits === void 0) {
                            digits = null;
                        }
                        return formatNumber(PercentPipe, this._locale, value, NumberFormatStyle.Percent, digits);
                    };
                    PercentPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "percent"
                        } ]
                    } ];
                    PercentPipe.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Inject,
                                args: [ _angular_core.LOCALE_ID ]
                            } ]
                        } ];
                    };
                    return PercentPipe;
                }();
                var CurrencyPipe = function() {
                    function CurrencyPipe(_locale) {
                        this._locale = _locale;
                    }
                    CurrencyPipe.prototype.transform = function(value, currencyCode, symbolDisplay, digits) {
                        if (currencyCode === void 0) {
                            currencyCode = "USD";
                        }
                        if (symbolDisplay === void 0) {
                            symbolDisplay = false;
                        }
                        if (digits === void 0) {
                            digits = null;
                        }
                        return formatNumber(CurrencyPipe, this._locale, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
                    };
                    CurrencyPipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "currency"
                        } ]
                    } ];
                    CurrencyPipe.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: _angular_core.Inject,
                                args: [ _angular_core.LOCALE_ID ]
                            } ]
                        } ];
                    };
                    return CurrencyPipe;
                }();
                var SlicePipe = function() {
                    function SlicePipe() {}
                    SlicePipe.prototype.transform = function(value, start, end) {
                        if (value == null) return value;
                        if (!this.supports(value)) {
                            throw new InvalidPipeArgumentError(SlicePipe, value);
                        }
                        return value.slice(start, end);
                    };
                    SlicePipe.prototype.supports = function(obj) {
                        return typeof obj === "string" || Array.isArray(obj);
                    };
                    SlicePipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "slice",
                            pure: false
                        } ]
                    } ];
                    SlicePipe.ctorParameters = function() {
                        return [];
                    };
                    return SlicePipe;
                }();
                var UpperCasePipe = function() {
                    function UpperCasePipe() {}
                    UpperCasePipe.prototype.transform = function(value) {
                        if (isBlank(value)) return value;
                        if (typeof value !== "string") {
                            throw new InvalidPipeArgumentError(UpperCasePipe, value);
                        }
                        return value.toUpperCase();
                    };
                    UpperCasePipe.decorators = [ {
                        type: _angular_core.Pipe,
                        args: [ {
                            name: "uppercase"
                        } ]
                    } ];
                    UpperCasePipe.ctorParameters = function() {
                        return [];
                    };
                    return UpperCasePipe;
                }();
                var COMMON_PIPES = [ AsyncPipe, UpperCasePipe, LowerCasePipe, JsonPipe, SlicePipe, DecimalPipe, PercentPipe, CurrencyPipe, DatePipe, I18nPluralPipe, I18nSelectPipe ];
                var CommonModule = function() {
                    function CommonModule() {}
                    CommonModule.decorators = [ {
                        type: _angular_core.NgModule,
                        args: [ {
                            declarations: [ COMMON_DIRECTIVES, COMMON_PIPES ],
                            exports: [ COMMON_DIRECTIVES, COMMON_PIPES ],
                            providers: [ {
                                provide: NgLocalization,
                                useClass: NgLocaleLocalization
                            } ]
                        } ]
                    } ];
                    CommonModule.ctorParameters = function() {
                        return [];
                    };
                    return CommonModule;
                }();
                var VERSION = new _angular_core.Version("2.4.10");
                exports.NgLocalization = NgLocalization;
                exports.CommonModule = CommonModule;
                exports.NgClass = NgClass;
                exports.NgFor = NgFor;
                exports.NgIf = NgIf;
                exports.NgPlural = NgPlural;
                exports.NgPluralCase = NgPluralCase;
                exports.NgStyle = NgStyle;
                exports.NgSwitch = NgSwitch;
                exports.NgSwitchCase = NgSwitchCase;
                exports.NgSwitchDefault = NgSwitchDefault;
                exports.NgTemplateOutlet = NgTemplateOutlet;
                exports.AsyncPipe = AsyncPipe;
                exports.DatePipe = DatePipe;
                exports.I18nPluralPipe = I18nPluralPipe;
                exports.I18nSelectPipe = I18nSelectPipe;
                exports.JsonPipe = JsonPipe;
                exports.LowerCasePipe = LowerCasePipe;
                exports.CurrencyPipe = CurrencyPipe;
                exports.DecimalPipe = DecimalPipe;
                exports.PercentPipe = PercentPipe;
                exports.SlicePipe = SlicePipe;
                exports.UpperCasePipe = UpperCasePipe;
                exports.VERSION = VERSION;
                exports.Version = _angular_core.Version;
                exports.PlatformLocation = PlatformLocation;
                exports.LOCATION_INITIALIZED = LOCATION_INITIALIZED;
                exports.LocationStrategy = LocationStrategy;
                exports.APP_BASE_HREF = APP_BASE_HREF;
                exports.HashLocationStrategy = HashLocationStrategy;
                exports.PathLocationStrategy = PathLocationStrategy;
                exports.Location = Location;
            });
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        !function(t, e) {
            if (true) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
                var r = e();
                for (var n in r) ("object" == typeof exports ? exports : t)[n] = r[n];
            }
        }(this, function() {
            return function(t) {
                function e(n) {
                    if (r[n]) return r[n].exports;
                    var i = r[n] = {
                        exports: {},
                        id: n,
                        loaded: !1
                    };
                    return t[n].call(i.exports, i, i.exports, e), i.loaded = !0, i.exports;
                }
                var r = {};
                return e.m = t, e.c = r, e.p = "/static/", e(0);
            }([ function(t, e, r) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var n = r(12), i = function() {
                    function t() {
                        this.events = {};
                    }
                    return t.prototype.publish = function(t, e, r) {
                        return void 0 === r && (r = 1), this.getSubjectByEventName(t, r).next(e), this;
                    }, t.prototype.subscribe = function(t, e, r) {
                        if (void 0 === r && (r = 1), !this.isCallback(e)) return !1;
                        var n = this.getSubjectByEventName(t, r).subscribe(e);
                        return n;
                    }, t.prototype.subscribeOnce = function(t, e) {
                        var r = this;
                        if (!this.isCallback(e)) return !1;
                        var n = this.getSubjectByEventName(t).subscribe(function(t) {
                            e(t), r.unsubscribe(n);
                        });
                        return n;
                    }, t.prototype.unsubscribe = function(t) {
                        return t && t.unsubscribe(), this;
                    }, t.prototype.unsubscribeAll = function(t) {
                        return t && t.forEach(function(t) {
                            t.unsubscribe();
                        }), this;
                    }, t.prototype.dispose = function(t) {
                        return this.events[t] ? (this.getSubjectByEventName(t).unsubscribe(), delete this.events[t]) : console.warn("The event [" + t + "] doesn't exist!"), 
                        this;
                    }, t.prototype.hasSubscribers = function(t) {
                        var e = !1;
                        return this.events[t] && this.getSubjectByEventName(t).observers.length > 0 && (e = !0), 
                        e;
                    }, t.prototype.getEvents = function() {
                        return this.events;
                    }, t.prototype.getSubjects = function() {
                        return this.getEvents();
                    }, t.prototype.getSubjectByEventName = function(t, e) {
                        return void 0 === e && (e = 1), this.events[t] || (this.events[t] = new n.ReplaySubject(e)), 
                        this.events[t];
                    }, t.prototype.isCallback = function(t) {
                        return !(!t || "function" != typeof t) || (console.warn("Callback is missing! Subscription cancelled!"), 
                        !1);
                    }, t;
                }();
                e.RxPubSub = i;
            }, function(t, e, r) {
                "use strict";
                function n(t) {
                    return t.reduce(function(t, e) {
                        return t.concat(e instanceof h.UnsubscriptionError ? e.errors : e);
                    }, []);
                }
                var i = r(24), s = r(25), o = r(10), c = r(27), u = r(9), h = r(23), p = function() {
                    function t(t) {
                        this.closed = !1, this._parent = null, this._parents = null, this._subscriptions = null, 
                        t && (this._unsubscribe = t);
                    }
                    return t.prototype.unsubscribe = function() {
                        var t, e = !1;
                        if (!this.closed) {
                            var r = this, p = r._parent, a = r._parents, b = r._unsubscribe, f = r._subscriptions;
                            this.closed = !0, this._parent = null, this._parents = null, this._subscriptions = null;
                            for (var l = -1, d = a ? a.length : 0; p; ) p.remove(this), p = ++l < d && a[l] || null;
                            if (o.isFunction(b)) {
                                var y = c.tryCatch(b).call(this);
                                y === u.errorObject && (e = !0, t = t || (u.errorObject.e instanceof h.UnsubscriptionError ? n(u.errorObject.e.errors) : [ u.errorObject.e ]));
                            }
                            if (i.isArray(f)) for (l = -1, d = f.length; ++l < d; ) {
                                var v = f[l];
                                if (s.isObject(v)) {
                                    var y = c.tryCatch(v.unsubscribe).call(v);
                                    if (y === u.errorObject) {
                                        e = !0, t = t || [];
                                        var w = u.errorObject.e;
                                        w instanceof h.UnsubscriptionError ? t = t.concat(n(w.errors)) : t.push(w);
                                    }
                                }
                            }
                            if (e) throw new h.UnsubscriptionError(t);
                        }
                    }, t.prototype.add = function(e) {
                        if (!e || e === t.EMPTY) return t.EMPTY;
                        if (e === this) return this;
                        var r = e;
                        switch (typeof e) {
                          case "function":
                            r = new t(e);

                          case "object":
                            if (r.closed || "function" != typeof r.unsubscribe) return r;
                            if (this.closed) return r.unsubscribe(), r;
                            if ("function" != typeof r._addParent) {
                                var n = r;
                                r = new t(), r._subscriptions = [ n ];
                            }
                            break;

                          default:
                            throw new Error("unrecognized teardown " + e + " added to Subscription.");
                        }
                        var i = this._subscriptions || (this._subscriptions = []);
                        return i.push(r), r._addParent(this), r;
                    }, t.prototype.remove = function(t) {
                        var e = this._subscriptions;
                        if (e) {
                            var r = e.indexOf(t);
                            r !== -1 && e.splice(r, 1);
                        }
                    }, t.prototype._addParent = function(t) {
                        var e = this, r = e._parent, n = e._parents;
                        r && r !== t ? n ? n.indexOf(t) === -1 && n.push(t) : this._parents = [ t ] : this._parent = t;
                    }, t.EMPTY = function(t) {
                        return t.closed = !0, t;
                    }(new t()), t;
                }();
                e.Subscription = p;
            }, function(t, e) {
                (function(t) {
                    "use strict";
                    var r = "undefined" != typeof window && window, n = "undefined" != typeof self && "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self, i = "undefined" != typeof t && t, s = r || i || n;
                    e.root = s, function() {
                        if (!s) throw new Error("RxJS could not find any global context (window, self, global)");
                    }();
                }).call(e, function() {
                    return this;
                }());
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(10), s = r(1), o = r(6), c = r(4), u = function(t) {
                    function e(r, n, i) {
                        switch (t.call(this), this.syncErrorValue = null, this.syncErrorThrown = !1, this.syncErrorThrowable = !1, 
                        this.isStopped = !1, arguments.length) {
                          case 0:
                            this.destination = o.empty;
                            break;

                          case 1:
                            if (!r) {
                                this.destination = o.empty;
                                break;
                            }
                            if ("object" == typeof r) {
                                r instanceof e ? (this.destination = r, this.destination.add(this)) : (this.syncErrorThrowable = !0, 
                                this.destination = new h(this, r));
                                break;
                            }

                          default:
                            this.syncErrorThrowable = !0, this.destination = new h(this, r, n, i);
                        }
                    }
                    return n(e, t), e.prototype[c.rxSubscriber] = function() {
                        return this;
                    }, e.create = function(t, r, n) {
                        var i = new e(t, r, n);
                        return i.syncErrorThrowable = !1, i;
                    }, e.prototype.next = function(t) {
                        this.isStopped || this._next(t);
                    }, e.prototype.error = function(t) {
                        this.isStopped || (this.isStopped = !0, this._error(t));
                    }, e.prototype.complete = function() {
                        this.isStopped || (this.isStopped = !0, this._complete());
                    }, e.prototype.unsubscribe = function() {
                        this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this));
                    }, e.prototype._next = function(t) {
                        this.destination.next(t);
                    }, e.prototype._error = function(t) {
                        this.destination.error(t), this.unsubscribe();
                    }, e.prototype._complete = function() {
                        this.destination.complete(), this.unsubscribe();
                    }, e.prototype._unsubscribeAndRecycle = function() {
                        var t = this, e = t._parent, r = t._parents;
                        return this._parent = null, this._parents = null, this.unsubscribe(), this.closed = !1, 
                        this.isStopped = !1, this._parent = e, this._parents = r, this;
                    }, e;
                }(s.Subscription);
                e.Subscriber = u;
                var h = function(t) {
                    function e(e, r, n, s) {
                        t.call(this), this._parentSubscriber = e;
                        var c, u = this;
                        i.isFunction(r) ? c = r : r && (c = r.next, n = r.error, s = r.complete, r !== o.empty && (u = Object.create(r), 
                        i.isFunction(u.unsubscribe) && this.add(u.unsubscribe.bind(u)), u.unsubscribe = this.unsubscribe.bind(this))), 
                        this._context = u, this._next = c, this._error = n, this._complete = s;
                    }
                    return n(e, t), e.prototype.next = function(t) {
                        if (!this.isStopped && this._next) {
                            var e = this._parentSubscriber;
                            e.syncErrorThrowable ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe() : this.__tryOrUnsub(this._next, t);
                        }
                    }, e.prototype.error = function(t) {
                        if (!this.isStopped) {
                            var e = this._parentSubscriber;
                            if (this._error) e.syncErrorThrowable ? (this.__tryOrSetError(e, this._error, t), 
                            this.unsubscribe()) : (this.__tryOrUnsub(this._error, t), this.unsubscribe()); else {
                                if (!e.syncErrorThrowable) throw this.unsubscribe(), t;
                                e.syncErrorValue = t, e.syncErrorThrown = !0, this.unsubscribe();
                            }
                        }
                    }, e.prototype.complete = function() {
                        var t = this;
                        if (!this.isStopped) {
                            var e = this._parentSubscriber;
                            if (this._complete) {
                                var r = function() {
                                    return t._complete.call(t._context);
                                };
                                e.syncErrorThrowable ? (this.__tryOrSetError(e, r), this.unsubscribe()) : (this.__tryOrUnsub(r), 
                                this.unsubscribe());
                            } else this.unsubscribe();
                        }
                    }, e.prototype.__tryOrUnsub = function(t, e) {
                        try {
                            t.call(this._context, e);
                        } catch (t) {
                            throw this.unsubscribe(), t;
                        }
                    }, e.prototype.__tryOrSetError = function(t, e, r) {
                        try {
                            e.call(this._context, r);
                        } catch (e) {
                            return t.syncErrorValue = e, t.syncErrorThrown = !0, !0;
                        }
                        return !1;
                    }, e.prototype._unsubscribe = function() {
                        var t = this._parentSubscriber;
                        this._context = null, this._parentSubscriber = null, t.unsubscribe();
                    }, e;
                }(u);
            }, function(t, e, r) {
                "use strict";
                var n = r(2), i = n.root.Symbol;
                e.rxSubscriber = "function" == typeof i && "function" == typeof i.for ? i.for("rxSubscriber") : "@@rxSubscriber", 
                e.$$rxSubscriber = e.rxSubscriber;
            }, function(t, e, r) {
                "use strict";
                var n = r(2), i = r(26), s = r(22), o = function() {
                    function t(t) {
                        this._isScalar = !1, t && (this._subscribe = t);
                    }
                    return t.prototype.lift = function(e) {
                        var r = new t();
                        return r.source = this, r.operator = e, r;
                    }, t.prototype.subscribe = function(t, e, r) {
                        var n = this.operator, s = i.toSubscriber(t, e, r);
                        if (n ? n.call(s, this.source) : s.add(this._trySubscribe(s)), s.syncErrorThrowable && (s.syncErrorThrowable = !1, 
                        s.syncErrorThrown)) throw s.syncErrorValue;
                        return s;
                    }, t.prototype._trySubscribe = function(t) {
                        try {
                            return this._subscribe(t);
                        } catch (e) {
                            t.syncErrorThrown = !0, t.syncErrorValue = e, t.error(e);
                        }
                    }, t.prototype.forEach = function(t, e) {
                        var r = this;
                        if (e || (n.root.Rx && n.root.Rx.config && n.root.Rx.config.Promise ? e = n.root.Rx.config.Promise : n.root.Promise && (e = n.root.Promise)), 
                        !e) throw new Error("no Promise impl found");
                        return new e(function(e, n) {
                            var i;
                            i = r.subscribe(function(e) {
                                if (i) try {
                                    t(e);
                                } catch (t) {
                                    n(t), i.unsubscribe();
                                } else t(e);
                            }, n, e);
                        });
                    }, t.prototype._subscribe = function(t) {
                        return this.source.subscribe(t);
                    }, t.prototype[s.observable] = function() {
                        return this;
                    }, t.create = function(e) {
                        return new t(e);
                    }, t;
                }();
                e.Observable = o;
            }, function(t, e) {
                "use strict";
                e.empty = {
                    closed: !0,
                    next: function(t) {},
                    error: function(t) {
                        throw t;
                    },
                    complete: function() {}
                };
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(1), s = function(t) {
                    function e(e, r) {
                        t.call(this), this.subject = e, this.subscriber = r, this.closed = !1;
                    }
                    return n(e, t), e.prototype.unsubscribe = function() {
                        if (!this.closed) {
                            this.closed = !0;
                            var t = this.subject, e = t.observers;
                            if (this.subject = null, e && 0 !== e.length && !t.isStopped && !t.closed) {
                                var r = e.indexOf(this.subscriber);
                                r !== -1 && e.splice(r, 1);
                            }
                        }
                    }, e;
                }(i.Subscription);
                e.SubjectSubscription = s;
            }, function(t, e) {
                "use strict";
                var r = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, n = function(t) {
                    function e() {
                        var e = t.call(this, "object unsubscribed");
                        this.name = e.name = "ObjectUnsubscribedError", this.stack = e.stack, this.message = e.message;
                    }
                    return r(e, t), e;
                }(Error);
                e.ObjectUnsubscribedError = n;
            }, function(t, e) {
                "use strict";
                e.errorObject = {
                    e: {}
                };
            }, function(t, e) {
                "use strict";
                function r(t) {
                    return "function" == typeof t;
                }
                e.isFunction = r;
            }, function(t, e, r) {
                "use strict";
                var n = r(5), i = function() {
                    function t(t, e, r) {
                        this.kind = t, this.value = e, this.error = r, this.hasValue = "N" === t;
                    }
                    return t.prototype.observe = function(t) {
                        switch (this.kind) {
                          case "N":
                            return t.next && t.next(this.value);

                          case "E":
                            return t.error && t.error(this.error);

                          case "C":
                            return t.complete && t.complete();
                        }
                    }, t.prototype.do = function(t, e, r) {
                        var n = this.kind;
                        switch (n) {
                          case "N":
                            return t && t(this.value);

                          case "E":
                            return e && e(this.error);

                          case "C":
                            return r && r();
                        }
                    }, t.prototype.accept = function(t, e, r) {
                        return t && "function" == typeof t.next ? this.observe(t) : this.do(t, e, r);
                    }, t.prototype.toObservable = function() {
                        var t = this.kind;
                        switch (t) {
                          case "N":
                            return n.Observable.of(this.value);

                          case "E":
                            return n.Observable.throw(this.error);

                          case "C":
                            return n.Observable.empty();
                        }
                        throw new Error("unexpected notification kind value");
                    }, t.createNext = function(e) {
                        return "undefined" != typeof e ? new t("N", e) : this.undefinedValueNotification;
                    }, t.createError = function(e) {
                        return new t("E", void 0, e);
                    }, t.createComplete = function() {
                        return this.completeNotification;
                    }, t.completeNotification = new t("C"), t.undefinedValueNotification = new t("N", void 0), 
                    t;
                }();
                e.Notification = i;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(14), s = r(21), o = r(1), c = r(15), u = r(8), h = r(7), p = function(t) {
                    function e(e, r, n) {
                        void 0 === e && (e = Number.POSITIVE_INFINITY), void 0 === r && (r = Number.POSITIVE_INFINITY), 
                        t.call(this), this.scheduler = n, this._events = [], this._bufferSize = e < 1 ? 1 : e, 
                        this._windowTime = r < 1 ? 1 : r;
                    }
                    return n(e, t), e.prototype.next = function(e) {
                        var r = this._getNow();
                        this._events.push(new a(r, e)), this._trimBufferThenGetEvents(), t.prototype.next.call(this, e);
                    }, e.prototype._subscribe = function(t) {
                        var e, r = this._trimBufferThenGetEvents(), n = this.scheduler;
                        if (this.closed) throw new u.ObjectUnsubscribedError();
                        this.hasError ? e = o.Subscription.EMPTY : this.isStopped ? e = o.Subscription.EMPTY : (this.observers.push(t), 
                        e = new h.SubjectSubscription(this, t)), n && t.add(t = new c.ObserveOnSubscriber(t, n));
                        for (var i = r.length, s = 0; s < i && !t.closed; s++) t.next(r[s].value);
                        return this.hasError ? t.error(this.thrownError) : this.isStopped && t.complete(), 
                        e;
                    }, e.prototype._getNow = function() {
                        return (this.scheduler || s.queue).now();
                    }, e.prototype._trimBufferThenGetEvents = function() {
                        for (var t = this._getNow(), e = this._bufferSize, r = this._windowTime, n = this._events, i = n.length, s = 0; s < i && !(t - n[s].time < r); ) s++;
                        return i > e && (s = Math.max(s, i - e)), s > 0 && n.splice(0, s), n;
                    }, e;
                }(i.Subject);
                e.ReplaySubject = p;
                var a = function() {
                    function t(t, e) {
                        this.time = t, this.value = e;
                    }
                    return t;
                }();
            }, function(t, e) {
                "use strict";
                var r = function() {
                    function t(e, r) {
                        void 0 === r && (r = t.now), this.SchedulerAction = e, this.now = r;
                    }
                    return t.prototype.schedule = function(t, e, r) {
                        return void 0 === e && (e = 0), new this.SchedulerAction(this, t).schedule(r, e);
                    }, t.now = Date.now ? Date.now : function() {
                        return +new Date();
                    }, t;
                }();
                e.Scheduler = r;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(5), s = r(3), o = r(1), c = r(8), u = r(7), h = r(4), p = function(t) {
                    function e(e) {
                        t.call(this, e), this.destination = e;
                    }
                    return n(e, t), e;
                }(s.Subscriber);
                e.SubjectSubscriber = p;
                var a = function(t) {
                    function e() {
                        t.call(this), this.observers = [], this.closed = !1, this.isStopped = !1, this.hasError = !1, 
                        this.thrownError = null;
                    }
                    return n(e, t), e.prototype[h.rxSubscriber] = function() {
                        return new p(this);
                    }, e.prototype.lift = function(t) {
                        var e = new b(this, this);
                        return e.operator = t, e;
                    }, e.prototype.next = function(t) {
                        if (this.closed) throw new c.ObjectUnsubscribedError();
                        if (!this.isStopped) for (var e = this.observers, r = e.length, n = e.slice(), i = 0; i < r; i++) n[i].next(t);
                    }, e.prototype.error = function(t) {
                        if (this.closed) throw new c.ObjectUnsubscribedError();
                        this.hasError = !0, this.thrownError = t, this.isStopped = !0;
                        for (var e = this.observers, r = e.length, n = e.slice(), i = 0; i < r; i++) n[i].error(t);
                        this.observers.length = 0;
                    }, e.prototype.complete = function() {
                        if (this.closed) throw new c.ObjectUnsubscribedError();
                        this.isStopped = !0;
                        for (var t = this.observers, e = t.length, r = t.slice(), n = 0; n < e; n++) r[n].complete();
                        this.observers.length = 0;
                    }, e.prototype.unsubscribe = function() {
                        this.isStopped = !0, this.closed = !0, this.observers = null;
                    }, e.prototype._trySubscribe = function(e) {
                        if (this.closed) throw new c.ObjectUnsubscribedError();
                        return t.prototype._trySubscribe.call(this, e);
                    }, e.prototype._subscribe = function(t) {
                        if (this.closed) throw new c.ObjectUnsubscribedError();
                        return this.hasError ? (t.error(this.thrownError), o.Subscription.EMPTY) : this.isStopped ? (t.complete(), 
                        o.Subscription.EMPTY) : (this.observers.push(t), new u.SubjectSubscription(this, t));
                    }, e.prototype.asObservable = function() {
                        var t = new i.Observable();
                        return t.source = this, t;
                    }, e.create = function(t, e) {
                        return new b(t, e);
                    }, e;
                }(i.Observable);
                e.Subject = a;
                var b = function(t) {
                    function e(e, r) {
                        t.call(this), this.destination = e, this.source = r;
                    }
                    return n(e, t), e.prototype.next = function(t) {
                        var e = this.destination;
                        e && e.next && e.next(t);
                    }, e.prototype.error = function(t) {
                        var e = this.destination;
                        e && e.error && this.destination.error(t);
                    }, e.prototype.complete = function() {
                        var t = this.destination;
                        t && t.complete && this.destination.complete();
                    }, e.prototype._subscribe = function(t) {
                        var e = this.source;
                        return e ? this.source.subscribe(t) : o.Subscription.EMPTY;
                    }, e;
                }(a);
                e.AnonymousSubject = b;
            }, function(t, e, r) {
                "use strict";
                function n(t, e) {
                    return void 0 === e && (e = 0), this.lift(new c(t, e));
                }
                var i = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, s = r(3), o = r(11);
                e.observeOn = n;
                var c = function() {
                    function t(t, e) {
                        void 0 === e && (e = 0), this.scheduler = t, this.delay = e;
                    }
                    return t.prototype.call = function(t, e) {
                        return e.subscribe(new u(t, this.scheduler, this.delay));
                    }, t;
                }();
                e.ObserveOnOperator = c;
                var u = function(t) {
                    function e(e, r, n) {
                        void 0 === n && (n = 0), t.call(this, e), this.scheduler = r, this.delay = n;
                    }
                    return i(e, t), e.dispatch = function(t) {
                        var e = t.notification, r = t.destination;
                        e.observe(r), this.unsubscribe();
                    }, e.prototype.scheduleMessage = function(t) {
                        this.add(this.scheduler.schedule(e.dispatch, this.delay, new h(t, this.destination)));
                    }, e.prototype._next = function(t) {
                        this.scheduleMessage(o.Notification.createNext(t));
                    }, e.prototype._error = function(t) {
                        this.scheduleMessage(o.Notification.createError(t));
                    }, e.prototype._complete = function() {
                        this.scheduleMessage(o.Notification.createComplete());
                    }, e;
                }(s.Subscriber);
                e.ObserveOnSubscriber = u;
                var h = function() {
                    function t(t, e) {
                        this.notification = t, this.destination = e;
                    }
                    return t;
                }();
                e.ObserveOnMessage = h;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(1), s = function(t) {
                    function e(e, r) {
                        t.call(this);
                    }
                    return n(e, t), e.prototype.schedule = function(t, e) {
                        return void 0 === e && (e = 0), this;
                    }, e;
                }(i.Subscription);
                e.Action = s;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(2), s = r(16), o = function(t) {
                    function e(e, r) {
                        t.call(this, e, r), this.scheduler = e, this.work = r, this.pending = !1;
                    }
                    return n(e, t), e.prototype.schedule = function(t, e) {
                        if (void 0 === e && (e = 0), this.closed) return this;
                        this.state = t, this.pending = !0;
                        var r = this.id, n = this.scheduler;
                        return null != r && (this.id = this.recycleAsyncId(n, r, e)), this.delay = e, this.id = this.id || this.requestAsyncId(n, this.id, e), 
                        this;
                    }, e.prototype.requestAsyncId = function(t, e, r) {
                        return void 0 === r && (r = 0), i.root.setInterval(t.flush.bind(t, this), r);
                    }, e.prototype.recycleAsyncId = function(t, e, r) {
                        return void 0 === r && (r = 0), null !== r && this.delay === r && this.pending === !1 ? e : i.root.clearInterval(e) && void 0 || void 0;
                    }, e.prototype.execute = function(t, e) {
                        if (this.closed) return new Error("executing a cancelled action");
                        this.pending = !1;
                        var r = this._execute(t, e);
                        return r ? r : void (this.pending === !1 && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null)));
                    }, e.prototype._execute = function(t, e) {
                        var r = !1, n = void 0;
                        try {
                            this.work(t);
                        } catch (t) {
                            r = !0, n = !!t && t || new Error(t);
                        }
                        if (r) return this.unsubscribe(), n;
                    }, e.prototype._unsubscribe = function() {
                        var t = this.id, e = this.scheduler, r = e.actions, n = r.indexOf(this);
                        this.work = null, this.delay = null, this.state = null, this.pending = !1, this.scheduler = null, 
                        n !== -1 && r.splice(n, 1), null != t && (this.id = this.recycleAsyncId(e, t, null));
                    }, e;
                }(s.Action);
                e.AsyncAction = o;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(13), s = function(t) {
                    function e() {
                        t.apply(this, arguments), this.actions = [], this.active = !1, this.scheduled = void 0;
                    }
                    return n(e, t), e.prototype.flush = function(t) {
                        var e = this.actions;
                        if (this.active) return void e.push(t);
                        var r;
                        this.active = !0;
                        do if (r = t.execute(t.state, t.delay)) break; while (t = e.shift());
                        if (this.active = !1, r) {
                            for (;t = e.shift(); ) t.unsubscribe();
                            throw r;
                        }
                    }, e;
                }(i.Scheduler);
                e.AsyncScheduler = s;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(17), s = function(t) {
                    function e(e, r) {
                        t.call(this, e, r), this.scheduler = e, this.work = r;
                    }
                    return n(e, t), e.prototype.schedule = function(e, r) {
                        return void 0 === r && (r = 0), r > 0 ? t.prototype.schedule.call(this, e, r) : (this.delay = r, 
                        this.state = e, this.scheduler.flush(this), this);
                    }, e.prototype.execute = function(e, r) {
                        return r > 0 || this.closed ? t.prototype.execute.call(this, e, r) : this._execute(e, r);
                    }, e.prototype.requestAsyncId = function(e, r, n) {
                        return void 0 === n && (n = 0), null !== n && n > 0 || null === n && this.delay > 0 ? t.prototype.requestAsyncId.call(this, e, r, n) : e.flush(this);
                    }, e;
                }(i.AsyncAction);
                e.QueueAction = s;
            }, function(t, e, r) {
                "use strict";
                var n = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, i = r(18), s = function(t) {
                    function e() {
                        t.apply(this, arguments);
                    }
                    return n(e, t), e;
                }(i.AsyncScheduler);
                e.QueueScheduler = s;
            }, function(t, e, r) {
                "use strict";
                var n = r(19), i = r(20);
                e.queue = new i.QueueScheduler(n.QueueAction);
            }, function(t, e, r) {
                "use strict";
                function n(t) {
                    var e, r = t.Symbol;
                    return "function" == typeof r ? r.observable ? e = r.observable : (e = r("observable"), 
                    r.observable = e) : e = "@@observable", e;
                }
                var i = r(2);
                e.getSymbolObservable = n, e.observable = n(i.root), e.$$observable = e.observable;
            }, function(t, e) {
                "use strict";
                var r = this && this.__extends || function(t, e) {
                    function r() {
                        this.constructor = t;
                    }
                    for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                    t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
                }, n = function(t) {
                    function e(e) {
                        t.call(this), this.errors = e;
                        var r = Error.call(this, e ? e.length + " errors occurred during unsubscription:\n  " + e.map(function(t, e) {
                            return e + 1 + ") " + t.toString();
                        }).join("\n  ") : "");
                        this.name = r.name = "UnsubscriptionError", this.stack = r.stack, this.message = r.message;
                    }
                    return r(e, t), e;
                }(Error);
                e.UnsubscriptionError = n;
            }, function(t, e) {
                "use strict";
                e.isArray = Array.isArray || function(t) {
                    return t && "number" == typeof t.length;
                };
            }, function(t, e) {
                "use strict";
                function r(t) {
                    return null != t && "object" == typeof t;
                }
                e.isObject = r;
            }, function(t, e, r) {
                "use strict";
                function n(t, e, r) {
                    if (t) {
                        if (t instanceof i.Subscriber) return t;
                        if (t[s.rxSubscriber]) return t[s.rxSubscriber]();
                    }
                    return t || e || r ? new i.Subscriber(t, e, r) : new i.Subscriber(o.empty);
                }
                var i = r(3), s = r(4), o = r(6);
                e.toSubscriber = n;
            }, function(t, e, r) {
                "use strict";
                function n() {
                    try {
                        return s.apply(this, arguments);
                    } catch (t) {
                        return o.errorObject.e = t, o.errorObject;
                    }
                }
                function i(t) {
                    return s = t, n;
                }
                var s, o = r(9);
                e.tryCatch = i;
            } ]);
        });
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = this && this.__metadata || function(k, v) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var core_1 = __webpack_require__(2);
        var platform_browser_1 = __webpack_require__(23);
        var TrustHtmlPipe = function() {
            function TrustHtmlPipe(sanitizer) {
                this.sanitizer = sanitizer;
            }
            TrustHtmlPipe.prototype.transform = function(htmlString) {
                return this.sanitizer.bypassSecurityTrustHtml(htmlString);
            };
            return TrustHtmlPipe;
        }();
        TrustHtmlPipe = __decorate([ core_1.Pipe({
            name: "trustHtml"
        }), __metadata("design:paramtypes", [ platform_browser_1.DomSanitizer ]) ], TrustHtmlPipe);
        exports.TrustHtmlPipe = TrustHtmlPipe;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            (function(global, factory) {
                true ? factory(exports, __webpack_require__(20), __webpack_require__(2)) : typeof define === "function" && define.amd ? define([ "exports", "@angular/common", "@angular/core" ], factory) : factory((global.ng = global.ng || {}, 
                global.ng.platformBrowser = global.ng.platformBrowser || {}), global.ng.common, global.ng.core);
            })(this, function(exports, _angular_common, core) {
                "use strict";
                var DebugDomRootRenderer = core.__core_private__.DebugDomRootRenderer;
                var NoOpAnimationPlayer = core.__core_private__.NoOpAnimationPlayer;
                var NoOpAnimationDriver = function() {
                    function NoOpAnimationDriver() {}
                    NoOpAnimationDriver.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
                        if (previousPlayers === void 0) {
                            previousPlayers = [];
                        }
                        return new NoOpAnimationPlayer();
                    };
                    return NoOpAnimationDriver;
                }();
                var AnimationDriver = function() {
                    function AnimationDriver() {}
                    AnimationDriver.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {};
                    AnimationDriver.NOOP = new NoOpAnimationDriver();
                    return AnimationDriver;
                }();
                var globalScope;
                if (typeof window === "undefined") {
                    if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
                        globalScope = self;
                    } else {
                        globalScope = global;
                    }
                } else {
                    globalScope = window;
                }
                var global$1 = globalScope;
                global$1.assert = function assert(condition) {};
                function isPresent(obj) {
                    return obj != null;
                }
                function isBlank(obj) {
                    return obj == null;
                }
                function stringify(token) {
                    if (typeof token === "string") {
                        return token;
                    }
                    if (token == null) {
                        return "" + token;
                    }
                    if (token.overriddenName) {
                        return "" + token.overriddenName;
                    }
                    if (token.name) {
                        return "" + token.name;
                    }
                    var res = token.toString();
                    var newLineIndex = res.indexOf("\n");
                    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
                }
                function setValueOnPath(global, path, value) {
                    var parts = path.split(".");
                    var obj = global;
                    while (parts.length > 1) {
                        var name_1 = parts.shift();
                        if (obj.hasOwnProperty(name_1) && obj[name_1] != null) {
                            obj = obj[name_1];
                        } else {
                            obj = obj[name_1] = {};
                        }
                    }
                    if (obj === undefined || obj === null) {
                        obj = {};
                    }
                    obj[parts.shift()] = value;
                }
                var _DOM = null;
                function getDOM() {
                    return _DOM;
                }
                function setRootDomAdapter(adapter) {
                    if (!_DOM) {
                        _DOM = adapter;
                    }
                }
                var DomAdapter = function() {
                    function DomAdapter() {
                        this.resourceLoaderType = null;
                    }
                    DomAdapter.prototype.hasProperty = function(element, name) {};
                    DomAdapter.prototype.setProperty = function(el, name, value) {};
                    DomAdapter.prototype.getProperty = function(el, name) {};
                    DomAdapter.prototype.invoke = function(el, methodName, args) {};
                    DomAdapter.prototype.logError = function(error) {};
                    DomAdapter.prototype.log = function(error) {};
                    DomAdapter.prototype.logGroup = function(error) {};
                    DomAdapter.prototype.logGroupEnd = function() {};
                    Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
                        get: function() {
                            return this._attrToPropMap;
                        },
                        set: function(value) {
                            this._attrToPropMap = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DomAdapter.prototype.parse = function(templateHtml) {};
                    DomAdapter.prototype.query = function(selector) {};
                    DomAdapter.prototype.querySelector = function(el, selector) {};
                    DomAdapter.prototype.querySelectorAll = function(el, selector) {};
                    DomAdapter.prototype.on = function(el, evt, listener) {};
                    DomAdapter.prototype.onAndCancel = function(el, evt, listener) {};
                    DomAdapter.prototype.dispatchEvent = function(el, evt) {};
                    DomAdapter.prototype.createMouseEvent = function(eventType) {};
                    DomAdapter.prototype.createEvent = function(eventType) {};
                    DomAdapter.prototype.preventDefault = function(evt) {};
                    DomAdapter.prototype.isPrevented = function(evt) {};
                    DomAdapter.prototype.getInnerHTML = function(el) {};
                    DomAdapter.prototype.getTemplateContent = function(el) {};
                    DomAdapter.prototype.getOuterHTML = function(el) {};
                    DomAdapter.prototype.nodeName = function(node) {};
                    DomAdapter.prototype.nodeValue = function(node) {};
                    DomAdapter.prototype.type = function(node) {};
                    DomAdapter.prototype.content = function(node) {};
                    DomAdapter.prototype.firstChild = function(el) {};
                    DomAdapter.prototype.nextSibling = function(el) {};
                    DomAdapter.prototype.parentElement = function(el) {};
                    DomAdapter.prototype.childNodes = function(el) {};
                    DomAdapter.prototype.childNodesAsList = function(el) {};
                    DomAdapter.prototype.clearNodes = function(el) {};
                    DomAdapter.prototype.appendChild = function(el, node) {};
                    DomAdapter.prototype.removeChild = function(el, node) {};
                    DomAdapter.prototype.replaceChild = function(el, newNode, oldNode) {};
                    DomAdapter.prototype.remove = function(el) {};
                    DomAdapter.prototype.insertBefore = function(el, node) {};
                    DomAdapter.prototype.insertAllBefore = function(el, nodes) {};
                    DomAdapter.prototype.insertAfter = function(el, node) {};
                    DomAdapter.prototype.setInnerHTML = function(el, value) {};
                    DomAdapter.prototype.getText = function(el) {};
                    DomAdapter.prototype.setText = function(el, value) {};
                    DomAdapter.prototype.getValue = function(el) {};
                    DomAdapter.prototype.setValue = function(el, value) {};
                    DomAdapter.prototype.getChecked = function(el) {};
                    DomAdapter.prototype.setChecked = function(el, value) {};
                    DomAdapter.prototype.createComment = function(text) {};
                    DomAdapter.prototype.createTemplate = function(html) {};
                    DomAdapter.prototype.createElement = function(tagName, doc) {};
                    DomAdapter.prototype.createElementNS = function(ns, tagName, doc) {};
                    DomAdapter.prototype.createTextNode = function(text, doc) {};
                    DomAdapter.prototype.createScriptTag = function(attrName, attrValue, doc) {};
                    DomAdapter.prototype.createStyleElement = function(css, doc) {};
                    DomAdapter.prototype.createShadowRoot = function(el) {};
                    DomAdapter.prototype.getShadowRoot = function(el) {};
                    DomAdapter.prototype.getHost = function(el) {};
                    DomAdapter.prototype.getDistributedNodes = function(el) {};
                    DomAdapter.prototype.clone = function(node) {};
                    DomAdapter.prototype.getElementsByClassName = function(element, name) {};
                    DomAdapter.prototype.getElementsByTagName = function(element, name) {};
                    DomAdapter.prototype.classList = function(element) {};
                    DomAdapter.prototype.addClass = function(element, className) {};
                    DomAdapter.prototype.removeClass = function(element, className) {};
                    DomAdapter.prototype.hasClass = function(element, className) {};
                    DomAdapter.prototype.setStyle = function(element, styleName, styleValue) {};
                    DomAdapter.prototype.removeStyle = function(element, styleName) {};
                    DomAdapter.prototype.getStyle = function(element, styleName) {};
                    DomAdapter.prototype.hasStyle = function(element, styleName, styleValue) {};
                    DomAdapter.prototype.tagName = function(element) {};
                    DomAdapter.prototype.attributeMap = function(element) {};
                    DomAdapter.prototype.hasAttribute = function(element, attribute) {};
                    DomAdapter.prototype.hasAttributeNS = function(element, ns, attribute) {};
                    DomAdapter.prototype.getAttribute = function(element, attribute) {};
                    DomAdapter.prototype.getAttributeNS = function(element, ns, attribute) {};
                    DomAdapter.prototype.setAttribute = function(element, name, value) {};
                    DomAdapter.prototype.setAttributeNS = function(element, ns, name, value) {};
                    DomAdapter.prototype.removeAttribute = function(element, attribute) {};
                    DomAdapter.prototype.removeAttributeNS = function(element, ns, attribute) {};
                    DomAdapter.prototype.templateAwareRoot = function(el) {};
                    DomAdapter.prototype.createHtmlDocument = function() {};
                    DomAdapter.prototype.defaultDoc = function() {};
                    DomAdapter.prototype.getBoundingClientRect = function(el) {};
                    DomAdapter.prototype.getTitle = function() {};
                    DomAdapter.prototype.setTitle = function(newTitle) {};
                    DomAdapter.prototype.elementMatches = function(n, selector) {};
                    DomAdapter.prototype.isTemplateElement = function(el) {};
                    DomAdapter.prototype.isTextNode = function(node) {};
                    DomAdapter.prototype.isCommentNode = function(node) {};
                    DomAdapter.prototype.isElementNode = function(node) {};
                    DomAdapter.prototype.hasShadowRoot = function(node) {};
                    DomAdapter.prototype.isShadowRoot = function(node) {};
                    DomAdapter.prototype.importIntoDoc = function(node) {};
                    DomAdapter.prototype.adoptNode = function(node) {};
                    DomAdapter.prototype.getHref = function(element) {};
                    DomAdapter.prototype.getEventKey = function(event) {};
                    DomAdapter.prototype.resolveAndSetHref = function(element, baseUrl, href) {};
                    DomAdapter.prototype.supportsDOMEvents = function() {};
                    DomAdapter.prototype.supportsNativeShadowDOM = function() {};
                    DomAdapter.prototype.getGlobalEventTarget = function(target) {};
                    DomAdapter.prototype.getHistory = function() {};
                    DomAdapter.prototype.getLocation = function() {};
                    DomAdapter.prototype.getBaseHref = function() {};
                    DomAdapter.prototype.resetBaseElement = function() {};
                    DomAdapter.prototype.getUserAgent = function() {};
                    DomAdapter.prototype.setData = function(element, name, value) {};
                    DomAdapter.prototype.getComputedStyle = function(element) {};
                    DomAdapter.prototype.getData = function(element, name) {};
                    DomAdapter.prototype.setGlobalVar = function(name, value) {};
                    DomAdapter.prototype.supportsWebAnimation = function() {};
                    DomAdapter.prototype.performanceNow = function() {};
                    DomAdapter.prototype.getAnimationPrefix = function() {};
                    DomAdapter.prototype.getTransitionEnd = function() {};
                    DomAdapter.prototype.supportsAnimation = function() {};
                    DomAdapter.prototype.supportsCookies = function() {};
                    DomAdapter.prototype.getCookie = function(name) {};
                    DomAdapter.prototype.setCookie = function(name, value) {};
                    return DomAdapter;
                }();
                var WebAnimationsPlayer = function() {
                    function WebAnimationsPlayer(element, keyframes, options, previousPlayers) {
                        var _this = this;
                        if (previousPlayers === void 0) {
                            previousPlayers = [];
                        }
                        this.element = element;
                        this.keyframes = keyframes;
                        this.options = options;
                        this._onDoneFns = [];
                        this._onStartFns = [];
                        this._initialized = false;
                        this._finished = false;
                        this._started = false;
                        this._destroyed = false;
                        this.parentPlayer = null;
                        this._duration = options["duration"];
                        this.previousStyles = {};
                        previousPlayers.forEach(function(player) {
                            var styles = player._captureStyles();
                            Object.keys(styles).forEach(function(prop) {
                                return _this.previousStyles[prop] = styles[prop];
                            });
                        });
                    }
                    WebAnimationsPlayer.prototype._onFinish = function() {
                        if (!this._finished) {
                            this._finished = true;
                            this._onDoneFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onDoneFns = [];
                        }
                    };
                    WebAnimationsPlayer.prototype.init = function() {
                        var _this = this;
                        if (this._initialized) return;
                        this._initialized = true;
                        var keyframes = this.keyframes.map(function(styles) {
                            var formattedKeyframe = {};
                            Object.keys(styles).forEach(function(prop, index) {
                                var value = styles[prop];
                                if (value == core.AUTO_STYLE) {
                                    value = _computeStyle(_this.element, prop);
                                }
                                if (value != undefined) {
                                    formattedKeyframe[prop] = value;
                                }
                            });
                            return formattedKeyframe;
                        });
                        var previousStyleProps = Object.keys(this.previousStyles);
                        if (previousStyleProps.length) {
                            var startingKeyframe_1 = keyframes[0];
                            var missingStyleProps_1 = [];
                            previousStyleProps.forEach(function(prop) {
                                if (!isPresent(startingKeyframe_1[prop])) {
                                    missingStyleProps_1.push(prop);
                                }
                                startingKeyframe_1[prop] = _this.previousStyles[prop];
                            });
                            if (missingStyleProps_1.length) {
                                var _loop_1 = function(i) {
                                    var kf = keyframes[i];
                                    missingStyleProps_1.forEach(function(prop) {
                                        kf[prop] = _computeStyle(_this.element, prop);
                                    });
                                };
                                for (var i = 1; i < keyframes.length; i++) {
                                    _loop_1(i);
                                }
                            }
                        }
                        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
                        this._finalKeyframe = _copyKeyframeStyles(keyframes[keyframes.length - 1]);
                        this._resetDomPlayerState();
                        this._player.addEventListener("finish", function() {
                            return _this._onFinish();
                        });
                    };
                    WebAnimationsPlayer.prototype._triggerWebAnimation = function(element, keyframes, options) {
                        return element["animate"](keyframes, options);
                    };
                    Object.defineProperty(WebAnimationsPlayer.prototype, "domPlayer", {
                        get: function() {
                            return this._player;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    WebAnimationsPlayer.prototype.onStart = function(fn) {
                        this._onStartFns.push(fn);
                    };
                    WebAnimationsPlayer.prototype.onDone = function(fn) {
                        this._onDoneFns.push(fn);
                    };
                    WebAnimationsPlayer.prototype.play = function() {
                        this.init();
                        if (!this.hasStarted()) {
                            this._onStartFns.forEach(function(fn) {
                                return fn();
                            });
                            this._onStartFns = [];
                            this._started = true;
                        }
                        this._player.play();
                    };
                    WebAnimationsPlayer.prototype.pause = function() {
                        this.init();
                        this._player.pause();
                    };
                    WebAnimationsPlayer.prototype.finish = function() {
                        this.init();
                        this._onFinish();
                        this._player.finish();
                    };
                    WebAnimationsPlayer.prototype.reset = function() {
                        this._resetDomPlayerState();
                        this._destroyed = false;
                        this._finished = false;
                        this._started = false;
                    };
                    WebAnimationsPlayer.prototype._resetDomPlayerState = function() {
                        if (this._player) {
                            this._player.cancel();
                        }
                    };
                    WebAnimationsPlayer.prototype.restart = function() {
                        this.reset();
                        this.play();
                    };
                    WebAnimationsPlayer.prototype.hasStarted = function() {
                        return this._started;
                    };
                    WebAnimationsPlayer.prototype.destroy = function() {
                        if (!this._destroyed) {
                            this._resetDomPlayerState();
                            this._onFinish();
                            this._destroyed = true;
                        }
                    };
                    Object.defineProperty(WebAnimationsPlayer.prototype, "totalTime", {
                        get: function() {
                            return this._duration;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    WebAnimationsPlayer.prototype.setPosition = function(p) {
                        this._player.currentTime = p * this.totalTime;
                    };
                    WebAnimationsPlayer.prototype.getPosition = function() {
                        return this._player.currentTime / this.totalTime;
                    };
                    WebAnimationsPlayer.prototype._captureStyles = function() {
                        var _this = this;
                        var styles = {};
                        if (this.hasStarted()) {
                            Object.keys(this._finalKeyframe).forEach(function(prop) {
                                if (prop != "offset") {
                                    styles[prop] = _this._finished ? _this._finalKeyframe[prop] : _computeStyle(_this.element, prop);
                                }
                            });
                        }
                        return styles;
                    };
                    return WebAnimationsPlayer;
                }();
                function _computeStyle(element, prop) {
                    return getDOM().getComputedStyle(element)[prop];
                }
                function _copyKeyframeStyles(styles) {
                    var newStyles = {};
                    Object.keys(styles).forEach(function(prop) {
                        if (prop != "offset") {
                            newStyles[prop] = styles[prop];
                        }
                    });
                    return newStyles;
                }
                var WebAnimationsDriver = function() {
                    function WebAnimationsDriver() {}
                    WebAnimationsDriver.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
                        if (previousPlayers === void 0) {
                            previousPlayers = [];
                        }
                        var formattedSteps = [];
                        var startingStyleLookup = {};
                        if (isPresent(startingStyles)) {
                            startingStyleLookup = _populateStyles(startingStyles, {});
                        }
                        keyframes.forEach(function(keyframe) {
                            var data = _populateStyles(keyframe.styles, startingStyleLookup);
                            data["offset"] = Math.max(0, Math.min(1, keyframe.offset));
                            formattedSteps.push(data);
                        });
                        if (formattedSteps.length == 0) {
                            formattedSteps = [ startingStyleLookup, startingStyleLookup ];
                        } else if (formattedSteps.length == 1) {
                            var start = startingStyleLookup;
                            var end = formattedSteps[0];
                            end["offset"] = null;
                            formattedSteps = [ start, end ];
                        }
                        var playerOptions = {
                            duration: duration,
                            delay: delay,
                            fill: "both"
                        };
                        if (easing) {
                            playerOptions["easing"] = easing;
                        }
                        previousPlayers = previousPlayers.filter(filterWebAnimationPlayerFn);
                        return new WebAnimationsPlayer(element, formattedSteps, playerOptions, previousPlayers);
                    };
                    return WebAnimationsDriver;
                }();
                function _populateStyles(styles, defaultStyles) {
                    var data = {};
                    styles.styles.forEach(function(entry) {
                        Object.keys(entry).forEach(function(prop) {
                            data[prop] = entry[prop];
                        });
                    });
                    Object.keys(defaultStyles).forEach(function(prop) {
                        if (!isPresent(data[prop])) {
                            data[prop] = defaultStyles[prop];
                        }
                    });
                    return data;
                }
                function filterWebAnimationPlayerFn(player) {
                    return player instanceof WebAnimationsPlayer;
                }
                var __extends$1 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var GenericBrowserDomAdapter = function(_super) {
                    __extends$1(GenericBrowserDomAdapter, _super);
                    function GenericBrowserDomAdapter() {
                        var _this = this;
                        _super.call(this);
                        this._animationPrefix = null;
                        this._transitionEnd = null;
                        try {
                            var element_1 = this.createElement("div", this.defaultDoc());
                            if (isPresent(this.getStyle(element_1, "animationName"))) {
                                this._animationPrefix = "";
                            } else {
                                var domPrefixes = [ "Webkit", "Moz", "O", "ms" ];
                                for (var i = 0; i < domPrefixes.length; i++) {
                                    if (isPresent(this.getStyle(element_1, domPrefixes[i] + "AnimationName"))) {
                                        this._animationPrefix = "-" + domPrefixes[i].toLowerCase() + "-";
                                        break;
                                    }
                                }
                            }
                            var transEndEventNames_1 = {
                                WebkitTransition: "webkitTransitionEnd",
                                MozTransition: "transitionend",
                                OTransition: "oTransitionEnd otransitionend",
                                transition: "transitionend"
                            };
                            Object.keys(transEndEventNames_1).forEach(function(key) {
                                if (isPresent(_this.getStyle(element_1, key))) {
                                    _this._transitionEnd = transEndEventNames_1[key];
                                }
                            });
                        } catch (e) {
                            this._animationPrefix = null;
                            this._transitionEnd = null;
                        }
                    }
                    GenericBrowserDomAdapter.prototype.getDistributedNodes = function(el) {
                        return el.getDistributedNodes();
                    };
                    GenericBrowserDomAdapter.prototype.resolveAndSetHref = function(el, baseUrl, href) {
                        el.href = href == null ? baseUrl : baseUrl + "/../" + href;
                    };
                    GenericBrowserDomAdapter.prototype.supportsDOMEvents = function() {
                        return true;
                    };
                    GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function() {
                        return typeof this.defaultDoc().body.createShadowRoot === "function";
                    };
                    GenericBrowserDomAdapter.prototype.getAnimationPrefix = function() {
                        return this._animationPrefix ? this._animationPrefix : "";
                    };
                    GenericBrowserDomAdapter.prototype.getTransitionEnd = function() {
                        return this._transitionEnd ? this._transitionEnd : "";
                    };
                    GenericBrowserDomAdapter.prototype.supportsAnimation = function() {
                        return isPresent(this._animationPrefix) && isPresent(this._transitionEnd);
                    };
                    return GenericBrowserDomAdapter;
                }(DomAdapter);
                var __extends = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var _attrToPropMap = {
                    class: "className",
                    innerHtml: "innerHTML",
                    readonly: "readOnly",
                    tabindex: "tabIndex"
                };
                var DOM_KEY_LOCATION_NUMPAD = 3;
                var _keyMap = {
                    "\b": "Backspace",
                    "\t": "Tab",
                    "": "Delete",
                    "": "Escape",
                    Del: "Delete",
                    Esc: "Escape",
                    Left: "ArrowLeft",
                    Right: "ArrowRight",
                    Up: "ArrowUp",
                    Down: "ArrowDown",
                    Menu: "ContextMenu",
                    Scroll: "ScrollLock",
                    Win: "OS"
                };
                var _chromeNumKeyPadMap = {
                    A: "1",
                    B: "2",
                    C: "3",
                    D: "4",
                    E: "5",
                    F: "6",
                    G: "7",
                    H: "8",
                    I: "9",
                    J: "*",
                    K: "+",
                    M: "-",
                    N: ".",
                    O: "/",
                    "`": "0",
                    "": "NumLock"
                };
                var BrowserDomAdapter = function(_super) {
                    __extends(BrowserDomAdapter, _super);
                    function BrowserDomAdapter() {
                        _super.apply(this, arguments);
                    }
                    BrowserDomAdapter.prototype.parse = function(templateHtml) {
                        throw new Error("parse not implemented");
                    };
                    BrowserDomAdapter.makeCurrent = function() {
                        setRootDomAdapter(new BrowserDomAdapter());
                    };
                    BrowserDomAdapter.prototype.hasProperty = function(element, name) {
                        return name in element;
                    };
                    BrowserDomAdapter.prototype.setProperty = function(el, name, value) {
                        el[name] = value;
                    };
                    BrowserDomAdapter.prototype.getProperty = function(el, name) {
                        return el[name];
                    };
                    BrowserDomAdapter.prototype.invoke = function(el, methodName, args) {
                        (_a = el)[methodName].apply(_a, args);
                        var _a;
                    };
                    BrowserDomAdapter.prototype.logError = function(error) {
                        if (window.console) {
                            if (console.error) {
                                console.error(error);
                            } else {
                                console.log(error);
                            }
                        }
                    };
                    BrowserDomAdapter.prototype.log = function(error) {
                        if (window.console) {
                            window.console.log && window.console.log(error);
                        }
                    };
                    BrowserDomAdapter.prototype.logGroup = function(error) {
                        if (window.console) {
                            window.console.group && window.console.group(error);
                        }
                    };
                    BrowserDomAdapter.prototype.logGroupEnd = function() {
                        if (window.console) {
                            window.console.groupEnd && window.console.groupEnd();
                        }
                    };
                    Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
                        get: function() {
                            return _attrToPropMap;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BrowserDomAdapter.prototype.query = function(selector) {
                        return document.querySelector(selector);
                    };
                    BrowserDomAdapter.prototype.querySelector = function(el, selector) {
                        return el.querySelector(selector);
                    };
                    BrowserDomAdapter.prototype.querySelectorAll = function(el, selector) {
                        return el.querySelectorAll(selector);
                    };
                    BrowserDomAdapter.prototype.on = function(el, evt, listener) {
                        el.addEventListener(evt, listener, false);
                    };
                    BrowserDomAdapter.prototype.onAndCancel = function(el, evt, listener) {
                        el.addEventListener(evt, listener, false);
                        return function() {
                            el.removeEventListener(evt, listener, false);
                        };
                    };
                    BrowserDomAdapter.prototype.dispatchEvent = function(el, evt) {
                        el.dispatchEvent(evt);
                    };
                    BrowserDomAdapter.prototype.createMouseEvent = function(eventType) {
                        var evt = document.createEvent("MouseEvent");
                        evt.initEvent(eventType, true, true);
                        return evt;
                    };
                    BrowserDomAdapter.prototype.createEvent = function(eventType) {
                        var evt = document.createEvent("Event");
                        evt.initEvent(eventType, true, true);
                        return evt;
                    };
                    BrowserDomAdapter.prototype.preventDefault = function(evt) {
                        evt.preventDefault();
                        evt.returnValue = false;
                    };
                    BrowserDomAdapter.prototype.isPrevented = function(evt) {
                        return evt.defaultPrevented || isPresent(evt.returnValue) && !evt.returnValue;
                    };
                    BrowserDomAdapter.prototype.getInnerHTML = function(el) {
                        return el.innerHTML;
                    };
                    BrowserDomAdapter.prototype.getTemplateContent = function(el) {
                        return "content" in el && el instanceof HTMLTemplateElement ? el.content : null;
                    };
                    BrowserDomAdapter.prototype.getOuterHTML = function(el) {
                        return el.outerHTML;
                    };
                    BrowserDomAdapter.prototype.nodeName = function(node) {
                        return node.nodeName;
                    };
                    BrowserDomAdapter.prototype.nodeValue = function(node) {
                        return node.nodeValue;
                    };
                    BrowserDomAdapter.prototype.type = function(node) {
                        return node.type;
                    };
                    BrowserDomAdapter.prototype.content = function(node) {
                        if (this.hasProperty(node, "content")) {
                            return node.content;
                        } else {
                            return node;
                        }
                    };
                    BrowserDomAdapter.prototype.firstChild = function(el) {
                        return el.firstChild;
                    };
                    BrowserDomAdapter.prototype.nextSibling = function(el) {
                        return el.nextSibling;
                    };
                    BrowserDomAdapter.prototype.parentElement = function(el) {
                        return el.parentNode;
                    };
                    BrowserDomAdapter.prototype.childNodes = function(el) {
                        return el.childNodes;
                    };
                    BrowserDomAdapter.prototype.childNodesAsList = function(el) {
                        var childNodes = el.childNodes;
                        var res = new Array(childNodes.length);
                        for (var i = 0; i < childNodes.length; i++) {
                            res[i] = childNodes[i];
                        }
                        return res;
                    };
                    BrowserDomAdapter.prototype.clearNodes = function(el) {
                        while (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                    };
                    BrowserDomAdapter.prototype.appendChild = function(el, node) {
                        el.appendChild(node);
                    };
                    BrowserDomAdapter.prototype.removeChild = function(el, node) {
                        el.removeChild(node);
                    };
                    BrowserDomAdapter.prototype.replaceChild = function(el, newChild, oldChild) {
                        el.replaceChild(newChild, oldChild);
                    };
                    BrowserDomAdapter.prototype.remove = function(node) {
                        if (node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                        return node;
                    };
                    BrowserDomAdapter.prototype.insertBefore = function(el, node) {
                        el.parentNode.insertBefore(node, el);
                    };
                    BrowserDomAdapter.prototype.insertAllBefore = function(el, nodes) {
                        nodes.forEach(function(n) {
                            return el.parentNode.insertBefore(n, el);
                        });
                    };
                    BrowserDomAdapter.prototype.insertAfter = function(el, node) {
                        el.parentNode.insertBefore(node, el.nextSibling);
                    };
                    BrowserDomAdapter.prototype.setInnerHTML = function(el, value) {
                        el.innerHTML = value;
                    };
                    BrowserDomAdapter.prototype.getText = function(el) {
                        return el.textContent;
                    };
                    BrowserDomAdapter.prototype.setText = function(el, value) {
                        el.textContent = value;
                    };
                    BrowserDomAdapter.prototype.getValue = function(el) {
                        return el.value;
                    };
                    BrowserDomAdapter.prototype.setValue = function(el, value) {
                        el.value = value;
                    };
                    BrowserDomAdapter.prototype.getChecked = function(el) {
                        return el.checked;
                    };
                    BrowserDomAdapter.prototype.setChecked = function(el, value) {
                        el.checked = value;
                    };
                    BrowserDomAdapter.prototype.createComment = function(text) {
                        return document.createComment(text);
                    };
                    BrowserDomAdapter.prototype.createTemplate = function(html) {
                        var t = document.createElement("template");
                        t.innerHTML = html;
                        return t;
                    };
                    BrowserDomAdapter.prototype.createElement = function(tagName, doc) {
                        if (doc === void 0) {
                            doc = document;
                        }
                        return doc.createElement(tagName);
                    };
                    BrowserDomAdapter.prototype.createElementNS = function(ns, tagName, doc) {
                        if (doc === void 0) {
                            doc = document;
                        }
                        return doc.createElementNS(ns, tagName);
                    };
                    BrowserDomAdapter.prototype.createTextNode = function(text, doc) {
                        if (doc === void 0) {
                            doc = document;
                        }
                        return doc.createTextNode(text);
                    };
                    BrowserDomAdapter.prototype.createScriptTag = function(attrName, attrValue, doc) {
                        if (doc === void 0) {
                            doc = document;
                        }
                        var el = doc.createElement("SCRIPT");
                        el.setAttribute(attrName, attrValue);
                        return el;
                    };
                    BrowserDomAdapter.prototype.createStyleElement = function(css, doc) {
                        if (doc === void 0) {
                            doc = document;
                        }
                        var style = doc.createElement("style");
                        this.appendChild(style, this.createTextNode(css));
                        return style;
                    };
                    BrowserDomAdapter.prototype.createShadowRoot = function(el) {
                        return el.createShadowRoot();
                    };
                    BrowserDomAdapter.prototype.getShadowRoot = function(el) {
                        return el.shadowRoot;
                    };
                    BrowserDomAdapter.prototype.getHost = function(el) {
                        return el.host;
                    };
                    BrowserDomAdapter.prototype.clone = function(node) {
                        return node.cloneNode(true);
                    };
                    BrowserDomAdapter.prototype.getElementsByClassName = function(element, name) {
                        return element.getElementsByClassName(name);
                    };
                    BrowserDomAdapter.prototype.getElementsByTagName = function(element, name) {
                        return element.getElementsByTagName(name);
                    };
                    BrowserDomAdapter.prototype.classList = function(element) {
                        return Array.prototype.slice.call(element.classList, 0);
                    };
                    BrowserDomAdapter.prototype.addClass = function(element, className) {
                        element.classList.add(className);
                    };
                    BrowserDomAdapter.prototype.removeClass = function(element, className) {
                        element.classList.remove(className);
                    };
                    BrowserDomAdapter.prototype.hasClass = function(element, className) {
                        return element.classList.contains(className);
                    };
                    BrowserDomAdapter.prototype.setStyle = function(element, styleName, styleValue) {
                        element.style[styleName] = styleValue;
                    };
                    BrowserDomAdapter.prototype.removeStyle = function(element, stylename) {
                        element.style[stylename] = "";
                    };
                    BrowserDomAdapter.prototype.getStyle = function(element, stylename) {
                        return element.style[stylename];
                    };
                    BrowserDomAdapter.prototype.hasStyle = function(element, styleName, styleValue) {
                        if (styleValue === void 0) {
                            styleValue = null;
                        }
                        var value = this.getStyle(element, styleName) || "";
                        return styleValue ? value == styleValue : value.length > 0;
                    };
                    BrowserDomAdapter.prototype.tagName = function(element) {
                        return element.tagName;
                    };
                    BrowserDomAdapter.prototype.attributeMap = function(element) {
                        var res = new Map();
                        var elAttrs = element.attributes;
                        for (var i = 0; i < elAttrs.length; i++) {
                            var attrib = elAttrs[i];
                            res.set(attrib.name, attrib.value);
                        }
                        return res;
                    };
                    BrowserDomAdapter.prototype.hasAttribute = function(element, attribute) {
                        return element.hasAttribute(attribute);
                    };
                    BrowserDomAdapter.prototype.hasAttributeNS = function(element, ns, attribute) {
                        return element.hasAttributeNS(ns, attribute);
                    };
                    BrowserDomAdapter.prototype.getAttribute = function(element, attribute) {
                        return element.getAttribute(attribute);
                    };
                    BrowserDomAdapter.prototype.getAttributeNS = function(element, ns, name) {
                        return element.getAttributeNS(ns, name);
                    };
                    BrowserDomAdapter.prototype.setAttribute = function(element, name, value) {
                        element.setAttribute(name, value);
                    };
                    BrowserDomAdapter.prototype.setAttributeNS = function(element, ns, name, value) {
                        element.setAttributeNS(ns, name, value);
                    };
                    BrowserDomAdapter.prototype.removeAttribute = function(element, attribute) {
                        element.removeAttribute(attribute);
                    };
                    BrowserDomAdapter.prototype.removeAttributeNS = function(element, ns, name) {
                        element.removeAttributeNS(ns, name);
                    };
                    BrowserDomAdapter.prototype.templateAwareRoot = function(el) {
                        return this.isTemplateElement(el) ? this.content(el) : el;
                    };
                    BrowserDomAdapter.prototype.createHtmlDocument = function() {
                        return document.implementation.createHTMLDocument("fakeTitle");
                    };
                    BrowserDomAdapter.prototype.defaultDoc = function() {
                        return document;
                    };
                    BrowserDomAdapter.prototype.getBoundingClientRect = function(el) {
                        try {
                            return el.getBoundingClientRect();
                        } catch (e) {
                            return {
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: 0,
                                height: 0
                            };
                        }
                    };
                    BrowserDomAdapter.prototype.getTitle = function() {
                        return document.title;
                    };
                    BrowserDomAdapter.prototype.setTitle = function(newTitle) {
                        document.title = newTitle || "";
                    };
                    BrowserDomAdapter.prototype.elementMatches = function(n, selector) {
                        if (n instanceof HTMLElement) {
                            return n.matches && n.matches(selector) || n.msMatchesSelector && n.msMatchesSelector(selector) || n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
                        }
                        return false;
                    };
                    BrowserDomAdapter.prototype.isTemplateElement = function(el) {
                        return el instanceof HTMLElement && el.nodeName == "TEMPLATE";
                    };
                    BrowserDomAdapter.prototype.isTextNode = function(node) {
                        return node.nodeType === Node.TEXT_NODE;
                    };
                    BrowserDomAdapter.prototype.isCommentNode = function(node) {
                        return node.nodeType === Node.COMMENT_NODE;
                    };
                    BrowserDomAdapter.prototype.isElementNode = function(node) {
                        return node.nodeType === Node.ELEMENT_NODE;
                    };
                    BrowserDomAdapter.prototype.hasShadowRoot = function(node) {
                        return isPresent(node.shadowRoot) && node instanceof HTMLElement;
                    };
                    BrowserDomAdapter.prototype.isShadowRoot = function(node) {
                        return node instanceof DocumentFragment;
                    };
                    BrowserDomAdapter.prototype.importIntoDoc = function(node) {
                        return document.importNode(this.templateAwareRoot(node), true);
                    };
                    BrowserDomAdapter.prototype.adoptNode = function(node) {
                        return document.adoptNode(node);
                    };
                    BrowserDomAdapter.prototype.getHref = function(el) {
                        return el.href;
                    };
                    BrowserDomAdapter.prototype.getEventKey = function(event) {
                        var key = event.key;
                        if (isBlank(key)) {
                            key = event.keyIdentifier;
                            if (isBlank(key)) {
                                return "Unidentified";
                            }
                            if (key.startsWith("U+")) {
                                key = String.fromCharCode(parseInt(key.substring(2), 16));
                                if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                                    key = _chromeNumKeyPadMap[key];
                                }
                            }
                        }
                        return _keyMap[key] || key;
                    };
                    BrowserDomAdapter.prototype.getGlobalEventTarget = function(target) {
                        if (target === "window") {
                            return window;
                        }
                        if (target === "document") {
                            return document;
                        }
                        if (target === "body") {
                            return document.body;
                        }
                    };
                    BrowserDomAdapter.prototype.getHistory = function() {
                        return window.history;
                    };
                    BrowserDomAdapter.prototype.getLocation = function() {
                        return window.location;
                    };
                    BrowserDomAdapter.prototype.getBaseHref = function() {
                        var href = getBaseElementHref();
                        return isBlank(href) ? null : relativePath(href);
                    };
                    BrowserDomAdapter.prototype.resetBaseElement = function() {
                        baseElement = null;
                    };
                    BrowserDomAdapter.prototype.getUserAgent = function() {
                        return window.navigator.userAgent;
                    };
                    BrowserDomAdapter.prototype.setData = function(element, name, value) {
                        this.setAttribute(element, "data-" + name, value);
                    };
                    BrowserDomAdapter.prototype.getData = function(element, name) {
                        return this.getAttribute(element, "data-" + name);
                    };
                    BrowserDomAdapter.prototype.getComputedStyle = function(element) {
                        return getComputedStyle(element);
                    };
                    BrowserDomAdapter.prototype.setGlobalVar = function(path, value) {
                        setValueOnPath(global$1, path, value);
                    };
                    BrowserDomAdapter.prototype.supportsWebAnimation = function() {
                        return typeof Element.prototype["animate"] === "function";
                    };
                    BrowserDomAdapter.prototype.performanceNow = function() {
                        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
                    };
                    BrowserDomAdapter.prototype.supportsCookies = function() {
                        return true;
                    };
                    BrowserDomAdapter.prototype.getCookie = function(name) {
                        return parseCookieValue(document.cookie, name);
                    };
                    BrowserDomAdapter.prototype.setCookie = function(name, value) {
                        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                    };
                    return BrowserDomAdapter;
                }(GenericBrowserDomAdapter);
                var baseElement = null;
                function getBaseElementHref() {
                    if (!baseElement) {
                        baseElement = document.querySelector("base");
                        if (!baseElement) {
                            return null;
                        }
                    }
                    return baseElement.getAttribute("href");
                }
                var urlParsingNode;
                function relativePath(url) {
                    if (!urlParsingNode) {
                        urlParsingNode = document.createElement("a");
                    }
                    urlParsingNode.setAttribute("href", url);
                    return urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname;
                }
                function parseCookieValue(cookieStr, name) {
                    name = encodeURIComponent(name);
                    for (var _i = 0, _a = cookieStr.split(";"); _i < _a.length; _i++) {
                        var cookie = _a[_i];
                        var eqIndex = cookie.indexOf("=");
                        var _b = eqIndex == -1 ? [ cookie, "" ] : [ cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1) ], cookieName = _b[0], cookieValue = _b[1];
                        if (cookieName.trim() === name) {
                            return decodeURIComponent(cookieValue);
                        }
                    }
                    return null;
                }
                function supportsState() {
                    return !!window.history.pushState;
                }
                var __extends$2 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var BrowserPlatformLocation = function(_super) {
                    __extends$2(BrowserPlatformLocation, _super);
                    function BrowserPlatformLocation() {
                        _super.call(this);
                        this._init();
                    }
                    BrowserPlatformLocation.prototype._init = function() {
                        this._location = getDOM().getLocation();
                        this._history = getDOM().getHistory();
                    };
                    Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
                        get: function() {
                            return this._location;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function() {
                        return getDOM().getBaseHref();
                    };
                    BrowserPlatformLocation.prototype.onPopState = function(fn) {
                        getDOM().getGlobalEventTarget("window").addEventListener("popstate", fn, false);
                    };
                    BrowserPlatformLocation.prototype.onHashChange = function(fn) {
                        getDOM().getGlobalEventTarget("window").addEventListener("hashchange", fn, false);
                    };
                    Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
                        get: function() {
                            return this._location.pathname;
                        },
                        set: function(newPath) {
                            this._location.pathname = newPath;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
                        get: function() {
                            return this._location.search;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
                        get: function() {
                            return this._location.hash;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BrowserPlatformLocation.prototype.pushState = function(state, title, url) {
                        if (supportsState()) {
                            this._history.pushState(state, title, url);
                        } else {
                            this._location.hash = url;
                        }
                    };
                    BrowserPlatformLocation.prototype.replaceState = function(state, title, url) {
                        if (supportsState()) {
                            this._history.replaceState(state, title, url);
                        } else {
                            this._location.hash = url;
                        }
                    };
                    BrowserPlatformLocation.prototype.forward = function() {
                        this._history.forward();
                    };
                    BrowserPlatformLocation.prototype.back = function() {
                        this._history.back();
                    };
                    BrowserPlatformLocation.decorators = [ {
                        type: core.Injectable
                    } ];
                    BrowserPlatformLocation.ctorParameters = function() {
                        return [];
                    };
                    return BrowserPlatformLocation;
                }(_angular_common.PlatformLocation);
                var BrowserGetTestability = function() {
                    function BrowserGetTestability() {}
                    BrowserGetTestability.init = function() {
                        core.setTestabilityGetter(new BrowserGetTestability());
                    };
                    BrowserGetTestability.prototype.addToWindow = function(registry) {
                        global$1.getAngularTestability = function(elem, findInAncestors) {
                            if (findInAncestors === void 0) {
                                findInAncestors = true;
                            }
                            var testability = registry.findTestabilityInTree(elem, findInAncestors);
                            if (testability == null) {
                                throw new Error("Could not find testability for element.");
                            }
                            return testability;
                        };
                        global$1.getAllAngularTestabilities = function() {
                            return registry.getAllTestabilities();
                        };
                        global$1.getAllAngularRootElements = function() {
                            return registry.getAllRootElements();
                        };
                        var whenAllStable = function(callback) {
                            var testabilities = global$1.getAllAngularTestabilities();
                            var count = testabilities.length;
                            var didWork = false;
                            var decrement = function(didWork_) {
                                didWork = didWork || didWork_;
                                count--;
                                if (count == 0) {
                                    callback(didWork);
                                }
                            };
                            testabilities.forEach(function(testability) {
                                testability.whenStable(decrement);
                            });
                        };
                        if (!global$1["frameworkStabilizers"]) {
                            global$1["frameworkStabilizers"] = [];
                        }
                        global$1["frameworkStabilizers"].push(whenAllStable);
                    };
                    BrowserGetTestability.prototype.findTestabilityInTree = function(registry, elem, findInAncestors) {
                        if (elem == null) {
                            return null;
                        }
                        var t = registry.getTestability(elem);
                        if (isPresent(t)) {
                            return t;
                        } else if (!findInAncestors) {
                            return null;
                        }
                        if (getDOM().isShadowRoot(elem)) {
                            return this.findTestabilityInTree(registry, getDOM().getHost(elem), true);
                        }
                        return this.findTestabilityInTree(registry, getDOM().parentElement(elem), true);
                    };
                    return BrowserGetTestability;
                }();
                var Title = function() {
                    function Title() {}
                    Title.prototype.getTitle = function() {
                        return getDOM().getTitle();
                    };
                    Title.prototype.setTitle = function(newTitle) {
                        getDOM().setTitle(newTitle);
                    };
                    return Title;
                }();
                var StringMapWrapper = function() {
                    function StringMapWrapper() {}
                    StringMapWrapper.merge = function(m1, m2) {
                        var m = {};
                        for (var _i = 0, _a = Object.keys(m1); _i < _a.length; _i++) {
                            var k = _a[_i];
                            m[k] = m1[k];
                        }
                        for (var _b = 0, _c = Object.keys(m2); _b < _c.length; _b++) {
                            var k = _c[_b];
                            m[k] = m2[k];
                        }
                        return m;
                    };
                    StringMapWrapper.equals = function(m1, m2) {
                        var k1 = Object.keys(m1);
                        var k2 = Object.keys(m2);
                        if (k1.length != k2.length) {
                            return false;
                        }
                        for (var i = 0; i < k1.length; i++) {
                            var key = k1[i];
                            if (m1[key] !== m2[key]) {
                                return false;
                            }
                        }
                        return true;
                    };
                    return StringMapWrapper;
                }();
                var DOCUMENT = new core.OpaqueToken("DocumentToken");
                var EVENT_MANAGER_PLUGINS = new core.OpaqueToken("EventManagerPlugins");
                var EventManager = function() {
                    function EventManager(plugins, _zone) {
                        var _this = this;
                        this._zone = _zone;
                        this._eventNameToPlugin = new Map();
                        plugins.forEach(function(p) {
                            return p.manager = _this;
                        });
                        this._plugins = plugins.slice().reverse();
                    }
                    EventManager.prototype.addEventListener = function(element, eventName, handler) {
                        var plugin = this._findPluginFor(eventName);
                        return plugin.addEventListener(element, eventName, handler);
                    };
                    EventManager.prototype.addGlobalEventListener = function(target, eventName, handler) {
                        var plugin = this._findPluginFor(eventName);
                        return plugin.addGlobalEventListener(target, eventName, handler);
                    };
                    EventManager.prototype.getZone = function() {
                        return this._zone;
                    };
                    EventManager.prototype._findPluginFor = function(eventName) {
                        var plugin = this._eventNameToPlugin.get(eventName);
                        if (plugin) {
                            return plugin;
                        }
                        var plugins = this._plugins;
                        for (var i = 0; i < plugins.length; i++) {
                            var plugin_1 = plugins[i];
                            if (plugin_1.supports(eventName)) {
                                this._eventNameToPlugin.set(eventName, plugin_1);
                                return plugin_1;
                            }
                        }
                        throw new Error("No event manager plugin found for event " + eventName);
                    };
                    EventManager.decorators = [ {
                        type: core.Injectable
                    } ];
                    EventManager.ctorParameters = function() {
                        return [ {
                            type: Array,
                            decorators: [ {
                                type: core.Inject,
                                args: [ EVENT_MANAGER_PLUGINS ]
                            } ]
                        }, {
                            type: core.NgZone
                        } ];
                    };
                    return EventManager;
                }();
                var EventManagerPlugin = function() {
                    function EventManagerPlugin() {}
                    EventManagerPlugin.prototype.supports = function(eventName) {};
                    EventManagerPlugin.prototype.addEventListener = function(element, eventName, handler) {};
                    EventManagerPlugin.prototype.addGlobalEventListener = function(element, eventName, handler) {
                        var target = getDOM().getGlobalEventTarget(element);
                        if (!target) {
                            throw new Error("Unsupported event target " + target + " for event " + eventName);
                        }
                        return this.addEventListener(target, eventName, handler);
                    };
                    return EventManagerPlugin;
                }();
                var __extends$4 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var SharedStylesHost = function() {
                    function SharedStylesHost() {
                        this._stylesSet = new Set();
                    }
                    SharedStylesHost.prototype.addStyles = function(styles) {
                        var _this = this;
                        var additions = new Set();
                        styles.forEach(function(style) {
                            if (!_this._stylesSet.has(style)) {
                                _this._stylesSet.add(style);
                                additions.add(style);
                            }
                        });
                        this.onStylesAdded(additions);
                    };
                    SharedStylesHost.prototype.onStylesAdded = function(additions) {};
                    SharedStylesHost.prototype.getAllStyles = function() {
                        return Array.from(this._stylesSet);
                    };
                    SharedStylesHost.decorators = [ {
                        type: core.Injectable
                    } ];
                    SharedStylesHost.ctorParameters = function() {
                        return [];
                    };
                    return SharedStylesHost;
                }();
                var DomSharedStylesHost = function(_super) {
                    __extends$4(DomSharedStylesHost, _super);
                    function DomSharedStylesHost(_doc) {
                        _super.call(this);
                        this._doc = _doc;
                        this._hostNodes = new Set();
                        this._styleNodes = new Set();
                        this._hostNodes.add(_doc.head);
                    }
                    DomSharedStylesHost.prototype._addStylesToHost = function(styles, host) {
                        var _this = this;
                        styles.forEach(function(style) {
                            var styleEl = _this._doc.createElement("style");
                            styleEl.textContent = style;
                            _this._styleNodes.add(host.appendChild(styleEl));
                        });
                    };
                    DomSharedStylesHost.prototype.addHost = function(hostNode) {
                        this._addStylesToHost(this._stylesSet, hostNode);
                        this._hostNodes.add(hostNode);
                    };
                    DomSharedStylesHost.prototype.removeHost = function(hostNode) {
                        this._hostNodes.delete(hostNode);
                    };
                    DomSharedStylesHost.prototype.onStylesAdded = function(additions) {
                        var _this = this;
                        this._hostNodes.forEach(function(hostNode) {
                            return _this._addStylesToHost(additions, hostNode);
                        });
                    };
                    DomSharedStylesHost.prototype.ngOnDestroy = function() {
                        this._styleNodes.forEach(function(styleNode) {
                            return getDOM().remove(styleNode);
                        });
                    };
                    DomSharedStylesHost.decorators = [ {
                        type: core.Injectable
                    } ];
                    DomSharedStylesHost.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: core.Inject,
                                args: [ DOCUMENT ]
                            } ]
                        } ];
                    };
                    return DomSharedStylesHost;
                }(SharedStylesHost);
                var __extends$3 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var NAMESPACE_URIS = {
                    xlink: "http://www.w3.org/1999/xlink",
                    svg: "http://www.w3.org/2000/svg",
                    xhtml: "http://www.w3.org/1999/xhtml"
                };
                var TEMPLATE_COMMENT_TEXT = "template bindings={}";
                var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/;
                var DomRootRenderer = function() {
                    function DomRootRenderer(document, eventManager, sharedStylesHost, animationDriver, appId) {
                        this.document = document;
                        this.eventManager = eventManager;
                        this.sharedStylesHost = sharedStylesHost;
                        this.animationDriver = animationDriver;
                        this.appId = appId;
                        this.registeredComponents = new Map();
                    }
                    DomRootRenderer.prototype.renderComponent = function(componentProto) {
                        var renderer = this.registeredComponents.get(componentProto.id);
                        if (!renderer) {
                            renderer = new DomRenderer(this, componentProto, this.animationDriver, this.appId + "-" + componentProto.id);
                            this.registeredComponents.set(componentProto.id, renderer);
                        }
                        return renderer;
                    };
                    return DomRootRenderer;
                }();
                var DomRootRenderer_ = function(_super) {
                    __extends$3(DomRootRenderer_, _super);
                    function DomRootRenderer_(_document, _eventManager, sharedStylesHost, animationDriver, appId) {
                        _super.call(this, _document, _eventManager, sharedStylesHost, animationDriver, appId);
                    }
                    DomRootRenderer_.decorators = [ {
                        type: core.Injectable
                    } ];
                    DomRootRenderer_.ctorParameters = function() {
                        return [ {
                            type: undefined,
                            decorators: [ {
                                type: core.Inject,
                                args: [ DOCUMENT ]
                            } ]
                        }, {
                            type: EventManager
                        }, {
                            type: DomSharedStylesHost
                        }, {
                            type: AnimationDriver
                        }, {
                            type: undefined,
                            decorators: [ {
                                type: core.Inject,
                                args: [ core.APP_ID ]
                            } ]
                        } ];
                    };
                    return DomRootRenderer_;
                }(DomRootRenderer);
                var DIRECT_DOM_RENDERER = {
                    remove: function(node) {
                        if (node.parentNode) {
                            node.parentNode.removeChild(node);
                        }
                    },
                    appendChild: function(node, parent) {
                        parent.appendChild(node);
                    },
                    insertBefore: function(node, refNode) {
                        refNode.parentNode.insertBefore(node, refNode);
                    },
                    nextSibling: function(node) {
                        return node.nextSibling;
                    },
                    parentElement: function(node) {
                        return node.parentNode;
                    }
                };
                var DomRenderer = function() {
                    function DomRenderer(_rootRenderer, componentProto, _animationDriver, styleShimId) {
                        this._rootRenderer = _rootRenderer;
                        this.componentProto = componentProto;
                        this._animationDriver = _animationDriver;
                        this.directRenderer = DIRECT_DOM_RENDERER;
                        this._styles = flattenStyles(styleShimId, componentProto.styles, []);
                        if (componentProto.encapsulation !== core.ViewEncapsulation.Native) {
                            this._rootRenderer.sharedStylesHost.addStyles(this._styles);
                        }
                        if (this.componentProto.encapsulation === core.ViewEncapsulation.Emulated) {
                            this._contentAttr = shimContentAttribute(styleShimId);
                            this._hostAttr = shimHostAttribute(styleShimId);
                        } else {
                            this._contentAttr = null;
                            this._hostAttr = null;
                        }
                    }
                    DomRenderer.prototype.selectRootElement = function(selectorOrNode, debugInfo) {
                        var el;
                        if (typeof selectorOrNode === "string") {
                            el = this._rootRenderer.document.querySelector(selectorOrNode);
                            if (!el) {
                                throw new Error('The selector "' + selectorOrNode + '" did not match any elements');
                            }
                        } else {
                            el = selectorOrNode;
                        }
                        while (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                        return el;
                    };
                    DomRenderer.prototype.createElement = function(parent, name, debugInfo) {
                        var el;
                        if (isNamespaced(name)) {
                            var nsAndName = splitNamespace(name);
                            el = document.createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]);
                        } else {
                            el = document.createElement(name);
                        }
                        if (this._contentAttr) {
                            el.setAttribute(this._contentAttr, "");
                        }
                        if (parent) {
                            parent.appendChild(el);
                        }
                        return el;
                    };
                    DomRenderer.prototype.createViewRoot = function(hostElement) {
                        var nodesParent;
                        if (this.componentProto.encapsulation === core.ViewEncapsulation.Native) {
                            nodesParent = hostElement.createShadowRoot();
                            for (var i = 0; i < this._styles.length; i++) {
                                var styleEl = document.createElement("style");
                                styleEl.textContent = this._styles[i];
                                nodesParent.appendChild(styleEl);
                            }
                        } else {
                            if (this._hostAttr) {
                                hostElement.setAttribute(this._hostAttr, "");
                            }
                            nodesParent = hostElement;
                        }
                        return nodesParent;
                    };
                    DomRenderer.prototype.createTemplateAnchor = function(parentElement, debugInfo) {
                        var comment = document.createComment(TEMPLATE_COMMENT_TEXT);
                        if (parentElement) {
                            parentElement.appendChild(comment);
                        }
                        return comment;
                    };
                    DomRenderer.prototype.createText = function(parentElement, value, debugInfo) {
                        var node = document.createTextNode(value);
                        if (parentElement) {
                            parentElement.appendChild(node);
                        }
                        return node;
                    };
                    DomRenderer.prototype.projectNodes = function(parentElement, nodes) {
                        if (!parentElement) return;
                        appendNodes(parentElement, nodes);
                    };
                    DomRenderer.prototype.attachViewAfter = function(node, viewRootNodes) {
                        moveNodesAfterSibling(node, viewRootNodes);
                    };
                    DomRenderer.prototype.detachView = function(viewRootNodes) {
                        for (var i = 0; i < viewRootNodes.length; i++) {
                            var node = viewRootNodes[i];
                            if (node.parentNode) {
                                node.parentNode.removeChild(node);
                            }
                        }
                    };
                    DomRenderer.prototype.destroyView = function(hostElement, viewAllNodes) {
                        if (this.componentProto.encapsulation === core.ViewEncapsulation.Native && hostElement) {
                            this._rootRenderer.sharedStylesHost.removeHost(hostElement.shadowRoot);
                        }
                    };
                    DomRenderer.prototype.listen = function(renderElement, name, callback) {
                        return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
                    };
                    DomRenderer.prototype.listenGlobal = function(target, name, callback) {
                        return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
                    };
                    DomRenderer.prototype.setElementProperty = function(renderElement, propertyName, propertyValue) {
                        renderElement[propertyName] = propertyValue;
                    };
                    DomRenderer.prototype.setElementAttribute = function(renderElement, attributeName, attributeValue) {
                        var attrNs;
                        var attrNameWithoutNs = attributeName;
                        if (isNamespaced(attributeName)) {
                            var nsAndName = splitNamespace(attributeName);
                            attrNameWithoutNs = nsAndName[1];
                            attributeName = nsAndName[0] + ":" + nsAndName[1];
                            attrNs = NAMESPACE_URIS[nsAndName[0]];
                        }
                        if (isPresent(attributeValue)) {
                            if (attrNs) {
                                renderElement.setAttributeNS(attrNs, attributeName, attributeValue);
                            } else {
                                renderElement.setAttribute(attributeName, attributeValue);
                            }
                        } else {
                            if (isPresent(attrNs)) {
                                renderElement.removeAttributeNS(attrNs, attrNameWithoutNs);
                            } else {
                                renderElement.removeAttribute(attributeName);
                            }
                        }
                    };
                    DomRenderer.prototype.setBindingDebugInfo = function(renderElement, propertyName, propertyValue) {
                        if (renderElement.nodeType === Node.COMMENT_NODE) {
                            var existingBindings = renderElement.nodeValue.replace(/\n/g, "").match(TEMPLATE_BINDINGS_EXP);
                            var parsedBindings = JSON.parse(existingBindings[1]);
                            parsedBindings[propertyName] = propertyValue;
                            renderElement.nodeValue = TEMPLATE_COMMENT_TEXT.replace("{}", JSON.stringify(parsedBindings, null, 2));
                        } else {
                            this.setElementAttribute(renderElement, propertyName, propertyValue);
                        }
                    };
                    DomRenderer.prototype.setElementClass = function(renderElement, className, isAdd) {
                        if (isAdd) {
                            renderElement.classList.add(className);
                        } else {
                            renderElement.classList.remove(className);
                        }
                    };
                    DomRenderer.prototype.setElementStyle = function(renderElement, styleName, styleValue) {
                        if (isPresent(styleValue)) {
                            renderElement.style[styleName] = stringify(styleValue);
                        } else {
                            renderElement.style[styleName] = "";
                        }
                    };
                    DomRenderer.prototype.invokeElementMethod = function(renderElement, methodName, args) {
                        renderElement[methodName].apply(renderElement, args);
                    };
                    DomRenderer.prototype.setText = function(renderNode, text) {
                        renderNode.nodeValue = text;
                    };
                    DomRenderer.prototype.animate = function(element, startingStyles, keyframes, duration, delay, easing, previousPlayers) {
                        if (previousPlayers === void 0) {
                            previousPlayers = [];
                        }
                        if (this._rootRenderer.document.body.contains(element)) {
                            return this._animationDriver.animate(element, startingStyles, keyframes, duration, delay, easing, previousPlayers);
                        }
                        return new NoOpAnimationPlayer();
                    };
                    return DomRenderer;
                }();
                function moveNodesAfterSibling(sibling, nodes) {
                    var parent = sibling.parentNode;
                    if (nodes.length > 0 && parent) {
                        var nextSibling = sibling.nextSibling;
                        if (nextSibling) {
                            for (var i = 0; i < nodes.length; i++) {
                                parent.insertBefore(nodes[i], nextSibling);
                            }
                        } else {
                            for (var i = 0; i < nodes.length; i++) {
                                parent.appendChild(nodes[i]);
                            }
                        }
                    }
                }
                function appendNodes(parent, nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        parent.appendChild(nodes[i]);
                    }
                }
                function decoratePreventDefault(eventHandler) {
                    return function(event) {
                        var allowDefaultBehavior = eventHandler(event);
                        if (allowDefaultBehavior === false) {
                            event.preventDefault();
                            event.returnValue = false;
                        }
                    };
                }
                var COMPONENT_REGEX = /%COMP%/g;
                var COMPONENT_VARIABLE = "%COMP%";
                var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
                var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
                function shimContentAttribute(componentShortId) {
                    return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
                }
                function shimHostAttribute(componentShortId) {
                    return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
                }
                function flattenStyles(compId, styles, target) {
                    for (var i = 0; i < styles.length; i++) {
                        var style = styles[i];
                        if (Array.isArray(style)) {
                            flattenStyles(compId, style, target);
                        } else {
                            style = style.replace(COMPONENT_REGEX, compId);
                            target.push(style);
                        }
                    }
                    return target;
                }
                var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
                function isNamespaced(name) {
                    return name[0] === ":";
                }
                function splitNamespace(name) {
                    var match = name.match(NS_PREFIX_RE);
                    return [ match[1], match[2] ];
                }
                var CORE_TOKENS = {
                    ApplicationRef: core.ApplicationRef,
                    NgZone: core.NgZone
                };
                var INSPECT_GLOBAL_NAME = "ng.probe";
                var CORE_TOKENS_GLOBAL_NAME = "ng.coreTokens";
                function inspectNativeElement(element) {
                    return core.getDebugNode(element);
                }
                var NgProbeToken = function() {
                    function NgProbeToken(name, token) {
                        this.name = name;
                        this.token = token;
                    }
                    return NgProbeToken;
                }();
                function _createConditionalRootRenderer(rootRenderer, extraTokens, coreTokens) {
                    return core.isDevMode() ? _createRootRenderer(rootRenderer, (extraTokens || []).concat(coreTokens || [])) : rootRenderer;
                }
                function _createRootRenderer(rootRenderer, extraTokens) {
                    getDOM().setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
                    getDOM().setGlobalVar(CORE_TOKENS_GLOBAL_NAME, StringMapWrapper.merge(CORE_TOKENS, _ngProbeTokensToMap(extraTokens || [])));
                    return new DebugDomRootRenderer(rootRenderer);
                }
                function _ngProbeTokensToMap(tokens) {
                    return tokens.reduce(function(prev, t) {
                        return prev[t.name] = t.token, prev;
                    }, {});
                }
                var ELEMENT_PROBE_PROVIDERS = [ {
                    provide: core.RootRenderer,
                    useFactory: _createConditionalRootRenderer,
                    deps: [ DomRootRenderer, [ NgProbeToken, new core.Optional() ], [ core.NgProbeToken, new core.Optional() ] ]
                } ];
                var __extends$5 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var DomEventsPlugin = function(_super) {
                    __extends$5(DomEventsPlugin, _super);
                    function DomEventsPlugin() {
                        _super.apply(this, arguments);
                    }
                    DomEventsPlugin.prototype.supports = function(eventName) {
                        return true;
                    };
                    DomEventsPlugin.prototype.addEventListener = function(element, eventName, handler) {
                        element.addEventListener(eventName, handler, false);
                        return function() {
                            return element.removeEventListener(eventName, handler, false);
                        };
                    };
                    DomEventsPlugin.decorators = [ {
                        type: core.Injectable
                    } ];
                    DomEventsPlugin.ctorParameters = function() {
                        return [];
                    };
                    return DomEventsPlugin;
                }(EventManagerPlugin);
                var __extends$6 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var EVENT_NAMES = {
                    pan: true,
                    panstart: true,
                    panmove: true,
                    panend: true,
                    pancancel: true,
                    panleft: true,
                    panright: true,
                    panup: true,
                    pandown: true,
                    pinch: true,
                    pinchstart: true,
                    pinchmove: true,
                    pinchend: true,
                    pinchcancel: true,
                    pinchin: true,
                    pinchout: true,
                    press: true,
                    pressup: true,
                    rotate: true,
                    rotatestart: true,
                    rotatemove: true,
                    rotateend: true,
                    rotatecancel: true,
                    swipe: true,
                    swipeleft: true,
                    swiperight: true,
                    swipeup: true,
                    swipedown: true,
                    tap: true
                };
                var HAMMER_GESTURE_CONFIG = new core.OpaqueToken("HammerGestureConfig");
                var HammerGestureConfig = function() {
                    function HammerGestureConfig() {
                        this.events = [];
                        this.overrides = {};
                    }
                    HammerGestureConfig.prototype.buildHammer = function(element) {
                        var mc = new Hammer(element);
                        mc.get("pinch").set({
                            enable: true
                        });
                        mc.get("rotate").set({
                            enable: true
                        });
                        for (var eventName in this.overrides) {
                            mc.get(eventName).set(this.overrides[eventName]);
                        }
                        return mc;
                    };
                    HammerGestureConfig.decorators = [ {
                        type: core.Injectable
                    } ];
                    HammerGestureConfig.ctorParameters = function() {
                        return [];
                    };
                    return HammerGestureConfig;
                }();
                var HammerGesturesPlugin = function(_super) {
                    __extends$6(HammerGesturesPlugin, _super);
                    function HammerGesturesPlugin(_config) {
                        _super.call(this);
                        this._config = _config;
                    }
                    HammerGesturesPlugin.prototype.supports = function(eventName) {
                        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
                            return false;
                        }
                        if (!window.Hammer) {
                            throw new Error("Hammer.js is not loaded, can not bind " + eventName + " event");
                        }
                        return true;
                    };
                    HammerGesturesPlugin.prototype.addEventListener = function(element, eventName, handler) {
                        var _this = this;
                        var zone = this.manager.getZone();
                        eventName = eventName.toLowerCase();
                        return zone.runOutsideAngular(function() {
                            var mc = _this._config.buildHammer(element);
                            var callback = function(eventObj) {
                                zone.runGuarded(function() {
                                    handler(eventObj);
                                });
                            };
                            mc.on(eventName, callback);
                            return function() {
                                return mc.off(eventName, callback);
                            };
                        });
                    };
                    HammerGesturesPlugin.prototype.isCustomEvent = function(eventName) {
                        return this._config.events.indexOf(eventName) > -1;
                    };
                    HammerGesturesPlugin.decorators = [ {
                        type: core.Injectable
                    } ];
                    HammerGesturesPlugin.ctorParameters = function() {
                        return [ {
                            type: HammerGestureConfig,
                            decorators: [ {
                                type: core.Inject,
                                args: [ HAMMER_GESTURE_CONFIG ]
                            } ]
                        } ];
                    };
                    return HammerGesturesPlugin;
                }(EventManagerPlugin);
                var __extends$7 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var MODIFIER_KEYS = [ "alt", "control", "meta", "shift" ];
                var MODIFIER_KEY_GETTERS = {
                    alt: function(event) {
                        return event.altKey;
                    },
                    control: function(event) {
                        return event.ctrlKey;
                    },
                    meta: function(event) {
                        return event.metaKey;
                    },
                    shift: function(event) {
                        return event.shiftKey;
                    }
                };
                var KeyEventsPlugin = function(_super) {
                    __extends$7(KeyEventsPlugin, _super);
                    function KeyEventsPlugin() {
                        _super.call(this);
                    }
                    KeyEventsPlugin.prototype.supports = function(eventName) {
                        return KeyEventsPlugin.parseEventName(eventName) != null;
                    };
                    KeyEventsPlugin.prototype.addEventListener = function(element, eventName, handler) {
                        var parsedEvent = KeyEventsPlugin.parseEventName(eventName);
                        var outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent["fullKey"], handler, this.manager.getZone());
                        return this.manager.getZone().runOutsideAngular(function() {
                            return getDOM().onAndCancel(element, parsedEvent["domEventName"], outsideHandler);
                        });
                    };
                    KeyEventsPlugin.parseEventName = function(eventName) {
                        var parts = eventName.toLowerCase().split(".");
                        var domEventName = parts.shift();
                        if (parts.length === 0 || !(domEventName === "keydown" || domEventName === "keyup")) {
                            return null;
                        }
                        var key = KeyEventsPlugin._normalizeKey(parts.pop());
                        var fullKey = "";
                        MODIFIER_KEYS.forEach(function(modifierName) {
                            var index = parts.indexOf(modifierName);
                            if (index > -1) {
                                parts.splice(index, 1);
                                fullKey += modifierName + ".";
                            }
                        });
                        fullKey += key;
                        if (parts.length != 0 || key.length === 0) {
                            return null;
                        }
                        var result = {};
                        result["domEventName"] = domEventName;
                        result["fullKey"] = fullKey;
                        return result;
                    };
                    KeyEventsPlugin.getEventFullKey = function(event) {
                        var fullKey = "";
                        var key = getDOM().getEventKey(event);
                        key = key.toLowerCase();
                        if (key === " ") {
                            key = "space";
                        } else if (key === ".") {
                            key = "dot";
                        }
                        MODIFIER_KEYS.forEach(function(modifierName) {
                            if (modifierName != key) {
                                var modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
                                if (modifierGetter(event)) {
                                    fullKey += modifierName + ".";
                                }
                            }
                        });
                        fullKey += key;
                        return fullKey;
                    };
                    KeyEventsPlugin.eventCallback = function(fullKey, handler, zone) {
                        return function(event) {
                            if (KeyEventsPlugin.getEventFullKey(event) === fullKey) {
                                zone.runGuarded(function() {
                                    return handler(event);
                                });
                            }
                        };
                    };
                    KeyEventsPlugin._normalizeKey = function(keyName) {
                        switch (keyName) {
                          case "esc":
                            return "escape";

                          default:
                            return keyName;
                        }
                    };
                    KeyEventsPlugin.decorators = [ {
                        type: core.Injectable
                    } ];
                    KeyEventsPlugin.ctorParameters = function() {
                        return [];
                    };
                    return KeyEventsPlugin;
                }(EventManagerPlugin);
                var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:\/?#]*(?:[\/?#]|$))/gi;
                var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
                function sanitizeUrl(url) {
                    url = String(url);
                    if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url;
                    if (core.isDevMode()) {
                        getDOM().log("WARNING: sanitizing unsafe URL value " + url + " (see http://g.co/ng/security#xss)");
                    }
                    return "unsafe:" + url;
                }
                function sanitizeSrcset(srcset) {
                    srcset = String(srcset);
                    return srcset.split(",").map(function(srcset) {
                        return sanitizeUrl(srcset.trim());
                    }).join(", ");
                }
                var inertElement = null;
                var DOM = null;
                function getInertElement() {
                    if (inertElement) return inertElement;
                    DOM = getDOM();
                    var templateEl = DOM.createElement("template");
                    if ("content" in templateEl) return templateEl;
                    var doc = DOM.createHtmlDocument();
                    inertElement = DOM.querySelector(doc, "body");
                    if (inertElement == null) {
                        var html = DOM.createElement("html", doc);
                        inertElement = DOM.createElement("body", doc);
                        DOM.appendChild(html, inertElement);
                        DOM.appendChild(doc, html);
                    }
                    return inertElement;
                }
                function tagSet(tags) {
                    var res = {};
                    for (var _i = 0, _a = tags.split(","); _i < _a.length; _i++) {
                        var t = _a[_i];
                        res[t] = true;
                    }
                    return res;
                }
                function merge() {
                    var sets = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        sets[_i - 0] = arguments[_i];
                    }
                    var res = {};
                    for (var _a = 0, sets_1 = sets; _a < sets_1.length; _a++) {
                        var s = sets_1[_a];
                        for (var v in s) {
                            if (s.hasOwnProperty(v)) res[v] = true;
                        }
                    }
                    return res;
                }
                var VOID_ELEMENTS = tagSet("area,br,col,hr,img,wbr");
                var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr");
                var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet("rp,rt");
                var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
                var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet("address,article," + "aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," + "h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"));
                var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet("a,abbr,acronym,audio,b," + "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s," + "samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"));
                var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
                var URI_ATTRS = tagSet("background,cite,href,itemtype,longdesc,poster,src,xlink:href");
                var SRCSET_ATTRS = tagSet("srcset");
                var HTML_ATTRS = tagSet("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan," + "compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace," + "ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules," + "scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap," + "valign,value,vspace,width");
                var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
                var SanitizingHtmlSerializer = function() {
                    function SanitizingHtmlSerializer() {
                        this.sanitizedSomething = false;
                        this.buf = [];
                    }
                    SanitizingHtmlSerializer.prototype.sanitizeChildren = function(el) {
                        var current = el.firstChild;
                        while (current) {
                            if (DOM.isElementNode(current)) {
                                this.startElement(current);
                            } else if (DOM.isTextNode(current)) {
                                this.chars(DOM.nodeValue(current));
                            } else {
                                this.sanitizedSomething = true;
                            }
                            if (DOM.firstChild(current)) {
                                current = DOM.firstChild(current);
                                continue;
                            }
                            while (current) {
                                if (DOM.isElementNode(current)) {
                                    this.endElement(current);
                                }
                                if (DOM.nextSibling(current)) {
                                    current = DOM.nextSibling(current);
                                    break;
                                }
                                current = DOM.parentElement(current);
                            }
                        }
                        return this.buf.join("");
                    };
                    SanitizingHtmlSerializer.prototype.startElement = function(element) {
                        var _this = this;
                        var tagName = DOM.nodeName(element).toLowerCase();
                        if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
                            this.sanitizedSomething = true;
                            return;
                        }
                        this.buf.push("<");
                        this.buf.push(tagName);
                        DOM.attributeMap(element).forEach(function(value, attrName) {
                            var lower = attrName.toLowerCase();
                            if (!VALID_ATTRS.hasOwnProperty(lower)) {
                                _this.sanitizedSomething = true;
                                return;
                            }
                            if (URI_ATTRS[lower]) value = sanitizeUrl(value);
                            if (SRCSET_ATTRS[lower]) value = sanitizeSrcset(value);
                            _this.buf.push(" ");
                            _this.buf.push(attrName);
                            _this.buf.push('="');
                            _this.buf.push(encodeEntities(value));
                            _this.buf.push('"');
                        });
                        this.buf.push(">");
                    };
                    SanitizingHtmlSerializer.prototype.endElement = function(current) {
                        var tagName = DOM.nodeName(current).toLowerCase();
                        if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
                            this.buf.push("</");
                            this.buf.push(tagName);
                            this.buf.push(">");
                        }
                    };
                    SanitizingHtmlSerializer.prototype.chars = function(chars) {
                        this.buf.push(encodeEntities(chars));
                    };
                    return SanitizingHtmlSerializer;
                }();
                var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
                function encodeEntities(value) {
                    return value.replace(/&/g, "&amp;").replace(SURROGATE_PAIR_REGEXP, function(match) {
                        var hi = match.charCodeAt(0);
                        var low = match.charCodeAt(1);
                        return "&#" + ((hi - 55296) * 1024 + (low - 56320) + 65536) + ";";
                    }).replace(NON_ALPHANUMERIC_REGEXP, function(match) {
                        return "&#" + match.charCodeAt(0) + ";";
                    }).replace(/</g, "&lt;").replace(/>/g, "&gt;");
                }
                function stripCustomNsAttrs(el) {
                    DOM.attributeMap(el).forEach(function(_, attrName) {
                        if (attrName === "xmlns:ns1" || attrName.indexOf("ns1:") === 0) {
                            DOM.removeAttribute(el, attrName);
                        }
                    });
                    for (var _i = 0, _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
                        var n = _a[_i];
                        if (DOM.isElementNode(n)) stripCustomNsAttrs(n);
                    }
                }
                function sanitizeHtml(unsafeHtmlInput) {
                    try {
                        var containerEl = getInertElement();
                        var unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : "";
                        var mXSSAttempts = 5;
                        var parsedHtml = unsafeHtml;
                        do {
                            if (mXSSAttempts === 0) {
                                throw new Error("Failed to sanitize html because the input is unstable");
                            }
                            mXSSAttempts--;
                            unsafeHtml = parsedHtml;
                            DOM.setInnerHTML(containerEl, unsafeHtml);
                            if (DOM.defaultDoc().documentMode) {
                                stripCustomNsAttrs(containerEl);
                            }
                            parsedHtml = DOM.getInnerHTML(containerEl);
                        } while (unsafeHtml !== parsedHtml);
                        var sanitizer = new SanitizingHtmlSerializer();
                        var safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
                        var parent_1 = DOM.getTemplateContent(containerEl) || containerEl;
                        for (var _i = 0, _a = DOM.childNodesAsList(parent_1); _i < _a.length; _i++) {
                            var child = _a[_i];
                            DOM.removeChild(parent_1, child);
                        }
                        if (core.isDevMode() && sanitizer.sanitizedSomething) {
                            DOM.log("WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).");
                        }
                        return safeHtml;
                    } catch (e) {
                        inertElement = null;
                        throw e;
                    }
                }
                var VALUES = "[-,.\"'%_!# a-zA-Z0-9]+";
                var TRANSFORMATION_FNS = "(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?";
                var COLOR_FNS = "(?:rgb|hsl)a?";
                var GRADIENTS = "(?:repeating-)?(?:linear|radial)-gradient";
                var CSS3_FNS = "(?:calc|attr)";
                var FN_ARGS = "\\([-0-9.%, #a-zA-Z]+\\)";
                var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" + ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") + (FN_ARGS + ")$"), "g");
                var URL_RE = /^url\(([^)]+)\)$/;
                function hasBalancedQuotes(value) {
                    var outsideSingle = true;
                    var outsideDouble = true;
                    for (var i = 0; i < value.length; i++) {
                        var c = value.charAt(i);
                        if (c === "'" && outsideDouble) {
                            outsideSingle = !outsideSingle;
                        } else if (c === '"' && outsideSingle) {
                            outsideDouble = !outsideDouble;
                        }
                    }
                    return outsideSingle && outsideDouble;
                }
                function sanitizeStyle(value) {
                    value = String(value).trim();
                    if (!value) return "";
                    var urlMatch = value.match(URL_RE);
                    if (urlMatch && sanitizeUrl(urlMatch[1]) === urlMatch[1] || value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
                        return value;
                    }
                    if (core.isDevMode()) {
                        getDOM().log("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
                    }
                    return "unsafe";
                }
                var __extends$8 = this && this.__extends || function(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                    function __() {
                        this.constructor = d;
                    }
                    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                };
                var DomSanitizer = function() {
                    function DomSanitizer() {}
                    DomSanitizer.prototype.sanitize = function(context, value) {};
                    DomSanitizer.prototype.bypassSecurityTrustHtml = function(value) {};
                    DomSanitizer.prototype.bypassSecurityTrustStyle = function(value) {};
                    DomSanitizer.prototype.bypassSecurityTrustScript = function(value) {};
                    DomSanitizer.prototype.bypassSecurityTrustUrl = function(value) {};
                    DomSanitizer.prototype.bypassSecurityTrustResourceUrl = function(value) {};
                    return DomSanitizer;
                }();
                var DomSanitizerImpl = function(_super) {
                    __extends$8(DomSanitizerImpl, _super);
                    function DomSanitizerImpl() {
                        _super.apply(this, arguments);
                    }
                    DomSanitizerImpl.prototype.sanitize = function(ctx, value) {
                        if (value == null) return null;
                        switch (ctx) {
                          case core.SecurityContext.NONE:
                            return value;

                          case core.SecurityContext.HTML:
                            if (value instanceof SafeHtmlImpl) return value.changingThisBreaksApplicationSecurity;
                            this.checkNotSafeValue(value, "HTML");
                            return sanitizeHtml(String(value));

                          case core.SecurityContext.STYLE:
                            if (value instanceof SafeStyleImpl) return value.changingThisBreaksApplicationSecurity;
                            this.checkNotSafeValue(value, "Style");
                            return sanitizeStyle(value);

                          case core.SecurityContext.SCRIPT:
                            if (value instanceof SafeScriptImpl) return value.changingThisBreaksApplicationSecurity;
                            this.checkNotSafeValue(value, "Script");
                            throw new Error("unsafe value used in a script context");

                          case core.SecurityContext.URL:
                            if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
                                return value.changingThisBreaksApplicationSecurity;
                            }
                            this.checkNotSafeValue(value, "URL");
                            return sanitizeUrl(String(value));

                          case core.SecurityContext.RESOURCE_URL:
                            if (value instanceof SafeResourceUrlImpl) {
                                return value.changingThisBreaksApplicationSecurity;
                            }
                            this.checkNotSafeValue(value, "ResourceURL");
                            throw new Error("unsafe value used in a resource URL context (see http://g.co/ng/security#xss)");

                          default:
                            throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
                        }
                    };
                    DomSanitizerImpl.prototype.checkNotSafeValue = function(value, expectedType) {
                        if (value instanceof SafeValueImpl) {
                            throw new Error("Required a safe " + expectedType + ", got a " + value.getTypeName() + " " + "(see http://g.co/ng/security#xss)");
                        }
                    };
                    DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function(value) {
                        return new SafeHtmlImpl(value);
                    };
                    DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function(value) {
                        return new SafeStyleImpl(value);
                    };
                    DomSanitizerImpl.prototype.bypassSecurityTrustScript = function(value) {
                        return new SafeScriptImpl(value);
                    };
                    DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function(value) {
                        return new SafeUrlImpl(value);
                    };
                    DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function(value) {
                        return new SafeResourceUrlImpl(value);
                    };
                    DomSanitizerImpl.decorators = [ {
                        type: core.Injectable
                    } ];
                    DomSanitizerImpl.ctorParameters = function() {
                        return [];
                    };
                    return DomSanitizerImpl;
                }(DomSanitizer);
                var SafeValueImpl = function() {
                    function SafeValueImpl(changingThisBreaksApplicationSecurity) {
                        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
                    }
                    SafeValueImpl.prototype.getTypeName = function() {};
                    SafeValueImpl.prototype.toString = function() {
                        return "SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity + " (see http://g.co/ng/security#xss)";
                    };
                    return SafeValueImpl;
                }();
                var SafeHtmlImpl = function(_super) {
                    __extends$8(SafeHtmlImpl, _super);
                    function SafeHtmlImpl() {
                        _super.apply(this, arguments);
                    }
                    SafeHtmlImpl.prototype.getTypeName = function() {
                        return "HTML";
                    };
                    return SafeHtmlImpl;
                }(SafeValueImpl);
                var SafeStyleImpl = function(_super) {
                    __extends$8(SafeStyleImpl, _super);
                    function SafeStyleImpl() {
                        _super.apply(this, arguments);
                    }
                    SafeStyleImpl.prototype.getTypeName = function() {
                        return "Style";
                    };
                    return SafeStyleImpl;
                }(SafeValueImpl);
                var SafeScriptImpl = function(_super) {
                    __extends$8(SafeScriptImpl, _super);
                    function SafeScriptImpl() {
                        _super.apply(this, arguments);
                    }
                    SafeScriptImpl.prototype.getTypeName = function() {
                        return "Script";
                    };
                    return SafeScriptImpl;
                }(SafeValueImpl);
                var SafeUrlImpl = function(_super) {
                    __extends$8(SafeUrlImpl, _super);
                    function SafeUrlImpl() {
                        _super.apply(this, arguments);
                    }
                    SafeUrlImpl.prototype.getTypeName = function() {
                        return "URL";
                    };
                    return SafeUrlImpl;
                }(SafeValueImpl);
                var SafeResourceUrlImpl = function(_super) {
                    __extends$8(SafeResourceUrlImpl, _super);
                    function SafeResourceUrlImpl() {
                        _super.apply(this, arguments);
                    }
                    SafeResourceUrlImpl.prototype.getTypeName = function() {
                        return "ResourceURL";
                    };
                    return SafeResourceUrlImpl;
                }(SafeValueImpl);
                var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [ {
                    provide: core.PLATFORM_INITIALIZER,
                    useValue: initDomAdapter,
                    multi: true
                }, {
                    provide: _angular_common.PlatformLocation,
                    useClass: BrowserPlatformLocation
                } ];
                var BROWSER_SANITIZATION_PROVIDERS = [ {
                    provide: core.Sanitizer,
                    useExisting: DomSanitizer
                }, {
                    provide: DomSanitizer,
                    useClass: DomSanitizerImpl
                } ];
                var platformBrowser = core.createPlatformFactory(core.platformCore, "browser", INTERNAL_BROWSER_PLATFORM_PROVIDERS);
                function initDomAdapter() {
                    BrowserDomAdapter.makeCurrent();
                    BrowserGetTestability.init();
                }
                function errorHandler() {
                    return new core.ErrorHandler();
                }
                function _document() {
                    return getDOM().defaultDoc();
                }
                function _resolveDefaultAnimationDriver() {
                    if (getDOM().supportsWebAnimation()) {
                        return new WebAnimationsDriver();
                    }
                    return AnimationDriver.NOOP;
                }
                var BrowserModule = function() {
                    function BrowserModule(parentModule) {
                        if (parentModule) {
                            throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
                        }
                    }
                    BrowserModule.decorators = [ {
                        type: core.NgModule,
                        args: [ {
                            providers: [ BROWSER_SANITIZATION_PROVIDERS, {
                                provide: core.ErrorHandler,
                                useFactory: errorHandler,
                                deps: []
                            }, {
                                provide: DOCUMENT,
                                useFactory: _document,
                                deps: []
                            }, {
                                provide: EVENT_MANAGER_PLUGINS,
                                useClass: DomEventsPlugin,
                                multi: true
                            }, {
                                provide: EVENT_MANAGER_PLUGINS,
                                useClass: KeyEventsPlugin,
                                multi: true
                            }, {
                                provide: EVENT_MANAGER_PLUGINS,
                                useClass: HammerGesturesPlugin,
                                multi: true
                            }, {
                                provide: HAMMER_GESTURE_CONFIG,
                                useClass: HammerGestureConfig
                            }, {
                                provide: DomRootRenderer,
                                useClass: DomRootRenderer_
                            }, {
                                provide: core.RootRenderer,
                                useExisting: DomRootRenderer
                            }, {
                                provide: SharedStylesHost,
                                useExisting: DomSharedStylesHost
                            }, {
                                provide: AnimationDriver,
                                useFactory: _resolveDefaultAnimationDriver
                            }, DomSharedStylesHost, core.Testability, EventManager, ELEMENT_PROBE_PROVIDERS, Title ],
                            exports: [ _angular_common.CommonModule, core.ApplicationModule ]
                        } ]
                    } ];
                    BrowserModule.ctorParameters = function() {
                        return [ {
                            type: BrowserModule,
                            decorators: [ {
                                type: core.Optional
                            }, {
                                type: core.SkipSelf
                            } ]
                        } ];
                    };
                    return BrowserModule;
                }();
                var win = typeof window !== "undefined" && window || {};
                var ChangeDetectionPerfRecord = function() {
                    function ChangeDetectionPerfRecord(msPerTick, numTicks) {
                        this.msPerTick = msPerTick;
                        this.numTicks = numTicks;
                    }
                    return ChangeDetectionPerfRecord;
                }();
                var AngularTools = function() {
                    function AngularTools(ref) {
                        this.profiler = new AngularProfiler(ref);
                    }
                    return AngularTools;
                }();
                var AngularProfiler = function() {
                    function AngularProfiler(ref) {
                        this.appRef = ref.injector.get(core.ApplicationRef);
                    }
                    AngularProfiler.prototype.timeChangeDetection = function(config) {
                        var record = config && config["record"];
                        var profileName = "Change Detection";
                        var isProfilerAvailable = isPresent(win.console.profile);
                        if (record && isProfilerAvailable) {
                            win.console.profile(profileName);
                        }
                        var start = getDOM().performanceNow();
                        var numTicks = 0;
                        while (numTicks < 5 || getDOM().performanceNow() - start < 500) {
                            this.appRef.tick();
                            numTicks++;
                        }
                        var end = getDOM().performanceNow();
                        if (record && isProfilerAvailable) {
                            win.console.profileEnd(profileName);
                        }
                        var msPerTick = (end - start) / numTicks;
                        win.console.log("ran " + numTicks + " change detection cycles");
                        win.console.log(msPerTick.toFixed(2) + " ms per check");
                        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
                    };
                    return AngularProfiler;
                }();
                var context = global$1;
                function enableDebugTools(ref) {
                    Object.assign(context.ng, new AngularTools(ref));
                    return ref;
                }
                function disableDebugTools() {
                    if (context.ng) {
                        delete context.ng.profiler;
                    }
                }
                var By = function() {
                    function By() {}
                    By.all = function() {
                        return function(debugElement) {
                            return true;
                        };
                    };
                    By.css = function(selector) {
                        return function(debugElement) {
                            return isPresent(debugElement.nativeElement) ? getDOM().elementMatches(debugElement.nativeElement, selector) : false;
                        };
                    };
                    By.directive = function(type) {
                        return function(debugElement) {
                            return debugElement.providerTokens.indexOf(type) !== -1;
                        };
                    };
                    return By;
                }();
                var __platform_browser_private__ = {
                    BrowserPlatformLocation: BrowserPlatformLocation,
                    DomAdapter: DomAdapter,
                    BrowserDomAdapter: BrowserDomAdapter,
                    BrowserGetTestability: BrowserGetTestability,
                    getDOM: getDOM,
                    setRootDomAdapter: setRootDomAdapter,
                    DomRootRenderer_: DomRootRenderer_,
                    DomRootRenderer: DomRootRenderer,
                    NAMESPACE_URIS: NAMESPACE_URIS,
                    shimContentAttribute: shimContentAttribute,
                    shimHostAttribute: shimHostAttribute,
                    flattenStyles: flattenStyles,
                    splitNamespace: splitNamespace,
                    isNamespaced: isNamespaced,
                    DomSharedStylesHost: DomSharedStylesHost,
                    SharedStylesHost: SharedStylesHost,
                    ELEMENT_PROBE_PROVIDERS: ELEMENT_PROBE_PROVIDERS,
                    DomEventsPlugin: DomEventsPlugin,
                    KeyEventsPlugin: KeyEventsPlugin,
                    HammerGesturesPlugin: HammerGesturesPlugin,
                    initDomAdapter: initDomAdapter,
                    INTERNAL_BROWSER_PLATFORM_PROVIDERS: INTERNAL_BROWSER_PLATFORM_PROVIDERS,
                    BROWSER_SANITIZATION_PROVIDERS: BROWSER_SANITIZATION_PROVIDERS,
                    WebAnimationsDriver: WebAnimationsDriver
                };
                var VERSION = new core.Version("2.4.10");
                exports.BrowserModule = BrowserModule;
                exports.platformBrowser = platformBrowser;
                exports.Title = Title;
                exports.disableDebugTools = disableDebugTools;
                exports.enableDebugTools = enableDebugTools;
                exports.AnimationDriver = AnimationDriver;
                exports.By = By;
                exports.NgProbeToken = NgProbeToken;
                exports.DOCUMENT = DOCUMENT;
                exports.EVENT_MANAGER_PLUGINS = EVENT_MANAGER_PLUGINS;
                exports.EventManager = EventManager;
                exports.HAMMER_GESTURE_CONFIG = HAMMER_GESTURE_CONFIG;
                exports.HammerGestureConfig = HammerGestureConfig;
                exports.DomSanitizer = DomSanitizer;
                exports.VERSION = VERSION;
                exports.__platform_browser_private__ = __platform_browser_private__;
            });
        }).call(exports, function() {
            return this;
        }());
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = this && this.__metadata || function(k, v) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var core_1 = __webpack_require__(2);
        var rx_pubsub_1 = __webpack_require__(21);
        var extend = __webpack_require__(25);
        var xdom_util_1 = __webpack_require__(27);
        var component_injector_1 = __webpack_require__(28);
        var ModalWindowComponent = function() {
            function ModalWindowComponent(pubsub, componentInjector) {
                this.pubsub = pubsub;
                this.componentInjector = componentInjector;
                this.animationClass = "fade";
                this.showModalClass = "in";
                this.bodyOpenModalClass = "modal-open";
                this.defaultButtonsProperties = {
                    visible: true,
                    cancel: {
                        visible: true,
                        label: "Cancel",
                        event: false
                    },
                    success: {
                        visible: true,
                        label: "Save",
                        event: false
                    }
                };
                this.defaultProperties = {
                    title: "",
                    show: false,
                    hide: false,
                    componentSelector: false,
                    componentInputs: false,
                    htmlContent: "",
                    overlayClick: true,
                    customClass: "",
                    buttons: {
                        visible: true,
                        cancel: {
                            visible: true,
                            label: "Cancel",
                            event: false
                        },
                        success: {
                            visible: true,
                            label: "Save",
                            event: false
                        }
                    }
                };
                this.properties = {};
            }
            Object.defineProperty(ModalWindowComponent.prototype, "id", {
                set: function(eventName) {
                    if (eventName) {
                        this.eventName = eventName;
                        this.unsubscribe();
                        this.subscribeToEvent();
                    }
                },
                enumerable: true,
                configurable: true
            });
            ModalWindowComponent.prototype.ngOnInit = function() {};
            ModalWindowComponent.prototype.ngOnDestroy = function() {
                this.unsubscribe();
                this.resetInjectedComponent();
            };
            ModalWindowComponent.prototype.cancelAction = function() {
                if (this.properties.buttons.cancel.event) {
                    this.pubsub.publish(this.properties.buttons.cancel.event, true);
                }
                this.hide();
            };
            ModalWindowComponent.prototype.successAction = function() {
                if (this.properties.buttons.success.event) {
                    this.pubsub.publish(this.properties.buttons.success.event, true);
                } else {
                    this.hide();
                }
            };
            ModalWindowComponent.prototype.overlayClick = function() {
                if (this.properties.overlayClick) {
                    this.cancelAction();
                }
            };
            ModalWindowComponent.prototype.show = function() {
                var modalDom = this.modalWindow.nativeElement;
                if (!xdom_util_1.XDomUtil.hasClass(modalDom, this.showModalClass)) {
                    xdom_util_1.XDomUtil.addClass(modalDom, this.showModalClass);
                }
                var body = document.querySelector("body");
                if (!xdom_util_1.XDomUtil.hasClass(body, this.bodyOpenModalClass)) {
                    xdom_util_1.XDomUtil.addClass(body, this.bodyOpenModalClass);
                }
            };
            ModalWindowComponent.prototype.hide = function() {
                var element = this.modalWindow.nativeElement;
                xdom_util_1.XDomUtil.removeClass(element, this.showModalClass);
                var body = document.querySelector("body");
                xdom_util_1.XDomUtil.removeClass(body, this.bodyOpenModalClass);
            };
            ModalWindowComponent.prototype.subscribeToEvent = function() {
                var _this = this;
                this.eventSubscriber = this.pubsub.subscribe(this.eventName, function(data) {
                    _this.initModal(data);
                });
            };
            ModalWindowComponent.prototype.initModal = function(properties) {
                if (properties.show) {
                    this.resetInjectedComponent();
                    this.setProperties(properties);
                    if (this.properties.componentSelector) {
                        this.injectedComponentRef = this.injectComponent(this.properties.componentSelector);
                        this.setComponentProperties();
                    }
                    this.show();
                    this.resetModalEventSubscriber();
                } else if (properties.hide) {
                    this.resetInjectedComponent();
                    this.setProperties(properties);
                    this.hide();
                    this.resetModalEventSubscriber();
                }
            };
            ModalWindowComponent.prototype.unsubscribe = function() {
                if (this.eventSubscriber) {
                    this.pubsub.unsubscribe(this.eventSubscriber);
                }
            };
            ModalWindowComponent.prototype.injectComponent = function(componentSelector) {
                var result;
                if (componentSelector) {
                    result = this.componentInjector.inject(this.injectContainer, componentSelector);
                }
                return result;
            };
            ModalWindowComponent.prototype.setComponentProperties = function() {
                if (this.properties.componentInputs && this.injectedComponentRef) {
                    this.componentInjector.setProperties(this.injectedComponentRef, this.properties.componentInputs);
                }
            };
            ModalWindowComponent.prototype.resetInjectedComponent = function() {
                if (this.injectedComponentRef) {
                    this.componentInjector.remove(this.injectedComponentRef);
                    this.injectedComponentRef = null;
                }
            };
            ModalWindowComponent.prototype.setProperties = function(properties) {
                this.properties = extend.deep({}, this.defaultProperties, properties);
            };
            ModalWindowComponent.prototype.resetModalEventSubscriber = function() {
                this.pubsub.publish(this.eventName, {});
            };
            return ModalWindowComponent;
        }();
        __decorate([ core_1.ViewChild("modalWindow"), __metadata("design:type", core_1.ElementRef) ], ModalWindowComponent.prototype, "modalWindow", void 0);
        __decorate([ core_1.ViewChild("injectContainer", {
            read: core_1.ViewContainerRef
        }), __metadata("design:type", core_1.ViewContainerRef) ], ModalWindowComponent.prototype, "injectContainer", void 0);
        __decorate([ core_1.Input(), __metadata("design:type", String) ], ModalWindowComponent.prototype, "animationClass", void 0);
        __decorate([ core_1.Input(), __metadata("design:type", String), __metadata("design:paramtypes", [ String ]) ], ModalWindowComponent.prototype, "id", null);
        ModalWindowComponent = __decorate([ core_1.Component({
            selector: "app-modal-window",
            templateUrl: "./modal-window.component.html",
            styleUrls: [ "./modal-window.component.css" ]
        }), __metadata("design:paramtypes", [ rx_pubsub_1.RxPubSub, component_injector_1.ComponentInjector ]) ], ModalWindowComponent);
        exports.ModalWindowComponent = ModalWindowComponent;
    }, function(module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        (function(module) {
            (function(r) {
                return function() {
                    var h = function(g, m, h, n) {
                        n = function(e) {
                            return h[e] ? m[e] : (h[e] = 1, m[e] = {}, m[e] = g[e](m[e]));
                        };
                        g[1] = function(e) {
                            var g = n(2);
                            var k = function(a) {
                                var b;
                                if (a) {
                                    var c = {};
                                    if ("object" !== typeof a) c[a] = !0; else {
                                        Array.isArray(a) || (a = Object.keys(a));
                                        var e = 0;
                                        for (b = a.length; e < b; e++) {
                                            var d = a[e];
                                            c[d] = !0;
                                        }
                                    }
                                    return c;
                                }
                            };
                            var c = function(a) {
                                var b = function(a) {
                                    var c = arguments.length;
                                    for (var d = -1, e = Array(c); ++d < c; ) e[d] = arguments[d];
                                    b.options.target ? c = b.options.target : (c = a, e.shift());
                                    return g(b.options, c, e);
                                };
                                a && (b.isBase = !0);
                                b.options = {};
                                Object.defineProperties(b, h);
                                return b;
                            };
                            var h = {
                                deep: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.deep = !0;
                                        return a;
                                    }
                                },
                                own: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.own = !0;
                                        return a;
                                    }
                                },
                                allowNull: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.allowNull = !0;
                                        return a;
                                    }
                                },
                                nullDeletes: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.nullDeletes = !0;
                                        return a;
                                    }
                                },
                                concat: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.concat = !0;
                                        return a;
                                    }
                                },
                                clone: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        a.options.target = {};
                                        return a;
                                    }
                                },
                                notDeep: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            a.options.notDeep = k(b);
                                            return a;
                                        };
                                    }
                                },
                                deepOnly: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            a.options.deepOnly = k(b);
                                            return a;
                                        };
                                    }
                                },
                                keys: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            a.options.keys = k(b);
                                            return a;
                                        };
                                    }
                                },
                                notKeys: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            a.options.notKeys = k(b);
                                            return a;
                                        };
                                    }
                                },
                                transform: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            "function" === typeof b ? a.options.globalTransform = b : b && "object" === typeof b && (a.options.transforms = b);
                                            return a;
                                        };
                                    }
                                },
                                filter: {
                                    get: function() {
                                        var a = this.isBase ? c() : this;
                                        return function(b) {
                                            "function" === typeof b ? a.options.globalFilter = b : b && "object" === typeof b && (a.options.filters = b);
                                            return a;
                                        };
                                    }
                                }
                            };
                            return e = c(!0);
                        };
                        g[2] = function(e) {
                            var g;
                            var k = function(a) {
                                return Array.isArray(a);
                            };
                            var c = function(a) {
                                return a && "[object Object]" === Object.prototype.toString.call(a) || k(a);
                            };
                            var h = function(a, b, c) {
                                if (a.deep) return a.notDeep ? !a.notDeep[b] : !0;
                                if (a.deepOnly) return a.deepOnly[b] || c && h(a, c);
                            };
                            return e = g = function(a, b, e, m) {
                                var d, n;
                                if (!b || "object" !== typeof b && "function" !== typeof b) b = {};
                                var q = 0;
                                for (n = e.length; q < n; q++) {
                                    var l = e[q];
                                    if (null != l) for (d in l) {
                                        var f = l[d];
                                        var p = b[d];
                                        if (!(f === b || void 0 === f || null === f && !a.allowNull && !a.nullDeletes || a.keys && !a.keys[d] || a.notKeys && a.notKeys[d] || a.own && !l.hasOwnProperty(d) || a.globalFilter && !a.globalFilter(f, d, l) || a.filters && a.filters[d] && !a.filters[d](f, d, l))) if (null === f && a.nullDeletes) delete b[d]; else switch (a.globalTransform && (f = a.globalTransform(f, d, l)), 
                                        a.transforms && a.transforms[d] && (f = a.transforms[d](f, d, l)), !1) {
                                          case !(a.concat && k(f) && k(p)):
                                            b[d] = p.concat(f);
                                            break;

                                          case !(h(a, d, m) && c(f)):
                                            p = c(p) ? p : k(f) ? [] : {};
                                            b[d] = g(a, p, [ f ], d);
                                            break;

                                          default:
                                            b[d] = f;
                                        }
                                    }
                                }
                                return b;
                            };
                        };
                        return n;
                    };
                    h = h({}, {}, {});
                    return function() {
                        var g = h(1);
                        null != ("undefined" !== typeof module && null !== module ? module.exports : void 0) ? module.exports = g : true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(25) ], 
                        __WEBPACK_AMD_DEFINE_RESULT__ = function() {
                            return g;
                        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : window.extend = g;
                    }();
                };
            })(this)();
        }).call(exports, __webpack_require__(26)(module));
    }, function(module, exports) {
        module.exports = function(module) {
            if (!module.webpackPolyfill) {
                module.deprecate = function() {};
                module.paths = [];
                module.children = [];
                module.webpackPolyfill = 1;
            }
            return module;
        };
    }, function(module, exports, __webpack_require__) {
        !function(e, t) {
            if (true) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
                var o = t();
                for (var n in o) ("object" == typeof exports ? exports : e)[n] = o[n];
            }
        }(this, function() {
            return function(e) {
                function t(n) {
                    if (o[n]) return o[n].exports;
                    var r = o[n] = {
                        exports: {},
                        id: n,
                        loaded: !1
                    };
                    return e[n].call(r.exports, r, r.exports, t), r.loaded = !0, r.exports;
                }
                var o = {};
                return t.m = e, t.c = o, t.p = "/static/", t(0);
            }([ function(e, t) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var o = function() {
                    function e() {}
                    return e.addClass = function(e, t) {
                        e.className = (e.className + " " + t).trim();
                    }, e.hasClass = function(e, t) {
                        return !(!t || (" " + e.className + " ").indexOf(" " + t + " ") == -1);
                    }, e.removeClass = function(e, t) {
                        var o = " " + e.className;
                        e.className = o.replace(" " + t, "");
                    }, e;
                }();
                t.XDomUtil = o;
            } ]);
        });
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = this && this.__metadata || function(k, v) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var core_1 = __webpack_require__(2);
        var ComponentInjector = function() {
            function ComponentInjector(resolver) {
                this.resolver = resolver;
            }
            ComponentInjector.prototype.inject = function(container, componentSelector) {
                var injectedComponent;
                var componentFactory = this.getComponentFactory(componentSelector);
                if (componentFactory) {
                    injectedComponent = this.injectComponentFactory(container, componentFactory);
                } else {
                    console.warn("Component [" + componentSelector + "] cannot be found! " + "Make sure it is included in the `entryComponents` list.");
                }
                return injectedComponent ? injectedComponent : null;
            };
            ComponentInjector.prototype.setProperties = function(componentRef, properties) {
                if (componentRef) {
                    for (var property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            componentRef.instance[property] = properties[property];
                        }
                    }
                }
            };
            ComponentInjector.prototype.remove = function(componentRef) {
                componentRef.destroy();
                componentRef = null;
            };
            ComponentInjector.prototype.getComponentFactory = function(componentSelector) {
                var componentFactory;
                var factories = Array.from(this.resolver["_factories"]);
                var factory = factories.find(function(component) {
                    return component[1].selector === componentSelector;
                });
                if (factory) {
                    var factoryClass = factory[0];
                    componentFactory = this.resolver.resolveComponentFactory(factoryClass);
                }
                return componentFactory ? componentFactory : null;
            };
            ComponentInjector.prototype.injectComponentFactory = function(container, componentFactory) {
                return container.createComponent(componentFactory);
            };
            return ComponentInjector;
        }();
        ComponentInjector = __decorate([ core_1.Injectable(), __metadata("design:paramtypes", [ core_1.ComponentFactoryResolver ]) ], ComponentInjector);
        exports.ComponentInjector = ComponentInjector;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        var __metadata = this && this.__metadata || function(k, v) {
            if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
        };
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        var core_1 = __webpack_require__(2);
        var rx_pubsub_1 = __webpack_require__(21);
        var ModalWindowService = function() {
            function ModalWindowService(pubsub) {
                this.pubsub = pubsub;
            }
            ModalWindowService.prototype.showModal = function(modalId, options) {
                if (options === void 0) {
                    options = {};
                }
                options.show = true;
                options.hide = null;
                this.pubsub.publish(modalId, options);
            };
            ModalWindowService.prototype.hideModal = function(modalId) {
                var options = {
                    hide: true
                };
                this.pubsub.publish(modalId, options);
            };
            ModalWindowService.prototype.resetEventsSubscribers = function(eventsList) {
                var _this = this;
                eventsList.forEach(function(eventName) {
                    if (eventName && _this.pubsub.hasSubscribers(eventName)) {
                        _this.pubsub.dispose(eventName);
                    }
                });
            };
            return ModalWindowService;
        }();
        ModalWindowService = __decorate([ core_1.Injectable(), __metadata("design:paramtypes", [ rx_pubsub_1.RxPubSub ]) ], ModalWindowService);
        exports.ModalWindowService = ModalWindowService;
    } ]);
});


//# sourceMappingURL=ng2-modal-module.js.map