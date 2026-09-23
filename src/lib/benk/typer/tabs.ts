import { isValueInRecord } from '~/utils/object';

export enum BenkTab {
    SØKNADER = 'SØKNADER',
    REVURDERINGER = 'REVURDERINGER',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const BENK_TAB_DEFAULT = BenkTab.SØKNADER;

export const erBenkTab = (verdi: unknown): verdi is BenkTab => isValueInRecord(verdi, BenkTab);
