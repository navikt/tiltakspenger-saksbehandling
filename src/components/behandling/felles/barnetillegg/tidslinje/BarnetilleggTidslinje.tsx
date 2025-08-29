import { BodyShort, Timeline } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { useSak } from '~/context/sak/SakContext';
import { hentBarnetilleggFraVedtakTidslinje } from '~/components/behandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { ChildEyesIcon } from '@navikt/aksel-icons';
import { periodeTilFormatertDatotekst } from '~/utils/date';

import style from './BarnetilleggTidslinje.module.css';

type Props = {
    behandlingsperiode: Periode;
};

export const BarnetilleggTidslinje = ({ behandlingsperiode }: Props) => {
    const { sak } = useSak();

    const barnetillegg = hentBarnetilleggFraVedtakTidslinje(sak.tidslinje, behandlingsperiode);

    if (barnetillegg.length === 0) {
        return null;
    }

    const startDate = new Date(behandlingsperiode.fraOgMed);
    const endDate = new Date(behandlingsperiode.tilOgMed);

    return (
        <Timeline startDate={startDate} endDate={endDate}>
            <Timeline.Row label={'Tidligere vedtak:'}>
                {barnetillegg.map((bt) => {
                    const { periode, antallBarn } = bt;

                    const start = new Date(periode.fraOgMed);
                    const end = new Date(periode.tilOgMed);

                    const erBarnetillegg = antallBarn > 0;

                    return (
                        <Timeline.Period
                            start={start}
                            end={end}
                            status={erBarnetillegg ? 'success' : 'neutral'}
                            icon={
                                erBarnetillegg && (
                                    <span className={style.ikon}>
                                        <ChildEyesIcon />
                                        <BodyShort size={'small'}>{antallBarn}</BodyShort>
                                    </span>
                                )
                            }
                            key={periode.fraOgMed}
                        >
                            <BodyShort size={'small'}>
                                {`${antallBarn} barn i perioden ${periodeTilFormatertDatotekst(periode)}`}
                            </BodyShort>
                        </Timeline.Period>
                    );
                })}
            </Timeline.Row>
        </Timeline>
    );
};
