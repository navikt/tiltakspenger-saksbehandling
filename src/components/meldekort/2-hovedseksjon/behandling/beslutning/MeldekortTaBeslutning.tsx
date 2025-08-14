import { Button, HStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { useMeldeperiodeKjede } from '../../../MeldeperiodeKjedeContext';
import { useGodkjennMeldekort } from './useGodkjennMeldekort';
import { useSak } from '../../../../../context/sak/SakContext';
import { useRef } from 'react';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { Underkjenn } from '../../../../underkjenn/Underkjenn';
import { useFetchJsonFraApi } from '../../../../../utils/fetch/useFetchFraApi';
import router from 'next/router';
import { useNotification } from '~/context/NotificationContext';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortTaBeslutning = ({ meldekortBehandling }: Props) => {
    const { sakId, saksnummer } = useSak().sak;
    const { navigateWithNotification } = useNotification();
    const { setMeldeperiodeKjede } = useMeldeperiodeKjede();

    const { godkjennMeldekort, godkjennMeldekortLaster, reset, godkjennMeldekortFeil } =
        useGodkjennMeldekort(meldekortBehandling.id, sakId);

    const underkjennApi = useFetchJsonFraApi<MeldekortBehandlingProps, { begrunnelse: string }>(
        `/sak/${sakId}/meldekort/${meldekortBehandling.id}/underkjenn`,
        'POST',
        {
            onSuccess: () => {
                router.push(`/sak/${saksnummer}`);
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
            <HStack justify="start" gap="3" align="end">
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
                                        `/sak/${saksnummer}`,
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
