import { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { SakProps } from '~/types/Sak';
import useSWR from 'swr';
import NextError from 'next/error';
import { PersonaliaHeader } from '~/components/personaliaheader/PersonaliaHeader';
import styles from './Layout.module.css';
import { BodyShort, Heading, HStack, Loader, Tabs, VStack } from '@navikt/ds-react';
import { Klagebehandling, KlagebehandlingStatus } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';
import Link from 'next/link';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

import router from 'next/router';
import { kanNavigereTilKlageSteg, KlageSteg } from '../../../../utils/KlageLayoutUtils';
import { classNames } from '~/utils/classNames';
import {
    klagebehandlingResultatTilText,
    klagebehandlingStatusTilText,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt } from '~/utils/date';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import AvbruttOppsummering from '~/components/oppsummeringer/oppsummeringAvAvbrutt/OppsummeringAvAvbrutt';

type Props = {
    children: ReactElement;
    saksnummer: string;
    activeTab: KlageSteg;
};

type OptionalKlageContext = {
    klage: Nullable<Klagebehandling>;
    setKlage: React.Dispatch<React.SetStateAction<Nullable<Klagebehandling>>>;
};

type KlageContext = {
    klage: Klagebehandling;
    setKlage: React.Dispatch<React.SetStateAction<Klagebehandling>>;
};

const Context = createContext<OptionalKlageContext>({} as OptionalKlageContext);

type ContextProps = React.PropsWithChildren<{
    initialKlage: Nullable<Klagebehandling>;
}>;

export const KlageProvider = ({ initialKlage, children }: ContextProps) => {
    const [klage, setKlage] = useState<Nullable<Klagebehandling>>(initialKlage);
    useEffect(() => {
        setKlage(initialKlage);
    }, [initialKlage]);

    return (
        <Context.Provider
            value={{
                klage: klage,
                setKlage: setKlage,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useOptionalKlage = () => {
    return useContext(Context);
};

export function useKlage(): KlageContext {
    const klageContext = useContext(Context);

    if (!klageContext.klage) {
        throw new Error('useKlage() was called outside of a Klage context where klage exists');
    }

    return {
        klage: klageContext.klage,
        setKlage: klageContext.setKlage as React.Dispatch<React.SetStateAction<Klagebehandling>>,
    };
}

/**
 * Layouts i /pages er strukturelle komponenter og ikke reaktive. Derfor må vi bruke en Context for å dele klagebehandlingsdataene
 * Dette er for at layouten skal oppdatere seg når klagebehandlingsdataene endres i de ulike stegene
 */
const KlageLayout = ({ children, saksnummer, activeTab }: Props) => {
    const { klage } = useOptionalKlage();

    const { data, error, isLoading } = useSWR<SakProps>(
        `/sak/${saksnummer}`,
        fetchJsonFraApiClientSide,
    );

    if (isLoading)
        return (
            <div className={styles.loaderContainer}>
                <Loader />
            </div>
        );

    if (error) {
        return <NextError statusCode={500} />;
    }

    return (
        <div>
            <PersonaliaHeader sakId={data!.sakId!} saksnummer={data!.saksnummer} />
            <KlageHeader saksnummer={data!.saksnummer} klage={klage} />
            <KlageStedIndikator activeTab={activeTab} klage={klage} />
            {klage?.status === KlagebehandlingStatus.AVBRUTT && (
                <VStack marginInline="10">
                    <AvbruttOppsummering avbrutt={klage.avbrutt!} />
                </VStack>
            )}
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

                <HStack align="end" gap="6">
                    <BodyShort>
                        Behandlingsstatus{' '}
                        {props.klage ? klagebehandlingStatusTilText[props.klage.status] : 'utredes'}
                    </BodyShort>
                    <BodyShort>
                        Behandlingsresultat{' '}
                        {props.klage
                            ? klagebehandlingResultatTilText[props.klage.resultat!]
                            : 'ikke satt'}
                    </BodyShort>
                    <BodyShort>
                        Opprettet {props.klage ? formaterTidspunkt(props.klage.opprettet) : '-'}
                    </BodyShort>
                    <BodyShort>
                        Sist endret {props.klage ? formaterTidspunkt(props.klage.sistEndret) : '-'}
                    </BodyShort>
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
    const kanNavigereTilVurdering =
        props.klage && kanNavigereTilKlageSteg(props.klage, KlageSteg.VURDERING);
    const kanNavigereTilResultat =
        props.klage && kanNavigereTilKlageSteg(props.klage, KlageSteg.RESULTAT);

    const onChange = (value: KlageSteg) => {
        switch (value) {
            case KlageSteg.FORMKRAV: {
                if (props.klage && kanNavigereTilKlageSteg(props.klage, value)) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/formkrav`);
                }
                return;
            }
            case KlageSteg.VURDERING: {
                if (props.klage && kanNavigereTilKlageSteg(props.klage, value)) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/vurdering`);
                }
                return;
            }

            case KlageSteg.BREV: {
                if (props.klage && kanNavigereTilBrev) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/brev`);
                }
                return;
            }
            case KlageSteg.RESULTAT: {
                if (props.klage && kanNavigereTilResultat) {
                    router.push(`/sak/${props.klage.saksnummer}/klage/${props.klage.id}/resultat`);
                }
                return;
            }
        }

        //hvis denne fjernes vil ikke funksjonen få compile error dersom en case mangler
        throw value satisfies never;
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
                    className={classNames(
                        styles.tab,
                        kanNavigereTilVurdering ? '' : styles.tabDisabled,
                    )}
                    value={KlageSteg.VURDERING}
                    label="2. Vurdering"
                />
                <Tabs.Tab
                    className={classNames(styles.tab, kanNavigereTilBrev ? '' : styles.tabDisabled)}
                    value={KlageSteg.BREV}
                    label="3. Brev"
                />
                <Tabs.Tab
                    className={classNames(
                        styles.tab,
                        kanNavigereTilResultat ? '' : styles.tabDisabled,
                    )}
                    value={KlageSteg.RESULTAT}
                    label="4. Resultat"
                />
            </Tabs.List>
        </Tabs>
    );
};
