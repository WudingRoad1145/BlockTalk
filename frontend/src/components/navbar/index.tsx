import classNames from "classnames";
import { ConnectKitButton } from "connectkit";
import styles from "./index.module.scss";
import logo from "./logo.png";

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Navbar = ({ className, ...props }: NavbarProps) => {
  return (
    <div className={classNames(styles.navbar, className)} {...props}>
      <img
        src={logo}
        className={styles.logo}
        alt="BlockTalk"
        // onClick={() => navigate("/")}
      />
      <ConnectKitButton />
    </div>
  );
};

export default Navbar;
