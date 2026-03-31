import { Alert, BodyShort, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import router from 'next/router';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/types/meldekort/Meldekortbehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakId } from '~/types/Sak';

import style from './MeldekortbehandlingKnapper.module.css';

export const OvertaMeldekortbehandlingModal = (props: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
    overtarFra: string;
    meldeperiodeUrl: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const overtaMeldekortbehandlingApi = useFetchJsonFraApi<
        MeldekortbehandlingProps,
        { overtarFra: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortbehandlingId}/overta`, 'PATCH', {
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
                <VStack gap="space-16">
                    {overtaMeldekortbehandlingApi.error && (
                        <Alert variant={'error'}>
                            {overtaMeldekortbehandlingApi.error.message}
                        </Alert>
                    )}
                    <HStack gap="space-8">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() =>
                                overtaMeldekortbehandlingApi.trigger({
                                    overtarFra: props.overtarFra,
                                })
                            }
                            loading={overtaMeldekortbehandlingApi.isMutating}
                        >
                            Overta behandling
                        </Button>
                    </HStack>
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};

const OvertaMeldekortbehandling = (props: {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
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
                    meldekortbehandlingId={props.meldekortbehandlingId}
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

export default OvertaMeldekortbehandling;
