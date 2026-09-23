import { ReactNode } from 'react';
import { BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import { BenkOversikt } from '../typer/felles';
import { benkOppsummeringTekst } from '../utils/benkTekster';
import { BenkPaginering } from './BenkPaginering';

type Props = {
    oversikt: BenkOversikt<unknown>;
    filter: ReactNode;
    tabell: ReactNode;
    laster?: boolean;
};

/** Oppbygningen alle fanene deler: filter øverst, så tellinger, så tabellen med paginering over og under */
export const BenkPanel = ({ oversikt, filter, tabell, laster = false }: Props) => {
    const { behandlinger, totalAntall, totalAntallUfiltrert, oppsummering } = oversikt;

    const oppsummeringstekst = benkOppsummeringTekst(oppsummering);

    const harFlereBehandlinger = totalAntall > behandlinger.length;

    return (
        <VStack gap={'space-16'}>
            {filter}

            <VStack gap={'space-4'}>
                <BodyShort>
                    {`${totalAntall} av totalt ${totalAntallUfiltrert} behandlinger matcher valgte filtre`}
                    {harFlereBehandlinger && ` (${behandlinger.length} vises på denne siden)`}
                </BodyShort>

                {oppsummeringstekst && <BodyShort size={'small'}>{oppsummeringstekst}</BodyShort>}
            </VStack>

            <HStack justify={'center'}>
                <BenkPaginering oversikt={oversikt} />
            </HStack>

            {laster ? (
                <HStack gap={'space-8'}>
                    <Loader size={'xsmall'} />
                    <BodyShort>{'Laster behandlinger...'}</BodyShort>
                </HStack>
            ) : (
                tabell
            )}

            <HStack justify={'center'}>
                <BenkPaginering oversikt={oversikt} />
            </HStack>
        </VStack>
    );
};
