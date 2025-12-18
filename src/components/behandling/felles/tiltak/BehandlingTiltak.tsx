// @ts-nocheck


import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Select } from '@navikt/ds-react';
import { TiltaksdeltagelseMedPeriode } from '~/types/TiltakDeltagelseTypes';
import { dateTilISOTekst, periodeTilFormatertDatotekst } from '~/utils/date';
import {
    deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { Separator } from '~/components/separator/Separator';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import MultiperiodeForm from '~/components/periode/MultiperiodeForm';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';

import style from './BehandlingTiltak.module.css';

export const BehandlingTiltak = () => {
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const tiltaksdeltakelser = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);

    const harFlereTiltak = deltarPaFlereTiltakMedStartOgSluttdatoIValgtInnvilgelsesperiode(
        behandling,
        innvilgelsesperioder,
    );

    if (!harFlereTiltak) {
        return null;
    }

    return (
        <>
            <VedtakSeksjon>
                <VedtakSeksjon.Venstre>
                    <MultiperiodeForm
                        name={'valgteTiltaksdeltakelser'}
                        perioder={valgteTiltaksdeltakelser}
                        nyPeriodeButtonConfig={{
                            onClick: () => dispatch({ type: 'addTiltakPeriode' }),
                            hidden: erReadonly,
                        }}
                        fjernPeriodeButtonConfig={{
                            text: 'Fjern',
                            onClick: (index) =>
                                dispatch({ type: 'fjernTiltakPeriode', payload: { index } }),
                            hidden: erReadonly || valgteTiltaksdeltakelser.length <= 1,
                        }}
                        periodeConfig={{
                            fraOgMed: {
                                onChange: (value, index) => {
                                    if (!value) {
                                        return;
                                    }

                                    dispatch({
                                        type: 'oppdaterTiltaksdeltagelseFraOgMed',
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
                                        type: 'oppdaterTiltaksdeltagelseTilOgMed',
                                        payload: { tilOgMed: dateTilISOTekst(value), index },
                                    });
                                },
                            },
                            readOnly: erReadonly,
                            minDate: innvilgelsesperioder.fraOgMed,
                            maxDate: innvilgelsesperioder.tilOgMed,
                        }}
                        contentConfig={{
                            position: 'before',
                            content: (periode, index) => (
                                <Select
                                    label={'Velg tiltak'}
                                    size={'small'}
                                    className={style.tiltakstype}
                                    defaultValue={periode.eksternDeltagelseId}
                                    readOnly={erReadonly}
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
                            ),
                        }}
                    />
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

const getVisningsnavn = (
    tiltaksdeltagelse: TiltaksdeltagelseMedPeriode,
    tiltaksdeltakelser: TiltaksdeltagelseMedPeriode[],
): string => {
    const deltakelserMedType = tiltaksdeltakelser.filter(
        (t) => t.typeKode === tiltaksdeltagelse.typeKode,
    );
    if (deltakelserMedType.length > 1) {
        return `${tiltaksdeltagelse.typeNavn} (${periodeTilFormatertDatotekst({
            fraOgMed: tiltaksdeltagelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltagelse.deltagelseTilOgMed,
        })})`;
    } else {
        return tiltaksdeltagelse.typeNavn;
    }
};
