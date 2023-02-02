import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import Accordion from '../accordion/Accordion';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';
import InstitusjonsoppholdTable from '../institusjonsopphold-table/InstitusjonsoppholdTable';
import BarnetilleggTable from '../barnetillegg/BarnetilleggTable';
import TiltakspengerYtelserTable from '../tiltakspenger-ytelser-table/TiltakspengerYtelserTable';
import Behandling from '../../types/Behandling';
import { formatDate } from '../../utils/date';
import HarStatligYtelseMelding from '../har-statlig-ytelse-melding/HarStatligYtelseMelding';
import HarIntroprogramDeltakelseMelding from '../har-introprogram-deltakelse-melding/HarIntroprogramDeltakelseMelding';
import HarPensjonsordningMelding from '../har-pensjonsordning-melding/HarPensjonsordningMelding';
import HarInstitusjonsoppholdMelding from '../har-institusjonsopphold-melding/HarInstitusjonsoppholdMelding';
import HarLønnsinntektMelding from '../har-lønnsinntekt-melding/HarLønnsinntektMelding';
import HarKvpDeltakelseMelding from '../har-kvp-deltakelse-melding/HarKvpDeltakelseMelding';
import styles from './VilkårsvurderingDetails.module.css';
import AlderVilkårsvurderingTable from '../alder-vilkårsvurdering-table/AlderVilkårsvurderingTable';
import Personalia from '../../types/Personalia';
import BrukerFyller18ÅrIPeriodenMelding from '../bruker-fyller-18-år-i-perioden-melding/BrukerFyller18ÅrIPeriodenMelding';
import BrukerUnder18ÅrIHelePeriodenMelding from '../bruker-under-18-år-i-hele-perioden-melding/BrukerUnder18ÅrIHelePeriodenMelding';
import dayjs from 'dayjs';
import SøknadsVarslinger from '../søknads-varslinger/SøknadsVarslinger';
import VilkårsVarslinger from '../vilkårs-varslinger/VilkårsVarslinger';

interface VilkårsvurderingDetailsProps {
    behandling: Behandling;
    personalia: Personalia;
}

const VilkårsvurderingDetails = ({ behandling, personalia: { fødselsdato } }: VilkårsvurderingDetailsProps) => {
    const {
        tiltakspengerYtelser,
        statligeYtelser,
        kommunaleYtelser,
        pensjonsordninger,
        lønnsinntekt,
        institusjonsopphold,
        barnetillegg,
        alderVilkårsvurdering,
        søknad: { fritekst },
    } = behandling;

    return (
        <div className={styles.vilkårsvurderingDetails}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <SøknadsVarslinger fritekst={fritekst} />
            <VilkårsVarslinger behandling={behandling} fødselsdato={fødselsdato} />
            <div style={{ marginTop: '4rem' }}>
                <Accordion title="Alder (§3)">
                    <AlderVilkårsvurderingTable
                        alderVilkårsvurderinger={alderVilkårsvurdering}
                        fødselsdato={fødselsdato}
                    />
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
        </div>
    );
};

export default VilkårsvurderingDetails;
