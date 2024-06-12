import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button, Link } from '@navikt/ds-react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { formatPeriode } from '../../utils/date';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { SaksopplysningInnDTO } from '../../types/Behandling';
import { Periode } from '../../types/Periode';

interface SaksopplysningProps {
  behandlingId: string;
  vurderingsperiode: Periode;
  lesevisning: Lesevisning;
  saksopplysningDTO: SaksopplysningInnDTO;
}

export const Saksopplysning = ({
  saksopplysningDTO,
  behandlingId,
  vurderingsperiode,
  lesevisning,
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

  const hentLovDataURLen = (lovverk: string, paragraf: string) => {
    if (lovverk == 'Tiltakspengeforskriften')
      return `https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/${paragraf}`;
    if (lovverk == 'Arbeidsmarkedsloven')
      return `https://lovdata.no/dokument/NL/lov/2004-12-10-76/${paragraf}`;
    if (lovverk == 'Rundskriv om tiltakspenger' && paragraf == '§8')
      return `https://lovdata.no/nav/rundskriv/r76-13-02/${paragraf}#KAPITTEL_3-7`;
    return 'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286/';
  };

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
          <BodyShort>fakta</BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort>
            {periode
              ? formatPeriode({ fra: periode.fra, til: periode.til })
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
