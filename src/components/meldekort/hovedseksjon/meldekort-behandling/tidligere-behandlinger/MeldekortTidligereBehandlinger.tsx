import { Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortOppsummering } from '../oppsummering/MeldekortOppsummering';
import React, { useEffect, useState } from 'react';
import { formaterTidspunktKort } from '../../../../../utils/date';
import { meldekortBehandlingTypeTekst } from '../../../../../utils/tekstformateringUtils';

import style from './MeldekortTidligereBehandlinger.module.css';
import { useMeldeperiodeKjede } from '../../../context/MeldeperiodeKjedeContext';
import { MeldekortKorrigertFraTidligerePeriode } from '../korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';

type Props = {
    meldekortBehandlinger: MeldekortBehandlingProps[];
    visKorrigeringFraTidligerePeriode: boolean;
};

export const MeldekortTidligereBehandlinger = ({
    meldekortBehandlinger,
    visKorrigeringFraTidligerePeriode,
}: Props) => {
    const [valgtIndex, setValgtIndex] = useState(0);

    const { korrigeringFraTidligerePeriode } = useMeldeperiodeKjede().meldeperiodeKjede;

    useEffect(() => {
        setValgtIndex(0);
    }, [meldekortBehandlinger]);

    if (meldekortBehandlinger.length === 0) {
        return null;
    }

    const valgtBehandling = meldekortBehandlinger.at(valgtIndex);

    return (
        <VStack gap={'5'}>
            {visKorrigeringFraTidligerePeriode && korrigeringFraTidligerePeriode && (
                <MeldekortKorrigertFraTidligerePeriode
                    korrigering={korrigeringFraTidligerePeriode}
                />
            )}
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
