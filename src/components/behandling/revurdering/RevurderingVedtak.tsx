import { Heading } from '@navikt/ds-react';
import { RevurderingVedtakProvider } from './RevurderingVedtakContext';
import React from 'react';
import { RevurderingStansSkjema } from './stans-skjema/RevurderingStansSkjema';

import style from './RevurderingVedtak.module.css';

export const RevurderingVedtak = () => {
    return (
        <RevurderingVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering (stans)'}
            </Heading>
            <RevurderingStansSkjema />
        </RevurderingVedtakProvider>
    );
};
