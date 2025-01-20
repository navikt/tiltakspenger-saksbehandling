import { Lovreferanse, Utfall, ÅrsakTilEndring } from './BehandlingTypes';
import { Periode } from './Periode';

export interface TiltakDeltagelseVilkår {
    registerSaksopplysning: TiltakDeltagelseSaksopplysning;
    saksbehandlerSaksopplysning?: TiltakDeltagelseSaksopplysning;
    avklartSaksopplysning: TiltakDeltagelseSaksopplysning;
    vilkårLovreferanse: Lovreferanse;
    utfallperiode: Periode;
    samletUtfall: Utfall;
}

interface TiltakDeltagelseSaksopplysning {
    tiltakNavn: string;
    deltagelsePeriode: Periode;
    status: DeltagelseStatus;
    kilde: Kilde;
}

enum Kilde {
    KOMET = 'Komet',
    ARENA = 'Arena',
}

export enum DeltagelseStatus {
    HarSluttet = 'HarSluttet',
    VenterPåOppstart = 'VenterPåOppstart',
    Deltar = 'Deltar',
    Avbrutt = 'Avbrutt',
    Fullført = 'Fullført',
    IkkeAktuell = 'IkkeAktuell',
    Feilregistrert = 'Feilregistrert',
    PåbegyntRegistrering = 'PåbegyntRegistrering',
    SøktInn = 'SøktInn',
    Venteliste = 'Venteliste',
    Vurderes = 'Vurderes',
}

export const deltagelsestatuser = Object.values(DeltagelseStatus);

interface StatusForPeriode {
    periode: Periode;
    status: DeltagelseStatus;
}

export interface tiltaksdeltagelseBody {
    statusForPeriode: StatusForPeriode[];
}
