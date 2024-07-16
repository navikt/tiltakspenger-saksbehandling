import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button } from '@navikt/ds-react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { SaksopplysningInnDTO } from '../../types/Behandling';
import { Periode } from '../../types/Periode';

interface SaksopplysningProps {
  behandlingId: string;
  vurderingsperiode: Periode;
  saksopplysningDTO: SaksopplysningInnDTO;
}

export const Saksopplysning = ({
  saksopplysningDTO,
  behandlingId,
  vurderingsperiode,
}: SaksopplysningProps) => {
  const [åpneRedigering, onÅpneRedigering] = useState<boolean>(false);

  const {
    saksopplysning,
    saksopplysningTittel,
    utfall,
    periode,
    kilde,
    detaljer,
  } = saksopplysningDTO;

  const håndterLukkRedigering = () => {
    onÅpneRedigering(false);
  };

  return (
    <>
      <Table.Row key={saksopplysning}>
        <Table.DataCell>
          <UtfallIkon utfall={utfall} />
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{saksopplysningTittel}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>
            {utfall === 'OPPFYLT'
              ? 'Søker mottar ikke ytelsen'
              : 'Søker mottar ytelsen'}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>
            {periode
              ? periodeTilFormatertDatotekst({
                  fra: periode.fra,
                  til: periode.til,
                })
              : '-'}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{kilde ? kilde : '-'}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>{detaljer ? detaljer : '-'}</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <Button
            onClick={() => onÅpneRedigering(!åpneRedigering)}
            variant="tertiary"
            iconPosition="left"
            icon={<PencilIcon />}
            aria-label="hidden"
          />
        </Table.DataCell>
      </Table.Row>
      {åpneRedigering && (
        <Table.Row>
          <Table.DataCell colSpan={8} style={{ padding: '0' }}>
            <RedigeringSkjema
              behandlingId={behandlingId}
              saksopplysning={saksopplysning}
              saksopplysningTittel={saksopplysningTittel}
              håndterLukkRedigering={håndterLukkRedigering}
              vurderingsperiode={vurderingsperiode}
            />
          </Table.DataCell>
        </Table.Row>
      )}
    </>
  );
};
