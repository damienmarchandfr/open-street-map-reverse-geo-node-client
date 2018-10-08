import { ReverseGeocoder } from ".";

const geo = new ReverseGeocoder('45.777210','3.082520')
geo.getReverse().then((reverse)=>{
    console.log(reverse)
})
.catch(err=>{
    console.error(err)
})

// ---------------- RESPONSE ---------------

const response = { 
    placeId: '91511633',
    displayName: 'Opéra Municipal, Place de Jaude, Bonnabaud, Clermont-Ferrand, Puy-de-Dôme, Auvergne-Rhône-Alpes, France métropolitaine, 63037, France',
    lat: '45.77755365',
    lng: '3.08255435728528',
    address:
    { theatre: 'Opéra Municipal',
       pedestrian: 'Place de Jaude',
       suburb: 'Bonnabaud',
       city: 'Clermont-Ferrand',
       county: 'Clermont-Ferrand',
       state: 'Auvergne-Rhône-Alpes',
       country: 'France',
       postcode: '63037',
       countrycode: 'fr' 
    } 
}