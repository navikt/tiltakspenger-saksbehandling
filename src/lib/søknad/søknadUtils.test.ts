import { describe, expect, test } from '@jest/globals';
import { hentGjenåpningForBehandling } from '~/lib/søknad/søknadUtils';
import { Søknadshendelse, SøknadshendelseType } from '~/lib/søknad/søknadTyper';
import { søknad } from '~test/rammebehandling';

const hendelse = (type: SøknadshendelseType, tidspunkt: string): Søknadshendelse => ({
    type,
    tidspunkt,
    utførtAv: 'Z123456',
    begrunnelse: null,
});

const avbrutt1 = hendelse(SøknadshendelseType.AVBRUTT, '2025-01-10T09:00:00');
const gjenåpnet1 = hendelse(SøknadshendelseType.GJENÅPNET, '2025-01-15T09:00:00');
const avbrutt2 = hendelse(SøknadshendelseType.AVBRUTT, '2025-02-10T09:00:00');
const gjenåpnet2 = hendelse(SøknadshendelseType.GJENÅPNET, '2025-02-15T09:00:00');

const søknadMedHistorikk = { ...søknad(), avbrutt: [avbrutt1, gjenåpnet1, avbrutt2, gjenåpnet2] };

describe('hentGjenåpningForBehandling', () => {
    test('gir null for en søknad som aldri er gjenåpnet', () => {
        expect(hentGjenåpningForBehandling(søknad(), '2025-03-01T09:00:00')).toBeNull();
    });

    test('gir null for en behandling opprettet før den første gjenåpningen', () => {
        expect(hentGjenåpningForBehandling(søknadMedHistorikk, '2025-01-12T09:00:00')).toBeNull();
    });

    test('gir gjenåpningen som skjedde rett før behandlingen ble opprettet', () => {
        expect(hentGjenåpningForBehandling(søknadMedHistorikk, '2025-02-01T09:00:00')).toBe(
            gjenåpnet1,
        );
        expect(hentGjenåpningForBehandling(søknadMedHistorikk, '2025-03-01T09:00:00')).toBe(
            gjenåpnet2,
        );
    });

    test('regner med en gjenåpning med samme tidspunkt som behandlingen ble opprettet', () => {
        expect(hentGjenåpningForBehandling(søknadMedHistorikk, gjenåpnet2.tidspunkt)).toBe(
            gjenåpnet2,
        );
    });
});
