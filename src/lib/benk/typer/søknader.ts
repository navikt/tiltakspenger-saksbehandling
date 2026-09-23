import { Nullable } from '~/types/UtilTypes';
import { Søknadstype } from '~/lib/søknad/søknadTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFellesFilter,
    benkFellesKolonner,
} from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type BenkSøknadsbehandlingProps = {
    type: BenkBehandlingstype.SØKNADSBEHANDLING;
    id: RammebehandlingId;
    status: BenkBehandlingsstatus;
    søknadstype: Søknadstype;
    kravtidspunkt: string;
    resultat: Nullable<SøknadsbehandlingResultat>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export type BenkSøknadsbehandling = BenkBehandlingBase<BenkSøknadsbehandlingProps>;
export type BenkSøknadsbehandlingMedTilgang =
    BenkBehandlingMedTilgangBase<BenkSøknadsbehandlingProps>;

export const BenkSøknaderKolonne = {
    ...benkFellesKolonner,
    søknadstype: 'søknadstype',
    kravtidspunkt: 'kravtidspunkt',
    resultat: 'resultat',
    beslutter: 'beslutter',
} as const;

export type BenkSøknaderKolonne = (typeof BenkSøknaderKolonne)[keyof typeof BenkSøknaderKolonne];

export type BenkSøknaderFilter = BenkFellesFilter & {
    status: Nullable<BenkBehandlingsstatus>;
    resultat: Nullable<SøknadsbehandlingResultat>;
    søknadstype: Nullable<Søknadstype>;
};
