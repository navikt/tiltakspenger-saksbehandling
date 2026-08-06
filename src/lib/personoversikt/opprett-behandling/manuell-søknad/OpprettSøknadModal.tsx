import { Button, Dialog } from '@navikt/ds-react';
import router from 'next/router';
import { registrerSoknadUrl } from '~/utils/urls';

type Props = {
    saksnummer: string;
    åpen: boolean;
    setÅpen: (åpen: boolean) => void;
};

export const OpprettSøknadModal = ({ saksnummer, åpen, setÅpen }: Props) => {
    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && setÅpen(false)}>
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>{'Registrer søknad manuelt?'}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        type={'button'}
                        onClick={() => {
                            router.push(registrerSoknadUrl(saksnummer));
                        }}
                    >
                        {'Registrer søknad manuelt'}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'} type={'button'}>
                            {'Avbryt'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
