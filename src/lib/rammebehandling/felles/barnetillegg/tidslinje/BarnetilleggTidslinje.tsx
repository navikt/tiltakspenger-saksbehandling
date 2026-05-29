import { Alert, BodyShort, Link, Timeline } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { useSak } from '~/lib/sak/SakContext';
import { barnetilleggKrympetTilPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { ChildEyesIcon } from '@navikt/aksel-icons';
import { formaterPeriode } from '~/utils/date';
import NextLink from 'next/link';
import { behandlingUrl } from '~/utils/urls';

import style from './BarnetilleggTidslinje.module.css';

type Props = {
    innvilgelsesperiode: Periode;
};

export const BarnetilleggTidslinje = ({ innvilgelsesperiode }: Props) => {
    const { sak } = useSak();

    const barnetillegg = barnetilleggKrympetTilPeriode(sak.tidslinje, innvilgelsesperiode, false);

    if (barnetillegg.length === 0) {
        return (
            <Alert variant={'info'} size={'small'} inline={true} className={style.info}>
                {'Ingen tidligere vedtak om barnetillegg innenfor valgt innvilgelsesperiode'}
            </Alert>
        );
    }

    const startDate = new Date(innvilgelsesperiode.fraOgMed);
    const endDate = new Date(innvilgelsesperiode.tilOgMed);

    return (
        <div>
            <Alert variant={'info'} inline={true} size={'small'} className={style.info}>
                {`Gjeldende barnetillegg innenfor valgt innvilgelsesperiode (${formaterPeriode(innvilgelsesperiode)}):`}
            </Alert>
            <Timeline startDate={startDate} endDate={endDate}>
                <Timeline.Row label={''}>
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
                                    {`${harBarnetillegg ? `${antallBarn} barn` : 'Ikke barnetillegg'} i perioden: ${formaterPeriode(periode)}`}
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
        </div>
    );
};
