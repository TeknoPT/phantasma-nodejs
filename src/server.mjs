import express from 'express'
import PhantasmaAPI from './../libs/rpc/phantasma.cjs'
import ScriptBuilder from './../libs/vm/ScriptBuilder.cjs'
import Transaction from './../libs/tx/Transaction.cjs';
import Utils from './../libs/utils/index.cjs';
import UtilsTransaction from '../libs/tx/utils.cjs';

const app = express()
const port = 3000
const phantasmaAPI = new PhantasmaAPI.PhantasmaAPI("http://127.0.0.1:7081/rpc", "http://127.0.0.1:7078/api", false); // Change this address to the chain rpc and api

// Web server
app.get('/', async (req, res) => {
  let params = {"chainInput": "main"};
  let a = await phantasmaAPI.getTransaction("089EF8EE51036E8984C0FF26C7DA074C742B1A39654B7B521AEB52875D8F450C");
  console.log("received", a)
  res.send(a)
})

app.get("/example", async (req, res) => {
  let wif = "L2LGgkZAdupN2ee8Rs6hpkc65zaGcLbxhbSDGq8oh6umUxxzeW25"
  let addr = UtilsTransaction.getAddressFromWif(wif);
  let amountToTransfer = 1000;

  var script = CreateTxScript("SOUL", addr, [
    {"userAddress":"P2KKxTbPSBKMRRL9vw6NYXsNCKTX1ZfoE2bvAuq6VwZSYuy", "value": amountToTransfer * 10 ** GetDecimals("SOUL")}
  ]);

  var sb = new ScriptBuilder.ScriptBuilder();
  var txData = {
    "nexus" : 'simnet', // This is just for test porpuses
    "chain" : 'main', // The chain name
    "script" : script, // Script create for the transaction
    "payload" : Utils.byteArrayToHex(sb.rawString("exchangeSTUFF")) // Hex of the payload
  }

  var hash = await exampleTransaction(txData, wif);
  var result = await getTransactionExample(hash);
  res.send(hash+"<br>"+result);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/**
 * Example Transaction, it will be executed to the chain.
 * @param txData = {
      "nexus" : "main", // nexus
      "chain" : "main", // chain 
      "script" : script, // Script Created with ScriptBuilder.
      "payload" : "trade" // Your payload
    }
 * @param wif => wif 
 * @returns 
 */
async function exampleTransaction(txData, wif){
  
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
  const hash = await phantasmaAPI.sendRawTransaction(value);
  console.log("Returned from sendRawTransaction with res: ", hash);

  return new Promise(resolve => {
    resolve(hash);
  });
}

/**
 * Create a Transaction Script
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

async function getTransactionExample(hash){
  return new Promise(resolve => {
    setTimeout(function(){
      var result = phantasmaAPI.getTransaction(hash);
      resolve(result);
    },5000);
  });
}

function GetDecimals(symbol){
  switch(symbol){
    case "SOUL": return 8;
    case "KCAL": return 10;
  }
}
