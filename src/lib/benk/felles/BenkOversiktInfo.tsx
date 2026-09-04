import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';

export const BenkOversiktInfo = ({ oversikt }: { oversikt: BenkOversikt<unknown> }) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, antallFiltrertPgaTilgang } = oversikt;

    return (
        <VStack gap={'space-4'}>
            <BodyShort>{`Viser ${totalAntall} av totalt ${totalAntallUfiltrert} behandlinger med valgte filtre (${behandlinger.length} på denne siden)`}</BodyShort>
            {antallFiltrertPgaTilgang > 0 && (
                <InlineMessage status={'warning'} size={'small'}>
                    {`${antallFiltrertPgaTilgang} filtrert vekk pga manglende tilgang`}
                </InlineMessage>
            )}
        </VStack>
    );
};
