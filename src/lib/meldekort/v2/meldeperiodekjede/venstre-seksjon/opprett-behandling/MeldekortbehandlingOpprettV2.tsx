import { Alert, Button, Loader, Link, InlineMessage, BodyShort } from '@navikt/ds-react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import React, { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortbehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import NextLink from 'next/link';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { useOpprettMeldekortbehandlingV2 } from '~/lib/meldekort/v2/meldeperiodekjede/venstre-seksjon/opprett-behandling/useOpprettMeldekortbehandlingV2';

import style from './MeldekortbehandlingOpprettV2.module.css';

type Props = {
    type: MeldekortbehandlingType;
};

export const MeldekortbehandlingOpprettV2 = ({ type }: Props) => {
    const { sak, setSak } = useSak();
    const { sakId, saksnummer, åpenMeldekortbehandlingId } = sak;

    const { meldeperiodeKjede } = useMeldeperiodeKjedeV2();
    const { id: kjedeId } = meldeperiodeKjede;

    const { opprett, laster, feil } = useOpprettMeldekortbehandlingV2({
        kjedeId,
        sakId,
        type,
    });

    const tekster = teksterForType[type];

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => modalRef.current?.close();

    return (
        <div>
            {feil && (
                <Alert variant={'error'} className={style.varsel}>
                    {feil.message}
                </Alert>
            )}

            {åpenMeldekortbehandlingId && (
                <InlineMessage status={'info'}>
                    <BodyShort spacing={true}>{'Saken har en åpen meldekortbehandling'}</BodyShort>
                    <Link
                        as={NextLink}
                        href={meldekortbehandlingUrl(saksnummer, åpenMeldekortbehandlingId)}
                    >
                        {'Til behandlingen'}
                    </Link>
                </InlineMessage>
            )}

            <Button
                disabled={!!åpenMeldekortbehandlingId}
                onClick={() => modalRef.current?.showModal()}
                className={style.knapp}
            >
                {tekster.start}
            </Button>

            <BekreftelsesModal
                modalRef={modalRef}
                tittel={tekster.modalTittel}
                feil={feil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={laster && <Loader />}
                        disabled={laster}
                        onClick={() => {
                            opprett().then((oppdatertSak) => {
                                if (oppdatertSak) {
                                    setSak(oppdatertSak);
                                    lukkModal();
                                }
                            });
                        }}
                    >
                        {tekster.start}
                    </Button>
                }
            >
                {tekster.modalTekst}
            </BekreftelsesModal>
        </div>
    );
};

const teksterForType = {
    [MeldekortbehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldekortbehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const satisfies Record<MeldekortbehandlingType, Record<string, string>>;
