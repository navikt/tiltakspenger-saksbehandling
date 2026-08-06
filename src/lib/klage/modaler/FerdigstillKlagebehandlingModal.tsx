import { Button, Dialog, LocalAlert, Textarea, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useState } from 'react';
import { useFerdigstillKlage } from '~/lib/klage/api/KlageApi';
import { KlageId } from '~/lib/klage/typer/Klage';
import { SakId } from '~/lib/sak/SakTyper';
import { personoversiktUrl } from '~/utils/urls';

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
            router.push(personoversiktUrl(klage.saksnummer));
        },
    });

    return (
        <Dialog open={props.åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup width={'480px'}>
                <Dialog.Header>
                    <Dialog.Title>Ferdigstilling av klage</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <VStack gap="space-16">
                        <Textarea
                            label="Begrunnelse for ferdigstilling av klage"
                            description="Valgfri"
                            value={begrunnelse}
                            onChange={(e) => setBegrunnelse(e.target.value)}
                        />

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
                    </VStack>
                </Dialog.Body>

                <Dialog.Footer>
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

                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary">
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
