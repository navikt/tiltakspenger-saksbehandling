import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import ParagraphExpand from '../paragraph-expand/ParagraphExpand';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import styles from './VilkårsvurderingDetails.module.css';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';
import InstitusjonsoppholdTable from '../institusjonsopphold-table/InstitusjonsoppholdTable';
import BarnetilleggTable from '../barnetillegg/BarnetilleggTable';
import TiltakspengerYtelserTable from '../tiltakspenger-ytelser-table/TiltakspengerYtelserTable';
import Behandling from '../../types/Behandling';
import DagpengerAlert from '../dagpenger-alert/DagpengerAlert';
import AapAlert from '../aap-alert/AapAlert';

interface VilkårsvurderingDetailsProps {
    søknadResponse: Behandling;
}

const VilkårsvurderingDetails = ({
    søknadResponse: {
        tiltakspengerYtelser,
        statligeYtelser,
        kommunaleYtelser,
        pensjonsordninger,
        lønnsinntekt,
        institusjonsopphold,
        barnetillegg,
    },
}: VilkårsvurderingDetailsProps) => {
    const dagpengePerioder = statligeYtelser.finnDagpengeperioder();
    const aapPerioder = statligeYtelser.finnAapPerioder();
    return (
        <div className={styles.vilkårsvurderingDetails}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <Alert variant="info" fullWidth style={{ marginTop: '1rem' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden
            </Alert>
            {dagpengePerioder.length > 0 && <DagpengerAlert perioder={dagpengePerioder} />}
            {aapPerioder.length > 0 && <AapAlert perioder={aapPerioder} />}
            <div style={{ marginTop: '4rem' }}>
                <ParagraphExpand title="Tiltakspenger (§7)">
                    <TiltakspengerYtelserTable tiltakspengerYtelser={tiltakspengerYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Statlige ytelser (§7)">
                    <StatligeYtelserTable statligeYtelser={statligeYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Kommunale ytelser (§7)">
                    <KommunaleYtelserContent kommunaleYtelser={kommunaleYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Pensjonsordninger (§7)">
                    <PensjonsordningerTable pensjonsordninger={pensjonsordninger} />
                </ParagraphExpand>
                <ParagraphExpand title="Lønnsinntekt (§8)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <LønnsinntekterTable lønnsinntekt={lønnsinntekt}></LønnsinntekterTable>
                </ParagraphExpand>
                <ParagraphExpand title="Institusjon (§9)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <InstitusjonsoppholdTable institusjonsopphold={institusjonsopphold} />
                </ParagraphExpand>
                <ParagraphExpand title="Barnetillegg (§3)">
                    <span>Foreløpig viser vi bare data fra søknaden</span>
                    <BarnetilleggTable barnetillegg={barnetillegg} />
                </ParagraphExpand>
            </div>
        </div>
    );
};

export default VilkårsvurderingDetails;
