import { FetcherError } from '~/utils/fetch/fetch';
import { Alert, VStack } from '@navikt/ds-react';

export type BehandlingLagringResultat = 'ok' | FetcherError;

type Props = {
    isDirty: boolean;
    resultat: BehandlingLagringResultat;
};

export const BehandlingLagringVarsler = ({ isDirty, resultat }: Props) => {
    return (
        <VStack gap={'space-8'}>
            {isDirty ? (
                <Alert variant={'info'} size={'small'}>
                    {'Endringer må lagres før behandlingen kan sendes til beslutter'}
                </Alert>
            ) : (
                resultat === 'ok' && (
                    <Alert variant={'success'} size={'small'}>
                        {'Behandlingen er lagret'}
                    </Alert>
                )
            )}
            {resultat !== 'ok' && (
                <Alert
                    variant={'error'}
                    size={'small'}
                >{`Feil ved lagring: ${resultat.message} (kode ${resultat.status})`}</Alert>
            )}
        </VStack>
    );
};
