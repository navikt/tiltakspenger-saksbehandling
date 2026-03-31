import { Alert, HStack, Select, VStack } from '@navikt/ds-react';
import {
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
} from '~/types/meldekort/Meldekortbehandling';
import { MeldekortOppsummering } from '../../0-felles-komponenter/meldekort-oppsummering/MeldekortOppsummering';
import React, { useMemo, useState } from 'react';
import { formaterTidspunktKort, periodeTilFormatertDatotekst } from '~/utils/date';
import { MeldeperiodeKorrigering } from '~/types/meldekort/Meldeperiode';
import { MeldekortKorrigertFraTidligerePeriode } from '../../0-felles-komponenter/korrigert-fra-tidligere/MeldekortKorrigertFraTidligerePeriode';
import { useMeldeperiodeKjede } from '../../context/MeldeperiodeKjedeContext';

import style from './MeldekortTidligereBehandlinger.module.css';

export const MeldekortTidligereBehandlinger = () => {
    const [valgtIndex, setValgtIndex] = useState(0);

    const {
        meldeperiodeKjede,
        sisteMeldekortbehandling,
        tidligereMeldekortbehandlinger,
        alleMeldekortbehandlinger,
    } = useMeldeperiodeKjede();

    const { korrigeringFraTidligerePeriode } = meldeperiodeKjede;

    // Hvis den siste behandlingen er godkjent, og beregningen senere er overstyrt av korrigering på en
    // tidligere periode, så viser vi også siste behandling under "tidligere behandlinger".
    const behandlingerOgKorrigeringer = useMemo(
        () =>
            korrigeringFraTidligerePeriode
                ? sisteMeldekortbehandling?.erAvsluttet
                    ? alleMeldekortbehandlinger
                    : [korrigeringFraTidligerePeriode, ...tidligereMeldekortbehandlinger]
                : tidligereMeldekortbehandlinger,
        [
            tidligereMeldekortbehandlinger,
            korrigeringFraTidligerePeriode,
            alleMeldekortbehandlinger,
            sisteMeldekortbehandling,
        ],
    );

    if (behandlingerOgKorrigeringer.length === 0) {
        return (
            <Alert variant={'info'} inline={true}>
                {'Meldeperioden har ingen tidligere behandlinger'}
            </Alert>
        );
    }

    const safeValgtIndex = Math.min(valgtIndex, behandlingerOgKorrigeringer.length - 1);
    const valgtBehandling = behandlingerOgKorrigeringer.at(safeValgtIndex);

    return (
        <VStack gap={'space-20'}>
            <HStack className={style.toppRad}>
                <Select
                    label={'Velg tidligere behandling'}
                    hideLabel={true}
                    onChange={(event) => {
                        setValgtIndex(Number(event.target.value));
                    }}
                    value={safeValgtIndex}
                    size={'small'}
                >
                    {behandlingerOgKorrigeringer.map((mbeh, index) => {
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
            {valgtBehandling &&
                (erKorrigeringFraTidligerePeriode(valgtBehandling) ? (
                    <MeldekortKorrigertFraTidligerePeriode korrigering={valgtBehandling} />
                ) : (
                    <MeldekortOppsummering meldekortbehandling={valgtBehandling} />
                ))}
        </VStack>
    );
};

const erKorrigeringFraTidligerePeriode = (
    behandlingEllerTidligereKorrigering: MeldekortbehandlingProps | MeldeperiodeKorrigering,
): behandlingEllerTidligereKorrigering is MeldeperiodeKorrigering =>
    !!(behandlingEllerTidligereKorrigering as MeldeperiodeKorrigering).meldekortId;

const optionTekst = (mbeh: MeldekortbehandlingProps | MeldeperiodeKorrigering) => {
    if (erKorrigeringFraTidligerePeriode(mbeh)) {
        return `${formaterTidspunktKort(mbeh.iverksatt)} (korrigert via ${periodeTilFormatertDatotekst(mbeh.periode)})`;
    }

    const tidspunkt = formaterTidspunktKort(mbeh.godkjentTidspunkt!);

    if (mbeh.type === MeldekortbehandlingType.KORRIGERING) {
        return `${tidspunkt} (korrigering)`;
    }

    return `${tidspunkt} (${mbeh.status === MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET ? 'automatisk behandlet' : 'manuelt behandlet'})`;
};
