import {
    BodyShort,
    Button,
    Checkbox,
    HStack,
    InlineMessage,
    Radio,
    RadioGroup,
    Tag,
    VStack,
} from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
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

            <VStack gap={'space-4'} className={style.detaljer}>
                <BodyShort size={'small'}>
                    {`Fødselsdato: ${formaterSladdbarDatotekst(fødselsdato)}${formaterSladdbarVerdi(fødselsdato, (dato) => ` (${alderFraDato(dato)} år)`, '', '')}`}
                </BodyShort>
                <BodyShort size={'small'}>
                    {`Fødselsnummer: ${sladdbarTekst(fnr) || 'Ikke oppgitt'}`}
                </BodyShort>

                {søknadsopplysninger && (
                    <BodyShort size={'small'}>
                        {søknadsopplysninger.oppholdssted
                            ? `Oppholdssted: ${oppholdsstedTekst[søknadsopplysninger.oppholdssted]}`
                            : `Oppholder seg i Norge/EØS: ${formaterSøknadsspørsmålSvar(søknadsopplysninger.oppholderSegIEØSSpm.svar)}`}
                    </BodyShort>
                )}

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
                        <>
                            <RettMerknad
                                fødselsdato={fødselsdato.verdi}
                                innvilgelsesperioder={innvilgelsesperioder}
                            />
                            {erValgt && (
                                <ValgtPeriode
                                    barn={barn}
                                    innvilgelsesperioder={innvilgelsesperioder}
                                    erReadonly={erReadonly}
                                />
                            )}
                        </>
                    )
                )}
            </VStack>
        </div>
    );
};

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

    const { periode, key } = barn;
    const gyldigPeriode = gyldigPeriodeForBarn(barn, innvilgelsesperioder);
    const effektivePerioder = effektivePerioderForSkjemaBarn(barn, innvilgelsesperioder);

    const oppdaterPeriode = (periodeOppdatering: Partial<Periode>) =>
        dispatch({
            type: 'oppdaterBarnetilleggBarnPeriode',
            payload: { key, periodeOppdatering },
        });

    return (
        <VStack gap={'space-8'} className={style.periodevalg}>
            <RadioGroup
                legend={'Periode med barnetillegg'}
                size={'small'}
                className={style.radioGroup}
                value={periode === null}
                readOnly={erReadonly}
                onChange={(heleInnvilgelsesperioden: boolean) =>
                    dispatch({
                        type: 'settBarnetilleggPeriodevalg',
                        payload: { key, heleInnvilgelsesperioden },
                    })
                }
            >
                <Radio value={true}>{'Hele innvilgelsesperioden'}</Radio>
                <Radio value={false}>{'Velg periode'}</Radio>
            </RadioGroup>

            {periode && (
                <HStack gap={'space-12'} align={'end'}>
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
                                oppdaterPeriode({ fraOgMed: dateTilISOTekst(dato) });
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
                                oppdaterPeriode({ tilOgMed: dateTilISOTekst(dato) });
                            }
                        }}
                    />
                </HStack>
            )}

            {effektivePerioder.length > 0 ? (
                <BodyShort size={'small'}>
                    {`Gir barnetillegg i perioden: ${effektivePerioder.map(formaterPeriode).join(', ')}`}
                </BodyShort>
            ) : (
                <InlineMessage status={'error'} size={'small'}>
                    {'Barnet gir ikke barnetillegg i innvilgelsesperioden med valgt periode.'}
                </InlineMessage>
            )}
        </VStack>
    );
};
