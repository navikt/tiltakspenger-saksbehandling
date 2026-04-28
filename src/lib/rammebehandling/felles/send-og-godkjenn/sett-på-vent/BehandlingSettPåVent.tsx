import { Button } from '@navikt/ds-react';
import router from 'next/router';
import React, { useState } from 'react';
import { useSettBehandlingPåVent } from '~/lib/behandling-felles/behandlingmeny/useSettBehandlingPåVent';
import SettBehandlingPåVentModal from '~/lib/_felles/modaler/SettBehandlingPåVentModal';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { personoversiktUrl } from '~/utils/urls';

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
                    trigger: (begrunnelse, frist) =>
                        settBehandlingPåVent({
                            sakId: behandling.sakId,
                            behandlingId: behandling.id,
                            begrunnelse: begrunnelse,
                            frist: frist,
                        }).then((oppdatertSak) => {
                            if (oppdatertSak) {
                                setModalÅpen(false);
                                router.push(personoversiktUrl(oppdatertSak));
                            }
                        }),
                    isMutating: isSettBehandlingPåVentMutating,
                    error: settBehandlingPåVentError ?? null,
                }}
            />
        </>
    );
};
