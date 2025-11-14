import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { dateTilISOTekst } from '~/utils/date';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Rammebehandlingstype } from '~/types/Rammebehandling';
import { BarnetilleggPeriodeFormData } from '../utils/hentBarnetilleggFraBehandling';
import { periodiserBarnetilleggFraSøknad } from '~/components/behandling/felles/barnetillegg/utils/periodiserBarnetilleggFraSøknad';
import { Periode } from '~/types/Periode';
import { hentBarnetilleggFraVedtakTidslinje } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { useSak } from '~/context/sak/SakContext';
import PeriodeForm from '~/components/periode/PeriodeForm';

import style from './BehandlingBarnetilleggPerioder.module.css';

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
                {barnetilleggPerioder.map((periode, index) => (
                    <BarnetilleggPeriode
                        periode={periode}
                        index={index}
                        erSaksbehandler={erSaksbehandler}
                        key={`${periode.periode.fraOgMed}-${index}`}
                    />
                ))}
                {erSaksbehandler && (
                    <div className={style.perioderKnapper}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addBarnetilleggPeriode',
                                    payload: { antallBarn: antallBarnForNyPeriode },
                                });
                            }}
                        >
                            {'Ny periode'}
                        </Button>
                        {erSøknadsbehandling ? (
                            <Button
                                variant={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    dispatch({
                                        type: 'nullstillBarnetilleggPerioder',
                                        payload: {
                                            barnetilleggPerioder: periodiserBarnetilleggFraSøknad(
                                                behandling.søknad.barnetillegg,
                                                behandlingsperiode as Periode,
                                            ),
                                        },
                                    });
                                }}
                            >
                                {'Sett perioder fra søknaden'}
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
                                {'Sett perioder fra tidligere vedtak'}
                            </Button>
                        )}
                    </div>
                )}
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: BarnetilleggPeriodeFormData;
    index: number;
    erSaksbehandler: boolean;
};

const BarnetilleggPeriode = ({ periode, index, erSaksbehandler }: PeriodeProps) => {
    const { behandlingsperiode: innvilgelsesPeriode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    // Støtter uendelig mange barn!
    const maksAntall = (Math.floor(periode.antallBarn / BATCH_MED_BARN) + 1) * BATCH_MED_BARN;

    // Normalt skal det ikke være mulig å sette en 0-periode, men dersom det skulle skje må det vises til saksbehandler
    const erPeriodeMed0Barn = periode.antallBarn === 0;

    return (
        <div className={style.periode}>
            <PeriodeForm
                fraOgMed={{
                    label: 'Fra og med',
                    value: periode.periode.fraOgMed,
                    onChange: (value) => {
                        if (!value) {
                            return;
                        }

                        const nyFraOgMed = dateTilISOTekst(value);
                        if (nyFraOgMed !== periode.periode.fraOgMed) {
                            dispatch({
                                type: 'oppdaterBarnetilleggFraOgMed',
                                payload: { fraOgMed: nyFraOgMed, index },
                            });
                        }
                    },
                    error: null,
                }}
                tilOgMed={{
                    label: 'Til og med',
                    value: periode.periode.tilOgMed,
                    onChange: (value) => {
                        if (!value) {
                            return;
                        }

                        const nyTilOgMed = dateTilISOTekst(value);
                        if (nyTilOgMed !== periode.periode.tilOgMed) {
                            dispatch({
                                type: 'oppdaterBarnetilleggTilOgMed',
                                payload: { tilOgMed: nyTilOgMed, index },
                            });
                        }
                    },
                    error: null,
                }}
                readOnly={!erSaksbehandler}
                minDate={innvilgelsesPeriode?.fraOgMed}
                maxDate={innvilgelsesPeriode?.tilOgMed}
            />

            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                value={periode.antallBarn}
                readOnly={!erSaksbehandler}
                error={erPeriodeMed0Barn && 'Perioden må ha minst ett barn'}
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    });
                }}
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
            {erSaksbehandler && (
                <Button
                    variant={'tertiary'}
                    size={'small'}
                    onClick={() => {
                        dispatch({
                            type: 'fjernBarnetilleggPeriode',
                            payload: { index },
                        });
                    }}
                >
                    {'Fjern periode'}
                </Button>
            )}
        </div>
    );
};
