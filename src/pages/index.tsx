import React from 'react';
import { Box, Heading, Loader, Table } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import router from 'next/router';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { useOpprettBehandling } from '../hooks/useOpprettBehandling';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import { finnStatusTekst } from '../utils/tekstformateringUtils';
import { useTaBehandling } from '../hooks/useTaBehandling';
import Varsel from '../components/varsel/Varsel';
import {
  benkknapp,
  KnappForBehandlingType,
} from '../components/behandlingsknapper/Benkknapp';
import { BehandlingStatus } from '../types/BehandlingTypes';

const Oversikten: NextPage = () => {
  const { SøknaderOgBehandlinger, isLoading, error } =
    useHentSøknaderOgBehandlinger();
  const { opprettBehandlingError } = useOpprettBehandling();
  const { taBehandlingError } = useTaBehandling();

  if (isLoading || !SøknaderOgBehandlinger) return <Loader />;

  if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente behandlinger (${error.status} ${error.info})`}
      />
    );

  return (
    <Box style={{ padding: '1rem' }}>
      <Heading spacing size="medium" level="2">
        Oversikt over behandlinger og søknader
      </Heading>
      {taBehandlingError && (
        <Varsel
          variant={'error'}
          melding={`Kunne ikke ta behandling (${taBehandlingError.status} ${taBehandlingError.info})`}
        />
      )}
      {opprettBehandlingError && (
        <Varsel
          variant={'error'}
          melding={`Kunne ikke opprette behandling (${opprettBehandlingError.status} ${opprettBehandlingError.info})`}
        />
      )}
      <Table zebraStripes>
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
                {formaterTidspunkt(behandling.kravdato) ?? 'Ukjent'}
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
                <KnappForBehandlingType
                  status={behandling.status}
                  saksbehandler={behandling.saksbehandler}
                  beslutter={behandling.beslutter}
                  behandlingId={behandling.id}
                />
              </Table.DataCell>
              <Table.DataCell>
                {behandling.status !== BehandlingStatus.SØKNAD &&
                  benkknapp(
                    'secondary',
                    () =>
                      router.push(`/behandling/${behandling.id}/oppsummering`),
                    'Se behandling',
                  )}
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default Oversikten;

export const getServerSideProps = pageWithAuthentication();
