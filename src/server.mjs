import express from 'express'
import PhantasmaAPI from './../libs/rpc/phantasma.cjs'
import ScriptBuilder from './../libs/vm/ScriptBuilder.cjs'
import Transaction from './../libs/tx/Transaction.cjs';
import Utils from './../libs/utils/index.cjs';
import UtilsTransaction from '../libs/tx/utils.cjs';

const app = express()
const port = 3000
const phantasmaAPI = new PhantasmaAPI.PhantasmaAPI("http://127.0.0.1:7081/rpc", "http://127.0.0.1:7078/api");

// Web server
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/example", (req, res) => {
  let wif = "L2LGgkZAdupN2ee8Rs6hpkc65zaGcLbxhbSDGq8oh6umUxxzeW25"
  let addr = UtilsTransaction.getAddressFromWif(wif);
  var decimals = 8;

  var script = CreateTxScript("SOUL", addr, [
    {"userAddress":"P2KKxTbPSBKMRRL9vw6NYXsNCKTX1ZfoE2bvAuq6VwZSYuy", "value": 1000 * 10 ** decimals}]);

  var sb = new ScriptBuilder.ScriptBuilder();
  var txData = {
    "nexus" : 'simnet',
    "chain" : 'main',
    "script" : script,
    "payload" : Utils.byteArrayToHex(sb.rawString("exchangeSTUFF"))
  }

  var hash = exampleTransaction(txData, wif);
  //var result = getTransactionExample(hash);
  var result = "b"
  res.send(hash+"<br>"+result);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/**
 * 
 * @param txData = {
      "nexus" : "main", // nexus
      "chain" : "main", // chain 
      "script" : script, // Script Created with ScriptBuilder.
      "payload" : "trade" // Your payload
    }
 * @param wif => wif 
 * @returns 
 */
function exampleTransaction(txData, wif){
  
  const dt = new Date();
  dt.setMinutes(dt.getMinutes() + 5);
  console.log(dt);

  const tx1 = new Transaction.Transaction(
    txData.nexus,
    txData.chain,
    txData.script,
    dt,
    txData.payload
  );

  const privateKey = UtilsTransaction.getPrivateKeyFromWif(wif);
  tx1.sign(privateKey);

  let value = tx1.toString(true);
  console.log(value);
  const hash = phantasmaAPI.sendRawTransaction(value);
  console.log("Returned from sendRawTransaction with res: ", hash);

  return hash;
}

/**
 * 
 * @param symbol 
 * @param fromAddress => Address Sending
 * @param destinations => Destinations Array
 * [{"userAddress" : "address", "value": 100000000}]
 * @returns 
 */
function CreateTxScript(symbol, fromAddress, destinations = [])
{
    const gasFee = 100000;
    const gasLimit = 2100;
    let sb = new ScriptBuilder.ScriptBuilder();

    var scriptB = sb.allowGas(fromAddress, sb.nullAddress, gasFee, gasLimit);

    // Add Transfer tokens.
    destinations.forEach(entry => {
      var targetAddress = entry.userAddress;
      scriptB.transferTokens(symbol, fromAddress, targetAddress, entry.value);
    });

    var script = scriptB.spendGas(fromAddress).
        endScript();

    return script;
}

function getTransactionExample(hash){
  var result = phantasmaAPI.getTransaction(hash);
  return result;
}
