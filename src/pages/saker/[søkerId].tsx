import React, { useContext } from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Button, Link, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../_app';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../../utils/http';
import { Sak } from '../../types/Behandling';

const SakerPage: NextPage = () => {
  const router = useRouter();
  const søkerId = router.query.søkerId as string;
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  const { data, isLoading } = useSWR<Sak[]>(
    `/api/sak/hentForSokerId/${søkerId}`,
    fetcher,
    {},
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

  const sakerForIdent = data;

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
                <Table.DataCell>
                  <Link href={`/sak/${sak.id}`}>Se sak</Link>
                </Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default SakerPage;

export const getServerSideProps = pageWithAuthentication();
