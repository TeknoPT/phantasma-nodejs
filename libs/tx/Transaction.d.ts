export declare class Transaction {
    nexusName: string;
    chainName: string;
    script: string;
    expiration: Date;
    payload: string;
    signatures: Array<string>;
    constructor(nexusName: string, chainName: string, script: string, expiration: Date, payload: string);
    sign(privateKey: string): void;
    toString(withSignature: boolean, signatureType?: number): string;
    private getSign;
}
