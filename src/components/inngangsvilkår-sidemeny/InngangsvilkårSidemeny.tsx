import { List, VStack } from '@navikt/ds-react';
import { PuzzlePieceIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import styles from './InngangsvilkårSidemeny.module.css';
import { useRouter } from 'next/router';

const vilkår = [
  { tittel: 'Frist for framsetting av krav', url: 'kravfrist' },
  { tittel: 'Tiltaksdeltagelse', url: 'tiltaksdeltagelse' },
  { tittel: 'Alder', url: 'alder' },
  { tittel: 'Andre ytelser', url: 'andreytelser' },
  { tittel: 'Kvalifiseringsprogrammet', url: 'kvp' },
  { tittel: 'Introduksjonsprogrammet', url: 'intro' },
  { tittel: 'Institusjonsopphold', url: 'institusjonsopphold' },
];

const InngangsvilkårSidemeny = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const vilkårsteg = router.query.vilkårsteg as string;

  return (
    <VStack className={styles.inngangsvilkårSteg}>
      <List title="Vilkår">
        {vilkår.map((vilkår) => (
          <List.Item
            key={vilkår.url}
            icon={<PuzzlePieceIcon width="1.5em" height="1.5em" />}
          >
            <Link
              className={vilkårsteg === vilkår.url ? styles.aktivtSteg : ''}
              href={`/behandling/${behandlingId}/inngangsvilkar/${vilkår.url}`}
            >
              {vilkår.tittel}
            </Link>
          </List.Item>
        ))}
      </List>
      <List title="Beregning">
        <List.Item icon={<PuzzlePieceIcon width="1.5em" height="1.5em" />}>
          <Link
            className={vilkårsteg === 'stonadsdager' ? styles.aktivtSteg : ''}
            href={`/behandling/${behandlingId}/inngangsvilkar/stonadsdager`}
          >
            Stønadsdager
          </Link>
        </List.Item>
      </List>
    </VStack>
  );
};

export default InngangsvilkårSidemeny;
