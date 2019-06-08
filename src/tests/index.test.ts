import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import {validResponse, errorResponse} from './response'
import { ReverseGeocoder, OpenStreelMapReverseGeoError, IReverse } from '..';

let stub: any
let stub2: any

const geo = new ReverseGeocoder()
const geo2 = new ReverseGeocoder()

describe('Test ReverseGeocoder class', () => {
    beforeEach( async () => {
        stub = sinon.stub(geo, 'getRequest').callsFake(async () => validResponse)
        stub2 = sinon.stub(geo2, 'getRequest').callsFake(async () => validResponse)
    })

    afterEach(() => {
        stub.restore()
        stub2.restore()
    })

    it('should throw error if lat or lng is not valid', async () => {
        const geoError = new ReverseGeocoder()
        let error: OpenStreelMapReverseGeoError = new OpenStreelMapReverseGeoError()
        try {
            await geoError.getCityName('-200', '0')
        } catch (err) {
               error = err
        }
        expect(error.message).to.eql('Latitude is not valid')

        try {
            await geoError.getCityName('0', '-200')
        } catch (err) {
            error = err
        }
        expect(error.message).to.eql('Longitude is not valid')

        try {
            await geoError.getCityName('-200', '-200')
        } catch (err) {
            error = err
        }
        expect(error.message).to.eql('Latitude is not valid')
    })

    it('should throw error if api send error', async () => {
        stub.restore()
        stub = sinon.stub(geo, 'getRequest').resolves(errorResponse)

        let error = new OpenStreelMapReverseGeoError()

        try {
            await await geo.getReverse('0', '0')
        } catch (err) {
            error = err
        }

        expect(error.message).to.eql('Nop')
    })

    it('should return add to cache by default', async () => {
       let result = await  geo.getReverse('0', '0')
       expect(result.fromCache).to.be.false
       result = await  geo.getReverse('0', '0')
       expect(result.fromCache).to.be.true
       result = await geo2.getReverse('0', '0')
       expect(result.fromCache).to.be.false
       result = await  geo2.getReverse('0', '0')
       expect(result.fromCache).to.be.true
    })

    it('should not add in cache if disabled', async () => {
        geo.disableCache()
        let result = await  geo.getReverse('0', '0')
        expect(result.fromCache).to.be.false
        result = await  geo.getReverse('0', '0')
        expect(result.fromCache).to.be.false
        geo.enableCache()
    })

    it('should return the response', async () => {
        const result = await geo.getReverse('0', '0')
        assertValidResponse(result, validResponse)
        const cityName = await geo.getCityName('0', '0')
        expect(cityName).to.eql(result.address.city)
    })

    it(`should not make request if callApi is false in config`, async () => {
        const fakeGeo = new ReverseGeocoder({
            cacheIsEnabled : false,
            callApi : false
        })
        const result = await fakeGeo.getReverse('0', '0')
        assertValidResponse(result, validResponse)
    })

})

function assertValidResponse(result: IReverse, validResonse: any) {
    expect( result.displayName).to.eql(validResponse.display_name)
    expect( result.lat).to.eql(validResponse.lat)
    expect( result.lng).to.eql(validResponse.lon)
    expect( result.latInput).to.eql('0')
    expect( result.lngInput).to.eql('0')
    expect(result.placeId).to.eql(validResponse.place_id)
    expect(validResponse.address.city).to.eql(result.address.city)
    expect(validResponse.address.country).to.eql(result.address.country)
    expect(validResponse.address.country_code).to.eql(result.address.countryCode)
    expect(validResponse.address.county).to.eql(result.address.county)
    expect(validResponse.address.pedestrian).to.eql(result.address.pedestrian)
    expect(validResponse.address.postcode).to.eql(result.address.postcode)
    expect(validResponse.address.state).to.eql(result.address.state)
    expect(validResponse.address.suburb).to.eql(result.address.suburb)
    expect(validResponse.address.theatre).to.eql(result.address.theatre)
}
