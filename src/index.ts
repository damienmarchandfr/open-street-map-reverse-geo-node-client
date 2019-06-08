import * as rp from 'request-promise'
import * as uid from 'uniqid'
import * as _ from 'lodash'
import * as camelcase from 'camelcase'

import {validResponse} from './tests/response'

export class OpenStreelMapReverseGeoError extends Error {}

function isLongitude(lng: string) {
    const lngN = Number(lng)
    return lngN >= -180 && lngN <= 180
}

function isLatitude(lat: string) {
    const latN = Number(lat)
    return latN >= -90 && latN <= 90
  }

export interface IAddress {
    memorial?: string,
    village?: string,
    county?: string,
    townhall?: string,
    pedestrian?: string,
    houseNumber?: string,
    neighbourhood?: string,
    restaurant?: string,
    road?: string,
    suburb?: string,
    city?: string,
    cityDistrict?: string,
    country?: string,
    state?: string,
    stateDistrict?: string,
    postcode?: string,
    countryCode?: string,
    theatre?: string,
    boundingbox?: string,
    town?: string
}

export interface IReverse {
    placeId: string
    lat: string
    lng: string
    displayName: string
    address: IAddress
    latInput: string
    lngInput: string
    fromCache: boolean
}

export interface IReverseGeocoderConfig {
    cacheIsEnabled: boolean
    callApi?: boolean
    maxCacheSize?: number
}

export class ReverseGeocoder {
    private config: IReverseGeocoderConfig = {
        cacheIsEnabled : true,
        maxCacheSize : 100,
        callApi: true
    }

    private cache: IReverse[]

    constructor(config?: IReverseGeocoderConfig) {
        this.cache = []
        if (config) {
            this.config = config
        }
    }

    /**
     * Return city name from lat and lng
     * @param lat
     * @param lng
     */
    public async getCityName(lat: string, lng: string): Promise<string> {
        const reverse = await this.getReverse(lat, lng)
        return reverse.address.city
            || reverse.address.village
            || reverse.address.county
            || reverse.address.suburb
            || ''
    }

    public enableCache(cacheSize = 100) {
        this.config.cacheIsEnabled = true
        this.config.maxCacheSize = cacheSize
        this.cache = []
    }

    public disableCache() {
        this.config.cacheIsEnabled = false
        this.cache = []
    }

    /**
     * Returns informations from geo point
     * @param latInput
     * @param lngInput
     */
    public async getReverse(latInput: string, lngInput: string): Promise<IReverse> {
        // Verify lat and lng
        if (!isLatitude(latInput)) {
            throw new OpenStreelMapReverseGeoError('Latitude is not valid')
        }
        if (!isLongitude(lngInput)) {
            throw new OpenStreelMapReverseGeoError('Longitude is not valid')
        }

        // API response
        let response: any

        // Search in cache
        if (this.config.cacheIsEnabled) {
            const index =  this.isInCache(latInput, lngInput)
            if (index > -1) {
                const resultInCache = this.cache[index]
                resultInCache.fromCache = true
                return this.cache[index]
            }
        }

        // Not in cache make request
        response = await this.getRequest(latInput, lngInput, this.config.callApi)

        if (response.error) {
            throw new OpenStreelMapReverseGeoError(response.error)
        }

        const result: IReverse = {
            placeId : response.place_id,
            displayName : response.display_name,
            lat : response.lat,
            lng : response.lon,
            address : {},
            latInput,
            lngInput,
            fromCache : false
        }

        if (response.address) {
            for (const key in response.address) {
                if (key.indexOf('_') > -1) {
                    (result.address as any)[camelcase(key)] = response.address[key]
                } else {
                    (result.address as any)[key] = response.address[key]
                }
            }
        }

        if (this.config.cacheIsEnabled && this.cache.length < (this.config.maxCacheSize || 100)) {
            this.cache.push(result)
        }

        return result
    }

    /**
     * Return index of element in cache
     * @param lat
     * @param lng
     */
    public isInCache(lat: string, lng: string): number {
        return  _.findIndex(this.cache, (o) => {
           return o.latInput === lat && o.lngInput === lng
       })
    }

    /**
     * Get request to API. Return any. Use getReverse to get an IReverse
     * @param latInput
     * @param lngInput
     */
    public async getRequest(latInput: string, lngInput: string, callApi = true): Promise<any> {
        if (!callApi) {
            console.log(`open-street-map-reverse-geo-node-client module returns a fake response.`)
            return validResponse
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
        }
        const response = JSON.parse(await rp.get(options))
        return response
    }
}
