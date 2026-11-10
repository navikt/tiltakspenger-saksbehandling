import {
    BehandlingInnvilgelseContext,
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { hentInnvilgbarePerioder } from '~/lib/rammebehandling/rammebehandlingUtils';
import { useSak } from '~/lib/sak/SakContext';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Button, Heading, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { InnvilgelsesperiodeDatovelgere } from '~/lib/rammebehandling/felles/innvilgelsesperiode/InnvilgelsesperiodeDatoVelgere';
import { InnvilgelsesperioderVarsler } from '~/lib/rammebehandling/felles/innvilgelsesperiode/varsler/InnvilgelsesperioderVarsler';
import { XMarkIcon } from '@navikt/aksel-icons';
import { InnvilgbarTiltaksperiode } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { formaterPeriode } from '~/utils/date';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { Fragment } from 'react';
import {
    InnvilgelseHullVarsel,
    VedtaksperioderUtenInnvilgelseVarsel,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/varsler/InnvilgelseHullVarsel';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { erFullstendigPeriode, inneholderHelePerioden } from '~/utils/periode';
import { Periode } from '~/types/Periode';
import { classNames } from '~/utils/classNames';
import {
    finnUgyldigTiltaksdeltakelse,
    ugyldigTiltaksdeltakelseTekst,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';

import { PeriodeForReversertOpphør } from '~/lib/rammebehandling/typer/ReversertOpphør';
import {
    erInnenforPeriodeForReversertOpphør,
    hentPerioderForReversertOpphør,
    hentPerioderForReversertOpphørIVedtaksperioden,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/reversertOpphørUtils';
import {
    ReversertOpphørMelding,
    ReversertOpphørTag,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/ReversertOpphørMerking';

import style from './InnvilgelsesperioderVelger.module.css';

// Skiller valg av reversert opphør fra valg av samme tiltaksdeltakelse med gyldig deltakelse i nedtrekkslisten
const REVERSERT_OPPHØR_PREFIX = 'reversert-opphor:';

export const InnvilgelsesperioderVelger = () => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseSkjema();
    const { innvilgelsesperioder, harValgtPeriode } = innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    if (innvilgelsesperioder.length === 0) {
        throw Error('Minst en innvilgelsesperiode skal alltid finnes!');
    }

    const innvilgbarePerioder = hentInnvilgbarePerioder(behandling);
    const perioderForReversertOpphør = hentPerioderForReversertOpphør(behandling);

    // Datovelgerne tillater både gyldige tiltaksperioder og perioder for reversert opphør
    const perioderSomKanVelges = [...innvilgbarePerioder, ...perioderForReversertOpphør];

    if (perioderSomKanVelges.length === 0) {
        return (
            <Infokort variant={'feil'} size={'small'}>
                {'Ingen tiltaksdeltakelser i saksopplysningene kan innvilges'}
            </Infokort>
        );
    }

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <Heading size={'small'} level={'2'} spacing={true}>
                    {'Innvilgelsesperioder'}
                </Heading>
                {!erReadonly && innvilgelse.harValgtPeriode && (
                    <TiltaksdeltakelsenErEndretVarsel
                        behandling={behandling}
                        innvilgelsesperioder={innvilgelse.innvilgelsesperioder}
                    />
                )}
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.FullBredde>
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
                                            innvilgbarePerioder={innvilgbarePerioder}
                                            perioderForReversertOpphør={perioderForReversertOpphør}
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
                            periode={innvilgelsesperioder.atNonNull(0).periode}
                            innvilgbarePerioder={perioderSomKanVelges}
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
    innvilgbarePerioder: InnvilgbarTiltaksperiode[];
    perioderForReversertOpphør: PeriodeForReversertOpphør[];
    behandling: Rammebehandling;
    sak: SakProps;
    index: number;
    readOnly: boolean;
};

const InnvilgelsesperiodeVelgerFull = ({
    innvilgelsesperioder,
    innvilgbarePerioder,
    perioderForReversertOpphør,
    behandling,
    sak,
    index,
    readOnly,
}: VelgerFullProps) => {
    const skjemaContext = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const innvilgelsesperiode = innvilgelsesperioder.atNonNull(index);

    const { periode, antallDagerPerMeldeperiode, internDeltakelseId, erReversertOpphør } =
        innvilgelsesperiode;

    const harValgtGyldigTiltak = (
        erReversertOpphør ? perioderForReversertOpphør : innvilgbarePerioder
    ).some((tiltak) => tiltak.internDeltakelseId === internDeltakelseId);

    const harUgyldigReversertOpphør =
        !!erReversertOpphør &&
        harValgtGyldigTiltak &&
        !erInnenforPeriodeForReversertOpphør(behandling, innvilgelsesperiode);

    const reversertOpphørValg = hentReversertOpphørValg(
        skjemaContext,
        behandling,
        innvilgelsesperiode,
    );

    const antallTiltaksvalg = innvilgbarePerioder.length + reversertOpphørValg.length;

    const harValgtUgyldigPeriodeForOmgjøring = harValgtUtenforVedtaksperiodeForOmgjøring(
        skjemaContext,
        periode,
    );

    const ugyldigTiltaksdeltakelse = finnUgyldigTiltaksdeltakelse(behandling, innvilgelsesperiode);

    const harFeil =
        !harValgtGyldigTiltak ||
        harValgtUgyldigPeriodeForOmgjøring ||
        harUgyldigReversertOpphør ||
        ugyldigTiltaksdeltakelse !== null;

    return (
        <VStack gap={'space-8'} className={classNames(harFeil && style.feilOmriss)}>
            {erReversertOpphør && <ReversertOpphørTag />}
            <HStack gap={'space-12'} align={'end'}>
                <InnvilgelsesperiodeDatovelgere
                    periode={periode}
                    innvilgbarePerioder={[...innvilgbarePerioder, ...perioderForReversertOpphør]}
                    index={index}
                    readOnly={readOnly}
                />
                <Select
                    label={'Antall dager per meldeperiode'}
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
                    readOnly={readOnly || (antallTiltaksvalg === 1 && harValgtGyldigTiltak)}
                    value={
                        erReversertOpphør
                            ? `${REVERSERT_OPPHØR_PREFIX}${internDeltakelseId}`
                            : internDeltakelseId
                    }
                    onChange={(event) => {
                        const verdi = event.target.value;
                        const erReversertOpphør = verdi.startsWith(REVERSERT_OPPHØR_PREFIX);

                        dispatch({
                            type: 'settTiltaksdeltakelse',
                            payload: {
                                internDeltakelseId: erReversertOpphør
                                    ? verdi.slice(REVERSERT_OPPHØR_PREFIX.length)
                                    : verdi,
                                erReversertOpphør,
                                index,
                            },
                        });
                    }}
                >
                    {!harValgtGyldigTiltak && (
                        <option
                            disabled={true}
                        >{`Ugyldig tiltak med id: ${internDeltakelseId}`}</option>
                    )}
                    {innvilgbarePerioder.map((tiltak) => {
                        const { internDeltakelseId } = tiltak;

                        return (
                            <option value={internDeltakelseId} key={internDeltakelseId}>
                                {tiltakVisningsnavn(tiltak, innvilgbarePerioder)}
                            </option>
                        );
                    })}
                    {reversertOpphørValg.map(({ internDeltakelseId, typeNavn }) => (
                        <option
                            value={`${REVERSERT_OPPHØR_PREFIX}${internDeltakelseId}`}
                            key={`${REVERSERT_OPPHØR_PREFIX}${internDeltakelseId}`}
                        >
                            {`Reversert opphør: ${typeNavn}`}
                        </option>
                    ))}
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

            {ugyldigTiltaksdeltakelse ? (
                <InlineMessage status={'error'} size={'small'}>
                    {ugyldigTiltaksdeltakelseTekst(ugyldigTiltaksdeltakelse)}
                </InlineMessage>
            ) : (
                !harValgtGyldigTiltak && (
                    <InlineMessage status={'error'} size={'small'}>
                        {'Kan ikke innvilge for dette tiltaket'}
                    </InlineMessage>
                )
            )}

            {erReversertOpphør && harValgtGyldigTiltak && (
                <ReversertOpphørMelding
                    behandling={behandling}
                    innvilgelsesperiode={innvilgelsesperiode}
                />
            )}

            {harValgtUgyldigPeriodeForOmgjøring && (
                <InlineMessage status={'error'} size={'small'}>
                    {'Innvilgelsesperioden må være innenfor valgt vedtaksperiode'}
                </InlineMessage>
            )}
        </VStack>
    );
};

const TiltaksdeltakelsenErEndretVarsel = ({
    behandling,
    innvilgelsesperioder,
}: {
    behandling: Rammebehandling;
    innvilgelsesperioder: Innvilgelsesperiode[];
}) => {
    const skalVises = innvilgelsesperioder.some(
        (it) => finnUgyldigTiltaksdeltakelse(behandling, it) !== null,
    );

    if (!skalVises) {
        return null;
    }

    return (
        <Infokort variant={'advarsel'} size={'small'} className={style.endretVarsel}>
            {'Tiltaksdeltakelsen er endret, og valgte innvilgelsesperioder er ikke lenger gyldige.'}
        </Infokort>
    );
};

const tiltakVisningsnavn = (
    innvilgbarPeriode: InnvilgbarTiltaksperiode,
    innvilgbarePerioder: InnvilgbarTiltaksperiode[],
): string => {
    const perioderMedType = innvilgbarePerioder.filter(
        (t) => t.typeNavn === innvilgbarPeriode.typeNavn,
    );

    if (perioderMedType.length > 1) {
        return `${innvilgbarPeriode.typeNavn} (${formaterPeriode(innvilgbarPeriode.periode)})`;
    } else {
        return innvilgbarPeriode.typeNavn;
    }
};

/**
 * Reversert opphør kan bare velges for tiltaksdeltakelser med perioder som kan reverseres innenfor den valgte vedtaksperioden.
 * Et reversert opphør som allerede er valgt, beholdes som valg, slik at nedtrekkslisten fortsatt viser det.
 * En tiltaksdeltakelse kan ha flere perioder for reversert opphør, men vises som ett valg.
 */
const hentReversertOpphørValg = (
    skjemaContext: BehandlingInnvilgelseContext,
    behandling: Rammebehandling,
    innvilgelsesperiode: Innvilgelsesperiode,
): PeriodeForReversertOpphør[] => {
    const iVedtaksperioden =
        skjemaContext.resultat === RevurderingResultat.OMGJØRING
            ? hentPerioderForReversertOpphørIVedtaksperioden(
                  behandling,
                  skjemaContext.vedtaksperiode,
              )
            : [];

    const valgt = innvilgelsesperiode.erReversertOpphør
        ? hentPerioderForReversertOpphør(behandling).filter(
              (it) => it.internDeltakelseId === innvilgelsesperiode.internDeltakelseId,
          )
        : [];

    return [...iVedtaksperioden, ...valgt].filter(
        (it, index, array) =>
            array.findIndex((annen) => annen.internDeltakelseId === it.internDeltakelseId) ===
            index,
    );
};

const harValgtUtenforVedtaksperiodeForOmgjøring = (
    skjemaContext: BehandlingInnvilgelseContext,
    valgtPeriode: Periode,
) => {
    return (
        skjemaContext.resultat === RevurderingResultat.OMGJØRING &&
        erFullstendigPeriode(skjemaContext.vedtaksperiode) &&
        !inneholderHelePerioden(skjemaContext.vedtaksperiode, valgtPeriode)
    );
};
