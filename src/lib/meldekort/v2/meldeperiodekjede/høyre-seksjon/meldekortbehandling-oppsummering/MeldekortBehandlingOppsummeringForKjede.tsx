import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { Alert, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldekortUker } from '~/lib/meldekort/0-felles-komponenter/uker/MeldekortUker';
import { OppsummeringsPar } from '~/lib/behandling-felles/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { formaterTidspunktKort } from '~/utils/date';
import React from 'react';
import { AkselColor } from '@navikt/ds-react/types/theme';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import {
    meldekortbehandlingStatusTekst,
    meldekortbehandlingTypeTekst,
} from '~/lib/meldekort/v2/tekster';

import style from './MeldekortBehandlingOppsummeringForKjede.module.css';

type Props = {
    meldekortbehandlingId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
};

export const MeldekortBehandlingOppsummeringForKjede = ({
    meldekortbehandlingId,
    kjedeId,
}: Props) => {
    const { sak } = useSak();

    const meldekortbehandling = sak.meldekortbehandlinger[meldekortbehandlingId];

    if (!meldekortbehandling) {
        return (
            <Alert
                variant={'error'}
            >{`Teknisk feil: Fant ikke meldekortbehandling med id ${meldekortbehandlingId}`}</Alert>
        );
    }

    const { status, meldeperioder, saksbehandler, beslutter, opprettet, godkjentTidspunkt, type } =
        meldekortbehandling;

    const meldeperiodebehandlingForKjede = meldeperioder.find((it) => it.kjedeId === kjedeId);

    if (!meldeperiodebehandlingForKjede) {
        return (
            <Alert
                variant={'error'}
            >{`Teknisk feil: Fant ingen behandling av denne meldeperioden på ${meldekortbehandlingId}`}</Alert>
        );
    }

    return (
        <VStack gap={'space-16'} className={style.oppsummering}>
            <HStack className={style.header} gap={'space-12'}>
                <VStack>
                    <Heading level={'3'} size={'small'}>
                        {meldekortbehandlingTypeTekst[type]}
                    </Heading>
                    <InternLenke
                        href={meldekortbehandlingUrl(sak.saksnummer, meldekortbehandlingId)}
                    >
                        {'Åpne behandlingen'}
                    </InternLenke>
                </VStack>
                <Tag data-color={meldekortbehandlingStatusFarge[status]} variant={'outline'}>
                    {meldekortbehandlingStatusTekst[status]}
                </Tag>
            </HStack>

            <div className={style.metadataGrid}>
                {status !== MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET && (
                    <>
                        <OppsummeringsPar
                            label={'Saksbehandler'}
                            verdi={saksbehandler ?? '-'}
                            retning={'vertikal'}
                        />
                        <OppsummeringsPar
                            label={'Beslutter'}
                            verdi={beslutter ?? '-'}
                            retning={'vertikal'}
                        />
                    </>
                )}
                <OppsummeringsPar
                    label={'Opprettet'}
                    verdi={formaterTidspunktKort(opprettet)}
                    retning={'vertikal'}
                />
                <OppsummeringsPar
                    label={'Godkjent'}
                    verdi={godkjentTidspunkt ? formaterTidspunktKort(godkjentTidspunkt) : '-'}
                    retning={'vertikal'}
                />
            </div>

            <MeldekortUker dager={meldeperiodebehandlingForKjede.dager} />
        </VStack>
    );
};

const meldekortbehandlingStatusFarge: Record<MeldekortbehandlingStatus, AkselColor> = {
    [MeldekortbehandlingStatus.KLAR_TIL_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BEHANDLING]: 'info',
    [MeldekortbehandlingStatus.KLAR_TIL_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.UNDER_BESLUTNING]: 'info',
    [MeldekortbehandlingStatus.GODKJENT]: 'success',
    [MeldekortbehandlingStatus.AUTOMATISK_BEHANDLET]: 'success',
    [MeldekortbehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]: 'warning',
    [MeldekortbehandlingStatus.AVBRUTT]: 'neutral',
};
