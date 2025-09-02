import { Alert, BodyShort, Link, Timeline } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { useSak } from '~/context/sak/SakContext';
import { hentBarnetilleggFraVedtakTidslinje } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { ChildEyesIcon } from '@navikt/aksel-icons';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import NextLink from 'next/link';
import React from 'react';
import { behandlingUrl } from '~/utils/urls';

import style from './BarnetilleggTidslinje.module.css';

type Props = {
    behandlingsperiode: Periode;
};

export const BarnetilleggTidslinje = ({ behandlingsperiode }: Props) => {
    const { sak } = useSak();

    const barnetillegg = hentBarnetilleggFraVedtakTidslinje(sak.tidslinje, behandlingsperiode);

    if (barnetillegg.length === 0) {
        return (
            <Alert variant={'info'} size={'small'} inline={true}>
                {'Ingen tidligere vedtak om barnetillegg innenfor valgt innvilgelsesperiode'}
            </Alert>
        );
    }

    const startDate = new Date(behandlingsperiode.fraOgMed);
    const endDate = new Date(behandlingsperiode.tilOgMed);

    return (
        <Timeline startDate={startDate} endDate={endDate}>
            <Timeline.Row label={'Gjeldende vedtak:'}>
                {barnetillegg.map((bt) => {
                    const { periode, antallBarn, behandlingId } = bt;

                    const start = new Date(periode.fraOgMed);
                    const end = new Date(periode.tilOgMed);

                    const harBarnetillegg = antallBarn > 0;

                    return (
                        <Timeline.Period
                            start={start}
                            end={end}
                            status={harBarnetillegg ? 'success' : 'neutral'}
                            icon={
                                <span className={style.ikon}>
                                    {harBarnetillegg && <ChildEyesIcon />}
                                    <BodyShort size={'small'}>{antallBarn}</BodyShort>
                                </span>
                            }
                            key={periode.fraOgMed}
                        >
                            <BodyShort size={'small'} className={style.detaljer}>
                                {`${antallBarn} barn i perioden: ${periodeTilFormatertDatotekst(periode)}`}
                                <Link
                                    as={NextLink}
                                    href={behandlingUrl({
                                        saksnummer: sak.saksnummer,
                                        id: behandlingId,
                                    })}
                                >
                                    {'Til behandlingen'}
                                </Link>
                            </BodyShort>
                        </Timeline.Period>
                    );
                })}
            </Timeline.Row>
        </Timeline>
    );
};
