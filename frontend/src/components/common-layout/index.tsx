import classNames from 'classnames'
import Navbar from 'components/navbar'
import Input from 'components/input'
import styles from './index.module.scss'

export interface CommonLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CommonLayout = ({ className, children, ...props }: CommonLayoutProps) => {
  return (
    <div className={classNames(styles.layout, className)} {...props}>
      <div className={styles.header}>
        
        <Navbar />
        <h2>Describe what you want, and it is DONE!</h2>
        <p>Try - Bridge 10 USDC from ETH to AVAX</p>
        <Input />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default CommonLayout