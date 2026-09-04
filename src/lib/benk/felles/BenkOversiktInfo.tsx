import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';

export const BenkOversiktInfo = ({ oversikt }: { oversikt: BenkOversikt<unknown> }) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, antallFiltrertPgaTilgang, limit } =
        oversikt;

    const antallFiltrertAvFiltervalg = totalAntallUfiltrert - totalAntall;
    const erKuttetAvLimit = totalAntall - antallFiltrertPgaTilgang > behandlinger.length;

    return (
        <VStack gap={'space-4'}>
            <BodyShort>{`Viser ${behandlinger.length} av ${totalAntallUfiltrert} behandlinger`}</BodyShort>
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
            {erKuttetAvLimit && (
                <InlineMessage status={'warning'} size={'small'}>
                    {`Vi viser maksimalt ${limit} behandlinger om gangen - bruk filtre for å snevr inn listen`}
                </InlineMessage>
            )}
        </VStack>
    );
};
