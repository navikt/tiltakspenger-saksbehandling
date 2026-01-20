import { Alert } from '@navikt/ds-react';
import { forrigeDag, nesteDag, periodeTilFormatertDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { krympPeriodisering, perioderErSammenhengende, perioderOverlapper } from '~/utils/periode';
import { useSak } from '~/context/sak/SakContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingResultat } from '~/types/Revurdering';

type Props = {
    forrigePeriode: Periode;
    nestePeriode?: Periode;
};

export const InnvilgelseHullVarsel = ({ forrigePeriode, nestePeriode }: Props) => {
    const { behandling } = useBehandling();
    const { sak } = useSak();

    const { innvilgelseMedHullToggle } = useFeatureToggles();

    const hullMellomPeriodene = nestePeriode &&
        !perioderErSammenhengende(forrigePeriode, nestePeriode) && {
            fraOgMed: nesteDag(forrigePeriode.tilOgMed),
            tilOgMed: forrigeDag(nestePeriode.fraOgMed),
        };

    if (!hullMellomPeriodene) {
        return null;
    }

    const harGjeldendeInnvilgelseIHullet = krympPeriodisering(
        sak.innvilgetTidslinje.elementer,
        hullMellomPeriodene,
    )
        .flatMap((it) => it.rammevedtak.gjeldendeInnvilgetPerioder)
        .some((it) => perioderOverlapper(it, hullMellomPeriodene));

    const kanOpphøre = behandling.resultat === RevurderingResultat.OMGJØRING;

    return (
        <Alert
            variant={
                !innvilgelseMedHullToggle || (harGjeldendeInnvilgelseIHullet && !kanOpphøre)
                    ? 'error'
                    : 'warning'
            }
            size={'small'}
            inline={true}
        >
            {`Innvilges ikke for ${periodeTilFormatertDatotekst(hullMellomPeriodene)}`}
            {harGjeldendeInnvilgelseIHullet &&
                ' - Dette fører til et opphør av en tidligere innvilgelse i perioden!'}
        </Alert>
    );
};
