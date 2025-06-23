import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Button, Select } from '@navikt/ds-react';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { VedtakTiltaksdeltakelsePeriode } from '~/types/VedtakTyper';
import { Tiltaksdeltagelse } from '~/types/TiltakDeltagelseTypes';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, periodeTilFormatertDatotekst } from '~/utils/date';
import {
    deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { BehandlingData } from '~/types/BehandlingTypes';
import {
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import { Dispatch } from 'react';
import { InnvilgelseState } from '~/components/behandling/felles/state/InnvilgelseState';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { Separator } from '~/components/separator/Separator';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';

import style from './BehandlingTiltak.module.css';

type Props = {
    behandling: BehandlingData;
    context: TiltaksdeltagelseState & InnvilgelseState;
    dispatch: Dispatch<TiltaksdeltagelseActions>;
};

export const BehandlingTiltak = (props: Props) => {
    const { behandling, context, dispatch } = props;
    const { valgteTiltaksdeltakelser, behandlingsperiode } = context;

    const tiltaksdeltakelser = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

    const rolle = useRolleForBehandling(behandling);

    const harFlereTiltak = deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode(
        behandling,
        behandlingsperiode,
    );

    if (!harFlereTiltak) {
        return null;
    }

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    {valgteTiltaksdeltakelser?.map((periode, index) => {
                        return (
                            <TiltakPeriode
                                {...props}
                                periode={periode}
                                tiltaksdeltakelser={tiltaksdeltakelser}
                                index={index}
                                rolle={rolle}
                                skalKunneFjernePeriode={valgteTiltaksdeltakelser.length > 1}
                                key={`${periode.periode.fraOgMed}-${periode.eksternDeltagelseId}-${index}`}
                            />
                        );
                    })}
                    {rolle === SaksbehandlerRolle.SAKSBEHANDLER && (
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'addTiltakPeriode',
                                    payload: { innvilgelsesperiode: behandlingsperiode },
                                });
                            }}
                        >
                            {'Ny periode for tiltak'}
                        </Button>
                    )}
                </VedtakSeksjon.Venstre>

                <VedtakSeksjon.Høyre>
                    <VedtakHjelpetekst variant={'warning'}>
                        Flere tiltak registrert på bruker. Velg tiltak(ene) som bruker skal vurderes
                        for og periodene som gjelder. Det du velger brukes for regnskapsføring og
                        statistikk, og påvirker ikke vedtaket.
                    </VedtakHjelpetekst>
                </VedtakSeksjon.Høyre>
            </VedtakSeksjon>
            <Separator />
        </>
    );
};

type PeriodeProps = {
    periode: VedtakTiltaksdeltakelsePeriode;
    tiltaksdeltakelser: Tiltaksdeltagelse[];
    index: number;
    rolle: SaksbehandlerRolle | null;
    skalKunneFjernePeriode: boolean;
} & Props;

const TiltakPeriode = ({
    periode,
    tiltaksdeltakelser,
    index,
    rolle,
    skalKunneFjernePeriode,
    dispatch,
    context,
}: PeriodeProps) => {
    const { behandlingsperiode: innvilgelsesPeriode } = context;

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
                    onClick={() => {
                        dispatch({
                            type: 'fjernTiltakPeriode',
                            payload: {
                                fjernIndex: index,
                            },
                        });
                    }}
                >
                    {'Fjern'}
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
