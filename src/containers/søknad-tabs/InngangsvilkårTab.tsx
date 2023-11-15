import { Accordion, Alert, VStack } from '@navikt/ds-react';
import { SaksopplysningTable } from '../vilkår-accordions/SaksopplysningTable';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React from 'react';
import { FaktaDTO, Kategori } from '../../types/Behandling';

interface InngangsvilkårTabProps {
    behandlingId: string;
    kategoriserteSaksopplysninger: Kategori[];
}

const velgFaktaTekst = (typeSaksopplysning: string, fakta: FaktaDTO) => {
    if (typeSaksopplysning === 'HAR_YTELSE') return fakta.harYtelse;
    if (typeSaksopplysning === 'HAR_IKKE_YTELSE') return fakta.harIkkeYtelse;
    return 'Ikke innhentet';
};
export const InngangsvilkårTab = ({ behandlingId, kategoriserteSaksopplysninger }: InngangsvilkårTabProps) => {
    return (
        <SøknadLayout>
            <Alert variant="info" style={{ marginBottom: '1em' }}>
                Det er noe greier her
            </Alert>
            <Accordion indent={false}>
                <VStack>
                    {kategoriserteSaksopplysninger.map((kategori) => {
                        return (
                            <Accordion.Item key={kategori.kategoriTittel} style={{ background: '#FFFFFF' }}>
                                <Accordion.Header>{kategori.kategoriTittel}</Accordion.Header>
                                <Accordion.Content>
                                    {kategori.saksopplysninger.map((saksopplysning) => (
                                        <SaksopplysningTable
                                            key={saksopplysning.vilkårTittel}
                                            vilkår={saksopplysning.vilkårTittel}
                                            utfall={saksopplysning.utfall}
                                            fom={saksopplysning.fom}
                                            tom={saksopplysning.tom}
                                            kilde={saksopplysning.kilde}
                                            detaljer={saksopplysning.detaljer}
                                            fakta={velgFaktaTekst(
                                                saksopplysning.typeSaksopplysning,
                                                saksopplysning.fakta
                                            )}
                                            behandlingId={behandlingId}
                                        />
                                    ))}
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </VStack>
            </Accordion>
        </SøknadLayout>
    );
};
