import { ReverseGeocoder } from './src/index';

const geo = new ReverseGeocoder();
geo.getReverse('48.8566', '2.3522').then((result)=>{
    console.log(result);
})
