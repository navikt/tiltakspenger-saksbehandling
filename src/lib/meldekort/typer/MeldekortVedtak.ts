import { Periode } from '../../../types/Periode';
import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { Nullable } from '../../../types/UtilTypes';
import { BrukersMeldekortDagProps } from './BrukersMeldekort';
import { MeldekortbehandlingId, MeldekortBeregning } from './Meldekortbehandling';
import { MeldeperiodeKjedeId } from './Meldeperiode';

export interface MeldekortVedtak {
    id: VedtakId;
    sakId: SakId;
    saksnummer: string;
    meldekortId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
    opprettet: string;
    saksbehandler: string;
    beslutter: string;
    periode: Periode;
    beregningsperiode: Periode;
    dager: BrukersMeldekortDagProps[];
    beregning: MeldekortBeregning;
    automatiskBehandlet: boolean;
    erKorrigering: boolean;
    begrunnelse: Nullable<string>;
    journalpostId: Nullable<string>;
}
