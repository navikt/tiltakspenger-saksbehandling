import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { Alert } from '@navikt/ds-react';
import { classNames } from '../../../../utils/classNames';

import style from './FørstegangsVedtakTiltak.module.css';
import { TiltakPerioder } from './perioder/TiltakPerioder';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { Separator } from '../../../separator/Separator';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { deltarPaFlereTiltakMedStartOgSluttdato } from '../../../../utils/behandling';

export const FørstegangsVedtakTiltak = () => {
    const { behandling } = useFørstegangsbehandling();
    const flereTiltak = deltarPaFlereTiltakMedStartOgSluttdato(behandling);
    const { resultat } = useFørstegangsVedtakSkjema();
    return (
        flereTiltak && (
            <div className={classNames(resultat !== 'innvilget' && style.skjult)}>
                <VedtakSeksjon>
                    <VedtakSeksjon.Venstre>
                        <Alert variant={'warning'} size={'small'}>
                            Flere tiltak registrert på bruker. Velg tiltak(ene) som bruker skal
                            vurderes for og periodene som gjelder. Det du velger brukes for
                            regnskapsføring og statistikk, og påvirker ikke vedtaket.
                        </Alert>
                    </VedtakSeksjon.Venstre>
                </VedtakSeksjon>

                <VedtakSeksjon className={classNames(style.input)}>
                    <TiltakPerioder />
                </VedtakSeksjon>

                <Separator />
            </div>
        )
    );
};
