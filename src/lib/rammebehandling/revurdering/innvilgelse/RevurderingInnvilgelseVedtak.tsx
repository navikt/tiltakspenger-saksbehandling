import { Alert, Heading } from '@navikt/ds-react';
import { Separator } from '~/lib/_felles/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/lib/rammebehandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/lib/rammebehandling/revurdering/innvilgelse/send-og-godkjenn/RevurderingInnvilgelseSend';
import { BehandlingBeregningOgSimulering } from '~/lib/rammebehandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingInnvilgelseSkjema } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/lib/rammebehandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BehandlingBarnetillegg } from '~/lib/rammebehandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/lib/rammebehandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/lib/rammebehandling/rammebehandlingUtils';
import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { RevurderingAutomatiskOpprettetGrunn } from '~/lib/rammebehandling/revurdering/felles/automatisk-opprettet-grunn/RevurderingAutomatiskOpprettetGrunn';

export const RevurderingInnvilgelseVedtak = () => {
    const { behandling, klagebehandling } = useRevurderingBehandling();
    const { innvilgelse } = useRevurderingInnvilgelseSkjema();

    // Kjapp fiks for å sjekke om det finnes tiltak det kan innvilges for. Dette bør avgjøres av backend.
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    const { automatiskOpprettetGrunn } = behandling;

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {klagebehandling ? 'Omgjøring etter klage - ' : ''}
                {'Revurdering av innvilgelse'}
            </Heading>
            {automatiskOpprettetGrunn && (
                <>
                    <RevurderingAutomatiskOpprettetGrunn
                        automatiskOpprettetGrunn={automatiskOpprettetGrunn}
                    />
                    <Separator />
                </>
            )}
            {kanInnvilges ? (
                <>
                    <InnvilgelsesperioderVelger />
                    <Separator />
                    <BegrunnelseVilkårsvurdering />
                    <Separator />
                    {innvilgelse.harValgtPeriode && (
                        <>
                            <BehandlingBarnetillegg />
                            <Separator />
                            <RevurderingInnvilgelseBrev />
                            <Separator />
                            <BehandlingBeregningOgSimulering />
                        </>
                    )}
                    <RevurderingInnvilgelseSend />
                </>
            ) : (
                <Alert variant={'error'}>
                    {'Fant ingen tiltaksdeltakelser i saksopplysningene det kan innvilges for.'}
                </Alert>
            )}
        </>
    );
};
