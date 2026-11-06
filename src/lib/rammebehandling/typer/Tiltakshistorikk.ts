import { ÅpenPeriode } from '~/types/Periode';
import { Tidspunkt } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';
import { TiltakDeltakerstatus, TiltaksdeltakelseKilde } from './Tiltaksdeltakelse';
import { TiltaksdeltakerEndring } from './Revurdering';
import { RammebehandlingId } from './Rammebehandling';

/**
 * Tiltakshistorikken som er innhentet for tiltaksdeltakelsene i behandlingen, fra den ble opprettet til den ble iverksatt eller avbrutt.
 * `harEndringEtterSistEndret` er true når det er innhentet tiltakshistorikk etter at behandlingen sist ble endret, mens den er under behandling eller beslutning.
 */
export type TiltakshistorikkForBehandling = {
    innslag: Tiltakshistorikkinnslag[];
    harEndringEtterSistEndret: boolean;
};

export type Tiltakshistorikkinnslag = {
    id: string;
    internDeltakelseId: string;
    eksternDeltagelseId: string;
    innhentet: Tidspunkt;
    typeNavn: string;
    periode: ÅpenPeriode;
    /** Null når vi ikke kjenner igjen statusen fra kilden. */
    deltakelseStatus: Nullable<TiltakDeltakerstatus>;
    /** Statuskoden slik den står i kontrakten med kilden. */
    kildestatus: string;
    deltakelseProsent: Nullable<number>;
    antallDagerPerUke: Nullable<number>;
    gjennomforingsprosent: Nullable<number>;
    kilde: TiltaksdeltakelseKilde;
    /** Endringene vi utledet mot saken. Tom når endringen ikke var relevant for saken. */
    endringer: TiltaksdeltakerEndring[];
    /** True for innslaget som førte til at behandlingen ble opprettet automatisk. */
    utløsteBehandlingen: boolean;
    behandlingId: Nullable<RammebehandlingId>;
    oppgaveId: Nullable<string>;
};
