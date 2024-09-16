import { HStack, VStack, Heading, Table, Button } from '@navikt/ds-react';
import router from 'next/router';
import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import {
  formaterTidspunkt,
  periodeTilFormatertDatotekst,
} from '../../../utils/date';
import { NextPageWithLayout } from '../../_app';
import styles from '../../behandling/Behandling.module.css';
import {
  finnMeldekortstatusTekst,
  finnStatusTekst,
} from '../../../utils/tekstformateringUtils';
import { SakLayout } from '../../../components/layout/SakLayout';
import { Sak } from '../../../types/SakTypes';
import { logger } from '@navikt/next-logger';
import { getToken, requestOboToken } from '@navikt/oasis';
import { KnappForBehandlingType } from '../../../components/behandlingsknapper/Benkknapp';
import { BehandlingStatus } from '../../../types/BehandlingTypes';

const Saksoversikt: NextPageWithLayout<Sak> = ({
  behandlingsoversikt,
  meldekortoversikt,
  sakId,
  fnr,
}: Sak) => {
  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="meldekort-tab"
      id="meldekort-panel"
      tabIndex={2}
    >
      <VStack gap="6" className={styles.wrapper}>
        <Heading spacing size="medium" level="2">
          {`Saksoversikt for ${fnr}`}
        </Heading>
        <Table zebraStripes>
          <Table.Header>
            <Table.Row>
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
            {behandlingsoversikt.map((behandling) => (
              <Table.Row shadeOnHover={false} key={behandling.id}>
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
                  <KnappForBehandlingType
                    status={behandling.status}
                    saksbehandler={behandling.saksbehandler}
                    beslutter={behandling.beslutter}
                    behandlingId={behandling.id}
                  />
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
            {meldekortoversikt.map((meldekort) => (
              <Table.Row shadeOnHover={false} key={meldekort.meldekortId}>
                <Table.DataCell>Meldekort</Table.DataCell>
                <Table.DataCell>-</Table.DataCell>
                <Table.DataCell>
                  {finnMeldekortstatusTekst(meldekort.status)}
                </Table.DataCell>
                <Table.DataCell>
                  {meldekort.periode &&
                    `${periodeTilFormatertDatotekst(meldekort.periode)}`}
                </Table.DataCell>
                <Table.DataCell>
                  {meldekort.saksbehandler ?? '-'}
                </Table.DataCell>
                <Table.DataCell>{meldekort.beslutter ?? '-'}</Table.DataCell>
                <Table.DataCell></Table.DataCell>
                <Table.DataCell scope="col">
                  <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant="secondary"
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

Saksoversikt.getLayout = function getLayout(page: ReactElement) {
  return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
  const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL;

  const token = await getToken(context.req);
  logger.info('Henter obo-token for tiltakspenger-vedtak');
  const obo = await requestOboToken(
    token,
    `api://${process.env.VEDTAK_SCOPE}/.default`,
  );
  if (!obo.ok) {
    throw new Error(
      `Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`,
    );
  }

  const sakResponse: Response = await fetch(
    `${backendUrl}/sak/${context.params!.saksnummer}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    },
  );
  const sak: Sak = await sakResponse.json();

  if (!sak) {
    return {
      notFound: true,
    };
  }

  return { props: { ...sak } };
});

export default Saksoversikt;
