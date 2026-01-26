import { Alert, BodyShort } from '@navikt/ds-react';
import { forrigeDag, nesteDag, periodeTilFormatertDatotekst } from '~/utils/date';
import { Periode } from '~/types/Periode';
import { overlappendePeriode, perioderErSammenhengende } from '~/utils/periode';
import { useSak } from '~/context/sak/SakContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { RevurderingResultat } from '~/types/Revurdering';
import { finnGjeldendeInnvilgelserIPeriode } from '~/components/behandling/context/behandlingSkjemaUtils';

type Props = {
    forrigePeriode: Periode;
    nestePeriode?: Periode;
};

export const InnvilgelseHullVarsel = ({ forrigePeriode, nestePeriode }: Props) => {
    const { behandling } = useBehandling();
    const { sak } = useSak();

    const hullMellomPeriodene = nestePeriode &&
        !perioderErSammenhengende(forrigePeriode, nestePeriode) && {
            fraOgMed: nesteDag(forrigePeriode.tilOgMed),
            tilOgMed: forrigeDag(nestePeriode.fraOgMed),
        };

    if (!hullMellomPeriodene) {
        return null;
    }

    const gjeldendeInnvilgelserIHullet = finnGjeldendeInnvilgelserIPeriode(
        sak,
        hullMellomPeriodene,
    );

    const erOpphør = gjeldendeInnvilgelserIHullet.length > 0;
    const kanOpphøre = behandling.resultat === RevurderingResultat.OMGJØRING;

    return (
        <Alert variant={erOpphør && !kanOpphøre ? 'error' : 'warning'} size={'small'} inline={true}>
            <BodyShort
                size={'small'}
                spacing={erOpphør}
            >{`Innvilges ikke for perioden ${periodeTilFormatertDatotekst(hullMellomPeriodene)}`}</BodyShort>
            {erOpphør && (
                <BodyShort size={'small'}>
                    {`Dette fører til et opphør av innvilgelse i perioden${gjeldendeInnvilgelserIHullet.length > 1 ? 'e' : ''} ${gjeldendeInnvilgelserIHullet
                        .map((p) =>
                            periodeTilFormatertDatotekst(
                                overlappendePeriode(p, hullMellomPeriodene)!,
                            ),
                        )
                        .join(', ')}`}
                </BodyShort>
            )}
        </Alert>
    );
};
