import { ReactElement } from 'react';
import { SakProps } from '~/types/Sak';
import useSWR from 'swr';
import Error from 'next/error';
import { PersonaliaHeader } from '~/components/personaliaheader/PersonaliaHeader';
import styles from './Layout.module.css';
import { BodyShort, Heading, HStack, Loader, Tabs } from '@navikt/ds-react';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';
import Link from 'next/link';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

import router from 'next/router';
import { kanNavigereTilKlageSteg, KlageSteg } from '../../../../utils/KlageLayoutUtils';
import { classNames } from '~/utils/classNames';

type Props = {
    children: ReactElement;
    saksnummer: string;
    activeTab: KlageSteg;
    klage: Nullable<Klagebehandling>;
};

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

const KlageLayout = ({ children, saksnummer, activeTab, klage }: Props) => {
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
            <KlageHeader saksnummer={data!.saksnummer} klage={klage} />
            <KlageStedIndikator activeTab={activeTab} klage={klage} />
            <main>{children}</main>
        </div>
    );
};

export default KlageLayout;

const KlageHeader = (props: { saksnummer: string; klage: Nullable<Klagebehandling> }) => {
    return (
        <div className={styles.klageHeader}>
            <HStack margin="4" align="center" justify="space-between">
                <Heading size="medium">Klage</Heading>

                <HStack align="end" gap="4">
                    <BodyShort>
                        Behandlingsstatus {props.klage ? props.klage.status : 'utredes'}
                    </BodyShort>
                    <BodyShort>
                        Behandlingsresultat {props.klage ? props.klage.resultat : 'ikke satt'}
                    </BodyShort>
                    <BodyShort>Opprettet {props.klage ? props.klage.opprettet : '-'}</BodyShort>
                    <BodyShort>Sist endret {props.klage ? props.klage.sistEndret : '-'}</BodyShort>
                    <Link href={`/sak/${props.saksnummer}`} target="_blank">
                        <HStack align="start" gap="1">
                            <BodyShort>Gå til personoversikt</BodyShort>
                            <ExternalLinkIcon title="ny fane" fontSize="1.4rem" />
                        </HStack>
                    </Link>
                </HStack>
            </HStack>
        </div>
    );
};

const KlageStedIndikator = (props: { activeTab: KlageSteg; klage: Nullable<Klagebehandling> }) => {
    const kanNavigereTilBrev = props.klage && kanNavigereTilKlageSteg(props.klage, KlageSteg.BREV);

    const onChange = (value: KlageSteg) => {
        switch (value) {
            case KlageSteg.FORMKRAV: {
                if (props.klage && kanNavigereTilKlageSteg(props.klage, value)) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/formkrav`);
                }
                return;
            }
            case KlageSteg.BREV: {
                if (props.klage && kanNavigereTilBrev) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/brev`);
                }
                return;
            }
        }
    };

    return (
        <Tabs
            className={styles.tabs}
            value={props.activeTab}
            onChange={(s) => onChange(s as KlageSteg)}
        >
            <Tabs.List className={styles.tabsList}>
                <Tabs.Tab className={styles.tab} value={KlageSteg.FORMKRAV} label="1. Formkrav" />
                <Tabs.Tab
                    className={classNames(styles.tab, kanNavigereTilBrev ? '' : styles.tabDisabled)}
                    value={KlageSteg.BREV}
                    label="2. Brev"
                />
            </Tabs.List>
        </Tabs>
    );
};
