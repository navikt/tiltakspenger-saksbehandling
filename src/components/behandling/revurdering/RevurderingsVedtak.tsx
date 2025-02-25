import { Heading } from '@navikt/ds-react';
import { RevurderingStansSkjema } from './stans-skjema/RevurderingStansSkjema';

import style from './RevurderingsVedtak.module.css';

export const RevurderingsVedtak = () => {
    return (
        <>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering (stans)'}
            </Heading>
            <RevurderingStansSkjema />
        </>
    );
};
