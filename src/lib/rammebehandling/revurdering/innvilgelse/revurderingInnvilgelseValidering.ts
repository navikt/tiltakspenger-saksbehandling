import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/lib/rammebehandling/typer/Revurdering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';

export const revurderingInnvilgelseValidering = (
    behandling: Revurdering,
    skjema: RevurderingInnvilgelseContext,
    sak: SakProps,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    const innvilgelseValidering = validerInnvilgelse(sak, behandling, skjema, sisteSøknad);

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
