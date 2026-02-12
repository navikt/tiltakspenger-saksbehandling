import { HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortBehandlingProps } from '~/types/meldekort/MeldekortBehandling';
import React, { useState } from 'react';
import { formaterTidspunktKort } from '~/utils/date';
import { MeldeperiodeKorrigering } from '~/types/meldekort/Meldeperiode';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';

import style from './MeldekortAvsluttedeBehandlinger.module.css';
import { AvsluttetMeldekortOppsummering } from './AvsluttetMeldekortOppsummering';

export const MeldekortAvsluttedeBehandlinger = () => {
    const [valgtIndex, setValgtIndex] = useState(0);

    const { avbrutteMeldekortBehandlinger } = useMeldeperiodeKjede();

    const safeValgtIndex =
        avbrutteMeldekortBehandlinger.length === 0
            ? 0
            : Math.min(valgtIndex, avbrutteMeldekortBehandlinger.length - 1);

    const valgtBehandling = avbrutteMeldekortBehandlinger.at(safeValgtIndex);

    return (
        <VStack gap={'space-20'}>
            <HStack className={style.toppRad}>
                <Select
                    label={'Velg avsluttet behandling'}
                    hideLabel={true}
                    onChange={(event) => {
                        setValgtIndex(Number(event.target.value));
                    }}
                    value={safeValgtIndex}
                    size={'small'}
                >
                    {avbrutteMeldekortBehandlinger.map((mbeh, index) => {
                        return (
                            <option
                                value={index}
                                key={
                                    erKorrigeringFraTidligerePeriode(mbeh)
                                        ? mbeh.meldekortId
                                        : mbeh.id
                                }
                            >
                                {optionTekst(mbeh)}
                            </option>
                        );
                    })}
                </Select>
            </HStack>
            {valgtBehandling && (
                <AvsluttetMeldekortOppsummering meldekortBehandling={valgtBehandling} />
            )}
        </VStack>
    );
};

const erKorrigeringFraTidligerePeriode = (
    behandlingEllerTidligereKorrigering: MeldekortBehandlingProps | MeldeperiodeKorrigering,
): behandlingEllerTidligereKorrigering is MeldeperiodeKorrigering =>
    !!(behandlingEllerTidligereKorrigering as MeldeperiodeKorrigering).meldekortId;

const optionTekst = (mbeh: MeldekortBehandlingProps) => {
    const tidspunkt = formaterTidspunktKort(mbeh.avbrutt!.avbruttTidspunkt);
    return `Avsluttet ${tidspunkt}`;
};
