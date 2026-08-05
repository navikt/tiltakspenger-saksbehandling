import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortDagSkjema } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContextTyper';
import { hurtigtastTilDagStatus } from '~/lib/meldekort/meldekortbehandling/meldeperioder/meldeperiodebehandling/hurtigtaster/meldekortDagStatusHurtigtaster';
import { erHelg } from '~/utils/date';

export type MeldekortHurtigutfylling = {
    /** Indeksen til dagen som fylles ut nå, eller null når prosessen ikke er i gang */
    aktivDagIndex: number | null;
    kanStarte: boolean;
    start: () => void;
    avbryt: () => void;
    hoppTilNesteDag: () => void;
    velgStatusForAktivDag: (status: MeldekortbehandlingDagStatus) => void;
    settSelectRef: (dagIndex: number) => (element: HTMLSelectElement | null) => void;
    /**
     * Lyttes på et element som omslutter alle dagene, slik at hurtigtastene virker
     * uavhengig av om fokus står på statusvelgeren eller på knappene i hurtigutfyllingen.
     */
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

const kanEndreDag = (dag: MeldekortDagSkjema) =>
    dag.status !== MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger;

/**
 * Helgedager fylles ut automatisk med "ikke tiltaksdag" når saken ikke kan sende inn helg.
 * Har helgedagen allerede en annen status enn "ikke besvart", må saksbehandler ta stilling til den.
 */
const skalFyllesUtAutomatisk = (dag: MeldekortDagSkjema, kanFylleUtHelg: boolean) =>
    !kanFylleUtHelg && erHelg(dag.dato) && dag.status === MeldekortbehandlingDagStatus.IkkeBesvart;

const skalHoppesOver = (dag: MeldekortDagSkjema, kanFylleUtHelg: boolean) =>
    !kanFylleUtHelg &&
    erHelg(dag.dato) &&
    dag.status === MeldekortbehandlingDagStatus.IkkeTiltaksdag;

type Args = {
    dager: MeldekortDagSkjema[];
    erReadonly: boolean;
    kanFylleUtHelg: boolean;
    oppdaterDagStatus: (dagIndex: number, status: MeldekortbehandlingDagStatus) => void;
};

export const useMeldekortHurtigutfylling = ({
    dager,
    erReadonly,
    kanFylleUtHelg,
    oppdaterDagStatus,
}: Args): MeldekortHurtigutfylling => {
    const [valgtDagIndex, setAktivDagIndex] = useState<number | null>(null);

    const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);

    const kanStarte = !erReadonly && dager.some(kanEndreDag);

    const aktivDagIndex = kanStarte ? valgtDagIndex : null;

    useEffect(() => {
        if (aktivDagIndex !== null) {
            selectRefs.current[aktivDagIndex]?.focus();
        }
    }, [aktivDagIndex]);

    /**
     * Går til neste dag som saksbehandler må ta stilling til, og fyller ut dagene
     * som kan settes automatisk på veien.
     */
    const gåTilNesteDag = useCallback(
        (fraIndex: number) => {
            for (let index = fraIndex + 1; index < dager.length; index++) {
                const dag = dager[index];

                if (!kanEndreDag(dag) || skalHoppesOver(dag, kanFylleUtHelg)) {
                    continue;
                }

                if (skalFyllesUtAutomatisk(dag, kanFylleUtHelg)) {
                    oppdaterDagStatus(index, MeldekortbehandlingDagStatus.IkkeTiltaksdag);
                    continue;
                }

                setAktivDagIndex(index);
                return;
            }

            setAktivDagIndex(null);
        },
        [dager, kanFylleUtHelg, oppdaterDagStatus],
    );

    const start = useCallback(() => {
        gåTilNesteDag(-1);
    }, [gåTilNesteDag]);

    const avbryt = useCallback(() => {
        setAktivDagIndex(null);
    }, []);

    const hoppTilNesteDag = useCallback(() => {
        if (aktivDagIndex !== null) {
            gåTilNesteDag(aktivDagIndex);
        }
    }, [aktivDagIndex, gåTilNesteDag]);

    const velgStatusForAktivDag = useCallback(
        (status: MeldekortbehandlingDagStatus) => {
            if (aktivDagIndex === null) {
                return;
            }

            oppdaterDagStatus(aktivDagIndex, status);
            gåTilNesteDag(aktivDagIndex);
        },
        [aktivDagIndex, gåTilNesteDag, oppdaterDagStatus],
    );

    const settSelectRef = useCallback(
        (dagIndex: number) => (element: HTMLSelectElement | null) => {
            selectRefs.current[dagIndex] = element;
        },
        [],
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (aktivDagIndex === null || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                avbryt();
                return;
            }

            // Enter aktiverer knappen som eventuelt har fokus, og skal ikke hoppe videre da
            if (event.key === 'Enter') {
                if (event.target instanceof HTMLButtonElement) {
                    return;
                }

                event.preventDefault();
                hoppTilNesteDag();
                return;
            }

            const status = hurtigtastTilDagStatus[event.key.toLowerCase()];

            if (!status) {
                return;
            }

            event.preventDefault();
            velgStatusForAktivDag(status);
        },
        [aktivDagIndex, avbryt, hoppTilNesteDag, velgStatusForAktivDag],
    );

    return {
        aktivDagIndex,
        kanStarte,
        start,
        avbryt,
        hoppTilNesteDag,
        velgStatusForAktivDag,
        settSelectRef,
        onKeyDown,
    };
};
