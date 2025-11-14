import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';

import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { dateTilISOTekst } from '~/utils/date';

import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

import style from './BehandlingBarnetilleggPerioder.module.css';
import { Rammebehandlingstype } from '~/types/Rammebehandling';
import MultiperiodeForm from '~/components/multiperiodeForm/MultiperiodeForm';
import { periodiserBarnetilleggFraSøknad } from '../utils/periodiserBarnetilleggFraSøknad';
import { Periode } from '~/types/Periode';
import { hentBarnetilleggFraVedtakTidslinje } from '../utils/hentBarnetilleggFraVedtakTidslinje';
import { useSak } from '~/context/sak/SakContext';

const BATCH_MED_BARN = 10;

export const BehandlingBarnetilleggPerioder = () => {
    const { sak } = useSak();
    const { behandling, rolleForBehandling } = useBehandling();
    const { barnetilleggPerioder, behandlingsperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const erSøknadsbehandling = behandling.type === Rammebehandlingstype.SØKNADSBEHANDLING;
    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    const antallBarnFraSøknad = erSøknadsbehandling ? behandling.søknad.barnetillegg.length : 0;

    const antallBarnForNyPeriode =
        barnetilleggPerioder.at(-1)?.antallBarn || antallBarnFraSøknad || 1;

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                <MultiperiodeForm
                    name={'barnetilleggPerioder'}
                    perioder={barnetilleggPerioder}
                    nyPeriodeButtonConfig={{
                        onClick: () =>
                            dispatch({
                                type: 'addBarnetilleggPeriode',
                                payload: { antallBarn: antallBarnForNyPeriode },
                            }),
                        disabled: !erSaksbehandler,
                        adjacentContent: {
                            content: erSøknadsbehandling ? (
                                <Button
                                    variant={'secondary'}
                                    size={'small'}
                                    onClick={() =>
                                        dispatch({
                                            type: 'nullstillBarnetilleggPerioder',
                                            payload: {
                                                barnetilleggPerioder:
                                                    periodiserBarnetilleggFraSøknad(
                                                        behandling.søknad.barnetillegg,
                                                        behandlingsperiode as Periode,
                                                    ),
                                            },
                                        })
                                    }
                                >
                                    Sett perioder fra søknaden
                                </Button>
                            ) : (
                                <Button
                                    variant={'secondary'}
                                    size={'small'}
                                    onClick={() => {
                                        dispatch({
                                            type: 'nullstillBarnetilleggPerioder',
                                            payload: {
                                                barnetilleggPerioder:
                                                    hentBarnetilleggFraVedtakTidslinje(
                                                        sak.tidslinje,
                                                        behandlingsperiode as Periode,
                                                    ),
                                            },
                                        });
                                    }}
                                >
                                    Sett perioder fra tidligere vedtak
                                </Button>
                            ),
                            position: 'after',
                        },
                    }}
                    fjernPeriodeButtonConfig={{
                        onClick: (index) =>
                            dispatch({ type: 'fjernBarnetilleggPeriode', payload: { index } }),
                        hidden: !erSaksbehandler,
                    }}
                    periodeConfig={{
                        fraOgMed: {
                            onChange: (value, index) => {
                                if (!value) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterBarnetilleggFraOgMed',
                                    payload: { fraOgMed: dateTilISOTekst(value), index },
                                });
                            },
                        },
                        tilOgMed: {
                            onChange: (value, index) => {
                                if (!value) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterBarnetilleggTilOgMed',
                                    payload: { tilOgMed: dateTilISOTekst(value), index },
                                });
                            },
                        },
                        readOnly: !erSaksbehandler,
                        minDate: behandlingsperiode?.fraOgMed,
                        maxDate: behandlingsperiode?.tilOgMed,
                    }}
                    contentConfig={{
                        content: (periode, index) => {
                            // Støtter uendelig mange barn!
                            const maksAntall =
                                (Math.floor(periode.antallBarn / BATCH_MED_BARN) + 1) *
                                BATCH_MED_BARN;

                            // Normalt skal det ikke være mulig å sette en 0-periode, men dersom det skulle skje må det vises til saksbehandler
                            const erPeriodeMed0Barn = periode.antallBarn === 0;

                            return (
                                <Select
                                    label={'Antall barn'}
                                    size={'small'}
                                    className={style.antall}
                                    value={periode.antallBarn}
                                    readOnly={!erSaksbehandler}
                                    error={erPeriodeMed0Barn && 'Perioden må ha minst ett barn'}
                                    onChange={(event) =>
                                        dispatch({
                                            type: 'oppdaterBarnetilleggAntall',
                                            payload: { antall: Number(event.target.value), index },
                                        })
                                    }
                                >
                                    {erPeriodeMed0Barn && (
                                        <option value={0} disabled={true}>
                                            {0}
                                        </option>
                                    )}
                                    {Array.from({ length: maksAntall }).map((_, index) => {
                                        const verdi = index + 1;
                                        return (
                                            <option value={verdi} key={verdi}>
                                                {verdi}
                                            </option>
                                        );
                                    })}
                                </Select>
                            );
                        },
                    }}
                />
            </VedtakSeksjon.Venstre>
        </>
    );
};
