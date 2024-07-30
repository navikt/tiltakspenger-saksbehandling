import React, { useContext } from 'react';
import { Button, Link, Loader, Table } from '@navikt/ds-react';
import { SaksbehandlerContext } from './_app';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import {
  behandlingLinkAktivert,
  skalKunneTaBehandling,
} from '../utils/tilganger';
import {
  BehandlingForBenk,
  BehandlingStatus,
  TypeBehandling,
} from '../types/BehandlingTypes';
import { useOpprettBehandling } from '../hooks/useOpprettBehandling';
import { periodeTilFormatertDatotekst } from '../utils/date';
import { finnStatusTekst } from '../utils/tekstformateringUtils';

const Benken: NextPage = () => {
  const router = useRouter();
  const mutator = useSWRConfig().mutate;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { SøknaderOgBehandlinger, isLoading } = useHentSøknaderOgBehandlinger();
  const { isBehandlingMutating, onOpprettBehandling } = useOpprettBehandling();

  if (isLoading || !SøknaderOgBehandlinger) {
    return <Loader />;
  }

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

  const knappForBehandlingType = (behandling: BehandlingForBenk) => {
    return (
      <>
        {behandling.typeBehandling == TypeBehandling.SØKNAD ? (
          <Button
            size="small"
            variant="primary"
            onClick={() => onOpprettBehandling(behandling.id)}
            disabled={
              !skalKunneTaBehandling(
                behandling.status,
                innloggetSaksbehandler,
                behandling.saksbehandler,
                behandling.beslutter,
              )
            }
          >
            Start behandling
          </Button>
        ) : (
          <Button
            size="small"
            variant="primary"
            onClick={() => taBehandling(behandling.id, behandling.status)}
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
        )}
      </>
    );
  };

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
        {SøknaderOgBehandlinger.map((behandling) => {
          return (
            <Table.Row shadeOnHover={false} key={behandling.id}>
              <Table.DataCell>{behandling.ident}</Table.DataCell>
              <Table.DataCell>{behandling.typeBehandling}</Table.DataCell>
              <Table.DataCell>
                {behandling.periode
                  ? `${periodeTilFormatertDatotekst(behandling.periode)}`
                  : '-'}
              </Table.DataCell>
              <Table.DataCell>
                {finnStatusTekst(behandling.status)}
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
  );
};

export default Benken;

export const getServerSideProps = pageWithAuthentication();
