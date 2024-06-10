import React, { forwardRef, useState } from 'react';
import {
  BodyLong,
  BodyShort,
  Button,
  HStack,
  Modal,
  VStack,
} from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import Periodefelt from '../saksopplysning-tabell/Periodefelt';
import {
  gyldigPeriodeValidator,
  påkrevdPeriodeValidator,
} from '../../utils/validation';
import Flervalgsfelt from '../flervalgsfelt/Flervalgsfelt';
import { AntallDagerSaksopplysning } from '../../types/Søknad';
import { useRouter } from 'next/router';
import { dateToISO } from '../../utils/date';
import { useSWRConfig } from 'swr';

interface SkjemaFelter {
  periode: {
    fom: Date;
    tom: Date;
  };
  antallDager: number;
}

interface EndreAntallDagerModalProps {
  minDate: Date;
  maxDate: Date;
  tiltakId: string;
}

async function oppdaterAntallDager(
  antallDager: AntallDagerSaksopplysning,
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
  const [unmountModal, setUnmountModal] = useState(false);

  const behandlingId = router.query.behandlingId as string;
  const mutator = useSWRConfig().mutate;

  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {
      periode: {
        fom: null,
        tom: null,
      } as any,
      antallDager: 0,
    },
  });

  async function onSubmit() {
    const data = formMethods.getValues();
    const fra = dateToISO(data.periode.fom);
    const til = dateToISO(data.periode.tom);

    try {
      setFeilmelding(null);
      formMethods.reset();
      await oppdaterAntallDager(
        {
          antallDager: +data.antallDager,
          periode: {
            fra,
            til,
          },
          kilde: 'SAKSB',
        },
        behandlingId,
        tiltakId,
      );
      (ref as any).current?.close();
      setUnmountModal(true);
      await mutator(`/api/behandling/${behandlingId}`);
      setUnmountModal(false);
    } catch (e: any) {
      setFeilmelding(e.message);
    }
  }

  return (
    <div className="py-16">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Modal ref={ref} header={{ heading: 'Endre antall tiltaksdager' }}>
            {!unmountModal && (
              <Modal.Body>
                <VStack gap="4">
                  <BodyLong>
                    Dagene du setter per uke blir gjeldende for perioden du
                    setter. Gjenstår det perioder i vedtaket, får disse de
                    gjenstående dagene hentet fra Arena.
                  </BodyLong>
                  <HStack gap="4">
                    <Periodefelt
                      name="periode"
                      validate={[
                        gyldigPeriodeValidator,
                        påkrevdPeriodeValidator,
                      ]}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                    <Flervalgsfelt
                      label="Antall dager per uke"
                      name="antallDager"
                    >
                      <option value=""></option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Flervalgsfelt>
                  </HStack>
                </VStack>
              </Modal.Body>
            )}
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
