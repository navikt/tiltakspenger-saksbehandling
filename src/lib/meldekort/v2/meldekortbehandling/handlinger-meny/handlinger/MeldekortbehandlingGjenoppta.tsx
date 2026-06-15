import { ActionMenu, Loader } from '@navikt/ds-react';
import { PlayIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakProps } from '~/lib/sak/SakTyper';

export const MeldekortbehandlingGjenoppta = () => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/meldekort/${id}/gjenoppta`,
        'PATCH',
    );

    const gjenoppta = () => {
        trigger().then((oppdatertSak) => {
            if (oppdatertSak) {
                setSak(oppdatertSak);
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
