import * as rp from 'request-promise'

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

export class RevergeGeocoder {
    private lat : string
    private lng : string

    const(lat : string,lng : string){
        this.lat = lat
        this.lng = lng
    }

    public async getReverse() : Promise<Reverse>{
        const options = {
			method: 'GET',
			uri: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + this.lat + '&lon=' + this.lng,
			headers: {
				'User-Agent': 'whatever',
				Referer: 'http://localhost/'
			}
		}
        const response = await rp.get(options)
        let result : Reverse = {
            placeId : response.place_id,
            displayName : response.display_name,
            lat : response.lat,
            lng : response.lon
        }

        if(response.address){
            result.address = {
                city : response.address.city,
                cityDistrict : response.address.city_district,
                country : response.address.country,
                countryCode : response.address.country_code,
                county : response.address.county,
                houseNumber : response.address.house_number,
                memorial : response.address.memorial,
                neighbourhood : response.address.neighbourhood,
                pedestrian : response.address.pedestrian,
                postcode : response.address.postcode,
                restaurant : response.address.restaurant,
                road : response.address.road,
                state : response.address.state,
                stateDistrict : response.address.state_district,
                suburb : response.address.suburb,
                townhall : response.address.townhall,
                village : response.address.village
            }
        }
        return result
    }
}