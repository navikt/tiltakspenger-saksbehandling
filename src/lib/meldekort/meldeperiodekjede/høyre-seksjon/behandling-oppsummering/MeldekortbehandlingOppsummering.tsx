import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { useSak } from '~/lib/sak/SakContext';
import { Alert, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldekortUker } from '~/lib/meldekort/felles/uker/MeldekortUker';
import { OppsummeringsPar } from '~/lib/behandling-felles/oppsummeringer/oppsummeringspar/OppsummeringsPar';
import { formaterTidspunktKort } from '~/utils/date';
import { meldekortbehandlingStatusFarge } from '~/lib/meldekort/utils/statusProps';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { TilbakekrevingOppsummering } from '~/lib/tilbakekreving/TilbakekrevingOppsummering';
import OppsummeringAvKlageForRammebehandling from '~/lib/behandling-felles/oppsummeringer/klage/oppsummeringAvKlageForRammebehandling/OppsummeringAvKlageForRammebehandling';
import { hentKlagebehandling, hentMeldekortbehandling } from '~/lib/sak/sakUtils';
import {
    meldekortbehandlingStatusTekst,
    meldeperiodebehandlingTypeTekst,
} from '~/lib/meldekort/utils/tekster';

import style from './MeldekortBehandlingOppsummering.module.css';

type Props = {
    meldekortbehandlingId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
    className?: string;
};

export const MeldekortbehandlingOppsummering = ({
    meldekortbehandlingId,
    kjedeId,
    className,
}: Props) => {
    const { sak } = useSak();

    const meldekortbehandling = hentMeldekortbehandling(sak, meldekortbehandlingId);

    const {
        status,
        meldeperioder,
        saksbehandler,
        beslutter,
        opprettet,
        godkjentTidspunkt,
        tilbakekrevingId,
        klagebehandlingId,
    } = meldekortbehandling;

    const meldeperiodebehandlingForKjede = meldeperioder.find((it) => it.kjedeId === kjedeId);

    if (!meldeperiodebehandlingForKjede) {
        return (
            <Alert variant={'error'}>
                {`Teknisk feil: Fant ingen behandling av denne meldeperioden på ${meldekortbehandlingId}`}
            </Alert>
        );
    }

    return (
        <VStack gap={'space-16'} className={className}>
            <HStack className={style.header} gap={'space-12'}>
                <VStack>
                    <Heading level={'3'} size={'small'}>
                        {meldeperiodebehandlingTypeTekst[meldeperiodebehandlingForKjede.type]}
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

            {tilbakekrevingId && <TilbakekrevingOppsummering tilbakekrevingId={tilbakekrevingId} />}

            {klagebehandlingId && (
                <OppsummeringAvKlageForRammebehandling
                    klagebehandling={hentKlagebehandling(sak, klagebehandlingId)}
                />
            )}
        </VStack>
    );
};
