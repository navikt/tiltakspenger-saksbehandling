import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { useState } from 'react';
import SettBehandlingPåVentModal from '~/lib/_felles/modaler/SettBehandlingPåVentModal';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { personoversiktUrl } from '~/utils/urls';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandling: Rammebehandling;
    disabled?: boolean;
};

export const BehandlingSettPåVent = ({ behandling, disabled }: Props) => {
    const [modalÅpen, setModalÅpen] = useState(false);

    const { sakId, id } = behandling;

    const {
        trigger: settBehandlingPåVent,
        isMutating: isSettBehandlingPåVentMutating,
        error: settBehandlingPåVentError,
    } = useFetchJsonFraApi<SakProps, SettBehandlingPåVentDTO>(
        `/sak/${sakId}/behandling/${id}/pause`,
        'POST',
    );

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
                                router.push(personoversiktUrl(oppdatertSak.saksnummer));
                            }
                        }),
                    isMutating: isSettBehandlingPåVentMutating,
                    error: settBehandlingPåVentError ?? null,
                }}
            />
        </>
    );
};

type SettBehandlingPåVentDTO = {
    sakId: Nullable<string>;
    behandlingId: Nullable<string>;
    begrunnelse: string;
    frist: Nullable<string>;
};
