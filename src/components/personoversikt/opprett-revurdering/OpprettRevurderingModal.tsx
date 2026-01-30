import { Button, Radio, RadioGroup } from '@navikt/ds-react';
import { useState } from 'react';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { useOpprettRevurdering } from './useOpprettRevurdering';
import { BekreftelsesModal } from '~/components/modaler/BekreftelsesModal';
import { behandlingUrl } from '~/utils/urls';
import { behandlingResultatTilText } from '~/utils/tekstformateringUtils';
import { RevurderingResultat } from '~/types/Revurdering';

type Props = {
    sakId: SakId;
    åpen: boolean;
    setÅpen: (åpen: boolean) => void;
};

export const OpprettRevurderingModal = ({ sakId, åpen, setÅpen }: Props) => {
    const [valgtType, setValgtType] = useState<RevurderingResultat | null>(null);

    const { opprettRevurdering, opprettRevurderingLaster, opprettRevurderingError } =
        useOpprettRevurdering(sakId);

    const lukkModal = () => {
        setÅpen(false);
        setValgtType(null);
    };

    return (
        <>
            <BekreftelsesModal
                åpen={åpen}
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
