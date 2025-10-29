import { expect, test } from '@jest/globals';
import { SøknadsbehandlingResultat } from '~/types/Søknadsbehandling';
import { RevurderingResultat } from '~/types/Revurdering';

// Denne er mest for å sikre at ingen endrer verdien på RevurderingResultat.INNVILGELSE til bare "INNVILGELSE"
// Verdien må kunne skilles fra SøknadsbehandlingResultat.INNVILGELSE
test('Enumer for rammebehandling resultater må ha unike verdier', () => {
    const duplikater = [
        ...Object.values(SøknadsbehandlingResultat),
        ...Object.values(RevurderingResultat),
    ].filter((verdi, index, array) => {
        return array.indexOf(verdi) !== index;
    });

    expect(duplikater.length).toBe(0);
});
