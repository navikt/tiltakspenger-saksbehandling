import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { Stepper, VStack } from '@navikt/ds-react';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandlinger } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/Meldeperiodebehandlinger';
import { MeldekortbehandlingHeader } from '~/lib/meldekort/v2/meldekortbehandling/header/MeldekortbehandlingHeader';
import { MeldekortbehandlingBeregningOgSimulering } from '~/lib/meldekort/v2/meldekortbehandling/bereging/MeldekortbehandlingBeregningOgSimulering';
import { MeldekortbehandlingBegrunnelseOgBrev } from '~/lib/meldekort/v2/meldekortbehandling/begrunnelse-og-brev/MeldekortbehandlingBegrunnelseOgBrev';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/v2/meldekortbehandling/layout/seksjon/MeldekortbehandlingSeksjon';
import { useRouter } from 'next/router';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useEffect, useState } from 'react';

import style from './MeldekortbehandlingSide.module.css';

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
                                <Steg steg={3}>{'Begrunnelse og brev'}</Steg>
                                <Steg steg={4}>{'Oppsummering og send inn'}</Steg>
                            </Stepper>
                        </MeldekortbehandlingSeksjon.FullBredde>
                    </MeldekortbehandlingSeksjon>
                </VStack>

                <KomponentForSteg steg={aktivtSteg} />
            </VStack>
        </>
    );
};

const KomponentForSteg = ({ steg }: { steg: number }) => {
    switch (steg) {
        case 1:
            return <Meldeperiodebehandlinger />;
        case 2:
            return <MeldekortbehandlingBeregningOgSimulering />;
        case 3:
            return <MeldekortbehandlingBegrunnelseOgBrev />;
        case 4:
            return 'Validering og innsending goes here!';
    }

    return <KomponentForSteg steg={DEFAULT_STEG} />;
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
