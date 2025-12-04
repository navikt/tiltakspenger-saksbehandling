import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingBegrunnelse } from '~/components/behandling/søknadsbehandling/begrunnelse/SøknadsbehandlingBegrunnelse';
import { SøknadsbehandlingResultatVelger } from '~/components/behandling/søknadsbehandling/resultat-velger/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from '~/components/behandling/søknadsbehandling/brev/SøknadsbehandlingBrev';
import { SøknadsbehandlingSend } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import { SøknadsbehandlingAvslagsgrunner } from '~/components/behandling/søknadsbehandling/avslagsgrunner/SøknadsbehandlingAvslagsgrunner';
import { SøknadsbehandlingAutomatiskBehandling } from '~/components/behandling/søknadsbehandling/automatisk-behandling/SøknadsbehandlingAutomatiskBehandling';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { BehandlingDagerPerMeldeperiode } from '~/components/behandling/felles/dager-per-meldeperiode/BehandlingDagerPerMeldeperiode';
import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingInnvilgelseSkjema } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';

import style from './SøknadsbehandlingVedtak.module.css';
import Divider from '~/components/divider/Divider';

export const SøknadsbehandlingVedtak = () => {
    const { resultat } = useBehandlingSkjema();

    return (
        <>
            <Heading size={'medium'} level={'3'} className={style.header}>
                {'Vedtak (søknadsbehandling)'}
            </Heading>
            <SøknadsbehandlingAutomatiskBehandling />
            <SøknadsbehandlingBegrunnelse />
            <Divider color="black" margin="1.25rem 0" />
            <SøknadsbehandlingResultatVelger />
            {resultat === SøknadsbehandlingResultat.INNVILGELSE && <Innvilgelse />}
            {resultat === SøknadsbehandlingResultat.AVSLAG && <Avslag />}
            <SøknadsbehandlingSend />
        </>
    );
};

const Innvilgelse = () => {
    const { harValgtPeriode } = useBehandlingInnvilgelseSkjema().innvilgelse;

    return (
        <>
            <InnvilgelsesperiodeVelger />
            <Divider color="black" margin="1.25rem 0" />
            {harValgtPeriode && (
                <>
                    <BehandlingDagerPerMeldeperiode />
                    <Divider color="black" margin="1.25rem 0" />
                    <BehandlingTiltak />
                    <BehandlingBarnetillegg />
                    <Divider color="black" margin="1.25rem 0" />
                    <SøknadsbehandlingBrev />
                    <Divider color="black" margin="1.25rem 0" />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
        </>
    );
};

const Avslag = () => {
    return (
        <>
            <SøknadsbehandlingAvslagsgrunner />
            <SøknadsbehandlingBrev />
        </>
    );
};
