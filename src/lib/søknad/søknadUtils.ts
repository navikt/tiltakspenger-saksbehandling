import { Nullable } from '~/types/UtilTypes';
import { Søknad, Søknadshendelse, SøknadshendelseType } from '~/lib/søknad/søknadTyper';

/**
 * Gjenåpningen som ligger bak en behandling, altså den siste som skjedde før behandlingen ble
 * opprettet. Behandlinger som ble opprettet før den første gjenåpningen har ingen.
 */
export const hentGjenåpningForBehandling = (
    søknad: Søknad,
    behandlingOpprettet: string,
): Nullable<Søknadshendelse> =>
    søknad.avbrutt.findLast(
        (hendelse) =>
            hendelse.type === SøknadshendelseType.GJENÅPNET &&
            hendelse.tidspunkt <= behandlingOpprettet,
    ) ?? null;
