import { VStack, BodyShort, Loader } from '@navikt/ds-react';
import styles from './Meldekortdetaljer.module.css';
import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import { useContext } from 'react';
import { SakContext } from '../../layout/SakLayout';

const Meldekortdetaljer = () => {
    const { sakId } = useContext(SakContext);
    const meldekortId = router.query.meldekortId as string;
    const { meldekort, isLoading } = useHentMeldekort(meldekortId, sakId);

    if (isLoading || !meldekort) {
        return <Loader />;
    }

    const {
        periode,
        saksbehandler,
        beslutter,
        tiltaksnavn,
        vedtaksPeriode,
        forrigeNavkontor,
        antallDager,
    } = meldekort;

    return (
        <>
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
                            <b>Utfylt av: </b>
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
        </>
    );
};

export default Meldekortdetaljer;
