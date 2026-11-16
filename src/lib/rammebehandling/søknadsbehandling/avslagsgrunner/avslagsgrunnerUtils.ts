import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { perioderOverlapper } from '~/utils/periode';

/**
 * Vedtaksbrevet oppgir periode og vedtaksdato for den tidligere innvilgelsen bare når søknadsperioden overlapper nøyaktig én innvilgelse.
 * Overlapper den flere, må saksbehandler skrive dette i teksten til vedtaksbrevet.
 * Tellingen speiler gjeldendeInnvilgelseForPeriode i backend, som bruker de samme elementene i innvilgetTidslinje.
 */
export const skalVarsleOmFlereTidligereInnvilgelser = (
    sak: SakProps,
    søknadsperiode: Nullable<Periode>,
    avslagsgrunner: Avslagsgrunn[],
): boolean => {
    if (!søknadsperiode || !avslagsgrunner.includes(Avslagsgrunn.InnvilgetTiltakspenger)) {
        return false;
    }

    const overlappendeInnvilgelser = sak.innvilgetTidslinje.elementer.filter((element) =>
        perioderOverlapper(element.periode, søknadsperiode),
    );

    return overlappendeInnvilgelser.length > 1;
};
