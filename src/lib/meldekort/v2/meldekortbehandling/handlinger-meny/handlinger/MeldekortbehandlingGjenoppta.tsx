import { ActionMenu, Loader } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingGjenoppta = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { trigger, error, isMutating } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${sak.sakId}/meldekort/${id}/gjenoppta`,
        'PATCH',
    );

    const gjenoppta = () => {
        trigger().then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortbehandlingen er gjenopptatt',
                );
            }
        });
    };

    return (
        <>
            <ActionMenu.Item
                icon={<PlayIcon aria-hidden />}
                onClick={(event) => {
                    event.preventDefault();
                    gjenoppta();
                }}
            >
                {isMutating ? <Loader /> : 'Gjenoppta'}
            </ActionMenu.Item>

            {error && (
                <Infokort
                    variant={'feil'}
                >{`Feil ved gjenopptak: ${error.message} (kode ${error.status})`}</Infokort>
            )}
        </>
    );
};
