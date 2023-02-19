import CommonLayout from "components/common-layout";
import styles from "./index.module.scss";

// import { ChatGPTAPIBrowser } from "chatgpt";
import Input from "components/input";

const MainPage = () => {
  return (
    <CommonLayout className={styles.page}>
      <h2>Describe what you want, and it is DONE!</h2>
      <p>Try - Bridge 10 USDC from ETH to AVAX</p>
      <Input />
    </CommonLayout>
  );
};
export default MainPage;