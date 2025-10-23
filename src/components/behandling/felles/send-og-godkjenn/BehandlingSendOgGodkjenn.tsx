import {
    useRolleForBehandling,
    useSaksbehandler,
} from '~/context/saksbehandler/SaksbehandlerContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, HStack, VStack } from '@navikt/ds-react';
import { BehandlingAvslutt } from '~/components/behandling/felles/send-og-godkjenn/avslutt/BehandlingAvslutt';
import { BehandlingSendTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/BehandlingSendTilBeslutning';
import { BehandlingGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/BehandlingGodkjenn';
import { BehandlingLagreKnapp } from '~/components/behandling/felles/send-og-godkjenn/lagre/BehandlingLagreKnapp';
import { ValideringResultat } from '~/types/Validering';
import React, { useState } from 'react';
import { BehandlingValideringVarsler } from '~/components/behandling/felles/send-og-godkjenn/varsler/BehandlingValideringVarsler';
import {
    BehandlingLagringResultat,
    BehandlingLagringVarsler,
} from '~/components/behandling/felles/send-og-godkjenn/varsler/BehandlingLagringVarsler';
import { BehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { BehandlingSettPåVent } from '~/components/behandling/felles/send-og-godkjenn/sett-på-vent/BehandlingSettPåVent';
import { BehandlingGjenoppta } from '~/components/behandling/felles/send-og-godkjenn/gjenoppta/BehandlingGjenoppta';
import { skalKunneGjenopptaBehandling } from '~/utils/tilganger';
import { formaterTidspunkt } from '~/utils/date';

import style from './BehandlingSendOgGodkjenn.module.css';
import { Rammebehandling, Behandlingsstatus } from '~/types/Behandling';

type Props = {
    behandling: Rammebehandling;
    lagringProps: BehandlingLagringProps;
};

export const BehandlingSendOgGodkjenn = ({ behandling, lagringProps }: Props) => {
    const rolleForBehandling = useRolleForBehandling(behandling);
    const { innloggetSaksbehandler } = useSaksbehandler();

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

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erBeslutter = rolleForBehandling === SaksbehandlerRolle.BESLUTTER;

    const kanAvslutteBehandling =
        (behandling.status === Behandlingsstatus.KLAR_TIL_BEHANDLING ||
            behandling.status === Behandlingsstatus.UNDER_BEHANDLING) &&
        behandling.avbrutt === null &&
        erSaksbehandler;

    const kanGjenopptaBehandling = skalKunneGjenopptaBehandling(behandling, innloggetSaksbehandler);

    if (!erSaksbehandler && !erBeslutter) {
        return null;
    }

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                {erSaksbehandler && (
                    <VStack className={style.varsler} gap={'2'}>
                        <BehandlingValideringVarsler resultat={valideringResultat} />
                        <BehandlingLagringVarsler isDirty={isDirty} resultat={lagringResultat} />
                    </VStack>
                )}
                <HStack justify="space-between" className={style.knapper}>
                    <HStack gap={'2'}>
                        {kanAvslutteBehandling && <BehandlingAvslutt behandling={behandling} />}
                        {!kanGjenopptaBehandling && (
                            <BehandlingSettPåVent behandling={behandling} disabled={isDirty} />
                        )}
                    </HStack>
                    {kanGjenopptaBehandling ? (
                        <BehandlingGjenoppta behandling={behandling} />
                    ) : erSaksbehandler ? (
                        <HStack gap={'5'}>
                            {isDirty && (
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
                            )}
                            <BehandlingSendTilBeslutning
                                behandling={behandling}
                                valider={validerTilBeslutning}
                                disabled={valideringResultat.errors.length > 0 || isDirty}
                            />
                        </HStack>
                    ) : (
                        <BehandlingGodkjenn behandling={behandling} />
                    )}
                </HStack>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <Alert
                    variant={'info'}
                    inline={true}
                    size={'small'}
                >{`Sist lagret: ${formaterTidspunkt(behandling.sistEndret)}`}</Alert>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
