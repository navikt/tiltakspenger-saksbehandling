import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../revurderingsmodal/Datovelger';
import { useState } from 'react';
import { classNames } from '../../../../utils/classNames';
import { VedtakResultat } from '../../../../types/VedtakTyper';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';

import style from './BehandlingResultat.module.css';

export const BehandlingResultat = () => {
    const [resultat, setResultat] = useState<VedtakResultat>();

    const { behandling } = useBehandling();

    const { deltagelseFraOgMed, deltagelseTilOgMed } =
        useBehandling().behandling.saksopplysninger.tiltaksdeltagelse;
    const { fraOgMed, tilOgMed } = behandling.søknad.tiltak;

    return (
        <div className={style.resultat}>
            <RadioGroup
                legend={'Resultat'}
                size={'small'}
                className={style.radioGroup}
                onChange={(verdi: VedtakResultat) => {
                    setResultat(verdi);
                }}
            >
                <Radio value={'innvilget' satisfies VedtakResultat}>{'Innvilgelse'}</Radio>
                <Radio value={'avslag' satisfies VedtakResultat}>{'Avslag'}</Radio>
            </RadioGroup>
            <div
                className={classNames(style.datovelgere, resultat !== 'innvilget' && style.skjult)}
            >
                <Datovelger
                    onDateChange={() => console.log('Endre fra dato')}
                    label={'Innvilgelse f.o.m'}
                    defaultSelected={new Date(deltagelseFraOgMed ?? fraOgMed)}
                    size={'small'}
                />
                <Datovelger
                    onDateChange={() => console.log('Endre til dato')}
                    label={'Innvilgelse t.o.m'}
                    defaultSelected={new Date(deltagelseTilOgMed ?? tilOgMed)}
                    size={'small'}
                />
            </div>
        </div>
    );
};
