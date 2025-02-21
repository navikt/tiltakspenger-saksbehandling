import { Button } from '@navikt/ds-react';
import Spørsmålsmodal from '../../revurderingsmodal/Spørsmålsmodal';
import { useRef } from 'react';
import { SakId } from '../../../types/SakTypes';
import { mutate } from 'swr';
import router from 'next/router';
import { useOpprettRevurderingV2 } from '../../behandling-page/revurdering/stans-skjema/useOpprettRevurderingV2';

type Props = {
    førsteLovligeStansdato: string;
    sakId: SakId;
    saksnummer: string;
};

export const RevurderTilStans = ({ førsteLovligeStansdato, sakId, saksnummer }: Props) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const { opprettRevurdering } = useOpprettRevurderingV2(sakId);

    return (
        <>
            <Button size="small" variant="secondary" onClick={() => modalRef.current?.showModal()}>
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
