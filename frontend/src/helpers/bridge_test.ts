// import { Bridge, Tokens, ChainId, Networks } from "@synapseprotocol/sdk";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "ethers/lib/utils";

const bridgeToken = async(
    procedure: string,
    signer: any,
    provider: any,
    //RECIPIENT_ADDRESS: string,
    //AMOUNT: BigInteger,
) => { 
    // let signer_address = await signer.getAddress();
    // // Use SDK Data about different chains
    // const AVAX_NETWORK = Networks.AVALANCHE;
    // // Initialize dummy Ethers Provider
    // const AVAX_PROVIDER = new JsonRpcProvider(
    //     "https://api.avax.network/ext/bc/C/rpc"
    // );

    // // Initialize Bridge
    // const SYNAPSE_BRIDGE = new Bridge.SynapseBridge({
    //     network:  AVAX_NETWORK
    // });

    // // Switch to Avalanche chain
    // await provider.send("wallet_switchEthereumChain", [
    //     { chainId: "0x" + AVAX_NETWORK.chainId.toString(16) },
    // ]);

    // // Set up some variables to prepare a Avalanche USDC -> ETH USDC quote
    // const
    //     TOKEN_IN   = Tokens.USDC,
    //     TOKEN_OUT  = Tokens.USDC,
    //     CHAIN_OUT  = ChainId.ETH,
    //     INPUT_AMOUNT = parseUnits("1", TOKEN_IN.decimals(AVAX_NETWORK.chainId)!);
    
    // let populatedApproveTxn: ethers.PopulatedTransaction;
    // let estimate;
    // let populatedBridgeTokenTxn: ethers.PopulatedTransaction;
    
    // const tokenApprove = async () => {
    //     try {
    //       // Create a populated transaction for approving token spending
    //       populatedApproveTxn = await SYNAPSE_BRIDGE.buildApproveTransaction({
    //         token: TOKEN_IN,
    //       });
    //     } catch (e) {
    //       // handle error if one occurs
    //     }
    //     // Sign and send the transaction
    //     await signer.sendTransaction(populatedApproveTxn);
    //   };

    //   const tokenBridge = async () => {
    //     // Get a quote for amount to receive from the bridge
    //     estimate = await SYNAPSE_BRIDGE.estimateBridgeTokenOutput({
    //       tokenFrom: TOKEN_IN, // token to send from the source chain, in this case USDT on Avalanche
    //       chainIdTo: CHAIN_OUT, // Chain ID of the destination chain, in this case BSC
    //       tokenTo: TOKEN_OUT, // Token to be received on the destination chain, in this case USDC
    //       amountFrom: INPUT_AMOUNT,
    //     });
    //     try {
    //       // Create a populated transaction for bridging
    //       populatedBridgeTokenTxn =
    //         await SYNAPSE_BRIDGE.buildBridgeTokenTransaction({
    //           tokenFrom: TOKEN_IN, // token to send from the source chain, in this case nUSD on Avalanche
    //           chainIdTo: CHAIN_OUT, // Chain ID of the destination chain, in this case BSC
    //           tokenTo: TOKEN_OUT, // Token to be received on the destination chain, in this case USDC
    //           amountFrom: INPUT_AMOUNT, // Amount of `tokenFrom` being sent
    //           amountTo: estimate.amountToReceive, // minimum desired amount of `tokenTo` to receive on the destination chain
    //           addressTo: signer_address, // the address to receive the tokens on the destination chain
    //         });
    //     } catch (e) {
    //       // handle error if one occurs
    //     }
    //     // Sign and send the transaction
    //     await signer.sendTransaction(populatedBridgeTokenTxn);
    //   };
    //   tokenApprove();
    //   tokenBridge();
    };
export default bridgeToken;


