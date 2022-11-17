import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import ParagraphExpand from '../paragraph-expand/ParagraphExpand';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import styles from './VilkårsvurderingDetails.module.css';
import { SøknadResponse } from '../../types/Søknad';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';
import InstitusjonsoppholdTable from '../institusjonsopphold-table/InstitusjonsoppholdTable';
import BarnetilleggTable from '../barnetillegg/BarnetilleggTable';

interface VilkårsvurderingDetailsProps {
    søknadResponse: SøknadResponse;
}

const VilkårsvurderingDetails = (props: VilkårsvurderingDetailsProps) => {
    return (
        <div className={styles.vilkårsvurderingDetails}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <Alert variant="info" fullWidth style={{ width: '100%' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden
            </Alert>
            <div style={{ marginTop: '4rem' }}>
                <ParagraphExpand title="Statlige ytelser (§7)">
                    <StatligeYtelserTable
                        vilkårsvurderinger={props.søknadResponse.statligeYtelser.vilkårsvurderinger}
                    />
                </ParagraphExpand>
                <ParagraphExpand title="Kommunale ytelser (§7)">
                    <KommunaleYtelserContent kommunaleYtelser={props.søknadResponse.kommunaleYtelser} />
                </ParagraphExpand>
                <ParagraphExpand title="Pensjonsordninger (§7)">
                    <PensjonsordningerTable pensjonsordninger={props.søknadResponse.pensjonsordninger} />
                </ParagraphExpand>
                <ParagraphExpand title="Lønnsinntekt (§8)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <LønnsinntekterTable lønnsinntekt={props.søknadResponse.lønnsinntekt}></LønnsinntekterTable>
                </ParagraphExpand>
                <ParagraphExpand title="Institusjon (§9)">
                    <span>Foreløpig har vi ikke alle opplysninger</span>
                    <InstitusjonsoppholdTable institusjonsopphold={props.søknadResponse.institusjonsopphold} />
                </ParagraphExpand>
                <ParagraphExpand title="Barnetillegg (§3)">
                    <span>Foreløpig viser vi bare data fra søknaden</span>
                    <BarnetilleggTable barnetillegg={props.søknadResponse.barnetillegg} />
                </ParagraphExpand>
            </div>
        </div>
    );
};

export default VilkårsvurderingDetails;
