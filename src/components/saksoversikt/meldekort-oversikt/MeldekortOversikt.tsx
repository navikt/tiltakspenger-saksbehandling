import { Button, Table } from '@navikt/ds-react';
import {
    finnMeldeperiodeKjedeStatusTekst,
    meldekortUtbetalingstatusTekst,
} from '../../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../../utils/date';
import Link from 'next/link';
import { MeldeperiodeKjedeProps } from '../../../types/meldekort/Meldeperiode';
import { meldeperiodeUrl } from '../../../utils/urls';
import { MeldekortBehandlingType } from '../../../types/meldekort/MeldekortBehandling';
import { formatterBeløp } from '../../../utils/beløp';
import { sorterMeldekortBehandlingerAsc } from '../../../utils/meldekort';

import style from './MeldekortOversikt.module.css';

type Props = {
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    saksnummer: string;
};

export const MeldekortOversikt = ({ meldeperiodeKjeder, saksnummer }: Props) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beregnet beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utbetalingsstatus</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Mottatt fra bruker</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {meldeperiodeKjeder
                    .toSorted((a, b) => (a.periode.fraOgMed > b.periode.fraOgMed ? -1 : 1))
                    .map((kjede) => {
                        const {
                            meldekortBehandlinger,
                            id,
                            status,
                            periode,
                            brukersMeldekort,
                            korrigeringFraTidligerePeriode,
                        } = kjede;

                        const sisteMeldekortBehandling = meldekortBehandlinger
                            .toSorted(sorterMeldekortBehandlingerAsc)
                            .at(0);

                        const beregnetBeløpForPeriode =
                            korrigeringFraTidligerePeriode?.beregning.beløp.totalt ??
                            sisteMeldekortBehandling?.beregning?.beregningForMeldekortetsPeriode
                                .beløp.totalt;

                        const erKorrigering =
                            sisteMeldekortBehandling?.type === MeldekortBehandlingType.KORRIGERING;

                        const korrigeringTekst = korrigeringFraTidligerePeriode
                            ? ` (korrigert via ${periodeTilFormatertDatotekst(korrigeringFraTidligerePeriode.periode)})`
                            : erKorrigering
                              ? ' (korrigering)'
                              : '';

                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>{`${finnMeldeperiodeKjedeStatusTekst[status]}${korrigeringTekst}`}</Table.DataCell>
                                <Table.DataCell>
                                    {periodeTilFormatertDatotekst(periode)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {beregnetBeløpForPeriode !== undefined
                                        ? formatterBeløp(beregnetBeløpForPeriode)
                                        : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.utbetalingsstatus
                                        ? meldekortUtbetalingstatusTekst[
                                              sisteMeldekortBehandling.utbetalingsstatus
                                          ]
                                        : '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {brukersMeldekort
                                        ? formaterTidspunkt(brukersMeldekort.mottatt)
                                        : 'Ikke mottatt'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.saksbehandler ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {sisteMeldekortBehandling?.beslutter ?? '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    <Button
                                        as={Link}
                                        href={meldeperiodeUrl(saksnummer, periode)}
                                        size="small"
                                        variant="secondary"
                                        className={style.knapp}
                                    >
                                        {'Åpne'}
                                    </Button>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
            </Table.Body>
        </Table>
    );
};
