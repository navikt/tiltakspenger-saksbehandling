import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingResultatVelger } from '~/lib/rammebehandling/søknadsbehandling/resultat-velger/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from '~/lib/rammebehandling/søknadsbehandling/brev/SøknadsbehandlingBrev';
import { Separator } from '~/lib/_felles/separator/Separator';
import { SøknadsbehandlingSend } from '~/lib/rammebehandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import { SøknadsbehandlingAvslagsgrunner } from '~/lib/rammebehandling/søknadsbehandling/avslagsgrunner/SøknadsbehandlingAvslagsgrunner';
import { SøknadsbehandlingAutomatiskBehandling } from '~/lib/rammebehandling/søknadsbehandling/automatisk-behandling/SøknadsbehandlingAutomatiskBehandling';
import { BehandlingBeregningOgSimulering } from '~/lib/rammebehandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { BehandlingBarnetillegg } from '~/lib/rammebehandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingInnvilgelseSkjema } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { InnvilgelsesperioderVelger } from '~/lib/rammebehandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BegrunnelseVilkårsvurdering } from '~/lib/rammebehandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';

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
