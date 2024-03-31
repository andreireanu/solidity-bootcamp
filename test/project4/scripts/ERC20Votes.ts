import {viem} from "hardhat";
import { parseEther, formatEther  } from "viem";
 
const MINT_VALUE = parseEther("100");

async function main() {

    // INITIALIZE CLIENT
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2, acc3] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");    
    console.log(`Token contract deployed at ${contract.address}\n`);

    // MINT TOKENS FOR ACCOUNT 1
    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
      `Minted ${formatEther(MINT_VALUE)} units to account ${
        acc1.account.address
      }\n`
    );

    // DISPLAY BALANCES OF ACCOUNT 1
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
      `Account ${
        acc1.account.address
      } has ${formatEther(balanceBN)} units of MyToken\n`
    );

    // DISPLAY VOTING POWER OF ACCOUNT 1 BEFORE SELF DELEGATE
    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(
      `Account ${
        acc1.account.address
      } has ${formatEther(votes)} units of voting power before self delegating\n`
    );

    // DELEGATE ACCOUNT 1
    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account, 
      });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    
    // DISPLAY VOTING POWER OF ACCOUNT 1 AFTER SELF DELEGATE
    const votesAfter = await contract.read.getVotes([acc1.account.address]);
    console.log(
        `Account ${
        acc1.account.address
        } has ${formatEther(votesAfter)} units of voting power after self delegating\n`
    ); 

    // TRANSFER TOKENS TO ACCOUNT 2
    const transferTx = await contract.write.transfer(
        [acc2.account.address,  MINT_VALUE / 3n],
        {
          account: acc1.account,
        }
      );
      await publicClient.waitForTransactionReceipt({ hash: transferTx });
      const votes1AfterTransfer = await contract.read.getVotes([
        acc1.account.address,
      ]);

    // DISPLAY VOTING POWER OF ACCOUNT 1 AFTER TRANSFER TOKENS TO ACCOUNT 2
      console.log(
        `Account ${ 
          acc1.account.address
        } has ${formatEther(votes1AfterTransfer)} units of voting power after transferring\n`
      );

    // DISPLAY VOTING POWER OF ACCOUNT 2 BEFORE SELF DELEGATE
      const votes2AfterTransfer = await contract.read.getVotes([
        acc2.account.address,
      ]);
      console.log(
        `Account ${
          acc2.account.address
        } has ${formatEther(votes2AfterTransfer)} units of voting power after receiving a transfer\n`
      );

    // DELEGATE ACCOUNT 2
    const delegateTx2 = await contract.write.delegate([acc2.account.address], {
      account: acc2.account, 
    });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx2 });
    
    // DISPLAY VOTING POWER OF ACCOUNT 2 AFTER SELF DELEGATE
    const votesAfterAcc2 = await contract.read.getVotes([acc2.account.address]);
    console.log(
        `Account ${
        acc2.account.address
        } has ${formatEther(votesAfterAcc2)} units of voting power after self delegating\n`
    ); 

    // CHECK PAST VOTES
    const lastBlockNumber = await publicClient.getBlockNumber();
    for (let index = lastBlockNumber - 1n; index > 0n; index--) {
      const pastVotes = await contract.read.getPastVotes([
        acc1.account.address,
        index,
      ]);
      console.log(
        `Account ${
          acc1.account.address
        } had ${pastVotes.toString()} units of voting power at block ${index}\n`
      );
    }

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });