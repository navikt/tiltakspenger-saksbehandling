import { Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortBehandlingProps } from '../../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortOppsummering } from '../MeldekortOppsummering';
import React, { useEffect, useState } from 'react';
import { formaterTidspunktKort } from '../../../../../../utils/date';
import { meldekortBehandlingTypeTekst } from '../../../../../../utils/tekstformateringUtils';

import style from './MeldekortOppsummeringVelger.module.css';

type Props = {
    meldekortBehandlinger: MeldekortBehandlingProps[];
};

export const MeldekortOppsummeringVelger = ({ meldekortBehandlinger }: Props) => {
    const sisteBehandling = meldekortBehandlinger.at(0);

    const [valgtBehandling, setValgtBehandling] = useState<MeldekortBehandlingProps | undefined>(
        sisteBehandling,
    );

    useEffect(() => {
        setValgtBehandling(sisteBehandling);
    }, [sisteBehandling]);

    if (meldekortBehandlinger.length === 0) {
        return null;
    }

    return (
        <VStack gap={'5'}>
            <HStack className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {`Tidligere behandlinger`}
                </Heading>
                <Select
                    label={'Velg tidligere behandling'}
                    onChange={(event) => {
                        setValgtBehandling(meldekortBehandlinger.at(Number(event.target.value)));
                    }}
                    defaultValue={sisteBehandling!.id}
                    size={'small'}
                >
                    {meldekortBehandlinger.map((behandling, index) => {
                        const { opprettet, type } = behandling;

                        return (
                            <option value={index} key={behandling.id}>
                                {`${formaterTidspunktKort(opprettet)} (${meldekortBehandlingTypeTekst[type]})`}
                            </option>
                        );
                    })}
                </Select>
            </HStack>
            {valgtBehandling && <MeldekortOppsummering meldekortBehandling={valgtBehandling} />}
        </VStack>
    );
};
