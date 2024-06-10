import { List, VStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import styles from './InngangsvilkårSteg.module.css';
import { useRouter } from 'next/router';

const vilkår = [
  { tittel: 'Alder', url: 'alder' },
  { tittel: 'Søknadstidspunkt', url: 'soknadstidspunkt' },
  { tittel: 'Tiltaksdeltagelse', url: 'tiltaksdeltagelse' },
  { tittel: 'KVP og Intro', url: 'kvpintro' },
  { tittel: 'Institusjonsopphold', url: 'institusjonsopphold' },
  { tittel: 'Andre ytelser', url: 'andreytelser' },
];

const InngangsvilkårSteg = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const behandlingsteg = router.query.behandlingsteg as string;

  return (
    <VStack className={styles.inngangsvilkårSteg}>
      <List title="Vilkår">
        {vilkår.map((vilkår) => (
          <List.Item
            key={vilkår.url}
            icon={
              <CheckmarkCircleFillIcon
                width="1.5em"
                height="1.5em"
                color="var(--a-icon-success)"
              />
            }
          >
            <Link
              className={behandlingsteg === vilkår.url ? styles.aktivtSteg : ''}
              href={`/behandling/${behandlingId}/inngangsvilkar/${vilkår.url}`}
            >
              {vilkår.tittel}
            </Link>
          </List.Item>
        ))}
      </List>
      <List title="Beregning">
        <List.Item
          icon={
            <CheckmarkCircleFillIcon
              width="1.5em"
              height="1.5em"
              color="var(--a-icon-success)"
            />
          }
        >
          <Link
            className={
              behandlingsteg === 'stonadsdager' ? styles.aktivtSteg : ''
            }
            href={`/behandling/${behandlingId}/inngangsvilkar/stonadsdager`}
          >
            Stønadsdager
          </Link>
        </List.Item>
      </List>
    </VStack>
  );
};

export default InngangsvilkårSteg;
