import Behandling from '../../types/Behandling';
import { Accordion, AccordionItem } from '../accordion/Accordion';
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
            <Accordion>
                <AccordionItem title="Alder (§3)">
                    <AlderVilkårsvurderingTable
                        alderVilkårsvurderinger={alderVilkårsvurdering}
                        fødselsdato={fødselsdato}
                    />
                </AccordionItem>
                <AccordionItem title="Tiltakspenger (§7)">
                    <TiltakspengerYtelserTable tiltakspengerYtelser={tiltakspengerYtelser} />
                </AccordionItem>
                <AccordionItem title="Statlige ytelser (§7)">
                    <StatligeYtelserTable statligeYtelser={statligeYtelser} />
                </AccordionItem>
                <AccordionItem title="Kommunale ytelser (§7)">
                    <KommunaleYtelserContent kommunaleYtelser={kommunaleYtelser} />
                </AccordionItem>
                <AccordionItem title="Pensjonsordninger (§7)">
                    <PensjonsordningerTable pensjonsordninger={pensjonsordninger} />
                </AccordionItem>
                <AccordionItem title="Lønnsinntekt (§8)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <LønnsinntekterTable lønnsinntekt={lønnsinntekt}></LønnsinntekterTable>
                </AccordionItem>
                <AccordionItem title="Institusjon (§9)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <InstitusjonsoppholdTable institusjonsopphold={institusjonsopphold} />
                </AccordionItem>
                <AccordionItem title="Barnetillegg (§3)">
                    <span>Foreløpig viser vi bare data fra søknaden</span>
                    <BarnetilleggTable barnetillegg={barnetillegg} />
                </AccordionItem>
            </Accordion>
            {/* {fritekst && <Accordion title="Tilleggsopplysninger fra søknaden">{fritekst}</Accordion>} */}
        </div>
    );
}

export default VilkårAccordions;
