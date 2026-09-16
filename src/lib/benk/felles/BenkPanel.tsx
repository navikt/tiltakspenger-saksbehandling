import { ReactNode } from 'react';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';
import { benkOppsummeringTekst } from '../utils/benkUtils';
import { BenkPaginering } from './BenkPaginering';

type Props = {
    oversikt: BenkOversikt<unknown>;
    filter: ReactNode;
    tabell: ReactNode;
};

/** Oppbygningen alle fanene deler: filter øverst, så tellinger, så tabellen med paginering over og under */
export const BenkPanel = ({ oversikt, filter, tabell }: Props) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, oppsummering } = oversikt;

    const oppsummeringstekst = benkOppsummeringTekst(oppsummering);

    return (
        <VStack gap={'space-16'}>
            {filter}

            <VStack gap={'space-4'}>
                <BodyShort>
                    {`Viser ${totalAntall} av totalt ${totalAntallUfiltrert} behandlinger med valgte filtre (${behandlinger.length} på denne siden)`}
                </BodyShort>

                {oppsummeringstekst && <BodyShort size={'small'}>{oppsummeringstekst}</BodyShort>}
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
