import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { MeldekortbehandlingId, MeldekortbehandlingProps } from './Meldekortbehandling';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Tidspunkt } from '~/types/DatoTid';

export type Meldekortvedtak = {
    id: VedtakId;
    sakId: SakId;
    meldekortId: MeldekortbehandlingId;
    opprettet: Tidspunkt;
    journalpostId: Nullable<string>;
};

export type MeldekortvedtakMedBehandling = Meldekortvedtak & {
    behandling: MeldekortbehandlingProps;
    vedtakType: VedtakType.Meldekort;
};
