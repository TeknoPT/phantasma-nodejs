"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wif_1 = __importDefault(require("wif"));
var elliptic_1 = require("elliptic");
var bs58_1 = __importDefault(require("bs58"));
var curve = new elliptic_1.eddsa("ed25519");
function ab2hexstring(arr) {
    var e_1, _a;
    if (typeof arr !== "object") {
        throw new Error("ab2hexstring expects an array.Input was " + arr);
    }
    var result = "";
    var intArray = new Uint8Array(arr);
    try {
        for (var intArray_1 = __values(intArray), intArray_1_1 = intArray_1.next(); !intArray_1_1.done; intArray_1_1 = intArray_1.next()) {
            var i = intArray_1_1.value;
            var str = i.toString(16);
            str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
            result += str;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (intArray_1_1 && !intArray_1_1.done && (_a = intArray_1.return)) _a.call(intArray_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
function getPrivateKeyFromWif(wif) {
    return ab2hexstring(wif_1.default.decode(wif, 128).privateKey);
}
exports.getPrivateKeyFromWif = getPrivateKeyFromWif;
function getAddressFromWif(wif) {
    var curve = new elliptic_1.eddsa("ed25519");
    var privateKey = getPrivateKeyFromWif(wif);
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var publicKey = curve.keyFromSecret(privateKeyBuffer).getPublic("hex");
    var addressHex = Buffer.from("0100" + publicKey, "hex");
    return "P" + bs58_1.default.encode(addressHex);
}
exports.getAddressFromWif = getAddressFromWif;
function signData(msgHex, privateKey) {
    var msgHashHex = Buffer.from(msgHex, "hex");
    var privateKeyBuffer = Buffer.from(privateKey, "hex");
    var sig = curve.sign(msgHashHex, privateKeyBuffer);
    var numBytes = sig.toBytes().length;
    return ("01" + (numBytes < 16 ? "0" : "") + numBytes.toString(16) + sig.toHex());
}
exports.signData = signData;
//# sourceMappingURL=utils.js.map