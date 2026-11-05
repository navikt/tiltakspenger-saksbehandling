import { BodyShort, InlineMessage, Timeline } from '@navikt/ds-react';
import { Periode } from '~/types/Periode';
import { useSak } from '~/lib/sak/SakContext';
import { barnetilleggKrympetTilPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { ChildEyesIcon } from '@navikt/aksel-icons';
import { formaterPeriode } from '~/utils/date';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { behandlingUrl } from '~/utils/urls';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

import style from './BarnetilleggTidslinje.module.css';

type Props = {
    innvilgelsesperiode: Periode;
};

export const BarnetilleggTidslinje = ({ innvilgelsesperiode }: Props) => {
    const { sak } = useSak();

    const barnetillegg = barnetilleggKrympetTilPeriode(sak, innvilgelsesperiode, false);

    if (barnetillegg.length === 0) {
        return (
            <InlineMessage status={'info'} size={'small'} className={style.info}>
                {'Ingen tidligere vedtak om barnetillegg innenfor valgt innvilgelsesperiode'}
            </InlineMessage>
        );
    }

    return (
        <div>
            <InlineMessage status={'info'} size={'small'} className={style.info}>
                {`Gjeldende barnetillegg innenfor valgt innvilgelsesperiode (${formaterPeriode(innvilgelsesperiode)}):`}
            </InlineMessage>
            <AntallBarnTidslinje periode={innvilgelsesperiode} barnetillegg={barnetillegg} />
        </div>
    );
};

type AntallBarnTidslinjeProps = {
    periode: Periode;
    // Med behandlingId vises en lenke til behandlingen for hver periode
    barnetillegg: Array<BarnetilleggPeriode & { behandlingId?: RammebehandlingId }>;
};

export const AntallBarnTidslinje = ({ periode, barnetillegg }: AntallBarnTidslinjeProps) => {
    const { sak } = useSak();

    return (
        <Timeline startDate={new Date(periode.fraOgMed)} endDate={new Date(periode.tilOgMed)}>
            <Timeline.Row label={''}>
                {barnetillegg.map((bt) => {
                    const { periode, antallBarn, behandlingId } = bt;

                    const harBarnetillegg = antallBarn > 0;

                    return (
                        <Timeline.Period
                            start={new Date(periode.fraOgMed)}
                            end={new Date(periode.tilOgMed)}
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
                                {behandlingId && (
                                    <InternLenke
                                        href={behandlingUrl({
                                            saksnummer: sak.saksnummer,
                                            id: behandlingId,
                                        })}
                                    >
                                        {'Til behandlingen'}
                                    </InternLenke>
                                )}
                            </BodyShort>
                        </Timeline.Period>
                    );
                })}
            </Timeline.Row>
        </Timeline>
    );
};
