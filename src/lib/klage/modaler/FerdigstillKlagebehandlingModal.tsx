import { Button, Modal, Heading, Textarea, VStack, LocalAlert, HStack } from '@navikt/ds-react';
import router from 'next/router';
import { useState } from 'react';
import { useFerdigstillKlage } from '~/lib/klage/api/KlageApi';
import { KlageId } from '~/lib/klage/typer/Klage';
import { SakId } from '~/lib/sak/SakTyper';

const FerdigstillKlageModalWrapper = (props: { sakId: SakId; klageId: KlageId }) => {
    const [vilFerdigstille, setVilFerdigstille] = useState(false);
    return (
        <div>
            <Button type="button" variant="secondary" onClick={() => setVilFerdigstille(true)}>
                Ferdigstill klagen
            </Button>
            {vilFerdigstille && (
                <FerdigstillKlageModal
                    sakId={props.sakId}
                    klageId={props.klageId}
                    åpen={vilFerdigstille}
                    onClose={() => setVilFerdigstille(false)}
                />
            )}
        </div>
    );
};

export default FerdigstillKlageModalWrapper;

export const FerdigstillKlageModal = (props: {
    sakId: SakId;
    klageId: KlageId;
    åpen: boolean;
    onClose: () => void;
}) => {
    const [begrunnelse, setBegrunnelse] = useState('');

    const ferdigstillKlage = useFerdigstillKlage({
        sakId: props.sakId,
        klageId: props.klageId,
        begrunnelse: begrunnelse.trim() || null,
        onSuccess: (klage) => {
            router.push(`/sak/${klage.saksnummer}`);
        },
    });

    return (
        <Modal width={480} aria-label="Overta behandling" open={props.åpen} onClose={props.onClose}>
            <Modal.Header>
                <Heading size="medium" level="3">
                    Ferdigstilling av klage
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <Textarea
                    label="Begrunnelse for ferdigstilling av klage"
                    description="Valgfri"
                    value={begrunnelse}
                    onChange={(e) => setBegrunnelse(e.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <VStack gap="space-16">
                    {ferdigstillKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved ferdigstilling av klage
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {ferdigstillKlage.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <HStack gap="space-8">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() =>
                                ferdigstillKlage.trigger({
                                    begrunnelse: begrunnelse.trim() || null,
                                })
                            }
                            loading={ferdigstillKlage.isMutating}
                        >
                            Ferdigstill klagen
                        </Button>
                    </HStack>
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};
