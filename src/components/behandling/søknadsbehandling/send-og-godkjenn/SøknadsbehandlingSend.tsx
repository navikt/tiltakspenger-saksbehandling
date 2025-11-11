import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { søknadsbehandlingValidering } from './søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    BehandlingSkjemaContext,
    useBehandlingSkjema,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { Periode } from '~/types/Periode';
import {
    SøknadsbehandlingResultat,
    SøknadsbehandlingVedtakAvslagRequest,
    SøknadsbehandlingVedtakIkkeValgtRequest,
    SøknadsbehandlingVedtakInnvilgelseRequest,
    SøknadsbehandlingVedtakRequest,
} from '~/types/Søknadsbehandling';

import { TiltaksdeltakelsePeriodeFormData } from '../../context/slices/TiltaksdeltagelseState';
import { barnetilleggPeriodeFormDataTilBarnetilleggPeriode } from '../../revurdering/innvilgelse/6-brev/RevurderingInnvilgelseBrev';
import { TiltaksdeltakelsePeriode } from '~/types/TiltakDeltagelseTypes';
import { RevurderingResultat } from '~/types/Revurdering';

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

const tilDTO = (skjema: BehandlingSkjemaContext): SøknadsbehandlingVedtakRequest => {
    switch (skjema.resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE:
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                innvilgelsesperiode: skjema.behandlingsperiode as Periode,
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
                valgteTiltaksdeltakelser: tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode(
                    skjema.valgteTiltaksdeltakelser,
                ),
                antallDagerPerMeldeperiodeForPerioder: skjema.antallDagerPerMeldeperiode.map(
                    (dager) => ({
                        antallDagerPerMeldeperiode: dager.antallDagerPerMeldeperiode!,
                        periode: {
                            fraOgMed: dager.periode!.fraOgMed!,
                            tilOgMed: dager.periode!.tilOgMed!,
                        },
                    }),
                ),
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
            } satisfies SøknadsbehandlingVedtakInnvilgelseRequest;
        case SøknadsbehandlingResultat.AVSLAG:
            return {
                avslagsgrunner: skjema.avslagsgrunner!,
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.AVSLAG,
            } satisfies SøknadsbehandlingVedtakAvslagRequest;
        case SøknadsbehandlingResultat.IKKE_VALGT:
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            } satisfies SøknadsbehandlingVedtakIkkeValgtRequest;
        case RevurderingResultat.INNVILGELSE:
        case RevurderingResultat.STANS:
        case RevurderingResultat.OMGJØRING:
            throw new Error(`Forventet søknadsbehandling men var revurdering - ${skjema.resultat}`);
    }

    throw new Error(
        `Ugyldig resultat for søknadsbehandling vedtak - ${skjema.resultat satisfies never}`,
    );
};

export const tiltaksdeltakelsePeriodeFormToTiltaksdeltakelsePeriode = (
    valgteTiltaksdeltakelser: TiltaksdeltakelsePeriodeFormData[],
): TiltaksdeltakelsePeriode[] => {
    return valgteTiltaksdeltakelser.map((periode) => ({
        eksternDeltagelseId: periode.eksternDeltagelseId,
        //validering skal fange at innholdet er utfylt
        periode: periode.periode as Periode,
    }));
};
