import { Button, Textarea } from '@navikt/ds-react';
import { useBehandling } from '../../context/BehandlingContext';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';

import style from './BehandlingVedtaksBrev.module.css';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';

export const BehandlingVedtaksBrev = () => {
    const { setBrevTekst, behandling, rolleForBehandling } = useBehandling();
    const { fritekstTilVedtaksbrev } = behandling as FørstegangsbehandlingData;

    return (
        <>
            <Textarea
                label={'Tekst til vedtaksbrev'}
                description={'Teksten vises i vedtaksbrevet til bruker.'}
                size={'small'}
                minRows={10}
                resize={'vertical'}
                defaultValue={fritekstTilVedtaksbrev ?? ''}
                readOnly={rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER}
                onChange={(event) => {
                    setBrevTekst(event.target.value);
                }}
            />
            <Button
                size={'small'}
                variant={'secondary'}
                icon={<EnvelopeOpenIcon />}
                className={style.knapp}
            >
                {'Forhåndsvis brev'}
            </Button>
        </>
    );
};
