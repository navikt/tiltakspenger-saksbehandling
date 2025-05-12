import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '../../../vedtak-layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import {
    useFørstegangsVedtakSkjemaDispatch,
    useFørstegangsVedtakSkjema,
} from '../../context/FørstegangsVedtakContext';
import { hentTiltaksdeltakelserMedStartOgSluttdato } from '../../../../../utils/behandling';
import { VedtakTiltaksdeltakelsePeriode } from '../../../../../types/VedtakTyper';
import { SaksbehandlerRolle } from '../../../../../types/Saksbehandler';
import { dateTilISOTekst, periodeTilFormatertDatotekst } from '../../../../../utils/date';
import { useFørstegangsbehandling } from '../../../BehandlingContext';

import style from './TiltakPerioder.module.css';
import { Tiltaksdeltagelse } from '../../../../../types/TiltakDeltagelseTypes';

export const TiltakPerioder = () => {
    const { behandling, rolleForBehandling } = useFørstegangsbehandling();
    const { valgteTiltaksdeltakelser, behandlingsperiode: innvilgelsesPeriode } =
        useFørstegangsVedtakSkjema();
    const dispatch = useFørstegangsVedtakSkjemaDispatch();

    const tiltaksdeltakelser = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

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
                            skalKunneFjernePeriode={valgteTiltaksdeltakelser?.length > 1}
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
                                payload: { innvilgelsesperiode: innvilgelsesPeriode },
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
    skalKunneFjernePeriode: boolean;
};

const TiltakPeriode = ({
    periode,
    tiltaksdeltakelser,
    index,
    rolle,
    skalKunneFjernePeriode,
}: PeriodeProps) => {
    const dispatch = useFørstegangsVedtakSkjemaDispatch();
    const { behandlingsperiode: innvilgelsesPeriode } = useFørstegangsVedtakSkjema();

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
                        {getVisningsnavn(tiltak, tiltaksdeltakelser)}
                    </option>
                ))}
            </Select>
            <Datovelger
                selected={periode.periode.fraOgMed}
                minDate={innvilgelsesPeriode.fraOgMed}
                maxDate={innvilgelsesPeriode.tilOgMed}
                label={'Fra og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (!value) {
                        return;
                    }
                    const nyFraOgMed = dateTilISOTekst(value);
                    if (nyFraOgMed !== periode.periode.fraOgMed) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { periode: { fraOgMed: nyFraOgMed }, index },
                        });
                    }
                }}
            />
            <Datovelger
                selected={periode.periode.tilOgMed}
                minDate={innvilgelsesPeriode.fraOgMed}
                maxDate={innvilgelsesPeriode.tilOgMed}
                label={'Til og med'}
                size={'small'}
                readOnly={!erSaksbehandler}
                onDateChange={(value) => {
                    if (!value) {
                        return;
                    }

                    const nyTilOgMed = dateTilISOTekst(value);
                    if (nyTilOgMed !== periode.periode.tilOgMed) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { periode: { tilOgMed: nyTilOgMed }, index },
                        });
                    }
                }}
            />

            {erSaksbehandler && skalKunneFjernePeriode && (
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

const getVisningsnavn = (
    tiltaksdeltagelse: Tiltaksdeltagelse,
    tiltaksdeltakelser: Tiltaksdeltagelse[],
): string => {
    const deltakelserMedType = tiltaksdeltakelser.filter(
        (t) => t.typeKode === tiltaksdeltagelse.typeKode,
    );
    if (deltakelserMedType.length > 1) {
        return `${tiltaksdeltagelse.typeNavn} (${periodeTilFormatertDatotekst({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed!,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed!,
        })})`;
    } else {
        return tiltaksdeltagelse.typeNavn;
    }
};
