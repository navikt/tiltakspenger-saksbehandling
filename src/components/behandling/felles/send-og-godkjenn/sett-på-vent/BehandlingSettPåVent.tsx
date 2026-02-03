import { Button } from '@navikt/ds-react';
import router from 'next/router';
import React, { useState } from 'react';
import { useSettBehandlingPåVent } from '~/components/behandlingmeny/useSettBehandlingPåVent';
import SettBehandlingPåVentModal from '~/components/modaler/SettBehandlingPåVentModal';
import { Rammebehandling } from '~/types/Rammebehandling';

type Props = {
    behandling: Rammebehandling;
    disabled?: boolean;
};

export const BehandlingSettPåVent = ({ behandling, disabled }: Props) => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const { settBehandlingPåVent, isSettBehandlingPåVentMutating, settBehandlingPåVentError } =
        useSettBehandlingPåVent(behandling.sakId, behandling.id);

    return (
        <>
            <Button
                variant={'tertiary'}
                size={'xsmall'}
                disabled={disabled}
                onClick={() => setModalÅpen(true)}
            >
                {'Sett på vent'}
            </Button>
            <SettBehandlingPåVentModal
                åpen={modalÅpen}
                onClose={() => setModalÅpen(false)}
                api={{
                    trigger: (begrunnelse) =>
                        settBehandlingPåVent({
                            sakId: behandling.sakId,
                            behandlingId: behandling.id,
                            begrunnelse: begrunnelse,
                        }).then((oppdaterBehandling) => {
                            if (oppdaterBehandling) {
                                setModalÅpen(false);
                                router.push(`/sak/${oppdaterBehandling.saksnummer}`);
                            }
                        }),
                    isMutating: isSettBehandlingPåVentMutating,
                    error: settBehandlingPåVentError ?? null,
                }}
            />
        </>
    );
};
