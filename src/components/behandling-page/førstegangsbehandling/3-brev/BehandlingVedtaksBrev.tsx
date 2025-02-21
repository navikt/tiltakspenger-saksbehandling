import { Button, Textarea } from '@navikt/ds-react';
import { EnvelopeOpenIcon } from '@navikt/aksel-icons';
import { SaksbehandlerRolle } from '../../../../types/Saksbehandler';
import { FørstegangsbehandlingData } from '../../../../types/BehandlingTypes';
import { useFørstegangsbehandling } from '../FørstegangsbehandlingContext';

import style from './BehandlingVedtaksBrev.module.css';

export const BehandlingVedtaksBrev = () => {
    const { setBrevTekst, behandling, rolleForBehandling } = useFørstegangsbehandling();
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
