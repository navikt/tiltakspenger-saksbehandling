import { FetcherError } from '~/utils/fetch/fetch';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { VStack } from '@navikt/ds-react';

export type BehandlingLagringResultat = 'ok' | FetcherError;

type Props = {
    isDirty: boolean;
    resultat: BehandlingLagringResultat;
};

export const BehandlingLagringVarsler = ({ isDirty, resultat }: Props) => {
    return (
        <VStack gap={'space-8'}>
            {isDirty ? (
                <Infokort variant={'info'} size={'small'}>
                    {'Endringer må lagres før behandlingen kan sendes til beslutter'}
                </Infokort>
            ) : (
                resultat === 'ok' && (
                    <Infokort variant={'suksess'} size={'small'}>
                        {'Behandlingen er lagret'}
                    </Infokort>
                )
            )}
            {resultat !== 'ok' && (
                <Infokort
                    variant={'feil'}
                    size={'small'}
                >{`Feil ved lagring: ${resultat.message} (kode ${resultat.status})`}</Infokort>
            )}
        </VStack>
    );
};
