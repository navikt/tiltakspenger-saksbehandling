import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { SakId } from '~/types/SakTypes';
import router from 'next/router';
import { useOpprettRevurdering } from './useOpprettRevurdering';
import { RevurderingResultat } from '~/types/BehandlingTypes';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';
import { revurderingResultatTekst } from '~/utils/tekstformateringUtils';
import { behandlingUrl } from '~/utils/urls';

type Props = {
    sakId: SakId;
    harVedtak: boolean;
};

export const OpprettRevurdering = ({ sakId, harVedtak }: Props) => {
    const { revurderingInnvilgelseToggle } = useFeatureToggles();

    const [valgtType, setValgtType] = useState<RevurderingResultat | null>(null);

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

                            opprettRevurdering({ revurderingType: valgtType }).then(
                                (behandling) => {
                                    if (behandling) {
                                        router.push(behandlingUrl(behandling));
                                    }
                                },
                            );
                        }}
                    >
                        {`Opprett revurdering${valgtType ? ` (${revurderingResultatTekst[valgtType]})` : ''}`}
                    </Button>
                }
            >
                <RadioGroup
                    legend={'Velg type revurdering'}
                    value={valgtType}
                    onChange={(type: RevurderingResultat) => {
                        setValgtType(type);
                    }}
                >
                    <Radio
                        value={RevurderingResultat.REVURDERING_INNVILGELSE}
                        disabled={!revurderingInnvilgelseToggle}
                    >
                        {'Innvilgelse'}
                    </Radio>
                    <Radio value={RevurderingResultat.STANS}>{'Stans'}</Radio>
                </RadioGroup>
            </BekreftelsesModal>
        </>
    );
};
