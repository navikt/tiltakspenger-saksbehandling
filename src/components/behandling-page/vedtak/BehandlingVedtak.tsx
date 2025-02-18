import { Heading } from '@navikt/ds-react';
import { BehandlingBegrunnelse } from './begrunnelse/BehandlingBegrunnelse';
import { BehandlingResultat } from './resultat/BehandlingResultat';
import { BehandlingVedtaksBrev } from './brev/BehandlingVedtaksBrev';
import { BehandlingVedtakKnapper } from './send-til-beslutter/BehandlingVedtakKnapper';
import { Separator } from '../../separator/Separator';

import style from './BehandlingVedtak.module.css';

export const BehandlingVedtak = () => {
    return (
        <div className={style.outer}>
            <div className={style.inner}>
                <Heading size={'medium'} level={'1'} className={style.header}>
                    {'Vedtak'}
                </Heading>
                <BehandlingBegrunnelse />
                <BehandlingResultat />
                <Separator />
                <BehandlingVedtaksBrev />
                <BehandlingVedtakKnapper />
            </div>
        </div>
    );
};
