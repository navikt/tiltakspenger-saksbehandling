import { List, VStack } from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import Link from 'next/link';
import styles from './InngangsvilkårSteg.module.css';

const InngangsvilkårSteg = () => (
  <VStack className={styles.inngangsvilkårSteg}>
    <List title="Vilkår">
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
          href={{
            pathname: '/behandling/[behandlingId]/inngangsvilkar/alder',
            query: { behandlingId: 'beh_01HSGGERVWP41BZ7ZFGKAXS20H' },
          }}
        >
          Alder
        </Link>
      </List.Item>
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
          href={{
            pathname:
              '/behandling/[behandlingId]/inngangsvilkar/soknadstidspunkt',
            query: { behandlingId: 'beh_01HSGGERVWP41BZ7ZFGKAXS20H' },
          }}
        >
          Søknadstidspunkt
        </Link>
      </List.Item>
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
          href={{
            pathname:
              '/behandling/[behandlingId]/inngangsvilkar/tiltaksdeltagelse',
            query: { behandlingId: 'beh_01HSGGERVWP41BZ7ZFGKAXS20H' },
          }}
        >
          Tiltaksdeltagelse
        </Link>
      </List.Item>
    </List>
  </VStack>
);

export default InngangsvilkårSteg;
