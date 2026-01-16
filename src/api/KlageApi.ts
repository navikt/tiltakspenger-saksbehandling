import { Klagebehandling, KlageId, OppdaterKlageFormkravRequest } from '~/types/Klage';
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
