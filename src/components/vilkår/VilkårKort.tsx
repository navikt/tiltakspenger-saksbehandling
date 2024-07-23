import { BodyShort, HStack, Table, VStack } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { Periode } from '../../types/Periode';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import styles from './Vilkår.module.css';

interface VilkårKortProps {
  saksopplysningsperiode: Periode;
  kilde: string;
  utfall: string | null;
  vilkårTittel: string;
  grunnlag: string;
  grunnlagHeader: string;
}

const VilkårKort = ({
  saksopplysningsperiode,
  kilde,
  utfall,
  grunnlag,
  grunnlagHeader,
}: VilkårKortProps) => (
  <>
    <HStack className={styles.container}>
      <VStack className={styles.avklartSaksopplysning}>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col">{grunnlagHeader}</Table.HeaderCell>
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
              <Table.DataCell>{grunnlag}</Table.DataCell>
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
        <BodyShort spacing>
          {`${grunnlagHeader}:`} <b>{grunnlag}</b>
        </BodyShort>
        <BodyShort spacing>
          Kilde: <b>{kilde}</b>
        </BodyShort>
      </VStack>
    </HStack>
  </>
);

export default VilkårKort;
