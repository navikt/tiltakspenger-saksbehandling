import { useRevurderingBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { BehandlingSendOgGodkjenn } from '~/lib/rammebehandling/felles/send-og-godkjenn/BehandlingSendOgGodkjenn';
import { useHentBehandlingLagringProps } from '~/lib/rammebehandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { OppdaterRevurderingInnvilgelseDTO, RevurderingResultat } from '~/types/Revurdering';
import {
    RevurderingInnvilgelseContext,
    useRevurderingInnvilgelseSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { Nullable } from '~/types/UtilTypes';
import { useSak } from '~/context/sak/SakContext';

export const RevurderingInnvilgelseSend = () => {
    const { behandling } = useRevurderingBehandling();
    const vedtak = useRevurderingInnvilgelseSkjema();
    const { sak } = useSak();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(vedtak),
        skjema: vedtak,
        validerSkjema: () => revurderingInnvilgelseValidering(behandling, vedtak, sak),
    });

    return <BehandlingSendOgGodkjenn behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (
    skjema: RevurderingInnvilgelseContext,
): Nullable<OppdaterRevurderingInnvilgelseDTO> => {
    const { innvilgelse } = skjema;

    if (!innvilgelse.harValgtPeriode) {
        return null;
    }

    return {
        resultat: RevurderingResultat.INNVILGELSE,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        innvilgelsesperioder: innvilgelse.innvilgelsesperioder,
        barnetillegg: innvilgelse.harBarnetillegg
            ? {
                  begrunnelse: skjema.textAreas.barnetilleggBegrunnelse.getValue(),
                  perioder: innvilgelse.barnetilleggPerioder,
              }
            : {
                  begrunnelse: null,
                  perioder: [],
              },
        skalSendeVedtaksbrev: innvilgelse.skalSendeVedtaksbrev,
    };
};
