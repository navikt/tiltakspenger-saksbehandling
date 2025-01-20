import { Loader, Table } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '../../utils/date';
import {
    finnDeltagelsestatusTekst,
    lagFaktumTekst,
    lagFaktumTekstAvLivsopphold,
    lagUtfallstekst,
} from '../../utils/tekstformateringUtils';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

const VilkårsvurderingTable = () => {
    const { behandlingId } = useContext(BehandlingContext);
    const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    }

    const kravfrist = valgtBehandling.vilkårssett.kravfristVilkår;
    const tiltaksdeltagelse = valgtBehandling.vilkårssett.tiltakDeltagelseVilkår;
    const alder = valgtBehandling.vilkårssett.alderVilkår;
    const kvp = valgtBehandling.vilkårssett.kvpVilkår;
    const institusjonsopphold = valgtBehandling.vilkårssett.institusjonsoppholdVilkår;
    const intro = valgtBehandling.vilkårssett.introVilkår;
    const andreYtelser = valgtBehandling.vilkårssett.livsoppholdVilkår;

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
                        Frist for framsetting av krav {kravfrist.vilkårLovreferanse.paragraf}
                    </Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => <UtfallIkon utfall={kravfrist.samletUtfall} />}
                            text={lagUtfallstekst(kravfrist.samletUtfall)}
                        />
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
                        Tiltaksdeltagelse {tiltaksdeltagelse.vilkårLovreferanse.paragraf}
                    </Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => (
                                <UtfallIkon utfall={tiltaksdeltagelse.samletUtfall} />
                            )}
                            text={lagUtfallstekst(tiltaksdeltagelse.samletUtfall)}
                        />
                    </Table.DataCell>
                    <Table.DataCell>
                        {periodeTilFormatertDatotekst(tiltaksdeltagelse.utfallperiode)}
                    </Table.DataCell>
                    <Table.DataCell>
                        {`Tiltaksstatus er "${finnDeltagelsestatusTekst(tiltaksdeltagelse.avklartSaksopplysning.status)}"`}
                    </Table.DataCell>
                </Table.Row>
                {/* Aldersvilkår */}
                <Table.Row>
                    <Table.HeaderCell>Alder {alder.vilkårLovreferanse.paragraf}</Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => <UtfallIkon utfall={alder.samletUtfall} />}
                            text={lagUtfallstekst(alder.samletUtfall)}
                        />
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
                        Andre livsopphold {andreYtelser.vilkårLovreferanse.paragraf}
                    </Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => <UtfallIkon utfall={andreYtelser.samletUtfall} />}
                            text={lagUtfallstekst(andreYtelser.samletUtfall)}
                        />
                    </Table.DataCell>
                    <Table.DataCell>
                        {periodeTilFormatertDatotekst(andreYtelser.utfallperiode)}
                    </Table.DataCell>
                    <Table.DataCell>
                        {andreYtelser.avklartSaksopplysning
                            ? lagFaktumTekstAvLivsopphold(
                                  andreYtelser.avklartSaksopplysning.harLivsoppholdYtelser,
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
                        <IkonMedTekst
                            iconRenderer={() => <UtfallIkon utfall={kvp.samletUtfall} />}
                            text={lagUtfallstekst(kvp.samletUtfall)}
                        />
                    </Table.DataCell>
                    <Table.DataCell>
                        {periodeTilFormatertDatotekst(
                            kvp.avklartSaksopplysning.periodeMedDeltagelse.periode,
                        )}
                    </Table.DataCell>
                    <Table.DataCell>
                        {lagFaktumTekst(kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse)}
                    </Table.DataCell>
                </Table.Row>
                {/* Introduksjonsprogrammet */}
                <Table.Row>
                    <Table.HeaderCell>
                        Introduksjonsprogrammet {intro.vilkårLovreferanse.paragraf}
                    </Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => <UtfallIkon utfall={intro.samletUtfall} />}
                            text={lagUtfallstekst(intro.samletUtfall)}
                        />
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
                        Institusjonsopphold {institusjonsopphold.vilkårLovreferanse.paragraf}
                    </Table.HeaderCell>
                    <Table.DataCell>
                        <IkonMedTekst
                            iconRenderer={() => (
                                <UtfallIkon utfall={institusjonsopphold.samletUtfall} />
                            )}
                            text={lagUtfallstekst(institusjonsopphold.samletUtfall)}
                        />
                    </Table.DataCell>
                    <Table.DataCell>
                        {periodeTilFormatertDatotekst(
                            institusjonsopphold.avklartSaksopplysning.periodeMedOpphold.periode,
                        )}
                    </Table.DataCell>
                    <Table.DataCell>
                        {lagFaktumTekst(
                            institusjonsopphold.avklartSaksopplysning.periodeMedOpphold.opphold,
                        )}
                    </Table.DataCell>
                </Table.Row>
            </Table.Body>
        </Table>
    );
};

export default VilkårsvurderingTable;
