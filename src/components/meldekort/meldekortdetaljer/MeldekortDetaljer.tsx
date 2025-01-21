import { VStack, BodyShort } from '@navikt/ds-react';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import { Meldeperiode, MeldeperiodeKjede } from '../../../types/MeldekortTypes';
import { MeldekortBehandlingDetaljer } from './MeldekortBehandlingDetaljer';

import styles from './Meldekortdetaljer.module.css';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjede;
    meldeperiode: Meldeperiode;
};

const MeldekortDetaljer = ({ meldeperiode, meldeperiodeKjede }: Props) => {
    const { vedtaksPeriode, periode, tiltaksnavn } = meldeperiodeKjede;
    const { antallDager, meldekortBehandling } = meldeperiode;

    return (
        <VStack gap="3" className={styles.wrapper}>
            <BodyShort weight={'semibold'}>Vedtaksperiode:</BodyShort>
            <BodyShort>{periodeTilFormatertDatotekst(vedtaksPeriode)}</BodyShort>

            <BodyShort weight={'semibold'}>Meldekortperiode:</BodyShort>
            <BodyShort>{periodeTilFormatertDatotekst(periode)}</BodyShort>

            <BodyShort weight={'semibold'}>Tiltak</BodyShort>
            <BodyShort>{tiltaksnavn}</BodyShort>

            <BodyShort weight={'semibold'}>Antall dager per meldeperiode</BodyShort>
            <BodyShort>{antallDager}</BodyShort>

            {meldekortBehandling && (
                <MeldekortBehandlingDetaljer meldekortBehandling={meldekortBehandling} />
            )}
        </VStack>
    );
};

export default MeldekortDetaljer;
