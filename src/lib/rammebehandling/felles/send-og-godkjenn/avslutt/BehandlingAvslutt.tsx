import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import AvbrytRammebehandlingModal from '~/lib/rammebehandling/modaler/AvbrytRammebehandlingModal';
import router from 'next/router';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useSak } from '~/lib/sak/SakContext';
import { personoversiktUrl } from '~/utils/urls';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { SakProps } from '~/lib/sak/SakTyper';

type Props = {
    behandling: Rammebehandling;
};

export const BehandlingAvslutt = ({ behandling }: Props) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    const { sak, setSak } = useSak();
    const { saksnummer } = sak;

    const { trigger, isMutating, error } = useFetchJsonFraApi<SakProps, AvsluttBehandlingDTO>(
        `sak/${saksnummer}/avbryt-aktiv-behandling`,
        'POST',
    );

    return (
        <>
            <Button
                variant={'tertiary'}
                type={'button'}
                size={'xsmall'}
                onClick={() => setVilAvslutteBehandling(true)}
            >
                {'Avslutt behandling'}
            </Button>
            {vilAvslutteBehandling && (
                <AvbrytRammebehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    onSubmit={(begrunnelse) => {
                        trigger({
                            behandlingId: behandling.id,
                            begrunnelse: begrunnelse,
                        }).then((sak) => {
                            setSak(sak);
                            router.push(personoversiktUrl(behandling.saksnummer));
                        });
                    }}
                    footer={{
                        isMutating,
                        error: error ?? null,
                        saksnummer: behandling.saksnummer,
                    }}
                />
            )}
        </>
    );
};

type AvsluttBehandlingDTO = {
    begrunnelse: string;
    behandlingId: RammebehandlingId;
};
