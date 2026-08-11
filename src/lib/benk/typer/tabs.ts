export enum BenkTab {
    SØKNADER = 'SØKNADER',
    REVURDERINGER = 'REVURDERINGER',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const BENK_TAB_DEFAULT = BenkTab.SØKNADER;

export const benkTabTekst: Record<BenkTab, string> = {
    [BenkTab.SØKNADER]: 'Søknader',
    [BenkTab.REVURDERINGER]: 'Revurderinger',
    [BenkTab.MELDEKORT]: 'Meldekort',
    [BenkTab.KLAGE]: 'Klage',
    [BenkTab.TILBAKEKREVING]: 'Tilbakekreving',
} as const;

export const erBenkTab = (verdi: unknown): verdi is BenkTab =>
    typeof verdi === 'string' && verdi in benkTabTekst;

/**
 * Sub-path under /benk for hver fane. Backend har én rute per fane,
 * så fanen angis i url-en i stedet for i body-en.
 */
export const benkTabPath: Record<BenkTab, string> = {
    [BenkTab.SØKNADER]: 'soknader',
    [BenkTab.REVURDERINGER]: 'revurderinger',
    [BenkTab.MELDEKORT]: 'meldekort',
    [BenkTab.KLAGE]: 'klage',
    [BenkTab.TILBAKEKREVING]: 'tilbakekreving',
} as const;
