import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { Stepper, VStack } from '@navikt/ds-react';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandlinger } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/Meldeperiodebehandlinger';
import { MeldekortbehandlingHeader } from '~/lib/meldekort/v2/meldekortbehandling/header/MeldekortbehandlingHeader';
import { MeldekortbehandlingBeregningOgSimulering } from '~/lib/meldekort/v2/meldekortbehandling/bereging/MeldekortbehandlingBeregningOgSimulering';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { useRouter } from 'next/router';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { PropsWithChildren, useEffect, useState } from 'react';
import { MeldekortbehandlingFritekstOgSendInn } from '~/lib/meldekort/v2/meldekortbehandling/fritekst-og-innsending/MeldekortbehandlingFritekstOgSendInn';
import { classNames } from '~/utils/classNames';

import style from './MeldekortbehandlingSide.module.css';
import { MeldekortbehandlingLagre } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagre';

const DEFAULT_STEG = 1;

export const MeldekortbehandlingSide = () => {
    const { asPath } = useRouter();

    const [aktivtSteg, setAktivtSteg] = useState(DEFAULT_STEG);

    useEffect(() => {
        const stegFraHash = asPath.split('#').at(1)?.split('-').at(1);
        const stegIndex = stegFraHash ? Number(stegFraHash) : DEFAULT_STEG;
        //eslint-disable-next-line react-hooks/set-state-in-effect
        setAktivtSteg(stegIndex);
    }, [asPath]);

    const { sakId, saksnummer } = useSak().sak;

    return (
        <>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />

            <VStack className={style.meldekortbehandling}>
                <VStack className={style.topp}>
                    <MeldekortbehandlingHeader />

                    <MeldekortbehandlingSeksjon>
                        <MeldekortbehandlingSeksjon.FullBredde className={style.stepperSeksjon}>
                            <Stepper
                                activeStep={aktivtSteg}
                                orientation={'horizontal'}
                                className={style.stepper}
                            >
                                <Steg steg={1}>{'Meldeperioder'}</Steg>
                                <Steg steg={2}>{'Beregning og simulering'}</Steg>
                                <Steg steg={3}>{'Begrunnelse, brev og innsending'}</Steg>
                            </Stepper>
                        </MeldekortbehandlingSeksjon.FullBredde>
                    </MeldekortbehandlingSeksjon>
                </VStack>

                <MeldekortbehandlingLagre />

                <KomponentForSteg steg={1} aktivtSteg={aktivtSteg}>
                    <Meldeperiodebehandlinger />
                </KomponentForSteg>
                <KomponentForSteg steg={2} aktivtSteg={aktivtSteg}>
                    <MeldekortbehandlingBeregningOgSimulering />
                </KomponentForSteg>
                <KomponentForSteg steg={3} aktivtSteg={aktivtSteg}>
                    <MeldekortbehandlingFritekstOgSendInn />
                </KomponentForSteg>
            </VStack>
        </>
    );
};

const KomponentForSteg = ({
    steg,
    aktivtSteg,
    children,
}: PropsWithChildren<{ steg: number; aktivtSteg: number }>) => {
    return (
        <div className={classNames(style.stegKomponent, steg === aktivtSteg && style.aktiv)}>
            {children}
        </div>
    );
};

type StegProps = {
    steg: number;
    children: string;
};

const Steg = ({ steg, children }: StegProps) => {
    const { saksnummer } = useSak().sak;
    const { id } = useMeldekortbehandling();

    return (
        <Stepper.Step
            as={InternLenke}
            href={`${meldekortbehandlingUrl(saksnummer, id)}#steg-${steg}`}
        >
            {children}
        </Stepper.Step>
    );
};
