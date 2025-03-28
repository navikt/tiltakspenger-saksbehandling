import { MeldeperiodeKjedeProps } from '../types/meldekort/Meldeperiode';

export const finnSisteMeldeperiodeVersjon = (kjede: MeldeperiodeKjedeProps) =>
    kjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );
