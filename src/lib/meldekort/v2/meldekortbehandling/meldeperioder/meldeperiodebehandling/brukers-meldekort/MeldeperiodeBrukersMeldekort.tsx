import {
    BodyShort,
    Button,
    Heading,
    HelpText,
    HStack,
    InlineMessage,
    Select,
    VStack,
} from '@navikt/ds-react';
import { formaterTidspunkt } from '~/utils/date';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';
import { ChevronRightDoubleIcon } from '@navikt/aksel-icons';
import { BrukersMeldekortUker } from '~/lib/meldekort/v2/brukers-meldekort/BrukersMeldekortUker';
import { hentMeldekortForhåndsutfyllingFraBrukersMeldekort } from '~/lib/meldekort/0-felles-komponenter/meldekortForhåndsutfyllingUtils';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/v2/meldekortbehandling/context/MeldekortbehandlingV2Context';
import { BrukersMeldekortAutomatiskBehandlingStatus } from '~/lib/meldekort/3-høyre-seksjon/brukers-meldekort/automatisk-behandling-status/BrukersMeldekortAutomatiskBehandlingStatus';
import { useState } from 'react';
import { BrukersMeldekortId } from '~/lib/meldekort/typer/BrukersMeldekort';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

export const MeldeperiodeBrukersMeldekort = ({ meldeperiodeKjede }: Props) => {
    const { brukersMeldekort, sisteMeldeperiode, id } = meldeperiodeKjede;

    const sisteBrukersMeldekort = brukersMeldekort.at(-1);

    const [valgtMeldekortId, setValgtMeldekortId] = useState<BrukersMeldekortId | undefined>(
        sisteBrukersMeldekort?.id,
    );

    const { erReadonly } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    if (!sisteBrukersMeldekort) {
        return (
            <InlineMessage status={'info'} size={'small'}>
                {'Ingen meldekort mottatt for denne perioden'}
            </InlineMessage>
        );
    }

    const valgtMeldekort =
        brukersMeldekort.find((meldekort) => meldekort.id === valgtMeldekortId) ??
        sisteBrukersMeldekort;

    return (
        <VStack gap={'space-16'}>
            <HStack justify={'space-between'} align={'center'}>
                <Heading size={'xsmall'} level={'4'} spacing={true}>
                    {'Meldekort fra bruker'}
                </Heading>

                <Select
                    label={'Velg meldekort'}
                    hideLabel={true}
                    size={'small'}
                    value={valgtMeldekort.id}
                    onChange={(e) => setValgtMeldekortId(e.target.value as BrukersMeldekortId)}
                >
                    {brukersMeldekort
                        .toSorted((a, b) => b.mottatt.localeCompare(a.mottatt))
                        .map((meldekort, index) => (
                            <option key={meldekort.id} value={meldekort.id}>
                                {`Mottatt ${formaterTidspunkt(meldekort.mottatt)}${index === 0 ? ' (siste)' : ''}`}
                            </option>
                        ))}
                </Select>

                <HelpText>
                    <BodyShort size={'small'} spacing={true}>
                        {'Mottatt: '}
                        <strong>{formaterTidspunkt(valgtMeldekort.mottatt)}</strong>
                    </BodyShort>
                    <BrukersMeldekortAutomatiskBehandlingStatus meldekort={valgtMeldekort} />
                </HelpText>
            </HStack>

            {!erReadonly && (
                <Button
                    variant={'tertiary'}
                    size={'xsmall'}
                    icon={<ChevronRightDoubleIcon />}
                    iconPosition={'right'}
                    onClick={() => {
                        const dager = hentMeldekortForhåndsutfyllingFraBrukersMeldekort(
                            valgtMeldekort,
                            sisteMeldeperiode,
                        );

                        dispatch({
                            type: 'setDager',
                            payload: {
                                dager,
                                kjedeId: id,
                            },
                        });
                    }}
                >
                    {'Fyll inn disse dagene'}
                </Button>
            )}

            <BrukersMeldekortUker brukersMeldekort={valgtMeldekort} kompakt={true} />
        </VStack>
    );
};
