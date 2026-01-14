import {
    useBehandlingInnvilgelseSkjemaDispatch,
    useBehandlingInnvilgelseSkjema,
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
import { InnvilgelsesperioderVarsler } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperioderVarsler';
import { XMarkIcon } from '@navikt/aksel-icons';
import { TiltaksdeltakelseMedPeriode } from '~/types/TiltakDeltakelse';
import { forrigeDag, nesteDag, periodeTilFormatertDatotekst } from '~/utils/date';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';
import { Fragment } from 'react';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';

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

    const { innvilgelseMedHullToggle } = useFeatureToggles();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperioder'}
                </Heading>
                {harValgtPeriode ? (
                    <VStack gap={'3'} align={'start'}>
                        {innvilgelsesperioder.map((it, index, array) => {
                            const nesteDagEtterPerioden = nesteDag(it.periode.tilOgMed);
                            const fraOgMedNestePeriode = array.at(index + 1)?.periode.fraOgMed;

                            const periodeUtenInnvilgelse = !!fraOgMedNestePeriode &&
                                nesteDagEtterPerioden < fraOgMedNestePeriode && {
                                    fraOgMed: nesteDagEtterPerioden,
                                    tilOgMed: forrigeDag(fraOgMedNestePeriode),
                                };

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
                                    {periodeUtenInnvilgelse && (
                                        <Alert
                                            variant={innvilgelseMedHullToggle ? 'warning' : 'error'}
                                            size={'small'}
                                            inline={true}
                                        >
                                            {`Ikke innvilget for perioden ${periodeTilFormatertDatotekst(periodeUtenInnvilgelse)}`}
                                        </Alert>
                                    )}
                                </Fragment>
                            );
                        })}

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
                    <HStack gap={'3'}>
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
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const innvilgelsesperiode = innvilgelsesperioder.at(index)!;

    const tiltaksdeltakelsesperiode = hentHeleTiltaksdeltakelsesperioden(behandling);

    const { periode, antallDagerPerMeldeperiode, tiltaksdeltakelseId } = innvilgelsesperiode;

    const harValgtGyldigTiltak = tiltaksdeltakelser.some(
        (tiltak) => tiltak.eksternDeltagelseId === tiltaksdeltakelseId,
    );

    return (
        <HStack gap={'3'} align={'end'}>
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
                value={tiltaksdeltakelseId}
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
                    <option
                        disabled={true}
                    >{`Ugyldig tiltak med id: ${tiltaksdeltakelseId}`}</option>
                )}
                {tiltaksdeltakelser.map((tiltak) => {
                    const { eksternDeltagelseId } = tiltak;

                    return (
                        <option value={eksternDeltagelseId} key={eksternDeltagelseId}>
                            {tiltakVisningsnavn(tiltak, tiltaksdeltakelser)}
                        </option>
                    );
                })}
            </Select>

            {!harValgtGyldigTiltak && (
                <Alert variant={'error'} size={'small'} inline={true}>
                    {'Kan ikke innvilge for dette tiltaket'}
                </Alert>
            )}

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
