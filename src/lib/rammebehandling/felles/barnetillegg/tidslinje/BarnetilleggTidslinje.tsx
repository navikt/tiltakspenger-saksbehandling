import { BodyShort, Heading, Timeline, VStack } from '@navikt/ds-react';
import { ChildEyesIcon } from '@navikt/aksel-icons';
import { Periode } from '~/types/Periode';
import { useSak } from '~/lib/sak/SakContext';
import { barnetilleggFørBehandlingIPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import { useBehandling } from '~/lib/rammebehandling/context/BehandlingContext';
import { kunPerioderMedBarn } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggUtils';
import { formaterPeriode } from '~/utils/date';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import { behandlingUrl } from '~/utils/urls';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Saksnummer } from '~/lib/sak/Saksnummer';

import style from './BarnetilleggTidslinje.module.css';

type BarnetilleggTidslinjePeriode = BarnetilleggPeriode & { behandlingId?: RammebehandlingId };

type Props = {
    periode: Periode;
    // Barnetillegget etter iverksetting av behandlingen
    etter: BarnetilleggPeriode[];
};

/**
 * Viser barnetillegget innenfor valgte innvilgelsesperioder før og etter iverksetting av behandlingen.
 * Før er barnetillegget fra vedtakene som gjaldt før behandlingen.
 * Innvilgede perioder uten barnetillegg vises med 0 barn.
 */
export const BarnetilleggTidslinje = ({ periode, etter }: Props) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const før = barnetilleggFørBehandlingIPeriode(sak, behandling, periode);

    return (
        <div className={style.wrapper}>
            <Heading size={'xsmall'} level={'4'} className={style.header}>
                {'Tilstand for barnetillegg innenfor valgte innvilgelsesperioder'}
            </Heading>
            <Timeline startDate={new Date(periode.fraOgMed)} endDate={new Date(periode.tilOgMed)}>
                <Timeline.Row label={'Før'}>
                    {før.map((bt) => tilTidslinjePeriode(bt, 'før', sak.saksnummer))}
                </Timeline.Row>
                <Timeline.Row label={'Etter'}>
                    {etter.map((bt) => tilTidslinjePeriode(bt, 'etter', sak.saksnummer))}
                </Timeline.Row>
            </Timeline>
            <div className={style.bunn}>
                {!før.some(kunPerioderMedBarn) ? (
                    <BodyShort size={'small'}>
                        {
                            'Ingen tidligere vedtak om barnetillegg innenfor valgte innvilgelsesperioder.'
                        }
                    </BodyShort>
                ) : (
                    <span />
                )}
                <BodyShort size={'small'} className={style.periode}>
                    {formaterPeriode(periode)}
                </BodyShort>
            </div>
        </div>
    );
};

// Returnerer Timeline.Period direkte (ikke som egen komponent), siden Timeline krever direkte children.
const tilTidslinjePeriode = (
    barnetillegg: BarnetilleggTidslinjePeriode,
    rad: 'før' | 'etter',
    saksnummer: Saksnummer,
) => {
    const { periode, antallBarn, behandlingId } = barnetillegg;
    const harBarnetillegg = antallBarn > 0;

    return (
        <Timeline.Period
            key={`${rad}-${periode.fraOgMed}`}
            start={new Date(periode.fraOgMed)}
            end={new Date(periode.tilOgMed)}
            status={harBarnetillegg ? 'success' : 'neutral'}
            icon={
                <span className={style.ikon}>
                    {harBarnetillegg && <ChildEyesIcon />}
                    <BodyShort size={'small'}>{antallBarn}</BodyShort>
                </span>
            }
        >
            <VStack gap={'space-12'}>
                <Heading size={'xsmall'} level={'4'}>
                    {harBarnetillegg ? 'Barnetillegg' : 'Ikke barnetillegg'}
                </Heading>
                <div>
                    <DetaljHorisontal navn={'Periode'} size={'small'}>
                        {formaterPeriode(periode)}
                    </DetaljHorisontal>
                    <DetaljHorisontal navn={'Antall barn'} size={'small'}>
                        {`${antallBarn}`}
                    </DetaljHorisontal>
                </div>
                {behandlingId && (
                    <InternLenke href={behandlingUrl({ saksnummer, id: behandlingId })}>
                        {'Til behandlingen'}
                    </InternLenke>
                )}
            </VStack>
        </Timeline.Period>
    );
};
