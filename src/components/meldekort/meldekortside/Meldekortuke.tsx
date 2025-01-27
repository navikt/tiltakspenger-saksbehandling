import { VStack, BodyShort, Select, HStack, Label, Heading } from '@navikt/ds-react';
import { Controller, useFormContext } from 'react-hook-form';
import {
    MeldekortBehandlingDag,
    MeldekortBehandlingDagStatus,
    Meldekortstatuser,
} from '../../../types/MeldekortTypes';
import { meldekortdagHeading } from '../../../utils/date';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';
import styles from './Meldekort.module.css';
import { velgIkonForMeldekortStatus } from './Meldekortikoner';

interface MeldekortukeProps {
    ukenummer: 1 | 2;
    ukeHeading: string;
    meldekortdager: MeldekortBehandlingDag[];
}

const Meldekortuke = ({ ukenummer, ukeHeading, meldekortdager }: MeldekortukeProps) => {
    const { control, watch, getFieldState, formState } = useFormContext();

    return (
        <VStack gap="5" justify="space-evenly" className={styles.meldekortuke}>
            <Heading size="small" level="3" className={styles.heading}>
                {ukeHeading}
            </Heading>
            {meldekortdager.map((dag, i) => {
                const error = getFieldState(`uke${ukenummer}.${i}.status`, formState).error;
                return (
                    <VStack gap="2" key={dag.dato}>
                        <HStack align="center" gap="3" wrap={false}>
                            {velgIkonForMeldekortStatus(watch(`uke${ukenummer}.${i}.status`))}
                            <BodyShort as={Label} id={dag.dato}>
                                {meldekortdagHeading(dag.dato)}
                            </BodyShort>
                        </HStack>
                        {dag.status === MeldekortBehandlingDagStatus.Sperret ? (
                            <BodyShort>Ikke rett på tiltakspenger</BodyShort>
                        ) : (
                            <Controller
                                name={`uke${ukenummer}.${i}.status`}
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <Select
                                            label="Velg status for dag"
                                            id={dag.dato}
                                            size="small"
                                            hideLabel
                                            error={error ? 'Status må fylles ut' : ''}
                                            value={value}
                                            onChange={onChange}
                                        >
                                            <option value={''}>- Velg status -</option>
                                            {Meldekortstatuser.map((meldekortStatus) => (
                                                <option
                                                    key={meldekortStatus}
                                                    value={meldekortStatus}
                                                >
                                                    {finnMeldekortdagStatusTekst(meldekortStatus)}
                                                </option>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            />
                        )}
                    </VStack>
                );
            })}
        </VStack>
    );
};

export default Meldekortuke;
