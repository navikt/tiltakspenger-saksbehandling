import Behandling from '../../types/Behandling';
import Accordion from '../accordion/Accordion';
import AlderVilkårsvurderingTable from '../alder-vilkårsvurdering-table/AlderVilkårsvurderingTable';
import BarnetilleggTable from '../barnetillegg/BarnetilleggTable';
import InstitusjonsoppholdTable from '../institusjonsopphold-table/InstitusjonsoppholdTable';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import TiltakspengerYtelserTable from '../tiltakspenger-ytelser-table/TiltakspengerYtelserTable';

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
            <Accordion title="Alder (§3)">
                <AlderVilkårsvurderingTable alderVilkårsvurderinger={alderVilkårsvurdering} fødselsdato={fødselsdato} />
            </Accordion>
            <Accordion title="Tiltakspenger (§7)">
                <TiltakspengerYtelserTable tiltakspengerYtelser={tiltakspengerYtelser} />
            </Accordion>
            <Accordion title="Statlige ytelser (§7)">
                <StatligeYtelserTable statligeYtelser={statligeYtelser} />
            </Accordion>
            <Accordion title="Kommunale ytelser (§7)">
                <KommunaleYtelserContent kommunaleYtelser={kommunaleYtelser} />
            </Accordion>
            <Accordion title="Pensjonsordninger (§7)">
                <PensjonsordningerTable pensjonsordninger={pensjonsordninger} />
            </Accordion>
            <Accordion title="Lønnsinntekt (§8)">
                <span>Foreløpig har vi ikke alle opplysninger</span>
                <LønnsinntekterTable lønnsinntekt={lønnsinntekt}></LønnsinntekterTable>
            </Accordion>
            <Accordion title="Institusjon (§9)">
                <span>Foreløpig har vi ikke alle opplysninger</span>
                <InstitusjonsoppholdTable institusjonsopphold={institusjonsopphold} />
            </Accordion>
            <Accordion title="Barnetillegg (§3)">
                <span>Foreløpig viser vi bare data fra søknaden</span>
                <BarnetilleggTable barnetillegg={barnetillegg} />
            </Accordion>
            {fritekst && <Accordion title="Tilleggsopplysninger fra søknaden">{fritekst}</Accordion>}
        </div>
    );
}

export default VilkårAccordions;
