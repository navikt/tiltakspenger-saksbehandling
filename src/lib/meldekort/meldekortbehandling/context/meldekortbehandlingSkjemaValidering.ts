import {
    MeldekortbehandlingSkjemaState,
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { nonNullishPredicate } from '~/utils/array';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { erMeldekortbehandlingGodkjent } from '~/lib/meldekort/utils/meldekortbehandlingUtils';

type MeldekortDagValideringsfeil = {
    dato: string;
    feil: string;
};

const validerMeldekortDagSkjema = (
    dag: MeldekortDagSkjema,
    behandling: MeldekortbehandlingProps,
): MeldekortDagValideringsfeil | null => {
    if (erMeldekortbehandlingGodkjent(behandling)) {
        return null;
    }

    if (dag.status === MeldekortbehandlingDagStatus.IkkeBesvart) {
        return { dato: dag.dato, feil: 'Status må besvares' };
    }

    return null;
};

export type MeldeperiodeSkjemaValideringsfeil = {
    kjedeId: MeldeperiodeKjedeId;
    dagerFeil: MeldekortDagValideringsfeil[];
    overordnedeFeil: string[];
};

export const validerMeldeperiodeSkjema = (
    skjema: MeldeperiodeSkjema,
    behandling: MeldekortbehandlingProps,
    sak: SakProps,
): MeldeperiodeSkjemaValideringsfeil | null => {
    if (erMeldekortbehandlingGodkjent(behandling)) {
        return null;
    }

    const { kjedeId, dager } = skjema;

    const { sisteMeldeperiode } = hentMeldeperiodekjede(sak, kjedeId);
    const maksAntallDager = sisteMeldeperiode.antallDager;

    const overordnedeFeil: string[] = [];

    const dagerFeil = dager
        .map((dag) => validerMeldekortDagSkjema(dag, behandling))
        .filter(nonNullishPredicate);

    const antallDager = dager.filter((dag) => deltattEllerFraværStatus.has(dag.status)).length;

    if (antallDager > maksAntallDager) {
        overordnedeFeil.push(
            `For mange dager med deltatt eller fravær. ${antallDager} dager utfylt, ${maksAntallDager} er maks for meldeperioden.`,
        );
    }

    if (dagerFeil.length === 0 && overordnedeFeil.length === 0) {
        return null;
    }

    return {
        kjedeId,
        dagerFeil,
        overordnedeFeil,
    };
};

export type MeldekortbehandlingSkjemaValideringsfeil = {
    meldeperioderFeil: MeldeperiodeSkjemaValideringsfeil[];
    overordnedeFeil: string[];
};

export const validerMeldekortbehandlingSkjema = (
    skjema: MeldekortbehandlingSkjemaState,
    behandling: MeldekortbehandlingProps,
    sak: SakProps,
): MeldekortbehandlingSkjemaValideringsfeil | null => {
    if (erMeldekortbehandlingGodkjent(behandling)) {
        return null;
    }

    const overordnedeFeil: string[] = [];

    const meldeperioderFeil = skjema.meldeperioder
        .map((mpSkjema) => validerMeldeperiodeSkjema(mpSkjema, behandling, sak))
        .filter(nonNullishPredicate);

    if (meldeperioderFeil.length === 0 && overordnedeFeil.length === 0) {
        return null;
    }

    return {
        meldeperioderFeil,
        overordnedeFeil,
    };
};

const deltattEllerFraværStatus: ReadonlySet<MeldekortbehandlingDagStatus> = new Set([
    MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
    MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket,
    MeldekortbehandlingDagStatus.FraværSyk,
    MeldekortbehandlingDagStatus.FraværSyktBarn,
    MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
    MeldekortbehandlingDagStatus.FraværGodkjentAvNav,
    MeldekortbehandlingDagStatus.FraværAnnet,
]);
