import React from 'react';
import {
    CheckmarkCircleIcon,
    SackKronerIcon,
    TasklistIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';
import { Heading, Timeline, Link, BodyShort } from '@navikt/ds-react';
import { SakProps } from '~/types/SakTypes';
import { Vedtakstype } from '~/types/VedtakTyper';
import NextLink from 'next/link';
import { formaterDatotekst } from '~/utils/date';
import { formatterBeløp } from '~/utils/beløp';
import { meldeperiodeUrl } from '~/utils/urls';

import style from './BehandlingerTidslinje.module.css';

type Props = {
    sak: SakProps;
};

export const BehandlingerTidslinje = ({ sak }: Props) => {
    const { tidslinje, meldeperiodeKjeder, saksnummer } = sak;

    if (tidslinje.length === 0) {
        return <div>{'Det finnes ingen vedtak på denne saken ennå'}</div>;
    }

    const beregninger = meldeperiodeKjeder.map((kjede) => kjede.sisteBeregning).filter(Boolean);

    return (
        <div className={style.wrapper}>
            <Heading size={'small'} level={'2'} className={style.header}>
                {'Gjeldende tilstand for saken'}
            </Heading>
            <Timeline>
                <Timeline.Row label={'Vedtak'} icon={<TasklistIcon />}>
                    {tidslinje.map((vedtak) => {
                        const {
                            id,
                            periode,
                            vedtaksType,
                            vedtaksdato,
                            saksbehandler,
                            beslutter,
                            antallDagerPerMeldeperiode,
                            barnetillegg,
                        } = vedtak;

                        const { fraOgMed, tilOgMed } = periode;
                        const erInnvilgelse = vedtaksType === Vedtakstype.INNVILGELSE;

                        return (
                            <Timeline.Period
                                start={new Date(fraOgMed)}
                                end={new Date(tilOgMed)}
                                status={erInnvilgelse ? 'success' : 'danger'}
                                icon={
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
                                        {erInnvilgelse ? 'Innvilget' : 'Stanset'}
                                    </Heading>
                                    <div>
                                        <InfoElement
                                            navn={'Periode'}
                                            verdi={`${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`}
                                        />
                                        {antallDagerPerMeldeperiode !== null && (
                                            <InfoElement
                                                navn={'Antall dager per meldeperiode'}
                                                verdi={antallDagerPerMeldeperiode.toString()}
                                            />
                                        )}
                                        <InfoElement
                                            navn={'Har barnetillegg?'}
                                            verdi={barnetillegg ? 'Ja' : 'Nei'}
                                        />
                                    </div>
                                    <div>
                                        <InfoElement
                                            navn={'Vedtaksdato'}
                                            verdi={formaterDatotekst(vedtaksdato)}
                                        />
                                        <InfoElement navn={'Saksbehandler'} verdi={saksbehandler} />
                                        <InfoElement navn={'Beslutter'} verdi={beslutter} />
                                    </div>
                                    <Link
                                        as={NextLink}
                                        href={`/behandling/${vedtak.behandlingId}`}
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
                    {beregninger.map((beregning) => {
                        const { kjedeId, periode, beløp } = beregning;
                        const { fraOgMed, tilOgMed } = periode;
                        const { totalt, ordinært, barnetillegg } = beløp;

                        return (
                            <Timeline.Period
                                start={new Date(fraOgMed)}
                                end={new Date(tilOgMed)}
                                status={'info'}
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
