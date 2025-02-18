import { Button, Textarea } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';

import style from './BehandlingVedtaksBrev.module.css';

export const BehandlingVedtaksBrev = () => {
    return (
        <>
            <Textarea
                label={'Tekst til vedtaksbrev'}
                description={'Teksten vises i vedtaksbrevet til bruker.'}
                size={'small'}
                minRows={10}
            />
            <div className={style.knapper}>
                <Button size={'small'} variant={'secondary'} icon={<EnvelopeOpenIcon />}>
                    {'Forhåndsvis brev'}
                </Button>
                <Button variant={'primary'}>{'Send til beslutter'}</Button>
            </div>
        </>
    );
};
