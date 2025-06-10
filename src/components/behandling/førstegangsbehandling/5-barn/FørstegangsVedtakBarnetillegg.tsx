import { VedtakSeksjon } from '../../vedtak-layout/seksjon/VedtakSeksjon';
import { Heading, Radio, RadioGroup } from '@navikt/ds-react';
import {
    useFørstegangsVedtakSkjemaDispatch,
    useFørstegangsVedtakSkjema,
} from '../context/FørstegangsVedtakContext';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { BarnetilleggPerioder } from './perioder/BarnetilleggPerioder';
import { classNames } from '../../../../utils/classNames';
import { BarnetilleggBegrunnelse } from './begrunnelse/BarnetilleggBegrunnelse';
import { harSøktBarnetillegg } from '../../../../utils/behandling';
import { useFørstegangsbehandling } from '../../BehandlingContext';
import { Separator } from '../../../separator/Separator';

import style from './FørstegangsVedtakBarnetillegg.module.css';
import { BehandlingResultat } from '../../../../types/BehandlingTypes';

export const FørstegangsVedtakBarnetillegg = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    const { harBarnetillegg, resultat } = useFørstegangsVedtakSkjema();

    return (
        <div className={classNames(resultat !== BehandlingResultat.INNVILGELSE && style.skjult)}>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <Heading level={'3'} size={'xsmall'} className={style.header}>
                        {'Barnetillegg'}
                    </Heading>
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.Venstre>
                    <RadioGroup
                        legend={'Har det blitt søkt om barnetillegg?'}
                        size={'small'}
                        className={style.radioGroup}
                        defaultValue={harSøktBarnetillegg(behandling)}
                        readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                        onChange={(harSøkt: boolean) => {
                            dispatch({
                                type: 'setHarSøktBarnetillegg',
                                payload: { harSøkt },
                            });
                        }}
                    >
                        <Radio value={true}>{'Ja'}</Radio>
                        <Radio value={false}>{'Nei'}</Radio>
                    </RadioGroup>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon className={classNames(style.input, !harBarnetillegg && style.skjult)}>
                <BarnetilleggPerioder />
                <BarnetilleggBegrunnelse />
            </VedtakSeksjon>
            <Separator />
        </div>
    );
};
