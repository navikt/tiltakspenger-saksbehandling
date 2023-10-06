import { Accordion, Alert } from '@navikt/ds-react';
import { SaksopplysningTable } from '../vilkår-accordions/SaksopplysningTable';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React from 'react';
import {FaktaDTO, SaksopplysningInnDTO} from '../../types/NyBehandling';
import styles from './Accordion.module.css';

interface InngangsvilkårTabProps {
    saksopplysninger: SaksopplysningInnDTO[];
}

const velgFaktaTekst = (typeSaksopplysning: string, fakta: FaktaDTO) => {
    if (typeSaksopplysning === "HAR_YTELSE") return fakta.harYtelse
    if (typeSaksopplysning === "HAR_IKKE_YTELSE") return fakta.harIkkeYtelse
    return "Ikke innhentet"
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
                                        vilkår={saksopplysning.vilkårTittel}
                                        utfall={saksopplysning.utfall}
                                        fom={saksopplysning.fom}
                                        tom={saksopplysning.tom}
                                        kilde={saksopplysning.kilde}
                                        detaljer={saksopplysning.detaljer}
                                        fakta={velgFaktaTekst(saksopplysning.typeSaksopplysning, saksopplysning.fakta)}
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
