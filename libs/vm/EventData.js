"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var big_integer_1 = __importDefault(require("big-integer"));
var VMType_1 = require("./VMType");
var EventKind;
(function (EventKind) {
    EventKind[EventKind["Unknown"] = 0] = "Unknown";
    EventKind[EventKind["ChainCreate"] = 1] = "ChainCreate";
    EventKind[EventKind["TokenCreate"] = 2] = "TokenCreate";
    EventKind[EventKind["TokenSend"] = 3] = "TokenSend";
    EventKind[EventKind["TokenReceive"] = 4] = "TokenReceive";
    EventKind[EventKind["TokenMint"] = 5] = "TokenMint";
    EventKind[EventKind["TokenBurn"] = 6] = "TokenBurn";
    EventKind[EventKind["TokenStake"] = 7] = "TokenStake";
    EventKind[EventKind["TokenClaim"] = 8] = "TokenClaim";
    EventKind[EventKind["AddressRegister"] = 9] = "AddressRegister";
    EventKind[EventKind["AddressLink"] = 10] = "AddressLink";
    EventKind[EventKind["AddressUnlink"] = 11] = "AddressUnlink";
    EventKind[EventKind["OrganizationCreate"] = 12] = "OrganizationCreate";
    EventKind[EventKind["OrganizationAdd"] = 13] = "OrganizationAdd";
    EventKind[EventKind["OrganizationRemove"] = 14] = "OrganizationRemove";
    EventKind[EventKind["GasEscrow"] = 15] = "GasEscrow";
    EventKind[EventKind["GasPayment"] = 16] = "GasPayment";
    EventKind[EventKind["AddressUnregister"] = 17] = "AddressUnregister";
    EventKind[EventKind["OrderCreated"] = 18] = "OrderCreated";
    EventKind[EventKind["OrderCancelled"] = 19] = "OrderCancelled";
    EventKind[EventKind["OrderFilled"] = 20] = "OrderFilled";
    EventKind[EventKind["OrderClosed"] = 21] = "OrderClosed";
    EventKind[EventKind["FeedCreate"] = 22] = "FeedCreate";
    EventKind[EventKind["FeedUpdate"] = 23] = "FeedUpdate";
    EventKind[EventKind["FileCreate"] = 24] = "FileCreate";
    EventKind[EventKind["FileDelete"] = 25] = "FileDelete";
    EventKind[EventKind["ValidatorPropose"] = 26] = "ValidatorPropose";
    EventKind[EventKind["ValidatorElect"] = 27] = "ValidatorElect";
    EventKind[EventKind["ValidatorRemove"] = 28] = "ValidatorRemove";
    EventKind[EventKind["ValidatorSwitch"] = 29] = "ValidatorSwitch";
    EventKind[EventKind["PackedNFT"] = 30] = "PackedNFT";
    EventKind[EventKind["ValueCreate"] = 31] = "ValueCreate";
    EventKind[EventKind["ValueUpdate"] = 32] = "ValueUpdate";
    EventKind[EventKind["PollCreated"] = 33] = "PollCreated";
    EventKind[EventKind["PollClosed"] = 34] = "PollClosed";
    EventKind[EventKind["PollVote"] = 35] = "PollVote";
    EventKind[EventKind["ChannelCreate"] = 36] = "ChannelCreate";
    EventKind[EventKind["ChannelRefill"] = 37] = "ChannelRefill";
    EventKind[EventKind["ChannelSettle"] = 38] = "ChannelSettle";
    EventKind[EventKind["LeaderboardCreate"] = 39] = "LeaderboardCreate";
    EventKind[EventKind["LeaderboardInsert"] = 40] = "LeaderboardInsert";
    EventKind[EventKind["LeaderboardReset"] = 41] = "LeaderboardReset";
    EventKind[EventKind["PlatformCreate"] = 42] = "PlatformCreate";
    EventKind[EventKind["ChainSwap"] = 43] = "ChainSwap";
    EventKind[EventKind["ContractRegister"] = 44] = "ContractRegister";
    EventKind[EventKind["ContractDeploy"] = 45] = "ContractDeploy";
    EventKind[EventKind["AddressMigration"] = 46] = "AddressMigration";
    EventKind[EventKind["ContractUpgrade"] = 47] = "ContractUpgrade";
    EventKind[EventKind["Log"] = 48] = "Log";
    EventKind[EventKind["Inflation"] = 49] = "Inflation";
    EventKind[EventKind["OrderBid"] = 59] = "OrderBid";
    EventKind[EventKind["Custom"] = 64] = "Custom";
})(EventKind = exports.EventKind || (exports.EventKind = {}));
var TypeAuction;
(function (TypeAuction) {
    TypeAuction[TypeAuction["Fixed"] = 0] = "Fixed";
    TypeAuction[TypeAuction["Classic"] = 1] = "Classic";
    TypeAuction[TypeAuction["Reserve"] = 2] = "Reserve";
    TypeAuction[TypeAuction["Dutch"] = 3] = "Dutch";
})(TypeAuction = exports.TypeAuction || (exports.TypeAuction = {}));
var Decoder = /** @class */ (function () {
    function Decoder(str) {
        this.str = str;
    }
    Decoder.prototype.isEnd = function () {
        return this.str.length == 0;
    };
    Decoder.prototype.readCharPair = function () {
        var res = this.str.substr(0, 2);
        this.str = this.str.slice(2);
        return res;
    };
    Decoder.prototype.readByte = function () {
        return parseInt(this.readCharPair(), 16);
    };
    Decoder.prototype.read = function (numBytes) {
        var res = this.str.substr(0, numBytes * 2);
        this.str = this.str.slice(numBytes * 2);
        return res;
    };
    Decoder.prototype.readString = function () {
        var len = this.readVarInt();
        return this.readStringBytes(len);
    };
    Decoder.prototype.readStringBytes = function (numBytes) {
        var res = "";
        for (var i = 0; i < numBytes; ++i) {
            res += String.fromCharCode(this.readByte());
        }
        return res;
    };
    Decoder.prototype.readVarInt = function () {
        var len = this.readByte();
        var res = 0;
        if (len === 0xfd) {
            __spread(this.read(2).match(/.{1,2}/g)).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        else if (len === 0xfe) {
            __spread(this.read(4).match(/.{1,2}/g)).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        else if (len === 0xff) {
            __spread(this.read(8).match(/.{1,2}/g)).reverse()
                .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
            return res;
        }
        return len;
    };
    Decoder.prototype.readBigInt = function () {
        // TO DO: implement negative numbers
        var len = this.readVarInt();
        var res = 0;
        var stringBytes = this.read(len);
        __spread(stringBytes.match(/.{1,2}/g)).reverse()
            .forEach(function (c) { return (res = res * 256 + parseInt(c, 16)); });
        return res;
    };
    Decoder.prototype.readBigIntAccurate = function () {
        var len = this.readVarInt();
        var res = big_integer_1.default();
        var stringBytes = this.read(len);
        __spread(stringBytes.match(/.{1,2}/g)).reverse().forEach(function (c) {
            res = res.times(256).plus(parseInt(c, 16));
        });
        return res.toString();
    };
    Decoder.prototype.readVmObject = function () {
        var type = this.readByte();
        switch (type) {
            case VMType_1.VMType.String:
                return this.readString();
            case VMType_1.VMType.Number:
                return this.readBigIntAccurate();
            default:
                return "unsupported type " + type;
        }
    };
    return Decoder;
}());
exports.Decoder = Decoder;
function getTokenEventData(str) {
    var dec = new Decoder(str);
    return {
        symbol: dec.readString(),
        value: dec.readBigIntAccurate(),
        chainName: dec.readString(),
    };
}
exports.getTokenEventData = getTokenEventData;
function getChainValueEventData(str) {
    var dec = new Decoder(str);
    return {
        name: dec.readString,
        value: dec.readBigInt(),
    };
}
exports.getChainValueEventData = getChainValueEventData;
function getTransactionSettleEventData(str) {
    var dec = new Decoder(str);
    return {
        hash: dec.read(dec.readByte()),
        platform: dec.readString(),
        chain: dec.readString(),
    };
    // public readonly Hash Hash;
}
exports.getTransactionSettleEventData = getTransactionSettleEventData;
function getGasEventData(str) {
    var dec = new Decoder(str);
    return {
        address: dec.read(dec.readByte()),
        price: dec.readBigInt(),
        amount: dec.readBigInt(),
    };
}
exports.getGasEventData = getGasEventData;
function getMarketEventData(str) {
    var dec = new Decoder(str);
    return {
        baseSymbol: dec.readString(),
        quoteSymbol: dec.readString(),
        id: dec.readBigIntAccurate(),
        amount: dec.readBigInt(),
        endAmount: dec.isEnd() ? 0 : dec.readBigInt()
    };
}
exports.getMarketEventData = getMarketEventData;
function getInfusionEventData(str) {
    var dec = new Decoder(str);
    return {
        baseSymbol: dec.readString(),
        TokenID: dec.readBigIntAccurate(),
        InfusedSymbol: dec.readString(),
        InfusedValue: dec.readBigIntAccurate(),
        ChainName: dec.readString(),
    };
}
exports.getInfusionEventData = getInfusionEventData;
function getString(str) {
    return new Decoder(str).readString();
}
exports.getString = getString;
//# sourceMappingURL=EventData.js.map