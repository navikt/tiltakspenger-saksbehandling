import { ActionMenu, Loader } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSak } from '~/lib/sak/SakContext';
import { useMeldekortbehandling } from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { SakProps } from '~/lib/sak/SakTyper';

export const MeldekortbehandlingTildelMeg = () => {
    const { sak, setSak } = useSak();
    const { id } = useMeldekortbehandling();

    const { trigger, error, isMutating } = useFetchJsonFraApi<SakProps>(
        `/sak/${sak.sakId}/meldekort/${id}/ta`,
        'POST',
    );

    const tildelMeg = () => {
        trigger().then((oppdatertSak) => {
            if (oppdatertSak) {
                setSak(oppdatertSak);
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
