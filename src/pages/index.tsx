import React, { useState } from 'react';
import { Button, Heading, Loader, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import router from 'next/router';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import { finnStatusTekst } from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { KnappForBehandlingType } from '../components/behandlingsknapper/Benkknapp';
import { BehandlingStatus } from '../types/BehandlingTypes';
import Behandlingsoversikt from '../components/behandlingsoversikt/Behandlingsoversikt';

const Oversikten: NextPage = () => {
  const [feilmelding, settFeilmelding] = useState<string>('');
  const { SøknaderOgBehandlinger, isLoading, error } =
    useHentSøknaderOgBehandlinger();

  if (isLoading || !SøknaderOgBehandlinger) return <Loader />;

  if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente behandlinger (${error.status} ${error.info.error})`}
      />
    );

  return (
    <VStack gap="5" style={{ padding: '1rem' }}>
      {feilmelding && <Varsel variant={'error'} melding={feilmelding} />}
      <Heading size="medium" level="2">
        Oversikt over behandlinger og søknader
      </Heading>
      <Behandlingsoversikt>
        {SøknaderOgBehandlinger.map((behandling) => (
          <Table.Row shadeOnHover={false} key={behandling.id}>
            <Table.DataCell>{behandling.ident}</Table.DataCell>
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
                settFeilmelding={settFeilmelding}
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
      </Behandlingsoversikt>
    </VStack>
  );
};

export default Oversikten;

export const getServerSideProps = pageWithAuthentication();
