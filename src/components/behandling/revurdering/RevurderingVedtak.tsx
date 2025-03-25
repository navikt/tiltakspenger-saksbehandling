import { Heading } from '@navikt/ds-react';
import { RevurderingVedtakProvider } from './RevurderingVedtakContext';
import React from 'react';
import { RevurderingStansSend } from './stans/4-send/RevurderingStansSend';

import style from './RevurderingVedtak.module.css';
import { Separator } from '../../separator/Separator';
import { RevurderingStansResultat } from './stans/1-resultat/RevurderingStansResultat';
import { RevurderingStansBegrunnelse } from './stans/2-begrunnelse/RevurderingStansBegrunnelse';
import { RevurderingStansBrev } from './stans/3-brev/RevurderingStansBrev';

export const RevurderingVedtak = () => {
    return (
        <RevurderingVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering til stans av tiltakspenger'}
            </Heading>
            <RevurderingStansResultat />
            <Separator />
            <RevurderingStansBegrunnelse />
            <Separator />
            <RevurderingStansBrev />
            <RevurderingStansSend />
        </RevurderingVedtakProvider>
    );
};
