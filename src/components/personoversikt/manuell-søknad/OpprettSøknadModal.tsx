import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { registrerSoknadUrl } from '~/utils/urls';

type Props = {
    saksnummer: string;
    åpen: boolean;
    setÅpen: (åpen: boolean) => void;
};

export const OpprettSøknadModal = ({ saksnummer, åpen, setÅpen }: Props) => {
    const lukkModal = () => {
        setÅpen(false);
    };

    return (
        <>
            <BekreftelsesModal
                åpen={åpen}
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