// import { Network, Alchemy } from 'alchemy-sdk';
// // const Web3 = require('web3')
// import { Contract } from "@ethersproject/contracts";
// const settings = {
//     apiKey: "s1CdeTUagB97fGthtIdr-nglsY7WTggy",
//     network: Network.ETH_GOERLI,
// };
// const alchemy = new Alchemy(settings);


// const ETH_TESTNET_RPC= "https://endpoints.omniatech.io/v1/eth/goerli/public"
// const AVAX_TESTNET_RPC= "https://api.avax-test.network/ext/bc/C/rpc"
// const ETH_PRIVATE_KEY= "86a7c560ebc7320724ad9beded8b8bf00ade4d8c4d1770b2d4ed0a696db452f2"
// // const AVAX_PRIVATE_KEY= ""
// //const RECIPIENT_ADDRESS= 0xA2C72CED30fb9b39201F595f68f72498341689D3
// //const AMOUNT= 100
// const fromTokenContract = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
// const numDecimals = 6;

// const tokenMessengerAbi = require('./abis/cctp/TokenMessenger.json');
// const messageAbi = require('./abis/cctp/Message.json');
// const usdcAbi = require('./abis/Usdc.json');
// const messageTransmitterAbi = require('./abis/cctp/MessageTransmitter.json');

// const waitForTransaction = async(web3: { eth: { getTransactionReceipt: (arg0: any) => any } }, txHash: any) => {
//     let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
//     while(transactionReceipt != null && transactionReceipt.status === 'FALSE') {
//         transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
//         await new Promise(r => setTimeout(r, 4000));
//     }
//     return transactionReceipt;
// }

// const bridgeToken = async(
//     procedure: string,
//     signer: any,
//     //RECIPIENT_ADDRESS: string,
//     //AMOUNT: BigInteger,
// ) => { 
//     ////const web3 = new Web3(ETH_TESTNET_RPC);
//     // web3 lib instance
//     const web3 = new Web3(window.ethereum);
//     // get all accounts
//     const accounts = await web3.eth.getAccounts();
    
//     // Procedure is an expression for the custom DSL
//     // Example `BRIDGE [number or percentage] [token_name] FROM [chain] TO [chain]`
//     // example: `BRIDGE 67.4% USDC FROM Ethereum TO Avalanche`
//     // extract variables from procedure
//     const [bridge, value, token, RECIPIENT_ADDRESS, origin_chain, desti_chain] = procedure.split(' ')
//     let AMOUNT = 1000000;
//     // // Value may be percentage - parse to get number - everything times 1000000 as USDC has 6 digits
//     // if (isNaN(parseFloat(value))){
//     //     let totalUSDC;
//     //     let queryResult = await alchemy.core.getTokenBalances(signer.address, [fromTokenContract])
//     //     totalUSDC = parseInt(queryResult['tokenBalances'][0]['tokenBalance']!);
//     //     // let value = (parseInt(balance) / 10 ** numDecimals).toFixed(2);
//     //     if (value.includes("%")){
//     //         let percentage = parseFloat(value.replace("%",""));
//     //         AMOUNT = Math.floor(totalUSDC * percentage) * 10000;
//     //     } else if (value.includes("all")){
//     //         AMOUNT = Number(value) * 1000000;
//     //     } else if (value.includes("half")){
//     //         AMOUNT = Math.floor(totalUSDC/2) * 1000000;
//     //     }
//     // }else{
//     //     AMOUNT = Number(value) * 1000000;
//     // }

//     // Add ETH private key used for signing transactions
//     console.log(signer)
//     //const ethSigner = web3.eth.accounts.privateKeyToAccount(ETH_PRIVATE_KEY);
//     //console.log(ethSigner)
//     //web3.eth.accounts.wallet.add(signer);
    
//     // const ethSigner = signer;
//     //console.log(signer)
//     //web3.eth.accounts.wallet.add(ethSigner);


