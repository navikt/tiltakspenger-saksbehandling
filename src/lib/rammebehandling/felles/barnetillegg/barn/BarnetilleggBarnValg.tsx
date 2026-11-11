import {
    BodyShort,
    Button,
    Checkbox,
    HGrid,
    HStack,
    InlineMessage,
    Radio,
    RadioGroup,
    Tag,
    VStack,
} from '@navikt/ds-react';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { BarnetilleggKandidat } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    BarnetilleggBarnSkjema,
    effektivePerioderForSkjemaBarn,
    erBarnFraSaksbehandler,
    formaterBarnNavn,
    gyldigPeriodeForBarn,
    rettTilBarnetilleggPeriode,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { Periode } from '~/types/Periode';
import { Dato } from '~/types/DatoTid';
import {
    alderFraDato,
    dateTilISOTekst,
    datoTilDatoInputText,
    finn16årsdag,
    formaterDatotekst,
    formaterPeriode,
    formaterSladdbarDatotekst,
} from '~/utils/date';
import { erSladdet, formaterSladdbarVerdi, sladdbarTekst } from '~/utils/sladdetVerdi';
import { totalPeriode } from '~/utils/periode';
import { oppholdsstedTekst, formaterSøknadsspørsmålSvar } from '~/lib/søknad/søknadTekster';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';

import style from './BarnetilleggBarn.module.css';

type Props = {
    kandidat: BarnetilleggKandidat;
};

export const BarnetilleggBarnValg = ({ kandidat }: Props) => {
    const { barn, erValgt, søknadsopplysninger, kanFjernes } = kandidat;
    const { fødselsdato, fnr } = barn;

    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const innvilgelsesperioder = innvilgelse.innvilgelsesperioder.map((it) => it.periode);

    const harSladdetFødselsdato = erSladdet(fødselsdato);
    const navn = formaterBarnNavn(barn) || 'Navn mangler';

    const oppholderSegUtenforEØS =
        søknadsopplysninger && søknadsopplysninger.oppholderSegIEØSSpm.svar !== 'JA';

    return (
        <div className={style.barn}>
            <HStack justify={'space-between'} align={'start'} wrap={false}>
                <Checkbox
                    size={'small'}
                    checked={erValgt}
                    readOnly={erReadonly}
                    disabled={!erValgt && harSladdetFødselsdato}
                    onChange={(event) =>
                        dispatch({
                            type: 'velgBarnetilleggBarn',
                            payload: { barn, valgt: event.target.checked },
                        })
                    }
                >
                    <HStack gap={'space-8'} align={'center'}>
                        <span>{navn}</span>
                        <Tag
                            size={'xsmall'}
                            variant={'outline'}
                            data-color={erBarnFraSaksbehandler(barn) ? 'neutral' : 'info'}
                        >
                            {erBarnFraSaksbehandler(barn)
                                ? 'Lagt til av saksbehandler'
                                : 'Fra søknad'}
                        </Tag>
                    </HStack>
                </Checkbox>

                {kanFjernes && !erReadonly && (
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        size={'xsmall'}
                        icon={<TrashIcon aria-hidden />}
                        onClick={() =>
                            dispatch({
                                type: 'fjernManueltBarnetilleggBarn',
                                payload: { key: barn.key },
                            })
                        }
                    >
                        {'Fjern'}
                    </Button>
                )}
            </HStack>

            <HGrid columns={{ xs: 1, md: 2 }} gap={'space-24'} className={style.detaljer}>
                <VStack gap={'space-8'}>
                    <Opplysning
                        navn={'Fødselsdato'}
                        verdi={`${formaterSladdbarDatotekst(fødselsdato)}${formaterSladdbarVerdi(fødselsdato, (dato) => ` (${alderFraDato(dato)} år)`, '', '')}`}
                    />
                    <Opplysning
                        navn={'Fødselsnummer'}
                        verdi={sladdbarTekst(fnr) || 'Ikke oppgitt'}
                    />

                    {søknadsopplysninger &&
                        (søknadsopplysninger.oppholdssted ? (
                            <Opplysning
                                navn={'Oppholdssted'}
                                verdi={oppholdsstedTekst[søknadsopplysninger.oppholdssted]}
                            />
                        ) : (
                            <Opplysning
                                navn={'Oppholder seg i Norge/EØS'}
                                verdi={formaterSøknadsspørsmålSvar(
                                    søknadsopplysninger.oppholderSegIEØSSpm.svar,
                                )}
                            />
                        ))}

                    {oppholderSegUtenforEØS && (
                        <InlineMessage status={'warning'} size={'small'}>
                            {
                                'Barnet oppholder seg ikke i Norge eller et annet EØS-land ifølge søknaden.'
                            }
                        </InlineMessage>
                    )}

                    {harSladdetFødselsdato ? (
                        <InlineMessage status={'warning'} size={'small'}>
                            {
                                'Fødselsdatoen er sladdet, så barnetillegget for barnet kan ikke vurderes.'
                            }
                        </InlineMessage>
                    ) : (
                        innvilgelsesperioder.length > 0 && (
                            <RettMerknad
                                fødselsdato={fødselsdato.verdi}
                                innvilgelsesperioder={innvilgelsesperioder}
                            />
                        )
                    )}
                </VStack>

                {erValgt && !harSladdetFødselsdato && innvilgelsesperioder.length > 0 && (
                    <ValgtPeriode
                        barn={barn}
                        innvilgelsesperioder={innvilgelsesperioder}
                        erReadonly={erReadonly}
                    />
                )}
            </HGrid>
        </div>
    );
};

