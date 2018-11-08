"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const uid = require("uniqid");
const _ = require("lodash");
const camelcase = require("camelcase");
class OpenStreelMapReverseGeoError extends Error {
}
exports.OpenStreelMapReverseGeoError = OpenStreelMapReverseGeoError;
function isLongitude(lng) {
    const lngN = Number(lng);
    return lngN >= -180 && lngN <= 180;
}
function isLatitude(lat) {
    const latN = Number(lat);
    return latN >= -90 && latN <= 90;
}
class ReverseGeocoder {
    constructor(lat, lng) {
        // Validate lat and lng
        if (!isLatitude(lat)) {
            throw new OpenStreelMapReverseGeoError('Latitude is not valid');
        }
        if (!isLongitude(lng)) {
            throw new OpenStreelMapReverseGeoError('Longitude is not valid');
        }
        this.latInput = lat;
        this.lngInput = lng;
    }
    getCityName() {
        return __awaiter(this, void 0, void 0, function* () {
            const reverse = yield this.getReverse();
            return reverse.address.city
                || reverse.address.village
                || reverse.address.county
                || reverse.address.suburb
                || '';
        });
    }
    enableCache(cacheSize) {
        ReverseGeocoder.cacheIsEnabled = true;
        ReverseGeocoder.maxCacheSize = cacheSize || 100;
    }
    disableCache() {
        ReverseGeocoder.cacheIsEnabled = false;
        ReverseGeocoder.cache = [];
    }
    getReverse() {
        return __awaiter(this, void 0, void 0, function* () {
            // API response
            let response;
            // Search in cache
            if (ReverseGeocoder.cacheIsEnabled) {
                const index = this.isInCache(this.latInput, this.lngInput);
                if (index > -1) {
                    const resultInCache = ReverseGeocoder.cache[index];
                    resultInCache.fromCache = true;
                    return ReverseGeocoder.cache[index];
                }
            }
            // Not in cache make request
            response = yield this.getRequest();
            if (response.error) {
                throw new OpenStreelMapReverseGeoError(response.error);
            }
            const result = {
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
                for (const key in response.address) {
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
            return result;
        });
    }
    isInCache(lat, lng) {
        return _.findIndex(ReverseGeocoder.cache, (o) => {
            return o.latInput === lat && o.lngInput === lng;
        });
    }
    getRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'GET',
                uri: 'https://nominatim.openstreetmap.org/reverse?format=json' +
                    '&lat=' + this.latInput +
                    '&lon=' + this.lngInput,
                headers: {
                    'User-Agent': uid(),
                    'Referer': 'http://' + uid() + '/'
                }
            };
            const response = JSON.parse(yield rp.get(options));
            return response;
        });
    }
}
ReverseGeocoder.cache = [];
ReverseGeocoder.cacheIsEnabled = true;
ReverseGeocoder.maxCacheSize = 100;
exports.ReverseGeocoder = ReverseGeocoder;
