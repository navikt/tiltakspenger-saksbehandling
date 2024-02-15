import { HStack } from '@navikt/ds-react';
import styles from './BehandlingLayout.module.css';

interface BehandlingLayoutProps extends React.PropsWithChildren {}

export const BehandlingLayout = ({ children }: BehandlingLayoutProps) => (
  <main>
    <HStack wrap={false} className={styles.behandlingLayout}>
      {children}
    </HStack>
  </main>
);