// Samme formatering som saksopplysningene, med verdien i fet skrift
const Opplysning = ({ navn, verdi }: { navn: string; verdi: string }) => (
    <BodyShort size={'small'}>
        {`${navn}: `}
        <strong>{verdi}</strong>
    </BodyShort>
);

const RettMerknad = ({
    fødselsdato,
    innvilgelsesperioder,
}: {
    fødselsdato: Dato;
    innvilgelsesperioder: Periode[];
}) => {
    const total = totalPeriode(innvilgelsesperioder);
    const sekstenårsdag = finn16årsdag(fødselsdato);
    const rett = rettTilBarnetilleggPeriode(fødselsdato);

    if (fødselsdato > total.tilOgMed) {
        return (
            <InlineMessage status={'warning'} size={'small'}>
                {`Barnet er født ${formaterDatotekst(fødselsdato)}, etter innvilgelsesperioden, og har ikke rett til barnetillegg i perioden.`}
            </InlineMessage>
        );
    }

    if (rett.tilOgMed < total.fraOgMed) {
        return (
            <InlineMessage status={'warning'} size={'small'}>
                {`Barnet fylte 16 år ${formaterDatotekst(sekstenårsdag)}, før innvilgelsesperioden, og har ikke rett til barnetillegg i perioden.`}
            </InlineMessage>
        );
    }

    const fødtIPerioden = fødselsdato > total.fraOgMed;
    const fyller16IPerioden = sekstenårsdag <= total.tilOgMed;

    if (!fødtIPerioden && !fyller16IPerioden) {
        return null;
    }

    return (
        <InlineMessage status={'info'} size={'small'}>
            {fødtIPerioden &&
                `Barnet er født ${formaterDatotekst(fødselsdato)}, i innvilgelsesperioden. Barnetillegg gis tidligst fra fødselsdatoen.`}
            {fødtIPerioden && fyller16IPerioden && ' '}
            {fyller16IPerioden &&
                `Barnet fyller 16 år ${formaterDatotekst(sekstenårsdag)}. Barnetillegg gis til og med dagen før.`}
        </InlineMessage>
    );
};