//     // Add AVAX private key used for signing transactions
//     //const avaxSigner = web3.eth.accounts.privateKeyToAccount("86a7c560ebc7320724ad9beded8b8bf00ade4d8c4d1770b2d4ed0a696db452f2");
//     //const avaxSigner = signer;
//     //web3.eth.accounts.wallet.add(avaxSigner);

//     // Testnet Contract Addresses
//     const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8";
//     const USDC_ETH_CONTRACT_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
//     const ETH_MESSAGE_CONTRACT_ADDRESS = "0x1a9695e9dbdb443f4b20e3e4ce87c8d963fda34f"
//     const AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79';

//     // initialize contracts using address and ABI
//     const ethTokenMessengerContract = web3.eth.contract(tokenMessengerAbi, ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, {from: signer.address});
//     const usdcEthContract = web3.eth.contract(usdcAbi, USDC_ETH_CONTRACT_ADDRESS, {from:signer.address});
//     const ethMessageContract =web3.eth.contract(messageAbi, ETH_MESSAGE_CONTRACT_ADDRESS, {from: signer.address});
//     const avaxMessageTransmitterContract = web3.eth.contract(messageTransmitterAbi, AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS, {from: signer.address});

//     // AVAX destination address
//     const mintRecipient = RECIPIENT_ADDRESS;
//     const destinationAddressInBytes32 = await ethMessageContract.methods.addressToBytes32(mintRecipient).call();
//     const AVAX_DESTINATION_DOMAIN = 1;

//     // Amount that will be transferred
//     const amount = AMOUNT;

//     // STEP 1: Approve messenger contract to withdraw from our active eth address
//     const approveTxGas = await usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).estimateGas()
//     const approveTx = await usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).send({gas: approveTxGas})
//     const approveTxReceipt = await waitForTransaction(web3, approveTx.transactionHash);
//     console.log('ApproveTxReceipt: ', approveTxReceipt)

//     // STEP 2: Burn USDC
//     const burnTxGas = await ethTokenMessengerContract.methods.depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS).estimateGas();
//     const burnTx = await ethTokenMessengerContract.methods.depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS).send({gas: burnTxGas});
//     const burnTxReceipt = await waitForTransaction(web3, burnTx.transactionHash);
//     console.log('BurnTxReceipt: ', burnTxReceipt)

//     // STEP 3: Retrieve message bytes from logs
//     const transactionReceipt = await web3.eth.getTransactionReceipt(burnTx.transactionHash);
//     const eventTopic = web3.utils.keccak256('MessageSent(bytes)')
//     const log = transactionReceipt.logs.find((l: { topics: any[] }) => l.topics[0] === eventTopic)
//     const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log.data)[0]
//     const messageHash = web3.utils.keccak256(messageBytes);

//     console.log(`MessageBytes: ${messageBytes}`)
//     console.log(`MessageHash: ${messageHash}`)

//     // STEP 4: Fetch attestation signature
//     let attestationResponse = {status: 'pending'};
//     while(attestationResponse.status != 'complete') {
//         const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
//         attestationResponse = await response.json()
//         await new Promise(r => setTimeout(r, 2000));
//     }

//     const attestationSignature = (attestationResponse: { attestation: any }) => attestationResponse.attestation;
//     console.log(`Signature: ${attestationSignature}`)

//     // STEP 5: Using the message bytes and signature recieve the funds on destination chain and address
//     web3.setProvider(AVAX_TESTNET_RPC); // Connect web3 to AVAX testnet
//     const receiveTxGas = await avaxMessageTransmitterContract.methods.receiveMessage(messageBytes, attestationSignature).estimateGas();
//     const receiveTx = await avaxMessageTransmitterContract.methods.receiveMessage(messageBytes, attestationSignature).send({gas: receiveTxGas});
//     const receiveTxReceipt = await waitForTransaction(web3, receiveTx.transactionHash);
//     console.log('ReceiveTxReceipt: ', receiveTxReceipt)
// }

// export default bridgeToken;