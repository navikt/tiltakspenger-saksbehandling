import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { useOpprettRevurdering } from './useOpprettRevurdering';

import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';

import { behandlingUrl } from '~/utils/urls';
import { BehandlingResultat } from '~/types/Behandling';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';

type Props = {
    sakId: SakId;
    harVedtak: boolean;
};

export const OpprettRevurdering = ({ sakId, harVedtak }: Props) => {
    const [valgtType, setValgtType] = useState<BehandlingResultat | null>(null);

    const { opprettRevurdering, opprettRevurderingLaster, opprettRevurderingError } =
        useOpprettRevurdering(sakId);

    const modalRef = useRef<HTMLDialogElement>(null);

    const lukkModal = () => {
        modalRef.current?.close();
        setValgtType(null);
    };

    return (
        <>
            <Button
                size={'small'}
                variant={'secondary'}
                type={'button'}
                onClick={() => modalRef.current?.showModal()}
                disabled={!harVedtak}
            >
                {'Opprett revurdering'}
            </Button>
            <BekreftelsesModal
                modalRef={modalRef}
                lukkModal={lukkModal}
                feil={opprettRevurderingError}
                tittel={'Opprett revurdering'}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        type={'button'}
                        loading={opprettRevurderingLaster}
                        disabled={!valgtType}
                        onClick={() => {
                            if (!valgtType) {
                                return;
                            }

                            opprettRevurdering({
                                revurderingType: valgtType,
                                rammevedtakIdSomOmgjøres: null,
                            }).then((behandling) => {
                                if (behandling) {
                                    router.push(behandlingUrl(behandling));
                                }
                            });
                        }}
                    >
                        {`Opprett revurdering${valgtType ? ` (${behandlingResultatTilText[valgtType]})` : ''}`}
                    </Button>
                }
            >
                <RadioGroup
                    legend={'Velg type revurdering'}
                    value={valgtType}
                    onChange={(type: BehandlingResultat) => {
                        setValgtType(type);
                    }}
                >
                    <Radio value={BehandlingResultat.REVURDERING_INNVILGELSE}>
                        {'Innvilgelse'}
                    </Radio>
                    <Radio value={BehandlingResultat.STANS}>{'Stans'}</Radio>
                </RadioGroup>
            </BekreftelsesModal>
        </>
    );
};
