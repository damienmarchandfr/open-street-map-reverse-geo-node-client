import * as rp from 'request-promise'
import  * as uid from 'uniqid'

export interface IAddress {
    memorial? : string,
    village? : string,
    county? : string,
    townhall? : string,
    pedestrian? :string,
    houseNumber? : string,
    neighbourhood? : string,
    restaurant? : string,
    road? : string,
    suburb? : string,
    city? : string,
    cityDistrict? : string,
    country? : string,
    state? : string,
    stateDistrict? : string,
    postcode? : string,
    countryCode? : string
}

export interface Reverse {
    placeId: string
    lat : string
    lng : string
    displayName : string
    address? : IAddress
}

export class ReverseGeocoder {
    private lat : string
    private lng : string

    constructor(lat : string,lng : string){
        this.lat = lat
        this.lng = lng
    }

    public async getReverse() : Promise<Reverse>{
        const response = await this.getRequest()

        let result : Reverse = {
            placeId : response.place_id,
            displayName : response.display_name,
            lat : response.lat,
            lng : response.lon,
            address : {}
        }

        if(response.address){
            for (const key in response.address) {
                if(key.indexOf('_')> -1){
                    (result.address as any)[key.replace('_','')] = response.address[key]
                }else{
                    (result.address as any)[key] = response.address[key]
                }
            }
        }
        return result
    }

    private async getRequest() : Promise<any>{
        const options = {
			method: 'GET',
			uri: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + this.lat + '&lon=' + this.lng,
			headers: {
				'User-Agent': uid(),
				Referer: 'http://'+uid()+'/'
			}
		}
        const response = JSON.parse(await rp.get(options))
        return response
    }
}