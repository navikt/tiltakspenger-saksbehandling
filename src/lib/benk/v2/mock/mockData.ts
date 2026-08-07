import { BenkSøknadsbehandling } from '../typer/søknader';
import { BenkRevurdering } from '../typer/revurderinger';
import { BenkMeldekort, BenkMeldekortType } from '../typer/meldekort';
import { BenkKlagebehandling } from '../typer/klage';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from '../typer/tilbakekreving';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus } from '../typer/felles';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Søknadstype } from '~/lib/søknad/søknadTyper';

/**
 * Deterministiske mock-data for utvikling av benk v2.
 * Erstattes av ekte backend-kall når API-et er klart - se mockBenkService.ts.
 */

const SAKSBEHANDLERE = ['Z994321', 'Z991122', 'Z993344', null];
const BESLUTTERE = ['Z995566', 'Z997788', null];

const statuser = Object.values(BenkV2Behandlingsstatus);

const velg = <T>(liste: readonly T[], indeks: number): T => liste[indeks % liste.length];

const dato = (dagOffset: number, time = 8): string => {
    const d = new Date(2026, 0, 5 + dagOffset, time);
    return d.toISOString();
};

const periode = (ukeOffset: number) => {
    const fraOgMed = new Date(2026, 0, 5 + ukeOffset * 14);
    const tilOgMed = new Date(2026, 0, 5 + ukeOffset * 14 + 13);
    return {
        fraOgMed: fraOgMed.toISOString().slice(0, 10),
        tilOgMed: tilOgMed.toISOString().slice(0, 10),
    };
};

const base = (i: number): BenkV2BehandlingBase => {
    const erSattPåVent = i % 7 === 3;
    return {
        sakId: `sak_${1000 + i}`,
        fnr: `${String(10000000000 + i * 12345).slice(0, 11)}`,
        saksnummer: `2026${String(100000 + i)}`,
        startet: dato(i),
        sistEndret: dato(i, 12),
        saksbehandler: velg(SAKSBEHANDLERE, i),
        beslutter: velg(BESLUTTERE, i + 1),
        erUnderkjent: i % 9 === 4,
        ventestatus: {
            erSattPåVent,
            begrunnelse: erSattPåVent ? 'Venter på dokumentasjon' : null,
            frist: erSattPåVent ? dato(i + 14).slice(0, 10) : null,
        },
    };
};

const søknadstyper: Søknadstype[] = ['DIGITAL', 'PAPIR_SKJEMA', 'PAPIR_FRIHAND', 'MODIA', 'ANNET'];

export const mockSøknader: BenkSøknadsbehandling[] = Array.from({ length: 23 }, (_, i) => ({
    ...base(i),
    status: velg(statuser, i),
    søknadstype: velg(søknadstyper, i),
    kravtidspunkt: dato(i - 2, 10),
    resultat:
        i % 3 === 0
            ? velg([SøknadsbehandlingResultat.INNVILGELSE, SøknadsbehandlingResultat.AVSLAG], i)
            : null,
}));

const revurderingResultater = [
    RevurderingResultat.STANS,
    RevurderingResultat.INNVILGELSE,
    RevurderingResultat.OMGJØRING,
    RevurderingResultat.OMGJØRING_OPPHØR,
];

export const mockRevurderinger: BenkRevurdering[] = Array.from({ length: 14 }, (_, i) => ({
    ...base(i + 100),
    status: velg(statuser, i + 1),
    resultat: i % 2 === 0 ? velg(revurderingResultater, i) : null,
}));

const meldekortTyper = Object.values(BenkMeldekortType);

export const mockMeldekort: BenkMeldekort[] = Array.from({ length: 31 }, (_, i) => {
    const type = velg(meldekortTyper, i);
    const erInnsendt = type !== BenkMeldekortType.MELDEKORTBEHANDLING;
    return {
        ...base(i + 200),
        status: erInnsendt
            ? velg(
                  [
                      BenkV2Behandlingsstatus.KLAR_TIL_BEHANDLING,
                      BenkV2Behandlingsstatus.UNDER_BEHANDLING,
                  ],
                  i,
              )
            : velg(statuser, i + 2),
        type,
        periode: periode(i % 6),
        beløp: !erInnsendt && i % 2 === 0 ? 1500 + i * 137 : null,
        mottattTidspunkt: erInnsendt ? dato(i, 18) : null,
    };
});

const klageResultater = [
    KlagebehandlingResultat.AVVIST,
    KlagebehandlingResultat.OMGJØR,
    KlagebehandlingResultat.OPPRETTHOLDT,
];

export const mockKlage: BenkKlagebehandling[] = Array.from({ length: 9 }, (_, i) => ({
    ...base(i + 300),
    status: velg(statuser, i + 3),
    kravtidspunkt: dato(i - 5, 9),
    resultat: i % 3 === 1 ? velg(klageResultater, i) : null,
}));

const tilbakekrevingStatuser = Object.values(BenkTilbakekrevingStatus);
const tilbakekrevingKilder = Object.values(BenkTilbakekrevingKilde);

export const mockTilbakekrevinger: BenkTilbakekreving[] = Array.from({ length: 17 }, (_, i) => ({
    ...base(i + 400),
    status: velg(tilbakekrevingStatuser, i),
    beløp: 800 + i * 1234,
    kilde: velg(tilbakekrevingKilder, i),
    kravgrunnlagPeriode: periode(i % 4),
}));
