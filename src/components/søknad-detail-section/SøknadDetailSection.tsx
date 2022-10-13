import React from 'react';
import Søknad from '../../types/Søknad';
import { Alert, Heading } from '@navikt/ds-react';
import ParagraphExpand from '../paragraph-expand/ParagraphExpand';
import styles from './SøknadDetailSection.module.css';
import StatligeYtelserTable from '../statlige-ytelser-table/StatligeYtelserTable';

interface SøknadDetailSectionProps {
    søknad: Søknad;
}

const SøknadDetailSection = (props: SøknadDetailSectionProps) => {
    return (
        <div className={styles.søknadDetailSection}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <p>{props.søknad.registrertTiltak.beskrivelse}</p>
            <Alert variant="info" fullWidth style={{ width: '100%' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden
            </Alert>
            <div style={{ marginTop: '4rem' }}>
                <ParagraphExpand title="Søknad om dagpenger (§7)">Test</ParagraphExpand>
                <ParagraphExpand title="Statlige ytelser (§7)">
                    <StatligeYtelserTable
                        rows={[
                            {
                                vedtak: 'Ja',
                                ytelse: 'Dagpenger',
                                periode: '-',
                                kilde: 'Arena',
                                detaljer: '5 dager igjen',
                            },
                            {
                                vedtak: 'Nei',
                                ytelse: 'Arbeidsavklaringspenger',
                                periode: '-',
                                kilde: 'Arena',
                                detaljer: '-',
                            },
                            {
                                vedtak: 'Nei',
                                ytelse: 'Tiltakspenger',
                                periode: '-',
                                kilde: 'Arena',
                                detaljer: '-',
                            },
                        ]}
                    />
                </ParagraphExpand>
                <ParagraphExpand title="Kommunale ytelser (§7)">Test</ParagraphExpand>
                <ParagraphExpand title="Pensjonsordninger (§7)">Test</ParagraphExpand>
                <ParagraphExpand title="Lønnsinntekt (§8)">Test</ParagraphExpand>
                <ParagraphExpand title="Institusjon (§9)">Test</ParagraphExpand>
            </div>
        </div>
    );
};

export default SøknadDetailSection;
