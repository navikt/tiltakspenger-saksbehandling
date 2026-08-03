import {
    OmgjøringContext,
    useOmgjøringSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Nullable } from '~/types/UtilTypes';
import {
    RevurderingResultat,
    OppdaterOmgjøringInnvilgelseDTO,
    OppdaterOmgjøringDTO,
    OppdaterOmgjøringOpphørDTO,
    OppdaterOmgjøringIkkeValgtDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import { useHentBehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { revurderingOmgjøringValidering } from '~/lib/rammebehandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { RammebehandlingHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingHandlinger';

export const RevurderingOmgjøringHandlinger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();
    const skjema = useOmgjøringSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema,
        validerSkjema: () => revurderingOmgjøringValidering(behandling, skjema, sak),
    });

    return <RammebehandlingHandlinger behandling={behandling} lagringProps={lagringProps} />;
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
                skalSendeVedtaksbrev: innvilgelse.skalSendeVedtaksbrev,
            } satisfies OppdaterOmgjøringInnvilgelseDTO;
        }

        case RevurderingResultat.OMGJØRING_OPPHØR: {
            const { vedtaksperiode, textAreas, valgteHjemler } = skjema;

            return {
                resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                fritekstTilVedtaksbrev: textAreas.brevtekst.getValue(),
                begrunnelseVilkårsvurdering: textAreas.begrunnelse.getValue(),
                vedtaksperiode,
                valgteHjemler,
                skalSendeVedtaksbrev: skjema.skalSendeVedtaksbrev,
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
