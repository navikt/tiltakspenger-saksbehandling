import {
    useSøknadsbehandlingSkjema,
    useSøknadsbehandlingSkjemaDispatch,
} from '../context/SøknadsbehandlingVedtakContext';
import { classNames } from '~/utils/classNames';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Button, Heading, Select } from '@navikt/ds-react';
import { SøknadsbehandlingResultat } from '../../../../types/BehandlingTypes';

import style from './SøknadsbehandlingDagerPerMeldeperiode.module.css';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import { useSøknadsbehandling } from '../../BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

export const SøknadsbehandlingDagerPerMeldeperiode = () => {
    const { rolleForBehandling } = useSøknadsbehandling();
    const { antallDagerPerMeldeperiode, resultat, behandlingsperiode } =
        useSøknadsbehandlingSkjema();
    const dispatch = useSøknadsbehandlingSkjemaDispatch();

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;
    const erIkkeSaksbehandler = !erSaksbehandler;

    return (
        <div
            className={classNames(
                resultat !== SøknadsbehandlingResultat.INNVILGELSE && style.skjult,
            )}
        >
            <div>
                <Heading size={'small'} level="4" className={style.antallDagerHeading}>
                    Antall dager per meldeperiode
                </Heading>

                <ul className={style.antallDagerContainer}>
                    {antallDagerPerMeldeperiode.map((periode, index) => (
                        <li
                            key={`d-${periode.antallDagerPerMeldeperiode}-f-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                            className={style.antallDagerElementContainer}
                        >
                            <Select
                                label="Antall dager"
                                size="small"
                                className={style.antall}
                                readOnly={erIkkeSaksbehandler}
                                value={periode.antallDagerPerMeldeperiode ?? undefined}
                                onChange={(event) => {
                                    dispatch({
                                        type: 'oppdaterAntallDagerForMeldeperiode',
                                        payload: {
                                            antallDager: [
                                                ...antallDagerPerMeldeperiode.slice(0, index),
                                                {
                                                    ...periode,
                                                    antallDagerPerMeldeperiode: Number(
                                                        event.target.value,
                                                    ),
                                                },
                                                ...antallDagerPerMeldeperiode.slice(index + 1),
                                            ],
                                        },
                                    });
                                }}
                            >
                                <option>Velg antall dager</option>
                                {Array.from({ length: 14 }).map((_, index) => {
                                    const verdi = index + 1;
                                    return (
                                        <option value={verdi} key={verdi}>
                                            {verdi}
                                        </option>
                                    );
                                })}
                            </Select>

                            <Datovelger
                                label="Fra og med"
                                size="small"
                                minDate={behandlingsperiode.fraOgMed}
                                maxDate={behandlingsperiode.tilOgMed}
                                readOnly={erIkkeSaksbehandler}
                                defaultSelected={periode.periode.fraOgMed ?? undefined}
                                onDateChange={(date) => {
                                    dispatch({
                                        type: 'oppdaterAntallDagerForMeldeperiode',
                                        payload: {
                                            antallDager: [
                                                ...antallDagerPerMeldeperiode.slice(0, index),
                                                {
                                                    ...periode,
                                                    periode: {
                                                        ...periode.periode,
                                                        fraOgMed: date
                                                            ? dateTilISOTekst(date)
                                                            : null,
                                                    },
                                                },
                                                ...antallDagerPerMeldeperiode.slice(index + 1),
                                            ],
                                        },
                                    });
                                }}
                            />
                            <Datovelger
                                label="Til og med"
                                size="small"
                                minDate={behandlingsperiode.fraOgMed}
                                maxDate={behandlingsperiode.tilOgMed}
                                readOnly={erIkkeSaksbehandler}
                                defaultSelected={periode.periode.tilOgMed ?? undefined}
                                onDateChange={(date) => {
                                    dispatch({
                                        type: 'oppdaterAntallDagerForMeldeperiode',
                                        payload: {
                                            antallDager: [
                                                ...antallDagerPerMeldeperiode.slice(0, index),
                                                {
                                                    ...periode,
                                                    periode: {
                                                        ...periode.periode,
                                                        tilOgMed: date
                                                            ? dateTilISOTekst(date)
                                                            : null,
                                                    },
                                                },
                                                ...antallDagerPerMeldeperiode.slice(index + 1),
                                            ],
                                        },
                                    });
                                }}
                            />

                            {antallDagerPerMeldeperiode.length > 1 && erSaksbehandler && (
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="small"
                                    onClick={() => {
                                        dispatch({
                                            type: 'oppdaterAntallDagerForMeldeperiode',
                                            payload: {
                                                antallDager: [
                                                    ...antallDagerPerMeldeperiode.slice(0, index),
                                                    ...antallDagerPerMeldeperiode.slice(index + 1),
                                                ],
                                            },
                                        });
                                    }}
                                >
                                    Fjern meldeperiode
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>

                {erSaksbehandler && (
                    <Button
                        variant="secondary"
                        type="button"
                        size="small"
                        onClick={() => {
                            dispatch({
                                type: 'oppdaterAntallDagerForMeldeperiode',
                                payload: {
                                    antallDager: [
                                        ...antallDagerPerMeldeperiode,
                                        {
                                            antallDagerPerMeldeperiode: null,
                                            periode: { fraOgMed: null, tilOgMed: null },
                                        },
                                    ],
                                },
                            });
                        }}
                    >
                        Ny meldeperiode
                    </Button>
                )}
            </div>

            <VedtakSeksjon
                className={classNames(
                    style.input,
                    antallDagerPerMeldeperiode.reduce(
                        (acc, curr) => (acc += curr.antallDagerPerMeldeperiode || 0),
                        0,
                    ) === 10 && style.skjult,
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
