import { tilSkalJournalføreNotatDTO } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { RammebehandlingHandlinger } from '~/lib/rammebehandling/felles/handlinger/RammebehandlingHandlinger';
import { useHentBehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import {
    OppdaterRevurderingForlengelseDTO,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    hentForlengelseTilOgMed,
    RevurderingForlengelseContext,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';
import { revurderingForlengelseValidering } from '~/lib/rammebehandling/revurdering/forlengelse/revurderingForlengelseValidering';
import { Nullable } from '~/types/UtilTypes';
import { useSak } from '~/lib/sak/SakContext';
import { tilOppdaterPrioriteringDTO } from '~/lib/_felles/prioritering/prioriteringUtils';

export const RevurderingForlengelseHandlinger = () => {
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const { sak } = useSak();

    const lagringProps = useHentBehandlingLagringProps({
        hentDTO: () => tilDTO(skjema),
        skjema,
        validerSkjema: () => revurderingForlengelseValidering(behandling, skjema, sak),
    });

    return <RammebehandlingHandlinger behandling={behandling} lagringProps={lagringProps} />;
};

const tilDTO = (
    skjema: RevurderingForlengelseContext,
): Nullable<OppdaterRevurderingForlengelseDTO> => {
    const { innvilgelse, harEndretBarnetillegg } = skjema;
    const tilOgMed = hentForlengelseTilOgMed(skjema);

    if (!innvilgelse.harValgtPeriode || !tilOgMed) {
        return null;
    }

    return {
        resultat: RevurderingResultat.FORLENGELSE,
        tilOgMed,
        begrunnelseVilkårsvurdering: skjema.textAreas.begrunnelse.getValue(),
        fritekstTilVedtaksbrev: skjema.textAreas.brevtekst.getValue(),
        skalJournalføreNotat: tilSkalJournalføreNotatDTO(skjema),
        prioritering: tilOppdaterPrioriteringDTO(
            skjema.erPrioritert,
            skjema.textAreas.prioriteringBegrunnelse.getValue(),
        ),
        // Null betyr at backend utleder barnetillegget fra vedtaket som forlenges.
        barnetillegg: harEndretBarnetillegg
            ? {
                  begrunnelse: innvilgelse.harBarnetillegg
                      ? skjema.textAreas.barnetilleggBegrunnelse.getValue()
                      : null,
                  perioder: innvilgelse.harBarnetillegg ? innvilgelse.barnetilleggPerioder : [],
              }
            : null,
        skalSendeVedtaksbrev: innvilgelse.skalSendeVedtaksbrev,
    };
};
