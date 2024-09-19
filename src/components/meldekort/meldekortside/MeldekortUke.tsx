import { VStack, BodyShort, Select } from '@navikt/ds-react';
import { Control, Controller } from 'react-hook-form';
import {
  MeldekortDag,
  MeldekortdagStatus,
  Meldekortstatuser,
} from '../../../types/MeldekortTypes';
import { ukedagFraDatotekst, formaterDatotekst } from '../../../utils/date';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';
import IkonMedTekst from '../../ikon-med-tekst/IkonMedTekst';
import { velgIkonForMeldekortStatus } from './MeldekortSide';
import { Meldekortform } from './Meldekort';

interface MeldekortukeProps {
  meldekortdager: MeldekortDag[];
  control: Control<Meldekortform, any>;
}

const Meldekortuke = ({ meldekortdager, control }: MeldekortukeProps) => {
  return (
    <VStack gap="5">
      {meldekortdager.map((dag, i) => (
        <VStack gap="2" key={dag.dato}>
          <IkonMedTekst
            text={`${ukedagFraDatotekst(dag.dato)} ${formaterDatotekst(dag.dato.toString())}`}
            iconRenderer={() => velgIkonForMeldekortStatus(dag.status)}
          />
          {dag.status === MeldekortdagStatus.Sperret ? (
            <BodyShort>Ikke rett på tiltakspenger</BodyShort>
          ) : (
            <Controller
              name={`meldekortdager.${i}.status`}
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Velg status for dag"
                  id={`meldekortdager.${i}.status`}
                  size="small"
                  hideLabel
                  value={value}
                  onChange={onChange}
                >
                  <option value={MeldekortdagStatus.IkkeUtfylt}>--</option>
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
};

export default Meldekortuke;
