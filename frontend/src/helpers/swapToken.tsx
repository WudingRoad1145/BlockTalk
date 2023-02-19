import { Contract } from "@ethersproject/contracts";
import tokenAddress from "./tokenAddress.json";
import swapTokenJson from "./swapToken.json";

const swapToken = async (procedure: string, signer: any) => {
  console.log(procedure);
  const procedureElements = procedure.split(" ");
  const fromTokenNumber = procedureElements[1];
  let amountIn;
  const fromTokenName = procedureElements[2];
  const fromTokenAddress =
    tokenAddress[fromTokenName as keyof typeof tokenAddress]["contract"];
  const fromTokenAbi =
    tokenAddress[fromTokenName as keyof typeof tokenAddress]["abi"];
  const fromTokenContract = new Contract(
    fromTokenAddress,
    fromTokenAbi,
    signer
  );
  const signerAddress = await signer.getAddress();
  if (isNaN(parseFloat(fromTokenNumber))) {
    let totalNumber;
    let queryResult = await fromTokenContract.balanceOf(signerAddress);
    totalNumber = queryResult.toString();
    if (fromTokenNumber.includes("%")) {
      let percentage = parseFloat(fromTokenNumber.replace("%", ""));
      amountIn = Math.floor((parseFloat(totalNumber) * percentage) / 100);
    } else if (fromTokenNumber.includes("all")) {
      amountIn = totalNumber;
    } else if (fromTokenNumber.includes("half")) {
      amountIn = Math.floor(parseFloat(totalNumber) / 2);
    }
  } else {
    amountIn = parseFloat(fromTokenNumber);
  }
  const toTokenName = procedureElements[4];
  const toTokenAddress =
    tokenAddress[toTokenName as keyof typeof tokenAddress]["contract"];
  const toChain = procedureElements[6];
  const path = [fromTokenAddress, toTokenAddress];
  const amountOutMin = 1;
  console.log(amountIn);

  const uniswapContract = swapTokenJson["Uniswap"]["contract"];
  const uniswapAbi = swapTokenJson["Uniswap"]["abi"];
  
  // let approvalResult = await fromTokenContract.approve(
  //   uniswapContract,
  //   amountIn
  // );
  // let receipt = await approvalResult.wait();
  // console.log(receipt);
  console.log(path);
  const routerContract = new Contract(uniswapContract, uniswapAbi, signer);
  let swapResult = await routerContract.swapExactTokensForTokens(
    0.01,
    amountOutMin,
    path,
    signerAddress,
    Math.floor(Date.now() / 1000) + 60 * 20
  );
  let swapReceipt = await swapResult.wait();
  console.log(swapReceipt);
};
export default swapToken;
