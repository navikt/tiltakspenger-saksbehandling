import { ValideringResultat } from '~/types/Validering';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { TekstListe } from '~/components/liste/TekstListe';

type Props = {
    resultat: ValideringResultat;
    className?: string;
};

export const BehandlingValideringVarsler = ({ resultat, className }: Props) => {
    const { warnings, errors } = resultat;

    const harWarnings = warnings.length > 0;
    const harErrors = errors.length > 0;

    if (!harWarnings && !harErrors) {
        return null;
    }

    return (
        <VStack className={className} gap={'2'}>
            {harWarnings && (
                <Alert variant={'warning'} size={'small'}>
                    <Heading size={'small'} level={'2'}>
                        {'Advarsel'}
                    </Heading>
                    <TekstListe tekster={warnings} />
                </Alert>
            )}
            {harErrors && (
                <Alert variant={'error'} size={'small'}>
                    <Heading size={'small'} level={'2'}>
                        {'Feil i behandlingen'}
                    </Heading>
                    <TekstListe tekster={errors} />
                </Alert>
            )}
        </VStack>
    );
};
