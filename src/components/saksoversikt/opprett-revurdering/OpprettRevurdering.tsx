import { Button } from '@navikt/ds-react';
import Spørsmålsmodal from '../../modaler/Spørsmålsmodal';
import { useRef } from 'react';
import { SakId } from '../../../types/SakTypes';
import router from 'next/router';
import { useOpprettRevurdering } from './useOpprettRevurdering';
import { RevurderingType } from '../../../types/BehandlingTypes';

type Props = {
    sakId: SakId;
    harVedtak: boolean;
};

export const OpprettRevurdering = ({ sakId, harVedtak }: Props) => {
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
                    opprettRevurdering({ revurderingType: RevurderingType.STANS }).then((data) => {
                        if (data) {
                            router.push(`/behandling/${data.id}`);
                        }
                    });
                }}
            />
        </>
    );
};
