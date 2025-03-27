import { MeldeperiodeKjedeProps, MeldeperiodeKjedeStatus } from '../types/meldekort/Meldeperiode';
import { MeldekortBehandlingStatus } from '../types/meldekort/MeldekortBehandling';

export const finnSisteMeldeperiodeVersjon = (kjede: MeldeperiodeKjedeProps) =>
    kjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );

export const meldekortBehandlingStatusTilMeldeperiodeStatus: Record<
    MeldekortBehandlingStatus,
    MeldeperiodeKjedeStatus
> = {
    [MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING]: MeldeperiodeKjedeStatus.KLAR_TIL_BEHANDLING,
    [MeldekortBehandlingStatus.GODKJENT]: MeldeperiodeKjedeStatus.GODKJENT,
    [MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING]: MeldeperiodeKjedeStatus.KLAR_TIL_BESLUTNING,
    [MeldekortBehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]:
        MeldeperiodeKjedeStatus.IKKE_RETT_TIL_TILTAKSPENGER,
};
