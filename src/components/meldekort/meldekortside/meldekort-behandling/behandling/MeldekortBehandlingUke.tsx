import { BodyShort, Heading, HStack, Label, Select, VStack } from '@navikt/ds-react';
import {
    MeldekortBehandlingDagProps,
    MeldekortBehandlingDagStatus,
} from '../../../../../types/meldekort/MeldekortBehandling';
import { meldekortdagHeading, ukeHeading } from '../../../../../utils/date';
import { ikonForMeldekortBehandlingDagStatus } from '../../Meldekortikoner';
import { meldekortBehandlingDagStatusTekst } from '../../../../../utils/tekstformateringUtils';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldPath } from 'react-hook-form/dist/types/path';
import { MeldekortBehandlingForm } from './meldekortBehandlingUtils';

import styles from '../../Meldekort.module.css';

const meldekortStatusValg = Object.values(MeldekortBehandlingDagStatus).filter(
    (status) =>
        ![MeldekortBehandlingDagStatus.Sperret, MeldekortBehandlingDagStatus.IkkeUtfylt].includes(
            status,
        ),
);

type Props = {
    dager: MeldekortBehandlingDagProps[];
    ukenummer: 1 | 2;
};

export const MeldekortBehandlingUke = ({ dager, ukenummer }: Props) => {
    const { control, watch, getFieldState, formState } = useFormContext<MeldekortBehandlingForm>();

    return (
        <VStack gap="5" justify="space-evenly" className={styles.meldekortuke}>
            <Heading size="small" level="3" className={styles.heading}>
                {ukeHeading(dager[0].dato)}
            </Heading>
            {dager.map(({ dato, status }, i) => {
                const fieldPath: FieldPath<MeldekortBehandlingForm> = `uke${ukenummer}.${i}.status`;
                const valgtStatus = watch(fieldPath);
                const error = getFieldState(fieldPath, formState).error;

                return (
                    <VStack gap={'2'} key={dato}>
                        <HStack align={'center'} gap={'3'} wrap={false}>
                            {ikonForMeldekortBehandlingDagStatus[valgtStatus]}
                            <BodyShort as={Label}>{meldekortdagHeading(dato)}</BodyShort>
                        </HStack>
                        {status === MeldekortBehandlingDagStatus.Sperret ? (
                            <BodyShort>Ikke rett på tiltakspenger</BodyShort>
                        ) : (
                            <Controller
                                name={`uke${ukenummer}.${i}.status`}
                                control={control}
                                rules={{ validate: (value) => meldekortStatusValg.includes(value) }}
                                defaultValue={MeldekortBehandlingDagStatus.IkkeUtfylt}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        label="Velg status for dag"
                                        id={dato}
                                        size="small"
                                        hideLabel
                                        error={error ? 'Status må fylles ut' : ''}
                                        value={value}
                                        onChange={onChange}
                                    >
                                        <option value={MeldekortBehandlingDagStatus.IkkeUtfylt}>
                                            - Velg status -
                                        </option>
                                        {meldekortStatusValg.map((meldekortStatus) => (
                                            <option key={meldekortStatus} value={meldekortStatus}>
                                                {meldekortBehandlingDagStatusTekst[meldekortStatus]}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                        )}
                    </VStack>
                );
            })}
        </VStack>
    );
};
