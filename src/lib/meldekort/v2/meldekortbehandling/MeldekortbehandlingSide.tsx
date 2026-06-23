import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { Stepper, VStack } from '@navikt/ds-react';
import {
    useMeldekortbehandling,
    useMeldekortbehandlingSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
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
import { MeldekortbehandlingLagre } from '~/lib/meldekort/v2/meldekortbehandling/lagre/MeldekortbehandlingLagre';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    kanBeslutteForMeldekort,
    kanSaksbehandleForMeldekort,
} from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { Separator } from '~/lib/_felles/separator/Separator';

import style from './MeldekortbehandlingSide.module.css';

const DEFAULT_STEG = 1;

export const MeldekortbehandlingSide = () => {
    const { asPath } = useRouter();

    const [aktivtSteg, setAktivtSteg] = useState(DEFAULT_STEG);

    const { sakId, saksnummer } = useSak().sak;

    const { erReadonly } = useMeldekortbehandlingSkjema();

    const meldekortbehandling = useMeldekortbehandling();
    const { innloggetSaksbehandler } = useSaksbehandler();

    useEffect(() => {
        const stegFraHash = asPath.split('#').at(1)?.split('-').at(1);
        const stegIndex = stegFraHash ? Number(stegFraHash) : DEFAULT_STEG;
        //eslint-disable-next-line react-hooks/set-state-in-effect
        setAktivtSteg(stegIndex);
    }, [asPath]);

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
                                <Steg steg={3}>
                                    {sisteStegTekst(meldekortbehandling, innloggetSaksbehandler)}
                                </Steg>
                            </Stepper>
                        </MeldekortbehandlingSeksjon.FullBredde>
                    </MeldekortbehandlingSeksjon>
                </VStack>

                {erReadonly ? <Separator /> : <MeldekortbehandlingLagre />}

                <StegKomponentWrapper steg={1} aktivtSteg={aktivtSteg}>
                    <Meldeperiodebehandlinger />
                </StegKomponentWrapper>
                <StegKomponentWrapper steg={2} aktivtSteg={aktivtSteg}>
                    <MeldekortbehandlingBeregningOgSimulering />
                </StegKomponentWrapper>
                <StegKomponentWrapper steg={3} aktivtSteg={aktivtSteg}>
                    <MeldekortbehandlingFritekstOgSendInn />
                </StegKomponentWrapper>
            </VStack>
        </>
    );
};

const StegKomponentWrapper = ({
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

const sisteStegTekst = (
    behandling: MeldekortbehandlingPropsV2,
    saksbehandler: Saksbehandler,
): string => {
    if (kanSaksbehandleForMeldekort(behandling, saksbehandler)) {
        return 'Begrunnelse, brev og innsending';
    }

    if (kanBeslutteForMeldekort(behandling, saksbehandler)) {
        return 'Begrunnelse, brev og godkjenning';
    }

    return 'Begrunnelse og brev';
};
