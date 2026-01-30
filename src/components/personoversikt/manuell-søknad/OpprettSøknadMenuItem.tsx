import { ActionMenu, Button } from '@navikt/ds-react';
import { useRef } from 'react';
import router from 'next/router';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { registrerSoknadUrl } from '~/utils/urls';
import { TasklistSaveIcon } from '@navikt/aksel-icons';

type Props = {
    saksnummer: string;
    harVedtak: boolean;
};

export const OpprettSøknadMenuItem = ({ saksnummer }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const lukkModal = () => {
        modalRef.current?.close();
    };

    return (
        <>
            <ActionMenu.Item
                icon={<TasklistSaveIcon aria-hidden />}
                onClick={() => modalRef.current?.showModal()}
            >
                {'Registrer søknad manuelt'}
            </ActionMenu.Item>
            <BekreftelsesModal
                modalRef={modalRef}
                lukkModal={lukkModal}
                tittel={'Registrer søknad manuelt?'}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        type={'button'}
                        onClick={() => {
                            router.push(registrerSoknadUrl(saksnummer));
                        }}
                    >
                        {`Registrer søknad manuelt`}
                    </Button>
                }
            />
        </>
    );
};
