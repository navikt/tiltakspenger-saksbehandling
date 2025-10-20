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
import { Separator } from '~/components/separator/Separator';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';

import style from './BehandlingTiltak.module.css';

export const BehandlingTiltak = () => {
    const { behandling, rolleForBehandling } = useBehandling();
    const { valgteTiltaksdeltakelser, behandlingsperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const tiltaksdeltakelser = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

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
                    {valgteTiltaksdeltakelser.map((periode, index) => {
                        return (
                            <TiltakPeriode
                                periode={periode}
                                tiltaksdeltakelser={tiltaksdeltakelser}
                                index={index}
                                rolle={rolleForBehandling}
                                skalKunneFjernePeriode={valgteTiltaksdeltakelser.length > 1}
                                key={`${periode.periode.fraOgMed}-${periode.eksternDeltagelseId}-${index}`}
                            />
                        );
                    })}
                    {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                        <Button
                            variant={'secondary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({ type: 'addTiltakPeriode' });
                            }}
                        >
                            {'Ny periode'}
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
};

const TiltakPeriode = ({
    periode,
    tiltaksdeltakelser,
    index,
    rolle,
    skalKunneFjernePeriode,
}: PeriodeProps) => {
    const { behandlingsperiode: innvilgelsesPeriode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

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
                            payload: { index },
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
