import { List, VStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, TasklistIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import styles from './InngangsvilkårSteg.module.css';
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
        <List.Item
          key={'oppsummering'}
          icon={<TasklistIcon title="a11y-title" fontSize="1.5rem" />}
        >
          <Link
            className={
              behandlingsteg === 'oppsummering' ? styles.aktivtSteg : ''
            }
            href={`/behandling/${behandlingId}/inngangsvilkar/oppsummering`}
          >
            Oppsummering
          </Link>
        </List.Item>
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
