import {
    MeldekortbehandlingId,
    OppdaterMeldekortbehandlingDTO,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type MeldekortApiProps = {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    onSuccess?: (response: SakProps) => void;
    onError?: (error: FetcherError) => void;
};

export const useSettMeldekortbehandlingPåVent = (args: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps, { begrunnelse: string; frist: Nullable<string> }>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/vent`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useGjenopptaMeldekortbehandling = (args: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/gjenoppta`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useTaMeldekortbehandling = (args: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/ta`,
        'POST',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useLeggTilbakeMeldekortbehandling = (args: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/meldekort/${args.meldekortbehandlingId}/legg-tilbake`,
        'POST',
        { onSuccess: args.onSuccess, onError: args.onError },
    );

export const useOppdaterMeldekortbehandling = ({
    sakId,
    meldekortbehandlingId,
    onSuccess,
    onError,
}: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps, OppdaterMeldekortbehandlingDTO>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/oppdater`,
        'POST',
        { onSuccess, onError },
    );

export const useSendMeldekortbehandlingTilBeslutning = ({
    sakId,
    meldekortbehandlingId,
    onSuccess,
    onError,
}: MeldekortApiProps) =>
    useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/sendtilbeslutning`,
        'POST',
        {
            onSuccess,
            onError,
        },
    );