const ValgtPeriode = ({
    barn,
    innvilgelsesperioder,
    erReadonly,
}: {
    barn: BarnetilleggBarnSkjema;
    innvilgelsesperioder: Periode[];
    erReadonly: boolean;
}) => {
    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const { perioder, key } = barn;
    const gyldigPeriode = gyldigPeriodeForBarn(barn, innvilgelsesperioder);
    const effektivePerioder = effektivePerioderForSkjemaBarn(barn, innvilgelsesperioder);

    return (
        <VStack gap={'space-12'}>
            <RadioGroup
                legend={'Periode med barnetillegg'}
                size={'small'}
                className={style.radioGroup}
                value={perioder === null}
                readOnly={erReadonly}
                onChange={(heleInnvilgelsesperioden: boolean) =>
                    dispatch({
                        type: 'settBarnetilleggPeriodevalg',
                        payload: { key, heleInnvilgelsesperioden },
                    })
                }
            >
                <Radio value={true}>{'Hele innvilgelsesperioden'}</Radio>
                <Radio value={false}>{'Velg perioder'}</Radio>
            </RadioGroup>

            {perioder && (
                <VStack gap={'space-8'}>
                    {perioder.map((periode, index) => (
                        <HStack key={index} gap={'space-16'} align={'end'}>
                            <Datovelger
                                label={'Fra og med'}
                                size={'small'}
                                dropdownCaption={true}
                                readOnly={erReadonly}
                                minDate={gyldigPeriode?.fraOgMed}
                                maxDate={gyldigPeriode?.tilOgMed}
                                selected={periode.fraOgMed}
                                value={datoTilDatoInputText(periode.fraOgMed)}
                                onDateChange={(dato) => {
                                    if (dato) {
                                        dispatch({
                                            type: 'oppdaterBarnetilleggBarnPeriode',
                                            payload: {
                                                key,
                                                index,
                                                periodeOppdatering: {
                                                    fraOgMed: dateTilISOTekst(dato),
                                                },
                                            },
                                        });
                                    }
                                }}
                            />
                            <Datovelger
                                label={'Til og med'}
                                size={'small'}
                                dropdownCaption={true}
                                readOnly={erReadonly}
                                minDate={gyldigPeriode?.fraOgMed}
                                maxDate={gyldigPeriode?.tilOgMed}
                                selected={periode.tilOgMed}
                                value={datoTilDatoInputText(periode.tilOgMed)}
                                onDateChange={(dato) => {
                                    if (dato) {
                                        dispatch({
                                            type: 'oppdaterBarnetilleggBarnPeriode',
                                            payload: {
                                                key,
                                                index,
                                                periodeOppdatering: {
                                                    tilOgMed: dateTilISOTekst(dato),
                                                },
                                            },
                                        });
                                    }
                                }}
                            />
                            {!erReadonly && perioder.length > 1 && (
                                <Button
                                    type={'button'}
                                    variant={'tertiary'}
                                    size={'small'}
                                    icon={<TrashIcon title={'Fjern periode'} />}
                                    onClick={() =>
                                        dispatch({
                                            type: 'fjernBarnetilleggBarnPeriode',
                                            payload: { key, index },
                                        })
                                    }
                                />
                            )}
                        </HStack>
                    ))}

                    {!erReadonly && (
                        <Button
                            type={'button'}
                            variant={'secondary'}
                            size={'small'}
                            icon={<PlusIcon aria-hidden />}
                            className={style.leggTilKnapp}
                            onClick={() =>
                                dispatch({
                                    type: 'leggTilBarnetilleggBarnPeriode',
                                    payload: { key },
                                })
                            }
                        >
                            {'Legg til periode'}
                        </Button>
                    )}
                </VStack>
            )}

            {effektivePerioder.length > 0 ? (
                <Opplysning
                    navn={
                        effektivePerioder.length > 1
                            ? 'Gir barnetillegg i periodene'
                            : 'Gir barnetillegg i perioden'
                    }
                    verdi={effektivePerioder.map(formaterPeriode).join(', ')}
                />
            ) : (
                <InlineMessage status={'error'} size={'small'}>
                    {'Barnet gir ikke barnetillegg i innvilgelsesperioden med valgte perioder.'}
                </InlineMessage>
            )}
        </VStack>
    );
};
