import {
  BodyShort,
  Button,
  HStack,
  Heading,
  Link,
  Loader,
  VStack,
} from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { velgFaktaTekst } from '../utils/velgFaktaTekst';
import { formatPeriode } from '../utils/date';
import { UtfallIkon } from '../components/utfall-ikon/UtfallIkon';
import { RedigeringSkjema } from '../components/saksopplysning-tabell/RedigeringSkjema';
import { PencilIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const [åpenRedigering, håndterÅpenRedigering] = useState<boolean>(false);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const KVPogIntro = valgtBehandling.saksopplysninger.find(
    (kategori) =>
      kategori.kategoriTittel ==
      'Introduksjonsprogrammet og Kvalifiseringsprogrammet',
  );

  if (!KVPogIntro) return <Loader />;

  return (
    <>
      <HStack gap="3" align="center" style={{ marginBottom: '0.5em' }}>
        <UtfallIkon utfall={KVPogIntro.samletUtfall} />
        <Heading size="medium" level="3">
          {KVPogIntro.kategoriTittel}
        </Heading>
      </HStack>
      <Link
        href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
        target="_blank"
        style={{ marginBottom: '1em' }}
      >
        Tiltakspengeforskriften § 7 Forholdet til andre ytelser
      </Link>
      <VStack gap="3">
        {KVPogIntro.saksopplysninger.map((saksopplysning) => (
          <HStack
            key={saksopplysning.vilkårTittel}
            style={{
              border: '3px #005B82 solid',
              borderRadius: '4px',
              padding: '1em',
            }}
          >
            <VStack
              style={{
                width: '50%',
              }}
            >
              <BodyShort size="large" weight="semibold" spacing>
                {saksopplysning.vilkårFlateTittel}
              </BodyShort>
              <BodyShort size="medium" spacing>
                Går søker på {saksopplysning.vilkårFlateTittel}?{' '}
                <b>
                  {velgFaktaTekst(
                    saksopplysning.typeSaksopplysning,
                    saksopplysning.fakta,
                  )}
                </b>
              </BodyShort>
              <BodyShort size="medium" spacing>
                Periode:{' '}
                <b>
                  {formatPeriode({
                    fra: saksopplysning.fom,
                    til: saksopplysning.tom,
                  })}
                </b>
              </BodyShort>
              <BodyShort size="medium" spacing>
                Kilde: <b>{saksopplysning.kilde}</b>
              </BodyShort>
            </VStack>
            <VStack
              style={{
                borderLeft: '3px #004367 solid',
                paddingLeft: '2em',
                width: '50%',
              }}
            >
              <BodyShort size="large" weight="semibold" spacing>
                Registerdata
              </BodyShort>
              <BodyShort size="medium" spacing>
                Fødselsdato:
              </BodyShort>
              <BodyShort size="medium" spacing>
                Alder:
              </BodyShort>

              <HStack justify="end">
                <Button
                  variant="secondary"
                  size="small"
                  iconPosition="right"
                  icon={<PencilIcon />}
                  onClick={() => håndterÅpenRedigering(!åpenRedigering)}
                >
                  Legg til saksopplysning
                </Button>
              </HStack>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </>
  );
};

export default Alder;
