import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

/** Slår opp et barn i folkeregisteret. Backend svarer 404 når fnr ikke er et av søkers barn. */
export const useHentBarnFraFolkeregister = (sakId: SakId, behandlingId: RammebehandlingId) =>
    useFetchJsonFraApi<Personopplysninger, { fnr: string }>(
        `/sak/${sakId}/behandling/${behandlingId}/barn/folkeregister`,
        'POST',
    );
