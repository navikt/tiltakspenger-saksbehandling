import { TilbakekrevingBehandling, TilbakekrevingBehandlingsstatus } from '~/types/Tilbakekreving';
import { Alert, Button, Heading, Link, Table, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunktKort,
    periodeTilFormatertDatotekst,
} from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { BeregningKildeType } from '~/types/Beregning';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useSak } from '~/context/sak/SakContext';
import { beregningKildeUrl } from '~/utils/urls';

import style from './TIlbakekrevingOversikt.module.css';

type Props = {
    tilbakekrevinger: TilbakekrevingBehandling[];
};

export const TilbakekrevingOversikt = ({ tilbakekrevinger }: Props) => {
    if (tilbakekrevinger.length === 0) {
        return (
            <Alert variant={'info'} inline={true}>
                {'Fant ingen tilbakekrevingsbehandlinger for denne brukeren'}
            </Alert>
        );
    }

    const { aktive = [], avsluttede = [] } = Object.groupBy(tilbakekrevinger, (tilbakekreving) => {
        return tilbakekreving.status === TilbakekrevingBehandlingsstatus.AVSLUTTET
            ? 'avsluttede'
            : 'aktive';
    });

    return (
        <VStack gap={'space-16'}>
            <Alert variant={'info'} inline={true}>
                {'Tilbakekrevingssaker behandles i en separat saksbehandlingsløsning'}
            </Alert>
            <TilbakekrevingSeksjon header={'Aktive tilbakekrevinger'} tilbakekrevinger={aktive} />
            <TilbakekrevingSeksjon
                header={'Avsluttede tilbakekrevinger'}
                tilbakekrevinger={avsluttede}
            />
        </VStack>
    );
};

type TilbakekrevingSeksjonProps = {
    header: string;
    tilbakekrevinger: TilbakekrevingBehandling[];
};

const TilbakekrevingSeksjon = ({ header, tilbakekrevinger }: TilbakekrevingSeksjonProps) => {
    return (
        <VStack className={style.seksjon}>
            <Heading size={'small'} level={'3'} className={style.header} spacing={true}>
                {header}
            </Heading>
            {tilbakekrevinger.length > 0 ? (
                <TilbakekrevingerTabell tilbakekrevinger={tilbakekrevinger} />
            ) : (
                <Alert variant={'info'} inline={true} size={'small'}>
                    {'Ingen behandlinger'}
                </Alert>
            )}
        </VStack>
    );
};

type TilbakekrevingerTabellProps = {
    tilbakekrevinger: TilbakekrevingBehandling[];
};

const TilbakekrevingerTabell = ({ tilbakekrevinger }: TilbakekrevingerTabellProps) => {
    const { sak } = useSak();

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">{'Status'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Feilutbetalt beløp'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        {'Totalperiode for kravgrunnlag'}
                    </Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Opprettet'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Sist endret'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Varsel sendt'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Kilde'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {tilbakekrevinger.map((tilbakekreving) => {
                    const {
                        id,
                        status,
                        totaltFeilutbetaltBeløp,
                        kravgrunnlagTotalPeriode,
                        varselSendt,
                        url,
                        opprettet,
                        sistEndret,
                        beregningKilde,
                    } = tilbakekreving;

                    return (
                        <Table.Row shadeOnHover={false} key={id}>
                            <Table.DataCell>{statusTekst[status]}</Table.DataCell>
                            <Table.DataCell>
                                {formatterBeløp(totaltFeilutbetaltBeløp)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {periodeTilFormatertDatotekst(kravgrunnlagTotalPeriode)}
                            </Table.DataCell>
                            <Table.DataCell>{formaterTidspunktKort(opprettet)}</Table.DataCell>
                            <Table.DataCell>{formaterTidspunktKort(sistEndret)}</Table.DataCell>
                            <Table.DataCell>
                                {varselSendt ? formaterDatotekst(varselSendt) : '-'}
                            </Table.DataCell>
                            <Table.DataCell>
                                <Link as={NextLink} href={beregningKildeUrl(beregningKilde, sak)}>
                                    {beregningKilde.type === BeregningKildeType.MELDEKORT
                                        ? 'Meldekort'
                                        : 'Rammebehandling'}
                                </Link>
                            </Table.DataCell>
                            <Table.DataCell align={'right'}>
                                <Button
                                    as={'a'}
                                    href={url}
                                    variant={'secondary'}
                                    size={'small'}
                                    icon={<ExternalLinkIcon />}
                                    iconPosition={'right'}
                                    target={'_blank'}
                                >
                                    {'Åpne tilbakekreving'}
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

const statusTekst: Record<TilbakekrevingBehandlingsstatus, string> = {
    [TilbakekrevingBehandlingsstatus.OPPRETTET]: 'Opprettet',
    [TilbakekrevingBehandlingsstatus.TIL_BEHANDLING]: 'Til behandling',
    [TilbakekrevingBehandlingsstatus.TIL_GODKJENNING]: 'Til godkjenning',
    [TilbakekrevingBehandlingsstatus.AVSLUTTET]: 'Avsluttet',
} as const;
