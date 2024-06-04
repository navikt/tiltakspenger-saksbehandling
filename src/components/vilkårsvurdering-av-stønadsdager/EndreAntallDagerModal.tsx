import React, { forwardRef } from 'react';
import { BodyLong, Button, HStack, Modal, VStack } from '@navikt/ds-react';
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
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const formMethods = useForm<SkjemaFelter>({
    mode: 'onSubmit',
    defaultValues: {},
  });

  async function onSubmit() {
    const data = formMethods.getValues();
    const fra = dateToISO(data.periode.fom);
    const til = dateToISO(data.periode.tom);
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
  }

  return (
    <div className="py-16">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(() => onSubmit())}>
          <Modal ref={ref} header={{ heading: 'Endre antall tiltaksdager' }}>
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
                    validate={[gyldigPeriodeValidator, påkrevdPeriodeValidator]}
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
            <Modal.Footer>
              <Button type="submit">Endre antall dager</Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => (ref as any).current?.close()}
              >
                Avbryt
              </Button>
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
