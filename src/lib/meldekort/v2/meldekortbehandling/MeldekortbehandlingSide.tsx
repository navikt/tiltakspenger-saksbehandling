import { PersonaliaHeader } from '~/lib/personaliaheader/PersonaliaHeader';
import { useSak } from '~/lib/sak/SakContext';
import { Stepper, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingV2Provider } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Meldeperiodebehandlinger } from '~/lib/meldekort/v2/meldekortbehandling/meldeperioder/Meldeperiodebehandlinger';
import { MeldekortbehandlingHeader } from '~/lib/meldekort/v2/meldekortbehandling/header/MeldekortbehandlingHeader';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';
import { useState } from 'react';
import { InfokortEnkel } from '~/lib/_felles/infokort/InfokortEnkel';
import { Separator } from '~/lib/_felles/separator/Separator';

import style from './MeldekortbehandlingSide.module.css';
import { MeldekortbehandlingBeregningOgSimulering } from '~/lib/meldekort/v2/meldekortbehandling/bereging/MeldekortbehandlingBeregningOgSimulering';
import { MeldekortbehandlingBegrunnelseOgBrev } from '~/lib/meldekort/v2/meldekortbehandling/begrunnelse-og-brev/MeldekortbehandlingBegrunnelseOgBrev';

type Props = {
    meldekortbehandling: MeldekortbehandlingPropsV2;
};

export const MeldekortbehandlingSide = ({ meldekortbehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const [aktivtSteg, setAktivtSteg] = useState(1);

    return (
        <MeldekortbehandlingV2Provider meldekortbehandling={meldekortbehandling}>
            <PersonaliaHeader sakId={sakId} saksnummer={saksnummer} visTilbakeKnapp={true} />

            <VStack className={style.meldekortbehandling}>
                <MeldekortbehandlingHeader />

                <Stepper
                    activeStep={aktivtSteg}
                    onStepChange={setAktivtSteg}
                    orientation={'horizontal'}
                    className={style.stepper}
                >
                    <Stepper.Step href="#">{'Meldeperioder'}</Stepper.Step>
                    <Stepper.Step href="#">{'Beregning og simulering'}</Stepper.Step>
                    <Stepper.Step href="#">{'Begrunnelse og brev'}</Stepper.Step>
                    <Stepper.Step href="#">{'Oppsummering og send inn'}</Stepper.Step>
                </Stepper>

                <Separator />

                <ComponentForStep steg={aktivtSteg} />
            </VStack>
        </MeldekortbehandlingV2Provider>
    );
};

const ComponentForStep = ({ steg }: { steg: number }) => {
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

    return <InfokortEnkel data-color={'danger'}>{`Ugyldig steg: ${steg}`}</InfokortEnkel>;
};
