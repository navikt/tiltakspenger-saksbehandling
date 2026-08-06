import { Button, Dialog, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { SakId } from '~/lib/sak/SakTyper';
import router from 'next/router';
import { useStartRevurdering } from './useStartRevurdering';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { behandlingUrl } from '~/utils/urls';
import { rammebehandlingResultatTekst } from '~/utils/tekstformateringUtils';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

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
        <Dialog open={åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && lukkModal()}>
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>{'Start revurdering'}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <VStack gap={'space-16'}>
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

                        {startRevurderingError && (
                            <Infokort variant={'feil'} size={'small'}>
                                {startRevurderingError.message}
                            </Infokort>
                        )}
                    </VStack>
                </Dialog.Body>

                <Dialog.Footer>
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
                        {`Opprett revurdering${valgtType ? ` (${rammebehandlingResultatTekst[valgtType]})` : ''}`}
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button variant={'secondary'} type={'button'}>
                            {'Avbryt'}
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
