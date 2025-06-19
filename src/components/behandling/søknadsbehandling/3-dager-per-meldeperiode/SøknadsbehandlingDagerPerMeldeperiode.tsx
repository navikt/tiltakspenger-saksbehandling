import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { classNames } from '../../../../utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Select } from '@navikt/ds-react';
import { erSaksbehandler } from '../../../../utils/tilganger';
import { SøknadsbehandlingResultat } from '../../../../types/BehandlingTypes';

import style from './SøknadsbehandlingDagerPerMeldeperiode.module.css';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { antallDagerPerMeldeperiode } = useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();
    const { resultat } = useSøknadsbehandlingSkjema();

    return (
        <div
            className={classNames(
                resultat !== SøknadsbehandlingResultat.INNVILGELSE && style.skjult,
            )}
        >
            <VedtakSeksjon className={style.antallDagerPerMeldeperiode}>
                <VedtakSeksjon.Venstre>
                    <Select
                        label={'Antall dager per meldeperiode'}
                        size={'small'}
                        className={style.antall}
                        value={antallDagerPerMeldeperiode || 10}
                        readOnly={!erSaksbehandler}
                        onChange={(event) => {
                            dispatch({
                                type: 'oppdaterDagerPerMeldeperiode',
                                payload: {
                                    antallDagerPerMeldeperiode: Number(event.target.value),
                                },
                            });
                        }}
                    >
                        {Array.from({ length: 14 }).map((_, index) => {
                            const verdi = index + 1;
                            return (
                                <option value={verdi} key={verdi}>
                                    {verdi}
                                </option>
                            );
                        })}
                    </Select>
                </VedtakSeksjon.Venstre>
            </VedtakSeksjon>

            <VedtakSeksjon
                className={classNames(
                    style.input,
                    antallDagerPerMeldeperiode === 10 && style.skjult,
                )}
            >
                <Alert className={style.infoboks} variant={'info'} size={'small'}>
                    Husk å oppgi antall dager per uke det innvilges tiltakspenger for i
                    vedtaksbrevet.
                </Alert>
            </VedtakSeksjon>
        </div>
    );
};
