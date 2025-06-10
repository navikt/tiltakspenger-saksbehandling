import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { Alert } from '@navikt/ds-react';
import { classNames } from '../../../../utils/classNames';

import style from './FørstegangsVedtakTiltak.module.css';
import { TiltakPerioder } from './perioder/TiltakPerioder';
import { useFørstegangsVedtakSkjema } from '../context/FørstegangsVedtakContext';
import { Separator } from '../../../separator/Separator';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode } from '../../../../utils/behandling';
import { BehandlingResultat } from '../../../../types/BehandlingTypes';

export const FørstegangsVedtakTiltak = () => {
    const { behandling } = useFørstegangsbehandling();
    const { behandlingsperiode: innvilgelsesPeriode } = useFørstegangsVedtakSkjema();
    const flereTiltak = deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode(
        behandling,
        innvilgelsesPeriode,
    );
    const { resultat } = useFørstegangsVedtakSkjema();
    return (
        flereTiltak && (
            <div
                className={classNames(resultat !== BehandlingResultat.INNVILGELSE && style.skjult)}
            >
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
