import React, { useContext } from 'react';
import { Button, Link, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from './_app';
import { useHentOppgaver } from '../hooks/useHentOppgaver';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import {
  behandlingLinkAktivert,
  skalKunneTaBehandling,
} from '../utils/tilganger';
import { BehandlingStatus } from '../types/BehandlingTypes';

const Benken: NextPage = () => {
  const router = useRouter();
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { oppgaver, isLoading } = useHentOppgaver();

  const finnBehandlingurlForTilstand = (
    behandlingid: string,
    tilstand: string,
  ) => {
    switch (tilstand) {
      case BehandlingStatus.KLAR_TIL_BEHANDLING &&
        BehandlingStatus.UNDER_BEHANDLING:
        return `/behandling/${behandlingid}/inngangsvilkar/kravfrist`;
      case BehandlingStatus.SØKNAD:
        return '/';
      default:
        return `/behandling/${behandlingid}/oppsummering`;
    }
  };

  const opprettBehandling = 

  const taBehandling = async (behandlingid: string, tilstand: string) => {
    fetch(`/api/behandling/startbehandling/${behandlingid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status.toString() + res.statusText);
        mutator(`/api/behandlinger`);
      })
      .catch((error) => {
        throw new Error(
          `Noe gikk galt ved setting av saksbehandler på behandlingen: ${error.message}`,
        );
      })
      .then(() => {
        router.push(finnBehandlingurlForTilstand(behandlingid, tilstand));
      });
  };

  if (isLoading || !oppgaver) {
    return <Loader />;
  }

  return (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Ident</Table.HeaderCell>
          <Table.HeaderCell scope="col">Type</Table.HeaderCell>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
          <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver.map((behandling) => {
          return (
            <Table.Row shadeOnHover={false} key={behandling.id}>
              <Table.DataCell>{behandling.ident}</Table.DataCell>
              <Table.DataCell>
                {behandlingLinkAktivert(
                  innloggetSaksbehandler,
                  behandling.saksbehandler,
                  behandling.beslutter,
                ) ? (
                  <Link href={`/behandling/${behandling.id}/oppsummering`}>
                    {behandling.typeBehandling}
                  </Link>
                ) : (
                  behandling.typeBehandling
                )}
              </Table.DataCell>
              <Table.DataCell>{`${behandling.fom} - ${behandling.tom}`}</Table.DataCell>
              <Table.DataCell>{behandling.status}</Table.DataCell>
              <Table.DataCell>{behandling.saksbehandler}</Table.DataCell>
              <Table.DataCell>{behandling.beslutter}</Table.DataCell>
              <Table.DataCell>
                <Button
                  size="small"
                  variant="primary"
                  onClick={() =>
                    taBehandling(behandling.id, behandling.tilstand)
                  }
                  disabled={
                    !skalKunneTaBehandling(
                      behandling.status,
                      innloggetSaksbehandler,
                      behandling.saksbehandler,
                      behandling.beslutter,
                    )
                  }
                >
                  Ta behandling
                </Button>
              </Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default Benken;

export const getServerSideProps = pageWithAuthentication();
