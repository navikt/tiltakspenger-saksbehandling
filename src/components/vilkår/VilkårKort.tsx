import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { Periode } from '../../types/Periode';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import styles from './Vilkår.module.css';

interface Grunnlag {
  header: string;
  data: string;
}

interface VilkårKortProps {
  saksopplysningsperiode: Periode;
  kilde: string;
  utfall: string | null;
  vilkårTittel: string;
  grunnlag: Grunnlag[];
}

const VilkårKort = ({
  saksopplysningsperiode,
  kilde,
  utfall,
  grunnlag,
}: VilkårKortProps) => (
  <>
    <HStack className={styles.container}>
      <VStack className={styles.avklartSaksopplysning}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              {grunnlag.map((grunnlag) => (
                <Table.HeaderCell scope="col" key={grunnlag.header}>
                  {grunnlag.header}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
              {utfall && (
                <Table.HeaderCell scope="col">Vilkår oppfylt</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.DataCell>
                {periodeTilFormatertDatotekst(saksopplysningsperiode)}
              </Table.DataCell>
              {grunnlag.map((grunnlag) => (
                <Table.DataCell scope="col" key={grunnlag.data}>
                  {grunnlag.data}
                </Table.DataCell>
              ))}
              <Table.DataCell>{kilde}</Table.DataCell>
              {utfall && (
                <Table.DataCell>
                  <UtfallIkon utfall={utfall} />
                </Table.DataCell>
              )}
            </Table.Row>
          </Table.Body>
        </Table>
      </VStack>
      <VStack className={styles.registerdata}>
        <BodyShort size="large" weight="semibold" spacing>
          Registerdata
        </BodyShort>
        {grunnlag.map((grunnlag) => (
          <BodyShort spacing key={`regdata${grunnlag.header}`}>
            {`${grunnlag.header}:`} <b>{grunnlag.data}</b>
          </BodyShort>
        ))}
        <BodyShort spacing>
          Kilde: <b>{kilde}</b>
        </BodyShort>
      </VStack>
    </HStack>
  </>
);

export default VilkårKort;
