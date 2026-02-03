import {
    Klagebehandling,
    KlageId,
    OppdaterKlageFormkravRequest,
    OpprettOmgjøringsbehandlingForKlageRequest,
    VurderKlageRequest,
} from '~/types/Klage';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { FetcherError } from '~/utils/fetch/fetch';
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
    useFetchJsonFraApi<Rammebehandling, OpprettOmgjøringsbehandlingForKlageRequest>(
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

export const useTaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) => {
    return useFetchJsonFraApi<SakProps>(`/sak/${args.sakId}/klage/${args.klageId}/ta`, 'PATCH', {
        onSuccess: args.onSuccess,
    });
};

export const useOvertaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) => {
    return useFetchJsonFraApi<SakProps, { overtarFra: string }>(
        `/sak/${args.sakId}/klage/${args.klageId}/overta`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );
};

export const useLeggKlagebehandlingTilbake = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
    onError?: (error: FetcherError) => void;
}) => {
    return useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/klage/${args.klageId}/legg-tilbake`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );
};

export const useSettKlagebehandlingPåVent = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) => {
    return useFetchJsonFraApi<SakProps, { begrunnelse: string }>(
        `/sak/${args.sakId}/klage/${args.klageId}/vent`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );
};

export const useGjenopptaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
    onError?: (error: FetcherError) => void;
}) => {
    return useFetchJsonFraApi<SakProps>(
        `/sak/${args.sakId}/klage/${args.klageId}/gjenoppta`,
        'PATCH',
        { onSuccess: args.onSuccess, onError: args.onError },
    );
};
