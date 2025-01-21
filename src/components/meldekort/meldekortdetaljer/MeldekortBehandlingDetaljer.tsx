import { MeldekortBehandling } from '../../../types/MeldekortTypes';
import { BodyShort } from '@navikt/ds-react';

type Props = {
    meldekortBehandling: MeldekortBehandling;
};

export const MeldekortBehandlingDetaljer = ({ meldekortBehandling }: Props) => {
    const { forrigeNavkontor, saksbehandler, beslutter } = meldekortBehandling;

    return (
        <>
            {forrigeNavkontor && (
                <>
                    <BodyShort>
                        <b>Forrige meldekorts navkontor</b>
                    </BodyShort>
                    <BodyShort>{forrigeNavkontor}</BodyShort>
                </>
            )}
            {saksbehandler && (
                <>
                    <BodyShort>
                        <b>Behandlet av: </b>
                    </BodyShort>
                    <BodyShort>{saksbehandler}</BodyShort>
                </>
            )}
            {beslutter && (
                <>
                    <BodyShort>
                        <b>Godkjent av: </b>
                    </BodyShort>
                    <BodyShort>{beslutter}</BodyShort>
                </>
            )}
        </>
    );
};
