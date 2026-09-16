import { BodyShort, VStack } from '@navikt/ds-react';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { Rammebehandling, Rammebehandlingstype } from '~/lib/rammebehandling/typer/Rammebehandling';
import { useSak } from '~/lib/sak/SakContext';
import { hentSøknadsbehandlingerForSøknad } from '~/lib/sak/sakUtils';
import { hentGjenåpningForBehandling } from '~/lib/søknad/søknadUtils';
import { behandlingUrl } from '~/utils/urls';
import { formaterTidspunkt } from '~/utils/date';
import { formaterSladdbarVerdi } from '~/utils/sladdetVerdi';

export const GjenåpnetSøknadInfokort = (props: { behandling: Rammebehandling }) => {
    const { sak } = useSak();

    if (props.behandling.type !== Rammebehandlingstype.SØKNADSBEHANDLING) {
        return null;
    }

    const { søknad, opprettet, id } = props.behandling;

    const gjenåpning = hentGjenåpningForBehandling(søknad, opprettet);

    // Behandlingene ligger eldst først, så alle utenom den siste er erstattet av en nyere.
    const nyesteBehandling = hentSøknadsbehandlingerForSøknad(sak, søknad.id).at(-1);
    const erstattetAv = nyesteBehandling && nyesteBehandling.id !== id ? nyesteBehandling : null;

    if (!gjenåpning && !erstattetAv) {
        return null;
    }

    return (
        <Infokort
            variant={'info'}
            size={'small'}
            header={erstattetAv ? 'Erstattet behandling' : 'Gjenåpnet søknad'}
        >
            <VStack gap="space-8">
                <VStack>
                    {gjenåpning && (
                        <BodyShort size={'small'}>
                            {`Søknaden ble tatt opp igjen av ${gjenåpning.utførtAv} ${formaterTidspunkt(gjenåpning.tidspunkt)}.`}
                        </BodyShort>
                    )}

                    {gjenåpning?.begrunnelse.verdi && (
                        <BodyShort
                            size={'small'}
                        >{`Begrunnelse: ${formaterSladdbarVerdi(gjenåpning.begrunnelse, (v) => v)}`}</BodyShort>
                    )}
                </VStack>

                {erstattetAv && (
                    <VStack>
                        <BodyShort size={'small'}>
                            {'Behandlingen er erstattet av en nyere behandling på samme søknad.'}
                        </BodyShort>
                        <InternLenke href={behandlingUrl(erstattetAv)}>
                            {'Gå til den nyeste behandlingen'}
                        </InternLenke>
                    </VStack>
                )}
            </VStack>
        </Infokort>
    );
};
