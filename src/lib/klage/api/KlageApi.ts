import {
    AvbrytKlagebehandlingStatus,
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
import {
    useFetchBlobFraApi,
    useFetchJsonFraApi,
    useFetchResponseFromApi,
} from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

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
    onSuccess: (behandling: Rammebehandling | MeldekortbehandlingPropsV2) => void;
}) =>
    useFetchJsonFraApi<Rammebehandling, OpprettOmgjøringsbehandlingForKlageRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/opprettBehandling`,
        'POST',
        { onSuccess: args.onSuccess },
    );

export const useAvbrytKlagebehandling = (args: {
    sakId: string;
    klageId: KlageId;
    onSuccess: (sak: SakProps) => void;
}) =>
    useFetchJsonFraApi<
        SakProps,
        { status: AvbrytKlagebehandlingStatus; begrunnelse: Nullable<string> }
    >(`/sak/${args.sakId}/klage/${args.klageId}/avbryt`, 'PATCH', { onSuccess: args.onSuccess });

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
    onSuccess: (blobs: Blob[]) => void;
}) =>
    useFetchResponseFromApi<ForhåndsvisBrevKlageRequest>(
        `/sak/${args.sakId}/klage/${args.klageId}/forhandsvis`,
        'POST',
        {
            onSuccess: async (response) => {
                const contentType = response.headers.get('content-type');

                if (contentType?.includes('multipart')) {
                    const pdfs = await parseMultipartPdfs(response);
                    args.onSuccess(pdfs);
                } else {
                    response.blob().then((blob) => {
                        args.onSuccess([blob]);
                    });
                }
            },
        },
    );

const parseMultipartPdfs = async (response: Response): Promise<Blob[]> => {
    const boundary = response.headers.get('content-type')?.split('boundary=')[1];
    if (!boundary) {
        throw new Error('No boundary found in content-type header');
    }
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const encoder = new TextEncoder();

    const boundaryBytes = encoder.encode(`--${boundary}`);

    const findBoundaries = (data: Uint8Array, delimiter: Uint8Array): number[] => {
        const positions: number[] = [];
        outer: for (let i = 0; i < data.length - delimiter.length; i++) {
            for (let j = 0; j < delimiter.length; j++) {
                if (data[i + j] !== delimiter[j]) continue outer;
            }
            positions.push(i);
        }
        return positions;
    };

    const boundaryPositions = findBoundaries(bytes, boundaryBytes);

    return boundaryPositions.slice(0, -1).map((start, i) => {
        const end = boundaryPositions[i + 1];
        const part = bytes.slice(start + boundaryBytes.length, end);

        const headerEnd = part.findIndex(
            (_, i) =>
                part[i] === 0x0d &&
                part[i + 1] === 0x0a &&
                part[i + 2] === 0x0d &&
                part[i + 3] === 0x0a,
        );
        const body = part.slice(headerEnd + 4, -2);

        return new Blob([body], { type: 'application/pdf' });
    });
};

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
