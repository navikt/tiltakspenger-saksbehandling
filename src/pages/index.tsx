import React, { useContext } from 'react';
import { Button, Heading, Loader, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import router from 'next/router';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import { finnStatusTekst } from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { BehandlingStatus } from '../types/BehandlingTypes';
import { useOpprettBehandling } from '../hooks/useOpprettBehandling';
import { eierBehandling, skalKunneTaBehandling } from '../utils/tilganger';
import { useTaBehandling } from '../hooks/useTaBehandling';
import { SaksbehandlerContext } from './_app';
import { knappForBehandlingType } from '../components/behandlingsknapper/Benkknapp';
import { preload } from 'swr';
import { fetcher } from '../utils/http';

preload('/api/behandlinger', fetcher);

const Oversikten: NextPage = () => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { SøknaderOgBehandlinger, isLoading, error } =
    useHentSøknaderOgBehandlinger();
  const { opprettBehandlingError, isSøknadMutating, onOpprettBehandling } =
    useOpprettBehandling();
  const { onTaBehandling, isBehandlingMutating, taBehandlingError } =
    useTaBehandling();

  if (isLoading || !SøknaderOgBehandlinger) return <Loader />;

  const errors = error || opprettBehandlingError || taBehandlingError;

  return (
    <VStack gap="5" style={{ padding: '1rem' }}>
      {errors && <Varsel variant={'error'} melding={errors.message} />}
      <Heading size="medium" level="2">
        Oversikt over behandlinger og søknader
      </Heading>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
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
          {SøknaderOgBehandlinger.map((behandling) => (
            <Table.Row shadeOnHover={false} key={behandling.id}>
              <Table.DataCell>{behandling.ident}</Table.DataCell>
              <Table.DataCell>{behandling.typeBehandling}</Table.DataCell>
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
        </Table.Body>
      </Table>
    </VStack>
  );
};

export default Oversikten;

export const getServerSideProps = pageWithAuthentication();
