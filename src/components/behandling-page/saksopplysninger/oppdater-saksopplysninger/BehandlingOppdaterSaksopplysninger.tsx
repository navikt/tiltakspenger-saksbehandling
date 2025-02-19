import { Button, Loader } from '@navikt/ds-react';
import { ArrowCirclepathIcon, CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useOppdaterSaksopplysninger } from '../useOppdaterSaksopplysninger';
import { useBehandling } from '../../BehandlingContext';
import { useState } from 'react';

import style from './BehandlingOppdaterSaksopplysninger.module.css';

export const BehandlingOppdaterSaksopplysninger = () => {
    const [harOppdatert, setHarOppdatert] = useState(false);

    const { behandling, setBehandling } = useBehandling();
    const { oppdaterOgHentBehandling, isLoading, error } = useOppdaterSaksopplysninger(behandling);

    return (
        <Button
            variant={'tertiary'}
            size={'xsmall'}
            className={style.knapp}
            icon={
                isLoading ? (
                    <Loader />
                ) : harOppdatert ? (
                    <CheckmarkIcon />
                ) : error ? (
                    <XMarkIcon />
                ) : (
                    <ArrowCirclepathIcon />
                )
            }
            onClick={() => {
                oppdaterOgHentBehandling()
                    .then((oppdatertBehandling) => {
                        setHarOppdatert(true);
                        setBehandling(oppdatertBehandling);
                    })
                    .catch();
            }}
        >
            {'Hent oppdaterte opplysninger om tiltak'}
        </Button>
    );
};
