import { expect, test } from '@jest/globals';
import { benkOppsummeringTekst } from './benkUtils';
import { BenkOppsummering } from '../typer/felles';

const oppsummering = (deler: Partial<BenkOppsummering> = {}): BenkOppsummering => ({
    antallMedTilgang: 0,
    antallUtenTilgang: 0,
    antallSkjermet: 0,
    antallKode6: 0,
    antallKode7: 0,
    ...deler,
});

test('ingen linje når alt som kan oppsummeres er null', () => {
    expect(benkOppsummeringTekst(oppsummering({ antallMedTilgang: 12 }))).toBeNull();
});

test('bare delene som er større enn null tas med', () => {
    expect(
        benkOppsummeringTekst(
            oppsummering({ antallMedTilgang: 8, antallUtenTilgang: 3, antallKode6: 1 }),
        ),
    ).toBe('3 uten tilgang · 1 med strengt fortrolig adresse');
});

test('alle delene settes sammen i fast rekkefølge', () => {
    expect(
        benkOppsummeringTekst(
            oppsummering({
                antallMedTilgang: 4,
                antallUtenTilgang: 6,
                antallSkjermet: 2,
                antallKode6: 3,
                antallKode7: 1,
            }),
        ),
    ).toBe(
        '6 uten tilgang · 2 skjermet · 3 med strengt fortrolig adresse · 1 med fortrolig adresse',
    );
});
