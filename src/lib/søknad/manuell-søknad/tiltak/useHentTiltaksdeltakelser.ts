import useSWR, { mutate } from 'swr';
import { nonNullish } from '~/utils/object';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { ManuellSøknadTiltak } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { SakId } from '~/lib/sak/SakTyper';

/**
 * Tiltak som fratar rett til tiltakspenger (i første omgang lønnstilskudd) har ingen typeKode.
 * De vises for saksbehandler, men kan ikke velges.
 */
export type TiltaksdeltakelseFraRegister = Omit<ManuellSøknadTiltak, 'typeKode'> & {
    typeKode: string | null;
    fratarRett: boolean;
};

export type TiltaksdeltakelseSomGirRettFraRegister = TiltaksdeltakelseFraRegister & {
    typeKode: string;
    fratarRett: false;
};

export const girRettTilTiltakspenger = (
    tiltak: TiltaksdeltakelseFraRegister,
): tiltak is TiltaksdeltakelseSomGirRettFraRegister =>
    !tiltak.fratarRett && tiltak.typeKode !== null;

export const useHentTiltaksdeltakelser = (
    sakId: SakId,
    fraOgMed?: string,
    tilOgMed?: string,
    enabled: boolean = true,
) => {
    const harPeriode = !!fraOgMed && !!tilOgMed;
    const { data, isLoading, error } = useSWR<TiltaksdeltakelseFraRegister[]>(
        enabled && harPeriode ? ['tiltaksdeltakelser', sakId, fraOgMed, tilOgMed] : null,
        () => fetcher(sakId, nonNullish(fraOgMed), nonNullish(tilOgMed)),
    );
    return { data, isLoading, error, mutate };
};

const fetcher = async (sakId: SakId, fraOgMed: string, tilOgMed: string) =>
    fetchJsonFraApiClientSide<TiltaksdeltakelseFraRegister[]>(
        `/sak/${sakId}/tiltaksdeltakelser?fraOgMed=${encodeURIComponent(fraOgMed)}&tilOgMed=${encodeURIComponent(tilOgMed)}`,
    );
