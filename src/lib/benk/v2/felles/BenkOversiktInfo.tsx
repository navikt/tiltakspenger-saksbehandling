import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import { BenkV2Oversikt } from '../typer/felles';

export const BenkOversiktInfo = ({ oversikt }: { oversikt: BenkV2Oversikt<unknown> }) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, antallFiltrertPgaTilgang, limit } =
        oversikt;

    const antallFiltrertAvFiltervalg = totalAntallUfiltrert - totalAntall;
    const erKuttetAvLimit = totalAntall - antallFiltrertPgaTilgang > behandlinger.length;

    return (
        <VStack gap={'space-4'}>
            <BodyShort>{`Viser ${behandlinger.length} av ${totalAntallUfiltrert} behandlinger`}</BodyShort>
            {antallFiltrertAvFiltervalg > 0 && (
                <InlineMessage status={'info'} size={'small'}>
                    {`${antallFiltrertAvFiltervalg} filtrert vekk av valgte filtre`}
                </InlineMessage>
            )}
            {antallFiltrertPgaTilgang > 0 && (
                <InlineMessage status={'warning'} size={'small'}>
                    {`${antallFiltrertPgaTilgang} filtrert vekk pga manglende tilgang`}
                </InlineMessage>
            )}
            {erKuttetAvLimit && (
                <InlineMessage status={'warning'} size={'small'}>
                    {`Viser kun de ${limit} første behandlingene - snevr inn med filtre for å se resten`}
                </InlineMessage>
            )}
        </VStack>
    );
};
