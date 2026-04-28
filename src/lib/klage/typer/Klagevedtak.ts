import { KlagebehandlingResultat, KlageId } from './Klage';
import { VedtakId } from '../../rammebehandling/typer/Rammevedtak';
import { SakId } from '../../sak/SakTyper';

export interface Klagevedtak {
    klagevedtakId: VedtakId;
    klagebehandlingId: KlageId;
    sakId: SakId;
    opprettet: string;
    journalpostId?: string;
    journalføringstidspunkt?: string;
    distribusjonId?: string;
    distribusjonstidspunkt?: string;
    vedtaksdato?: string;
    resultat: KlagebehandlingResultat;
}
