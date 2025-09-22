import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { søknadsbehandlingValidering } from './søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import {
    BehandlingResultatDTO,
    SøknadsbehandlingVedtakAvslagDTO,
    SøknadsbehandlingVedtakDTO,
    SøknadsbehandlingVedtakIkkeValgtDTO,
    SøknadsbehandlingVedtakInnvilgelseDTO,
} from '~/types/VedtakTyper';
import { RevurderingResultat, SøknadsbehandlingResultat } from '~/types/BehandlingTypes';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';

export const SøknadsbehandlingSend = () => {
    const { behandling } = useSøknadsbehandling();
    const skjema = useBehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: søknadsbehandlingValidering(behandling, skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: BehandlingSkjemaContext): SøknadsbehandlingVedtakDTO => {
    switch (skjema.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                innvilgelsesperiode: skjema.behandlingsperiode as Periode,
                barnetillegg: skjema.harBarnetillegg
                    ? {
                          begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                          perioder: skjema.barnetilleggPerioder,
                      }
                    : {
                          perioder: [],
                      },
                valgteTiltaksdeltakelser: skjema.valgteTiltaksdeltakelser,
                antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map(
                    (dager) => ({
                        antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                        periode: {
                            fraOgMed: dager.periode.fraOgMed!,
                            tilOgMed: dager.periode.tilOgMed!,
                        },
                    }),
                ),
                resultat: BehandlingResultatDTO.INNVILGELSE,
            } satisfies SøknadsbehandlingVedtakInnvilgelseDTO;
        case SøknadsbehandlingResultat.AVSLAG:
            return {
                avslagsgrunner: skjema.avslagsgrunner!,
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: BehandlingResultatDTO.AVSLAG,
            } satisfies SøknadsbehandlingVedtakAvslagDTO;
        case null:
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: BehandlingResultatDTO.IKKE_VALGT,
            } satisfies SøknadsbehandlingVedtakIkkeValgtDTO;
        case RevurderingResultat.REVURDERING_INNVILGELSE:
        case RevurderingResultat.STANS:
            throw new Error(`Forventet søknadsbehandling men var revurdering - ${skjema.resultat}`);
    }

    throw new Error(
        `Ugyldig resultat for søknadsbehandling vedtak - ${skjema.resultat satisfies never}`,
    );
};
