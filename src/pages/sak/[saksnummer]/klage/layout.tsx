import { ReactElement } from 'react';
import { SakProps } from '~/types/Sak';
import useSWR from 'swr';
import Error from 'next/error';
import { PersonaliaHeader } from '~/components/personaliaheader/PersonaliaHeader';
import styles from './Layout.module.css';
import { Loader } from '@navikt/ds-react';

type Props = {
    children: ReactElement;
    saksnummer: string;
};

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const KlageLayout = ({ children, saksnummer }: Props) => {
    const { data, error, isLoading } = useSWR<SakProps>(`/api/sak/${saksnummer}`, fetcher);

    if (isLoading)
        return (
            <div className={styles.loaderContainer}>
                <Loader />
            </div>
        );

    if (error) {
        return <Error statusCode={500} />;
    }

    return (
        <div>
            <PersonaliaHeader sakId={data!.sakId!} saksnummer={data!.saksnummer} />
            <main>{children}</main>
        </div>
    );
};

export default KlageLayout;
