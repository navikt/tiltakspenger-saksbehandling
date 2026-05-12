import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useSettMeldekortbehandlingPåVent = (args: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    onSuccess?: (meldekortbehandling: MeldekortbehandlingProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<MeldekortbehandlingProps, { begrunnelse: string; frist: Nullable<string> }>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/vent`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useGjenopptaMeldekortbehandling = (args: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    onSuccess?: (meldekortbehandling: MeldekortbehandlingProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/gjenoppta`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useTaMeldekortbehandling = (args: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    onSuccess?: (meldekortbehandling: MeldekortbehandlingProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/ta`,
        'POST',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useLeggTilbakeMeldekortbehandling = (args: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    onSuccess?: (sak: SakProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/legg-tilbake`,
        'POST',
        { onSuccess: args.onSuccess, onError: args.onError },
    );
