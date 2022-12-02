import { Vilkårsvurdering } from '../types/Søknad';
import { Utfall } from '../types/Utfall';

export default function createVurderingText({ utfall }: Vilkårsvurdering, ytelseText: string) {
    if (Utfall.Oppfylt === utfall) {
        return `Bruker er ikke innvilget ${ytelseText}`;
    }
    if (Utfall.IkkeOppfylt === utfall || Utfall.KreverManuellVurdering === utfall) {
        return `Bruker er innvilget ${ytelseText}`;
    }
    return '';
}
