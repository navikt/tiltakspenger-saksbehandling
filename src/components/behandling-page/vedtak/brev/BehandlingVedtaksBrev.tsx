import { Button, Textarea } from '@navikt/ds-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';

import style from './BehandlingVedtaksBrev.module.css';

type Props = {};

export const BehandlingVedtaksBrev = ({}: Props) => {
    return (
        <>
            <Textarea
                label={'Tekst til vedtaksbrev'}
                description={'Teksten vises i vedtaksbrevet til bruker.'}
                size={'small'}
                minRows={10}
            />
            <div className={style.knapper}>
                <Button size={'small'} variant={'secondary'} icon={<EnvelopeClosedIcon />}>
                    {'Forhåndsvis brev'}
                </Button>
                <Button variant={'primary'}>{'Send til beslutter'}</Button>
            </div>
        </>
    );
};
