import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import styles from "./index.module.scss";
import { FormControl, Grid, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import classNames from "classnames";
import Button from "@mui/material/Button";
import { useProvider, useSigner } from "wagmi";
// import sendToken from "helpers/sendToken";
// import swapToken from "helpers/swapToken";
// import bridgeToken from "helpers/bridgeToken";
// import action from "helpers/action";

export interface InputProps extends React.HTMLAttributes<HTMLDivElement> {}

const Input = ({ className, ...props }: InputProps) => {
  const [value, setValue] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const { data: signer } = useSigner();
  const provider = useProvider();
//   useEffect(() => {
//     // Using fetch to fetch the api from
//     // flask server it will be redirected to proxy
//     fetch("http://127.0.0.1:5000/data").then((res) =>
//       res.json().then((data) => {
//         // Setting a data from api
//         console.log(data);
//       })
//     );
//   }, []);
  const sendToChatGPT = async (value: string) => {
    // console.log("in");
    // const connect = await fetch("http://127.0.0.1:5000/chatgpt", {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({ input: value }),
    // });
    // const data = await connect.json();
    // const dataProcedure = data.output.split("\n");
    // let finalOutput = [];
    // for (let i = 0; i < dataProcedure.length; i++) {
    //   finalOutput.push(dataProcedure[i]);
    //     //.substring(3, dataProcedure[i].length - 1));
    // }
    // setOutput(finalOutput);
    // console.log(finalOutput);
    // sendToken("Send 5 WETH TO 0xBF52afF4D0BC9aaB345B9aA0D58A2c5dB62F08Bf ON ETHEREUM", signer);
    // swapToken("SWAP 0.005 WETH TO DAI ON ETHEREUM", signer);
    // bridgeToken("Bridge 5 USDC from ETH to AVAX", signer, provider);
    // action(finalOutput, signer, provider);
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

          <div>
            {output.map((item) => (
              <div>{item}</div>
            ))}
          </div>
        </FormControl>
      </div>
    </Grid>
  );
};

export default Input;
