import { describe, expect, test } from '@jest/globals';
import {
    KlageInnsendingskilde,
    Klagebehandling,
    KlagebehandlingStatus,
} from '~/lib/klage/typer/Klage';
import { Saksbehandler, SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { kanSendeForvaltningsmelding } from './klageUtils';

const innloggetSaksbehandler: Saksbehandler = {
    brukernavn: 'Saksbehandler',
    epost: 'saksbehandler@nav.no',
    navIdent: 'Z12345',
    roller: [SaksbehandlerRolle.SAKSBEHANDLER],
    sladdes: false,
    kanSeBenken: true,
};

const lagKlage = (overstyr: Partial<Klagebehandling> = {}): Klagebehandling => ({
    id: 'klage_1',
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    fnr: ikkeSladdet('12345678911'),
    opprettet: '2025-04-01T10:00:00',
    sistEndret: '2025-04-01T10:00:00',
    iverksattTidspunkt: null,
    saksbehandler: innloggetSaksbehandler.navIdent,
    klagensJournalpostId: '453827',
    klagensJournalpostOpprettet: '2025-04-01T10:00:00',
    status: KlagebehandlingStatus.UNDER_BEHANDLING,
    resultat: null,
    avbrutt: null,
    kanIverksetteVedtak: null,
    kanIverksetteOpprettholdelse: false,
    ventestatus: [],
    formkrav: {
        vedtakDetKlagesPå: null,
        erKlagerPartISaken: true,
        klagesDetPåKonkreteElementerIVedtaket: true,
        erKlagefristenOverholdt: true,
        erUnntakForKlagefrist: null,
        erKlagenSignert: true,
        innsendingsdato: '2025-04-01',
        innsendingskilde: KlageInnsendingskilde.DIGITAL,
    },
    tilknyttedeBehandlingIder: [],
    åpenBehandlingId: null,
    forvaltningsmelding: null,
    ...overstyr,
});

describe('kanSendeForvaltningsmelding', () => {
    test('kan sende når klagen er under behandling, eies av innlogget saksbehandler og ikke er på vent', () => {
        expect(kanSendeForvaltningsmelding(lagKlage(), innloggetSaksbehandler)).toBe(true);
    });

    test.each(
        Object.values(KlagebehandlingStatus).filter(
            (status) => status !== KlagebehandlingStatus.UNDER_BEHANDLING,
        ),
    )('kan ikke sende med status %s', (status) => {
        expect(kanSendeForvaltningsmelding(lagKlage({ status }), innloggetSaksbehandler)).toBe(
            false,
        );
    });

    test('kan ikke sende når en annen saksbehandler eier behandlingen', () => {
        expect(
            kanSendeForvaltningsmelding(
                lagKlage({ saksbehandler: 'Z99999' }),
                innloggetSaksbehandler,
            ),
        ).toBe(false);
    });

    test('kan ikke sende når behandlingen er satt på vent', () => {
        const klage = lagKlage({
            ventestatus: [
                {
                    sattPåVentAv: innloggetSaksbehandler.navIdent,
                    tidspunkt: '2025-04-02T10:00:00',
                    begrunnelse: ikkeSladdet('Venter'),
                    erSattPåVent: true,
                    frist: null,
                    status: 'UNDER_BEHANDLING',
                },
            ],
        });
        expect(kanSendeForvaltningsmelding(klage, innloggetSaksbehandler)).toBe(false);
    });

    test('kan ikke sende når forvaltningsmelding allerede er sendt', () => {
        const klage = lagKlage({
            forvaltningsmelding: {
                tekster: [{ tittel: 'Svartid', tekst: ikkeSladdet('Ca. 3 måneder') }],
                saksbehandler: innloggetSaksbehandler.navIdent,
                sendtTidspunkt: '2025-04-03T10:00:00',
                journalpostId: null,
                journalføringstidspunkt: null,
                distribusjonstidspunkt: null,
            },
        });
        expect(kanSendeForvaltningsmelding(klage, innloggetSaksbehandler)).toBe(false);
    });
});
