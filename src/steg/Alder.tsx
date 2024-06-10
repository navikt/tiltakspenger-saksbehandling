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

  const saksopplysning = valgtBehandling.saksopplysninger.find(
    (kategori) => kategori.kategoriTittel == 'Alder',
  )?.saksopplysninger[0];

  if (!saksopplysning) return <Loader />;

  return (
    <>
      <HStack gap="3" align="center" style={{ marginBottom: '0.5em' }}>
        <UtfallIkon utfall={saksopplysning.utfall} />
        <Heading size="medium" level="3">
          Alder
        </Heading>
      </HStack>
      <Link
        href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
        target="_blank"
        style={{ marginBottom: '1em' }}
      >
        Tiltakspengeforskriften § 3 Tiltakspenger og barnetillegg
      </Link>
      <HStack
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
          <BodyShort size="medium" spacing>
            <b>Er søker over 18 år?</b>{' '}
            {velgFaktaTekst(
              saksopplysning.typeSaksopplysning,
              saksopplysning.fakta,
            )}
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Periode:</b>{' '}
            {formatPeriode({
              fra: saksopplysning.fom,
              til: saksopplysning.tom,
            })}
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Kilde:</b> {saksopplysning.kilde}
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
      {åpenRedigering && (
        <RedigeringSkjema
          vilkårTittel={'ALDER'}
          vilkårFlateTittel={'Alder'}
          håndterLukkRedigering={() => håndterÅpenRedigering(false)}
          behandlingId={valgtBehandling.behandlingId}
          behandlingsperiode={{
            fom: valgtBehandling.fom,
            tom: valgtBehandling.tom,
          }}
          vilkårsperiode={{
            fom: valgtBehandling.søknad.deltakelseFom,
            tom: valgtBehandling.søknad.deltakelseTom,
          }}
          fakta={saksopplysning.fakta}
        />
      )}
    </>
  );
};

export default Alder;
