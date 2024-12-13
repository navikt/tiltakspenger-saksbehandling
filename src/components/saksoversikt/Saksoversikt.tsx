import {
  Box,
  HStack,
  Heading,
  Spacer,
  Button,
  Table,
  DatePicker,
} from '@navikt/ds-react';
import router from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import {
  BehandlingForBenk,
  BehandlingStatus,
} from '../../types/BehandlingTypes';
import {
  Meldekortsammendrag,
  Meldekortstatus,
} from '../../types/MeldekortTypes';
import {
  dateTilISOTekst,
  formaterTidspunkt,
  periodeTilFormatertDatotekst,
} from '../../utils/date';
import {
  finnStatusTekst,
  finnMeldekortstatusTekst,
  finnBehandlingstypeTekst,
} from '../../utils/tekstformateringUtils';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import { setupValidation } from '../../utils/validation';
import { knappForBehandlingType } from '../behandlingsknapper/Benkknapp';
import Datovelger from '../revurderingsmodal/Datovelger';
import Spørsmålsmodal from '../revurderingsmodal/Spørsmålsmodal';
import { useContext, useRef } from 'react';
import { useOpprettRevurdering } from '../../hooks/opprettRevurdering';
import { useOpprettBehandling } from '../../hooks/useOpprettBehandling';
import { useTaBehandling } from '../../hooks/useTaBehandling';
import { SaksbehandlerContext } from '../../pages/_app';
import styles from './Saksoversikt.module.css';
import { RevurderingForm } from '../../pages/sak/[saksnummer]';

interface SaksoversiktProps {
  behandlingsoversikt: BehandlingForBenk[];
  meldekortoversikt: Meldekortsammendrag[];
  saksnummer: string;
  sakId: string;
}

export const Saksoversikt = ({
  behandlingsoversikt,
  meldekortoversikt,
  saksnummer,
  sakId,
}: SaksoversiktProps) => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { onOpprettBehandling, isSøknadMutating } = useOpprettBehandling();
  const { onTaBehandling, isBehandlingMutating } = useTaBehandling();

  const fraOgMed = new Date(behandlingsoversikt[0].periode.fraOgMed);
  const tilOgMed = new Date(behandlingsoversikt[0].periode.tilOgMed);

  const modalRef = useRef(null);

  const { opprettRevurdering, oppretterBehandling } = useOpprettRevurdering(
    sakId,
    saksnummer,
  );

  const onSubmit = () => {
    opprettRevurdering({
      periode: {
        fraOgMed: dateTilISOTekst(getValues().fraOgMed),
        tilOgMed: dateTilISOTekst(getValues().tilOgMed),
      },
    });
  };

  const {
    getValues,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RevurderingForm>({
    defaultValues: {
      fraOgMed: new Date(fraOgMed),
      tilOgMed: new Date(tilOgMed),
    },
  });

  return (
    <Box className={styles.wrapper}>
      <HStack align="center" style={{ marginBottom: '1rem' }}>
        <Heading spacing size="medium" level="2">
          Saksoversikt
        </Heading>
        <Spacer />
        <Button
          size="small"
          variant="secondary"
          onClick={() => modalRef.current.showModal()}
        >
          Revurder
        </Button>
      </HStack>
      <Box className={styles.tabellwrapper}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Type</Table.HeaderCell>
              <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
              <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {behandlingsoversikt.map((behandling) => (
              <Table.Row shadeOnHover={false} key={behandling.id}>
                <Table.DataCell>
                  {finnBehandlingstypeTekst(behandling.typeBehandling)}
                </Table.DataCell>
                <Table.DataCell>
                  {formaterTidspunkt(behandling.kravtidspunkt) ?? 'Ukjent'}
                </Table.DataCell>
                <Table.DataCell>
                  {finnStatusTekst(behandling.status, behandling.underkjent)}
                </Table.DataCell>
                <Table.DataCell>
                  {behandling.periode &&
                    `${periodeTilFormatertDatotekst(behandling.periode)}`}
                </Table.DataCell>
                <Table.DataCell>
                  {behandling.saksbehandler ?? 'Ikke tildelt'}
                </Table.DataCell>
                <Table.DataCell>
                  {behandling.beslutter ?? 'Ikke tildelt'}
                </Table.DataCell>
                <Table.DataCell scope="col">
                  {knappForBehandlingType(
                    behandling.status,
                    behandling.id,
                    eierBehandling(
                      behandling.status,
                      innloggetSaksbehandler,
                      behandling.saksbehandler,
                      behandling.beslutter,
                    ),
                    skalKunneTaBehandling(
                      behandling.status,
                      innloggetSaksbehandler,
                      behandling.saksbehandler,
                    ),
                    onOpprettBehandling,
                    onTaBehandling,
                    isSøknadMutating,
                    isBehandlingMutating,
                  )}
                </Table.DataCell>
                <Table.DataCell>
                  {behandling.status !== BehandlingStatus.SØKNAD && (
                    <Button
                      style={{ minWidth: '50%' }}
                      size="small"
                      variant={'secondary'}
                      onClick={() =>
                        router.push(`/behandling/${behandling.id}/oppsummering`)
                      }
                    >
                      Se behandling
                    </Button>
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
            {meldekortoversikt.map((meldekort) => (
              <Table.Row shadeOnHover={false} key={meldekort.meldekortId}>
                <Table.DataCell>Meldekort</Table.DataCell>
                <Table.DataCell>-</Table.DataCell>
                <Table.DataCell>
                  {finnMeldekortstatusTekst(meldekort.status)}
                </Table.DataCell>
                <Table.DataCell>
                  {meldekort.periode &&
                    `${periodeTilFormatertDatotekst(meldekort.periode)}`}
                </Table.DataCell>
                <Table.DataCell>
                  {meldekort.saksbehandler ?? '-'}
                </Table.DataCell>
                <Table.DataCell>{meldekort.beslutter ?? '-'}</Table.DataCell>
                <Table.DataCell scope="col">-</Table.DataCell>
                <Table.DataCell>
                  {meldekort.status !==
                    Meldekortstatus.IKKE_KLAR_TIL_UTFYLLING && (
                    <Button
                      style={{ minWidth: '50%' }}
                      size="small"
                      variant="secondary"
                      onClick={() =>
                        router.push(
                          `/sak/${saksnummer}/meldekort/${meldekort.meldekortId}`,
                        )
                      }
                    >
                      Åpne
                    </Button>
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
      <Spørsmålsmodal
        modalRef={modalRef}
        heading="Velg periode for revurdering"
        submitTekst="Opprett revurdering"
        onSubmit={handleSubmit(onSubmit)}
      >
        {
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
                  minDate={new Date(fraOgMed)}
                  maxDate={new Date(tilOgMed)}
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
                    minDate={new Date(fraOgMed)}
                    maxDate={new Date(tilOgMed)}
                    defaultSelected={value}
                    errorMessage={
                      errors.tilOgMed ? errors.tilOgMed.message : ''
                    }
                  />
                </DatePicker>
              )}
            />
          </HStack>
        }
      </Spørsmålsmodal>
    </Box>
  );
};
