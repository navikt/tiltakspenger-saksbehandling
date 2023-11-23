import { Accordion, Alert, HStack, VStack } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../saksopplysning-tabell/SaksopplysningTabell';
import { SøknadLayout } from '../../layouts/soker/SøknadLayout';
import React from 'react';
import { Kategori } from '../../types/Behandling';
import { UtfallIcon } from '../../components/utfall-icon/UtfallIcon';
import {Lesevisning} from "../../utils/avklarLesevisning";

interface InngangsvilkårTabProps {
    behandlingId: string;
    kategoriserteSaksopplysninger: Kategori[];
    behandlingsperiode: {
        fom: string;
        tom: string;
    };
    lesevisning: Lesevisning;
}

interface Utfall {
    variant: "success" | "error" | "info";
    tekst: string;
}

const samletUtfall = (sakskategorier: Kategori[]): Utfall => {
    if (!!sakskategorier.find(kategori => kategori.samletUtfall === "KREVER_MANUELL_VURDERING")) {
        return {
            variant: "info",
            tekst: "Krever manuell saksbehandling"
        }
    }
    if (!!sakskategorier.find(kategori => kategori.samletUtfall === "IKKE_OPPFYLT")) {
        return {
            variant: "error",
            tekst: "Vilkår for tiltakspenger er ikke oppfylt for perioden"
        }
    }
    return {
        variant: "success",
        tekst: "Vilkår for tiltakspenger er oppfylt for perioden"
    }
}

export const InngangsvilkårTab = ({ behandlingId, kategoriserteSaksopplysninger, behandlingsperiode, lesevisning }: InngangsvilkårTabProps) => {
    return (
        <SøknadLayout>
            <Alert variant={samletUtfall(kategoriserteSaksopplysninger).variant} style={{ marginBottom: '1em' }}>
                {samletUtfall(kategoriserteSaksopplysninger).tekst}
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
                                        behandlingsperiode={behandlingsperiode}
                                        lesevisning = {lesevisning}
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
