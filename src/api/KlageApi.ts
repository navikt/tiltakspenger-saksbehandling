import {
    Klagebehandling,
    KlageId,
    OppdaterKlageFormkravRequest,
    VurderKlageRequest,
} from '~/types/Klage';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useOppdaterFormkrav = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling, OppdaterKlageFormkravRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/formkrav`,
        'PUT',
        {
            onSuccess: args.onSuccess,
        },
    );

export const useVurderKlage = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling, VurderKlageRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/vurder`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useOpprettRammebehandlingForKlage = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (rammebehandling: Rammebehandling) => void;
}) =>
    useFetchJsonFraApi<Rammebehandling>(
        `/sak/${args.sakId}/klage/${args.klageId}/opprettRammebehandling`,
        'POST',
        { onSuccess: args.onSuccess },
    );

export const useAvbrytKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) => {
    return useFetchJsonFraApi<SakProps, { begrunnelse: string }>(
        `/sak/${args.sakId}/klage/${args.klageId}/avbryt`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );
};
