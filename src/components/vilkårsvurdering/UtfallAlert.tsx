import React from "react";
import {Alert} from "@navikt/ds-react";
import {Utfall} from "../../types/Utfall";

interface UtfallAlertProps {
    utfall: Utfall;
}

interface AlertProps {
    variant: 'success' | 'error' | 'warning';
    tekst: string;
    altTekst?: string;
}

const UtfallAlert = ({utfall}: UtfallAlertProps) => {
    console.log(utfall)
    const {variant, tekst, altTekst} = utledAlertProps(utfall)
    return(
        <Alert variant={variant}>
            {tekst}
            {altTekst && (
                <>
                    <br />
                    {altTekst}
                </>
            )}
        </Alert>
    )
}

const utledAlertProps = (utfall: Utfall): AlertProps => {
    switch (utfall) {
        case Utfall.KREVER_MANUELL_VURDERING:
            return {
                variant: 'warning',
                tekst: 'Krever manuell saksbehandling',
            }
        case Utfall.IKKE_OPPFYLT:
            return {
                variant: 'error',
                tekst: 'Vilkår for tiltakspenger er ikke oppfylt for perioden.',
                altTekst: 'Søknaden kan ikke behandles videre i denne løsningen.',
            }
        case Utfall.OPPFYLT:
            return {
                variant: 'success',
                tekst: 'Vilkår for tiltakspenger er oppfylt for perioden',
            }
    }
}

export default UtfallAlert
