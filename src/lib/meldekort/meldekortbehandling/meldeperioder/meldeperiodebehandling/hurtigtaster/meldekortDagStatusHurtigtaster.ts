import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { PartialRecord } from '~/types/UtilTypes';

type DagStatusHurtigtast = {
    tast: string;
    status: MeldekortbehandlingDagStatus;
};

export const meldekortDagStatusHurtigtaster: DagStatusHurtigtast[] = [
    { tast: 'd', status: MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket },
    { tast: 'l', status: MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket },
    { tast: 'i', status: MeldekortbehandlingDagStatus.IkkeTiltaksdag },
    { tast: 's', status: MeldekortbehandlingDagStatus.FraværSyk },
    { tast: 'b', status: MeldekortbehandlingDagStatus.FraværSyktBarn },
    {
        tast: 'v',
        status: MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
    },
    { tast: 'a', status: MeldekortbehandlingDagStatus.FraværAnnet },
];

export const hurtigtastTilDagStatus: PartialRecord<string, MeldekortbehandlingDagStatus> =
    Object.fromEntries(meldekortDagStatusHurtigtaster.map(({ tast, status }) => [tast, status]));
