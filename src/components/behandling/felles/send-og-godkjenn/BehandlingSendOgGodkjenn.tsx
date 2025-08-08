import { BehandlingData, BehandlingStatus } from '~/types/BehandlingTypes';
import {
    useRolleForBehandling,
    useSaksbehandler,
} from '~/context/saksbehandler/SaksbehandlerContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { HStack, VStack } from '@navikt/ds-react';
import AvsluttBehandlingKnapp from '~/components/behandlingmeny/menyvalg/AvsluttBehandlingKnapp';
import router from 'next/router';
import { BehandlingSendTilBeslutning } from '~/components/behandling/felles/send-og-godkjenn/send-til-beslutning/BehandlingSendTilBeslutning';
import { BehandlingGodkjenn } from '~/components/behandling/felles/send-og-godkjenn/godkjenn/BehandlingGodkjenn';
import { LagreBehandlingKnapp } from '~/components/behandling/felles/send-og-godkjenn/lagre/LagreBehandlingKnapp';
import { ValideringResultat } from '~/types/Validering';
import { useState } from 'react';
import { BehandlingValideringVarsler } from '~/components/behandling/felles/send-og-godkjenn/varsler/BehandlingValideringVarsler';
import {
    BehandlingLagringResultat,
    BehandlingLagringVarsler,
} from '~/components/behandling/felles/send-og-godkjenn/varsler/BehandlingLagringVarsler';
import { BehandlingLagringProps } from '~/components/behandling/felles/send-og-godkjenn/lagre/useHentBehandlingLagringProps';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import style from './BehandlingSendOgGodkjenn.module.css';

type Props = {
    behandling: BehandlingData;
    lagringProps: BehandlingLagringProps;
};

export const BehandlingSendOgGodkjenn = ({ behandling, lagringProps }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const rolleForBehandling = useRolleForBehandling(behandling);

    const { validerOgHentVedtakDTO, isDirty } = lagringProps;

    const [valideringResultat, setValideringResultat] = useState<ValideringResultat>({
        errors: [],
        warnings: [],
    });

    const [lagringResultat, setLagringResultat] = useState<BehandlingLagringResultat>('ok');

    const hentVedtakDTO = () => {
        const { valideringResultat, vedtakDTO } = validerOgHentVedtakDTO();
        setValideringResultat(valideringResultat);
        return vedtakDTO;
    };

    const kanAvslutteBehandling =
        (behandling.status === BehandlingStatus.KLAR_TIL_BEHANDLING ||
            behandling.status === BehandlingStatus.UNDER_BEHANDLING) &&
        behandling.avbrutt === null &&
        behandling.saksbehandler === innloggetSaksbehandler.navIdent;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <VStack className={style.varsler} gap={'2'}>
                        <BehandlingValideringVarsler resultat={valideringResultat} />
                        <BehandlingLagringVarsler isDirty={isDirty} resultat={lagringResultat} />
                    </VStack>
                )}
                <HStack justify="space-between" className={style.knapper}>
                    {kanAvslutteBehandling && (
                        <AvsluttBehandlingKnapp
                            saksnummer={behandling.saksnummer}
                            behandlingsId={behandling.id}
                            button={{
                                size: 'medium',
                            }}
                            onSuccess={() => {
                                router.push(`/sak/${behandling.saksnummer}`);
                            }}
                        />
                    )}
                    <HStack gap={'5'}>
                        {isDirty && (
                            <LagreBehandlingKnapp
                                behandling={behandling}
                                hentVedtakDTO={hentVedtakDTO}
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
                            hentVedtakDto={hentVedtakDTO}
                            disabled={valideringResultat.errors.length > 0 || isDirty}
                        />
                    </HStack>
                </HStack>
                <div className={style.godkjentWrapper}>
                    <BehandlingGodkjenn behandling={behandling} />
                </div>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
