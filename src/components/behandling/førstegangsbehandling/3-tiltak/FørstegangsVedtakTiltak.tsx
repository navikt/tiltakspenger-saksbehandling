import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { Alert } from '@navikt/ds-react';
import { classNames } from '../../../../utils/classNames';

import style from '../4-barn/FørstegangsVedtakBarnetillegg.module.css';
import { TiltakPerioder } from './perioder/TiltakPerioder';

export const FørstegangsVedtakTiltak = () => {
    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Alert variant={'warning'} size={'small'}>
                        Flere tiltak registrert på bruker. Velg tiltak(ene) som bruker skal vurderes
                        for og periodene som gjelder.
                    </Alert>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon className={classNames(style.input)}>
                <TiltakPerioder />
            </VedtakSeksjon>
        </>
    );
};
