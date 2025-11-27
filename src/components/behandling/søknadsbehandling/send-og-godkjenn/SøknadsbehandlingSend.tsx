import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { søknadsbehandlingValidering } from './søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    SøknadsbehandlingResultat,
    SøknadsbehandlingVedtakAvslagRequest,
    SøknadsbehandlingVedtakIkkeValgtRequest,
    SøknadsbehandlingVedtakInnvilgelseRequest,
    SøknadsbehandlingVedtakRequest,
} from '~/types/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
} from '~/components/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';

export const SøknadsbehandlingSend = () => {
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: søknadsbehandlingValidering(behandling, skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: SøknadsbehandlingSkjemaContext): SøknadsbehandlingVedtakRequest => {
    const { resultat } = skjema;

    switch (resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE: {
            const { innvilgelse, textAreas } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                return {
                    begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                    fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
                } satisfies SøknadsbehandlingVedtakIkkeValgtRequest;
            }

            const {
                innvilgelsesperiode,
                harBarnetillegg,
                barnetilleggPerioder,
                valgteTiltaksdeltakelser,
                antallDagerPerMeldeperiode,
            } = innvilgelse;

            return {
                begrunnelseVilkårsvurdering: textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                innvilgelsesperiode: innvilgelsesperiode,
                barnetillegg: harBarnetillegg
                    ? {
                          begrunnelse: textAreas.barnetilleggBegrunnelse.getValue(),
                          perioder: barnetilleggPerioder,
                      }
                    : {
                          begrunnelse: null,
                          perioder: [],
                      },
                valgteTiltaksdeltakelser: valgteTiltaksdeltakelser,
                antallDagerPerMeldeperiodeForPerioder: antallDagerPerMeldeperiode,
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
            } satisfies SøknadsbehandlingVedtakInnvilgelseRequest;
        }

        case SøknadsbehandlingResultat.AVSLAG: {
            return {
                avslagsgrunner: skjema.avslagsgrunner,
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.AVSLAG,
            } satisfies SøknadsbehandlingVedtakAvslagRequest;
        }

        case SøknadsbehandlingResultat.IKKE_VALGT: {
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            } satisfies SøknadsbehandlingVedtakIkkeValgtRequest;
        }
    }

    throw new Error(`Ugyldig resultat for søknadsbehandling vedtak - ${resultat satisfies never}`);
};
