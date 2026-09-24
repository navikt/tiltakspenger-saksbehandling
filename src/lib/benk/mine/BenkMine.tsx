import { BodyShort, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { BenkTab } from '../typer/tabs';
import { BenkMineData, BenkMineFilter, BenkMineSeksjon, BenkMineSeksjoner } from '../typer/mine';
import { benkFaner } from '../benkFaner';
import { benkFaneKomponenter } from '../benkFaneKomponenter';
import { benkOppsummeringTekst } from '../utils/benkTekster';
import { benkFilterTilQuery } from '../utils/benkQuery';
import { BenkMineFilterSkjema } from './BenkMineFilterSkjema';

type Props = {
    data: BenkMineData;
    /** Antallet tildelt den innloggede i alle fanene, uten filtrene */
    totalAntallUfiltrert: number;
    laster: boolean;
};

/**
 * Mine-fanen: behandlingene den innloggede er tildelt, som én seksjon per fane.
 * Hver seksjon bruker fanens egen tabell, med sin egen sortering.
 */
export const BenkMine = ({ data, totalAntallUfiltrert, laster }: Props) => {
    const { seksjoner, aktivtFilter } = data;

    const synligeSeksjoner = Object.values(BenkTab).filter(
        (tab) => (seksjoner[tab]?.oversikt.totalAntall ?? 0) > 0,
    );
    const totalAntall = synligeSeksjoner.reduce(
        (sum, tab) => sum + (seksjoner[tab]?.oversikt.totalAntall ?? 0),
        0,
    );

    return (
        <VStack gap={'space-24'}>
            <BenkMineFilterSkjema aktivtFilter={aktivtFilter} />

            <BodyShort>
                {`${totalAntall} av totalt ${totalAntallUfiltrert} behandlinger tildelt deg matcher valgte filtre`}
            </BodyShort>

            {laster ? (
                <HStack gap={'space-8'}>
                    <Loader size={'xsmall'} />
                    <BodyShort>{'Laster behandlinger...'}</BodyShort>
                </HStack>
            ) : synligeSeksjoner.length === 0 ? (
                <BodyShort>
                    {totalAntallUfiltrert === 0
                        ? 'Du har ingen åpne behandlinger tildelt deg.'
                        : 'Ingen av behandlingene tildelt deg matcher valgte filtre.'}
                </BodyShort>
            ) : (
                synligeSeksjoner.map((tab) => (
                    <BenkMineSeksjonVisning
                        key={tab}
                        tab={tab}
                        seksjon={hentSeksjon(seksjoner, tab)}
                        aktivtFilter={aktivtFilter}
                    />
                ))
            )}
        </VStack>
    );
};

/**
 * TypeScript klarer ikke å koble `seksjoner[tab]` til fanen for en generisk T, så koblingen gjøres her.
 * Seksjonen finnes alltid, siden bare seksjonene med behandlinger vises.
 */
const hentSeksjon = <T extends BenkTab>(seksjoner: BenkMineSeksjoner, tab: T) =>
    seksjoner[tab] as BenkMineSeksjon<T>;

const BenkMineSeksjonVisning = <T extends BenkTab>({
    tab,
    seksjon,
    aktivtFilter,
}: {
    tab: T;
    seksjon: BenkMineSeksjon<T>;
    aktivtFilter: BenkMineFilter;
}) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { Tabell } = benkFaneKomponenter[tab];
    const { oversikt, aktivSortering } = seksjon;
    const { behandlinger, totalAntall, oppsummering } = oversikt;

    const oppsummeringstekst = benkOppsummeringTekst(oppsummering);
    const harFlereBehandlinger = totalAntall > behandlinger.length;

    // Saksbehandlerfilteret i fanen treffer både saksbehandler og beslutter, og gir derfor de samme behandlingene - med paginering
    const faneQuery = {
        tab,
        ...benkFilterTilQuery({
            saksbehandler: innloggetSaksbehandler.navIdent,
            skjulPåVent: aktivtFilter.skjulPåVent,
            skjulEgneTilBeslutning: aktivtFilter.skjulEgneTilBeslutning,
        }),
    };

    return (
        <VStack as={'section'} gap={'space-8'} aria-label={benkFaner[tab].tekst}>
            <Heading size={'small'} level={'3'}>
                {`${benkFaner[tab].tekst} (${totalAntall})`}
            </Heading>

            {harFlereBehandlinger && (
                <BodyShort size={'small'}>
                    {`Viser de ${behandlinger.length} første. `}
                    <InternLenke href={{ pathname: '/', query: faneQuery }}>
                        {`Se alle i ${benkFaner[tab].tekst.toLowerCase()}-fanen`}
                    </InternLenke>
                </BodyShort>
            )}

            {oppsummeringstekst && <BodyShort size={'small'}>{oppsummeringstekst}</BodyShort>}

            <Tabell behandlinger={behandlinger} aktivSortering={aktivSortering} seksjon={tab} />
        </VStack>
    );
};
