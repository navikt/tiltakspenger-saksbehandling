import { Alert } from '@navikt/ds-react';
import { Separator } from '~/components/separator/Separator';
import { BehandlingBeregningOgSimulering } from '../../felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingOmgjøring } from '../../context/BehandlingContext';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';
import {
    RevurderingOmgjøringContext,
    useRevurderingOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { RevurderingOmgjøringBrev } from '~/components/behandling/revurdering/omgjøring/brev/RevurderingOmgjøringBrev';
import { RevurderingOmgjøringSend } from '~/components/behandling/revurdering/omgjøring/send-og-godkjenn/RevurderingOmgjøringSend';
import { RevurderingOmgjøringHeader } from '~/components/behandling/revurdering/omgjøring/header/RevurderingOmgjøringHeader';
import { RevurderingOmgjøringsperiodeVelger } from '~/components/behandling/revurdering/omgjøring/omgjøringsperiode/RevurderingOmgjøringsperiodeVelger';

export const RevurderingOmgjøringVedtak = () => {
    const { behandling } = useRevurderingOmgjøring();
    const skjema = useRevurderingOmgjøringSkjema();

    // Kjapp fiks for å sjekke om det finnes tiltak det kan innvilges for. Dette bør avgjøres av backend.
    // Vi burde kanskje ha en innvilgelse/opphør velger, tilsvarende som vi har for søknadsbehandling
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    return (
        <>
            <RevurderingOmgjøringHeader />
            <Separator />
            <RevurderingOmgjøringsperiodeVelger />
            <Separator />
            {kanInnvilges ? (
                <Innvilgelse skjema={skjema} />
            ) : (
                <Alert variant={'warning'}>
                    {'Ingen perioder kan innvilges - Vi støtter ikke rent opphør ennå.'}
                </Alert>
            )}
        </>
    );
};

const Innvilgelse = ({ skjema }: { skjema: RevurderingOmgjøringContext }) => {
    return (
        <>
            <InnvilgelsesperioderVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            {skjema.innvilgelse.harValgtPeriode && (
                <>
                    <BehandlingBarnetillegg />
                    <Separator />
                    <RevurderingOmgjøringBrev />
                    <Separator />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
            <RevurderingOmgjøringSend />
        </>
    );
};
