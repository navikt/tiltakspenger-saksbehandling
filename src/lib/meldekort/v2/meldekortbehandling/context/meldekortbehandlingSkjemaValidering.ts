import {
    MeldekortbehandlingSkjemaState,
    MeldekortDagSkjema,
    MeldeperiodeSkjema,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2ContextTyper';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { nonNullishPredicate } from '~/utils/array';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { Periode } from '~/types/Periode';
import { perioderErSammenhengende } from '~/utils/periode';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';

export type MeldekortDagValideringsfeil = {
    dato: string;
    feil: string;
};

export const validerMeldekortDagSkjema = (
    dag: MeldekortDagSkjema,
): MeldekortDagValideringsfeil | null => {
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
    sak: SakProps,
): MeldeperiodeSkjemaValideringsfeil | null => {
    const { kjedeId, dager } = skjema;

    const { sisteMeldeperiode } = hentMeldeperiodekjede(sak, kjedeId);
    const maksAntallDager = sisteMeldeperiode.antallDager;

    const overordnedeFeil: string[] = [];

    const dagerFeil = dager
        .map((dag) => validerMeldekortDagSkjema(dag))
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
    sak: SakProps,
): MeldekortbehandlingSkjemaValideringsfeil | null => {
    const overordnedeFeil: string[] = [];

    const meldeperioderFeil = skjema.meldeperioder
        .map((mpSkjema) => validerMeldeperiodeSkjema(mpSkjema, sak))
        .filter(nonNullishPredicate);

    const perioder = skjema.meldeperioder.map(
        (mp): Periode => ({
            fraOgMed: mp.dager.at(0)!.dato,
            tilOgMed: mp.dager.at(-1)!.dato,
        }),
    );

    if (!perioderErSammenhengende(...perioder)) {
        overordnedeFeil.push(
            'Valgte meldeperioder er ikke sammenhengende, dette støtter vi ikke ennå.',
        );
    }

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
