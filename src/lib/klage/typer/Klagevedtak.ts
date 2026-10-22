import { Klagebehandling, KlagebehandlingResultat, KlageId } from './Klage';
import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Nullable } from '~/types/UtilTypes';

export interface Klagevedtak {
    klagevedtakId: VedtakId;
    klagebehandlingId: KlageId;
    sakId: SakId;
    opprettet: string;
    journalpostId: Nullable<string>;
    journalføringstidspunkt: Nullable<string>;
    distribusjonId: Nullable<string>;
    distribusjonstidspunkt: Nullable<string>;
    vedtaksdato: Nullable<string>;
    resultat: KlagebehandlingResultat;
}

export type KlagevedtakMedBehandling = Klagevedtak & {
    behandling: Klagebehandling;
    vedtakType: VedtakType.Klage;
};
