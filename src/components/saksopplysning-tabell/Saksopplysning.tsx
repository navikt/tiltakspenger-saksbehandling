import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button } from '@navikt/ds-react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { formatPeriode } from '../../utils/date';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { FaktaDTO, SaksopplysningInnDTO } from '../../types/Behandling';

interface SaksopplysningProps {
  behandlingId: string;
  behandlingsperiode: {
    fom: string;
    tom: string;
  };
  lesevisning: Lesevisning;
  saksopplysningDTO: SaksopplysningInnDTO;
}

export const Saksopplysning = ({
  saksopplysningDTO,
  behandlingId,
  behandlingsperiode,
  lesevisning,
}: SaksopplysningProps) => {
  const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

  const { vilkårTittel, vilkårFlateTittel, utfall, fom, tom, kilde, detaljer } =
    saksopplysningDTO;

  const velgFaktaTekst = (typeSaksopplysning: string, fakta: FaktaDTO) => {
    if (typeSaksopplysning === 'HAR_YTELSE') return fakta.harYtelse;
    if (typeSaksopplysning === 'HAR_IKKE_YTELSE') return fakta.harIkkeYtelse;
    return 'Ikke innhentet';
  };

  const håndterLukkRedigering = () => {
    onÅpneRedigering(false);
  };

  return (
    <>
      <Table.Row key={vilkårTittel}>
        <Table.DataCell>
          <UtfallIkon utfall={utfall} />
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{vilkårFlateTittel}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>
            {velgFaktaTekst(
              saksopplysningDTO.typeSaksopplysning,
              saksopplysningDTO.fakta,
            )}
          </BodyShort>
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
          {lesevisning.kanEndre && (
            <Button
              onClick={() => onÅpneRedigering(!åpneRedigering)}
              variant="tertiary"
              iconPosition="left"
              icon={<PencilIcon />}
              aria-label="hidden"
            />
          )}
        </Table.DataCell>
      </Table.Row>
      {åpneRedigering && lesevisning.kanEndre && (
        <Table.Row>
          <Table.DataCell colSpan={7} style={{ padding: '0' }}>
            <RedigeringSkjema
              fakta={saksopplysningDTO.fakta}
              behandlingId={behandlingId}
              vilkårTittel={vilkårTittel}
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
