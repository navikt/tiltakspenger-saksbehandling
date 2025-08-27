import { Alert, BodyShort, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import router from 'next/router';

import style from './MeldekortBehandlingKnapper.module.css';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../../types/meldekort/MeldekortBehandling';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';
import { SakId } from '../../../types/SakTypes';

export const OvertaMeldekortbehandlingModal = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    overtarFra: string;
    meldeperiodeUrl: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const overtaMeldekortBehandlingApi = useFetchJsonFraApi<
        MeldekortBehandlingProps,
        { overtarFra: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortBehandlingId}/overta`, 'PATCH', {
        onSuccess: () => {
            router.push(props.meldeperiodeUrl);
        },
    });

    return (
        <Modal width={480} aria-label="Overta behandling" open={props.åpen} onClose={props.onClose}>
            <Modal.Header>
                <Heading size="medium" level="3">
                    Overta meldekortbehandling
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyShort>
                    Er du sikker på at du vil ta over meldekortbehandlingen fra {props.overtarFra}?
                </BodyShort>
            </Modal.Body>
            <Modal.Footer>
                <VStack gap="4">
                    {overtaMeldekortBehandlingApi.error && (
                        <Alert variant={'error'}>
                            {overtaMeldekortBehandlingApi.error.message}
                        </Alert>
                    )}
                    <HStack gap="2">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() =>
                                overtaMeldekortBehandlingApi.trigger({
                                    overtarFra: props.overtarFra,
                                })
                            }
                            loading={overtaMeldekortBehandlingApi.isMutating}
                        >
                            Overta behandling
                        </Button>
                    </HStack>
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};

const OvertaMeldekortBehandling = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    overtarFra: string;
    meldeperiodeUrl: string;
}) => {
    const [vilOvertaBehandling, setVilOvertaBehandling] = useState(false);

    return (
        <div>
            {vilOvertaBehandling && (
                <OvertaMeldekortbehandlingModal
                    åpen={vilOvertaBehandling}
                    onClose={() => setVilOvertaBehandling(false)}
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandlingId}
                    overtarFra={props.overtarFra}
                    meldeperiodeUrl={props.meldeperiodeUrl}
                />
            )}
            <Button
                className={style.knapp}
                size="small"
                variant="secondary"
                onClick={() => {
                    setVilOvertaBehandling(true);
                }}
            >
                Overta behandling
            </Button>
        </div>
    );
};

export default OvertaMeldekortBehandling;
