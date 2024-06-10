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
import { Utfall } from '../types/Utfall';

const Alder = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const [åpenRedigering, håndterÅpenRedigering] = useState<boolean>(false);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <HStack gap="3" align="center" style={{ marginBottom: '0.5em' }}>
        <UtfallIkon utfall={Utfall.KREVER_MANUELL_VURDERING} />
        <Heading size="medium" level="3">
          Søknadstidspunkt
        </Heading>
      </HStack>
      <Link
        href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
        target="_blank"
        style={{ marginBottom: '1em' }}
      >
        Tiltakspengeforskriften §11 Frist for framsetting av krav
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
            <b>Har bruker søkt innenfor fristen?</b> ?
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Periode:</b>?
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Kilde:</b> ?
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
            Søknadsdato: <b>{valgtBehandling.søknad.søknadsdato}</b>
          </BodyShort>
          <BodyShort size="medium" style={{ marginBottom: '2em' }} spacing>
            Tiltak: <b>{valgtBehandling.registrerteTiltak[0].navn}</b>
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
          fakta={{
            harIkkeYtelse: 'Bruker har søkt innenfor fristen',
            harYtelse: 'Bruker har ikke søkt innenfor fristen',
          }}
        />
      )}
    </>
  );
};

export default Alder;
