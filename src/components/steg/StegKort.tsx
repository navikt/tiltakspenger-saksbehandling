import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Table, VStack } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { RedigeringSkjema } from '../saksopplysning-tabell/RedigeringSkjema';
import { useState } from 'react';
import { Periode } from '../../types/Periode';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

interface StegKortProps {
  editerbar: boolean;
  behandlingId: string;
  vurderingsperiode: Periode;
  saksopplysningsperiode: Periode;
  kilde: string;
  utfall: string;
  vilkår: string;
  vilkårTittel: string;
  grunnlag: string;
  grunnlagHeader: string;
}

const StegKort = ({
  editerbar,
  behandlingId,
  vurderingsperiode,
  saksopplysningsperiode,
  kilde,
  utfall,
  vilkår,
  vilkårTittel,
  grunnlag,
  grunnlagHeader,
}: StegKortProps) => {
  const [åpenRedigering, settÅpenRedigering] = useState<boolean>(false);

  return (
    <>
      <HStack
        style={{
          background: '#FFFFFF',
          border: '2px #9099A5 solid',
          borderRadius: '4px',
          padding: '1em',
        }}
      >
        <VStack
          style={{
            width: '50%',
            paddingRight: '1em',
          }}
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">
                  {grunnlagHeader}
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Kilde</Table.HeaderCell>
                <Table.HeaderCell scope="col">Vilkår oppfylt</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row key="ye">
                <Table.DataCell>
                  {periodeTilFormatertDatotekst(saksopplysningsperiode)}
                </Table.DataCell>
                <Table.DataCell>{grunnlag}</Table.DataCell>
                <Table.DataCell>{kilde}</Table.DataCell>
                <Table.DataCell>
                  <UtfallIkon utfall={utfall} />
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </VStack>
        <VStack
          style={{
            borderLeft: '1px #000000 solid',
            paddingLeft: '2em',
            width: '50%',
          }}
        >
          <BodyShort size="large" weight="semibold" spacing>
            Registerdata
          </BodyShort>
          <BodyShort size="medium" spacing>
            {`${grunnlagHeader}:`} <b>{grunnlag}</b>
          </BodyShort>
          <BodyShort size="medium" spacing>
            Kilde: <b>{kilde}</b>
          </BodyShort>
          <HStack justify="end">
            {editerbar && (
              <Button
                variant="secondary"
                size="small"
                iconPosition="right"
                icon={<PencilIcon />}
                onClick={() => settÅpenRedigering(!åpenRedigering)}
              >
                Legg til saksopplysning
              </Button>
            )}
          </HStack>
        </VStack>
      </HStack>
      {åpenRedigering && (
        <RedigeringSkjema
          saksopplysning={vilkår}
          saksopplysningTittel={vilkårTittel}
          håndterLukkRedigering={() => settÅpenRedigering(false)}
          behandlingId={behandlingId}
          vurderingsperiode={vurderingsperiode}
        />
      )}
    </>
  );
};

export default StegKort;
