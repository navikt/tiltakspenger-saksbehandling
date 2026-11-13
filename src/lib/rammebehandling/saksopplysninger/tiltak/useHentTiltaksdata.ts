import useSWR from 'swr';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Tidspunkt } from '~/types/DatoTid';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

/**
 * Opplysninger om et tiltak i saksopplysningene som ikke lagres i behandlingen, men slås opp i kilden ved behov.
 * Deltakelser som fratar rett har ingen intern id.
 */
export type Tiltaksdata = {
    eksternDeltakelseId: string;
    internDeltakelseId: Nullable<string>;
    /**
     * Hele tiltaksnavnet, typisk "Tiltakstype hos Arrangør".
     * Er null når bruker har adressebeskyttelse, eller deltakelsen ikke har noen tittel i kilden.
     */
    tittel: SladdbarVerdi<Nullable<string>>;
};

export type TiltaksdataOppslag = {
    tiltaksdata: Tiltaksdata[] | undefined;
    isLoading: boolean;
    error: unknown;
};

/**
 * Oppslagstidspunktet for saksopplysningene er med i nøkkelen.
 * Da hentes dataene på nytt når saksopplysningene oppdateres og tiltakene kan ha endret seg.
 */
export const useHentTiltaksdata = (
    sakId: SakId,
    behandlingId: RammebehandlingId,
    oppslagstidspunkt: Tidspunkt,
): TiltaksdataOppslag => {
    const { data, isLoading, error } = useSWR<Tiltaksdata[]>(
        ['tiltaksdata', sakId, behandlingId, oppslagstidspunkt],
        () =>
            fetchJsonFraApiClientSide<Tiltaksdata[]>(
                `/sak/${sakId}/behandling/${behandlingId}/tiltaksdata`,
            ),
    );
    return { tiltaksdata: data, isLoading, error };
};
