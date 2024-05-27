import React, { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';
import { ExpansionCard, HStack, Link, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { NextPageWithLayout } from '../../../_app';
import SøknadOppsummering from '../../../../components/søknad-oppsummering/SøknadOppsummering';
import { Saksdialog } from '../../../../components/saksdialog/Saksdialog';
import VilkårsvurderingAvStønadsdager from '../../../../components/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdager';
import styles from '../../../../components/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdager.module.css';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <SøknadOppsummering
        søknad={valgtBehandling.søknad}
        registrerteTiltak={valgtBehandling.registrerteTiltak}
      />
      <div className={styles.container}>
        <ExpansionCard aria-label="Stønadsdager">
          <ExpansionCard.Header>
            <HStack wrap={false} gap="4" align="center">
              <div>
                <ExpansionCard.Title>Stønadsdager</ExpansionCard.Title>
                <ExpansionCard.Description>
                  <Link
                    href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
                    target="_blank"
                  >
                    Tiltakspengeforskriften § 6-1 Stønadsdager
                  </Link>
                </ExpansionCard.Description>
              </div>
            </HStack>
          </ExpansionCard.Header>
          <ExpansionCard.Content>
            {valgtBehandling.registrerteTiltak.map((registrertTiltak, i) => (
              <VilkårsvurderingAvStønadsdager
                registrertTiltak={registrertTiltak}
                key={i}
              />
            ))}
          </ExpansionCard.Content>
        </ExpansionCard>
      </div>
      <Saksdialog endringslogg={valgtBehandling.endringslogg} />
    </>
  );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
