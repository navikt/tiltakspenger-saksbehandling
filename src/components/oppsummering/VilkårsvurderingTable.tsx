import { Table } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import UtfallstekstMedIkon from '../vilkår/UtfallstekstMedIkon';
import {
  formaterDatotekst,
  periodeTilFormatertDatotekst,
} from '../../utils/date';
import { lagFaktumTekst } from '../../utils/tekstformateringUtils';

const VilkårsvurderingTable = () => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling } = useHentBehandling(behandlingId);

  const alder = valgtBehandling.vilkårsett.alderVilkår;
  const kvp = valgtBehandling.vilkårsett.kvpVilkår;
  const institusjonsopphold =
    valgtBehandling.vilkårsett.institusjonsoppholdVilkår;
  const intro = valgtBehandling.vilkårsett.introVilkår;
  const livsopphold = valgtBehandling.vilkårsett.livsoppholdVilkår;

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
        {/* Aldersvilkår */}
        <Table.Row>
          <Table.HeaderCell>
            Alder {alder.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon samletUtfall={alder.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(alder.vurderingsperiode)}
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
            {<UtfallstekstMedIkon samletUtfall={livsopphold.samletUtfall} />}
          </Table.DataCell>
          <Table.DataCell>
            {periodeTilFormatertDatotekst(livsopphold.vurderingsPeriode)}
          </Table.DataCell>
          <Table.DataCell>
            {livsopphold.avklartSaksopplysning.harLivsoppholdYtelser
              ? 'Søker har andre livsopphold'
              : 'Søker har ikke andre livsopphold'}
          </Table.DataCell>
        </Table.Row>
        {/* KVP */}
        <Table.Row>
          <Table.HeaderCell>
            Kvalifiseringsprogrammet {kvp.vilkårLovreferanse.paragraf}
          </Table.HeaderCell>
          <Table.DataCell>
            {<UtfallstekstMedIkon samletUtfall={kvp.samletUtfall} />}
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
            {<UtfallstekstMedIkon samletUtfall={intro.samletUtfall} />}
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
            {
              <UtfallstekstMedIkon
                samletUtfall={institusjonsopphold.samletUtfall}
              />
            }
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
