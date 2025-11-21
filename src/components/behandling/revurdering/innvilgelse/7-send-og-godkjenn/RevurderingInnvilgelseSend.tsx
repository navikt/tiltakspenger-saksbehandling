import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingResultat, RevurderingVedtakInnvilgelseRequest } from '~/types/Revurdering';
import { tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode } from '~/components/behandling/søknadsbehandling/send-og-godkjenn/SøknadsbehandlingSend';
import { barnetilleggPeriodeFormDataTilBarnetilleggPeriode } from '../6-brev/RevurderingInnvilgelseBrev';
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
    return {
        resultat: RevurderingResultat.INNVILGELSE,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: skjema.behandlingsperiode,
        valgteTiltaksdeltakelser: tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode(
            skjema.valgteTiltaksdeltakelser,
        ),
        barnetillegg: skjema.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: barnetilleggPeriodeFormDataTilBarnetilleggPeriode(
                      skjema.barnetilleggPerioder,
                  ),
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
        antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map((periode) => ({
            antallDagerPerMeldeperiode: periode.antallDagerPerMeldeperiode!,
            periode: {
                fraOgMed: periode.periode!.fraOgMed!,
                tilOgMed: periode.periode!.tilOgMed!,
            },
        })),
    };
};
