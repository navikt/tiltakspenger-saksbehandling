import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { BehandlingResultatDTO, RevurderingVedtakInnvilgelseDTO } from '~/types/VedtakTyper';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { useSak } from '~/context/sak/SakContext';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingInnvilgelseSend = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingBehandling();
    const vedtak = useBehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        skjema: vedtak,
        validerSkjema: () => revurderingInnvilgelseValidering(sak, behandling, vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: BehandlingSkjemaContext): RevurderingVedtakInnvilgelseDTO => {
    return {
        resultat: BehandlingResultatDTO.REVURDERING_INNVILGELSE,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: skjema.behandlingsperiode,
        valgteTiltaksdeltakelser: skjema.valgteTiltaksdeltakelser,
        barnetillegg: skjema.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: skjema.barnetilleggPerioder,
              }
            : {
                  perioder: [],
              },
        antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map((periode) => ({
            antallDagerPerMeldeperiode: periode.antallDagerPerMeldeperiode!,
            periode: {
                fraOgMed: periode.periode.fraOgMed!,
                tilOgMed: periode.periode.tilOgMed!,
            },
        })),
    };
};
