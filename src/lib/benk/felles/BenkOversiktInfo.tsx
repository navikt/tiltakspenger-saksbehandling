import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';

export const BenkOversiktInfo = ({ oversikt }: { oversikt: BenkOversikt<unknown> }) => {
    const { totalAntall, totalAntallUfiltrert, antallFiltrertPgaTilgang } = oversikt;

    const antallFiltrertAvFiltervalg = totalAntallUfiltrert - totalAntall;

    return (
        <VStack gap={'space-4'}>
            <BodyShort>{`Viser ${totalAntall} av ${totalAntallUfiltrert} behandlinger`}</BodyShort>
            {antallFiltrertAvFiltervalg > 0 && (
                <InlineMessage status={'info'} size={'small'}>
                    {`${totalAntall} treff med valgte filtre - ${antallFiltrertAvFiltervalg} filtrert vekk`}
                </InlineMessage>
            )}
            {antallFiltrertPgaTilgang > 0 && (
                <InlineMessage status={'warning'} size={'small'}>
                    {`${antallFiltrertPgaTilgang} filtrert vekk pga manglende tilgang`}
                </InlineMessage>
            )}
        </VStack>
    );
};
