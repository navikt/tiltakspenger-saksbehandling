import { Accordion, Alert, HStack, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { samletUtfall } from '../../utils/samletUtfall';
import { Behandling } from '../../types/Behandling';
import { Lesevisning } from '../../utils/avklarLesevisning';

interface VilkårsvurderingProps {
  utfall: samletUtfall;
  valgtBehandling: Behandling;
  lesevisning: Lesevisning;
}

export const Vilkårsvurdering = ({
  utfall,
  valgtBehandling,
  lesevisning,
}: VilkårsvurderingProps) => {
  return (
    <VStack gap="5" style={{ padding: '1em' }}>
      <Alert variant={utfall.variant}>
        {utfall.tekst}
        {utfall.altTekst && (
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
                    behandlingId={valgtBehandling.behandlingId}
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
  );
};
