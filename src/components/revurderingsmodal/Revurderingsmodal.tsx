import { Button, Modal, DatePicker, HStack } from '@navikt/ds-react';
import { ReactNode, RefObject, useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { setupValidation } from '../../utils/validation';
import Datovelger from './Datovelger';
import { Periode } from '../../types/Periode';
import { useOpprettRevurdering } from '../../hooks/opprettRevurdering';
import { SakContext } from '../layout/SakLayout';

interface RevurderingsmodalProps {
  modalRef: RefObject<HTMLDialogElement>;
  children?: ReactNode;
  saksperiode: Periode;
  lukkModal: () => void;
}

export interface RevurderingForm {
  fraOgMed: Date;
  tilOgMed: Date;
}

const Revurderingsmodal = ({
  modalRef,
  lukkModal,
  saksperiode,
}: RevurderingsmodalProps) => {
  const { sakId } = useContext(SakContext);
  const { opprettRevurdering, oppretterBehandling } =
    useOpprettRevurdering(sakId);

  const {
    getValues,
    control,
    formState: { errors },
  } = useForm<RevurderingForm>();

  return (
    <form>
      <Modal
        ref={modalRef}
        width="medium"
        aria-label="Velg periode for revurdering"
        onClose={() => {
          lukkModal();
        }}
        header={{ heading: 'Velg periode for revurdering' }}
      >
        <Modal.Body>
          <HStack gap="5">
            <Controller
              name="fraOgMed"
              control={control}
              rules={{
                validate: setupValidation([]),
              }}
              render={({ field: { onChange, value } }) => (
                <Datovelger
                  onDateChange={onChange}
                  label="Fra og med"
                  minDate={new Date(saksperiode.fraOgMed)}
                  maxDate={new Date(saksperiode.tilOgMed)}
                  defaultSelected={value}
                  errorMessage={errors.fraOgMed ? errors.fraOgMed.message : ''}
                />
              )}
            />
            <Controller
              name="tilOgMed"
              control={control}
              rules={{
                validate: setupValidation([]),
              }}
              render={({ field: { onChange, value } }) => (
                <DatePicker onChange={onChange}>
                  <Datovelger
                    onDateChange={onChange}
                    label="Til og med"
                    minDate={new Date(saksperiode.fraOgMed)}
                    maxDate={new Date(saksperiode.tilOgMed)}
                    defaultSelected={value}
                    errorMessage={
                      errors.tilOgMed ? errors.tilOgMed.message : ''
                    }
                  />
                </DatePicker>
              )}
            />
          </HStack>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            onClick={() =>
              opprettRevurdering({
                fraOgMed: getValues().fraOgMed.toString(),
                tilOgMed: getValues().tilOgMed.toString(),
              }).then(lukkModal)
            }
          >
            Opprett revurderingsbehandling
          </Button>
          <Button type="button" variant="secondary" onClick={() => lukkModal()}>
            Nei, avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};

export default Revurderingsmodal;
