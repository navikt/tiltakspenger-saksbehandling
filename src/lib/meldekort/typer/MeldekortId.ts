// Meldekortbehandlinger og brukers meldekort har samme id-format
export const MeldekortIdPrefix = 'meldekort_' as const;
export type MeldekortId = `${typeof MeldekortIdPrefix}${string}`;
