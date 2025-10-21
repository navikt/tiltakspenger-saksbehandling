import { Periode } from './Periode';
import { SakId } from './Sak';

import { Nullable } from '~/types/UtilTypes';
import { BehandlingId, Behandlingsstatus, Behandlingstype } from './Behandling';
import { SøknadId } from './Søknad';

type RevurderingResultat = 'STANS' | 'REVURDERING_INNVILGELSE';
type SøknadsbehandlingResultat = 'AVSLAG' | 'INNVILGELSE';

export type BehandlingEllerSøknadForOversikt = BehandlingForOversikt | SøknadForOversikt;

export type BehandlingForOversikt = {
    id: BehandlingId;
    sakId: SakId;
    status: Behandlingsstatus;
    underkjent: boolean;
    kravtidspunkt: string | null;
    fnr: string;
    periode: Periode;
    saksnummer: string;
    saksbehandler: string;
    beslutter: string | null;
    opprettet: string;
    erSattPåVent: boolean;
} & (
    | {
          typeBehandling: Behandlingstype.REVURDERING;
          resultat: RevurderingResultat;
      }
    | {
          typeBehandling: Behandlingstype.SØKNADSBEHANDLING;
          resultat: Nullable<SøknadsbehandlingResultat>;
      }
);

export type SøknadForOversikt = {
    id: SøknadId;
    sakId: SakId;
    saksnummer: string;
    typeBehandling: Behandlingstype.SØKNAD;
    resultat: null;
    status: 'SØKNAD';
    underkjent: boolean;
    kravtidspunkt: string;
    fnr: string;
    periode: null;
    saksbehandler: null;
    beslutter: null;
    opprettet: string;
    erSattPåVent: boolean;
};
