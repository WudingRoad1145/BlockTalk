import { Contract } from "@ethersproject/contracts";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { AbiCoder } from 'ethers/lib/utils';
import { useNetwork, useSwitchNetwork } from 'wagmi'
import { ethers } from 'ethers';
import { switchNetwork } from '@wagmi/core'

// const { chain } = useNetwork()
// const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

const ETH_TESTNET_RPC= "https://endpoints.omniatech.io/v1/eth/goerli/public"
const AVAX_TESTNET_RPC= "https://api.avax-test.network/ext/bc/C/rpc"
const ETH_PRIVATE_KEY= "86a7c560ebc7320724ad9beded8b8bf00ade4d8c4d1770b2d4ed0a696db452f2"
// const AVAX_PRIVATE_KEY= ""
//const RECIPIENT_ADDRESS= 0xA2C72CED30fb9b39201F595f68f72498341689D3
//const AMOUNT= 100
const fromTokenContract = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
const numDecimals = 6;

const tokenMessengerAbi = require('./abis/cctp/TokenMessenger.json');
const messageAbi = require('./abis/cctp/Message.json');
const usdcAbi = require('./abis/Usdc.json');
const messageTransmitterAbi = require('./abis/cctp/MessageTransmitter.json');

const waitForTransaction = async(web3: { eth: { getTransactionReceipt: (arg0: any) => any } }, txHash: any) => {
    let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    while(transactionReceipt != null && transactionReceipt.status === 'FALSE') {
        transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
        await new Promise(r => setTimeout(r, 4000));
    }
    return transactionReceipt;
}

