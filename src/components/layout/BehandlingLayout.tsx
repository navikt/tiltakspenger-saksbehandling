import styles from './BehandlingLayout.module.css';

interface BehandlingLayoutProps extends React.PropsWithChildren {}

export const BehandlingLayout = ({ children }: BehandlingLayoutProps) => (
  <main className={styles.behandlingLayout}>{children}</main>
);
