import { Injectable } from '@nestjs/common';
import { createPublicClient, http, formatEther } from 'viem';
import * as chains from "viem/chains";
import * as tokenJson from '../assets/MyToken.json'
 
@Injectable()
export class AppService {
    publicClient;
  
    constructor() {
      this.publicClient = createPublicClient({
        chain: chains.sepolia,  
        transport: http(process.env.RPC_ENDPOINT_URL),
      }); 
    }

  getHello(): string {
    return 'Hello World!';
  } 

  getContractAddress(): string {
    return "0x020615D5F5C4A12ac04EFB19c558f767cD1Bba94";
  }  
 
  async getTokenName(): Promise<any> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x{string}`,
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name;
  }

  async getTotalSupply() {
    const totalSupply = (await this.publicClient.readContract({
      address: this.getContractAddress() as `0x{string}`,
      abi: tokenJson.abi,
      functionName: "totalSupply"
    })) as bigint;
    return formatEther(totalSupply);
  }
  getTokenBalance(address: string) {
    throw new Error('Method not implemented.');
  }
  getTransactionReceipt(hash: string) {
    throw new Error('Method not implemented.');
  } 

}


