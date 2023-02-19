import { Contract } from "@ethersproject/contracts";
import { ContractMethodNoResultError } from "wagmi";
import tokenAddress from "./tokenAddress.json";

const SendToken = async (procedure: string, signer: any) => {
  // Procedure is an expression for the custom DSL
  // Example `SEND [number or percentage] [token_name] TO [wallet_address] ON [chain]`
  // example: `SEND 122.3 USDC TO 0xD00BA44b6d6e6f37DCdA75df508057b76b533842 on Ethereum`
  // extract variables from procedure
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
  const toAddress = procedureElements[4];
  const toChain = procedureElements[6];
  // Send token
  let sendResult = await fromTokenContract.transfer(toAddress, amountIn, {
    gasLimit: 100000
  });
  let receipt = await sendResult.wait();
  console.log(receipt);
};
export default SendToken;
