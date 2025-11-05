import { BodyShort, Button, Loader } from '@navikt/ds-react';
import { ArrowCirclepathIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { useOppdaterSaksopplysninger } from './useOppdaterSaksopplysninger';
import { useBehandling } from '../../context/BehandlingContext';
import { useState } from 'react';
import { classNames } from '~/utils/classNames';
import Varsel from '../../../varsel/Varsel';
import { formaterTidspunktMedSekunder } from '~/utils/date';

import style from './BehandlingOppdaterSaksopplysninger.module.css';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

export const BehandlingOppdaterSaksopplysninger = () => {
    const [harOppdatert, setHarOppdatert] = useState(false);

    const { behandling, setBehandling, rolleForBehandling } = useBehandling();
    const { oppslagstidspunkt } = behandling.saksopplysninger;

    const { oppdaterOgHentBehandling, isLoading, error } = useOppdaterSaksopplysninger(behandling);

    return (
        <>
            {rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER && (
                <Button
                    variant={'tertiary'}
                    size={'xsmall'}
                    className={classNames(style.knapp, harOppdatert && style.loaded)}
                    icon={
                        isLoading ? (
                            <Loader size={'small'} />
                        ) : harOppdatert ? (
                            <CheckmarkIcon />
                        ) : (
                            <ArrowCirclepathIcon />
                        )
                    }
                    onClick={() => {
                        oppdaterOgHentBehandling().then((oppdatertBehandling) => {
                            if (oppdatertBehandling) {
                                setHarOppdatert(true);
                                setBehandling(oppdatertBehandling);
                                setTimeout(() => setHarOppdatert(false), 3000);
                            }
                        });
                    }}
                >
                    {'Hent oppdaterte saksopplysninger'}
                </Button>
            )}

            {error && (
                <Varsel
                    variant={'error'}
                    size={'small'}
                    className={style.varsel}
                    key={Date.now()}
                    melding={`Oppdatering av saksopplysninger feilet - [${error.status}] ${error.info?.melding || error.message}`}
                />
            )}

            <BodyShort
                size={'small'}
            >{`Sist oppdatert: ${formaterTidspunktMedSekunder(oppslagstidspunkt)}`}</BodyShort>
        </>
    );
};
