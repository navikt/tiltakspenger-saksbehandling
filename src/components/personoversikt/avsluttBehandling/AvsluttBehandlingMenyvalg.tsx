import { ActionMenu } from '@navikt/ds-react';
import React from 'react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';

type AvsluttBehandlingMenyvalgProps = {
    button?: {
        text?: string;
    };
    onSuccess?: () => void;
    setVisAvsluttBehandlingModal: (vis: boolean) => void;
};

const AvsluttBehandlingMenyvalg = (props: AvsluttBehandlingMenyvalgProps) => {
    return (
        <ActionMenu.Item
            variant={'danger'}
            icon={<XMarkOctagonIcon aria-hidden />}
            onClick={() => props.setVisAvsluttBehandlingModal(true)}
        >
            {props.button?.text ?? 'Avslutt behandling'}
        </ActionMenu.Item>
    );
};

export default AvsluttBehandlingMenyvalg;
