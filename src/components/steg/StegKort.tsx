import { PencilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import { formatPeriode } from '../../utils/date';
import { RedigeringSkjema } from '../saksopplysning-tabell/RedigeringSkjema';
import { useState } from 'react';
import { Periode } from '../../types/Periode';

interface StegKortProps {
  behandlingId: string;
  vurderingsperiode: Periode;
  saksopplysningsperiode: Periode;
  kilde: string;
  utfall: string;
  vilkår: string;
  vilkårTittel: string;
}

const StegKort = ({
  behandlingId,
  vurderingsperiode,
  saksopplysningsperiode,
  kilde,
  utfall,
  vilkår,
  vilkårTittel,
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
          }}
        >
          <BodyShort size="medium" spacing>
            <b>Er søker over 18 år?</b> {utfall}
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Periode:</b>{' '}
            {saksopplysningsperiode
              ? formatPeriode({
                  fra: saksopplysningsperiode.fra,
                  til: saksopplysningsperiode.til,
                })
              : '-'}
          </BodyShort>
          <BodyShort size="medium" spacing>
            <b>Kilde:</b> {kilde}
          </BodyShort>
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
              onClick={() => settÅpenRedigering(!åpenRedigering)}
            >
              Legg til saksopplysning
            </Button>
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
