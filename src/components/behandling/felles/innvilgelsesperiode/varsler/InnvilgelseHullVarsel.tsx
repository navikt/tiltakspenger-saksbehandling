import { Alert, BodyShort } from '@navikt/ds-react';
import { forrigeDag, nesteDag, periodeTilFormatertDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { overlappendePeriode, perioderErSammenhengende } from '~/utils/periode';
import { useSak } from '~/context/sak/SakContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingResultat } from '~/types/Revurdering';
import { finnGjeldendeInnvilgelserIPeriode } from '~/components/behandling/context/behandlingSkjemaUtils';
import { PropsWithChildren } from 'react';
import { useBehandlingInnvilgelseSkjema } from '~/components/behandling/context/innvilgelse/innvilgelseContext';

type InnvilgelseHullVarselProps = {
    forrigePeriode: Periode;
    nestePeriode?: Periode;
};

export const InnvilgelseHullVarsel = ({
    forrigePeriode,
    nestePeriode,
}: InnvilgelseHullVarselProps) => {
    const hullMellomPeriodene = nestePeriode &&
        !perioderErSammenhengende(forrigePeriode, nestePeriode) && {
            fraOgMed: nesteDag(forrigePeriode.tilOgMed),
            tilOgMed: forrigeDag(nestePeriode.fraOgMed),
        };

    if (!hullMellomPeriodene) {
        return null;
    }

    return <PeriodeUtenInnvilgelseVarsel periode={hullMellomPeriodene} />;
};

export const VedtaksperioderUtenInnvilgelseVarsel = ({ children }: PropsWithChildren) => {
    const skjemaContext = useBehandlingInnvilgelseSkjema();

    if (skjemaContext.resultat !== RevurderingResultat.OMGJØRING) {
        return children;
    }

    const { innvilgelse, vedtaksperiode } = skjemaContext;

    if (!innvilgelse.harValgtPeriode) {
        return children;
    }

    const førsteInnvilgelsesperiode = innvilgelse.innvilgelsesperioder.at(0)!;
    const sisteInnvilgelsesperiode = innvilgelse.innvilgelsesperioder.at(-1)!;

    return (
        <>
            {førsteInnvilgelsesperiode.periode.fraOgMed > vedtaksperiode.fraOgMed && (
                <PeriodeUtenInnvilgelseVarsel
                    periode={{
                        fraOgMed: vedtaksperiode.fraOgMed,
                        tilOgMed: forrigeDag(førsteInnvilgelsesperiode.periode.fraOgMed),
                    }}
                />
            )}
            {children}
            {sisteInnvilgelsesperiode.periode.tilOgMed < vedtaksperiode.tilOgMed && (
                <PeriodeUtenInnvilgelseVarsel
                    periode={{
                        fraOgMed: nesteDag(sisteInnvilgelsesperiode.periode.tilOgMed),
                        tilOgMed: vedtaksperiode.tilOgMed,
                    }}
                />
            )}
        </>
    );
};

const PeriodeUtenInnvilgelseVarsel = ({ periode }: { periode: Periode }) => {
    const { sak } = useSak();
    const { behandling } = useBehandling();

    const gjeldendeInnvilgelserIHullet = finnGjeldendeInnvilgelserIPeriode(sak, periode);

    const erOpphør = gjeldendeInnvilgelserIHullet.length > 0;
    const kanOpphøre = behandling.resultat === RevurderingResultat.OMGJØRING;

    return (
        <Alert variant={erOpphør && !kanOpphøre ? 'error' : 'warning'} size={'small'} inline={true}>
            <BodyShort
                size={'small'}
                spacing={erOpphør}
            >{`Innvilges ikke for perioden ${periodeTilFormatertDatotekst(periode)}`}</BodyShort>
            {erOpphør && (
                <BodyShort size={'small'}>
                    {`Dette fører til et opphør av innvilgelse i perioden${gjeldendeInnvilgelserIHullet.length > 1 ? 'e' : ''} ${gjeldendeInnvilgelserIHullet
                        .map((p) => periodeTilFormatertDatotekst(overlappendePeriode(p, periode)!))
                        .join(', ')}`}
                </BodyShort>
            )}
        </Alert>
    );
};
