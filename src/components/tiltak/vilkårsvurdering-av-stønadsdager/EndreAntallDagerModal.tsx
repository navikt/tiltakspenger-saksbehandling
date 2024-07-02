import React, { RefObject, useState } from 'react';
import {
  BodyLong,
  BodyShort,
  Button,
  HStack,
  Modal,
  Select,
  VStack,
} from '@navikt/ds-react';
import {
  Controller,
  FieldErrors,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
  setupValidation,
} from '../../../utils/validation';
import { Stønadsdager } from '../../../types/Behandling';
import Periodevelger from '../../saksopplysning-tabell/PeriodeVelger';

interface Skjemafelter {
  periode: { fra: string | undefined; til: string | undefined };
  antallDager: number;
}

interface EndreAntallDagerModalProps {
  minDate: string;
  maxDate: string;
  tiltakId: string;
  modalRef: RefObject<HTMLDialogElement>;
}

async function oppdaterAntallDager(
  antallDager: Stønadsdager,
  behandlingId: string,
  tiltakId: string,
) {
  const response = await fetch(
    `/api/behandling/${behandlingId}/antalldager/${tiltakId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(antallDager),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Noe gikk galt ved lagring av antall dager: ${response.statusText}`,
    );
  }
  return response;
}

const EndreAntallDagerModal = ({
  minDate,
  maxDate,
  tiltakId,
  modalRef,
}: EndreAntallDagerModalProps) => {
  const [feilmelding, setFeilmelding] = useState(null);
  const router = useRouter();

  const behandlingId = router.query.behandlingId as string;
  const mutator = useSWRConfig().mutate;

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      periode: { fra: minDate, til: maxDate },
      antallDager: 0,
    },
  });

  const onInvalid = (errors: FieldErrors) => console.error(errors);

  console.log('verdier i modal: ', getValues());

  const onSubmit: SubmitHandler<Skjemafelter> = (data) => {
    console.log('sendt data: ', data);
    /*
    try {
      setFeilmelding(null);
      formMethods.reset();
      await oppdaterAntallDager(
        {
          antallDager: data.antallDager,
          periode: {
            fra: data.periode.fom,
            til: data.periode.tom,
            },
            kilde: 'SAKSB',
            },
            behandlingId,
            tiltakId,
            );
            (ref as any).current?.close();
            await mutator(`/api/behandling/${behandlingId}`);
            } catch (e: any) {
              setFeilmelding(e.message);
              }*/
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <Modal ref={modalRef} header={{ heading: 'Endre antall tiltaksdager' }}>
        <Modal.Body>
          <VStack gap="4">
            <BodyLong>
              Dagene du setter per uke blir gjeldende for perioden du setter.
              Gjenstår det perioder i vedtaket, får disse de gjenstående dagene
              hentet fra Arena.
            </BodyLong>
            <HStack gap="4">
              <Controller
                name="periode"
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                  return (
                    <Periodevelger
                      onFraChange={(dato: Date | undefined) => {
                        onChange({
                          fra: dato || '',
                          til: value.til,
                        });
                      }}
                      onTilChange={(dato: Date | undefined) => {
                        onChange(
                          onChange({
                            fra: value.fra,
                            til: dato || '',
                          }),
                        );
                      }}
                      error={errors.antallDager}
                      minDato={minDate}
                      maxDato={maxDate}
                      disabled={false}
                      inputref={ref}
                    />
                  );
                }}
              />
              <Controller
                name={'antallDager'}
                control={control}
                rules={{
                  validate: setupValidation((valgtVerdi) => {
                    if (!valgtVerdi) {
                      return 'Det er påkrevd å oppgi antall dager i uken.';
                    }
                  }),
                }}
                render={({ field }) => {
                  return (
                    <Select
                      label="Antall dager"
                      size="small"
                      error={!!errors.antallDager}
                      {...field}
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Select>
                  );
                }}
              />
            </HStack>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" value="submit">
            Endre antall dager
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              modalRef.current?.close();
            }}
          >
            Avbryt
          </Button>
          {feilmelding && <BodyShort size={'small'}>{feilmelding}</BodyShort>}
        </Modal.Footer>
      </Modal>
    </form>
  );
};

export default EndreAntallDagerModal;
