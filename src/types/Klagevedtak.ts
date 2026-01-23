import { KlagebehandlingResultat, KlageId } from './Klage';
import { VedtakId } from './Rammevedtak';
import { SakId } from './Sak';

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
