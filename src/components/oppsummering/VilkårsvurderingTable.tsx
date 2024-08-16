import { Loader, Table } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import UtfallstekstMedIkon from '../vilkår/UtfallstekstMedIkon';
import {
  formaterDatotekst,
  periodeTilFormatertDatotekst,
} from '../../utils/date';
import {
  lagFaktumTekst,
  lagFaktumTekstAvLivsopphold,
} from '../../utils/tekstformateringUtils';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const VilkårsvurderingTable = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const kravfrist = valgtBehandling.vilkårssett.kravfristVilkår;
  const tiltakDeltagelse = valgtBehandling.vilkårssett.tiltakDeltagelseVilkår;
  const alder = valgtBehandling.vilkårssett.alderVilkår;
  const kvp = valgtBehandling.vilkårssett.kvpVilkår;
  const institusjonsopphold =
    valgtBehandling.vilkårssett.institusjonsoppholdVilkår;
  const intro = valgtBehandling.vilkårssett.introVilkår;
  const livsopphold = valgtBehandling.vilkårssett.livsoppholdVilkår;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
          <Table.HeaderCell scope="col">Vurdering</Table.HeaderCell>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {/* Frist for framsetting av krav */}
        <Table.Row>
          <Table.HeaderCell>
            Frist for framsetting av krav{' '}
            {kravfrist.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={kravfrist.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(kravfrist.utfallperiode)}
          </Table.DataCell>
          <Table.DataCell>
            {`Kravdato er ${formaterDatotekst(kravfrist.avklartSaksopplysning.kravdato)}`}
          </Table.DataCell>
        </Table.Row>
        {/* Tiltaksdeltagelse */}
        <Table.Row>
          <Table.HeaderCell>
            Tiltaksdeltagelse {tiltakDeltagelse.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={tiltakDeltagelse.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(tiltakDeltagelse.utfallperiode)}
          </Table.DataCell>
          <Table.DataCell>
            {`Tiltakstatus er "${tiltakDeltagelse.registerSaksopplysning.status}"`}
          </Table.DataCell>
        </Table.Row>
        {/* Aldersvilkår */}
        <Table.Row>
          <Table.HeaderCell>
            Alder {alder.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={alder.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(alder.utfallperiode)}
          </Table.DataCell>
          <Table.DataCell>
            {`Søker er født ${formaterDatotekst(alder.avklartSaksopplysning.fødselsdato)}`}
          </Table.DataCell>
        </Table.Row>
        {/* Andre livsopphold */}
        <Table.Row>
          <Table.HeaderCell>
            Andre livsopphold {livsopphold.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={livsopphold.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(livsopphold.utfallperiode)}
          </Table.DataCell>
          <Table.DataCell>
            {livsopphold.avklartSaksopplysning
              ? lagFaktumTekstAvLivsopphold(
                  livsopphold.avklartSaksopplysning.harLivsoppholdYtelser,
                )
              : 'Vilkåret er uavklart'}
          </Table.DataCell>
        </Table.Row>
        {/* KVP */}
        <Table.Row>
          <Table.HeaderCell>
            Kvalifiseringsprogrammet {kvp.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={kvp.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(
              kvp.avklartSaksopplysning.periodeMedDeltagelse.periode,
            )}
          </Table.DataCell>
          <Table.DataCell>
            {lagFaktumTekst(
              kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse,
            )}
          </Table.DataCell>
        </Table.Row>
        {/* Introduksjonsprogrammet */}
        <Table.Row>
          <Table.HeaderCell>
            Introduksjonsprogrammet {intro.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={intro.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(
              intro.avklartSaksopplysning.periodeMedDeltagelse.periode,
            )}
          </Table.DataCell>
          <Table.DataCell>
            {lagFaktumTekst(
              intro.avklartSaksopplysning.periodeMedDeltagelse.deltagelse,
            )}
          </Table.DataCell>
        </Table.Row>
        {/* Institusjonsopphold */}
        <Table.Row>
          <Table.HeaderCell>
            Institusjonsopphold{' '}
            {institusjonsopphold.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon utfall={institusjonsopphold.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(
              institusjonsopphold.avklartSaksopplysning.periodeMedOpphold
                .periode,
            )}
          </Table.DataCell>
          <Table.DataCell>
            {lagFaktumTekst(
              institusjonsopphold.avklartSaksopplysning.periodeMedOpphold
                .opphold,
            )}
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default VilkårsvurderingTable;
