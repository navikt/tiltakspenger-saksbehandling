import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../revurderingsmodal/Datovelger';

import style from './BehandlingResultat.module.css';
import { BehandlingProps } from '../../../../types/BehandlingTypes';

type Props = {
    behandling: BehandlingProps;
};

export const BehandlingResultat = ({ behandling }: Props) => {
    const { deltagelseFraOgMed, deltagelseTilOgMed } =
        behandling.saksopplysninger.tiltaksdeltagelse;
    const { fraOgMed, tilOgMed } = behandling.søknad.tiltak;

    return (
        <div className={style.resultat}>
            <RadioGroup legend={'Resultat'} size={'small'} className={style.radioGroup}>
                <Radio value={'innvilgelse'}>{'Innvilgelse'}</Radio>
                <Radio value={'avslag'}>{'Avslag'}</Radio>
            </RadioGroup>
            <div className={style.datovelgere}>
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
