import useSWR from "swr";
import {fetcher} from "../utils/http";
import {MeldekortBeregningDTO} from "../types/MeldekortTypes";

export function useHentMeldekortBeregning(meldekortId?: string) {
    const {
        data: meldekortBeregning,
        mutate,
        isLoading,
        error
    } = useSWR<MeldekortBeregningDTO>(
        meldekortId && `/api/meldekort/hentBeregning/${meldekortId}`,
        fetcher
    );

    return {meldekortBeregning, mutate, isLoading, error};
}
