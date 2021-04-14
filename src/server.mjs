import express from 'express'
import PhantasmaAPI from './../libs/rpc/phantasma.cjs'
//import ScriptBuilder from './../libs/vm/ScriptBuilder.cjs'
import ScriptBuilder from './ScriptBuilder.mjs'
import Transaction from './../libs/tx/Transaction.cjs';
import Utils from './../libs/tx/utils.cjs';
import { getAddressFromWif } from '../libs/tx/utils.cjs';

const app = express()
const port = 3000
const phantasmaAPI = new PhantasmaAPI.PhantasmaAPI("http://127.0.0.1:7081/rpc", "http://127.0.0.1:7078/api");

// Web server
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/example", (req, res) => {
  let wif = "L2LGgkZAdupN2ee8Rs6hpkc65zaGcLbxhbSDGq8oh6umUxxzeW25"
  let addr = getAddressFromWif(wif);
  var decimals = 8;

  var script = CreateTxScript("SOUL", addr, [
    {"userAddress":"P2KKxTbPSBKMRRL9vw6NYXsNCKTX1ZfoE2bvAuq6VwZSYuy", "value": 100 * 10 ** decimals}]);
  var txData = {
    "nexus" : "https://localhost:7777",
    "chain" : "main",
    "script" : script,
    "payload" : "trade"
  }

  exampleTransaction(txData, wif);
  
  res.send(".");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Other
/*
TXData Example: 
var txData = {
  "nexus" : "main", // nexus
  "chain" : "main", // chain 
  "script" : script, // Script Created with ScriptBuilder.
  "payload" : "trade" // Your payload
}
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

  const privateKey = Utils.getPrivateKeyFromWif(wif);
  tx1.sign(privateKey);

  const hash = phantasmaAPI.sendRawTransaction(tx1.toString(true));
  console.log("Returned from sendRawTransaction with res: ", hash);

  return hash;
}

/*
destinations = [{
  "userAddress" : "",
  "value" : 1001
}] */
function CreateTxScript(symbol, fromAddress, destinations = [])
{
    const gasFee = 100000;
    var gasLimit = 2100;
    let sb = new ScriptBuilder();

    var scriptB = sb.allowGas(fromAddress, sb.nullAddress(), gasFee, gasLimit);

    // Add Transfer tokens.
    destinations.forEach(entry => {
      var targetAddress = entry.userAddress;
      scriptB.transferTokens(symbol, fromAddress, targetAddress, entry.value);
    });

    var script = scriptB.spendGas(fromAddress).
        endScript();
    console.log(script);
    return script;
}

/*
async signTx(txdata: TxArgsData, wif: string): Promise<string> {
    const account = this.currentAccount;
    if (!account) throw new Error(this.$i18n.t("error.notValid").toString());

    if (!this.isWifValidForAccount(wif))
      throw new Error(this.$i18n.t("error.noAccountMatch").toString());

    const address = account.address;

    const dt = new Date();
    dt.setMinutes(dt.getMinutes() + 5);
    console.log(dt);
    const tx = new Transaction(
      txdata.nexus,
      txdata.chain,
      txdata.script,
      dt,
      txdata.payload
    );

    const privateKey = getPrivateKeyFromWif(wif);

    tx.sign(privateKey);

    const hash = await this.api.sendRawTransaction(tx.toString(true));
    console.log("Returned from sendRawTransaction with res: ", hash);

    return hash;
  }
 */
