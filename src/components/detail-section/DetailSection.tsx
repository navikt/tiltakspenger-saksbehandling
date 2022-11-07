import React from 'react';
import { Alert, Heading } from '@navikt/ds-react';
import ParagraphExpand from '../paragraph-expand/ParagraphExpand';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';
import styles from './DetailSection.module.css';
import { SøknadResponse } from '../../types/Søknad';
import KommunaleYtelserContent from '../kommunale-ytelser-content/KommunaleYtelserContent';
import PensjonsordningerTable from '../pensjonsordninger-table/PensjonsordningerTable';
import LønnsinntekterTable from '../lønnsinntekter-table/LønnsinntekterTable';

interface DetailSectionProps {
    søknadResponse: SøknadResponse;
}

const DetailSection = (props: DetailSectionProps) => {
    return (
        <div className={styles.søknadDetailSection}>
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
                <ParagraphExpand title="Institusjon (§9)">Test</ParagraphExpand>
            </div>
        </div>
    );
};

export default DetailSection;
