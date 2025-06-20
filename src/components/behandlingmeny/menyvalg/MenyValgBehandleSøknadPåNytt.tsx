import router from 'next/router';
import { useBehandleSøknadPåNytt } from '~/components/behandlingmeny/behandle-søknad-på-nytt/useBehandleSøknadPåNytt';
import { FileResetIcon } from '@navikt/aksel-icons';
import { ActionMenu } from '@navikt/ds-react';

type props = {
    sakId: string;
    søknadId: string;
};

const MenyValgBehandleSøknadPåNytt = ({ sakId, søknadId }: props) => {
    const { behandleSøknadPåNytt } = useBehandleSøknadPåNytt(sakId, søknadId);

    const opprettSøknadPåNytt = () => {
        behandleSøknadPåNytt().then((behandling) => {
            if (behandling) {
                router.push(`/behandling/${behandling.id}`);
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
