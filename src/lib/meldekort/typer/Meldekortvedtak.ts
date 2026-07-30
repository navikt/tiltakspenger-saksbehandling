import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId, MeldekortbehandlingProps } from './Meldekortbehandling';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';

export type Meldekortvedtak = {
    id: VedtakId;
    sakId: SakId;
    meldekortId: MeldekortbehandlingId;
    opprettet: string;
    journalpostId: Nullable<string>;
};

export type MeldekortvedtakMedBehandling = Meldekortvedtak & {
    behandling: MeldekortbehandlingProps;
    vedtakType: VedtakType.Meldekort;
};
