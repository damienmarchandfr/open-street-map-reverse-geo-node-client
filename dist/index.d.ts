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
export declare class ReverseGeocoder {
    static cache: IReverse[];
    static cacheIsEnabled: boolean;
    static maxCacheSize: number;
    latInput: string;
    lngInput: string;
    constructor(lat: string, lng: string);
    enableCache(cacheSize?: number): void;
    disableCache(): void;
    getReverse(): Promise<IReverse>;
    isInCache(lat: string, lng: string): number;
    getRequest(): Promise<any>;
}
