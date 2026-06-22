import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId } from './Meldekortbehandling';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

export type Meldekortvedtak = {
    id: VedtakId;
    sakId: SakId;
    meldekortId: MeldekortbehandlingId;
    opprettet: string;
    journalpostId: Nullable<string>;
};

export type MeldekortvedtakMedBehandling = Meldekortvedtak & {
    behandling: MeldekortbehandlingPropsV2;
};
