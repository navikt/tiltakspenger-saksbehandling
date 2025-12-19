import {
    useBehandlingInnvilgelseSkjemaDispatch,
    useBehandlingInnvilgelseSkjema,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import {
    hentHeleTiltaksdeltagelsesperioden,
    hentTiltaksdeltakelserMedStartOgSluttdato,
} from '~/utils/behandling';
import { useSak } from '~/context/sak/SakContext';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { Alert, Button, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { Innvilgelsesperiode } from '~/types/Innvilgelsesperiode';
import { XMarkIcon } from '@navikt/aksel-icons';
import { TiltaksdeltagelseMedPeriode } from '~/types/TiltakDeltagelseTypes';
import { InnvilgelsesperiodeDatovelgere } from '~/components/behandling/felles/innvilgelsesperiode/datovelgere/InnvilgelsesperiodeDatoVelgere';
import { Rammebehandling } from '~/types/Rammebehandling';
import { SakProps } from '~/types/Sak';

import style from './InnvilgelsesperioderVelger.module.css';

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
    const tiltaksdeltagelsesperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperioder'}
                </Heading>
                {harValgtPeriode ? (
                    <VStack gap={'2'} align={'start'}>
                        {innvilgelsesperioder.map((it, index) => (
                            <Valg
                                innvilgelsesperioder={innvilgelsesperioder}
                                index={index}
                                tiltaksdeltakelser={tiltaksdeltakelser}
                                behandling={behandling}
                                sak={sak}
                                key={`${it.periode.fraOgMed}-${it.periode.tilOgMed}`}
                            />
                        ))}

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
                    </VStack>
                ) : (
                    <InnvilgelsesperiodeDatovelgere
                        periode={innvilgelsesperioder.at(0)!.periode}
                        tiltaksdeltakelsesperiode={tiltaksdeltagelsesperiode}
                        index={0}
                    />
                )}
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type ValgProps = {
    innvilgelsesperioder: Innvilgelsesperiode[];
    tiltaksdeltakelser: TiltaksdeltagelseMedPeriode[];
    behandling: Rammebehandling;
    sak: SakProps;
    index: number;
};

const Valg = ({ innvilgelsesperioder, tiltaksdeltakelser, behandling, sak, index }: ValgProps) => {
    const { erReadonly } = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const innvilgelsesperiode = innvilgelsesperioder.at(index)!;

    const tiltaksdeltagelsesperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    const { periode, antallDagerPerMeldeperiode, tiltaksdeltakelseId } = innvilgelsesperiode;

    const harValgtGyldigTiltak = tiltaksdeltakelser.some(
        (tiltak) => tiltak.eksternDeltagelseId === tiltaksdeltakelseId,
    );

    return (
        <HStack gap={'5'}>
            <InnvilgelsesperiodeDatovelgere
                periode={periode}
                tiltaksdeltakelsesperiode={tiltaksdeltagelsesperiode}
                index={index}
            />

            <Select
                label={'Antall dager'}
                size={'small'}
                readOnly={erReadonly}
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
                readOnly={erReadonly || (tiltaksdeltakelser.length === 1 && harValgtGyldigTiltak)}
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
                {!harValgtGyldigTiltak && <option disabled={true}>{tiltaksdeltakelseId}</option>}
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
                <Alert variant={'error'} size={'small'} inline={true} className={style.alignBunn}>
                    {'Kan ikke innvilge for dette tiltaket'}
                </Alert>
            )}

            {innvilgelsesperioder.length > 1 && !erReadonly && (
                <Button
                    type={'button'}
                    variant={'tertiary'}
                    size={'small'}
                    icon={<XMarkIcon />}
                    className={style.alignBunn}
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
