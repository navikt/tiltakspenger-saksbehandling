import { BodyLong, Button, Dialog, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import router from 'next/router';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { personoversiktUrl } from '~/utils/urls';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import styles from './OpprettSak.module.css';

const FNR_LENGDE = 11;

type HentEllerOpprettSakRequest = {
    fnr: string;
};

type HentEllerOpprettSakResponse = {
    saksnummer: string;
    opprettet: boolean;
};

export const OpprettSak = () => {
    const [åpen, settÅpen] = useState<boolean>(false);
    const [fnr, settFnr] = useState<string>('');
    const [valideringsfeil, settValideringsfeil] = useState<string>('');

    const {
        trigger: hentEllerOpprettSak,
        isMutating: isHentEllerOpprettSakMutating,
        error: hentEllerOpprettSakError,
    } = useFetchJsonFraApi<HentEllerOpprettSakResponse, HentEllerOpprettSakRequest>(`/sak`, 'PUT');

    const lukk = () => {
        settÅpen(false);
        settValideringsfeil('');
    };

    const opprettSak = () => {
        if (fnr.length !== FNR_LENGDE) {
            settValideringsfeil(`Fødselsnummer må være ${FNR_LENGDE} siffer langt`);
            return;
        }

        hentEllerOpprettSak({ fnr }).then((response) => {
            if (response) {
                settFnr('');
                lukk();
                router.push(personoversiktUrl(response.saksnummer));
            }
        });
    };

    return (
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => (nesteÅpen ? settÅpen(true) : lukk())}>
            <Dialog.Trigger>
                <Button size={'small'} type={'button'} className={styles.opprettSakKnapp}>
                    {'Opprett sak'}
                </Button>
            </Dialog.Trigger>

            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>{'Opprett sak'}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <form
                        id={'opprett-sak-skjema'}
                        onSubmit={(event) => {
                            event.preventDefault();
                            opprettSak();
                        }}
                    >
                        <VStack gap={'space-16'}>
                            <BodyLong>
                                {
                                    'Her kan du opprette en sak for en person som ikke er registrert i systemet fra før ved å skrive inn fødselsnummeret.'
                                }
                            </BodyLong>

                            <TextField
                                label={'Fødselsnummer'}
                                value={fnr}
                                error={valideringsfeil}
                                onChange={(event) => {
                                    if (event.target.value.length === FNR_LENGDE) {
                                        settValideringsfeil('');
                                    }
                                    settFnr(event.target.value);
                                }}
                            />

                            {hentEllerOpprettSakError && (
                                <Infokort
                                    variant={'feil'}
                                    size={'small'}
                                    header={'Feil ved opprettelse av sak'}
                                >
                                    {hentEllerOpprettSakError.message}
                                </Infokort>
                            )}
                        </VStack>
                    </form>
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        variant={'primary'}
                        type={'submit'}
                        form={'opprett-sak-skjema'}
                        loading={isHentEllerOpprettSakMutating}
                    >
                        {'Opprett sak'}
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
