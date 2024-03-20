import React, { useContext } from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Button, Link, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../_app';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../../utils/http';
import { Sak} from '../../types/Behandling';

const SøkerPage: NextPage = () => {
  const router = useRouter();
  const søkerId = router.query.søkerId as string;
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  const { data, isLoading } = useSWR<Sak[]>(
      `/api/sak/hentForIdent/${søkerId}`,
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

  let sakerForIdent = data;

  sakerForIdent = [
    {
      id: '1234',
      ident:'5678'
    }
  ]

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
              <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
              <Table.HeaderCell scope="col"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sakerForIdent?.map((sak) => {
              return (
                  <Table.Row shadeOnHover={false} key={sak.id}>
                    <Table.DataCell>{sak.id}</Table.DataCell>
                    <Table.DataCell>Se sak</Table.DataCell>
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
