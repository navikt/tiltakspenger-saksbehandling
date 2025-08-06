import { RevurderingResultat } from '~/types/BehandlingTypes';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    RevurderingInnvilgelseVedtakContext,
    useRevurderingInnvilgelseSkjema,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { RevurderingVedtakInnvilgelseDTO } from '~/types/VedtakTyper';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { useSak } from '~/context/sak/SakContext';

export const RevurderingInnvilgelseKnapper = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingBehandling();
    const vedtakSkjema = useRevurderingInnvilgelseSkjema();

    return (
        <BehandlingSendOgGodkjenn
            behandling={behandling}
            hentVedtakDTO={() => tilBeslutningDTO(vedtakSkjema)}
            validering={() => revurderingInnvilgelseValidering(sak, behandling, vedtakSkjema)}
        />
    );
};

const tilBeslutningDTO = (
    vedtak: RevurderingInnvilgelseVedtakContext,
): RevurderingVedtakInnvilgelseDTO => {
    return {
        resultat: RevurderingResultat.REVURDERING_INNVILGELSE,
        begrunnelseVilkårsvurdering: vedtak.getBegrunnelse(),
        fritekstTilVedtaksbrev: vedtak.getBrevtekst(),
        innvilgelsesperiode: vedtak.behandlingsperiode,
        valgteTiltaksdeltakelser: vedtak.valgteTiltaksdeltakelser,
        barnetillegg: vedtak.harBarnetillegg
            ? {
                  begrunnelse: vedtak.getBarnetilleggBegrunnelse(),
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
