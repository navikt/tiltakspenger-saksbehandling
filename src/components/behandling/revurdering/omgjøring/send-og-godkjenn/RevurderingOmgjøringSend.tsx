import {
    RevurderingOmgjøringContext,
    useRevurderingOmgjøringSkjema,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { Nullable } from '~/types/UtilTypes';
import { RevurderingResultat, RevurderingVedtakOmgjøringRequest } from '~/types/Revurdering';
import { useHentBehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingOmgjøringValidering } from '~/components/behandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { BehandlingSendOgGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';

export const RevurderingOmgjøringSend = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();
    const skjema = useRevurderingOmgjøringSkjema();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema,
        validerSkjema: () => revurderingOmgjøringValidering(behandling, skjema, sak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (
    skjema: RevurderingOmgjøringContext,
): Nullable<RevurderingVedtakOmgjøringRequest> => {
    const { innvilgelse, vedtaksperiode } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        return null;
    }

    return {
        resultat: RevurderingResultat.OMGJØRING,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        vedtaksperiode,
        barnetillegg: innvilgelse.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: innvilgelse.barnetilleggPerioder,
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
    };
};
