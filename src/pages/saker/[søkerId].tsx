import React from 'react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { Link, Loader, Table } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../utils/http';
import { Sak } from '../../types/Behandling';

const SakerPage: NextPage = () => {
  const router = useRouter();
  const søkerId = router.query.søkerId as string;

  const { data, isLoading } = useSWR<Sak[]>(
    `/api/sak/hentForSokerId/${søkerId}`,
    fetcher,
    {},
  );

  if (isLoading) {
    return <Loader />;
  }

  const sakerForIdent = data;

  return (
    <div style={{ paddingLeft: '1rem' }}>
      <Table zebraStripes>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Saksnummer</Table.HeaderCell>
            <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
            <Table.HeaderCell scope="col"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sakerForIdent?.map((sak) => {
            return (
              <Table.Row shadeOnHover={false} key={sak.saksnummer}>
                <Table.DataCell>{sak.saksnummer}</Table.DataCell>
                <Table.DataCell>{sak.ident}</Table.DataCell>
                <Table.DataCell>
                  <Link href={`/sak/${sak.saksnummer}`}>Se sak</Link>
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
