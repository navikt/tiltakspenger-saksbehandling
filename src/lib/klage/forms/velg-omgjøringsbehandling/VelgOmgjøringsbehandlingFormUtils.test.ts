import { describe, expect, test } from '@jest/globals';
import {
    VelgOmgjøringsbehandlingFormData,
    velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest,
    velgOmgjøringsbehandlingFormValidation,
    VelgOmgjøringsbehandlingTyper,
} from './VelgOmgjøringsbehandlingFormUtils';

// Gjenstående verdier fra tidligere valg i skjemaet, for å sjekke at de ikke lekker inn i requesten.
const skjema = (
    overstyringer: Partial<VelgOmgjøringsbehandlingFormData> = {},
): VelgOmgjøringsbehandlingFormData => ({
    behandlingstype: '',
    søknadId: 'soknad_1',
    vedtakSomSkalOmgjøres: 'vedtak_1',
    kjedeId: '',
    ...overstyringer,
});

describe('velgOmgjøringsbehandlingFormValidation', () => {
    test('krever at behandlingstype er valgt', () => {
        const resultat = velgOmgjøringsbehandlingFormValidation(skjema());

        expect(resultat.values).toEqual({});
        expect(Object.keys(resultat.errors)).toEqual(['behandlingstype']);
    });

    test.each([
        [VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING, 'søknadId'],
        [VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING, 'vedtakSomSkalOmgjøres'],
        [VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING, 'kjedeId'],
    ] as const)('%s krever at %s er valgt', (behandlingstype, feltnavn) => {
        const resultat = velgOmgjøringsbehandlingFormValidation(
            skjema({ behandlingstype, [feltnavn]: '' }),
        );

        expect(Object.keys(resultat.errors)).toEqual([feltnavn]);
    });

    test('revurdering til innvilgelse krever ingen flere valg', () => {
        const data = skjema({
            behandlingstype: VelgOmgjøringsbehandlingTyper.REVURDERING_INNVILGELSE,
            søknadId: '',
            vedtakSomSkalOmgjøres: '',
            kjedeId: '',
        });

        expect(velgOmgjøringsbehandlingFormValidation(data)).toEqual({ values: data, errors: {} });
    });

    test('felter som hører til en annen behandlingstype valideres ikke', () => {
        const resultat = velgOmgjøringsbehandlingFormValidation(
            skjema({
                behandlingstype: VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING,
                søknadId: '',
                vedtakSomSkalOmgjøres: '',
                kjedeId: '2025-01-06/2025-01-19',
            }),
        );

        expect(resultat.errors).toEqual({});
    });
});

describe('velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest', () => {
    test('søknadsbehandling sender bare med søknaden', () => {
        expect(
            velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest(
                skjema({ behandlingstype: VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING }),
            ),
        ).toEqual({
            type: 'SØKNADSBEHANDLING_INNVILGELSE',
            søknadId: 'soknad_1',
            vedtakIdSomSkalOmgjøres: null,
            kjedeId: null,
        });
    });

    test('revurdering til omgjøring sender bare med vedtaket som skal omgjøres', () => {
        expect(
            velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest(
                skjema({ behandlingstype: VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING }),
            ),
        ).toEqual({
            type: 'REVURDERING_OMGJØRING',
            søknadId: null,
            vedtakIdSomSkalOmgjøres: 'vedtak_1',
            kjedeId: null,
        });
    });

    test('revurdering til innvilgelse sender verken søknad eller vedtak', () => {
        expect(
            velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest(
                skjema({ behandlingstype: VelgOmgjøringsbehandlingTyper.REVURDERING_INNVILGELSE }),
            ),
        ).toEqual({
            type: 'REVURDERING_INNVILGELSE',
            søknadId: null,
            vedtakIdSomSkalOmgjøres: null,
            kjedeId: null,
        });
    });

    test('meldekortbehandling sender med meldeperiodekjeden', () => {
        expect(
            velgOmgjøringsbehandlingFormDataTilOpprettBehandlingRequest(
                skjema({
                    behandlingstype: VelgOmgjøringsbehandlingTyper.MELDEKORTBEHANDLING,
                    kjedeId: '2025-01-06/2025-01-19',
                }),
            ),
        ).toEqual({
            type: 'MELDEKORTBEHANDLING',
            søknadId: null,
            vedtakIdSomSkalOmgjøres: null,
            kjedeId: '2025-01-06/2025-01-19',
        });
    });
});
