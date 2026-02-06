import { Alert } from '@navikt/ds-react';
import { Separator } from '~/components/separator/Separator';
import { BehandlingBeregningOgSimulering } from '../../felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingOmgjøring } from '../../context/BehandlingContext';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';
import { useOmgjøringSkjema } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { RevurderingOmgjøringBrev } from '~/components/behandling/revurdering/omgjøring/brev/RevurderingOmgjøringBrev';
import { RevurderingOmgjøringSend } from '~/components/behandling/revurdering/omgjøring/send-og-godkjenn/RevurderingOmgjøringSend';
import { RevurderingOmgjøringHeader } from '~/components/behandling/revurdering/omgjøring/header/RevurderingOmgjøringHeader';
import { OmgjøringVedtaksperiodeVelger } from '~/components/behandling/revurdering/omgjøring/vedtaksperiode/OmgjøringVedtaksperiodeVelger';
import { RevurderingResultat } from '~/types/Revurdering';
import { OmgjøringResultatVelger } from '~/components/behandling/revurdering/omgjøring/resultat-velger/OmgjøringResultatVelger';

export const RevurderingOmgjøringVedtak = () => {
    const skjema = useOmgjøringSkjema();
    const { resultat } = skjema;

    return (
        <>
            <RevurderingOmgjøringHeader />
            <Separator />
            <OmgjøringResultatVelger />
            {resultat === RevurderingResultat.OMGJØRING ? (
                <Innvilgelse harValgtPeriode={skjema.innvilgelse.harValgtPeriode} />
            ) : resultat === RevurderingResultat.OMGJØRING_OPPHØR ? (
                <Opphør />
            ) : (
                <IkkeValgt />
            )}
            <RevurderingOmgjøringSend />
        </>
    );
};

const Innvilgelse = ({ harValgtPeriode }: { harValgtPeriode: boolean }) => {
    const { behandling } = useRevurderingOmgjøring();

    // Kjapp fiks for å sjekke om det finnes tiltak det kan innvilges for. Dette bør avgjøres av backend.
    // Vi burde kanskje ha en innvilgelse/opphør velger, tilsvarende som vi har for søknadsbehandling
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    if (!kanInnvilges) {
        return (
            <Alert variant={'warning'}>
                {'Ingen perioder kan innvilges - Vi støtter ikke rent opphør ennå.'}
            </Alert>
        );
    }

    return (
        <>
            <Separator />
            <OmgjøringVedtaksperiodeVelger />
            <Separator />
            <InnvilgelsesperioderVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            {harValgtPeriode && (
                <>
                    <BehandlingBarnetillegg />
                    <Separator />
                    <RevurderingOmgjøringBrev />
                    <Separator />
                    <BehandlingBeregningOgSimulering />
                </>
            )}
        </>
    );
};

const Opphør = () => {
    return (
        <>
            <Separator />
            <OmgjøringVedtaksperiodeVelger />
            <Separator />
            <BegrunnelseVilkårsvurdering />
            <Separator />
            <RevurderingOmgjøringBrev />
            <Separator />
            <BehandlingBeregningOgSimulering />
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
