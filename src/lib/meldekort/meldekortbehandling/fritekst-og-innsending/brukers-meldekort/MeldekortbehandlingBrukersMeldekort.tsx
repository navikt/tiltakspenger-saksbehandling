import { BodyShort, Heading, InlineMessage, VStack } from '@navikt/ds-react';
import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import { useMeldekortbehandling } from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { hentMeldeperiodekjede } from '~/lib/sak/sakUtils';
import { MeldeperiodebehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { formaterMeldeperiode, formaterTidspunkt } from '~/utils/date';

export const MeldekortbehandlingBrukersMeldekort = () => {
    const { meldeperioder } = useMeldekortbehandling();

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.Høyre>
                <Heading size={'small'} level={'3'}>
                    {'Meldekort fra bruker som behandles'}
                </Heading>
            </MeldekortbehandlingSeksjon.Høyre>

            <MeldekortbehandlingSeksjon.Venstre>
                <InlineMessage status={'info'}>
                    {
                        'Alle meldekort fra bruker som ikke er behandlet tidligere, knyttes til behandlingen når den lagres.'
                    }
                </InlineMessage>
            </MeldekortbehandlingSeksjon.Venstre>

            <MeldekortbehandlingSeksjon.Høyre gap={'space-12'}>
                {meldeperioder.map((meldeperiode) => (
                    <BrukersMeldekortForMeldeperiode
                        meldeperiode={meldeperiode}
                        key={meldeperiode.kjedeId}
                    />
                ))}
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

    return (
        <VStack gap={'space-4'}>
            <BodyShort weight={'semibold'}>{formaterMeldeperiode(meldeperiode.periode)}</BodyShort>
            {behandledeMeldekort.length === 0 ? (
                <BodyShort size={'small'}>{'Ingen meldekort fra bruker behandles'}</BodyShort>
            ) : (
                behandledeMeldekort.map((meldekort) => (
                    <BodyShort size={'small'} key={meldekort.id}>
                        {`Mottatt ${formaterTidspunkt(meldekort.mottatt)}`}
                    </BodyShort>
                ))
            )}
        </VStack>
    );
};
