import { expect } from 'chai'
import * as fs from 'fs'
import 'mocha'
import * as sinon from 'sinon'
import {validResponse, errorResponse} from './response'
import { OpenStreelMapReverseGeoError } from '../Error';
import { ReverseGeocoder } from '..';

let stub: sinon.SinonStub
let stub2: sinon.SinonStub

const geo = new ReverseGeocoder('0', '0')
const geo2 = new ReverseGeocoder('1', '1')

describe('Test MailBoxLayer class', () => {
    beforeEach( async () => {
        stub = sinon.stub(geo, 'getRequest').resolves(validResponse)
        stub2 = sinon.stub(geo2, 'getRequest').resolves(validResponse)
    })

    afterEach(() => {
        stub.restore()
        stub2.restore()
    })

    it('should throw error if lat or lng is not valid', async () => {
        let error: OpenStreelMapReverseGeoError = new OpenStreelMapReverseGeoError()
        try {
            new ReverseGeocoder('-200', '0')
        } catch (err) {
            error = err
        }
        expect(error.message).to.eql('Latitude is not valid')

        try {
            new ReverseGeocoder('0', '-200')
        } catch (err) {
            error = err
        }
        expect(error.message).to.eql('Longitude is not valid')

        try {
            new ReverseGeocoder('-200', '-200')
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
            await geo.getReverse()
        } catch (err) {
            error = err
        }

        expect(error.message).to.eql('Nop')
    })

    it('should return add to cache by default', async () => {
       let result = await  geo.getReverse()
       expect(result.fromCache).to.be.false
       result = await  geo.getReverse()
       expect(result.fromCache).to.be.true
       result = await geo2.getReverse()
       expect(result.fromCache).to.be.false
       result = await  geo2.getReverse()
       expect(result.fromCache).to.be.true
    })

    it('should not add in cache if disabled', async () => {
        geo.disableCache()
        let result = await  geo.getReverse()
        expect(result.fromCache).to.be.false
        result = await  geo.getReverse()
        expect(result.fromCache).to.be.false
        geo.enableCache()
    })

    it('should return the response', async () => {
        const result = await geo.getReverse()
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
    })

})
