import {
    BehandlingStatus,
    TypeBehandling,
    Utfall,
    ÅrsakTilEndring,
} from '../types/BehandlingTypes';
import { Opphold } from '../types/InstitusjonsoppholdTypes';
import { Deltagelse } from '../types/KvpTypes';
import {
    MeldekortBehandlingDagStatus,
    BrukersMeldekortDagStatus,
    MeldeperiodeStatus,
} from '../types/MeldekortTypes';
import { DeltagelseStatus } from '../types/TiltakDeltagelseTypes';
import { Kilde } from '../types/VilkårTypes';

export const finnKildetekst = (kilde: string) => {
    switch (kilde) {
        case Kilde.SØKNAD:
            return 'Søknad';
        case Kilde.PDL:
            return 'Folkeregisteret';
        case Kilde.KOMET:
            return 'Komet';
        case Kilde.ARENA:
            return 'Arena';
    }
};

export function lagUtfallstekst(utfall: string) {
    switch (utfall) {
        case Utfall.OPPFYLT:
            return 'Vilkåret er oppfylt i hele perioden';
        case Utfall.IKKE_OPPFYLT:
            return 'Vilkåret er ikke oppfylt';
        case Utfall.DELVIS_OPPFYLT:
            return 'Vilkåret er delvis oppfylt';
        case Utfall.UAVKLART:
            return 'Vilkåret er uavklart';
        default:
            return 'Vilkåret er uavklart';
    }
}

export const lagFaktumTekstAvLivsopphold = (harLivsoppholdYtelser: boolean) => {
    return harLivsoppholdYtelser
        ? 'Søker har andre ytelser til livsopphold'
        : 'Søker har ikke andre ytelser til livsopphold';
};

export const lagFaktumTekst = (faktum: Deltagelse | Opphold) => {
    switch (faktum) {
        case Deltagelse.DELTAR_IKKE:
            return 'Søker deltar ikke';
        case Deltagelse.DELTAR:
            return 'Søker deltar';
        case Opphold.IKKE_OPPHOLD:
            return 'Søker oppholder seg ikke på institusjon';
        case Opphold.OPPHOLD:
            return 'Søker oppholder seg på institusjon';
        default:
            return 'Vilkåret er uavklart';
    }
};

export const finnStatusTekst = (status: string, underkjent: boolean) => {
    switch (status) {
        case BehandlingStatus.VEDTATT:
            return 'Vedtatt';
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
            return underkjent ? 'Underkjent' : 'Klar til behandling';
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
            return 'Klar til beslutning';
        case BehandlingStatus.SØKNAD:
            return 'Søknad';
        case BehandlingStatus.UNDER_BEHANDLING:
            return underkjent ? 'Underkjent' : 'Under behandling';
        case BehandlingStatus.UNDER_BESLUTNING:
            return 'Under beslutning';
        case BehandlingStatus.KAN_BEHANDLES:
            return 'Kan behandles';
        case BehandlingStatus.KAN_IKKE_BEHANDLES:
            return 'Kan ikke behandles';
    }
};

export const finnMeldekortdagStatusTekst = (status: string) => {
    switch (status) {
        case MeldekortBehandlingDagStatus.Sperret:
        case BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER:
            return 'Ikke rett på tiltakspenger';
        case MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket:
            return 'Deltatt med lønn i tiltaket';
        case MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket:
        case BrukersMeldekortDagStatus.DELTATT:
            return 'Deltatt uten lønn i tiltaket';
        case MeldekortBehandlingDagStatus.FraværSyk:
        case BrukersMeldekortDagStatus.FRAVÆR_SYK:
            return 'Fravær - Syk';
        case MeldekortBehandlingDagStatus.FraværSyktBarn:
        case BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN:
            return 'Fravær - Sykt barn';
        case MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav:
            return 'Godkjent fravær - Velferd';
        case MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav:
            return 'Ikke godkjent fravær - Velferd';
        case MeldekortBehandlingDagStatus.IkkeDeltatt:
            return 'Ikke deltatt i tiltaket';
        case MeldekortBehandlingDagStatus.IkkeUtfylt:
        case BrukersMeldekortDagStatus.IKKE_REGISTRERT:
            return 'Ikke utfylt';
        case BrukersMeldekortDagStatus.FRAVÆR_ANNET:
            return 'Annet fravær';
    }
};

export const finnMeldeperiodeStatusTekst: Record<MeldeperiodeStatus, string> = {
    [MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'Ikke rett til tiltakspenger',
    [MeldeperiodeStatus.IKKE_KLAR_TIL_UTFYLLING]: 'Ikke klar til utfylling',
    [MeldeperiodeStatus.VENTER_PÅ_UTFYLLING]: 'Venter på utfylling',
    [MeldeperiodeStatus.KLAR_TIL_BEHANDLING]: 'Klar til behandling',
    [MeldeperiodeStatus.KLAR_TIL_BESLUTNING]: 'Klar til beslutning',
    [MeldeperiodeStatus.GODKJENT]: 'Godkjent',
} as const;

export const deltagelseTekst = (deltagelse: Deltagelse): string => {
    switch (deltagelse) {
        case Deltagelse.DELTAR:
            return 'Ja';
        case Deltagelse.DELTAR_IKKE:
            return 'Nei';
    }
};

export const finnBehandlingstypeTekst = (behandlingstype: TypeBehandling): string => {
    switch (behandlingstype) {
        case TypeBehandling.FØRSTEGANGSBEHANDLING:
            return 'Førstegangsbehandling';
        case TypeBehandling.REVURDERING:
            return 'Revurdering';
        case TypeBehandling.SØKNAD:
            'Søknad';
        default:
            return 'Søknad';
    }
};

export const finnDeltagelsestatusTekst = (deltagelsestatus: DeltagelseStatus): string => {
    switch (deltagelsestatus) {
        case DeltagelseStatus.HarSluttet:
            return 'Har sluttet';
        case DeltagelseStatus.VenterPåOppstart:
            return 'Venter på oppstart';
        case DeltagelseStatus.Deltar:
            return 'Deltar';
        case DeltagelseStatus.Avbrutt:
            return 'Avbrutt';
        case DeltagelseStatus.Fullført:
            return 'Fullført';
        case DeltagelseStatus.IkkeAktuell:
            return 'Ikke aktuell';
        case DeltagelseStatus.Feilregistrert:
            return 'Feilregistrert';
        case DeltagelseStatus.PåbegyntRegistrering:
            return 'Påbegynt registrering';
        case DeltagelseStatus.SøktInn:
            return 'Søkt inn';
        case DeltagelseStatus.Venteliste:
            return 'Venteliste';
        case DeltagelseStatus.Vurderes:
            return 'Vurderes';
    }
};

export const finnÅrsaksTekst = (årsak: ÅrsakTilEndring): string => {
    switch (årsak) {
        case ÅrsakTilEndring.ENDRING_ETTER_SØKNADSTIDSPUNKT:
            return 'Endring etter søknadstidspunkt';
        case ÅrsakTilEndring.FEIL_I_INNHENTET_DATA:
            return 'Feil i innhentet data';
    }
};
