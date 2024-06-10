import { PencilIcon } from '@navikt/aksel-icons';
import { Table, BodyShort, Button, Link } from '@navikt/ds-react';
import { RedigeringSkjema } from './RedigeringSkjema';
import { useState } from 'react';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { formatPeriode } from '../../utils/date';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { FaktaDTO, SaksopplysningInnDTO } from '../../types/Behandling';
import { velgFaktaTekst } from '../../utils/velgFaktaTekst';

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

  const {
    vilkårTittel,
    vilkårFlateTittel,
    utfall,
    fom,
    tom,
    kilde,
    detaljer,
    vilkårLovReferense,
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
          {vilkårLovReferense.map((lov, index) => {
            return (
              <BodyShort key={index}>
                <Link
                  href={hentLovDataURLen(lov.lovverk, lov.paragraf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginBottom: '0.5em' }}
                >
                  {lov.paragraf}
                </Link>
              </BodyShort>
            );
          })}
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
