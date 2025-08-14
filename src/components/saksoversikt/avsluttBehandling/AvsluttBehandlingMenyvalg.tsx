import { ActionMenu } from '@navikt/ds-react';
import React from 'react';
import { AvsluttBehandlingProps } from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingProps';
import { BehandlingForOversiktData, BehandlingStatus } from '~/types/BehandlingTypes';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { eierBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';

export const visAvsluttBehandlingMenyvalg = (
    behandling: BehandlingForOversiktData,
    innloggetSaksbehandler: Saksbehandler,
    behandlingKanAvsluttes: boolean,
) => {
    const erRelevantMenyValgForStatus = behandling.status === BehandlingStatus.UNDER_BEHANDLING;
    return (
        behandlingKanAvsluttes &&
        erRelevantMenyValgForStatus &&
        eierBehandling(behandling, innloggetSaksbehandler)
    );
};

type AvsluttBehandlingMenyvalgProps = AvsluttBehandlingProps & {
    behandlingStatus: BehandlingStatus;
    skalVises: boolean;
    setVisAvsluttBehandlingModal: (vis: boolean) => void;
};

// Litt duplikat av AvsluttBehandlingKnapp, men for å vise i menyvalg
const AvsluttBehandlingMenyvalg = (props: AvsluttBehandlingMenyvalgProps) => {
    //TODO - her burde vi nok ha litt mer context rundt hva som er valgt
    if (!props.søknadId && !props.behandlingId) {
        return <div>Teknisk feil: Enten søknadsId, eller behandlingsId må være satt</div>;
    }

    if (
        !props.skalVises &&
        props.behandlingStatus !== BehandlingStatus.SØKNAD &&
        props.behandlingStatus !== BehandlingStatus.UNDER_BEHANDLING
    ) {
        return null;
    }

    return (
        <ActionMenu.Item
            variant={'danger'}
            icon={<XMarkOctagonIcon aria-hidden />}
            onClick={() => props.setVisAvsluttBehandlingModal(true)}
        >
            {props.button?.text ?? props.modal?.tittel ?? 'Avslutt behandling'}
        </ActionMenu.Item>
    );
};

export default AvsluttBehandlingMenyvalg;
