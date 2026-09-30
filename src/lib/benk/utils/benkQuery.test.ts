import { expect, test } from '@jest/globals';
import { benkFilterTilQuery, parseBenkMineFilter } from './benkQuery';
import { parseBenkFilterForTab } from '../benkFaner';
import { BenkTab } from '../typer/tabs';
import { BenkBeskyttelse } from '../typer/felles';

test('beskyttelse leses fra query i alle køfanene', () => {
    Object.values(BenkTab).forEach((tab) => {
        expect(
            parseBenkFilterForTab(tab, { beskyttelse: 'ADRESSEBESKYTTET_ELLER_SKJERMET' })
                .beskyttelse,
        ).toBe(BenkBeskyttelse.ADRESSEBESKYTTET_ELLER_SKJERMET);
    });
});

test('beskyttelse leses fra query i mine-fanen', () => {
    expect(
        parseBenkMineFilter({ beskyttelse: 'ADRESSEBESKYTTET_ELLER_SKJERMET' }).beskyttelse,
    ).toBe(BenkBeskyttelse.ADRESSEBESKYTTET_ELLER_SKJERMET);
});

test('ukjent eller manglende beskyttelse gir null', () => {
    expect(
        parseBenkFilterForTab(BenkTab.SØKNADER, { beskyttelse: 'KODE_6' }).beskyttelse,
    ).toBeNull();
    expect(parseBenkFilterForTab(BenkTab.SØKNADER, {}).beskyttelse).toBeNull();
});

test('beskyttelse kommer bare med i url-en når den er valgt', () => {
    const filter = parseBenkFilterForTab(BenkTab.SØKNADER, {});

    expect(benkFilterTilQuery(filter)).toEqual({});
    expect(
        benkFilterTilQuery({
            ...filter,
            beskyttelse: BenkBeskyttelse.ADRESSEBESKYTTET_ELLER_SKJERMET,
        }),
    ).toEqual({ beskyttelse: 'ADRESSEBESKYTTET_ELLER_SKJERMET' });
});
