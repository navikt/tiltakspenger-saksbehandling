import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
    MeldekortBehandlingProps,
    MeldekortDagDTO,
} from '../../../../types/MeldekortTypes';

type Props = {
    brukersMeldekort: BrukersMeldekortProps;
    meldekortBehandling: MeldekortBehandlingProps;
};

export const behandlingMedBrukersUtfylling = (
    meldekortBehandling: MeldekortBehandlingProps,
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortDagDTO[] => {
    if (brukersMeldekort) {
        return brukersMeldekort.dager;
    }

    return meldekortBehandling.dager.map((dag, index) => {
        return {
            dato: dag.dato,
            status: dag.status,
        };
    });
};
