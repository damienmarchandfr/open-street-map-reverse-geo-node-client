export declare class OpenStreelMapReverseGeoError extends Error {
}
export interface IAddress {
    memorial?: string;
    village?: string;
    county?: string;
    townhall?: string;
    pedestrian?: string;
    houseNumber?: string;
    neighbourhood?: string;
    restaurant?: string;
    road?: string;
    suburb?: string;
    city?: string;
    cityDistrict?: string;
    country?: string;
    state?: string;
    stateDistrict?: string;
    postcode?: string;
    countryCode?: string;
    theatre?: string;
    boundingbox?: string;
    town?: string;
}
export interface IReverse {
    placeId: string;
    lat: string;
    lng: string;
    displayName: string;
    address: IAddress;
    latInput: string;
    lngInput: string;
    fromCache: boolean;
}
export interface IReverseGeocoderConfig {
    cacheIsEnabled: boolean;
    callApi?: boolean;
    maxCacheSize?: number;
}
export declare class ReverseGeocoder {
    private config;
    private cache;
    constructor(config?: IReverseGeocoderConfig);
    /**
     * Return city name from lat and lng
     * @param lat
     * @param lng
     */
    getCityName(lat: string, lng: string): Promise<string>;
    enableCache(cacheSize?: number): void;
    disableCache(): void;
    /**
     * Returns informations from geo point
     * @param latInput
     * @param lngInput
     */
    getReverse(latInput: string, lngInput: string): Promise<IReverse>;
    /**
     * Return index of element in cache
     * @param lat
     * @param lng
     */
    isInCache(lat: string, lng: string): number;
    /**
     * Get request to API. Return any. Use getReverse to get an IReverse
     * @param latInput
     * @param lngInput
     */
    getRequest(latInput: string, lngInput: string, callApi?: boolean): Promise<any>;
}
