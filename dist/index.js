"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rp = require("request-promise");
var uid = require("uniqid");
var _ = require("lodash");
var camelcase = require("camelcase");
var Error_1 = require("./Error");
function isLongitude(lng) {
    var lngN = Number(lng);
    return lngN >= -180 && lngN <= 180;
}
function isLatitude(lat) {
    var latN = Number(lat);
    return latN >= -90 && latN <= 90;
}
var ReverseGeocoder = /** @class */ (function () {
    function ReverseGeocoder(lat, lng) {
        // Validate lat and lng
        if (!isLatitude(lat)) {
            throw new Error_1.OpenStreelMapReverseGeoError('Latitude is not valid');
        }
        if (!isLongitude(lng)) {
            throw new Error_1.OpenStreelMapReverseGeoError('Longitude is not valid');
        }
        this.latInput = lat;
        this.lngInput = lng;
    }
    ReverseGeocoder.prototype.enableCache = function (cacheSize) {
        ReverseGeocoder.cacheIsEnabled = true;
        ReverseGeocoder.maxCacheSize = cacheSize || 100;
    };
    ReverseGeocoder.prototype.disableCache = function () {
        ReverseGeocoder.cacheIsEnabled = false;
        ReverseGeocoder.cache = [];
    };
    ReverseGeocoder.prototype.getReverse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, index, resultInCache, result, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Search in cache
                        if (ReverseGeocoder.cacheIsEnabled) {
                            index = this.isInCache(this.latInput, this.lngInput);
                            if (index > -1) {
                                resultInCache = ReverseGeocoder.cache[index];
                                resultInCache.fromCache = true;
                                return [2 /*return*/, ReverseGeocoder.cache[index]];
                            }
                        }
                        return [4 /*yield*/, this.getRequest()];
                    case 1:
                        // Not in cache make request
                        response = _a.sent();
                        if (response.error) {
                            throw new Error_1.OpenStreelMapReverseGeoError(response.error);
                        }
                        result = {
                            placeId: response.place_id,
                            displayName: response.display_name,
                            lat: response.lat,
                            lng: response.lon,
                            address: {},
                            latInput: this.latInput,
                            lngInput: this.lngInput,
                            fromCache: false
                        };
                        if (response.address) {
                            for (key in response.address) {
                                if (key.indexOf('_') > -1) {
                                    result.address[camelcase(key)] = response.address[key];
                                }
                                else {
                                    result.address[key] = response.address[key];
                                }
                            }
                        }
                        if (ReverseGeocoder.cacheIsEnabled) {
                            ReverseGeocoder.cache.push(result);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    ReverseGeocoder.prototype.isInCache = function (lat, lng) {
        return _.findIndex(ReverseGeocoder.cache, function (o) {
            return o.latInput === lat && o.lngInput === lng;
        });
    };
    ReverseGeocoder.prototype.getRequest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        options = {
                            method: 'GET',
                            uri: 'https://nominatim.openstreetmap.org/reverse?format=json' +
                                '&lat=' + this.latInput +
                                '&lon=' + this.lngInput,
                            headers: {
                                'User-Agent': uid(),
                                'Referer': 'http://' + uid() + '/'
                            }
                        };
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, rp.get(options)];
                    case 1:
                        response = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ReverseGeocoder.cache = [];
    ReverseGeocoder.cacheIsEnabled = true;
    ReverseGeocoder.maxCacheSize = 100;
    return ReverseGeocoder;
}());
exports.ReverseGeocoder = ReverseGeocoder;
//# sourceMappingURL=index.js.map