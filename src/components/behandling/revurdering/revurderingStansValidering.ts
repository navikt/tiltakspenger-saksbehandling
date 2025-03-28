import { ValideringResultat } from '../send-og-godkjenn/BehandlingSendTilBeslutning';
import { RevurderingVedtakContext } from './RevurderingVedtakContext';

export const revurderingStansValidering = (
    vedtak: RevurderingVedtakContext,
): ValideringResultat => {
    const { valgtHjemmelHarIkkeRettighet, stansdato } = vedtak;

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!valgtHjemmelHarIkkeRettighet?.[0] || valgtHjemmelHarIkkeRettighet?.[0]?.length === 0) {
        errors.push('Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.');
    }

    if (!stansdato) {
        errors.push('Du må velge en dato for når tiltakspengene skal stanses.');
    }

    return {
        errors,
        warnings,
    };
};
