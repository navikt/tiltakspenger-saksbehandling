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
import { BodyShort, Button, Heading, Link, Timeline } from '@navikt/ds-react';
import { SakProps } from '~/types/Sak';
import NextLink from 'next/link';
import { formaterDatotekst, periodeTilFormatertDatotekst } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { behandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { useTidslinjeDateRange } from '~/components/behandling/tidslinje/useTidslinjeDateRange';
import { tellAntallBarnFraVedtak } from '~/components/behandling/felles/barnetillegg/utils/barnetilleggUtils';

import style from './BehandlingerTidslinje.module.css';
import { TidslinjeResultat } from '~/types/Tidslinje';
import { erTidslinjeElementInnvilgelse } from '~/utils/TidslinjeUtils';

type Props = {
    sak: SakProps;
};

export const BehandlingerTidslinje = ({ sak }: Props) => {
    const { tidslinje, saksnummer, utbetalingstidslinje } = sak;

    const { startDate, endDate, scrollTidslinje } = useTidslinjeDateRange(tidslinje);

    return (
        <div className={style.wrapper}>
            <div className={style.header}>
                <Heading size={'small'} level={'2'}>
                    {'Gjeldende vedtak og utbetalinger'}
                </Heading>
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
            <Timeline startDate={startDate} endDate={endDate}>
                <Timeline.Row label={'Vedtak'} icon={<TasklistIcon />}>
                    {tidslinje.elementer.map((tidslinjeElement) => {
                        const {
                            id,
                            gjeldendePeriode,
                            vedtaksdato,
                            saksbehandler,
                            beslutter,
                            antallDagerPerMeldeperiode,
                        } = tidslinjeElement.rammevedtak;

                        const { fraOgMed, tilOgMed } = gjeldendePeriode;

                        const erInnvilgelse = erTidslinjeElementInnvilgelse(
                            tidslinjeElement.tidslinjeResultat,
                        );

                        const barn = tellAntallBarnFraVedtak(tidslinjeElement.rammevedtak);

                        return (
                            <Timeline.Period
                                start={new Date(fraOgMed)}
                                end={new Date(tilOgMed)}
                                status={(() => {
                                    switch (tidslinjeElement.tidslinjeResultat) {
                                        case TidslinjeResultat.STANS:
                                            return 'warning';
                                        case TidslinjeResultat.OMGJØRING_OPPHØR:
                                            return 'danger';
                                        case TidslinjeResultat.FORLENGELSE:
                                        case TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE:
                                        case TidslinjeResultat.REVURDERING_INNVILGELSE:
                                        case TidslinjeResultat.OMGJØRING_INNVILGELSE:
                                            return 'success';
                                    }
                                })()}
                                icon={
                                    //TODO - finn et fint ikon for stans
                                    erInnvilgelse ? (
                                        <CheckmarkCircleIcon className={style.innvilgetIkon} />
                                    ) : (
                                        <XMarkOctagonIcon className={style.stansetIkon} />
                                    )
                                }
                                key={id}
                            >
                                <div className={style.behandlingPreview}>
                                    <Heading size={'xsmall'} level={'4'}>
                                        {(() => {
                                            switch (tidslinjeElement.tidslinjeResultat) {
                                                case TidslinjeResultat.STANS:
                                                    return 'Stanset';
                                                case TidslinjeResultat.OMGJØRING_OPPHØR:
                                                    return 'Omgjøring - opphørt';
                                                case TidslinjeResultat.FORLENGELSE:
                                                    return 'Forlengelse';
                                                case TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE:
                                                    return 'Søknadsbehandling - innvilgelse';
                                                case TidslinjeResultat.REVURDERING_INNVILGELSE:
                                                    return 'Revurdering - innvilgelse';
                                                case TidslinjeResultat.OMGJØRING_INNVILGELSE:
                                                    return 'Omgjøring - innvilgelse';
                                            }
                                        })()}
                                    </Heading>
                                    <div>
                                        <InfoElement
                                            navn={'Gjeldende periode'}
                                            verdi={periodeTilFormatertDatotekst(gjeldendePeriode)}
                                        />
                                        {erInnvilgelse && (
                                            <>
                                                <InfoElement
                                                    navn={'Antall dager per meldeperiode'}
                                                    verdi={antallDagerPerMeldeperiode.toString()}
                                                />
                                                <InfoElement
                                                    navn={'Har barnetillegg'}
                                                    verdi={
                                                        barn.maxBarn > 0
                                                            ? `Ja (${barn.minBarn}${barn.minBarn != barn.maxBarn ? ` - ${barn.maxBarn}` : ''} barn)`
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
                                </div>
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
                                <div className={style.behandlingPreview}>
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
                                </div>
                            </Timeline.Period>
                        );
                    })}
                </Timeline.Row>
            </Timeline>
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
