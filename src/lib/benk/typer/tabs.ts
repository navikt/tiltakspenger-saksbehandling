import { isValueInRecord } from '~/utils/object';

/** Fanene med hver sin kø av behandlinger. Hver har sin egen rute, tabell og sitt eget filter. */
export enum BenkTab {
    SØKNADER = 'SØKNADER',
    REVURDERINGER = 'REVURDERINGER',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

/**
 * Mine-fanen er ikke en egen kø, men samler behandlingene den innloggede er tildelt
 * fra alle de andre fanene. Den er derfor ikke en [BenkTab].
 */
export const BENK_MINE_TAB = 'MINE';

/** Alle fanene på benksiden, inkludert mine-fanen */
export type BenkSideTab = BenkTab | typeof BENK_MINE_TAB;

export const benkSideTabs: ReadonlyArray<BenkSideTab> = [...Object.values(BenkTab), BENK_MINE_TAB];

export const BENK_TAB_DEFAULT = BenkTab.SØKNADER;

export const erBenkTab = (verdi: unknown): verdi is BenkTab => isValueInRecord(verdi, BenkTab);

export const erBenkSideTab = (verdi: unknown): verdi is BenkSideTab =>
    erBenkTab(verdi) || verdi === BENK_MINE_TAB;
