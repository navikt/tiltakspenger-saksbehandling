import useSWR, { mutate } from 'swr';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { ManuellSøknadTiltak } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { SakId } from '~/lib/sak/SakTyper';

export const useHentTiltaksdeltakelser = (
    sakId: SakId,
    fraOgMed?: string,
    tilOgMed?: string,
    enabled: boolean = true,
) => {
    const harPeriode = !!fraOgMed && !!tilOgMed;
    const { data, isLoading, error } = useSWR<ManuellSøknadTiltak[]>(
        enabled && harPeriode ? ['tiltaksdeltakelser', sakId, fraOgMed, tilOgMed] : null,
        () => fetcher(sakId, fraOgMed!, tilOgMed!),
    );
    return { data, isLoading, error, mutate };
};

const fetcher = async (sakId: SakId, fraOgMed: string, tilOgMed: string) =>
    fetchJsonFraApiClientSide<ManuellSøknadTiltak[]>(
        `/sak/${sakId}/tiltaksdeltakelser?fraOgMed=${encodeURIComponent(fraOgMed)}&tilOgMed=${encodeURIComponent(tilOgMed)}`,
    );
