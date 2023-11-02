import { Behandling } from '../../types/Behandling';
import AlderVilkårsvurderingTable from '../../components/alder-vilkårsvurdering-table/AlderVilkårsvurderingTable';
import BarnetilleggTable from '../../components/barnetillegg/BarnetilleggTable';
import InstitusjonsoppholdTable from '../../components/institusjonsopphold-table/InstitusjonsoppholdTable';
import KommunaleYtelserContent from '../../components/kommunale-ytelser-content/KommunaleYtelserContent';
import LønnsinntekterTable from '../../components/lønnsinntekter-table/LønnsinntekterTable';
import PensjonsordningerTable from '../../components/pensjonsordninger-table/PensjonsordningerTable';
import StatligeYtelserTable from '../../components/statlige-ytelser-table/StatligeYtelserTable';
import TiltakspengerYtelserTable from '../../components/tiltakspenger-ytelser-table/TiltakspengerYtelserTable';
import { Accordion } from '@navikt/ds-react';

interface VilkårAccordionsProps {
    behandling: Behandling;
    fødselsdato: string;
    fritekst?: string;
}

function VilkårAccordions({ behandling, fødselsdato, fritekst }: VilkårAccordionsProps) {
    const {
        alderVilkårsvurdering,
        tiltakspengerYtelser,
        statligeYtelser,
        kommunaleYtelser,
        pensjonsordninger,
        lønnsinntekt,
        institusjonsopphold,
        barnetillegg,
    } = behandling;

    return (
        <div style={{ marginTop: '4rem' }}>
            <Accordion>
                <Accordion.Item title="Alder (§3)">
                    <AlderVilkårsvurderingTable
                        alderVilkårsvurderinger={alderVilkårsvurdering}
                        fødselsdato={fødselsdato}
                    />
                </Accordion.Item>
                <Accordion.Item title="Tiltakspenger (§7)">
                    <TiltakspengerYtelserTable tiltakspengerYtelser={tiltakspengerYtelser} />
                </Accordion.Item>
                <Accordion.Item title="Statlige ytelser (§7)">
                    <StatligeYtelserTable statligeYtelser={statligeYtelser} />
                </Accordion.Item>
                <Accordion.Item title="Kommunale ytelser (§7)">
                    <KommunaleYtelserContent kommunaleYtelser={kommunaleYtelser} />
                </Accordion.Item>
                <Accordion.Item title="Pensjonsordninger (§7)">
                    <PensjonsordningerTable pensjonsordninger={pensjonsordninger} />
                </Accordion.Item>
                <Accordion.Item title="Lønnsinntekt (§8)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <LønnsinntekterTable lønnsinntekt={lønnsinntekt}></LønnsinntekterTable>
                </Accordion.Item>
                <Accordion.Item title="Institusjon (§9)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <InstitusjonsoppholdTable institusjonsopphold={institusjonsopphold} />
                </Accordion.Item>
                <Accordion.Item title="Barnetillegg (§3)">
                    <span>Foreløpig viser vi bare data fra søknaden</span>
                    <BarnetilleggTable barnetillegg={barnetillegg} />
                </Accordion.Item>
                {fritekst && <Accordion.Item title="Tilleggsopplysninger fra søknaden">{fritekst}</Accordion.Item>}
            </Accordion>
        </div>
    );
}

export default VilkårAccordions;
