import { HStack, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { BehandlingLagreKnapp } from '~/lib/rammebehandling/felles/handlinger/lagre/BehandlingLagreKnapp';
import { BehandlingLagringProps } from '~/lib/rammebehandling/felles/handlinger/lagre/useHentBehandlingLagringProps';
import { RammebehandlingSendTilBeslutning } from '~/lib/rammebehandling/felles/handlinger/send-til-beslutning/RammebehandlingSendTilBeslutning';
import { BehandlingValideringVarsler } from '~/lib/rammebehandling/felles/handlinger/varsler/BehandlingValideringVarsler';
import {
    BehandlingLagringResultat,
    BehandlingLagringVarsler,
} from '~/lib/rammebehandling/felles/handlinger/varsler/BehandlingLagringVarsler';

type Props = {
    behandling: Rammebehandling;
    lagringProps: BehandlingLagringProps;
};

export const RammebehandlingSaksbehandlerHandlinger = ({ behandling, lagringProps }: Props) => {
    const [valideringResultat, setValideringResultat] = useState<ValideringResultat>({
        errors: [],
        warnings: [],
    });

    const [lagringResultat, setLagringResultat] = useState<BehandlingLagringResultat>('ok');

    const { validerOgHentLagringDTO, validerVedtak, isDirty } = lagringProps;

    const validerOgHentDTO = () => {
        const { valideringResultat, vedtakDTO } = validerOgHentLagringDTO('lagring');
        setValideringResultat(valideringResultat);
        return vedtakDTO;
    };

    const validerTilBeslutning = () => {
        const valideringResultat = validerVedtak('tilBeslutning');
        setValideringResultat(valideringResultat);
        return valideringResultat.errors.length === 0;
    };

    return (
        <VStack gap={'space-16'}>
            <VStack gap={'space-8'}>
                <BehandlingValideringVarsler resultat={valideringResultat} />
                <BehandlingLagringVarsler isDirty={isDirty} resultat={lagringResultat} />
            </VStack>

            <HStack gap={'space-16'} justify={'end'}>
                <BehandlingLagreKnapp
                    behandling={behandling}
                    hentVedtakDTO={validerOgHentDTO}
                    onSuccess={() => {
                        setLagringResultat('ok');
                    }}
                    onError={(error) => {
                        setLagringResultat(error);
                    }}
                />
                <RammebehandlingSendTilBeslutning
                    behandling={behandling}
                    valider={validerTilBeslutning}
                    valideringResultat={valideringResultat}
                    disabled={valideringResultat.errors.length > 0 || isDirty}
                />
            </HStack>
        </VStack>
    );
};
