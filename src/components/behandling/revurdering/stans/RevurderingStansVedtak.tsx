import { Heading } from '@navikt/ds-react';
import { RevurderingStansVedtakProvider } from './RevurderingStansVedtakContext';
import React from 'react';
import { RevurderingStansSend } from './4-send/RevurderingStansSend';
import { Separator } from '../../../separator/Separator';
import { RevurderingStansResultat } from './1-resultat/RevurderingStansResultat';
import { RevurderingStansBegrunnelse } from './2-begrunnelse/RevurderingStansBegrunnelse';
import { RevurderingStansBrev } from './3-brev/RevurderingStansBrev';

import style from './RevurderingStansVedtak.module.css';

export const RevurderingStansVedtak = () => {
    return (
        <RevurderingStansVedtakProvider>
            <Heading size={'medium'} level={'1'} className={style.heading}>
                {'Revurdering til stans av tiltakspenger'}
            </Heading>
            <RevurderingStansResultat />
            <RevurderingStansBegrunnelse />
            <Separator />
            <RevurderingStansBrev />
            <RevurderingStansSend />
        </RevurderingStansVedtakProvider>
    );
};
