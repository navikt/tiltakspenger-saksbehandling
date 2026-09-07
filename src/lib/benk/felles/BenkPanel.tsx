import { ReactNode } from 'react';
import { BodyShort, HStack, InlineMessage, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';
import { BenkPaginering } from './BenkPaginering';

type Props = {
    oversikt: BenkOversikt<unknown>;
    filter: ReactNode;
    tabell: ReactNode;
};

/** Oppbygningen alle fanene deler: filter øverst, så tellinger, så tabellen med paginering over og under */
export const BenkPanel = ({ oversikt, filter, tabell }: Props) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, antallFiltrertPgaTilgang } = oversikt;

    return (
        <VStack gap={'space-16'}>
            {filter}

            <VStack gap={'space-4'}>
                <BodyShort>
                    {`Viser ${totalAntall} av totalt ${totalAntallUfiltrert} behandlinger med valgte filtre (${behandlinger.length} på denne siden)`}
                </BodyShort>

                {antallFiltrertPgaTilgang > 0 && (
                    <InlineMessage status={'warning'} size={'small'}>
                        {`${antallFiltrertPgaTilgang} filtrert vekk pga manglende tilgang`}
                    </InlineMessage>
                )}
            </VStack>

            <HStack justify={'center'}>
                <BenkPaginering oversikt={oversikt} />
            </HStack>

            {tabell}

            <HStack justify={'center'}>
                <BenkPaginering oversikt={oversikt} />
            </HStack>
        </VStack>
    );
};
