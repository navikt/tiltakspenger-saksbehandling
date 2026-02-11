import { BodyShort, Button, Loader, VStack } from '@navikt/ds-react';
import { ArrowCirclepathIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { useOppdaterSaksopplysninger } from './useOppdaterSaksopplysninger';
import { useBehandling } from '../../context/BehandlingContext';
import { useState } from 'react';
import { classNames } from '~/utils/classNames';
import Varsel from '../../../varsel/Varsel';
import { formaterTidspunktMedSekunder, periodeTilFormatertDatotekst } from '~/utils/date';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import style from './BehandlingOppdaterSaksopplysninger.module.css';
import { randomUUID } from 'node:crypto';

export const BehandlingOppdaterSaksopplysninger = () => {
    const [harOppdatert, setHarOppdatert] = useState(false);

    const { behandling, setBehandling, rolleForBehandling } = useBehandling();
    const { oppslagstidspunkt, periode } = behandling.saksopplysninger;

    const { oppdaterOgHentBehandling, isLoading, error } = useOppdaterSaksopplysninger(behandling);

    return (
        <VStack gap={'space-4'}>
            <BodyShort
                size={'small'}
            >{`Sist oppdatert: ${formaterTidspunktMedSekunder(oppslagstidspunkt)}`}</BodyShort>
            {periode && (
                <BodyShort
                    size={'small'}
                >{`Innhentet for periode: ${periodeTilFormatertDatotekst(periode)}`}</BodyShort>
            )}
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
                    key={`error-${randomUUID()}`}
                    melding={`Oppdatering av saksopplysninger feilet - [${error.status}] ${error.info?.melding || error.message}`}
                />
            )}
        </VStack>
    );
};
