import { BodyShort, VStack, Link, HStack, Loader } from '@navikt/ds-react';
import NextLink from 'next/link';
import styles from './Inngangsvilkårmeny.module.css';
import router from 'next/router';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { CalendarIcon } from '@navikt/aksel-icons';
import { vilkårTabs } from '../../utils/vilkår';

const Inngangsvilkårmeny = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const vilkårsteg = router.query.vilkårsteg as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const vilkår = vilkårTabs(valgtBehandling.vilkårssett);

  return (
    <VStack className={styles.inngangsvilkårmeny}>
      {vilkår.map((vilkår) => (
        <HStack
          key={vilkår.url}
          align="center"
          gap="5"
          padding="2"
          className={`${styles.vilkår} ${vilkårsteg === vilkår.url && styles.aktivtSteg}`}
        >
          <UtfallIkon utfall={vilkår.utfall} />
          <Link
            as={NextLink}
            underline={false}
            variant="neutral"
            onClick={() =>
              router.push(
                `/behandling/${behandlingId}/inngangsvilkar/${vilkår.url}`,
              )
            }
            href={`/behandling/${behandlingId}/inngangsvilkar/${vilkår.url}`}
            className={styles.vilkårlenke}
          >
            <VStack justify="center">
              <BodyShort>{vilkår.paragraf}</BodyShort>
              <BodyShort>{vilkår.tittel}</BodyShort>
            </VStack>
          </Link>
        </HStack>
      ))}
      <HStack
        align="center"
        gap="5"
        className={`${styles.vilkår} ${vilkårsteg === 'stonadsdager' && styles.aktivtSteg}`}
      >
        <CalendarIcon title="stønadsdager" fontSize="1.5rem" />
        <Link
          as={NextLink}
          underline={false}
          variant="neutral"
          onClick={() =>
            router.push(
              `/behandling/${behandlingId}/inngangsvilkar/stonadsdager`,
            )
          }
          href={`/behandling/${behandlingId}/inngangsvilkar/stonadsdager`}
          className={styles.vilkårlenke}
        >
          <VStack justify="center">
            <BodyShort>§6</BodyShort>
            <BodyShort>Stønadsdager</BodyShort>
          </VStack>
        </Link>
      </HStack>
    </VStack>
  );
};

export default Inngangsvilkårmeny;
