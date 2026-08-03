import router from 'next/router';
import { FileResetIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react';
import { SakId } from '~/lib/sak/SakTyper';
import { behandlingUrl } from '~/utils/urls';
import { SøknadId } from '~/types/Søknad';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';

type Props = {
    sakId: SakId;
    søknadId: SøknadId;
};

export const BehandleSøknadPåNyttValg = ({ sakId, søknadId }: Props) => {
    const { trigger } = useFetchJsonFraApi<Søknadsbehandling>(
        `/sak/${sakId}/soknad/${søknadId}/behandling/ny-behandling`,
        'POST',
    );

    const opprettSøknadPåNytt = () => {
        trigger().then((behandling) => {
            if (behandling) {
                router.push(behandlingUrl(behandling));
            }
        });
    };

    return (
        <ActionMenu.Item icon={<FileResetIcon aria-hidden />} onClick={opprettSøknadPåNytt}>
            {'Behandle søknad på nytt'}
        </ActionMenu.Item>
    );
};
