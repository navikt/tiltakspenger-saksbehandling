import { ActionMenu, Loader } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingTildelMeg = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { trigger, error, isMutating } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${sak.sakId}/meldekort/${id}/ta`,
        'POST',
    );

    const tildelMeg = () => {
        trigger().then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortbehandlingen er tildelt deg',
                );
            }
        });
    };

    return (
        <>
            <ActionMenu.Item
                icon={<PersonIcon aria-hidden />}
                onClick={(event) => {
                    event.preventDefault();
                    tildelMeg();
                }}
            >
                {isMutating ? <Loader /> : 'Tildel meg'}
            </ActionMenu.Item>

            {error && (
                <Infokort
                    variant={'feil'}
                >{`Feil ved tildeling: ${error.message} (kode ${error.status})`}</Infokort>
            )}
        </>
    );
};
