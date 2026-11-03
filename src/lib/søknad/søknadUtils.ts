import { Nullable } from '~/types/UtilTypes';
import { Søknad, Søknadshendelse, SøknadshendelseType } from '~/lib/søknad/søknadTyper';
import { Tidspunkt } from '~/types/DatoTid';

/**
 * Gjenåpningen som ligger bak en behandling, altså den siste som skjedde før behandlingen ble
 * opprettet. Behandlinger som ble opprettet før den første gjenåpningen har ingen.
 */
export const hentGjenåpningForBehandling = (
    søknad: Søknad,
    behandlingOpprettet: Tidspunkt,
): Nullable<Søknadshendelse> =>
    søknad.avbrutt.findLast(
        (hendelse) =>
            hendelse.type === SøknadshendelseType.GJENÅPNET &&
            hendelse.tidspunkt <= behandlingOpprettet,
    ) ?? null;
