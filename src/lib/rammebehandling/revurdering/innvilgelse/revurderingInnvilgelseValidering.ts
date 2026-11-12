import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/lib/rammebehandling/typer/Revurdering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';

export const revurderingInnvilgelseValidering = (
    behandling: Revurdering,
    skjema: RevurderingInnvilgelseContext,
    sak: SakProps,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const innvilgelseValidering = validerInnvilgelse(sak, behandling, skjema);

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
