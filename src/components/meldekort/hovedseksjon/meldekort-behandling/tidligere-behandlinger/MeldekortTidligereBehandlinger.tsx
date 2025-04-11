import { Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortBehandlingProps } from '../../../../../types/meldekort/MeldekortBehandling';
import { MeldekortOppsummering } from '../oppsummering/MeldekortOppsummering';
import React, { useEffect, useMemo, useState } from 'react';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '../../../../../utils/date';
import { meldekortBehandlingTypeTekst } from '../../../../../utils/tekstformateringUtils';
import { MeldeperiodeKorrigering } from '../../../../../types/meldekort/Meldeperiode';
import { MeldekortKorrigertFraTidligerePeriode } from '../korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';

import style from './MeldekortTidligereBehandlinger.module.css';

type Props = {
    meldekortBehandlinger: MeldekortBehandlingProps[];
    korrigeringFraTidligerePeriode?: MeldeperiodeKorrigering;
};

export const MeldekortTidligereBehandlinger = ({
    meldekortBehandlinger,
    korrigeringFraTidligerePeriode,
}: Props) => {
    const [valgtIndex, setValgtIndex] = useState(0);
    const _meldekortBehandlinger = useMemo(
        () =>
            korrigeringFraTidligerePeriode
                ? [korrigeringFraTidligerePeriode, ...meldekortBehandlinger]
                : meldekortBehandlinger,
        [meldekortBehandlinger, korrigeringFraTidligerePeriode],
    );

    useEffect(() => {
        setValgtIndex(0);
    }, [_meldekortBehandlinger]);

    if (_meldekortBehandlinger.length === 0) {
        return null;
    }

    const valgtBehandling = _meldekortBehandlinger.at(valgtIndex);

    return (
        <VStack gap={'5'}>
            <HStack className={style.toppRad}>
                <Heading level={'3'} size={'medium'}>
                    {`Tidligere behandlinger`}
                </Heading>
                <Select
                    label={'Velg tidligere behandling'}
                    hideLabel={true}
                    onChange={(event) => {
                        setValgtIndex(Number(event.target.value));
                    }}
                    value={valgtIndex}
                    size={'small'}
                >
                    {_meldekortBehandlinger.map((mbeh, index) => {
                        const erTidligereKorrigering = erKorrigeringFraTidligerePeriode(mbeh);

                        const tekst = erTidligereKorrigering
                            ? `${formaterTidspunktKort(mbeh.iverksatt)} (Korrigert via ${periodeTilFormatertDatotekst(mbeh.periode)})`
                            : `${formaterTidspunktKort(mbeh.godkjentTidspunkt!)} (${meldekortBehandlingTypeTekst[mbeh.type]})`;

                        return (
                            <option
                                value={index}
                                key={erTidligereKorrigering ? mbeh.meldekortId : mbeh.id}
                            >
                                {tekst}
                            </option>
                        );
                    })}
                </Select>
            </HStack>
            {valgtBehandling &&
                (erKorrigeringFraTidligerePeriode(valgtBehandling) ? (
                    <MeldekortKorrigertFraTidligerePeriode korrigering={valgtBehandling} />
                ) : (
                    <MeldekortOppsummering meldekortBehandling={valgtBehandling} />
                ))}
        </VStack>
    );
};

const erKorrigeringFraTidligerePeriode = (
    behandlingEllerTidligereKorrigering: MeldekortBehandlingProps | MeldeperiodeKorrigering,
): behandlingEllerTidligereKorrigering is MeldeperiodeKorrigering =>
    !!(behandlingEllerTidligereKorrigering as MeldeperiodeKorrigering).meldekortId;