const bridgeToken = async(
    procedure: string,
    signer: any,
    provider: any,
    //RECIPIENT_ADDRESS: string,
    //AMOUNT: BigInteger,
) => { 
    //// const web3 = new Web3(ETH_TESTNET_RPC);
    // web3 lib instance
    //// const web3 = new Web3(window.ethereum);
    // get all accounts// 
    //// const accounts = await web3.eth.getAccounts();
    
    // Procedure is an expression for the custom DSL
    // Example `BRIDGE [number or percentage] [token_name] FROM [chain] TO [chain]`
    // example: `BRIDGE 67.4% USDC FROM Ethereum TO Avalanche`
    // extract variables from procedure
    // const [bridge, value, token, RECIPIENT_ADDRESS, origin_chain, desti_chain] = procedure.split(' ')
    let RECIPIENT_ADDRESS = await signer.getAddress();
    let AMOUNT = 0x100000;
    // // Value may be percentage - parse to get number - everything times 1000000 as USDC has 6 digits
    // if (isNaN(parseFloat(value))){
    //     let totalUSDC;
    //     let queryResult = await alchemy.core.getTokenBalances(signer.address, [fromTokenContract])
    //     totalUSDC = parseInt(queryResult['tokenBalances'][0]['tokenBalance']!);
    //     // let value = (parseInt(balance) / 10 ** numDecimals).toFixed(2);
    //     if (value.includes("%")){
    //         let percentage = parseFloat(value.replace("%",""));
    //         AMOUNT = Math.floor(totalUSDC * percentage) * 10000;
    //     } else if (value.includes("all")){
    //         AMOUNT = Number(value) * 1000000;
    //     } else if (value.includes("half")){
    //         AMOUNT = Math.floor(totalUSDC/2) * 1000000;
    //     }
    // }else{
    //     AMOUNT = Number(value) * 1000000;
    // }

    // Add ETH private key used for signing transactions
    console.log(signer)
    //const ethSigner = web3.eth.accounts.privateKeyToAccount(ETH_PRIVATE_KEY);
    //console.log(ethSigner)
    //web3.eth.accounts.wallet.add(signer);
    
    // const ethSigner = signer;
    //console.log(signer)
    //web3.eth.accounts.wallet.add(ethSigner);


    // Add AVAX private key used for signing transactions
    //const avaxSigner = web3.eth.accounts.privateKeyToAccount("86a7c560ebc7320724ad9beded8b8bf00ade4d8c4d1770b2d4ed0a696db452f2");
    //const avaxSigner = signer;
    //web3.eth.accounts.wallet.add(avaxSigner);

    // Testnet Contract Addresses
    const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8";
    const USDC_ETH_CONTRACT_ADDRESS = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
    const ETH_MESSAGE_CONTRACT_ADDRESS = "0x1a9695e9dbdb443f4b20e3e4ce87c8d963fda34f"
    const AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79';

    // initialize contracts using address and ABI
    const ethTokenMessengerContract = new Contract(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, tokenMessengerAbi, signer);
    const usdcEthContract = new Contract(USDC_ETH_CONTRACT_ADDRESS, usdcAbi, signer);
    const ethMessageContract = new Contract(ETH_MESSAGE_CONTRACT_ADDRESS, messageAbi, signer);
    const avaxMessageTransmitterContract = new Contract(AVAX_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS, messageTransmitterAbi, signer);

    // AVAX destination address
    const mintRecipient = RECIPIENT_ADDRESS;
    console.log("test")
    // const destinationAddressInBytes32 = await ethMessageContract.addressToBytes32(mintRecipient).call();
    const destinationAddressInBytes32 = await ethMessageContract.addressToBytes32(mintRecipient);
    // const destinationAddressInBytes32 =0x000000000000000000000000e8c3beb305b9a05625e347344076d887e60e2403
    //// 0xe8C3bEb305b9a05625e347344076D887e60E2403
    //console.log(destinationAddressInBytes32)
    // const destinationAddressInBytes32 = mintRecipient;
    const AVAX_DESTINATION_DOMAIN = 0x1;

    // Amount that will be transferred
    const amount = AMOUNT;

    // STEP 1: Approve messenger contract to withdraw from our active eth address
    // const approveTxGas = await usdcEthContract.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).estimateGas()
    //const approveTxGas = await usdcEthContract.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount);
    //console.log(approveTxGas);
    const approveTx = await usdcEthContract.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount);
    //// const approveTxReceipt = await waitForTransaction(web3, approveTx.transactionHash);
    let approveTxReceipt = await approveTx.wait();
    //console.log(approveTxReceipt);
    console.log('ApproveTxReceipt: ', approveTxReceipt);

    // STEP 2: Burn USDC
    //const burnTxGas = await ethTokenMessengerContract.depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS);
    console.log("Step 2")
    const burnTx = await ethTokenMessengerContract.depositForBurn(amount, AVAX_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS);
    //// const burnTxReceipt = await waitForTransaction(web3, burnTx.transactionHash);
    let burnTxReceipt = await burnTx.wait();
    console.log(burnTx);
    //// console.log(burnTxReceipt);
    console.log('BurnTxReceipt: ', burnTxReceipt);

    console.log("Step 3")

    // //     // STEP 3: Retrieve message bytes from logs
    // //const web3 = new Web3(window.ethereum);
    // const web3 = new Web3(ETH_TESTNET_RPC);
    // //// const transactionReceipt = await web3.eth.getTransactionReceipt(burnTx.transactionHash);
    // const eventTopic = web3.utils.keccak256('MessageSent(bytes)')
    // //// const log = transactionReceipt.logs.find((l: { topics: any[] }) => l.topics[0] === eventTopic)
    // const log = burnTxReceipt.logs.find((l: { topics: any[] }) => l.topics[0] === eventTopic)
    // const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log.data)[0]
    // console.log(`MessageBytes: ${messageBytes}`)
    // const messageHash = web3.utils.keccak256(messageBytes);
    // console.log(`MessageHash: ${messageHash}`)


    // STEP 3: Retrieve message bytes from log
    let abiCoder = ethers.utils.defaultAbiCoder;
    // console.log(abiCoder)
    // const transactionReceipt = await provider.getTransactionReceipt(burnTxReceipt.transactionHash);
    // //// const eventTopic = web3.utils.keccak256('MessageSent(bytes)')
    // console.log(transactionReceipt)
    const eventTopic = keccak256(toUtf8Bytes('MessageSent(bytes)'));
    // const log = transactionReceipt.logs.find((l: { topics: any[] }) => l.topics[0] === eventTopic);
    const log = burnTxReceipt.logs.find((l: { topics: any[] }) => l.topics[0] === eventTopic);
    console.log(log)
    let data = "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f80000000000000000000000010000000000004da9000000000000000000000000d0c3da58f55358142b8d3e06c1c30c5c6114efe8000000000000000000000000eb08f243e5d3fcff26a9e38ae5520a669f4019d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007865c6e87b9f70255377e024ace6630c1eaa37f000000000000000000000000e8c3beb305b9a05625e347344076d887e60e24030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000e8c3beb305b9a05625e347344076d887e60e24030000000000000000"
    const messageBytes = abiCoder.decode(['bytes'], log.data)[0];
    console.log(messageBytes)
    // const messageHash = keccak256(toUtf8Bytes(messageBytes));
    const messageHash = keccak256(messageBytes);
    // console.log(`MessageBytes: ${messageBytes}`)
    console.log(`MessageHash: ${messageHash}`)
    // const testM = keccak256(messageBytes);
    // console.log(`test ${testM}`);

    console.log("Step 4")
    // STEP 4: Fetch attestation signature
    let attestationResponse = {status: 'pending'};
    while(attestationResponse.status != 'complete') {
        const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
        attestationResponse = await response.json();
        await new Promise(r => setTimeout(r, 2000));
    }

    class attestationR {
        attestation!: string;
        status!: string;

        getAttestation(){
            return this.attestation;
        }
    }

    let newR = Object.assign(new attestationR(), attestationResponse);

    console.log(attestationResponse);
    console.log(newR.attestation);
    console.log(newR.getAttestation());
    
    const attestationSignature = (attestationResponse: { attestation: any }) => attestationResponse.attestation;
    console.log(attestationSignature);
    console.log(typeof(attestationSignature));
    console.log(`Signature: ${attestationSignature}`);

    console.log("Step 5");
    // STEP 5: Using the message bytes and signature recieve the funds on destination chain and address
    //// web3.setProvider(AVAX_TESTNET_RPC); // Connect web3 to AVAX testnet
    //// switchNetwork?.(43113)
    // const network = await switchNetwork({
    //     chainId: 43113,
    //   })
    // console.log(network);
    //const receiveTxGas = await avaxMessageTransmitterContract.methods.receiveMessage(messageBytes, attestationSignature);
    const receiveTx = await avaxMessageTransmitterContract.receiveMessage(messageBytes, newR.attestation);
    //// const receiveTxReceipt = await waitForTransaction(web3, receiveTx.transactionHash);
    let receiveTxReceipt = await receiveTx.wait();
    console.log('ReceiveTxReceipt: ', receiveTxReceipt)
}

export default bridgeToken;