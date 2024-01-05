import React, { useContext } from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Link, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../_app';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../../utils/http';
import toast from 'react-hot-toast';
import Loaders from '../../components/loaders/Loaders';
import { BehandlingForBenk } from '../../types/Behandling';

const SøkerPage: NextPage = () => {
  const router = useRouter();
  const [søkerId] = router.query.all as string[];

  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  const { data, isLoading } = useSWR<BehandlingForBenk[]>(
    `/api/behandlinger/hentForIdent/${søkerId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error: FetcherError) =>
        toast.error(`[${error.status}]: ${error.info}`),
    }
  );

  if (isLoading) {
    return <Loaders.Page />;
  }

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
