import sendToken from "./sendToken";
import swapToken from "./swapToken";
import bridgeToken from "./bridgeToken";

const action = (DSLInput: string[], signer:any, provider:any, switchNetwork:any) => {
  for (let i = 0; i < DSLInput.length; i++) {
    const procedure = DSLInput[i];

    const command = procedure.split(" ")[0];
    if (command == "SEND") {
      sendToken(procedure, signer[0]);
    } else if (command == "SWAP") {
      swapToken(procedure, signer[0]);
    } else if (command == "BRIDGE") {
      bridgeToken(procedure, signer, provider, switchNetwork);
    }
  }
};

export default action;
