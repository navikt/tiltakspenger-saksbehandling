import { Periode } from './Periode';
import { SakId } from './SakTypes';
import { BehandlingStatus, Behandlingstype } from './BehandlingTypes';
import { ArrayOrSingle } from './UtilTypes';

export type SøknadId = `soknad_${string}`;

export type SøknadForBehandlingProps = {
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
    gjenlevendepensjon?: Periode;
    // Fra-dato for alderspensjon
    alderspensjon?: string;
    supplerendeStønadAlder?: Periode;
    supplerendeStønadFlyktning?: Periode;
    trygdOgPensjon?: Periode;
    jobbsjansen?: Periode;
};

export type SøknadForOversiktProps = {
    id: SøknadId;
    sakId: SakId | null;
    saksnummer: string | null;
    typeBehandling: Behandlingstype.SØKNAD;
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
};
