import { pageWithAuthentication } from '../../../utils/pageWithAuthentication';
import { Accordion, Alert, HStack, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout, SaksbehandlerContext } from '../../_app';
import { avklarLesevisning } from '../../../utils/avklarLesevisning';
import { SaksopplysningTabell } from '../../../components/saksopplysning-tabell/SaksopplysningTabell';
import { UtfallIkon } from '../../../components/utfallIkon/UtfallIkon';
import { samletUtfall } from '../../../utils/samletUtfall';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const girInnvilget = !valgtBehandling.saksopplysninger.find(
    (saksopplysning) => saksopplysning.samletUtfall !== 'OPPFYLT'
  );

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.tilstand,
    girInnvilget
  );
  const utfall = samletUtfall(valgtBehandling?.saksopplysninger);

  return (
    <>
      <p>venstre kolonne</p>
      <VStack>
        <Alert variant={utfall.variant} style={{ marginBottom: '1em' }}>
          <strong>{utfall.tekst}</strong>
          {utfall && (
            <>
              <br />
              {utfall.altTekst}
            </>
          )}
        </Alert>
        <Accordion indent={false}>
          <VStack>
            {valgtBehandling.saksopplysninger.map((kategori) => {
              return (
                <Accordion.Item
                  key={kategori.kategoriTittel}
                  style={{ background: '#FFFFFF' }}
                >
                  <Accordion.Header>
                    <HStack align={'center'} gap={'2'}>
                      <UtfallIkon utfall={kategori.samletUtfall} />
                      {kategori.kategoriTittel}
                    </HStack>
                  </Accordion.Header>
                  <Accordion.Content>
                    <SaksopplysningTabell
                      saksopplysninger={kategori.saksopplysninger}
                      behandlingId={behandlingId}
                      behandlingsperiode={{
                        fom: valgtBehandling.fom,
                        tom: valgtBehandling.tom,
                      }}
                      lesevisning={lesevisning}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </VStack>
        </Accordion>
      </VStack>
      <p>høyre kolonne</p>
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
