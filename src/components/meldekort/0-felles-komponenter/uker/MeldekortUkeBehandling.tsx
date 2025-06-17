import { BodyShort, Select, Table } from '@navikt/ds-react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../../utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '../MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '../../../../utils/tekstformateringUtils';
import { formatterBeløp } from '../../../../utils/beløp';
import React from 'react';
import {
    MeldekortBehandlingDagStatus,
    MeldekortDagBeregnetProps,
} from '../../../../types/meldekort/MeldekortBehandling';
import { Controller, FieldPath, useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../../2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import { classNames } from '../../../../utils/classNames';

import styles from './MeldekortUke.module.css';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    ukeIndex: 0 | 1;
};

export const MeldekortUkeBehandling = ({ dager, ukeIndex }: Props) => {
    const { control, watch, getFieldState, formState, clearErrors } =
        useFormContext<MeldekortBehandlingForm>();

    return dager.map((dag, index) => {
        const { beregningsdag, dato } = dag;
        const dagIndex = index + ukeIndex * 7;

        const statusFieldPath: FieldPath<MeldekortBehandlingForm> = `dager.${dagIndex}.status`;
        const dagFieldPath: FieldPath<MeldekortBehandlingForm> = `dager.${dagIndex}.dato`;

        const valgtStatus = watch(statusFieldPath);
        const valgtDato = watch(dagFieldPath);

        const error = getFieldState(statusFieldPath, formState).error;

        return (
            <Table.Row
                key={dato}
                className={classNames(formState.isDirty && styles.ikkeOppdatertBeregning)}
            >
                <Table.DataCell>{ukedagFraDatotekst(dato)}</Table.DataCell>
                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                <Table.DataCell className={styles.ikon}>
                    {ikonForMeldekortBehandlingDagStatus[valgtStatus]}
                </Table.DataCell>
                <Table.DataCell>
                    {valgtStatus === MeldekortBehandlingDagStatus.Sperret ? (
                        <BodyShort>Ikke rett på tiltakspenger</BodyShort>
                    ) : (
                        <Controller
                            name={statusFieldPath}
                            control={control}
                            rules={{ validate: (value) => gyldigeStatusValg.includes(value) }}
                            defaultValue={MeldekortBehandlingDagStatus.IkkeBesvart}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    label={'Velg status for dag'}
                                    id={valgtDato}
                                    size={'small'}
                                    hideLabel={true}
                                    error={error ? 'Status må fylles ut' : ''}
                                    value={value}
                                    onChange={(e) => {
                                        if (
                                            e.target.value !==
                                                MeldekortBehandlingDagStatus.IkkeBesvart &&
                                            error
                                        ) {
                                            clearErrors(statusFieldPath);
                                        }
                                        onChange(e);
                                    }}
                                    className={styles.select}
                                >
                                    <option value={MeldekortBehandlingDagStatus.IkkeBesvart}>
                                        {'- Velg status -'}
                                    </option>
                                    {statusOptions}
                                </Select>
                            )}
                        />
                    )}
                </Table.DataCell>
                <Table.DataCell className={styles.beregning}>
                    {beregningsdag && `${beregningsdag.prosent}%`}
                </Table.DataCell>
                <Table.DataCell className={styles.beregning}>
                    {beregningsdag && formatterBeløp(beregningsdag.beløp)}
                </Table.DataCell>
                <Table.DataCell className={styles.beregning}>
                    {beregningsdag && formatterBeløp(beregningsdag.barnetillegg)}
                </Table.DataCell>
            </Table.Row>
        );
    });
};

const gyldigeStatusValg = Object.values(MeldekortBehandlingDagStatus).filter(
    (status) =>
        ![MeldekortBehandlingDagStatus.Sperret, MeldekortBehandlingDagStatus.IkkeBesvart].includes(
            status,
        ),
);

const statusOptions = gyldigeStatusValg.map((meldekortStatus) => (
    <option key={meldekortStatus} value={meldekortStatus}>
        {meldekortBehandlingDagStatusTekst[meldekortStatus]}
    </option>
));
