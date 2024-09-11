import {
  Loader,
  HStack,
  VStack,
  Heading,
  Table,
  Button,
} from '@navikt/ds-react';
import router from 'next/router';
import { useContext, ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import Behandlingdetaljer from '../../../components/behandlingdetaljer/Behandlingdetaljer';
import {
  BehandlingContext,
  SaksbehandlingLayout,
} from '../../../components/layout/SaksbehandlingLayout';
import Varsel from '../../../components/varsel/Varsel';
import { useHentMeldekortListe } from '../../../hooks/meldekort/useHentMeldekortListe';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import { NextPageWithLayout } from '../../_app';
import styles from '../Behandling.module.css';
import { finnMeldekortstatusTekst } from '../../../utils/tekstformateringUtils';

const Meldekortoversikt: NextPageWithLayout = () => {
  const { sakId } = useContext(BehandlingContext);
  const { meldekortliste, isLoading, error } = useHentMeldekortListe(
    true,
    sakId,
  );

  if (isLoading || !meldekortliste) return <Loader />;
  if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente meldekort (${error.status} ${error.info})`}
      />
    );

  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="meldekort-tab"
      id="meldekort-panel"
      tabIndex={2}
    >
      <Behandlingdetaljer />
      <VStack gap="6" className={styles.wrapper}>
        <Heading spacing size="medium" level="2">
          Oversikt over meldekortbehandlinger
        </Heading>
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
              <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
              <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {meldekortliste.map((meldekort) => (
              <Table.Row shadeOnHover={false} key={meldekort.meldekortId}>
                <Table.DataCell>
                  {meldekort.periode &&
                    `${periodeTilFormatertDatotekst(meldekort.periode)}`}
                </Table.DataCell>
                <Table.DataCell>
                  {finnMeldekortstatusTekst(meldekort.status)}
                </Table.DataCell>
                <Table.DataCell>
                  {meldekort.saksbehandler ?? '-'}
                </Table.DataCell>
                <Table.DataCell>{meldekort.beslutter ?? '-'}</Table.DataCell>
                <Table.DataCell scope="col">
                  <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant={'primary'}
                    onClick={() =>
                      router.push(
                        `/sak/${sakId}/meldekort/${meldekort.meldekortId}`,
                      )
                    }
                  >
                    Åpne
                  </Button>
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </VStack>
    </HStack>
  );
};

Meldekortoversikt.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export default Meldekortoversikt;

export const getServerSideProps = pageWithAuthentication();
