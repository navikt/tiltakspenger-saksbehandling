import { Heading } from '@navikt/ds-react';
import styles from './SøknadLayout.module.css';

interface SøknadLayoutProps extends React.PropsWithChildren {
    title?: string;
}

export const SøknadLayout = ({ children, title = 'Søknad' }: SøknadLayoutProps) => (
    <main className={styles.soknadLayout}>
        <Heading level="1" size="small" className={styles.soknadLayout__title}>
            Søknad
        </Heading>
        {children}
    </main>
);
