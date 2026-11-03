import { Klagebehandling, KlagebehandlingResultat, KlageId } from './Klage';
import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';
import { VedtakType } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Nullable } from '~/types/UtilTypes';
import { Dato, Tidspunkt } from '~/types/DatoTid';

export interface Klagevedtak {
    klagevedtakId: VedtakId;
    klagebehandlingId: KlageId;
    sakId: SakId;
    opprettet: Tidspunkt;
    journalpostId: Nullable<string>;
    journalføringstidspunkt: Nullable<Tidspunkt>;
    distribusjonId: Nullable<string>;
    distribusjonstidspunkt: Nullable<Tidspunkt>;
    vedtaksdato: Nullable<Dato>;
    resultat: KlagebehandlingResultat;
}

export type KlagevedtakMedBehandling = Klagevedtak & {
    behandling: Klagebehandling;
    vedtakType: VedtakType.Klage;
};
