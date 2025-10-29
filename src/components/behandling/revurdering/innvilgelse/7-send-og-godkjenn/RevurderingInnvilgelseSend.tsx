import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingInnvilgelseValidering } from '~/components/behandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';
import { RevurderingResultat, RevurderingVedtakInnvilgelseRequest } from '~/types/Revurdering';
import { tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode } from '~/components/behandling/søknadsbehandling/9-send-og-godkjenn/SøknadsbehandlingSend';
import { barnetilleggPeriodeFormDataTilBarnetilleggPeriode } from '../6-brev/RevurderingInnvilgelseBrev';

export const RevurderingInnvilgelseSend = () => {
    const { behandling } = useRevurderingBehandling();
    const vedtak = useBehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        skjema: vedtak,
        validerSkjema: () => revurderingInnvilgelseValidering(behandling, vedtak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: BehandlingSkjemaContext): RevurderingVedtakInnvilgelseRequest => {
    return {
        resultat: RevurderingResultat.INNVILGELSE,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperiode: skjema.behandlingsperiode as Periode,
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
