"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var sinon = require("sinon");
var response_1 = require("./response");
var Error_1 = require("../Error");
var __1 = require("..");
var stub;
var stub2;
var geo = new __1.ReverseGeocoder('0', '0');
var geo2 = new __1.ReverseGeocoder('1', '1');
describe('Test MailBoxLayer class', function () {
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            stub = sinon.stub(geo, 'getRequest').resolves(response_1.validResponse);
            stub2 = sinon.stub(geo2, 'getRequest').resolves(response_1.validResponse);
            return [2 /*return*/];
        });
    }); });
    afterEach(function () {
        stub.restore();
        stub2.restore();
    });
    it('should throw error if lat or lng is not valid', function () { return __awaiter(_this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            error = new Error_1.OpenStreelMapReverseGeoError();
            try {
                new __1.ReverseGeocoder('-200', '0');
            }
            catch (err) {
                error = err;
            }
            chai_1.expect(error.message).to.eql('Latitude is not valid');
            try {
                new __1.ReverseGeocoder('0', '-200');
            }
            catch (err) {
                error = err;
            }
            chai_1.expect(error.message).to.eql('Longitude is not valid');
            try {
                new __1.ReverseGeocoder('-200', '-200');
            }
            catch (err) {
                error = err;
            }
            chai_1.expect(error.message).to.eql('Latitude is not valid');
            return [2 /*return*/];
        });
    }); });
    it('should throw error if api send error', function () { return __awaiter(_this, void 0, void 0, function () {
        var error, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stub.restore();
                    stub = sinon.stub(geo, 'getRequest').resolves(response_1.errorResponse);
                    error = new Error_1.OpenStreelMapReverseGeoError();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, geo.getReverse()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    error = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    chai_1.expect(error.message).to.eql('Nop');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return add to cache by default', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, geo.getReverse()];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.false;
                    return [4 /*yield*/, geo.getReverse()];
                case 2:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.true;
                    return [4 /*yield*/, geo2.getReverse()];
                case 3:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.false;
                    return [4 /*yield*/, geo2.getReverse()];
                case 4:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.true;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not add in cache if disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    geo.disableCache();
                    return [4 /*yield*/, geo.getReverse()];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.false;
                    return [4 /*yield*/, geo.getReverse()];
                case 2:
                    result = _a.sent();
                    chai_1.expect(result.fromCache).to.be.false;
                    geo.enableCache();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return the response', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, geo.getReverse()];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result.displayName).to.eql(response_1.validResponse.display_name);
                    chai_1.expect(result.lat).to.eql(response_1.validResponse.lat);
                    chai_1.expect(result.lng).to.eql(response_1.validResponse.lon);
                    chai_1.expect(result.latInput).to.eql('0');
                    chai_1.expect(result.lngInput).to.eql('0');
                    chai_1.expect(result.placeId).to.eql(response_1.validResponse.place_id);
                    chai_1.expect(response_1.validResponse.address.city).to.eql(result.address.city);
                    chai_1.expect(response_1.validResponse.address.country).to.eql(result.address.country);
                    chai_1.expect(response_1.validResponse.address.country_code).to.eql(result.address.countryCode);
                    chai_1.expect(response_1.validResponse.address.county).to.eql(result.address.county);
                    chai_1.expect(response_1.validResponse.address.pedestrian).to.eql(result.address.pedestrian);
                    chai_1.expect(response_1.validResponse.address.postcode).to.eql(result.address.postcode);
                    chai_1.expect(response_1.validResponse.address.state).to.eql(result.address.state);
                    chai_1.expect(response_1.validResponse.address.suburb).to.eql(result.address.suburb);
                    chai_1.expect(response_1.validResponse.address.theatre).to.eql(result.address.theatre);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.test.js.map