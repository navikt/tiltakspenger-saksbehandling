import { describe, expect, test } from '@jest/globals';
import {
    behandlingUrl,
    beregningKildeUrl,
    klagebehandlingUrl,
    KlageStegUrlSegment,
    meldekortbehandlingUrl,
    meldeperiodeUrl,
    opprettKlageUrl,
    personoversiktUrl,
    registrerSoknadUrl,
} from '~/utils/urls';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import type { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import type { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { periode, sak } from '~test/rammebehandling';

const saksnummer = tilSaksnummer('202501011001');
const meldekortbehandlingId = 'meldekort_1' as MeldekortbehandlingId;

describe('url-er til sider på saken', () => {
    test('personoversikten, med og uten fane', () => {
        expect(personoversiktUrl(saksnummer)).toBe('/sak/202501011001');
        expect(personoversiktUrl(saksnummer, 'Meldekort' as PersonoversiktTab)).toBe(
            '/sak/202501011001#Meldekort',
        );
    });

    test('meldeperioden identifiseres med periodens datoer, og fanen legges i ankeret', () => {
        const meldeperiode = periode('2025-01-06', '2025-01-19');

        expect(meldeperiodeUrl(saksnummer, meldeperiode)).toBe(
            '/sak/202501011001/meldeperiode/2025-01-06/2025-01-19',
        );
        expect(meldeperiodeUrl(saksnummer, meldeperiode, 'Beregning' as MeldeperiodekjedeTab)).toBe(
            '/sak/202501011001/meldeperiode/2025-01-06/2025-01-19#Beregning',
        );
    });

    test('rammebehandling, registrering av søknad og klage', () => {
        expect(behandlingUrl({ saksnummer, id: 'beh_1' })).toBe(
            '/sak/202501011001/behandling/beh_1',
        );
        expect(registrerSoknadUrl(saksnummer)).toBe('/sak/202501011001/registrer-soknad');
        expect(opprettKlageUrl(saksnummer)).toBe('/sak/202501011001/klage/opprett');
        expect(klagebehandlingUrl(saksnummer, 'klage_1', KlageStegUrlSegment.Vurdering)).toBe(
            '/sak/202501011001/klage/klage_1/vurdering',
        );
    });
});

describe('meldekortbehandlingUrl', () => {
    test('uten steg lenker til behandlingen', () => {
        expect(meldekortbehandlingUrl(saksnummer, meldekortbehandlingId)).toBe(
            '/sak/202501011001/meldekortbehandling/meldekort_1',
        );
    });

    test('steg 0 er et gyldig steg og tas med i ankeret', () => {
        expect(meldekortbehandlingUrl(saksnummer, meldekortbehandlingId, 0)).toBe(
            '/sak/202501011001/meldekortbehandling/meldekort_1#steg-0',
        );
        expect(meldekortbehandlingUrl(saksnummer, meldekortbehandlingId, 2)).toBe(
            '/sak/202501011001/meldekortbehandling/meldekort_1#steg-2',
        );
    });
});

describe('beregningKildeUrl', () => {
    const sakProps = sak();

    test('en beregning fra et meldekort lenker til meldekortbehandlingen', () => {
        expect(
            beregningKildeUrl(
                { type: BeregningKildeType.MELDEKORT, id: meldekortbehandlingId },
                sakProps,
            ),
        ).toBe('/sak/202501011001/meldekortbehandling/meldekort_1');
    });

    test('en beregning fra en rammebehandling lenker til rammebehandlingen', () => {
        expect(
            beregningKildeUrl({ type: BeregningKildeType.RAMMEBEHANDLING, id: 'beh_2' }, sakProps),
        ).toBe('/sak/202501011001/behandling/beh_2');
    });
});
