import { Periode } from './Periode';
import { SakId } from './SakTypes';
import { BehandlingStatus, TypeBehandling } from './BehandlingTypes';

export type SøknadId = `soknad_${string}`;

export type SøknadForBehandlingProps = {
    journalpostId: string;
    tiltak: SøknadTiltaksDeltagelse;
    barnetillegg: SøknadBarn[];
    opprettet: string;
    tidsstempelHosOss: string;
    antallVedlegg: number;
    etterlønn: boolean;
    kvp?: Periode;
    intro?: Periode;
    institusjon?: Periode;
    gjenlevendepensjon?: Periode;
    // Fra-dato for alderspensjon
    alderspensjon?: string;
    sykepenger?: Periode;
    supplerendeStønadAlder?: Periode;
    supplerendeStønadFlyktning?: Periode;
    jobbsjansen?: Periode;
    trygdOgPensjon?: Periode;
};

export type SøknadForOversiktProps = {
    id: SøknadId;
    sakId: SakId | null;
    saksnummer: string | null;
    typeBehandling: TypeBehandling.SØKNAD;
    status: BehandlingStatus.SØKNAD;
    underkjent: boolean;
    kravtidspunkt: string;
    fnr: string;
    periode: null;
    saksbehandler: null;
    beslutter: null;
    erDeprecatedBehandling: null;
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
