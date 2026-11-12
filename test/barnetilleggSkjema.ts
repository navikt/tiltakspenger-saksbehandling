import { BarnetilleggBarn } from '~/lib/rammebehandling/typer/Barnetillegg';
import {
    BarnetilleggBarnSkjema,
    tilBarnetilleggBarnSkjema,
} from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggBarnUtils';
import { barnetilleggBarn } from '~test/rammebehandling';

// Et barn i barnetilleggskjemaet, med key utledet fra navn og fødselsdato.
// Ligger utenfor rammebehandling-fixturene fordi e2e-testene ikke kan importere app-koden som lager key.
export const skjemaBarn = (
    fødselsdato: string,
    overstyringer: Partial<BarnetilleggBarn> = {},
): BarnetilleggBarnSkjema =>
    tilBarnetilleggBarnSkjema(barnetilleggBarn(fødselsdato, overstyringer), fødselsdato);
