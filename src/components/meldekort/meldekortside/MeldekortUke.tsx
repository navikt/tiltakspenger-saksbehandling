import {
  VStack,
  BodyShort,
  Select,
  HStack,
  Label,
  Heading,
} from '@navikt/ds-react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import {
  MeldekortdagStatus,
  Meldekortstatuser,
} from '../../../types/MeldekortTypes';
import { meldekortdagHeading } from '../../../utils/date';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';
import { Meldekortform } from './Meldekort';
import styles from './Meldekort.module.css';
import { velgIkonForMeldekortStatus } from './Meldekortikoner';

interface MeldekortukeProps {
  control: Control<Meldekortform, any>;
  watch: UseFormWatch<Meldekortform>;
  ukenummer: 1 | 2;
  ukeHeading: string;
  meldekortdager: {
    dato: string;
    status: string;
  }[];
}

const Meldekortuke = ({
  ukenummer,
  control,
  watch,
  ukeHeading,
  meldekortdager,
}: MeldekortukeProps) => (
  <VStack gap="5" justify="space-evenly" className={styles.meldekortuke}>
    <Heading size="small" level="3" className={styles.heading}>
      {ukeHeading}
    </Heading>
    {meldekortdager.map((dag, i) => (
      <VStack gap="2" key={dag.dato}>
        <HStack align="center" gap="3" wrap={false}>
          {velgIkonForMeldekortStatus(watch(`uke${ukenummer}.${i}.status`))}
          <BodyShort as={Label}>{meldekortdagHeading(dag.dato)}</BodyShort>
        </HStack>
        {dag.status === MeldekortdagStatus.Sperret ? (
          <BodyShort>Ikke rett på tiltakspenger</BodyShort>
        ) : (
          <Controller
            name={`uke${ukenummer}.${i}.status`}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Velg status for dag"
                id={`uke${ukenummer}.${i}.status`}
                size="small"
                hideLabel
                value={value}
                onChange={onChange}
              >
                <option value={MeldekortdagStatus.IkkeUtfylt}>
                  - Velg status -
                </option>
                {Meldekortstatuser.map((meldekortStatus) => (
                  <option key={meldekortStatus} value={meldekortStatus}>
                    {finnMeldekortdagStatusTekst(meldekortStatus)}
                  </option>
                ))}
              </Select>
            )}
          />
        )}
      </VStack>
    ))}
  </VStack>
);

export default Meldekortuke;
