import { HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingProps } from '~/types/meldekort/Meldekortbehandling';
import React, { useState } from 'react';
import { formaterTidspunktKort } from '~/utils/date';
import { MeldeperiodeKorrigering } from '~/types/meldekort/Meldeperiode';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';

import style from './MeldekortAvsluttedeBehandlinger.module.css';
import { AvsluttetMeldekortOppsummering } from './AvsluttetMeldekortOppsummering';

export const MeldekortAvsluttedeBehandlinger = () => {
    const [valgtIndex, setValgtIndex] = useState(0);

    const { avbrutteMeldekortbehandlinger } = useMeldeperiodeKjede();

    const safeValgtIndex =
        avbrutteMeldekortbehandlinger.length === 0
            ? 0
            : Math.min(valgtIndex, avbrutteMeldekortbehandlinger.length - 1);

    const valgtBehandling = avbrutteMeldekortbehandlinger.at(safeValgtIndex);

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
                    {avbrutteMeldekortbehandlinger.map((mbeh, index) => {
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
                <AvsluttetMeldekortOppsummering meldekortbehandling={valgtBehandling} />
            )}
        </VStack>
    );
};

const erKorrigeringFraTidligerePeriode = (
    behandlingEllerTidligereKorrigering: MeldekortbehandlingProps | MeldeperiodeKorrigering,
): behandlingEllerTidligereKorrigering is MeldeperiodeKorrigering =>
    !!(behandlingEllerTidligereKorrigering as MeldeperiodeKorrigering).meldekortId;

const optionTekst = (mbeh: MeldekortbehandlingProps) => {
    const tidspunkt = formaterTidspunktKort(mbeh.avbrutt!.avbruttTidspunkt);
    return `Avsluttet ${tidspunkt}`;
};
