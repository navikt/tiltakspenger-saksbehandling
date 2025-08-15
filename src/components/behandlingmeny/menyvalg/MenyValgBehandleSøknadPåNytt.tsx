import router from 'next/router';
import { useBehandleSøknadPåNytt } from '~/components/behandlingmeny/behandle-søknad-på-nytt/useBehandleSøknadPåNytt';
import { FileResetIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react';
import { SakId } from '~/types/SakTypes';
import { SøknadId } from '~/types/SøknadTypes';
import { behandlingUrl } from '~/utils/urls';

type Props = {
    sakId: SakId;
    søknadId: SøknadId;
};

const MenyValgBehandleSøknadPåNytt = ({ sakId, søknadId }: Props) => {
    const { behandleSøknadPåNytt } = useBehandleSøknadPåNytt(sakId, søknadId);

    const opprettSøknadPåNytt = () => {
        behandleSøknadPåNytt().then((behandling) => {
            if (behandling) {
                router.push(behandlingUrl(behandling));
            }
        });
    };

    return (
        <ActionMenu.Item icon={<FileResetIcon aria-hidden />} onClick={opprettSøknadPåNytt}>
            Behandle søknad på nytt
        </ActionMenu.Item>
    );
};

export default MenyValgBehandleSøknadPåNytt;
