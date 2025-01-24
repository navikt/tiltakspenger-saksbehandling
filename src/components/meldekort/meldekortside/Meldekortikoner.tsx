import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
} from '@navikt/aksel-icons';
import {
    BrukersMeldekortDagStatus,
    MeldekortBehandlingDagStatus,
} from '../../../types/MeldekortTypes';

export const velgIkonForMeldekortStatus = (status: string) => {
    switch (status) {
        case MeldekortBehandlingDagStatus.Sperret:
        case BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER:
            return <CircleSlashIcon title="Sperret" color="black" width="1.2em" height="1.2em" />;

        case MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket:
        case MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav:
        case BrukersMeldekortDagStatus.DELTATT:
            return (
                <CheckmarkCircleFillIcon
                    width="1.2em"
                    height="1.2em"
                    title="Full utbetaling"
                    color="green"
                />
            );

        case MeldekortBehandlingDagStatus.IkkeDeltatt:
        case MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket:
        case MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav:
        case BrukersMeldekortDagStatus.FRAVÆR_ANNET:
            return (
                <MinusCircleFillIcon
                    width="1.2em"
                    height="1.2em"
                    title="Ingen utbetaling"
                    color="midnightblue"
                />
            );

        case MeldekortBehandlingDagStatus.FraværSyk:
        case MeldekortBehandlingDagStatus.FraværSyktBarn:
        case BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN:
        case BrukersMeldekortDagStatus.FRAVÆR_SYK:
            return (
                <FirstAidKitFillIcon
                    title="Redusert utbetaling"
                    color="chocolate"
                    fontSize="1.5rem"
                />
            );
        case MeldekortBehandlingDagStatus.IkkeUtfylt:
        case BrukersMeldekortDagStatus.IKKE_REGISTRERT:
            return (
                <NotePencilIcon width="1.2em" height="1.2em" title="Ikke utfylt" color="black" />
            );
    }
};
