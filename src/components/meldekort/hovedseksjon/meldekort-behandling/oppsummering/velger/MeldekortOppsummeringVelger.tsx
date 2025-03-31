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
    const [valgtIndex, setValgtIndex] = useState(0);

    useEffect(() => {
        setValgtIndex(0);
    }, [meldekortBehandlinger]);

    if (meldekortBehandlinger.length === 0) {
        return null;
    }

    const valgtBehandling = meldekortBehandlinger.at(valgtIndex);

    return (
        <VStack gap={'5'}>
            <HStack className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {`Tidligere behandlinger`}
                </Heading>
                <Select
                    label={'Velg tidligere behandling'}
                    onChange={(event) => {
                        setValgtIndex(Number(event.target.value));
                    }}
                    value={valgtIndex}
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
