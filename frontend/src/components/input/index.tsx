import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { FormControl, Grid, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

import { useProvider, useSigner, useSwitchNetwork } from "wagmi";
import action from "helpers/action";
import bridgeToken from "helpers/bridgeToken";

export interface InputProps extends React.HTMLAttributes<HTMLDivElement> { }

const Input = ({ className, ...props }: InputProps) => {
  const [value, setValue] = useState("");
  const [chatGPTOutput, setChatGPTOutput] = useState<string[]>([]);
  const { data: signer } = useSigner();
  const { data: signer2} = useSigner(
    { chainId: 43113}
  )
  const provider = useProvider();
  const [history, setHistory] = useState<string[]>([]);
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const sendToChatGPT = async (value: string) => {
    if (value.length !== 0) setHistory([...history, value]);
    console.log("sent to chatGPT in");
    const connect = await fetch("http://127.0.0.1:5000/chatgpt", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });
    const data = await connect.json();
    const dataProcedure = data.output.split("\n");
    let chatGPTOutput = [];
    for (let i = 0; i < dataProcedure.length; i++) {
      chatGPTOutput.push(dataProcedure[i]);
        //.substring(3, dataProcedure[i].length - 1));
    }
    setChatGPTOutput(chatGPTOutput);
    console.log(chatGPTOutput);
    // let chatGPTOutput = ["BRIDGE 1 USDC TO DAI on ETH"];
    // bridgeToken(chatGPTOutput[0], [signer, signer2], provider, switchNetwork);
    action(chatGPTOutput, [signer, signer2], provider, switchNetwork);
  };

  return (
    <Grid alignItems="center">
      <div className={classNames(styles.navbar, className)} {...props}>
        <FormControl fullWidth sx={{ backgroundColor: "#1111111" }} variant="outlined">
          <InputLabel className="test-label" htmlFor="outlined-adornment-amount">Command</InputLabel>
          <OutlinedInput className="test-label"
            id="outlined-adornment-amount"
            style={{ backgroundColor: "" }}
            startAdornment={<InputAdornment position="start">/</InputAdornment>}
            label="What do you want to do?"
            value={value}
            onChange={(event) => setValue(event.target.value)} />

          <Button
            sx={{ m: 2 }}
            style={{
              backgroundColor: "#9ACD32",
              fontSize: "18px"
            }}
            size="medium"
            variant="contained"
            onClick={() => sendToChatGPT(value)}
          >
            Submit
          </Button>

          { history.length ?
          <div>
            <h4>Command History:</h4>
            <div className={styles.his}>
              {history.map((item) => (
                <div>{item}</div>
              ))}
            </div>
          </div> : null }
        </FormControl>
      </div>
    </Grid>
  );
};

export default Input;
