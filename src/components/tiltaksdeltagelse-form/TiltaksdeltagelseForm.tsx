import React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Periodefelt from '../saksopplysning-tabell/Periodefelt';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
} from '../../utils/validation';
import Flervalgsfelt from '../flervalgsfelt/Flervalgsfelt';
import { Button } from '@navikt/ds-react';
import styles from './../tiltak-card/TiltakCard.module.css';

interface TiltaksdeltagelseFormFelter {
  periode: {
    fom: Date;
    tom: Date;
  };
  antallDagerIUken: '';
}

interface TiltaksdeltagelseFormProps {
  onSubmit: SubmitHandler<TiltaksdeltagelseFormFelter>;
  onCancel: () => void;
}

const TiltaksdeltagelseForm = ({
  onSubmit,
  onCancel,
}: TiltaksdeltagelseFormProps) => {
  const formMethods = useForm<TiltaksdeltagelseFormFelter>({
    mode: 'onSubmit',
    defaultValues: {
      antallDagerIUken: '',
      periode: {},
    },
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <fieldset className={styles.tiltakCard__form__fieldset}>
          <Periodefelt
            size="small"
            name="periode"
            validate={[gyldigPeriodeValidator, påkrevdPeriodeValidator]}
          />
          <Flervalgsfelt
            className={styles.tiltakCard__form__antallDagerSelectBox}
            label="Antall dager"
            size="small"
            name="antallDagerIUken"
            validate={(valgtVerdi) => {
              if (!valgtVerdi) {
                return 'Det er påkrevd å oppgi antall dager i uken.';
              }
            }}
          >
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Flervalgsfelt>
        </fieldset>
        <div className={styles.tiltakCard__form__buttonSection}>
          <Button size="small" type="submit">
            Lagre
          </Button>
          <Button
            variant="tertiary"
            size="small"
            type="reset"
            onClick={onCancel}
          >
            Avbryt
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TiltaksdeltagelseForm;
