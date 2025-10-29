import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { Søknad, SøknadId } from '~/types/Søknad';
import {
    Rammebehandling,
    BehandlingId,
    RammebehandlingResultat,
    Behandlingstype,
} from '~/types/Behandling';

type AvbruttSøknad = {
    behandlingstype: Behandlingstype.SØKNAD;
    id: SøknadId;
};

type AvbruttBehandling = {
    behandlingstype: Behandlingstype.SØKNADSBEHANDLING | Behandlingstype.REVURDERING;
    id: BehandlingId;
    resultat: RammebehandlingResultat;
};

export type AvbruttSøknadEllerBehandlingCellInfo = {
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
} & (AvbruttSøknad | AvbruttBehandling);

export const avbruttBehandlingToDataCellInfo = (
    behandling: Rammebehandling,
): AvbruttSøknadEllerBehandlingCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    return {
        id: behandling.id,
        behandlingsperiode: behandling.virkningsperiode,
        resultat: behandling.resultat,
        //raq - todo - fiks dette
        behandlingstype: behandling.type as
            | Behandlingstype.SØKNADSBEHANDLING
            | Behandlingstype.REVURDERING,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};

export const avbruttSøknadToDataCellInfo = (
    søknad: Søknad,
): AvbruttSøknadEllerBehandlingCellInfo => {
    if (søknad.avbrutt == null) {
        throw new Error('Kan ikke hente ut informasjon fra en behandling som ikke er begrunnelse');
    }
    return {
        id: søknad.id,
        behandlingsperiode:
            søknad.tiltak?.fraOgMed && søknad.tiltak?.tilOgMed
                ? {
                      fraOgMed: søknad.tiltak.fraOgMed,
                      tilOgMed: søknad.tiltak.tilOgMed,
                  }
                : null,
        behandlingstype: Behandlingstype.SØKNAD,
        tidspunktAvsluttet: søknad.avbrutt.avbruttTidspunkt,
        avsluttetPga: 'avbrutt',
    };
};
