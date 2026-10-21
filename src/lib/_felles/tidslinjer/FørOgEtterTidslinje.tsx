import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Heading, Timeline, VStack } from '@navikt/ds-react';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { DetaljHorisontal } from '~/lib/_felles/detaljer/DetaljHorisontal';
import {
    TidslinjeFørOgEtter,
    TidslinjeFørOgEtterElement,
} from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import {
    erTidslinjeElementInnvilgelse,
    tidslinjeResultatStatus,
    tidslinjeResultatTekst,
} from '~/lib/_felles/tidslinjer/tidslinjerUtils';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { classNames } from '~/utils/classNames';
import { formaterPeriode } from '~/utils/date';
import { behandlingUrl } from '~/utils/urls';

import style from './Tidslinjer.module.css';

type Props = {
    tidslinje: TidslinjeFørOgEtter;
    behandlingId: RammebehandlingId;
    saksnummer: Saksnummer;
    className?: string;
};

/**
 * Viser vedtakstidslinjen innenfor behandlingens vedtaksperiode før og etter at behandlingen er iverksatt.
 * All sammenligning gjøres i backend.
 */
export const FørOgEtterTidslinje = ({ tidslinje, behandlingId, saksnummer, className }: Props) => {
    const { periode, før, etter, harEndring } = tidslinje;

    return (
        <div className={classNames(style.wrapper, className)}>
            <div className={style.header}>
                <Heading size={'small'} level={'2'}>
                    {
                        'Tilstand for vedtaksperioden, før og etter iverksetting av denne behandlingen'
                    }
                </Heading>
            </div>
            <Timeline startDate={new Date(periode.fraOgMed)} endDate={new Date(periode.tilOgMed)}>
                <Timeline.Row label={'Før'}>
                    {før.map((element) =>
                        tilTidslinjePeriode(element, 'før', behandlingId, saksnummer),
                    )}
                </Timeline.Row>
                <Timeline.Row label={'Etter'}>
                    {etter.map((element) =>
                        tilTidslinjePeriode(element, 'etter', behandlingId, saksnummer),
                    )}
                </Timeline.Row>
            </Timeline>
            <div className={style.scroll}>
                <BodyShort size={'small'} className={style.periode}>
                    {formaterPeriode(periode)}
                </BodyShort>
            </div>
            {!harEndring && (
                <BodyShort size={'small'}>
                    {
                        'Behandlingen endrer ikke retten til tiltakspenger, antall dager per meldeperiode eller barnetillegg i perioden.'
                    }
                </BodyShort>
            )}
        </div>
    );
};

// Returnerer Timeline.Period direkte (ikke som egen komponent), siden Timeline krever direkte children.
const tilTidslinjePeriode = (
    element: TidslinjeFørOgEtterElement,
    rad: 'før' | 'etter',
    behandlingId: RammebehandlingId,
    saksnummer: Saksnummer,
) => {
    const { fraOgMed, tilOgMed } = element.periode;
    const erInnvilgelse = erTidslinjeElementInnvilgelse(element.tidslinjeResultat);

    return (
        <Timeline.Period
            key={`${rad}-${fraOgMed}`}
            start={new Date(fraOgMed)}
            end={new Date(tilOgMed)}
            status={tidslinjeResultatStatus[element.tidslinjeResultat]}
            icon={
                erInnvilgelse ? (
                    <CheckmarkCircleIcon className={style.innvilgetIkon} />
                ) : (
                    <XMarkOctagonIcon className={style.stansetIkon} />
                )
            }
        >
            <ElementDetaljer
                element={element}
                erInnvilgelse={erInnvilgelse}
                lenke={
                    element.behandlingId === behandlingId
                        ? null
                        : behandlingUrl({ saksnummer, id: element.behandlingId })
                }
            />
        </Timeline.Period>
    );
};

const ElementDetaljer = ({
    element,
    erInnvilgelse,
    lenke,
}: {
    element: TidslinjeFørOgEtterElement;
    erInnvilgelse: boolean;
    lenke: string | null;
}) => {
    const { tidslinjeResultat, antallDagerPerMeldeperiode, antallBarn } = element;

    return (
        <VStack gap={'space-12'}>
            <Heading size={'xsmall'} level={'4'}>
                {tidslinjeResultatTekst[tidslinjeResultat]}
            </Heading>
            <div>
                <InfoElement navn={'Periode'} verdi={formaterPeriode(element.periode)} />
                {erInnvilgelse && (
                    <>
                        <InfoElement
                            navn={'Antall dager per meldeperiode'}
                            verdi={`${antallDagerPerMeldeperiode ?? '-'}`}
                        />
                        <InfoElement
                            navn={'Har barnetillegg'}
                            verdi={antallBarn ? `Ja (${antallBarn} barn)` : 'Nei'}
                        />
                    </>
                )}
                {!element.rammevedtakId && <InfoElement navn={'Status'} verdi={'Ikke iverksatt'} />}
            </div>
            {lenke && (
                <InternLenke href={lenke} className={style.behandlingLink}>
                    {'Til behandlingen'}
                </InternLenke>
            )}
        </VStack>
    );
};

const InfoElement = ({ navn, verdi }: { navn: string; verdi: string }) => {
    return (
        <DetaljHorisontal navn={navn} size={'small'}>
            {verdi}
        </DetaljHorisontal>
    );
};
