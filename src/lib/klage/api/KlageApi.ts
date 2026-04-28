import {
    ForhåndsvisBrevKlageRequest,
    Klagebehandling,
    KlagebehandlingsresultatAvvist,
    KlagebehandlingsresultatOpprettholdt,
    KlageId,
    LagreBrevtekstKlageRequest,
    OppdaterKlageFormkravRequest,
    OpprettKlageRequest,
    OpprettOmgjøringsbehandlingForKlageRequest,
    VurderKlageRequest,
} from '~/lib/klage/typer/Klage';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';
import { useFetchBlobFraApi, useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';

export const useOpprettKlage = (args: {
    sakId: string;
    onSuccess: (klagebehandling: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling, OpprettKlageRequest>(`/sak/${args.sakId}/klage`, 'POST', {
        onSuccess: args.onSuccess,
    });

export const useOppdaterFormkrav = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling, OppdaterKlageFormkravRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/formkrav`,
        'PUT',
        { onSuccess: args.onSuccess },
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
}) =>
    useFetchJsonFraApi<SakProps, { begrunnelse: string }>(
        `/sak/${args.sakId}/klage/${args.klageId}/avbryt`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useTaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) =>
    useFetchJsonFraApi<SakProps>(`/sak/${args.sakId}/klage/${args.klageId}/ta`, 'PATCH', {
        onSuccess: args.onSuccess,
    });

export const useOvertaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) =>
    useFetchJsonFraApi<SakProps, { overtarFra: string }>(
        `/sak/${args.sakId}/klage/${args.klageId}/overta`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useLeggKlagebehandlingTilbake = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<SakProps>(`/sak/${args.sakId}/klage/${args.klageId}/legg-tilbake`, 'PATCH', {
        onSuccess: args.onSuccess,
        onError: args.onError,
    });

export const useSettKlagebehandlingPåVent = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) =>
    useFetchJsonFraApi<SakProps, { begrunnelse: string; frist: Nullable<string> }>(
        `/sak/${args.sakId}/klage/${args.klageId}/vent`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useGjenopptaKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
    onError?: (error: FetcherError) => void;
}) =>
    useFetchJsonFraApi<SakProps>(`/sak/${args.sakId}/klage/${args.klageId}/gjenoppta`, 'PATCH', {
        onSuccess: args.onSuccess,
        onError: args.onError,
    });

export const useForhåndsvisKlagebrev = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (blob: Blob) => void;
}) =>
    useFetchBlobFraApi<ForhåndsvisBrevKlageRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/forhandsvis`,
        'POST',
        { onSuccess: args.onSuccess },
    );

export const useLagreKlagebrev = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (
        klage: Klagebehandling & {
            resultat: KlagebehandlingsresultatOpprettholdt | KlagebehandlingsresultatAvvist;
        },
    ) => void;
}) =>
    useFetchJsonFraApi<
        Klagebehandling & {
            resultat: KlagebehandlingsresultatOpprettholdt | KlagebehandlingsresultatAvvist;
        },
        LagreBrevtekstKlageRequest
    >(`/sak/${args.sakId}/klage/${args.klageId}/brevtekst`, 'PUT', { onSuccess: args.onSuccess });

export const useIverksettKlage = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling>(
        `/sak/${args.sakId}/klage/${args.klageId}/iverksett`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useOpprettholdKlage = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling>(
        `/sak/${args.sakId}/klage/${args.klageId}/oppretthold`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useFerdigstillKlage = (args: {
    sakId: string;
    klageId: KlageId;
    begrunnelse: Nullable<string>;
    onSuccess: (klage: Klagebehandling) => void;
}) =>
    useFetchJsonFraApi<Klagebehandling, { begrunnelse: Nullable<string> }>(
        `/sak/${args.sakId}/klage/${args.klageId}/ferdigstill`,
        'PATCH',
        { onSuccess: args.onSuccess },
    );

export const useVisInnstillingsbrevKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    dokumentInfoId: string;
    onSuccess: (blob: Blob) => void;
}) =>
    useFetchBlobFraApi(
        `/sak/${args.sakId}/klage/${args.klageId}/innstillingsbrev/${args.dokumentInfoId}`,
        'GET',
        { onSuccess: args.onSuccess },
    );
