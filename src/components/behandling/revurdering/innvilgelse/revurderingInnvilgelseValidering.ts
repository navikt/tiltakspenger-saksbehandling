import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { Revurdering } from '~/types/Revurdering';
import { RevurderingInnvilgelseContext } from '~/components/behandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { SakProps } from '~/types/Sak';
import { hentVedtatteSøknadsbehandlinger } from '~/utils/sak';

export const revurderingInnvilgelseValidering = (
    behandling: Revurdering,
    skjema: RevurderingInnvilgelseContext,
    sak: SakProps,
    kanHaHull: boolean,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    const innvilgelseValidering = validerInnvilgelse(
        behandling,
        skjema.innvilgelse,
        sisteSøknad,
        kanHaHull,
    );

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    return validering;
};
