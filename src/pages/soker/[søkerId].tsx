import React, { useContext } from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Button, Link, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../_app';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../../utils/http';
import { BehandlingForBenk } from '../../types/Behandling';

const SøkerPage: NextPage = () => {
  const router = useRouter();
  const søkerId = router.query.søkerId as string;
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  const { data, isLoading } = useSWR<BehandlingForBenk[]>(
    `/api/behandlinger/hentForIdent/${søkerId}`,
    fetcher,
    {}
  );

  if (isLoading) {
    return <Loader />;
  }

  const taBehandling = async (behandlingid: string) => {
    fetch(`/api/behandling/startbehandling/${behandlingid}`, {
      method: 'POST',
    })
      .then(() => {
        mutator(`/api/behandlinger`);
      })
      .then(() => {
        router.push(`/behandling/${behandlingid}`);
      });
  };

  const skalKunneTaBehandling = (
    type: string,
    saksbehandlerForBehandling?: string,
    beslutterForBehandling?: string
  ) => {
    switch (type) {
      case 'Klar til beslutning':
        return (
          innloggetSaksbehandler?.roller.includes('BESLUTTER') &&
          !beslutterForBehandling &&
          innloggetSaksbehandler?.navIdent != saksbehandlerForBehandling
        );
      case 'Klar til behandling':
        return (
          innloggetSaksbehandler?.roller.includes('SAKSBEHANDLER') &&
          !saksbehandlerForBehandling
        );
      default:
        return false;
    }
  };

  const behandlingerForIdent = data;

  const behandlingLinkAktivert = (
    saksbehandlerForBehandling?: string,
    beslutterForBehandling?: string
  ) => {
    return (
      innloggetSaksbehandler?.navIdent == saksbehandlerForBehandling ||
      innloggetSaksbehandler?.navIdent == beslutterForBehandling ||
      innloggetSaksbehandler?.roller.includes('ADMINISTRATOR')
    );
  };
  return (
    <div style={{ paddingLeft: '1rem' }}>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
            <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {behandlingerForIdent?.map((behandling) => {
            return (
              <Table.Row shadeOnHover={false} key={behandling.id}>
                <Table.DataCell>
                  {behandlingLinkAktivert(
                    behandling.saksbehandler,
                    behandling.beslutter
                  ) ? (
                    <Link href={`/behandling/${behandling.id}`}>
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
                    onClick={() => taBehandling(behandling.id)}
                    disabled={
                      !skalKunneTaBehandling(
                        behandling.status,
                        behandling.saksbehandler,
                        behandling.beslutter
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
    </div>
  );
};

export default SøkerPage;

export const getServerSideProps = pageWithAuthentication();
