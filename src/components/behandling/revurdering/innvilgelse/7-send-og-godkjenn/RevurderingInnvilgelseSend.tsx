import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    RevurderingInnvilgelseVedtakContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { BehandlingResultatDTO, RevurderingVedtakInnvilgelseDTO } from '~/types/VedtakTyper';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { useSak } from '~/context/sak/SakContext';

export const RevurderingInnvilgelseSend = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        vedtak,
        validerVedtak: () => revurderingInnvilgelseValidering(sak, behandling, vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (vedtak: RevurderingInnvilgelseVedtakContext): RevurderingVedtakInnvilgelseDTO => {
    return {
        resultat: BehandlingResultatDTO.REVURDERING_INNVILGELSE,
        begrunnelseVilkårsvurdering: vedtak.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: vedtak.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: vedtak.behandlingsperiode,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: vedtak.barnetilleggPerioder,
              }
            : null,
        antallDagerPerMeldeperiodeForPerioder: vedtak.antallDagerPerMeldeperiode.map((periode) => ({
            antallDagerPerMeldeperiode: periode.antallDagerPerMeldeperiode!,
            periode: {
                fraOgMed: periode.periode.fraOgMed!,
                tilOgMed: periode.periode.tilOgMed!,
            },
        })),
    };
};
