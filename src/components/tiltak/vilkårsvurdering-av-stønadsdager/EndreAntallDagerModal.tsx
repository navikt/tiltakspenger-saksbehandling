import React, { forwardRef, useState } from 'react';
import {
  BodyLong,
  BodyShort,
  Button,
  HStack,
  Modal,
  Select,
  VStack,
} from '@navikt/ds-react';
import { Controller, FormProvider, get, useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
  setupValidation,
} from '../../../utils/validation';
import { Stønadsdager } from '../../../types/Behandling';
import Periodevelger from '../../saksopplysning-tabell/PeriodeVelger';

interface SkjemaFelter {
  periode: { fom: Date; tom: Date };
  antallDager: number;
}

interface EndreAntallDagerModalProps {
  minDate: Date;
  maxDate: Date;
  tiltakId: string;
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

const EndreAntallDagerModal = forwardRef<
  HTMLDialogElement,
  EndreAntallDagerModalProps
>(({ minDate, maxDate, tiltakId }, ref) => {
  const [feilmelding, setFeilmelding] = useState(null);
  const router = useRouter();

  const behandlingId = router.query.behandlingId as string;
  const mutator = useSWRConfig().mutate;

  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: { fom: minDate, tom: maxDate },
      antallDager: 0,
    },
  });

  async function onSubmit() {
    const data = formMethods.getValues();

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
    }
  }

  return (
    <div className="py-16">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Modal ref={ref} header={{ heading: 'Endre antall tiltaksdager' }}>
            <Modal.Body>
              <VStack gap="4">
                <BodyLong>
                  Dagene du setter per uke blir gjeldende for perioden du
                  setter. Gjenstår det perioder i vedtaket, får disse de
                  gjenstående dagene hentet fra Arena.
                </BodyLong>
                <HStack gap="4">
                  <Controller
                    name="periode"
                    control={formMethods.control}
                    rules={{
                      validate: setupValidation([
                        gyldigPeriodeValidator,
                        påkrevdPeriodeValidator,
                      ]),
                    }}
                    render={({ field: { onChange } }) => {
                      return (
                        <Periodevelger
                          id={'periode'}
                          onFromChange={(date) => {
                            onChange({
                              fom: date || '',
                              tom: formMethods.getValues().periode.fom,
                            });
                          }}
                          onToChange={(date) => {
                            onChange({
                              fom: formMethods.getValues().periode.tom,
                              tom: date || '',
                            });
                          }}
                          errorMessage={
                            get(formMethods.formState.errors, 'periode')
                              ?.message
                          }
                          minDate={minDate}
                          maxDate={maxDate}
                          size="small"
                        />
                      );
                    }}
                  />
                  <Controller
                    name={'antallDager'}
                    control={formMethods.control}
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
                          error={
                            get(formMethods.formState.errors, 'antallDager')
                              ?.message
                          }
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
              <Button type="submit">Endre antall dager</Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  (ref as any).current?.close();
                }}
              >
                Avbryt
              </Button>
              {feilmelding && (
                <BodyShort size={'small'}>{feilmelding}</BodyShort>
              )}
            </Modal.Footer>
          </Modal>
        </form>
      </FormProvider>
    </div>
  );
});

// Fikser linting-feil pga. manglende displayName
EndreAntallDagerModal.displayName = 'EndreAntallDagerModal';

export default EndreAntallDagerModal;
