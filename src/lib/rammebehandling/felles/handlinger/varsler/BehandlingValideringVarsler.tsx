import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { Heading, VStack } from '@navikt/ds-react';
import { TekstListe } from '~/lib/_felles/liste/TekstListe';

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
        <VStack className={className} gap={'space-8'}>
            {harWarnings && (
                <Infokort variant={'advarsel'} size={'small'}>
                    <Heading size={'small'} level={'2'}>
                        {'Advarsel'}
                    </Heading>
                    <TekstListe tekster={warnings} />
                </Infokort>
            )}
            {harErrors && (
                <Infokort variant={'feil'} size={'small'}>
                    <Heading size={'small'} level={'2'}>
                        {'Feil i behandlingen'}
                    </Heading>
                    <TekstListe tekster={errors} />
                </Infokort>
            )}
        </VStack>
    );
};
