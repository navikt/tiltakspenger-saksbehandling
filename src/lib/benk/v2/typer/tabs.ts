export enum BenkV2Tab {
    SØKNADER = 'SØKNADER',
    REVURDERINGER = 'REVURDERINGER',
    MELDEKORT = 'MELDEKORT',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const BENK_V2_TAB_DEFAULT = BenkV2Tab.SØKNADER;

export const benkV2TabTekst: Record<BenkV2Tab, string> = {
    [BenkV2Tab.SØKNADER]: 'Søknader',
    [BenkV2Tab.REVURDERINGER]: 'Revurderinger',
    [BenkV2Tab.MELDEKORT]: 'Meldekort',
    [BenkV2Tab.KLAGE]: 'Klage',
    [BenkV2Tab.TILBAKEKREVING]: 'Tilbakekreving',
} as const;

export const erBenkV2Tab = (verdi: unknown): verdi is BenkV2Tab =>
    typeof verdi === 'string' && verdi in benkV2TabTekst;
