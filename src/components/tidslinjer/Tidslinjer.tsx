import React from 'react';
import {
    CheckmarkCircleIcon,
    CheckmarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SackKronerIcon,
    TasklistIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, Heading, Link, Timeline, VStack } from '@navikt/ds-react';
import { SakProps } from '~/types/Sak';
import NextLink from 'next/link';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { useTidslinjeDateRange } from '~/components/tidslinjer/useTidslinjeDateRange';
import {
    erTidslinjeElementInnvilgelse,
    tellAntallBarnFraVedtak,
    tellAntallDagerFraVedtak,
    tidslinjeResultatStatus,
    tidslinjeResultatTekst,
} from '~/utils/tidslinje';
import { classNames } from '~/utils/classNames';
import { numberRangeToString } from '~/utils/tall';

import style from './Tidslinjer.module.css';
import { perioderOverlapper } from '~/utils/periode';

type Props = {
    sak: SakProps;
    heading?: boolean;
    className?: string;
};

export const Tidslinjer = ({ sak, heading = true, className }: Props) => {
    const { tidslinje, saksnummer, utbetalingstidslinje } = sak;

    const { startDate, endDate, scrollTidslinje } = useTidslinjeDateRange(tidslinje);

    return (
        <div className={classNames(style.wrapper, className)}>
            <div className={style.header}>
                {heading && (
                    <Heading size={'small'} level={'2'}>
                        {'Gjeldende vedtak og utbetalinger'}
                    </Heading>
                )}
            </div>
            {/* Obs hvis du vurderer å splitte denne i mindre komponenter: */}
            {/* Timeline fra ds-react er avhengig av at komponentene i hierarkiet har direkte children/parent relasjoner uten wrappere mellom */}
            <Timeline startDate={startDate} endDate={endDate}>
                <Timeline.Row label={'Vedtak'} icon={<TasklistIcon />}>
                    {tidslinje.elementer.map((tidslinjeElement) => {
                        const { rammevedtak, tidslinjeResultat } = tidslinjeElement;

                        const {
                            id,
                            vedtaksdato,
                            saksbehandler,
                            beslutter,
                            gjeldendeInnvilgetPerioder,
                        } = rammevedtak;

                        const { fraOgMed, tilOgMed } = tidslinjeElement.periode;

                        const erInnvilgelse = erTidslinjeElementInnvilgelse(tidslinjeResultat);

                        const antallBarn = tellAntallBarnFraVedtak(rammevedtak);
                        const antallDager = tellAntallDagerFraVedtak(rammevedtak);

                        const innvilgelsesperioder = gjeldendeInnvilgetPerioder.filter((it) =>
                            perioderOverlapper(it, tidslinjeElement.periode),
                        );

                        return (
                            <Timeline.Period
                                start={new Date(fraOgMed)}
                                end={new Date(tilOgMed)}
                                status={tidslinjeResultatStatus[tidslinjeResultat]}
                                icon={
                                    erInnvilgelse ? (
                                        <CheckmarkCircleIcon className={style.innvilgetIkon} />
                                    ) : (
                                        <XMarkOctagonIcon className={style.stansetIkon} />
                                    )
                                }
                                key={id}
                            >
                                <VStack gap={'3'}>
                                    <Heading size={'xsmall'} level={'4'}>
                                        {tidslinjeResultatTekst[tidslinjeResultat]}
                                    </Heading>
                                    <div>
                                        <InfoElement
                                            navn={'Gjeldende vedtaksperiode'}
                                            verdi={periodeTilFormatertDatotekst(
                                                tidslinjeElement.periode,
                                            )}
                                        />
                                        {innvilgelsesperioder.length > 0 && (
                                            <InfoElement
                                                navn={'Gjeldende innvilgelsesperioder'}
                                                verdi={gjeldendeInnvilgetPerioder
                                                    .map((it) => periodeTilFormatertDatotekst(it))
                                                    .join(', ')}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        {erInnvilgelse && (
                                            <>
                                                <InfoElement
                                                    navn={'Antall dager per meldeperiode'}
                                                    verdi={numberRangeToString(antallDager)}
                                                />
                                                <InfoElement
                                                    navn={'Har barnetillegg'}
                                                    verdi={
                                                        antallBarn.max > 0
                                                            ? `Ja (${numberRangeToString(antallBarn)} barn)`
                                                            : 'Nei'
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <InfoElement
                                            navn={'Vedtaksdato'}
                                            verdi={
                                                vedtaksdato
                                                    ? formaterDatotekst(vedtaksdato)
                                                    : 'Brev ikke journalført enda'
                                            }
                                        />
                                        <InfoElement navn={'Saksbehandler'} verdi={saksbehandler} />
                                        <InfoElement navn={'Beslutter'} verdi={beslutter} />
                                    </div>
                                    <Link
                                        as={NextLink}
                                        href={behandlingUrl({
                                            saksnummer,
                                            id: tidslinjeElement.rammevedtak.behandlingId,
                                        })}
                                        className={style.behandlingLink}
                                    >
                                        {'Til behandlingen'}
                                    </Link>
                                </VStack>
                            </Timeline.Period>
                        );
                    })}
                </Timeline.Row>

                <Timeline.Row label={'Utbetalinger'} icon={<SackKronerIcon />}>
                    {utbetalingstidslinje.map((beregning) => {
                        const { kjedeId, periode, beløp } = beregning;
                        const { fraOgMed, tilOgMed } = periode;
                        const { totalt, ordinært, barnetillegg } = beløp;

                        return (
                            <Timeline.Period
                                start={new Date(fraOgMed)}
                                end={new Date(tilOgMed)}
                                status={'info'}
                                icon={<CheckmarkIcon className={style.utbetalingIkon} />}
                                key={kjedeId}
                            >
                                <VStack gap={'3'}>
                                    <InfoElement
                                        navn={'Meldeperiode'}
                                        verdi={`${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`}
                                    />
                                    <div>
                                        {barnetillegg > 0 && (
                                            <>
                                                <InfoElement
                                                    navn={'Utbetalt ordinært'}
                                                    verdi={formatterBeløp(ordinært)}
                                                />
                                                <InfoElement
                                                    navn={'Utbetalt barnetillegg'}
                                                    verdi={formatterBeløp(barnetillegg)}
                                                />
                                            </>
                                        )}
                                        <InfoElement
                                            navn={'Utbetalt totalt'}
                                            verdi={formatterBeløp(totalt)}
                                        />
                                    </div>
                                    <Link
                                        as={NextLink}
                                        href={meldeperiodeUrl(saksnummer, periode)}
                                        className={style.behandlingLink}
                                    >
                                        {'Til meldekortet'}
                                    </Link>
                                </VStack>
                            </Timeline.Period>
                        );
                    })}
                </Timeline.Row>
            </Timeline>
            <div className={style.scroll}>
                <BodyShort size={'small'} className={style.periode}>
                    {periodeTilFormatertDatotekst({
                        fraOgMed: startDate.toString(),
                        tilOgMed: endDate.toString(),
                    })}
                </BodyShort>
                <Button
                    size={'small'}
                    variant={'tertiary'}
                    onClick={() => scrollTidslinje(-1)}
                    icon={<ChevronLeftIcon />}
                >
                    {'Forrige'}
                </Button>
                <Button
                    size={'small'}
                    variant={'tertiary'}
                    onClick={() => scrollTidslinje(1)}
                    icon={<ChevronRightIcon />}
                    iconPosition={'right'}
                >
                    {'Neste'}
                </Button>
            </div>
        </div>
    );
};

const InfoElement = ({ navn, verdi }: { navn: string; verdi: string }) => {
    return (
        <BodyShort size={'small'}>
            <strong>{`${navn}: `}</strong>
            {verdi}
        </BodyShort>
    );
};
