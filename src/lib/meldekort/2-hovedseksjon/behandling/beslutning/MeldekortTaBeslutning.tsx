import { Button, HStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { useGodkjennMeldekort } from './useGodkjennMeldekort';
import { useSak } from '~/lib/sak/SakContext';
import { useRef } from 'react';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { Underkjenn } from '~/lib/behandling-felles/underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import router from 'next/router';
import { useNotification } from '~/lib/_felles/notifications/NotificationContext';
import { PersonoversiktTab } from '~/lib/personoversikt/Personoversikt';
import { personoversiktUrl } from '~/utils/urls';

type Props = {
    meldekortbehandling: MeldekortbehandlingProps;
};

export const MeldekortTaBeslutning = ({ meldekortbehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { navigateWithNotification } = useNotification();
    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const { godkjennMeldekort, godkjennMeldekortLaster, reset, godkjennMeldekortFeil } =
        useGodkjennMeldekort(meldekortbehandling.id, sakId);

    const underkjennApi = useFetchJsonFraApi<MeldekortbehandlingProps, { begrunnelse: string }>(
        `/sak/${sakId}/meldekort/${meldekortbehandling.id}/underkjenn`,
        'POST',
        {
            onSuccess: () => {
                router.push(personoversiktUrl(saksnummer, PersonoversiktTab.Meldekort));
            },
        },
    );

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };

    return (
        <>
            <HStack justify="start" gap="space-12" align="end">
                <Underkjenn
                    size="small"
                    onUnderkjenn={{
                        click: (begrunnelse) => underkjennApi.trigger({ begrunnelse }),
                        pending: underkjennApi.isMutating,
                        error: underkjennApi.error,
                    }}
                />
                <Button
                    size="small"
                    loading={godkjennMeldekortLaster}
                    onClick={() => modalRef.current?.showModal()}
                >
                    Godkjenn meldekort
                </Button>
            </HStack>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Godkjenn meldekortet'}
                feil={godkjennMeldekortFeil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        size={'small'}
                        loading={godkjennMeldekortLaster}
                        onClick={() =>
                            godkjennMeldekort().then((oppdatertKjede) => {
                                if (oppdatertKjede) {
                                    setMeldeperiodeKjede(oppdatertKjede);
                                    navigateWithNotification(
                                        personoversiktUrl(saksnummer),
                                        'Meldekortet er godkjent',
                                    );
                                }
                            })
                        }
                    >
                        Godkjenn meldekort
                    </Button>
                }
            >
                {'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'}
            </BekreftelsesModal>
        </>
    );
};
