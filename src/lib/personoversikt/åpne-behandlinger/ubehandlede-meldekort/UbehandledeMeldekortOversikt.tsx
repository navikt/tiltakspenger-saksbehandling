import { Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { BrukersMeldekortKjedeStatus } from '~/lib/meldekort/typer/BrukersMeldekort';
import { finnUbehandledeMeldekort } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { formaterMeldeperiode, formaterTidspunkt } from '~/utils/date';
import { meldeperiodeUrl } from '~/utils/urls';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import NextLink from 'next/link';
import { OpprettMeldekortbehandlingKnapp } from '~/lib/meldekort/felles/opprett/OpprettMeldekortbehandlingKnapp';

type Props = {
    saksnummer: string;
    meldeperiodeKjeder: MeldeperiodekjedeProps[];
};

export const UbehandledeMeldekortOversikt = ({ saksnummer, meldeperiodeKjeder }: Props) => {
    const ubehandledeMeldekort = finnUbehandledeMeldekort(meldeperiodeKjeder);

    if (ubehandledeMeldekort.length === 0) {
        return null;
    }

    return (
        <VStack gap={'space-8'}>
            <HStack justify={'start'} align={'center'} gap={'space-16'}>
                <Heading size={'small'} level={'2'}>
                    {`Ubehandlede meldekort (${ubehandledeMeldekort.length})`}
                </Heading>

                <OpprettMeldekortbehandlingKnapp size={'small'} />
            </HStack>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">{'Type'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Mottatt'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Periode'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Tiltak'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col">{'Tiltaksdager'}</Table.HeaderCell>
                        <Table.HeaderCell scope="col" />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {ubehandledeMeldekort
                        .toSorted((a, b) => (a.periode.fraOgMed < b.periode.fraOgMed ? -1 : 1))
                        .map((kjede) => {
                            const {
                                id,
                                periode,
                                tiltaksnavn,
                                brukersMeldekort,
                                brukersMeldekortStatus,
                                sisteMeldeperiode,
                            } = kjede;

                            const { antallDager } = sisteMeldeperiode;

                            const sistMottatt = brukersMeldekort
                                .map((meldekort) => meldekort.mottatt)
                                .toSorted()
                                .at(-1);

                            return (
                                <Table.Row shadeOnHover={false} key={id}>
                                    <Table.DataCell>
                                        {innsendingstypeTekst[brukersMeldekortStatus]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {sistMottatt ? formaterTidspunkt(sistMottatt) : '-'}
                                    </Table.DataCell>
                                    <Table.DataCell>{formaterMeldeperiode(periode)}</Table.DataCell>
                                    <Table.DataCell>
                                        {tiltaksnavn.length > 0 ? tiltaksnavn.join(', ') : '-'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {`${antallDager} dag${antallDager !== 1 ? 'er' : ''}`}
                                    </Table.DataCell>
                                    <Table.DataCell align={'right'}>
                                        <Button
                                            as={NextLink}
                                            variant={'secondary'}
                                            size={'small'}
                                            href={meldeperiodeUrl(
                                                saksnummer,
                                                periode,
                                                MeldeperiodekjedeTab.BrukersMeldekort,
                                            )}
                                        >
                                            {'Se meldekort'}
                                        </Button>
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                </Table.Body>
            </Table>
        </VStack>
    );
};

const innsendingstypeTekst: Record<BrukersMeldekortKjedeStatus, string> = {
    [BrukersMeldekortKjedeStatus.IKKE_MOTTATT]: 'Ikke mottatt',
    [BrukersMeldekortKjedeStatus.VENTER_BEHANDLING]: 'Innsendt meldekort',
    [BrukersMeldekortKjedeStatus.KORRIGERING_VENTER_BEHANDLING]: 'Korrigert meldekort',
    [BrukersMeldekortKjedeStatus.BEHANDLET]: 'Behandlet',
    [BrukersMeldekortKjedeStatus.KORRIGERING_BEHANDLET]: 'Behandlet (korrigering)',
} as const;
