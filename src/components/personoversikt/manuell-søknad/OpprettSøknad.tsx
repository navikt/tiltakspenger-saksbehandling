import { Button } from '@navikt/ds-react';
import { useRef } from 'react';
import router from 'next/router';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { registrerSoknadUrl } from '~/utils/urls';

type Props = {
    saksnummer: string;
    harVedtak: boolean;
};

export const OpprettSøknad = ({ saksnummer }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const lukkModal = () => {
        modalRef.current?.close();
    };

    return (
        <>
            <Button
                size={'small'}
                variant={'secondary'}
                type={'button'}
                onClick={() => modalRef.current?.showModal()}
            >
                {'Registrer søknad manuelt'}
            </Button>
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
