import { BodyShort, Button, InlineMessage, Loader, VStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import {
    MeldekortbehandlingProps,
    MeldeperiodebehandlingType,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useMeldeperiodekjede } from '~/lib/meldekort/meldeperiodekjede/context/MeldeperiodekjedeContext';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { useRouter } from 'next/router';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

import style from './MeldekortbehandlingOpprett.module.css';

export const MeldekortbehandlingOpprett = () => {
    const { sakId, saksnummer, åpenMeldekortbehandlingId } = useSak().sak;
    const { id: kjedeId, meldekortbehandlingIder } = useMeldeperiodekjede().meldeperiodeKjede;

    const { trigger, isMutating, error } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    const router = useRouter();

    const modalRef = useRef<HTMLDialogElement>(null);

    const type =
        meldekortbehandlingIder.length === 0
            ? MeldeperiodebehandlingType.FØRSTE_BEHANDLING
            : MeldeperiodebehandlingType.KORRIGERING;

    const tekster = teksterForType[type];

    const lukkModal = () => modalRef.current?.close();

    return (
        <VStack gap={'space-16'}>
            {error && <Infokort variant={'feil'}>{error.message}</Infokort>}

            {åpenMeldekortbehandlingId && (
                <InlineMessage status={'info'}>
                    <BodyShort spacing={true}>{'Saken har en åpen meldekortbehandling'}</BodyShort>
                    <InternLenke
                        href={meldekortbehandlingUrl(saksnummer, åpenMeldekortbehandlingId)}
                    >
                        {'Til behandlingen'}
                    </InternLenke>
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
                feil={error}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={isMutating && <Loader />}
                        disabled={isMutating}
                        onClick={() => {
                            trigger().then((meldekortbehandling) => {
                                if (meldekortbehandling) {
                                    lukkModal();
                                    router.push(
                                        meldekortbehandlingUrl(saksnummer, meldekortbehandling.id),
                                    );
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
        </VStack>
    );
};

const teksterForType: Record<MeldeperiodebehandlingType, Record<string, string>> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldeperiodebehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const;
