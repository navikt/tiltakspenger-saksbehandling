import React from 'react';
import { BehandlingSaksopplysning } from '../../behandling/saksopplysninger/BehandlingSaksopplysning';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { VStack } from '@navikt/ds-react';
import { Søknad } from '~/types/Søknad';

interface Props {
    søknad: Søknad;
}

export const SøknadsopplysningerTiltak = ({ søknad }: Props) => {
    const { tiltak, manueltSattTiltak, svar } = søknad;
    const { harSøktPåTiltak } = svar;

    const render = () => {
        if (harSøktPåTiltak?.svar === 'JA' || tiltak) {
            if (tiltak) {
                return (
                    <>
                        <BehandlingSaksopplysning navn={'Tiltak'} verdi={tiltak.typeNavn} />
                        {tiltak?.fraOgMed && tiltak.tilOgMed && (
                            <BehandlingSaksopplysning
                                navn={'Periode'}
                                verdi={periodeTilFormatertDatotekst({
                                    fraOgMed: tiltak.fraOgMed,
                                    tilOgMed: tiltak.tilOgMed,
                                })}
                                spacing={true}
                            />
                        )}
                    </>
                );
            } else if (manueltSattTiltak) {
                return (
                    <BehandlingSaksopplysning
                        navn="Tiltak (uverifisert)"
                        verdi={manueltSattTiltak}
                        visVarsel
                    />
                );
            }
        }
        // Fallback er å vise svaret med en varsel, for da finnes det ikke noe tiltak å vise.
        return (
            <BehandlingSaksopplysning
                navn="Har søkt på tiltak"
                verdi={harSøktPåTiltak!.svar}
                visVarsel
            />
        );
    };

    return <VStack>{render()}</VStack>;
};
