import { useSøknadsbehandling } from '../../context/BehandlingContext';
import { søknadsbehandlingValidering } from './søknadsbehandlingValidering';
import { BehandlingSendOgGodkjenn } from '~/lib/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/lib/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import {
    SøknadsbehandlingResultat,
    OppdaterSøknadsbehandlingAvslagDTO,
    OppdaterSøknadsbehandlingIkkeValgtDTO,
    OppdaterSøknadsbehandlingInnvilgelseDTO,
    OppdaterSøknadsbehandlingDTO,
} from '~/types/Søknadsbehandling';
import {
    SøknadsbehandlingSkjemaContext,
    useSøknadsbehandlingSkjema,
} from '~/lib/behandling/context/søknadsbehandling/søknadsbehandlingSkjemaContext';
import { Nullable } from '~/types/UtilTypes';
import { useSak } from '~/context/sak/SakContext';

export const SøknadsbehandlingSend = () => {
    const { sak } = useSak();
    const { behandling } = useSøknadsbehandling();
    const skjema = useSøknadsbehandlingSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema: skjema,
        validerSkjema: søknadsbehandlingValidering(sak, behandling, skjema),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: SøknadsbehandlingSkjemaContext): Nullable<OppdaterSøknadsbehandlingDTO> => {
    const { resultat } = skjema;

    switch (resultat) {
        case SøknadsbehandlingResultat.INNVILGELSE: {
            const { innvilgelse, textAreas } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                return null;
            }

            const { innvilgelsesperioder, harBarnetillegg, barnetilleggPerioder } = innvilgelse;

            return {
                begrunnelseVilkårsvurdering: textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                innvilgelsesperioder,
                barnetillegg: harBarnetillegg
                    ? {
                          begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                          perioder: barnetilleggPerioder,
                      }
                    : {
                          begrunnelse: null,
                          perioder: [],
                      },
                resultat: SøknadsbehandlingResultat.INNVILGELSE,
                skalSendeVedtaksbrev: innvilgelse.skalSendeVedtaksbrev,
            } satisfies OppdaterSøknadsbehandlingInnvilgelseDTO;
        }

        case SøknadsbehandlingResultat.AVSLAG: {
            return {
                avslagsgrunner: skjema.avslagsgrunner,
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.AVSLAG,
                skalSendeVedtaksbrev: skjema.skalSendeVedtaksbrev,
            } satisfies OppdaterSøknadsbehandlingAvslagDTO;
        }

        case SøknadsbehandlingResultat.IKKE_VALGT: {
            return {
                begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
                resultat: SøknadsbehandlingResultat.IKKE_VALGT,
            } satisfies OppdaterSøknadsbehandlingIkkeValgtDTO;
        }
    }

    throw new Error(`Ugyldig resultat for søknadsbehandling vedtak - ${resultat satisfies never}`);
};
