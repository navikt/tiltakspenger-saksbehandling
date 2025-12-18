import { dateTilISOTekst, datoMin } from '~/utils/date';
import {
    useBehandlingInnvilgelseSkjemaDispatch,
    useBehandlingInnvilgelseSkjema,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';
import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltagelserFraPeriode,
} from '~/utils/behandling';
import { useSak } from '~/context/sak/SakContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Button, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';

import style from './InnvilgelsesperioderVelger.module.css';

export const InnvilgelsesperiodeVelger = () => {
    const { innvilgelse } = useBehandlingInnvilgelseSkjema();
    const { innvilgelsesperioder, harValgtPeriode } = innvilgelse;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperioder'}
                </Heading>
                {harValgtPeriode ? (
                    <MedValgtPeriode innvilgelsesperioder={innvilgelsesperioder} />
                ) : null}
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type MedValgtPeriodeProps = {
    innvilgelsesperioder: Innvilgelsesperiode[];
};

const MedValgtPeriode = ({ innvilgelsesperioder }: MedValgtPeriodeProps) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    return (
        <VStack gap={'2'} align={'start'}>
            {innvilgelsesperioder.map((it, index) => (
                <Valg
                    innvilgelsesperiode={it}
                    index={index}
                    key={`${it.periode.fraOgMed}-${it.periode.tilOgMed}`}
                />
            ))}
            <Button
                type={'button'}
                variant={'secondary'}
                size={'small'}
                onClick={() => {
                    dispatch({
                        type: 'leggTilInnvilgelsesperiode',
                        payload: {
                            sak,
                            behandling,
                        },
                    });
                }}
            >
                {'Legg til'}
            </Button>
        </VStack>
    );
};

type ValgProps = {
    innvilgelsesperiode: Innvilgelsesperiode;
    index: number;
};

const Valg = ({ innvilgelsesperiode, index }: ValgProps) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();
    const { erReadonly } = useBehandlingInnvilgelseSkjema();

    const tiltaksdeltagelsesperiode = hentHeleTiltaksdeltagelsesperioden(behandling);
    const defaultDato = datoMin(new Date(), tiltaksdeltagelsesperiode.tilOgMed);

    const tiltaksdeltakelser = hentTiltaksdeltagelserFraPeriode(
        behandling,
        innvilgelsesperiode.periode,
    );

    const harValgtGyldigTiltak = tiltaksdeltakelser.some(
        (tiltak) => tiltak.eksternDeltagelseId === innvilgelsesperiode.tiltaksdeltakelseId,
    );

    return (
        <HStack gap={'5'}>
            <PeriodeVelger
                fraOgMed={{
                    label: 'Fra og med',
                    defaultSelected: innvilgelsesperiode.periode.fraOgMed,
                    minDate: tiltaksdeltagelsesperiode.fraOgMed,
                    maxDate:
                        innvilgelsesperiode.periode.tilOgMed ?? tiltaksdeltagelsesperiode.tilOgMed,
                    defaultMonth: defaultDato,
                    error: !innvilgelsesperiode.periode.fraOgMed && 'Velg dato',
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: {
                                periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                                index,
                                behandling,
                                sak,
                            },
                        });
                    },
                }}
                tilOgMed={{
                    label: 'Til og med',
                    defaultSelected: innvilgelsesperiode.periode.tilOgMed,
                    minDate:
                        innvilgelsesperiode.periode.fraOgMed ?? tiltaksdeltagelsesperiode.fraOgMed,
                    maxDate: tiltaksdeltagelsesperiode.tilOgMed,
                    defaultMonth: defaultDato,
                    error: !innvilgelsesperiode.periode.tilOgMed && 'Velg dato',
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: {
                                periode: { tilOgMed: dateTilISOTekst(valgtDato) },
                                index,
                                behandling,
                                sak,
                            },
                        });
                    },
                }}
                readOnly={erReadonly}
            />
            <Select
                label={'Antall dager'}
                size={'small'}
                readOnly={erReadonly}
                value={innvilgelsesperiode.antallDagerPerMeldeperiode}
                onChange={(event) =>
                    dispatch({
                        type: 'settAntallDager',
                        payload: {
                            antallDager: Number(event.target.value),
                            index,
                        },
                    })
                }
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
            <Select
                label={'Tiltak'}
                size={'small'}
                readOnly={erReadonly || (tiltaksdeltakelser.length === 1 && harValgtGyldigTiltak)}
                value={innvilgelsesperiode.tiltaksdeltakelseId}
                onChange={(event) =>
                    dispatch({
                        type: 'settTiltaksdeltakelse',
                        payload: {
                            tiltaksdeltakelseId: event.target.value,
                            index,
                        },
                    })
                }
            >
                {!harValgtGyldigTiltak && (
                    <option disabled={true}>{innvilgelsesperiode.tiltaksdeltakelseId}</option>
                )}
                {tiltaksdeltakelser.map((tiltak) => {
                    const { eksternDeltagelseId, typeNavn } = tiltak;

                    return (
                        <option value={eksternDeltagelseId} key={eksternDeltagelseId}>
                            {typeNavn}
                        </option>
                    );
                })}
            </Select>
            {!harValgtGyldigTiltak && (
                <Alert
                    variant={'error'}
                    size={'small'}
                    inline={true}
                    className={style.ugyldigTiltakAlert}
                >
                    {'Kan ikke innvilge for dette tiltaket'}
                </Alert>
            )}
        </HStack>
    );
};
