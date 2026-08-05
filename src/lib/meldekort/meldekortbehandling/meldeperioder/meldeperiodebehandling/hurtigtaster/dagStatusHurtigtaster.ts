import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { PartialRecord } from '~/types/UtilTypes';

/** Hurtigtaster for å velge status når statusvelgeren for en dag har fokus */
export const hurtigtastTilDagStatus: PartialRecord<string, MeldekortbehandlingDagStatus> = {
    d: MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
    l: MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket,
    i: MeldekortbehandlingDagStatus.IkkeTiltaksdag,
    s: MeldekortbehandlingDagStatus.FraværSyk,
    b: MeldekortbehandlingDagStatus.FraværSyktBarn,
    v: MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
    a: MeldekortbehandlingDagStatus.FraværAnnet,
};
