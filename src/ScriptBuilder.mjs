export default class ScriptBuilder {

	Opcode_NOP() { return 0; }
	// register
	Opcode_MOVE() { return 1; }
	Opcode_COPY() { return 2; }
	Opcode_PUSH() { return 3; }
	Opcode_POP() { return 4; }
	Opcode_SWAP() { return 5; }
        // flow
	Opcode_CALL() { return 6; }
	Opcode_EXTCALL() { return 7; }
	Opcode_JMP() { return 8; }
	Opcode_JMPIF() { return 9; }
	Opcode_JMPNOT() { return 10; }
	Opcode_RET() { return 11; }
	Opcode_THROW() { return 12; }
        // data
	Opcode_LOAD() { return 13; }
	Opcode_CAST() { return 14; }
	Opcode_CAT() { return 15; }
	Opcode_SUBSTR() { return 16; }
	Opcode_LEFT() { return 17; }
	Opcode_RIGHT() { return 18; }
	Opcode_SIZE() { return 19; }
	Opcode_COUNT() { return 20; }
	Opcode_NOT() { return 21; }
        // logical
	Opcode_AND() { return 22; }
	Opcode_OR() { return 23; }
	Opcode_XOR() { return 24; }
	Opcode_EQUAL() { return 25; }
	Opcode_LT() { return 26; }
	Opcode_GT() { return 27; }
	Opcode_LTE() { return 28; }
	Opcode_GTE() { return 29; }
	// numeric
	Opcode_INC() { return 30; }
	Opcode_DEC() { return 31; }
	Opcode_SIGN() { return 32; }
	Opcode_NEGATE() { return 33; }
	Opcode_ABS() { return 34; }
	Opcode_ADD() { return 35; }
	Opcode_SUB() { return 36; }
	Opcode_MUL() { return 37; }
	Opcode_DIV() { return 38; }
	Opcode_MOD() { return 39; }
	Opcode_SHL() { return 40; }
	Opcode_SHR() { return 41; }
	Opcode_MIN() { return 42; }
	Opcode_MAX() { return 43; }

        // context
	Opcode_THIS() { return 44; }
	Opcode_CTX() { return 45; }
	Opcode_SWITCH() { return 46; }

	// array
	Opcode_PUT() { return 47; }
	Opcode_GET() { return 48; }

    VMType_None() { return 0; }
	VMType_Struct() { return 1; }
	VMType_Bytes() { return 2; }
	VMType_Number() { return 3; }
	VMType_String() { return 4; }
	VMType_Timestamp() { return 5; }
	VMType_Bool() { return 6; }
	VMType_Enum() { return 7; }
	VMType_Object() { return 8; }

	constructor() {
		this.script = "";
		this.clearOptimizations();
	}

	// just quick dirty method to convert number to hex wih 2 digits, rewrite this later if there's a cleaner way
	raw(value) {
		let result = value.toString(16);
		if (result.length == 1) {
			result = '0' + result;
		}
		return result;
	}

	rawString(value) {
		var data = [];
		for (var i = 0; i < value.length; i++){
			data.push(value.charCodeAt(i));
		}
		return data;
	}

	// appends a single byte to the script stream
	appendByte(value) {
		this.script = this.script + this.raw(value);
	}

	appendBytes(values) {
		for (let i=0; i<values.length; i++) {
			this.appendByte(values[i]);
		}
	}

	appendVarInt(value) {
		if (value < 0)
			throw "negative value invalid";

		if (value < 0xFD)
		{
			this.appendByte(value);
		}
		else if (value <= 0xFFFF)
		{
			let B = (value & 0x0000ff00) >> 8;
			let A = (value & 0x000000ff);

			// TODO check if the endianess is correct, might have to reverse order of appends
			this.appendByte(0xFD);
			this.appendByte(A);
			this.appendByte(B);
		}
		else if (value <= 0xFFFFFFFF)
		{
			let C = (value & 0x00ff0000) >> 16;
			let B = (value & 0x0000ff00) >> 8;
			let A = (value & 0x000000ff);

			// TODO check if the endianess is correct, might have to reverse order of appends
			this.appendByte(0xFE);
			this.appendByte(A);
			this.appendByte(B);
			this.appendByte(C);
		}
		else
		{
			let D = (value & 0xff000000) >> 24;
			let C = (value & 0x00ff0000) >> 16;
			let B = (value & 0x0000ff00) >> 8;
			let A = (value & 0x000000ff);

			// TODO check if the endianess is correct, might have to reverse order of appends
			this.appendByte(0xFF);
			this.appendByte(A);
			this.appendByte(B);
			this.appendByte(C);
			this.appendByte(D);
		}
	}

	appendMethodArgs(args){
		let temp_reg = 0;

		for (let i = args.length - 1; i >= 0; i--)
		{
			let arg = args[i];
			// NOTE the C# version does call LoadIntoReg (which internally calls emitLoad). TODO Confirm if the logic is okay
			this.emitLoad(temp_reg, arg);
			this.emitPush(temp_reg);
		}
	}

	emitOpcode(opcode) {
		this.appendByte(opcode);
		return this;
	}

	emitPush(reg)
	{
		this.emitOpcode(this.Opcode_PUSH());
		this.appendByte(reg);
		return this;
	}

	emitPop(reg)
	{
		this.emitOpcode(this.Opcode_POP());
		this.appendByte(reg);
		return this;
	}

	emitLoad(reg, obj)
	{
		if (typeof obj === 'string')
		{
			let bytes = this.rawString(obj);
			this.emitLoadEx(reg, bytes, this.VMType_String());
		}
		else
		if (obj instanceof Date)
		{
			// https://stackoverflow.com/questions/9756120/how-do-i-get-a-utc-timestamp-in-javascript
			let num = (obj.getTime() + obj.getTimezoneOffset()*60*1000)/1000;

			let a = (num & 0xff000000) >> 24;
			let b = (num & 0x00ff0000) >> 16;
			let c = (num & 0x0000ff00) >> 8;
			let d = (num & 0x000000ff);

			let bytes = [d, c, b, a];
			this.emitLoadEx(reg, bytes, this.VMType_Timestamp());
		}
		else
		if (typeof obj === 'boolean')
		{
			let bytes = [];
			if (obj) {
				bytes.push(1);
			}
			else {
				bytes.push(0);
			}
			this.emitLoadEx(reg, bytes, this.VMType_Bool());
		}
		else
		if (typeof obj === 'number')
		{
			let bytes = this.rawString(obj.toString());
			this.emitLoadEx(reg, bytes, this.VMType_String());
		}
		else
		{
			throw "unsupported or uniplemented type";
		}

		return this;
	}

	// bytes is byte array
	emitLoadEx(reg, bytes, vmtype)
	{
		if (!Array.isArray(bytes)) {
			throw "byte array expected";
		}

		if (bytes.length > 0xFFFF) {
			throw "tried to load too much data";
		}

		this.emitOpcode(this.Opcode_LOAD());
		this.appendByte(reg);
		this.appendByte(vmtype);

		this.appendVarInt(bytes.length);
		this.appendBytes(bytes);
		return this;
	}

	emitMethod(method, args) {
		this.appendMethodArgs(args);

		let temp_reg = 2;

		// NOTE this optimization assumes that reg 2 contains a valid method name due to this method being called multiple times
		if (this.lastMethod != method)
		{
			this.lastMethod = method;
			this.lastContract = null;
			this.emitLoad(temp_reg, method);
		}

		return temp_reg;
	}
	allowGas(from_addr, dapp_addr, gasPrice = 100000, gasLimit = 9999) {
        if (!dapp_addr) {
            dapp_addr = this.nullAddress();
        }
        return this.callContract("gas", "AllowGas", [from_addr, dapp_addr, gasPrice, gasLimit]);
    }
    spendGas(from_addr) {
        return this.callContract("gas", "SpendGas", [from_addr]);
    }
	callInterop(method, args) {
		let temp_reg = this.emitMethod(method, args);
		this.emitOpcode(this.Opcode_EXTCALL());
		this.appendByte(temp_reg);
		return this;
	}

	callContract(contractName, method, args) {
		let temp_reg = this.emitMethod(method, args);
		this.emitPush(temp_reg);

		let src_reg = 0;
		let dest_reg = 1;

		// NOTE this optimization assumes that reg 1 contains a valid context for this contract due to this method being called multiple times
		if (this.lastContract != contractName)
		{
			this.lastContract = contractName;
			this.lastMethod = null;
			this.emitLoad(src_reg, contractName);
			this.emitOpcode(this.Opcode_CTX());
			this.appendByte(src_reg);
			this.appendByte(dest_reg);
		}

		this.emitOpcode(this.Opcode_SWITCH());
		this.appendByte(dest_reg);

		return this;
	}

	transferTokens(symbol, fromAddress, targetAddress, amount){
		return this.callInterop("Runtime.TransferTokens", [
			symbol, 
			fromAddress, 
			targetAddress, 
			amount])
	}

	endScript() {
		this.emitOpcode(this.Opcode_RET());
		return this.script;
	}

	clearOptimizations() {
		this.lastContract = "";
		this.lastMethod = "";
	}

	nullAddress() {
		return 'S1111111111111111111111111111111111';
	}
}