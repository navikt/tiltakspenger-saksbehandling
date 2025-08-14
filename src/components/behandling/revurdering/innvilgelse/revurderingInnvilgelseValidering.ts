import { RevurderingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { RevurderingInnvilgelseVedtakContext } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { SakProps } from '~/types/SakTypes';
import { perioderOverlapper } from '~/utils/periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';

export const revurderingInnvilgelseValidering = (
    sak: SakProps,
    behandling: RevurderingData,
    vedtak: RevurderingInnvilgelseVedtakContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const { behandlingsperiode } = vedtak;

    if (behandlingsperiode.fraOgMed > behandlingsperiode.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    sak.meldeperiodeKjeder.forEach((kjede) => {
        const periode = kjede.sisteBeregning?.periode;

        if (periode && perioderOverlapper(periode, behandlingsperiode)) {
            validering.warnings.push(
                `Innvilgelsesperioden overlapper med den utbetalte meldeperioden ${periodeTilFormatertDatotekst(periode)}`,
            );
        }
    });

    const innvilgelseValidering = validerInnvilgelse(behandling, vedtak);
    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
