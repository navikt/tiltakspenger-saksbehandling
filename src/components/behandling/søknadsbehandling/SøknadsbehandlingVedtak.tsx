import { Heading } from '@navikt/ds-react';
import { SøknadsbehandlingResultatVelger } from '~/components/behandling/søknadsbehandling/resultat-velger/SøknadsbehandlingResultatVelger';
import { SøknadsbehandlingBrev } from '~/components/behandling/søknadsbehandling/brev/SøknadsbehandlingBrev';
import { Separator } from '../../separator/Separator';
import { SøknadsbehandlingSend } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import { SøknadsbehandlingAvslagsgrunner } from '~/components/behandling/søknadsbehandling/avslagsgrunner/SøknadsbehandlingAvslagsgrunner';
import { SøknadsbehandlingAutomatiskBehandling } from '~/components/behandling/søknadsbehandling/automatisk-behandling/SøknadsbehandlingAutomatiskBehandling';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useBehandlingInnvilgelseSkjema } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { InnvilgelsesperioderVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';

export const SøknadsbehandlingVedtak = (props: { klagebehandling: Nullable<Klagebehandling> }) => {
    const { resultat } = useBehandlingSkjema();

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {props.klagebehandling ? 'Omgjøring etter klage - ' : ''}Vedtak (søknadsbehandling)
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
