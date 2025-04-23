import { Alert, HStack, Select, VStack } from '@navikt/ds-react';
import { MeldekortBehandlingProps } from '../../../../types/meldekort/MeldekortBehandling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import React, { useEffect, useMemo, useState } from 'react';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '../../../../utils/date';
import { meldekortBehandlingTypeTekst } from '../../../../utils/tekstformateringUtils';
import { MeldeperiodeKorrigering } from '../../../../types/meldekort/Meldeperiode';
import { MeldekortKorrigertFraTidligerePeriode } from '../../0-felles-komponenter/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { useMeldeperiodeKjede } from '../../MeldeperiodeKjedeContext';

import style from './MeldekortTidligereBehandlinger.module.css';

export const MeldekortTidligereBehandlinger = () => {
    const [valgtIndex, setValgtIndex] = useState(0);

    const {
        meldeperiodeKjede,
        sisteMeldekortBehandling,
        tidligereMeldekortBehandlinger,
        alleMeldekortBehandlinger,
    } = useMeldeperiodeKjede();

    const { korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi også siste behandling under "tidligere behandlinger".
    const behandlingerOgKorrigeringer = useMemo(
        () =>
            korrigeringFraTidligerePeriode
                ? sisteMeldekortBehandling?.erAvsluttet
                    ? alleMeldekortBehandlinger
                    : [korrigeringFraTidligerePeriode, ...tidligereMeldekortBehandlinger]
                : tidligereMeldekortBehandlinger,
        [
            tidligereMeldekortBehandlinger,
            korrigeringFraTidligerePeriode,
            alleMeldekortBehandlinger,
            sisteMeldekortBehandling,
        ],
    );

    useEffect(() => {
        setValgtIndex(0);
    }, [behandlingerOgKorrigeringer]);

    if (behandlingerOgKorrigeringer.length === 0) {
        return (
            <Alert variant={'info'} inline={true}>
                {'Meldeperioden har ingen tidligere behandlinger'}
            </Alert>
        );
    }

    const valgtBehandling = behandlingerOgKorrigeringer.at(valgtIndex);

    return (
        <VStack gap={'5'}>
            <HStack className={style.toppRad}>
                <Select
                    label={'Velg tidligere behandling'}
                    hideLabel={true}
                    onChange={(event) => {
                        setValgtIndex(Number(event.target.value));
                    }}
                    value={valgtIndex}
                    size={'small'}
                >
                    {behandlingerOgKorrigeringer.map((mbeh, index) => {
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
