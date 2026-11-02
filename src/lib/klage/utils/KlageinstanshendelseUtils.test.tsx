/** @jest-environment jsdom */
import { describe, expect, test } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import {
    klagehendelseUtfallTilTag,
    klagehendelseUtfallTilTekst,
    skalKunneOppretteNyRammebehandling,
} from './KlageinstanshendelseUtils';
import {
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlagehendelseUtfall,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';
import {
    behandlingFeilregistrertHendelse,
    klagebehandlingAvsluttetHendelse,
    omgjøringskravbehandlingAvsluttetHendelse,
} from '~test/klage';

const Avsluttet = KlageHendelseKlagebehandlingAvsluttetUtfall;

describe('skalKunneOppretteNyRammebehandling', () => {
    test('uten hendelser fra klageinstansen kan det ikke opprettes ny behandling', () => {
        expect(skalKunneOppretteNyRammebehandling(null)).toBe(false);
        expect(skalKunneOppretteNyRammebehandling([])).toBe(false);
    });

    // Samme regel som `kanVidereBehandlesEtterSvarFraKA` i backenden (Klagebehandlingsresultat.kt).
    test.each([
        [Avsluttet.OPPHEVET, true],
        [Avsluttet.MEDHOLD, true],
        [Avsluttet.DELVIS_MEDHOLD, true],
        [Avsluttet.UGUNST, true],
        [Avsluttet.TRUKKET, false],
        [Avsluttet.RETUR, false],
        [Avsluttet.STADFESTELSE, false],
        [Avsluttet.AVVIST, false],
        [Avsluttet.HENLAGT, false],
    ])('avsluttet klagebehandling med utfall %s: %s', (utfall, forventet) => {
        expect(skalKunneOppretteNyRammebehandling([klagebehandlingAvsluttetHendelse(utfall)])).toBe(
            forventet,
        );
    });

    test.each([
        [OmgjøringskravbehandlingAvsluttetUtfall.UGUNST, true],
        [OmgjøringskravbehandlingAvsluttetUtfall.MEDHOLD_ETTER_FVL_35, false],
    ])('avsluttet omgjøringskravbehandling med utfall %s: %s', (utfall, forventet) => {
        expect(
            skalKunneOppretteNyRammebehandling([omgjøringskravbehandlingAvsluttetHendelse(utfall)]),
        ).toBe(forventet);
    });

    test('feilregistrert behandling gir ikke ny behandling', () => {
        expect(
            skalKunneOppretteNyRammebehandling([
                behandlingFeilregistrertHendelse(KlageHendelseFeilregistrertType.KLAGE),
            ]),
        ).toBe(false);
    });

    test('det er bare den siste hendelsen som avgjør', () => {
        expect(
            skalKunneOppretteNyRammebehandling([
                klagebehandlingAvsluttetHendelse(Avsluttet.TRUKKET),
                klagebehandlingAvsluttetHendelse(Avsluttet.MEDHOLD),
            ]),
        ).toBe(true);
        expect(
            skalKunneOppretteNyRammebehandling([
                klagebehandlingAvsluttetHendelse(Avsluttet.MEDHOLD),
                behandlingFeilregistrertHendelse(KlageHendelseFeilregistrertType.KLAGE),
            ]),
        ).toBe(false);
    });
});

describe('klagehendelseUtfallTilTag', () => {
    const alleUtfall = Object.keys(klagehendelseUtfallTilTekst) as KlagehendelseUtfall[];

    test.each(alleUtfall)('viser teksten for utfall %s', (utfall) => {
        render(klagehendelseUtfallTilTag({ utfall }));
        expect(screen.getByText(klagehendelseUtfallTilTekst[utfall])).toBeInTheDocument();
    });

    test('viser ekstra innhold før og etter utfallet', () => {
        const { container } = render(
            klagehendelseUtfallTilTag({
                utfall: Avsluttet.DELVIS_MEDHOLD,
                extraContent: { before: 'Utfall: ', after: ' (KA)' },
            }),
        );
        expect(container).toHaveTextContent('Utfall: Delvis medhold (KA)');
    });
});
