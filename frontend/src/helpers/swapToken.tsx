import { Contract } from "@ethersproject/contracts";
import tokenAddress from "./tokenAddress.json";
import swapTokenJson from "./swapToken.json";
import { getAddress, isNetworkName } from "../addresses/src/addresses.helpers";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";

const SYSTEM_CONTRACT = "0x239e96c8f17C85c30100AC26F635Ea15f23E9c67";
type ZRC20 = "gETH" | "tBNB" | "tBTC" | "tMATIC";
const ZRC20Addresses: Record<ZRC20, string> = {
  gETH: "0x91d18e54DAf4F677cB28167158d6dd21F6aB3921",
  tBNB: "0x13A0c5930C028511Dc02665E7285134B6d11A5f4",
  tBTC: "0x48f80608B672DC30DC7e3dbBd0343c5F02C738Eb",
  tMATIC: "0xd97B1de3619ed2c6BEb3860147E30cA8A7dC9891"
};
const TSS_ATHENS2 = "0x7c125C1d515b8945841b3d5144a060115C58725F";


const swapToken = async (procedure: string, signer: any) => {
  // console.log(procedure);
  // const procedureElements = procedure.split(" ");
  // const fromTokenNumber = procedureElements[1];
  // let amountIn;
  // const fromTokenName = procedureElements[2];
  // const fromTokenAddress =
  //   tokenAddress[fromTokenName as keyof typeof tokenAddress]["contract"];
  // const fromTokenAbi =
  //   tokenAddress[fromTokenName as keyof typeof tokenAddress]["abi"];
  // const fromTokenContract = new Contract(
  //   fromTokenAddress,
  //   fromTokenAbi,
  //   signer
  // );

  const signerAddress = await signer.getAddress();
  // if (isNaN(parseFloat(fromTokenNumber))) {
  //   let totalNumber;
  //   let queryResult = await fromTokenContract.balanceOf(signerAddress);
  //   totalNumber = queryResult.toString();
  //   if (fromTokenNumber.includes("%")) {
  //     let percentage = parseFloat(fromTokenNumber.replace("%", ""));
  //     amountIn = Math.floor((parseFloat(totalNumber) * percentage) / 100);
  //   } else if (fromTokenNumber.includes("all")) {
  //     amountIn = totalNumber;
  //   } else if (fromTokenNumber.includes("half")) {
  //     amountIn = Math.floor(parseFloat(totalNumber) / 2);
  //   }
  // } else {
  //   amountIn = parseFloat(fromTokenNumber);
  // }
  // const toTokenName = procedureElements[4];
  // const toTokenAddress =
  //   tokenAddress[toTokenName as keyof typeof tokenAddress]["contract"];
  // const toChain = procedureElements[6];
  // const path = [fromTokenAddress, toTokenAddress];
  // const amountOutMin = 1;
  // console.log(amountIn);
  const encodeParams = (dataTypes: any[], data: any[]) => {
    const abiCoder = ethers.utils.defaultAbiCoder;
    return abiCoder.encode(dataTypes, data);
  };
  
  const getSwapParams = (destination: string, destinationToken: string, minOutput: BigNumber) => {
    console.log(destinationToken)
    const paddedDestination = ethers.utils.hexlify(ethers.utils.zeroPad(destination, 32));
    const params = encodeParams(["address", "bytes32", "uint256"], [destinationToken, paddedDestination, minOutput]);
  
    return params;
  };

  const getSwapData = (zetaSwap: string, destination: string, destinationToken: string, minOutput: BigNumber) => {
    const params = getSwapParams(destination, destinationToken, minOutput);
    return zetaSwap + params.slice(2);
  };

  const zetaSwap = getAddress({
    address: "zetaSwap",
    networkName: "athens",
    zetaNetwork: "athens"
  });
  const destinationToken = ZRC20Addresses['tMATIC'];
  console.log("Swapping native token...");
  const data = getSwapData(zetaSwap, signerAddress, destinationToken, BigNumber.from("0"));

  const tx = await signer.sendTransaction({
    data,
    to: TSS_ATHENS2,
    value: parseEther("0.001")
  });
  console.log("tx:", tx.hash);



  // const uniswapContract = swapTokenJson["Uniswap"]["contract"];
  // const uniswapAbi = swapTokenJson["Uniswap"]["abi"];

  // // let approvalResult = await fromTokenContract.approve(
  // //   uniswapContract,
  // //   amountIn
  // // );
  // // let receipt = await approvalResult.wait();
  // // console.log(receipt);
  // console.log(path);
  // const routerContract = new Contract(uniswapContract, uniswapAbi, signer);
  // let swapResult = await routerContract.swapExactTokensForTokens(
  //   0.01,
  //   amountOutMin,
  //   path,
  //   signerAddress,
  //   Math.floor(Date.now() / 1000) + 60 * 20
  // );
  // let swapReceipt = await swapResult.wait();
  // console.log(swapReceipt);
};
export default swapToken;
