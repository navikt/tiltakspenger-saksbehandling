import { ActionMenu, Loader } from '@navikt/ds-react';
import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { personoversiktUrl } from '~/utils/urls';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';

export const MeldekortbehandlingLeggTilbake = () => {
    const { sak } = useSak();
    const { id } = useMeldekortbehandling();
    const { navigateWithNotification } = useNotification();

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/meldekort/${id}/legg-tilbake`,
        'POST',
    );

    const leggTilbake = () => {
        trigger().then((response) => {
            if (response) {
                navigateWithNotification(
                    personoversiktUrl(sak.saksnummer, PersonoversiktTab.Meldekort),
                    'Meldekortbehandlingen er lagt tilbake',
                );
            }
        });
    };

    return (
        <>
            <ActionMenu.Item
                icon={<ArrowUndoIcon aria-hidden />}
                onClick={(event) => {
                    event.preventDefault();
                    leggTilbake();
                }}
            >
                {isMutating ? <Loader /> : 'Legg tilbake'}
            </ActionMenu.Item>

            {error && (
                <Infokort
                    variant={'feil'}
                >{`Feil ved å legge tilbake: ${error.message} (kode ${error.status})`}</Infokort>
            )}
        </>
    );
};
