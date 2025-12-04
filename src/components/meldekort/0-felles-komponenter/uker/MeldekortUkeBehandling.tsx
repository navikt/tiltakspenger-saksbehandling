import { BodyShort, Select, Table } from '@navikt/ds-react';
import { formaterDatotekst, ukedagFraDatotekst } from '~/utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '../MeldekortIkoner';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { formatterBeløp } from '~/utils/beløp';
import {
    MeldekortBehandlingDagStatus,
    MeldekortDagBeregnetProps,
} from '~/types/meldekort/MeldekortBehandling';
import { Controller, FieldPath, useFormContext } from 'react-hook-form';
import { MeldekortBehandlingForm } from '../../2-hovedseksjon/behandling/utfylling/meldekortUtfyllingUtils';
import { classNames } from '~/utils/classNames';

import styles from './MeldekortUke.module.css';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    ukeIndex: 0 | 1;
};

export const MeldekortUkeBehandling = ({ dager, ukeIndex }: Props) => {
    const { control, watch, formState } = useFormContext<MeldekortBehandlingForm>();

    return dager.map((dag, index) => {
        const { beregningsdag, dato } = dag;
        const dagIndex = index + ukeIndex * 7;

        const statusFieldPath: FieldPath<MeldekortBehandlingForm> = `dager.${dagIndex}.status`;
        const valgtStatus = watch(statusFieldPath);

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
                    {valgtStatus === MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger ? (
                        <BodyShort>{meldekortBehandlingDagStatusTekst[valgtStatus]}</BodyShort>
                    ) : (
                        <Controller
                            name={statusFieldPath}
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select
                                    {...field}
                                    label={'Velg status for dag'}
                                    size={'small'}
                                    hideLabel={true}
                                    error={fieldState.error?.message ? 'Status må fylles ut' : ''}
                                    className={styles.select}
                                >
                                    <option value={MeldekortBehandlingDagStatus.IkkeBesvart}>
                                        {'- Velg status -'}
                                    </option>
                                    {gyldigeMeldekortDagUtfyllingsvalgStatusOptions}
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

export const GyldigeMeldekortDagUfyllingsvalg = Object.values(MeldekortBehandlingDagStatus).filter(
    (status) =>
        ![
            MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger,
            MeldekortBehandlingDagStatus.IkkeBesvart,
        ].includes(status),
);

export const gyldigeMeldekortDagUtfyllingsvalgStatusOptions = GyldigeMeldekortDagUfyllingsvalg.map(
    (meldekortStatus) => (
        <option key={meldekortStatus} value={meldekortStatus}>
            {meldekortBehandlingDagStatusTekst[meldekortStatus]}
        </option>
    ),
);
