"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const geo = new index_1.ReverseGeocoder();
geo.getReverse('48.8566', '2.3522').then((result) => {
    console.log(result);
});
