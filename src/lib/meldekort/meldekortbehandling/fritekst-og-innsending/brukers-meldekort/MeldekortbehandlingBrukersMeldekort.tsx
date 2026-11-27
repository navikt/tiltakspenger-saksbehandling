import { BodyLong, BodyShort, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { useMeldekortbehandling } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldeperiodebehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { formaterMeldeperiode, formaterTidspunkt } from '~/utils/date';
import { Infokort } from '~/lib/_felles/infokort/Infokort';

export const MeldekortbehandlingBrukersMeldekort = () => {
    const { meldeperioder } = useMeldekortbehandling();

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.Høyre gap={'space-12'}>
                <Infokort variant={'info'}>
                    <BodyLong>{'Nye meldekort som behandles:'}</BodyLong>
                    {meldeperioder.map((meldeperiode) => (
                        <BrukersMeldekortForMeldeperiode
                            meldeperiode={meldeperiode}
                            key={meldeperiode.kjedeId}
                        />
                    ))}
                </Infokort>
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};

const BrukersMeldekortForMeldeperiode = ({
    meldeperiode,
}: {
    meldeperiode: MeldeperiodebehandlingProps;
}) => {
    const { sak } = useSak();
    const { brukersMeldekort } = hentMeldeperiodekjede(sak, meldeperiode.kjedeId);

    const behandledeMeldekort = brukersMeldekort.filter((meldekort) =>
        meldeperiode.brukersMeldekortIder.includes(meldekort.id),
    );

    // Kjedens meldekort er sortert på mottatt, og alle etter det første er korrigeringer
    const erKorrigering = (meldekort: BrukersMeldekortProps) =>
        brukersMeldekort[0]?.id !== meldekort.id;

    return (
        <VStack gap={'space-4'}>
            <BodyShort weight={'semibold'} size={'small'}>
                {formaterMeldeperiode(meldeperiode.periode)}
            </BodyShort>
            {behandledeMeldekort.length === 0 ? (
                <BodyShort size={'small'}>{'Ingen meldekort fra bruker behandles'}</BodyShort>
            ) : (
                behandledeMeldekort.map((meldekort) => (
                    <BodyShort size={'small'} key={meldekort.id}>
                        {`Mottatt ${formaterTidspunkt(meldekort.mottatt)}`}
                        {erKorrigering(meldekort) && ' (korrigering)'}
                        {meldekort.meldeperiodeId !== meldeperiode.meldeperiodeId &&
                            ' (gjelder en tidligere versjon av meldeperioden)'}
                    </BodyShort>
                ))
            )}
        </VStack>
    );
};
