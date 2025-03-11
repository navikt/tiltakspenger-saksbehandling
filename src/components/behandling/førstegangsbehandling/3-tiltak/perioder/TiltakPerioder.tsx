import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import {
    useFørstegangsVedtakSkjemaDispatch,
    useFørstegangsVedtakSkjema,
} from '../../context/FørstegangsVedtakContext';
import { hentTiltaksdeltakelser, hentTiltaksperiode } from '../../../../../utils/behandling';
import { VedtakTiltaksdeltakelsePeriode } from '../../../../../types/VedtakTyper';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { dateTilISOTekst } from '../../../../../utils/date';
import { useFørstegangsbehandling } from '../../../BehandlingContext';

import style from './TiltakPerioder.module.css';
import { Tiltaksdeltagelse } from '../../../../../types/TiltakDeltagelseTypes';

export const TiltakPerioder = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { valgteTiltaksdeltakelser } = useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    const tiltaksdeltakelser = hentTiltaksdeltakelser(behandling);
    const tiltaksperiode = hentTiltaksperiode(behandling);

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                {valgteTiltaksdeltakelser?.map((periode, index) => {
                    return (
                        <TiltakPeriode
                            periode={periode}
                            tiltaksdeltakelser={tiltaksdeltakelser}
                            index={index}
                            rolle={rolleForBehandling}
                            key={`${periode.periode.fraOgMed}-${periode.eksternDeltagelseId}-${index}`}
                        />
                    );
                })}
                {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <Button
                        variant={'secondary'}
                        size={'small'}
                        className={style.ny}
                        onClick={() => {
                            dispatch({
                                type: 'addTiltakPeriode',
                                payload: { periode: tiltaksperiode },
                            });
                        }}
                    >
                        {'Ny periode for tiltak'}
                    </Button>
                )}
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: VedtakTiltaksdeltakelsePeriode;
    tiltaksdeltakelser: Tiltaksdeltagelse[];
    index: number;
    rolle: SaksbehandlerRolle | null;
};

const TiltakPeriode = ({ periode, tiltaksdeltakelser, index, rolle }: PeriodeProps) => {
    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    const erSaksbehandler = rolle === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={style.periode}>
            <Select
                label={'Velg tiltak'}
                size={'small'}
                className={style.tiltakstype}
                defaultValue={periode.eksternDeltagelseId}
                readOnly={!erSaksbehandler}
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterTiltakId',
                        payload: { eksternDeltagelseId: event.target.value, index },
                    });
                }}
            >
                {tiltaksdeltakelser.map((tiltak, index) => (
                    <option
                        value={tiltak.eksternDeltagelseId}
                        key={`${tiltak.deltagelseFraOgMed}-${tiltak.eksternDeltagelseId}-${index}`}
                    >
                        {tiltak.typeNavn}
                    </option>
                ))}
            </Select>
            <Datovelger
                defaultSelected={periode.periode.fraOgMed}
                label={'Fra og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (value) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { periode: { fraOgMed: dateTilISOTekst(value) }, index },
                        });
                    }
                }}
            />
            <Datovelger
                defaultSelected={periode.periode.tilOgMed}
                label={'Til og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (value) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { periode: { tilOgMed: dateTilISOTekst(value) }, index },
                        });
                    }
                }}
            />

            {erSaksbehandler && (
                <Button
                    variant={'tertiary'}
                    size={'small'}
                    className={style.fjern}
                    onClick={() => {
                        dispatch({
                            type: 'fjernTiltakPeriode',
                            payload: {
                                fjernIndex: index,
                            },
                        });
                    }}
                >
                    {'Fjern periode'}
                </Button>
            )}
        </div>
    );
};
