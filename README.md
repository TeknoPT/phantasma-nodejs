# phantasma-nodejs
PhantasmaNodeJS

# How to install
- npm install

# How to run
- After installing all the dependencies run `npm start`

# How to configure
- Inside the folder src, the `server.mjs` has all the methods that you need to create call to the blockchain.

# Important things
- There are 5 major imports you need to have to make it work.
```
import PhantasmaAPI from './../libs/rpc/phantasma.cjs'
import ScriptBuilder from './../libs/vm/ScriptBuilder.cjs'
import Transaction from './../libs/tx/Transaction.cjs';
import Utils from './../libs/utils/index.cjs';
import UtilsTransaction from '../libs/tx/utils.cjs';
``` 
- In this classes you have all the things you need to encrypt, make a transaction, get private keys and address so you can make them.
- Get an address from wif example: ```let addr = UtilsTransaction.getAddressFromWif(wif);```
- The code needs to have an PhantasmaAPI instance so you can send a Transaction, get a transaction and do other things with it.
- For the RPC version use this:
```
const phantasmaAPI = new PhantasmaAPI.PhantasmaAPI("http://127.0.0.1:7081/rpc", "http://127.0.0.1:7078/api"); // Change this address to the chain rpc and api
```
- For the REST version add 3rd `false` so you set to RPC mode to false:
```
const phantasmaAPI = new PhantasmaAPI.PhantasmaAPI("http://127.0.0.1:7081/rpc", "http://127.0.0.1:7078/api", false); // Change this address to the chain rpc and api
```
- TxData is an array of object that is used to create a transaction, example:
```
txData = {
    "nexus" : "mainnet", // nexus
    "chain" : "main", // chain 
    "script" : script, // Script Created with ScriptBuilder 
    "payload" : Utils.byteArrayToHex(sb.rawString("trade")) // Your payload needs to be in hex instead of string
}
```

# Any further questions
- Contact Phantasma Force Team