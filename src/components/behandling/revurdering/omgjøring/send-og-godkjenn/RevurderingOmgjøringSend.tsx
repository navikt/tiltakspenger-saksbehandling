import {
    OmgjøringContext,
    useOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Nullable } from '~/types/UtilTypes';
import {
    RevurderingResultat,
    OppdaterOmgjøringInnvilgelseDTO,
    OppdaterOmgjøringDTO,
    OppdaterOmgjøringOpphørDTO,
    OppdaterOmgjøringIkkeValgtDTO,
} from '~/types/Revurdering';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

export const RevurderingOmgjøringSend = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();
    const skjema = useOmgjøringSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema,
        validerSkjema: () => revurderingOmgjøringValidering(behandling, skjema, sak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (skjema: OmgjøringContext): Nullable<OppdaterOmgjøringDTO> => {
    switch (skjema.resultat) {
        case RevurderingResultat.OMGJØRING: {
            const { innvilgelse, vedtaksperiode, textAreas } = skjema;

            if (!innvilgelse.harValgtPeriode) {
                return null;
            }

            return {
                resultat: RevurderingResultat.OMGJØRING,
                begrunnelseVilkårsvurdering: textAreas.begrunnelse.getValue(),
                fritekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
                vedtaksperiode,
                barnetillegg: innvilgelse.harBarnetillegg
                    ? {
                          begrunnelse: textAreas.barnetilleggBegrunnelse.getValue(),
                          perioder: innvilgelse.barnetilleggPerioder,
                      }
                    : {
                          begrunnelse: null,
                          perioder: [],
                      },
            } satisfies OppdaterOmgjøringInnvilgelseDTO;
        }

        case RevurderingResultat.OMGJØRING_OPPHØR: {
            const { vedtaksperiode, textAreas } = skjema;

            return {
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                fritekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                begrunnelseVilkårsvurdering: textAreas.begrunnelse.getValue(),
                vedtaksperiode,
            } satisfies OppdaterOmgjøringOpphørDTO;
        }

        case RevurderingResultat.OMGJØRING_IKKE_VALGT: {
            return {
                resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
                fritekstTilVedtaksbrev: null,
                begrunnelseVilkårsvurdering: null,
            } satisfies OppdaterOmgjøringIkkeValgtDTO;
        }
    }
};
