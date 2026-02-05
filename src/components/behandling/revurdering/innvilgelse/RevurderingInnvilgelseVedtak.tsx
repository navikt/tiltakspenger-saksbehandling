import { Alert, Heading } from '@navikt/ds-react';
import { Separator } from '~/components/separator/Separator';
import { RevurderingInnvilgelseBrev } from '~/components/behandling/revurdering/innvilgelse/brev/RevurderingInnvilgelseBrev';
import { RevurderingInnvilgelseSend } from '~/components/behandling/revurdering/innvilgelse/send-og-godkjenn/RevurderingInnvilgelseSend';
import { BehandlingBeregningOgSimulering } from '~/components/behandling/felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { Klagebehandling } from '~/types/Klage';
import { Nullable } from '~/types/UtilTypes';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

export const RevurderingInnvilgelseVedtak = (props: { klage: Nullable<Klagebehandling> }) => {
    const { behandling } = useBehandling();
    const { innvilgelse } = useRevurderingInnvilgelseSkjema();

    // Kjapp fiks for å sjekke om det finnes tiltak det kan innvilges for. Dette bør avgjøres av backend.
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    return (
        <>
            <Heading size={'medium'} level={'1'} spacing={true}>
                {props.klage ? 'Omgjøring etter klage - ' : ''}Revurdering av innvilgelse
            </Heading>
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
