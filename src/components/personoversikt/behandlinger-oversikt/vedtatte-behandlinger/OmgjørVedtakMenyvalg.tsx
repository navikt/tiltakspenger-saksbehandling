import { RevurderingResultat } from '~/types/Revurdering';
import { ArrowsCirclepathIcon, CircleSlashIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, Loader } from '@navikt/ds-react';
import { RammevedtakMedBehandling } from '~/types/Rammevedtak';
import { useOpprettRevurdering } from '~/components/personoversikt/opprett-revurdering/useOpprettRevurdering';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { finnFetchFeilmelding } from '~/utils/feilmeldinger';

type Props = {
    sakId: SakId;
    vedtak: RammevedtakMedBehandling;
};

export const OmgjørVedtakMenyvalg = ({ sakId, vedtak }: Props) => {
    const { opprettRevurdering, opprettRevurderingLaster, opprettRevurderingError } =
        useOpprettRevurdering(sakId);

    const kanOmgjøre = !!vedtak.gyldigeKommandoer.OMGJØR;

    return (
        <>
            <ActionMenu.Item
                onSelect={(e) => {
                    e.preventDefault();
                    opprettRevurdering({
                        revurderingType: RevurderingResultat.OMGJØRING,
                        rammevedtakIdSomOmgjøres: vedtak.id,
                    }).then((omgjøringBehandling) => {
                        if (!omgjøringBehandling) {
                            return;
                        }

                        router.push(behandlingUrl(omgjøringBehandling));
                    });
                }}
                icon={
                    opprettRevurderingLaster ? (
                        <Loader size="xsmall" />
                    ) : kanOmgjøre ? (
                        <ArrowsCirclepathIcon aria-hidden />
                    ) : (
                        <CircleSlashIcon aria-hidden />
                    )
                }
                disabled={opprettRevurderingLaster || !kanOmgjøre}
            >
                {kanOmgjøre ? 'Omgjør' : 'Kan ikke omgjøres'}
            </ActionMenu.Item>
            {opprettRevurderingError && (
                <Alert variant={'error'} size={'small'}>
                    {`Kunne ikke opprette omgjøring: ${finnFetchFeilmelding(opprettRevurderingError)}`}
                </Alert>
            )}
        </>
    );
};
