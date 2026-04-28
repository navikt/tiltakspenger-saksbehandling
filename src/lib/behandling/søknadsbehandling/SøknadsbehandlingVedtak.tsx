import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingResultatVelger } from '~/lib/behandling/søknadsbehandling/resultat-velger/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from '~/lib/behandling/søknadsbehandling/brev/SøknadsbehandlingBrev';
import { Separator } from '~/lib/_felles/separator/Separator';
import { SøknadsbehandlingSend } from '~/lib/behandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import { SøknadsbehandlingAvslagsgrunner } from '~/lib/behandling/søknadsbehandling/avslagsgrunner/SøknadsbehandlingAvslagsgrunner';
import { SøknadsbehandlingAutomatiskBehandling } from '~/lib/behandling/søknadsbehandling/automatisk-behandling/SøknadsbehandlingAutomatiskBehandling';
import { BehandlingBeregningOgSimulering } from '~/lib/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useBehandlingSkjema } from '~/lib/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { BehandlingBarnetillegg } from '~/lib/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingInnvilgelseSkjema } from '~/lib/behandling/context/innvilgelse/innvilgelseContext';
import { InnvilgelsesperioderVelger } from '~/lib/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BegrunnelseVilkårsvurdering } from '~/lib/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { useBehandling } from '~/lib/behandling/context/BehandlingContext';

export const SøknadsbehandlingVedtak = () => {
    const { klagebehandling } = useBehandling();

    const { resultat } = useBehandlingSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {klagebehandling ? 'Omgjøring etter klage - ' : ''}
                {'Vedtak (søknadsbehandling)'}
            </Heading>
            <SøknadsbehandlingAutomatiskBehandling />
            <SøknadsbehandlingResultatVelger />
            {resultat === SøknadsbehandlingResultat.IKKE_VALGT && <IkkeValgt />}
            {resultat === SøknadsbehandlingResultat.INNVILGELSE && <Innvilgelse />}
            {resultat === SøknadsbehandlingResultat.AVSLAG && <Avslag />}
            <SøknadsbehandlingSend />
        </>
    );
};

const IkkeValgt = () => {
    return (
        <>
            <Separator />
            <BegrunnelseVilkårsvurdering />
        </>
    );
};

const Innvilgelse = () => {
    const { harValgtPeriode } = useBehandlingInnvilgelseSkjema().innvilgelse;

    return (
        <>
            <InnvilgelsesperioderVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            {harValgtPeriode && (
                <>
                    <BehandlingBarnetillegg />
                    <Separator />
                    <SøknadsbehandlingBrev />
                    <Separator />
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
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            <SøknadsbehandlingBrev />
        </>
    );
};
