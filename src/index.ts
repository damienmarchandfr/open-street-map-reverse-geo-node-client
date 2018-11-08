import * as rp from 'request-promise'
import * as uid from 'uniqid'
import * as _ from 'lodash'
import * as camelcase from 'camelcase'

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

export class ReverseGeocoder {
    public static cache: IReverse[] = []
    public static cacheIsEnabled: boolean = true
    public static maxCacheSize: number = 100

    // INPUT
    public latInput: string
    public lngInput: string

    constructor(lat: string, lng: string) {
        // Validate lat and lng
        if (!isLatitude(lat)) {
            throw new OpenStreelMapReverseGeoError('Latitude is not valid')
        }
        if (!isLongitude(lng)) {
            throw new OpenStreelMapReverseGeoError('Longitude is not valid')
        }
        this.latInput = lat
        this.lngInput = lng
    }

    public async getCityName(): Promise<string> {
        const reverse = await this.getReverse()
        return reverse.address.city
            || reverse.address.village
            || reverse.address.county
            || reverse.address.suburb
            || ''
    }

    public enableCache(cacheSize?: number) {
        ReverseGeocoder.cacheIsEnabled = true
        ReverseGeocoder.maxCacheSize = cacheSize || 100
    }

    public disableCache() {
        ReverseGeocoder.cacheIsEnabled = false
        ReverseGeocoder.cache = []
    }

    public async getReverse(): Promise<IReverse> {
        // API response
        let response: any

        // Search in cache
        if (ReverseGeocoder.cacheIsEnabled) {
            const index =  this.isInCache(this.latInput, this.lngInput)
            if (index > -1) {
                const resultInCache = ReverseGeocoder.cache[index]
                resultInCache.fromCache = true
                return ReverseGeocoder.cache[index]
            }
        }

        // Not in cache make request
        response = await this.getRequest()

        if (response.error) {
            throw new OpenStreelMapReverseGeoError(response.error)
        }

        const result: IReverse = {
            placeId : response.place_id,
            displayName : response.display_name,
            lat : response.lat,
            lng : response.lon,
            address : {},
            latInput : this.latInput,
            lngInput : this.lngInput,
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

        if (ReverseGeocoder.cacheIsEnabled) {
            ReverseGeocoder.cache.push(result)
        }

        return result
    }

    public isInCache(lat: string, lng: string): number {
        return  _.findIndex(ReverseGeocoder.cache, (o) => {
           return o.latInput === lat && o.lngInput === lng
       })
    }

    public async getRequest(): Promise<any> {
        const options = {
            method: 'GET',
            uri: 'https://nominatim.openstreetmap.org/reverse?format=json' +
                '&lat=' + this.latInput +
                '&lon=' + this.lngInput,
            headers: {
                'User-Agent': uid(),
                'Referer': 'http://' + uid() + '/'
            }
        }
        const response = JSON.parse(await rp.get(options))
        return response
    }
}
