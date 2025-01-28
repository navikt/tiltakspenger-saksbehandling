import { Alert, BodyShort, Button, HStack, Spacer } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useSak } from '../../../../layout/SakLayout';
import {
    BrukersMeldekortProps,
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
} from '../../../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { MeldekortBehandlingUke } from './MeldekortBehandlingUke';
import BekreftelsesModal from '../../../../bekreftelsesmodal/BekreftelsesModal';
import { useRouter } from 'next/router';
import {
    hentMeldekortBehandlingDager,
    tellDagerMedDeltattEllerFravær,
} from './meldekortBehandlingUtils';

import styles from '../../Meldekort.module.css';

type Props = {
    meldekortBehandling: MeldekortBehandlingProps;
    maksAntallDager: number;
    brukersMeldekort?: BrukersMeldekortProps;
};

export const MeldekortBehandling = ({
    meldekortBehandling,
    maksAntallDager,
    brukersMeldekort,
}: Props) => {
    const { sakId } = useSak();
    const router = useRouter();
    const dager = hentMeldekortBehandlingDager(meldekortBehandling, brukersMeldekort);

    const [dagerUtfylt, setDagerUtfylt] = useState(dager);
    const [errors, setErrors] = useState<string[]>([]);

    const uke1 = dagerUtfylt.slice(0, 7);
    const uke2 = dagerUtfylt.slice(7, 14);

    const settStatus = (dato: string, status: MeldekortBehandlingDagStatus) => {
        setErrors([]);
        setDagerUtfylt(dagerUtfylt.map((dag) => (dag.dato === dato ? { dato, status } : dag)));
    };

    const {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    } = useSendMeldekortTilBeslutter({
        meldekortId: meldekortBehandling.id,
        sakId,
        onSuccess: () => {
            lukkModal();
            router.reload();
        },
    });

    const modalRef = useRef(null);

    const lukkModal = () => {
        modalRef.current.close();
        reset();
    };

    const validerOgÅpneBekreftelse = () => {
        const _errors: string[] = [];
        if (tellDagerMedDeltattEllerFravær(dagerUtfylt) > maksAntallDager) {
            _errors.push(
                `For mange dager med tiltak - Maks er ${maksAntallDager} dager for denne brukeren.`,
            );
        }
        if (dagerUtfylt.some((dag) => dag.status === MeldekortBehandlingDagStatus.IkkeUtfylt)) {
            _errors.push('Alle dager må fylles ut.');
        }

        setErrors(_errors);

        if (_errors.length === 0) {
            modalRef.current?.showModal();
        }
    };

    return (
        <>
            <HStack className={styles.meldekort}>
                <MeldekortBehandlingUke settStatus={settStatus} dager={uke1} />
                <Spacer />
                <MeldekortBehandlingUke settStatus={settStatus} dager={uke2} />
            </HStack>
            {errors.length > 0 && (
                <Alert variant={'error'}>
                    <BodyShort weight={'semibold'}>{'Feil i utfyllingen'}</BodyShort>
                    {errors.map((error) => (
                        <BodyShort key={error}>{error}</BodyShort>
                    ))}
                </Alert>
            )}
            <Button
                size={'small'}
                style={{ marginTop: '2.5rem' }}
                disabled={errors.length > 0}
                onClick={() => validerOgÅpneBekreftelse()}
            >
                Send til beslutter
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Send meldekort til beslutter'}
                body={
                    'Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til beslutter?'
                }
                error={feilVedSendingTilBeslutter}
                lukkModal={lukkModal}
            >
                <Button
                    size="small"
                    loading={senderMeldekortTilBeslutter}
                    onClick={() =>
                        sendMeldekortTilBeslutter({
                            dager: dager,
                        })
                    }
                >
                    Send til beslutter
                </Button>
            </BekreftelsesModal>
        </>
    );
};
