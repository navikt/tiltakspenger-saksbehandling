import { BodyShort, Box, HStack, Select, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../../utils/date';
import {
    MeldekortBehandlingDagStatus,
    MeldekortDagBeregnetProps,
} from '../../../../types/meldekort/MeldekortBehandling';
import { meldekortBehandlingDagStatusTekst } from '../../../../utils/tekstformateringUtils';
import { ikonForMeldekortBehandlingDagStatus } from '../Meldekortikoner';
import { formatterBeløp } from '../../../../utils/beløp';
import { Controller, FieldPath, UseFormReturn } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../meldekort-behandling/utfylling/meldekortUtfyllingUtils';

import styles from './MeldekortUke.module.css';

type FormContext = UseFormReturn<MeldekortBehandlingForm>;

type Props = {
    dager: MeldekortDagBeregnetProps[];
    ukeIndex: 0 | 1;
    formContext?: FormContext;
};

export const MeldekortUke = ({ dager, ukeIndex, formContext }: Props) => {
    return (
        <Box className={styles.uke}>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dag</Table.HeaderCell>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Sats</Table.HeaderCell>
                        <Table.HeaderCell>Beløp</Table.HeaderCell>
                        <Table.HeaderCell>Barnetillegg</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dager.map((dag, index) => (
                        <Table.Row key={dag.dato}>
                            <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>
                                {formContext ? (
                                    <StatusSelect
                                        formContext={formContext}
                                        dagIndex={index + ukeIndex * 7}
                                    />
                                ) : (
                                    <HStack align="center" gap="3" wrap={false}>
                                        {ikonForMeldekortBehandlingDagStatus[dag.status]}
                                        {meldekortBehandlingDagStatusTekst[dag.status]}
                                    </HStack>
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {dag.beregningsdag && `${dag.beregningsdag.prosent}%`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {dag.beregningsdag && formatterBeløp(dag.beregningsdag.beløp)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {dag.beregningsdag &&
                                    formatterBeløp(dag.beregningsdag.barnetillegg)}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Box>
    );
};

const StatusSelect = ({
    formContext,
    dagIndex,
}: {
    formContext: FormContext;
    dagIndex: number;
}) => {
    const { control, watch, getFieldState, formState } = formContext;

    const statusFieldPath: FieldPath<MeldekortBehandlingForm> = `dager.${dagIndex}.status`;
    const dagFieldPath: FieldPath<MeldekortBehandlingForm> = `dager.${dagIndex}.dato`;

    const valgtStatus = watch(statusFieldPath);
    const valgtDato = watch(dagFieldPath);

    const error = getFieldState(statusFieldPath, formState).error;

    return (
        <HStack gap={'2'} align={'center'}>
            {ikonForMeldekortBehandlingDagStatus[valgtStatus]}
            {valgtStatus === MeldekortBehandlingDagStatus.Sperret ? (
                <BodyShort>Ikke rett på tiltakspenger</BodyShort>
            ) : (
                <Controller
                    name={statusFieldPath}
                    control={control}
                    rules={{ validate: (value) => gyldigeStatusValg.includes(value) }}
                    defaultValue={MeldekortBehandlingDagStatus.IkkeUtfylt}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            label={'Velg status for dag'}
                            id={valgtDato}
                            size={'small'}
                            hideLabel={true}
                            error={error ? 'Status må fylles ut' : ''}
                            value={value}
                            onChange={onChange}
                            className={styles.select}
                        >
                            <option value={MeldekortBehandlingDagStatus.IkkeUtfylt}>
                                {'- Velg status -'}
                            </option>
                            {statusOptions}
                        </Select>
                    )}
                />
            )}
        </HStack>
    );
};

const gyldigeStatusValg = Object.values(MeldekortBehandlingDagStatus).filter(
    (status) =>
        ![MeldekortBehandlingDagStatus.Sperret, MeldekortBehandlingDagStatus.IkkeUtfylt].includes(
            status,
        ),
);

const statusOptions = gyldigeStatusValg.map((meldekortStatus) => (
    <option key={meldekortStatus} value={meldekortStatus}>
        {meldekortBehandlingDagStatusTekst[meldekortStatus]}
    </option>
));
