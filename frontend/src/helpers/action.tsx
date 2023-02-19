import sendToken from "./sendToken";
import swapToken from "./swapToken";
import bridgeToken from "./bridgeToken";

const action = (DSLInput: string[], signer:any, provider:any) => {
  for (let i = 0; i < DSLInput.length; i++) {
    const procedure = DSLInput[i];

    const command = procedure.split(" ")[0];
    if (command == "SEND") {
      sendToken(procedure, signer);
    } else if (command == "SWAP") {
      swapToken(procedure, signer);
    } else if (command == "BRIDGE") {
      bridgeToken(procedure, signer, provider);
    }
  }
};

export default action;
