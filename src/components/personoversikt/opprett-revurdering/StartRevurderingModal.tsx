import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useState } from 'react';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { useStartRevurdering } from './useStartRevurdering';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { behandlingUrl } from '~/utils/urls';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { RevurderingResultat } from '~/types/Revurdering';

type Props = {
    sakId: SakId;
    åpen: boolean;
    setÅpen: (åpen: boolean) => void;
};

export const StartRevurderingModal = ({ sakId, åpen, setÅpen }: Props) => {
    const [valgtType, setValgtType] = useState<RevurderingResultat | null>(null);

    const { startRevurdering, startRevurderingLaster, startRevurderingError } =
        useStartRevurdering(sakId);

    const lukkModal = () => {
        setÅpen(false);
        setValgtType(null);
    };

    return (
        <>
            <BekreftelsesModal
                åpen={åpen}
                lukkModal={lukkModal}
                feil={startRevurderingError}
                tittel={'Start revurdering'}
                bekreftKnapp={
                    <Button
                        variant={'primary'}
                        type={'button'}
                        loading={startRevurderingLaster}
                        disabled={!valgtType}
                        onClick={() => {
                            if (!valgtType) {
                                return;
                            }

                            startRevurdering({
                                revurderingType: valgtType,
                                rammevedtakIdSomOmgjøres: null,
                            }).then((behandling) => {
                                if (behandling) {
                                    lukkModal();
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
                    onChange={(type: RevurderingResultat) => {
                        setValgtType(type);
                    }}
                >
                    <Radio value={RevurderingResultat.INNVILGELSE}>{'Innvilgelse'}</Radio>
                    <Radio value={RevurderingResultat.STANS}>{'Stans'}</Radio>
                </RadioGroup>
            </BekreftelsesModal>
        </>
    );
};
