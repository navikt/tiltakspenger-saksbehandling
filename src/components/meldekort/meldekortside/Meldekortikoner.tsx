import {
    CircleSlashIcon,
    CheckmarkCircleFillIcon,
    MinusCircleFillIcon,
    FirstAidKitFillIcon,
    NotePencilIcon,
} from '@navikt/aksel-icons';
import { BrukersMeldekortDagStatus, MeldekortdagStatus } from '../../../types/MeldekortTypes';

export const velgIkonForMeldekortStatus = (status: string) => {
    switch (status) {
        case MeldekortdagStatus.Sperret:
        case BrukersMeldekortDagStatus.IKKE_REGISTRERT:
            return <CircleSlashIcon title="Sperret" color="black" width="1.2em" height="1.2em" />;

        case MeldekortdagStatus.DeltattUtenLønnITiltaket:
        case MeldekortdagStatus.FraværVelferdGodkjentAvNav:
        case BrukersMeldekortDagStatus.DELTATT:
            return (
                <CheckmarkCircleFillIcon
                    width="1.2em"
                    height="1.2em"
                    title="Full utbetaling"
                    color="green"
                />
            );

        case MeldekortdagStatus.IkkeDeltatt:
        case MeldekortdagStatus.DeltattMedLønnITiltaket:
        case MeldekortdagStatus.FraværVelferdIkkeGodkjentAvNav:
        case BrukersMeldekortDagStatus.FRAVÆR_ANNET:
            return (
                <MinusCircleFillIcon
                    width="1.2em"
                    height="1.2em"
                    title="Ingen utbetaling"
                    color="midnightblue"
                />
            );

        case MeldekortdagStatus.FraværSyk:
        case MeldekortdagStatus.FraværSyktBarn:
        case BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN:
        case BrukersMeldekortDagStatus.FRAVÆR_SYK:
            return (
                <FirstAidKitFillIcon
                    title="Redusert utbetaling"
                    color="chocolate"
                    fontSize="1.5rem"
                />
            );
        case MeldekortdagStatus.IkkeUtfylt:
            return (
                <NotePencilIcon width="1.2em" height="1.2em" title="Ikke utfylt" color="black" />
            );
    }
};
