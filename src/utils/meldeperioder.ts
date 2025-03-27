import { MeldeperiodeKjedeProps, MeldeperiodeStatus } from '../types/meldekort/Meldeperiode';
import { MeldekortBehandlingStatus } from '../types/meldekort/MeldekortBehandling';

export const finnSisteMeldeperiodeVersjon = (kjede: MeldeperiodeKjedeProps) =>
    kjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );

export const meldekortBehandlingStatusTilMeldeperiodeStatus: Record<
    MeldekortBehandlingStatus,
    MeldeperiodeStatus
> = {
    [MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING]: MeldeperiodeStatus.KLAR_TIL_BEHANDLING,
    [MeldekortBehandlingStatus.GODKJENT]: MeldeperiodeStatus.GODKJENT,
    [MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING]: MeldeperiodeStatus.KLAR_TIL_BESLUTNING,
    [MeldekortBehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]:
        MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER,
};
