import React from 'react';
import { CheckmarkCircleIcon, TasklistIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { Heading, Timeline, Link, BodyShort } from '@navikt/ds-react';
import { SakProps } from '~/types/SakTypes';
import { Vedtakstype } from '~/types/VedtakTyper';
import NextLink from 'next/link';
import { formaterDatotekst } from '~/utils/date';

import style from './BehandlingerTidslinje.module.css';

type Props = {
    sak: SakProps;
};

export const BehandlingerTidslinje = ({ sak }: Props) => {
    const { tidslinje } = sak;

    if (tidslinje.length === 0) {
        return <div>{'Det finnes ingen vedtak på denne saken ennå'}</div>;
    }

    return (
        <div className={style.wrapper}>
            <Heading size={'small'} level={'2'} className={style.header}>
                {'Gjeldende vedtak på saken'}
            </Heading>
            <Timeline>
                <Timeline.Row label={''} icon={<TasklistIcon />}>
                    {tidslinje.map((vedtak) => {
                        const {
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
                                key={vedtak.id}
                            >
                                <div className={style.behandlingPreview}>
                                    <Heading size={'xsmall'} level={'4'}>
                                        {erInnvilgelse ? 'Innvilget' : 'Stanset'}
                                    </Heading>
                                    <div>
                                        <VedtakElement
                                            navn={'Periode'}
                                            verdi={`${formaterDatotekst(fraOgMed)} - ${formaterDatotekst(tilOgMed)}`}
                                        />
                                        {antallDagerPerMeldeperiode !== null && (
                                            <VedtakElement
                                                navn={'Antall dager per meldeperiode'}
                                                verdi={antallDagerPerMeldeperiode.toString()}
                                            />
                                        )}
                                        <VedtakElement
                                            navn={'Har barnetillegg?'}
                                            verdi={barnetillegg ? 'Ja' : 'Nei'}
                                        />
                                    </div>
                                    <div>
                                        <VedtakElement
                                            navn={'Vedtaksdato'}
                                            verdi={formaterDatotekst(vedtaksdato)}
                                        />
                                        <VedtakElement
                                            navn={'Saksbehandler'}
                                            verdi={saksbehandler}
                                        />
                                        <VedtakElement navn={'Beslutter'} verdi={beslutter} />
                                    </div>
                                    <BodyShort size={'small'}>
                                        <Link
                                            as={NextLink}
                                            href={`/behandling/${vedtak.behandlingId}`}
                                        >
                                            {'Til behandlingen'}
                                        </Link>
                                    </BodyShort>
                                </div>
                            </Timeline.Period>
                        );
                    })}
                </Timeline.Row>
            </Timeline>
        </div>
    );
};

const VedtakElement = ({ navn, verdi }: { navn: string; verdi: string }) => {
    return (
        <BodyShort size={'small'}>
            <strong>{`${navn}: `}</strong>
            {verdi}
        </BodyShort>
    );
};
