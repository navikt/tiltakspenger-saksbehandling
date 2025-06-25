import { Periode } from './Periode';
import { SakId } from './SakTypes';
import { BehandlingStatus, Behandlingstype } from './BehandlingTypes';
import { ArrayOrSingle, Nullable } from './UtilTypes';
import { Avbrutt } from './Avbrutt';

export type SøknadId = `soknad_${string}`;

export type SøknadForBehandlingProps = {
    id: SøknadId;
    journalpostId: string;
    tiltak: ArrayOrSingle<SøknadTiltaksDeltagelse>;
    barnetillegg: SøknadBarn[];
    opprettet: string;
    tidsstempelHosOss: string;
    antallVedlegg: number;
    etterlønn: boolean;
    kvp?: Periode;
    intro?: Periode;
    institusjon?: Periode;
    sykepenger?: Periode;
    avbrutt: Nullable<Avbrutt>;
    visVedlegg: boolean;
} & SøknadPengestøtter;

export type SøknadPengestøtter = {
    // Fra-dato for alderspensjon
    alderspensjon?: string;
    gjenlevendepensjon?: Periode;
    supplerendeStønadAlder?: Periode;
    supplerendeStønadFlyktning?: Periode;
    trygdOgPensjon?: Periode;
    jobbsjansen?: Periode;
};

export type SøknadForOversiktProps = {
    id: SøknadId;
    sakId: SakId;
    saksnummer: string;
    typeBehandling: Behandlingstype.SØKNAD;
    resultat: null;
    status: BehandlingStatus.SØKNAD;
    underkjent: boolean;
    kravtidspunkt: string;
    fnr: string;
    periode: null;
    saksbehandler: null;
    beslutter: null;
    opprettet: string;
};

export type SøknadTiltaksDeltagelse = {
    id: string;
    fraOgMed: string;
    tilOgMed: string;
    typeKode: string;
    typeNavn: string;
};

export type SøknadBarn = {
    oppholderSegIEØS: boolean;
    fornavn?: string;
    mellomnavn?: string;
    etternavn?: string;
    fødselsdato: string;
    kilde: SøknadBarnKilde;
};

export enum SøknadBarnKilde {
    PDL = 'PDL',
    Manuell = 'Manuell',
}
