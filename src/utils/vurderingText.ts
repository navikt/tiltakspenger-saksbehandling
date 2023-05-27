import {Vilkårsvurdering} from '../types/Søknad';
import {Utfall} from '../types/Utfall';

export default function createVurderingText({utfall}: Vilkårsvurdering, ytelseText: string) {
    if (Utfall.Oppfylt === utfall) {
        return `Bruker er ikke innvilget ${ytelseText}`;
    }
    if (Utfall.IkkeOppfylt === utfall) {
        return `Bruker er innvilget ${ytelseText}`;
    }
    if (Utfall.KreverManuellVurdering === utfall) {
        return `Ukjent om bruker er innvilget ${ytelseText}`;
    }
    return '';
}
