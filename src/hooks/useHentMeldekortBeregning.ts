import useSWR from "swr";
import {fetcher} from "../utils/http";
import {MeldekortBeregningDTO} from "../types/MeldekortTypes";

export function useHentMeldekortBeregning(meldekortId?: string) {
    let {
        data: meldekortBeregning,
        mutate,
        isLoading,
        error
    } = useSWR<MeldekortBeregningDTO>(
        meldekortId && `/api/hentBeregning/${meldekortId}`,
        fetcher
    );

    return {meldekortBeregning, mutate, isLoading, error};
}
