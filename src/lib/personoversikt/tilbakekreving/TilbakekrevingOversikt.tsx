import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsstatus,
} from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { Alert, BodyLong, Button, Heading, HStack, Link, Table, VStack } from '@navikt/ds-react';
import {
    formaterDatotekst,
    formaterTidspunktKort,
    periodeTilFormatertDatotekst,
} from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { BeregningKildeType } from '~/lib/beregning-og-simulering/typer/Beregning';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import NextLink from 'next/link';
import { useSak } from '~/lib/sak/SakContext';
import { beregningKildeUrl } from '~/utils/urls';
import { TilbakekrevingStatusTag } from '~/lib/tilbakekreving/TilbakekrevingStatusTag';
import { TilbakekrevingTildeling } from '~/lib/personoversikt/tilbakekreving/TilbakekrevingTildeling';

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
            <VStack className={style.seksjon}>
                <Heading size={'small'} level={'3'} className={style.header} spacing={true}>
                    {'Aktive tilbakekrevingssaker'}
                </Heading>

                <TilbakekrevingerTabell tilbakekrevinger={aktive} />
            </VStack>

            <Alert variant={'info'} inline={true}>
                <BodyLong spacing={true}>
                    {'Tilbakekrevingssaker behandles i en separat saksbehandlingsløsning.'}
                </BodyLong>
                <BodyLong>
                    {
                        'Vær obs på at tildeling av behandlinger i TP-sak ikke overføres til tilbakekrevingsløsningen. '
                    }
                    {
                        'Denne funksjonaliteten er kun ment for hjelp til oppgavefordeling, og påvirker ikke behandlingen av tilbakekrevingen.'
                    }
                </BodyLong>
            </Alert>

            <VStack className={style.seksjon}>
                <Heading size={'small'} level={'3'} className={style.header} spacing={true}>
                    {'Avsluttede tilbakekrevingssaker'}
                </Heading>

                <TilbakekrevingerTabell tilbakekrevinger={avsluttede} />
            </VStack>
        </VStack>
    );
};

type TilbakekrevingerTabellProps = {
    tilbakekrevinger: TilbakekrevingBehandling[];
};

const TilbakekrevingerTabell = ({ tilbakekrevinger }: TilbakekrevingerTabellProps) => {
    const { sak } = useSak();

    if (tilbakekrevinger.length === 0) {
        return (
            <Alert variant={'info'} inline={true} size={'small'}>
                {'Ingen behandlinger'}
            </Alert>
        );
    }

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
                    <Table.HeaderCell scope="col">{'Saksbehandler'}</Table.HeaderCell>
                    <Table.HeaderCell scope="col">{'Beslutter'}</Table.HeaderCell>
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
                        saksbehandler,
                        beslutter,
                    } = tilbakekreving;

                    return (
                        <Table.Row shadeOnHover={false} key={id}>
                            <Table.DataCell>
                                <TilbakekrevingStatusTag status={status} />
                            </Table.DataCell>
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
                            <Table.DataCell>{saksbehandler ?? '-'}</Table.DataCell>
                            <Table.DataCell>{beslutter ?? '-'}</Table.DataCell>

                            <Table.DataCell align={'right'}>
                                <HStack gap={'space-16'} align={'center'} justify={'end'}>
                                    <TilbakekrevingTildeling tilbakekreving={tilbakekreving} />

                                    <Button
                                        as={'a'}
                                        href={url}
                                        variant={'primary'}
                                        size={'small'}
                                        icon={<ExternalLinkIcon />}
                                        iconPosition={'right'}
                                        target={'_blank'}
                                    >
                                        {'Åpne tilbakekreving'}
                                    </Button>
                                </HStack>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
