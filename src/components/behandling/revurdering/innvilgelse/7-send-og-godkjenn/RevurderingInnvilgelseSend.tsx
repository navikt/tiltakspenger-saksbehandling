import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingResultat, RevurderingVedtakInnvilgelseRequest } from '~/types/Revurdering';
import {
    RevurderingInnvilgelseContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';

export const RevurderingInnvilgelseSend = () => {
    const { behandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        skjema: vedtak,
        validerSkjema: () => revurderingInnvilgelseValidering(behandling, vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: RevurderingInnvilgelseContext): RevurderingVedtakInnvilgelseRequest => {
    const { innvilgelse } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        throw Error('Innvilgelsesperioden må være valgt');
    }

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: innvilgelse.innvilgelsesperiode,
        valgteTiltaksdeltakelser: innvilgelse.valgteTiltaksdeltakelser,
        barnetillegg: innvilgelse.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: innvilgelse.barnetilleggPerioder,
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
        antallDagerPerMeldeperiodeForPerioder: innvilgelse.antallDagerPerMeldeperiode,
    };
};
