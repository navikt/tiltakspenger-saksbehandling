import { Button, HStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '../../../../modaler/BekreftelsesModal';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { useGodkjennMeldekort } from '../../../hooks/useGodkjennMeldekort';
import { useSak } from '../../../../../context/sak/SakContext';
import { useRef } from 'react';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBeslutning = ({ meldekortBehandling }: Props) => {
    const { sakId } = useSak().sak;
    const { oppdaterMeldekortBehandling } = useMeldeperiodeKjede();

    const { godkjennMeldekort, godkjennMeldekortLaster, reset, godkjennMeldekortFeil } =
        useGodkjennMeldekort(meldekortBehandling.id, sakId);

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => {
        modalRef.current?.close();
        reset();
    };
    return (
        <>
            <HStack justify="start" gap="3" align="end">
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
                            godkjennMeldekort().then((meldekortBehandling) => {
                                if (meldekortBehandling) {
                                    oppdaterMeldekortBehandling(meldekortBehandling);
                                }
                            })
                        }
                    >
                        {'Godkjenn meldekort'}
                    </Button>
                }
            >
                {'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'}
            </BekreftelsesModal>
        </>
    );
};
