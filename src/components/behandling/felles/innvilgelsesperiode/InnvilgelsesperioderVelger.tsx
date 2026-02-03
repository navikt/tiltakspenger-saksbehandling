import {
    BehandlingInnvilgelseContext,
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import {
    hentHeleTiltaksdeltakelsesperioden,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { useSak } from '~/context/sak/SakContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Button, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { InnvilgelsesperiodeDatovelgere } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeDatoVelgere';
import { InnvilgelsesperioderVarsler } from '~/components/behandling/felles/innvilgelsesperiode/varsler/InnvilgelsesperioderVarsler';
import { XMarkIcon } from '@navikt/aksel-icons';
import { TiltaksdeltakelseMedPeriode } from '~/types/TiltakDeltakelse';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { Fragment } from 'react';
import {
    InnvilgelseHullVarsel,
    VedtaksperioderUtenInnvilgelseVarsel,
} from '~/components/behandling/felles/innvilgelsesperiode/varsler/InnvilgelseHullVarsel';
import { RevurderingResultat } from '~/types/Revurdering';
import { inneholderHelePerioden } from '~/utils/periode';
import { Periode } from '~/types/Periode';

import style from './InnvilgelsesperioderVelger.module.css';
import { classNames } from '~/utils/classNames';

export const InnvilgelsesperioderVelger = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseSkjema();
    const { innvilgelsesperioder, harValgtPeriode } = innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    if (innvilgelsesperioder.length === 0) {
        throw Error('Minst en innvilgelsesperiode skal alltid finnes!');
    }

    const tiltaksdeltakelser = hentTiltaksdeltakelserMedStartOgSluttdato(behandling);
    const tiltaksdeltakelsesperiode = hentHeleTiltaksdeltakelsesperioden(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperioder'}
                </Heading>
                {harValgtPeriode ? (
                    <VStack gap={'space-12'} align={'start'}>
                        <VedtaksperioderUtenInnvilgelseVarsel>
                            {innvilgelsesperioder.map((it, index, array) => {
                                const nestePeriode = array.at(index + 1)?.periode;

                                return (
                                    <Fragment key={`${it.periode.fraOgMed}-${it.periode.tilOgMed}`}>
                                        <InnvilgelsesperiodeVelgerFull
                                            innvilgelsesperioder={innvilgelsesperioder}
                                            index={index}
                                            tiltaksdeltakelser={tiltaksdeltakelser}
                                            behandling={behandling}
                                            sak={sak}
                                            readOnly={erReadonly}
                                        />
                                        <InnvilgelseHullVarsel
                                            forrigePeriode={it.periode}
                                            nestePeriode={nestePeriode}
                                        />
                                    </Fragment>
                                );
                            })}
                        </VedtaksperioderUtenInnvilgelseVarsel>

                        {!erReadonly && (
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
                                {'Ny periode'}
                            </Button>
                        )}

                        <InnvilgelsesperioderVarsler
                            innvilgelsesperioder={innvilgelsesperioder}
                            behandling={behandling}
                        />
                    </VStack>
                ) : (
                    <HStack gap={'space-12'}>
                        <InnvilgelsesperiodeDatovelgere
                            periode={innvilgelsesperioder.at(0)!.periode}
                            tiltaksdeltakelsesperiode={tiltaksdeltakelsesperiode}
                            index={0}
                            readOnly={erReadonly}
                        />
                    </HStack>
                )}
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type VelgerFullProps = {
    innvilgelsesperioder: Innvilgelsesperiode[];
    tiltaksdeltakelser: TiltaksdeltakelseMedPeriode[];
    behandling: Rammebehandling;
    sak: SakProps;
    index: number;
    readOnly: boolean;
};

const InnvilgelsesperiodeVelgerFull = ({
    innvilgelsesperioder,
    tiltaksdeltakelser,
    behandling,
    sak,
    index,
    readOnly,
}: VelgerFullProps) => {
    const skjemaContext = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const innvilgelsesperiode = innvilgelsesperioder.at(index)!;

    const tiltaksdeltakelsesperiode = hentHeleTiltaksdeltakelsesperioden(behandling);

    const { periode, antallDagerPerMeldeperiode, internDeltakelseId } = innvilgelsesperiode;

    const harValgtGyldigTiltak = tiltaksdeltakelser.some(
        (tiltak) => tiltak.internDeltakelseId === internDeltakelseId,
    );

    const harValgtUgyldigPeriodeForOmgjøring = harValgtUtenforVedtaksperiodeForOmgjøring(
        skjemaContext,
        periode,
    );

    const harFeil = !harValgtGyldigTiltak || harValgtUgyldigPeriodeForOmgjøring;

    return (
        <VStack gap={'space-8'} className={classNames(harFeil && style.feilOmriss)}>
            <HStack gap={'space-12'} align={'end'}>
                <InnvilgelsesperiodeDatovelgere
                    periode={periode}
                    tiltaksdeltakelsesperiode={tiltaksdeltakelsesperiode}
                    index={index}
                    readOnly={readOnly}
                />
                <Select
                    label={'Antall dager'}
                    size={'small'}
                    readOnly={readOnly}
                    value={antallDagerPerMeldeperiode}
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
                    readOnly={readOnly || (tiltaksdeltakelser.length === 1 && harValgtGyldigTiltak)}
                    value={internDeltakelseId}
                    onChange={(event) =>
                        dispatch({
                            type: 'settTiltaksdeltakelse',
                            payload: {
                                internDeltakelseId: event.target.value,
                                index,
                            },
                        })
                    }
                >
                    {!harValgtGyldigTiltak && (
                        <option
                            disabled={true}
                        >{`Ugyldig tiltak med id: ${internDeltakelseId}`}</option>
                    )}
                    {tiltaksdeltakelser.map((tiltak) => {
                        const { internDeltakelseId } = tiltak;

                        return (
                            <option value={internDeltakelseId} key={internDeltakelseId}>
                                {tiltakVisningsnavn(tiltak, tiltaksdeltakelser)}
                            </option>
                        );
                    })}
                </Select>

                {innvilgelsesperioder.length > 1 && !readOnly && (
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        icon={<XMarkIcon />}
                        onClick={() => {
                            dispatch({
                                type: 'fjernInnvilgelsesperiode',
                                payload: {
                                    index,
                                    behandling,
                                    sak,
                                },
                            });
                        }}
                    >
                        {'Fjern'}
                    </Button>
                )}
            </HStack>

            {!harValgtGyldigTiltak && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {'Kan ikke innvilge for dette tiltaket'}
                </Alert>
            )}

            {harValgtUgyldigPeriodeForOmgjøring && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {'Innvilgelsesperioden må være innenfor valgt vedtaksperiode'}
                </Alert>
            )}
        </VStack>
    );
};

const tiltakVisningsnavn = (
    tiltaksdeltakelse: TiltaksdeltakelseMedPeriode,
    tiltaksdeltakelser: TiltaksdeltakelseMedPeriode[],
): string => {
    const deltakelserMedType = tiltaksdeltakelser.filter(
        (t) => t.typeKode === tiltaksdeltakelse.typeKode,
    );

    if (deltakelserMedType.length > 1) {
        return `${tiltaksdeltakelse.typeNavn} (${periodeTilFormatertDatotekst({
            fraOgMed: tiltaksdeltakelse.deltagelseFraOgMed,
            tilOgMed: tiltaksdeltakelse.deltagelseTilOgMed,
        })})`;
    } else {
        return tiltaksdeltakelse.typeNavn;
    }
};

const harValgtUtenforVedtaksperiodeForOmgjøring = (
    skjemaContext: BehandlingInnvilgelseContext,
    valgtPeriode: Periode,
) => {
    return (
        skjemaContext.resultat === RevurderingResultat.OMGJØRING &&
        !inneholderHelePerioden(skjemaContext.vedtaksperiode, valgtPeriode)
    );
};
