
![logo](https://image.ibb.co/n0gFJp/Sans_titre.png)

  

# Open Street Map Reverse GeoCoding

A **free** reverse geocoding service.

This library can be used to get location information from latitude and longitude for free. To get faster results, it is possible to enable the cache feature to store 1st-request. This allows to reduce the number of API calls. It uses the OSM funcdation API: https://wiki.osmfoundation.org/wiki/Main_Page

**It's a free service. You must use this service with moderation.**

 ## Installation

    yarn add open-street-map-reverse-geo-node-client

or

    npm install open-street-map-reverse-geo-node-client --save

## Stop Callbacks! Use Promises

This library does not use callback. Use promise instead.

## Use lib
(see examples in /example.ts file)

    import { ReverseGeocoder } from  '.';
    
    const  geo  =  new  ReverseGeocoder('45.777210', '3.082520')
    const result = await geo.getReverse()

The response

    {
	    placeId:  '91511633',
	    displayName:  'Opéra Municipal, Place de Jaude, Bonnabaud, Clermont-Ferrand, Puy-de-Dôme Auvergne-Rhône - Alpes, France métropolitaine, 63037, France',
	    lat:  '45.77755365',
	    lng:  '3.08255435728528',
	    address:
	    { 
		    theatre:  'Opéra Municipal',
		    pedestrian:  'Place de Jaude',
		    suburb:  'Bonnabaud',
		    city:  'Clermont-Ferrand',
		    county:  'Clermont-Ferrand',
		    state:  'Auvergne-Rhône-Alpes',
		    country:  'France',
		    postcode:  '63037',
		    countryCode:  'fr'
	    },
	    fromCache :  true
    }

## Enble cache
Cache is enabled by default.
To disable this options :

    geo.disableCache()

## Run example

    yarn run example

or

    npm run example

## Run tests

    yarn run test

or

    npm run test