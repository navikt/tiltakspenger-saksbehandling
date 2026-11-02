import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    errorFraApiResponse,
    FetcherError,
    fetchBlobFraApiClientSide,
    fetchFraApiClientSide,
    fetchJsonFraApiClientSide,
} from '~/utils/fetch/fetch';
import { finnFetchFeilmelding } from '~/utils/fetch/feilmeldinger';

const jsonRespons = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });

describe('finnFetchFeilmelding', () => {
    test('kjente feilkoder oversettes til egen tekst', () => {
        expect(finnFetchFeilmelding({ kode: 'fant_ikke_sak', melding: 'Sak not found' })).toBe(
            'Fant ikke saken',
        );
    });

    test('ukjente feilkoder viser meldingen fra backend', () => {
        expect(finnFetchFeilmelding({ kode: 'helt_ny_kode', melding: 'Melding fra backend' })).toBe(
            'Melding fra backend',
        );
    });

    test('uten feil-body gis en generell serverfeil', () => {
        expect(finnFetchFeilmelding(undefined)).toBe('Noe gikk galt på serversiden');
    });
});

describe('errorFraApiResponse', () => {
    test('henter status, kode, data og oversatt melding fra json-body', async () => {
        const feil = await errorFraApiResponse(
            jsonRespons(409, {
                kode: 'ugyldig_status_for_legg_tilbake',
                melding: 'Behandlingen har feil status',
                data: { status: 'VEDTATT' },
            }),
        );

        expect(feil).toBeInstanceOf(FetcherError);
        expect(feil.status).toBe(409);
        expect(feil.kode).toBe('ugyldig_status_for_legg_tilbake');
        expect(feil.data).toEqual({ status: 'VEDTATT' });
        expect(feil.message).toBe(
            'Behandlingen har endret status etter at siden ble lastet. Last siden på nytt og prøv igjen.',
        );
    });

    test.each([
        ['tom body', ''],
        ['html-body', '<html><body>Not Found</body></html>'],
        ['json-null', 'null'],
    ])('beholder statusen når body ikke er et feilobjekt (%s)', async (_, body) => {
        const feil = await errorFraApiResponse(new Response(body, { status: 404 }));

        expect(feil.status).toBe(404);
        expect(feil.kode).toBeUndefined();
        expect(feil.message).toBe(
            'Klarte ikke å tolke feilmeldingen fra serveren, kontakt utviklingsteamet.',
        );
    });
});

describe('fetch fra api på klientsiden', () => {
    const originalFetch = global.fetch;
    let fetchMock: jest.Mock<typeof fetch>;

    beforeEach(() => {
        fetchMock = jest.fn<typeof fetch>();
        global.fetch = fetchMock;
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    test('går via /api med json som standard content-type, og beholder egne headere', async () => {
        fetchMock.mockResolvedValue(jsonRespons(200, {}));

        await fetchFraApiClientSide('/sak/123', {
            method: 'POST',
            body: '{}',
            headers: { 'x-ekstra': 'ja' },
        });

        expect(fetchMock).toHaveBeenCalledWith('/api/sak/123', {
            method: 'POST',
            body: '{}',
            headers: { 'content-type': 'application/json', 'x-ekstra': 'ja' },
        });
    });

    test('url uten innledende skråstrek gir samme api-url', async () => {
        fetchMock.mockResolvedValue(jsonRespons(200, {}));

        await fetchFraApiClientSide('sak/123');

        expect(fetchMock.mock.calls[0][0]).toBe('/api/sak/123');
    });

    test('egen content-type overstyrer standarden', async () => {
        fetchMock.mockResolvedValue(jsonRespons(200, {}));

        await fetchFraApiClientSide('/pdf', { headers: { 'content-type': 'application/pdf' } });

        expect(fetchMock.mock.calls[0][1]?.headers).toEqual({ 'content-type': 'application/pdf' });
    });

    test('feilrespons kastes som FetcherError med status og melding', async () => {
        fetchMock.mockResolvedValue(
            jsonRespons(403, { kode: 'ikke_tilgang', melding: 'Forbidden' }),
        );

        const feil = await fetchJsonFraApiClientSide('/sak/123').catch((e) => e);

        expect(feil).toBeInstanceOf(FetcherError);
        expect(feil).toMatchObject({
            status: 403,
            kode: 'ikke_tilgang',
            message: 'Bruker har ikke tilgang',
        });
    });

    test('nettverksfeil kastes videre', async () => {
        const nettverksfeil = new TypeError('Failed to fetch');
        fetchMock.mockRejectedValue(nettverksfeil);

        await expect(fetchFraApiClientSide('/sak/123')).rejects.toBe(nettverksfeil);
    });

    test('vellykket respons tolkes som json eller blob', async () => {
        fetchMock.mockResolvedValueOnce(jsonRespons(200, { saksnummer: '123' }));
        await expect(fetchJsonFraApiClientSide('/sak/123')).resolves.toEqual({
            saksnummer: '123',
        });

        fetchMock.mockResolvedValueOnce(new Response('pdf-innhold', { status: 200 }));
        const blob = await fetchBlobFraApiClientSide('/brev');
        await expect(blob.text()).resolves.toBe('pdf-innhold');
    });
});
