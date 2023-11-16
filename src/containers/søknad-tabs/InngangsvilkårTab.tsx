import { Accordion, Alert, HStack, VStack } from '@navikt/ds-react';
import { SaksopplysningTable } from '../vilkår-accordions/SaksopplysningTable';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React from 'react';
import { Kategori } from '../../types/Behandling';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';

interface InngangsvilkårTabProps {
    behandlingId: string;
    kategoriserteSaksopplysninger: Kategori[];
}

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
                                <Accordion.Header>
                                    <HStack align={'center'} gap={'2'}>
                                        <UtfallIcon utfall={kategori.utfall} />
                                        {kategori.kategoriTittel}
                                    </HStack>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SaksopplysningTable
                                        saksopplysninger={kategori.saksopplysninger}
                                        behandlingId={behandlingId}
                                    />
                                </Accordion.Content>
                            </Accordion.Item>
                        );
                    })}
                </VStack>
            </Accordion>
        </SøknadLayout>
    );
};
