import { Alert } from '@navikt/ds-react';
import { Separator } from '~/lib/_felles/separator/Separator';
import { BehandlingBeregningOgSimulering } from '../../felles/beregning-og-simulering/BehandlingBeregningOgSimulering';
import { useRevurderingBehandling, useRevurderingOmgjøring } from '../../context/BehandlingContext';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '~/utils/behandling';
import { useOmgjøringSkjema } from '~/lib/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { InnvilgelsesperioderVelger } from '~/lib/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVelger';
import { BehandlingBarnetillegg } from '~/lib/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { BegrunnelseVilkårsvurdering } from '~/lib/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { RevurderingOmgjøringBrev } from '~/lib/behandling/revurdering/omgjøring/brev/RevurderingOmgjøringBrev';
import { RevurderingOmgjøringSend } from '~/lib/behandling/revurdering/omgjøring/send-og-godkjenn/RevurderingOmgjøringSend';
import { RevurderingOmgjøringHeader } from '~/lib/behandling/revurdering/omgjøring/header/RevurderingOmgjøringHeader';
import { RevurderingResultat } from '~/types/Revurdering';
import { OmgjøringResultatVelger } from '~/lib/behandling/revurdering/omgjøring/resultat-velger/OmgjøringResultatVelger';
import { OmgjøringOpphørVelger } from '~/lib/behandling/revurdering/omgjøring/opphør/OmgjøringOpphørVelger';
import { OmgjøringInnvilgelseVedtaksperiodeVelger } from '~/lib/behandling/revurdering/omgjøring/innvilgelse/OmgjøringInnvilgelseVedtaksperiodeVelger';
import { RevurderingAutomatiskOpprettetGrunn } from '~/lib/behandling/revurdering/felles/automatisk-opprettet-grunn/RevurderingAutomatiskOpprettetGrunn';

export const RevurderingOmgjøringVedtak = () => {
    const skjema = useOmgjøringSkjema();
    const { resultat } = skjema;

    const { automatiskOpprettetGrunn } = useRevurderingBehandling().behandling;

    return (
        <>
            <RevurderingOmgjøringHeader />
            {automatiskOpprettetGrunn && (
                <>
                    <Separator />
                    <RevurderingAutomatiskOpprettetGrunn
                        automatiskOpprettetGrunn={automatiskOpprettetGrunn}
                    />
                </>
            )}
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
    const kanInnvilges = hentTiltaksdeltakelserMedStartOgSluttdato(behandling).length > 0;

    if (!kanInnvilges) {
        return (
            <>
                <Alert variant={'warning'}>
                    {'Fant ingen tiltaksdeltakelser det kan innvilges for.'}
                </Alert>
                <Separator />
            </>
        );
    }

    return (
        <>
            <Separator />
            <OmgjøringInnvilgelseVedtaksperiodeVelger />
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
            <OmgjøringOpphørVelger />
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
