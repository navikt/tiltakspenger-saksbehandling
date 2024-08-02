import React, { useContext } from 'react';
import { Box, Button, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from './_app';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { skalKunneTaBehandling } from '../utils/tilganger';
import { BehandlingForBenk, TypeBehandling } from '../types/BehandlingTypes';
import { useOpprettBehandling } from '../hooks/useOpprettBehandling';
import { periodeTilFormatertDatotekst } from '../utils/date';
import { finnStatusTekst } from '../utils/tekstformateringUtils';
import { useTaBehandling } from '../hooks/useTaBehandling';
import Varsel from '../components/varsel/Varsel';

const Benken: NextPage = () => {
  const router = useRouter();
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { SøknaderOgBehandlinger, isLoading, error } =
    useHentSøknaderOgBehandlinger();
  const { isSøknadMutating, onOpprettBehandling } = useOpprettBehandling();
  const { isBehandlingMutating, onTaBehandling } = useTaBehandling();

  if (isLoading || !SøknaderOgBehandlinger) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke beregne meldekort (${error.status} ${error.info})`}
      />
    );

  const knappForBehandlingType = (behandling: BehandlingForBenk) => {
    if (behandling.typeBehandling === TypeBehandling.SØKNAD)
      return (
        <Button
          size="small"
          variant="primary"
          loading={isSøknadMutating}
          onClick={() => onOpprettBehandling({ id: behandling.id })}
        >
          Start behandling
        </Button>
      );
    else if (
      skalKunneTaBehandling(
        behandling.status,
        innloggetSaksbehandler,
        behandling.saksbehandler,
      )
    )
      return (
        <Button
          size="small"
          variant="primary"
          loading={isBehandlingMutating}
          onClick={() => onTaBehandling({ id: behandling.id })}
          disabled={
            !skalKunneTaBehandling(
              behandling.status,
              innloggetSaksbehandler,
              behandling.saksbehandler,
            )
          }
        >
          Ta behandling
        </Button>
      );
    else
      return (
        <Button
          size="small"
          variant="secondary"
          onClick={() =>
            router.push(`/behandling/${behandling.id}/oppsummering`)
          }
        >
          Se behandling
        </Button>
      );
  };

  return (
    <Box style={{ padding: '1rem' }}>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Ident</Table.HeaderCell>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
            <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {SøknaderOgBehandlinger.map((behandling) => {
            return (
              <Table.Row shadeOnHover={false} key={behandling.id}>
                <Table.DataCell>{behandling.ident}</Table.DataCell>
                <Table.DataCell>{behandling.typeBehandling}</Table.DataCell>
                <Table.DataCell>
                  {finnStatusTekst(behandling.status)}
                </Table.DataCell>
                <Table.DataCell>
                  {behandling.periode &&
                    `${periodeTilFormatertDatotekst(behandling.periode)}`}
                </Table.DataCell>
                <Table.DataCell>{behandling.saksbehandler}</Table.DataCell>
                <Table.DataCell>{behandling.beslutter}</Table.DataCell>
                <Table.DataCell>
                  {knappForBehandlingType(behandling)}
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default Benken;

export const getServerSideProps = pageWithAuthentication();
