import styles from './SøkerLayout.module.css';

interface SøkerLayoutProps extends React.PropsWithChildren {}

export const SøkerLayout = ({ children }: SøkerLayoutProps) => <main className={styles.sokerLayout}>{children}</main>;
