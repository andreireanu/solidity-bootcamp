import { Injectable } from '@nestjs/common';
import { createPublicClient, createWalletClient,  http, formatEther } from 'viem';
import * as chains from "viem/chains";
import * as tokenJson from './assets/MyToken.json'
import * as process from 'process'; 

@Injectable()
export class AppService {
    publicClient;
    walletClient; 
  
    constructor() {
      this.publicClient = createPublicClient({
        chain: chains. sepolia,  
        transport: http(process.env.RPC_ENDPOINT_URL),
      }); 
    
      this.walletClient = createWalletClient({
        chain: chains. sepolia,  
        transport: http(process.env.RPC_ENDPOINT_URL),
        key: process.env.PRIVATE_KEY, 
      }); 
    }

  getHello(): string {
    return 'Hello World!';
  } 

  getContractAddress(): string {
    return process.env.TOKEN_ADDRESS;
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
   
  async getTokenBalance(address: string) {
    const tokenBalance = (await this.publicClient.readContract({
      address: this.getContractAddress() as `0x{string}`,
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address ]
    })) as bigint; 
    return formatEther(tokenBalance);
  }
  async getTransactionReceipt(hash: string) {
    const transactionReceipt = await this.publicClient.getTransactionReceipt({hash}); 
    transactionReceipt.blockNumber = transactionReceipt.blockNumber.toString();
    transactionReceipt.gasUsed = transactionReceipt.gasUsed.toString();
    transactionReceipt.cumulativeGasUsed = transactionReceipt.cumulativeGasUsed.toString();
    transactionReceipt.effectiveGasPrice = transactionReceipt.effectiveGasPrice.toString();
    return transactionReceipt; 
  } 

  getServerWalletAddress() {
    return this.walletClient.account.address; 

  }
  checkMinterRole(address: string) {
    throw new Error('Method not implemented.');
  }
  mintTokens(address: any) {
    return `Minting tokens to ${address}`; 
  } 

}


