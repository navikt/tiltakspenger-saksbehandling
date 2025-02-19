import { Radio, RadioGroup } from '@navikt/ds-react';
import { Datovelger } from '../../../revurderingsmodal/Datovelger';
import { classNames } from '../../../../utils/classNames';
import { VedtakResultat } from '../../../../types/VedtakTyper';
import { useBehandling } from '../../../../context/behandling/BehandlingContext';
import { hentTiltaksPeriode } from '../../../../utils/vilkår';
import { dateTilISOTekst } from '../../../../utils/date';

import style from './BehandlingResultat.module.css';

export const BehandlingResultat = () => {
    const { behandling, vedtak, setResultat, oppdaterInnvilgelsesPeriode } = useBehandling();

    const initiellTiltaksPeriode = hentTiltaksPeriode(behandling);

    const { resultat, innvilgelsesPeriode } = vedtak;

    return (
        <div className={style.resultat}>
            <RadioGroup
                legend={'Resultat'}
                size={'small'}
                className={style.radioGroup}
                defaultValue={vedtak.resultat}
                onChange={(valgtResultat: VedtakResultat) => {
                    setResultat({ resultat: valgtResultat, innvilgelsesPeriode });
                }}
            >
                <Radio value={'innvilget' satisfies VedtakResultat}>{'Innvilgelse'}</Radio>
                <Radio value={'avslag' satisfies VedtakResultat} disabled={true}>
                    {'Avslag (støttes ikke ennå)'}
                </Radio>
            </RadioGroup>
            <div
                className={classNames(style.datovelgere, resultat !== 'innvilget' && style.skjult)}
            >
                <Datovelger
                    label={'Innvilgelse f.o.m'}
                    size={'small'}
                    defaultSelected={new Date(initiellTiltaksPeriode.fraOgMed)}
                    onDateChange={(valgtDato) => {
                        if (valgtDato) {
                            oppdaterInnvilgelsesPeriode({
                                fraOgMed: dateTilISOTekst(valgtDato),
                            });
                        }
                    }}
                />
                <Datovelger
                    label={'Innvilgelse t.o.m'}
                    size={'small'}
                    defaultSelected={new Date(initiellTiltaksPeriode.tilOgMed)}
                    onDateChange={(valgtDato) => {
                        if (valgtDato) {
                            oppdaterInnvilgelsesPeriode({
                                tilOgMed: dateTilISOTekst(valgtDato),
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
};
