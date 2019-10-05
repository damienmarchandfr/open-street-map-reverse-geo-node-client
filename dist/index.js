"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const uid = require("uniqid");
const _ = require("lodash");
const camelcase = require("camelcase");
const response_1 = require("./tests/response");
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
    constructor(config) {
        this.config = {
            cacheIsEnabled: true,
            maxCacheSize: 100,
            callApi: true
        };
        this.cache = [];
        if (config) {
            this.config = config;
        }
    }
    /**
     * Return city name from lat and lng
     * @param lat
     * @param lng
     */
    getCityName(lat, lng) {
        return __awaiter(this, void 0, void 0, function* () {
            const reverse = yield this.getReverse(lat, lng);
            return reverse.address.city
                || reverse.address.village
                || reverse.address.county
                || reverse.address.suburb
                || '';
        });
    }
    enableCache(cacheSize = 100) {
        this.config.cacheIsEnabled = true;
        this.config.maxCacheSize = cacheSize;
        this.cache = [];
    }
    disableCache() {
        this.config.cacheIsEnabled = false;
        this.cache = [];
    }
    /**
     * Returns informations from geo point
     * @param latInput
     * @param lngInput
     */
    getReverse(latInput, lngInput) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify lat and lng
            if (!isLatitude(latInput)) {
                throw new OpenStreelMapReverseGeoError('Latitude is not valid');
            }
            if (!isLongitude(lngInput)) {
                throw new OpenStreelMapReverseGeoError('Longitude is not valid');
            }
            // API response
            let response;
            // Search in cache
            if (this.config.cacheIsEnabled) {
                const index = this.isInCache(latInput, lngInput);
                if (index > -1) {
                    const resultInCache = this.cache[index];
                    resultInCache.fromCache = true;
                    return this.cache[index];
                }
            }
            // Not in cache make request
            response = yield this.getRequest(latInput, lngInput, this.config.callApi);
            if (response.error) {
                throw new OpenStreelMapReverseGeoError(response.error);
            }
            const result = {
                placeId: response.place_id,
                displayName: response.display_name,
                lat: response.lat,
                lng: response.lon,
                address: {},
                latInput,
                lngInput,
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
            if (this.config.cacheIsEnabled && this.cache.length < (this.config.maxCacheSize || 100)) {
                this.cache.push(result);
            }
            return result;
        });
    }
    /**
     * Return index of element in cache
     * @param lat
     * @param lng
     */
    isInCache(lat, lng) {
        return _.findIndex(this.cache, (o) => {
            return o.latInput === lat && o.lngInput === lng;
        });
    }
    /**
     * Get request to API. Return any. Use getReverse to get an IReverse
     * @param latInput
     * @param lngInput
     */
    getRequest(latInput, lngInput, callApi = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!callApi) {
                console.log(`open-street-map-reverse-geo-node-client module returns a fake response.`);
                return response_1.validResponse;
            }
            const options = {
                method: 'GET',
                uri: 'https://nominatim.openstreetmap.org/reverse?format=json' +
                    '&lat=' + latInput +
                    '&lon=' + lngInput,
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
exports.ReverseGeocoder = ReverseGeocoder;
