import { Button, Table } from '@navikt/ds-react';
import {
    finnMeldeperiodeKjedeStatusTekst,
    meldekortUtbetalingstatusTekst,
} from '~/utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '~/utils/date';
import Link from 'next/link';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { meldeperiodeUrl } from '~/utils/urls';
import {
    MeldekortBehandlingStatus,
    MeldekortBehandlingType,
} from '~/types/meldekort/MeldekortBehandling';
import { formatterBeløp } from '~/utils/beløp';
import { sorterMeldekortBehandlingerAsc } from '~/utils/meldekort';
import { MeldekortBehandlingKnappForOversikt } from './MeldekortBehandlingKnappForOversikt';
import { SakId } from '~/types/SakTypes';

import style from './MeldekortOversikt.module.css';

type Props = {
    meldeperiodeKjeder: MeldeperiodeKjedeProps[];
    saksnummer: string;
    sakId: SakId;
};

export const MeldekortOversikt = ({ meldeperiodeKjeder, saksnummer, sakId }: Props) => {
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
                    <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
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

                        //TODO - raq - vi er interessert i å vise mottatt - men fra hvilket meldekort egentlig?
                        const sisteBrukersMeldekort = brukersMeldekort.at(-1);

                        const sisteMeldekortBehandling = meldekortBehandlinger
                            .toSorted(sorterMeldekortBehandlingerAsc)
                            .at(0);

                        const beregnetBeløpForPeriode =
                            korrigeringFraTidligerePeriode?.beregning.beløp.totalt ??
                            sisteMeldekortBehandling?.beregning?.beregningForMeldekortetsPeriode
                                .beløp.totalt;

                        const erKorrigering =
                            sisteMeldekortBehandling?.type === MeldekortBehandlingType.KORRIGERING;

                        const erAutomatiskBehandlet =
                            sisteMeldekortBehandling?.status ===
                            MeldekortBehandlingStatus.AUTOMATISK_BEHANDLET;

                        const korrigeringTekst =
                            korrigeringFraTidligerePeriode && sisteMeldekortBehandling?.erAvsluttet
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
                                    {sisteBrukersMeldekort
                                        ? formaterTidspunkt(sisteBrukersMeldekort.mottatt)
                                        : 'Ikke mottatt'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!erAutomatiskBehandlet &&
                                        sisteMeldekortBehandling?.saksbehandler) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {(!erAutomatiskBehandlet &&
                                        sisteMeldekortBehandling?.beslutter) ||
                                        '-'}
                                </Table.DataCell>
                                <Table.DataCell scope="col">
                                    {sisteMeldekortBehandling && (
                                        <MeldekortBehandlingKnappForOversikt
                                            meldekortBehandling={sisteMeldekortBehandling}
                                            sakId={sakId}
                                            meldeperiodeUrl={meldeperiodeUrl(saksnummer, periode)}
                                            saksnummer={saksnummer}
                                        />
                                    )}
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
