import { Accordion, Alert, Button, DatePicker, Radio, RadioGroup, Select, useRangeDatepicker } from '@navikt/ds-react';
import { SaksopplysningTable } from '../vilkår-accordions/SaksopplysningTable';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React, { useState } from 'react';
import { Saksopplysning, SaksopplysningInnDTO } from '../../types/NyBehandling';
import styles from './Accordion.module.css';

interface InngangsvilkårTabProps {
    saksopplysninger: SaksopplysningInnDTO[];
}

export const InngangsvilkårTab = ({ saksopplysninger }: InngangsvilkårTabProps) => {
    return (
        <SøknadLayout>
            <Alert variant="info">Det er noe greier her</Alert>
            <div style={{ padding: '1em' }} />

            <Accordion variant="neutral">
                {saksopplysninger.map((saksopplysning) => {
                    return (
                        <>
                            <Accordion.Item style={{ background: '#FFFFFF' }}>
                                <Accordion.Header>{saksopplysning.vilkårTittel}</Accordion.Header>
                                <Accordion.Content className={styles.accordionContent}>
                                    <SaksopplysningTable
                                        utfall={saksopplysning.utfall}
                                        fom={saksopplysning.fom}
                                        tom={saksopplysning.tom}
                                        kilde={saksopplysning.kilde}
                                        detaljer={saksopplysning.detaljer}
                                        fakta={saksopplysning.fakta}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                            <div style={{ marginTop: '0.5rem' }} />
                        </>
                    );
                })}
            </Accordion>
        </SøknadLayout>
    );
};
