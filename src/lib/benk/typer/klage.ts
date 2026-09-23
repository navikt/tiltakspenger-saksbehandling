import { Nullable } from '~/types/UtilTypes';
import { KlagebehandlingResultat, KlageId } from '~/lib/klage/typer/Klage';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingstype,
    BenkFellesFilter,
    benkFellesKolonner,
} from './felles';

/**
 * Statusene en klage kan ha i benken. Klage har ingen beslutningsflyt, men får
 * KLAR_TIL_FERDIGSTILLING når den er mottatt tilbake fra klageinstans.
 */
export enum BenkKlageStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_FERDIGSTILLING = 'KLAR_TIL_FERDIGSTILLING',
}

type BenkKlagebehandlingProps = {
    type: BenkBehandlingstype.KLAGEBEHANDLING;
    id: KlageId;
    status: BenkKlageStatus;
    kravtidspunkt: string;
    resultat: Nullable<KlagebehandlingResultat>;
    beslutter: null;
};

export type BenkKlagebehandling = BenkBehandlingBase<BenkKlagebehandlingProps>;
export type BenkKlagebehandlingMedTilgang = BenkBehandlingMedTilgangBase<BenkKlagebehandlingProps>;

export const BenkKlageKolonne = {
    ...benkFellesKolonner,
    resultat: 'resultat',
    kravtidspunkt: 'kravtidspunkt',
} as const;

export type BenkKlageKolonne = (typeof BenkKlageKolonne)[keyof typeof BenkKlageKolonne];

export type BenkKlageFilter = BenkFellesFilter & {
    status: Nullable<BenkKlageStatus>;
    resultat: Nullable<KlagebehandlingResultat>;
};
