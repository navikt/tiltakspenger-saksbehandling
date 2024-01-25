import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button } from '@navikt/ds-react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { formatPeriode } from '../../utils/date';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

interface SaksopplysningProps {
  vilkår: string;
  vilkårFlateTittel: string;
  utfall: string;
  fom: string;
  tom: string;
  kilde: string;
  detaljer: string;
  fakta: string;
  behandlingId: string;
  behandlingsperiode: {
    fom: string;
    tom: string;
  };
  lesevisning: Lesevisning;
}

export const Saksopplysning = ({
  vilkår,
  vilkårFlateTittel,
  utfall,
  fom,
  tom,
  kilde,
  detaljer,
  fakta,
  behandlingId,
  behandlingsperiode,
  lesevisning,
}: SaksopplysningProps) => {
  const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

  const håndterLukkRedigering = () => {
    onÅpneRedigering(false);
  };

  return (
    <>
      <Table.Row key={vilkår}>
        <Table.DataCell>
          <UtfallIkon utfall={utfall} />
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{vilkårFlateTittel}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{fakta}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>
            {fom && tom ? formatPeriode({ fra: fom, til: tom }) : '-'}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{kilde ? kilde : '-'}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{detaljer ? detaljer : '-'}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          {
            <Button
              onClick={() => onÅpneRedigering(!åpneRedigering)}
              variant="tertiary"
              iconPosition="left"
              icon={<PencilIcon />}
              aria-label="hidden"
            />
          }
        </Table.DataCell>
      </Table.Row>
      {åpneRedigering && (
        <Table.Row>
          <Table.DataCell colSpan={7} style={{ padding: '0' }}>
            <RedigeringSkjema
              behandlingId={behandlingId}
              vilkår={vilkår}
              vilkårFlateTittel={vilkårFlateTittel}
              håndterLukkRedigering={håndterLukkRedigering}
              behandlingsperiode={behandlingsperiode}
              vilkårsperiode={{ fom: fom, tom: tom }}
            />
          </Table.DataCell>
        </Table.Row>
      )}
    </>
  );
};
