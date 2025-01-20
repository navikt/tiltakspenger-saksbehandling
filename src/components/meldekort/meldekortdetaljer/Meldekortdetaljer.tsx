import { VStack, BodyShort } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import { Meldeperiode, MeldeperiodeKjede } from '../../../types/MeldekortTypes';

import styles from './Meldekortdetaljer.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjede;
    meldeperiode: Meldeperiode;
};

const Meldekortdetaljer = ({ meldeperiode, meldeperiodeKjede }: Props) => {
    const { vedtaksPeriode, periode, tiltaksnavn } = meldeperiodeKjede;
    const { antallDager, meldekortBehandling } = meldeperiode;
    const { forrigeNavkontor, saksbehandler, beslutter } = meldekortBehandling;

    return (
        <VStack gap="3" className={styles.wrapper}>
            <BodyShort>
                <b>Vedtaksperiode: </b>
            </BodyShort>
            <BodyShort>{periodeTilFormatertDatotekst(vedtaksPeriode)}</BodyShort>
            <BodyShort>
                <b>Meldekortperiode: </b>
            </BodyShort>
            <BodyShort>{periodeTilFormatertDatotekst(periode)}</BodyShort>
            <BodyShort>
                <b>Tiltak</b>
            </BodyShort>
            <BodyShort>{tiltaksnavn}</BodyShort>
            <BodyShort>
                <b>Antall dager per meldeperiode</b>
            </BodyShort>
            <BodyShort>{antallDager}</BodyShort>
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
        </VStack>
    );
};

export default Meldekortdetaljer;
