import { BodyShort, Heading, HStack, Label, Select, VStack } from '@navikt/ds-react';
import {
    MeldekortBehandlingDagProps,
    MeldekortBehandlingDagStatus,
    Meldekortstatuser,
} from '../../../../../types/MeldekortTypes';
import { meldekortdagHeading, ukeHeading } from '../../../../../utils/date';
import { velgIkonForMeldekortStatus } from '../../Meldekortikoner';
import { finnMeldekortdagStatusTekst } from '../../../../../utils/tekstformateringUtils';

import styles from '../../Meldekort.module.css';

type Props = {
    dager: MeldekortBehandlingDagProps[];
    settStatus: (dato: string, status: MeldekortBehandlingDagStatus) => void;
};

export const MeldekortBehandlingUke = ({ dager, settStatus }: Props) => {
    return (
        <VStack gap="5" justify="space-evenly" className={styles.meldekortuke}>
            <Heading size="small" level="3" className={styles.heading}>
                {ukeHeading(dager[0].dato)}
            </Heading>
            {dager.map(({ dato, status }) => (
                <VStack gap={'2'} key={dato}>
                    <HStack align={'center'} gap={'3'} wrap={false}>
                        {velgIkonForMeldekortStatus(status)}
                        <BodyShort as={Label}>{meldekortdagHeading(dato)}</BodyShort>
                    </HStack>
                    {status === MeldekortBehandlingDagStatus.Sperret ? (
                        <BodyShort>Ikke rett på tiltakspenger</BodyShort>
                    ) : (
                        <Select
                            label={'Velg status for dag'}
                            size={'small'}
                            hideLabel={true}
                            error={
                                status === MeldekortBehandlingDagStatus.IkkeUtfylt
                                    ? 'Status må fylles ut'
                                    : ''
                            }
                            value={status}
                            onChange={(e) => {
                                settStatus(dato, e.target.value as MeldekortBehandlingDagStatus);
                            }}
                        >
                            <option value={MeldekortBehandlingDagStatus.IkkeUtfylt}>
                                - Velg status -
                            </option>
                            {Meldekortstatuser.map((meldekortStatus) => (
                                <option key={meldekortStatus} value={meldekortStatus}>
                                    {finnMeldekortdagStatusTekst(meldekortStatus)}
                                </option>
                            ))}
                        </Select>
                    )}
                </VStack>
            ))}
        </VStack>
    );
};
