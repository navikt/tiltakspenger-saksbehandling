import { Accordion, Alert, HStack, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React from 'react';
import { Kategori } from '../../types/Behandling';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';

interface InngangsvilkårTabProps {
    behandlingId: string;
    kategoriserteSaksopplysninger: Kategori[];
    periodeFom: string;
    periodeTom: string;
}

export const InngangsvilkårTab = ({
    behandlingId,
    kategoriserteSaksopplysninger,
    periodeFom,
    periodeTom,
}: InngangsvilkårTabProps) => {
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
                                        <UtfallIcon utfall={kategori.samletUtfall} />
                                        {kategori.kategoriTittel}
                                    </HStack>
                                </Accordion.Header>
                                <Accordion.Content>
                                    <SaksopplysningTabell
                                        saksopplysninger={kategori.saksopplysninger}
                                        behandlingId={behandlingId}
                                        periodeFom={periodeFom}
                                        periodeTom={periodeTom}
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
