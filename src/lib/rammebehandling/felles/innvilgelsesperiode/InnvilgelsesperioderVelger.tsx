import { Fragment, useEffect } from 'react';
import {
    BodyShort,
    Button,
    Checkbox,
    Heading,
    HGrid,
    HStack,
    InlineMessage,
    Select,
    Table,
    VStack,
} from '@navikt/ds-react';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    BehandlingInnvilgelseContext,
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { InnvilgelsesperioderVarsler } from '~/lib/rammebehandling/felles/innvilgelsesperiode/varsler/InnvilgelsesperioderVarsler';
import {
    AntallDagerForPeriode,
    hentInnvilgedePerioder,
    InnvilgelseForTiltak,
    Innvilgelsesperioder,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    InnvilgelseHullVarsel,
    VedtaksperioderUtenInnvilgelseVarsel,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/varsler/InnvilgelseHullVarsel';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    erFullstendigPeriode,
    finnPeriodiseringHull,
    inneholderHelePerioden,
    perioderErLike,
    periodiseringTotalPeriode,
} from '~/utils/periode';
import { MedPeriode, Periode, ÅpenPeriode } from '~/types/Periode';
import { classNames } from '~/utils/classNames';
import {
    finnUgyldigTiltaksdeltakelse,
    ugyldigTiltaksdeltakelseTekst,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';
import {
    ReversertOpphørMelding,
    ReversertOpphørTag,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/reversertOpphør/ReversertOpphørMerking';
import {
    erSammeTiltak,
    hentAvgrensningForNyttTiltak,
    hentDelperioder,
    hentTiltakSomKanVelges,
    MAKS_ANTALL_DAGER_PER_MELDEPERIODE,
    TiltakNøkkel,
    tiltakNøkkelTekst,
    TiltakSomKanVelges,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { hentTiltaksdeltakelser } from '~/lib/rammebehandling/rammebehandlingUtils';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { useSak } from '~/lib/sak/SakContext';
import {
    dateTilISOTekst,
    datoTilDatoInputText,
    formaterDatotekst,
    formaterPeriode,
} from '~/utils/date';

import style from './InnvilgelsesperioderVelger.module.css';

export const InnvilgelsesperioderVelger = () => {
    const { behandling } = useBehandling();
    const { kanSendeInnHelgForMeldekort } = useSak().sak;

    const skjema = useBehandlingInnvilgelseSkjema();
    const { innvilgelse, erReadonly } = skjema;
    const { innvilgelsesperioder } = innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const vedtaksperiode = hentVedtaksperiodeForOmgjøring(skjema);

    const tiltakSomKanVelges = hentTiltakSomKanVelges(
        behandling,
        innvilgelsesperioder.tiltak,
        vedtaksperiode,
    );

    // Ved kun ett tiltak er det alltid valgt, og vises uten checkbox
    const ettTiltak =
        tiltakSomKanVelges.length === 1 && tiltakSomKanVelges[0].erGyldig
            ? tiltakSomKanVelges[0]
            : null;

    const ettTiltakErValgt =
        ettTiltak !== null &&
        innvilgelsesperioder.tiltak.some((it) => erSammeTiltak(it, ettTiltak));

    useEffect(() => {
        if (ettTiltak && !ettTiltakErValgt && !erReadonly) {
            dispatch({
                type: 'velgTiltak',
                payload: {
                    tiltak: ettTiltak,
                    valgt: true,
                    behandling,
                    kanSendeInnHelgForMeldekort,
                    vedtaksperiode,
                    avgrensning: hentAvgrensningForNyttTiltak(
                        behandling,
                        ettTiltak,
                        vedtaksperiode,
                    ),
                },
            });
        }
    }, [
        ettTiltak,
        ettTiltakErValgt,
        erReadonly,
        dispatch,
        behandling,
        kanSendeInnHelgForMeldekort,
        vedtaksperiode,
    ]);

    if (tiltakSomKanVelges.length === 0) {
        return (
            <Infokort variant={'feil'} size={'small'}>
                {'Ingen tiltaksdeltakelser i saksopplysningene kan innvilges'}
            </Infokort>
        );
    }

    const innvilgedePerioder = hentInnvilgedePerioder(innvilgelsesperioder);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.FullBredde>
                <VStack gap={'space-16'}>
                    {!erReadonly && (
                        <TiltaksdeltakelsenErEndretVarsel
                            behandling={behandling}
                            innvilgelsesperioder={innvilgelsesperioder.tiltak}
                        />
                    )}
                    <BodyShort size={'medium'} weight={'semibold'}>
                        {erReadonly
                            ? 'Tiltak'
                            : ettTiltak
                              ? 'Innvilgelsesperioder'
                              : 'Tiltak og innvilgelsesperioder'}
                    </BodyShort>

                    {tiltakSomKanVelges.map((tiltak) => (
                        <TiltakValg
                            tiltak={tiltak}
                            valgt={innvilgelsesperioder.tiltak.find((it) =>
                                erSammeTiltak(it, tiltak),
                            )}
                            antallDager={
                                ettTiltak ? innvilgelsesperioder.antallDagerPerMeldeperiode : null
                            }
                            visCheckbox={!ettTiltak}
                            vedtaksperiode={vedtaksperiode}
                            key={tiltakNøkkelTekst(tiltak)}
                        />
                    ))}

                    {!ettTiltak && innvilgelsesperioder.antallDagerPerMeldeperiode.length > 0 && (
                        <AntallDagerForDelperioder
                            innvilgelsesperioder={innvilgelsesperioder}
                            tiltakSomKanVelges={tiltakSomKanVelges}
                        />
                    )}

                    {innvilgedePerioder.length > 0 && (
                        <VStack gap={'space-12'} align={'start'}>
                            <InnvilgedePerioderVarsler innvilgedePerioder={innvilgedePerioder} />
                            <InnvilgelsesperioderVarsler
                                innvilgelsesperioder={innvilgelsesperioder}
                            />
                        </VStack>
                    )}
                </VStack>
            </VedtakSeksjon.FullBredde>
        </VedtakSeksjon>
    );
};

type TiltakValgProps = {
    tiltak: TiltakSomKanVelges;
    valgt: InnvilgelseForTiltak | undefined;
    // Ved ett tiltak velges antall dager per periode i boksen. Ellers velges det for delperiodene under tiltakene.
    antallDager: AntallDagerForPeriode[] | null;
    visCheckbox: boolean;
    vedtaksperiode: Partial<Periode> | undefined;
};

const TiltakValg = ({
    tiltak,
    valgt,
    antallDager,
    visCheckbox,
    vedtaksperiode,
}: TiltakValgProps) => {
    const { behandling } = useBehandling();
    const { kanSendeInnHelgForMeldekort } = useSak().sak;
    const { erReadonly } = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const { internDeltakelseId, erReversertOpphør, typeNavn, innvilgbarePerioder, erGyldig } =
        tiltak;

    const deltakelse = hentTiltaksdeltakelser(behandling).find(
        (it) => it.internDeltakelseId === internDeltakelseId,
    );

    const perioder = valgt?.perioder ?? [];

    const navn = erReversertOpphør ? `${typeNavn} – reversert opphør` : typeNavn;

    const harPeriodeUtenforVedtaksperioden =
        !!vedtaksperiode &&
        erFullstendigPeriode(vedtaksperiode) &&
        perioder.some(({ periode }) => !inneholderHelePerioden(vedtaksperiode, periode));

    const ugyldigeTiltaksdeltakelser = perioder
        .map(({ periode }) => finnUgyldigTiltaksdeltakelse(behandling, tiltak, periode))
        .filter((it) => it !== null);

    const harFeil =
        !!valgt &&
        (!erGyldig || harPeriodeUtenforVedtaksperioden || ugyldigeTiltaksdeltakelser.length > 0);

    return (
        <HGrid
            columns={{ xs: 1, md: '2fr 3fr' }}
            gap={'space-24'}
            className={classNames(style.tiltak, harFeil && style.tiltakMedFeil)}
            role={'group'}
            aria-label={navn}
        >
            <VStack gap={'space-8'}>
                <HStack gap={'space-8'} align={'center'} wrap={false}>
                    {visCheckbox && (
                        <Checkbox
                            size={'small'}
                            hideLabel={true}
                            checked={!!valgt}
                            readOnly={erReadonly}
                            disabled={!valgt && !erGyldig}
                            onChange={(event) =>
                                dispatch({
                                    type: 'velgTiltak',
                                    payload: {
                                        tiltak,
                                        valgt: event.target.checked,
                                        behandling,
                                        kanSendeInnHelgForMeldekort,
                                        vedtaksperiode,
                                        avgrensning: hentAvgrensningForNyttTiltak(
                                            behandling,
                                            tiltak,
                                            vedtaksperiode,
                                        ),
                                    },
                                })
                            }
                        >
                            {navn}
                        </Checkbox>
                    )}
                    <Heading size={'xsmall'} level={'3'}>
                        {typeNavn}
                    </Heading>
                    {erReversertOpphør && <ReversertOpphørTag />}
                </HStack>

                <VStack gap={'space-8'} className={classNames(visCheckbox && style.detaljer)}>
                    {deltakelse && (
                        <>
                            <Opplysning
                                navn={'Deltakelsesperiode'}
                                verdi={formaterÅpenPeriode(deltakelse.periode)}
                            />
                            <Opplysning
                                navn={'Antall dager per uke'}
                                verdi={deltakelse.antallDagerPerUke?.toString() ?? 'Ikke oppgitt'}
                            />
                        </>
                    )}

                    {!erGyldig && (
                        <InlineMessage status={'error'} size={'small'}>
                            {'Kan ikke innvilge for dette tiltaket'}
                        </InlineMessage>
                    )}

                    {ugyldigeTiltaksdeltakelser.map((it) => (
                        <InlineMessage
                            status={'error'}
                            size={'small'}
                            key={ugyldigTiltaksdeltakelseTekst(it)}
                        >
                            {ugyldigTiltaksdeltakelseTekst(it)}
                        </InlineMessage>
                    ))}

                    {valgt && erReversertOpphør && erGyldig && (
                        <ReversertOpphørMelding
                            behandling={behandling}
                            internDeltakelseId={internDeltakelseId}
                            perioder={perioder.map((it) => it.periode)}
                        />
                    )}

                    {harPeriodeUtenforVedtaksperioden && (
                        <InlineMessage status={'error'} size={'small'}>
                            {'Innvilgelsesperiodene må være innenfor valgt vedtaksperiode'}
                        </InlineMessage>
                    )}
                </VStack>
            </VStack>

            {valgt && (
                <VStack gap={'space-8'}>
                    {perioder.map(({ periode }, index) => (
                        <HStack key={index} gap={'space-16'} align={'end'}>
                            <PeriodeDatovelgere
                                tiltak={tiltak}
                                periode={periode}
                                index={index}
                                innvilgbarePerioder={innvilgbarePerioder}
                            />
                            {antallDager && (
                                <AntallDagerVelger
                                    label={'Dager per meldeperiode'}
                                    index={antallDager.findIndex((it) =>
                                        perioderErLike(it.periode, periode),
                                    )}
                                    antallDager={antallDager}
                                />
                            )}
                            {!erReadonly && perioder.length > 1 && (
                                <Button
                                    type={'button'}
                                    variant={'tertiary'}
                                    size={'small'}
                                    icon={<TrashIcon title={'Fjern periode'} />}
                                    onClick={() =>
                                        dispatch({
                                            type: 'fjernTiltakPeriode',
                                            payload: {
                                                tiltak,
                                                index,
                                                behandling,
                                                kanSendeInnHelgForMeldekort,
                                            },
                                        })
                                    }
                                />
                            )}
                        </HStack>
                    ))}

                    {!erReadonly && erGyldig && (
                        <Button
                            type={'button'}
                            variant={'secondary'}
                            size={'small'}
                            icon={<PlusIcon aria-hidden />}
                            className={style.leggTilKnapp}
                            onClick={() =>
                                dispatch({
                                    type: 'leggTilTiltakPeriode',
                                    payload: {
                                        tiltak,
                                        behandling,
                                        kanSendeInnHelgForMeldekort,
                                        vedtaksperiode,
                                    },
                                })
                            }
                        >
                            {'Legg til periode'}
                        </Button>
                    )}
                </VStack>
            )}
        </HGrid>
    );
};

type AntallDagerForDelperioderProps = {
    innvilgelsesperioder: Innvilgelsesperioder;
    tiltakSomKanVelges: TiltakSomKanVelges[];
};

// Periodene for de valgte tiltakene deles opp der tiltakene starter eller slutter, og hver delperiode får sitt eget antall dager
const AntallDagerForDelperioder = ({
    innvilgelsesperioder,
    tiltakSomKanVelges,
}: AntallDagerForDelperioderProps) => {
    const delperioder = hentDelperioder(innvilgelsesperioder.tiltak);
    const { antallDagerPerMeldeperiode } = innvilgelsesperioder;

    const tiltaksnavn = (tiltak: TiltakNøkkel) => {
        const typeNavn =
            tiltakSomKanVelges.find((it) => erSammeTiltak(it, tiltak))?.typeNavn ??
            tiltak.internDeltakelseId;

        return tiltak.erReversertOpphør ? `${typeNavn} – reversert opphør` : typeNavn;
    };

    return (
        <VStack gap={'space-8'} className={style.tiltak}>
            <Table size={'small'}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope={'col'}>{'Periode'}</Table.HeaderCell>
                        <Table.HeaderCell scope={'col'}>{'Tiltak'}</Table.HeaderCell>
                        <Table.HeaderCell scope={'col'}>
                            {'Dager per meldeperiode'}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {antallDagerPerMeldeperiode.map(({ periode }, index) => (
                        <Table.Row key={`${periode.fraOgMed}-${periode.tilOgMed}`}>
                            <Table.DataCell>{formaterPeriode(periode)}</Table.DataCell>
                            <Table.DataCell>
                                {(delperioder.at(index)?.tiltak ?? []).map(tiltaksnavn).join(', ')}
                            </Table.DataCell>
                            <Table.DataCell>
                                <AntallDagerVelger
                                    label={`Dager per meldeperiode for ${formaterPeriode(periode)}`}
                                    hideLabel={true}
                                    index={index}
                                    antallDager={antallDagerPerMeldeperiode}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    );
};

type AntallDagerVelgerProps = {
    label: string;
    hideLabel?: boolean;
    // Index for delperioden i antallDager
    index: number;
    antallDager: AntallDagerForPeriode[];
};

const AntallDagerVelger = ({ label, hideLabel, index, antallDager }: AntallDagerVelgerProps) => {
    const { erReadonly } = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const valgt = antallDager.at(index);

    if (!valgt) {
        return null;
    }

    return (
        <Select
            label={label}
            hideLabel={hideLabel}
            size={'small'}
            readOnly={erReadonly}
            value={valgt.antallDagerPerMeldeperiode}
            onChange={(event) =>
                dispatch({
                    type: 'settAntallDager',
                    payload: { index, antallDager: Number(event.target.value) },
                })
            }
        >
            {Array.from({ length: MAKS_ANTALL_DAGER_PER_MELDEPERIODE }).map((_, i) => (
                <option value={i + 1} key={i + 1}>
                    {i + 1}
                </option>
            ))}
        </Select>
    );
};

type PeriodeDatovelgereProps = {
    tiltak: TiltakSomKanVelges;
    periode: Periode;
    index: number;
    innvilgbarePerioder: Periode[];
};

const PeriodeDatovelgere = ({
    tiltak,
    periode,
    index,
    innvilgbarePerioder,
}: PeriodeDatovelgereProps) => {
    const { behandling } = useBehandling();
    const { kanSendeInnHelgForMeldekort } = useSak().sak;
    const { erReadonly } = useBehandlingInnvilgelseSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const medPerioder = innvilgbarePerioder.map((it) => ({ periode: it }));
    const total = medPerioder.length > 0 ? periodiseringTotalPeriode(medPerioder) : undefined;

    const oppdater = (periodeOppdatering: Partial<Periode>) =>
        dispatch({
            type: 'oppdaterTiltakPeriode',
            payload: {
                tiltak,
                index,
                periodeOppdatering,
                behandling,
                kanSendeInnHelgForMeldekort,
            },
        });

    const felles = {
        size: 'small',
        dropdownCaption: true,
        readOnly: erReadonly,
        minDate: total?.fraOgMed,
        maxDate: total?.tilOgMed,
        disabledPerioder: finnPeriodiseringHull(medPerioder),
    } as const;

    return (
        <>
            <Datovelger
                {...felles}
                label={'Fra og med'}
                selected={periode.fraOgMed}
                value={datoTilDatoInputText(periode.fraOgMed)}
                onDateChange={(dato) => {
                    if (dato) {
                        oppdater({ fraOgMed: dateTilISOTekst(dato) });
                    }
                }}
            />
            <Datovelger
                {...felles}
                label={'Til og med'}
                selected={periode.tilOgMed}
                value={datoTilDatoInputText(periode.tilOgMed)}
                onDateChange={(dato) => {
                    if (dato) {
                        oppdater({ tilOgMed: dateTilISOTekst(dato) });
                    }
                }}
            />
        </>
    );
};

// Hull og manglende innvilgelse i vedtaksperioden vurderes for periodene det innvilges for samlet
const InnvilgedePerioderVarsler = ({
    innvilgedePerioder,
}: {
    innvilgedePerioder: MedPeriode[];
}) => (
    <VedtaksperioderUtenInnvilgelseVarsel>
        {innvilgedePerioder.map((it, index, array) => (
            <Fragment key={`${it.periode.fraOgMed}-${it.periode.tilOgMed}`}>
                <InnvilgelseHullVarsel
                    forrigePeriode={it.periode}
                    nestePeriode={array.at(index + 1)?.periode}
                />
            </Fragment>
        ))}
    </VedtaksperioderUtenInnvilgelseVarsel>
);

// Samme formatering som saksopplysningene, med verdien i fet skrift
const Opplysning = ({ navn, verdi }: { navn: string; verdi: string }) => (
    <BodyShort size={'small'}>
        {`${navn}: `}
        <strong>{verdi}</strong>
    </BodyShort>
);

const TiltaksdeltakelsenErEndretVarsel = ({
    behandling,
    innvilgelsesperioder,
}: {
    behandling: Rammebehandling;
    innvilgelsesperioder: InnvilgelseForTiltak[];
}) => {
    const skalVises = innvilgelsesperioder.some((tiltak) =>
        tiltak.perioder.some(
            ({ periode }) => finnUgyldigTiltaksdeltakelse(behandling, tiltak, periode) !== null,
        ),
    );

    if (!skalVises) {
        return null;
    }

    return (
        <Infokort variant={'advarsel'} size={'small'}>
            {'Tiltaksdeltakelsen er endret, og valgte innvilgelsesperioder er ikke lenger gyldige.'}
        </Infokort>
    );
};

const hentVedtaksperiodeForOmgjøring = (
    skjema: BehandlingInnvilgelseContext,
): Partial<Periode> | undefined =>
    skjema.resultat === RevurderingResultat.OMGJØRING ? skjema.vedtaksperiode : undefined;

const formaterÅpenPeriode = ({ fraOgMed, tilOgMed }: ÅpenPeriode) =>
    `${fraOgMed ? formaterDatotekst(fraOgMed) : 'Mangler startdato'} - ${tilOgMed ? formaterDatotekst(tilOgMed) : 'Mangler sluttdato'}`;
