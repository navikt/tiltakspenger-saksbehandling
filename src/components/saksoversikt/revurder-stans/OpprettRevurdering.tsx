import { Button } from '@navikt/ds-react';
import Spørsmålsmodal from '../../revurderingsmodal/Spørsmålsmodal';
import { useRef } from 'react';
import { SakId } from '../../../types/SakTypes';
import { mutate } from 'swr';
import router from 'next/router';
import { useOpprettRevurdering } from '../../behandling-page/revurdering/stans-skjema/useOpprettRevurdering';

type Props = {
    sakId: SakId;
    saksnummer: string;
    harVedtak: boolean;
};

export const OpprettRevurdering = ({ sakId, saksnummer, harVedtak }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const { opprettRevurdering } = useOpprettRevurdering(sakId);

    return (
        <>
            <Button
                size="small"
                variant="secondary"
                onClick={() => modalRef.current?.showModal()}
                disabled={!harVedtak}
            >
                {'Opprett revurdering'}
            </Button>
            <Spørsmålsmodal
                modalRef={modalRef}
                heading="Bekreft opprett revurdering"
                submitTekst="Opprett revurdering"
                onSubmit={() => {
                    opprettRevurdering().then((data) => {
                        mutate(`/api/sak/${saksnummer}`);
                        router.push(`/behandling/${data.id}`);
                    });
                }}
            />
        </>
    );
};
