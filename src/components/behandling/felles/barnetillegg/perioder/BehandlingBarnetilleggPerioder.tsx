import { Button, Select } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '../../../../datovelger/Datovelger';
import { VedtakBarnetilleggPeriode } from '~/types/VedtakTyper';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { dateTilISOTekst } from '~/utils/date';
import { BehandlingBarnetilleggProps } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { Behandlingstype } from '~/types/BehandlingTypes';

import style from './BarnetilleggPerioder.module.css';

const BATCH_MED_BARN = 10;

type Props = BehandlingBarnetilleggProps;

export const BehandlingBarnetilleggPerioder = (props: Props) => {
    const { behandling, dispatch, context } = props;
    const { barnetilleggPerioder, behandlingsperiode } = context;

    const rolle = useRolleForBehandling(behandling);

    const erSøknadsbehandling = behandling.type === Behandlingstype.SØKNADSBEHANDLING;

    // TODO: burde ha data for barn på revurdering-behandling også
    const antallBarn = erSøknadsbehandling ? behandling.søknad.barnetillegg.length : 1;

    return (
        <>
            <VedtakSeksjon.Venstre className={style.wrapper}>
                {barnetilleggPerioder?.map((periode, index) => {
                    return (
                        <BarnetilleggPeriode
                            {...props}
                            periode={periode}
                            index={index}
                            rolle={rolle}
                            key={`${periode.periode.fraOgMed}-${index}`}
                        />
                    );
                })}
                {rolle === SaksbehandlerRolle.SAKSBEHANDLER && (
                    <div className={style.perioderKnapper}>
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addBarnetilleggPeriode',
                                    payload: {
                                        innvilgelsesPeriode: behandlingsperiode,
                                        antallBarnFraSøknad: antallBarn,
                                    },
                                });
                            }}
                        >
                            {'Ny periode'}
                        </Button>
                        {antallBarn > 0 && erSøknadsbehandling && (
                            <Button
                                variant={'secondary'}
                                size={'small'}
                                onClick={() => {
                                    dispatch({
                                        type: 'nullstillBarnetilleggPerioder',
                                        payload: {
                                            innvilgelsesPeriode: behandlingsperiode,
                                            søknad: behandling.søknad,
                                        },
                                    });
                                }}
                            >
                                {'Sett perioder fra søknaden'}
                            </Button>
                        )}
                    </div>
                )}
            </VedtakSeksjon.Venstre>
        </>
    );
};

type PeriodeProps = {
    periode: VedtakBarnetilleggPeriode;
    index: number;
    rolle: SaksbehandlerRolle | null;
} & BehandlingBarnetilleggProps;

const BarnetilleggPeriode = ({ periode, index, rolle, dispatch, context }: PeriodeProps) => {
    const { behandlingsperiode: innvilgelsesPeriode } = context;

    // Støtter uendelig mange barn!
    const maksAntall = (Math.floor(periode.antallBarn / BATCH_MED_BARN) + 1) * BATCH_MED_BARN;
    const erSaksbehandler = rolle === SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={style.periode}>
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
                            type: 'oppdaterBarnetilleggPeriode',
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
                            type: 'oppdaterBarnetilleggPeriode',
                            payload: { periode: { tilOgMed: nyTilOgMed }, index },
                        });
                    }
                }}
            />
            <Select
                label={'Antall barn'}
                size={'small'}
                className={style.antall}
                value={periode.antallBarn}
                readOnly={!erSaksbehandler}
                onChange={(event) => {
                    dispatch({
                        type: 'oppdaterBarnetilleggAntall',
                        payload: { antall: Number(event.target.value), index },
                    });
                }}
            >
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
