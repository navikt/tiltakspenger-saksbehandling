import { Button } from '@navikt/ds-react';
import { useRef } from 'react';
import router from 'next/router';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { papirsøknadUrl } from '~/utils/urls';

type Props = {
    saksnummer: string;
    harVedtak: boolean;
};

export const OpprettPapirsøknad = ({ saksnummer }: Props) => {
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
                {'Registrere papirsøknad'}
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                lukkModal={lukkModal}
                tittel={'Registrer papirsøknad?'}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        type={'button'}
                        onClick={() => {
                            router.push(papirsøknadUrl(saksnummer));
                        }}
                    >
                        {`Registrer papirsøknad`}
                    </Button>
                }
            />
        </>
    );
};
