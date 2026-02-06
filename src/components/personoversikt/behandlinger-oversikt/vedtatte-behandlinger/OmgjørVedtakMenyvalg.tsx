import { RevurderingResultat } from '~/types/Revurdering';
import { ArrowsCirclepathIcon, CircleSlashIcon } from '@navikt/aksel-icons';
import { ActionMenu, Alert, Loader } from '@navikt/ds-react';
import { RammevedtakMedBehandling } from '~/types/Rammevedtak';
import { useStartRevurdering } from '~/components/personoversikt/opprett-revurdering/useStartRevurdering';
import { SakId } from '~/types/Sak';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';
import { finnFetchFeilmelding } from '~/utils/feilmeldinger';
import { useFeatureToggles } from '~/context/feature-toggles/FeatureTogglesContext';

type Props = {
    sakId: SakId;
    vedtak: RammevedtakMedBehandling;
};

export const OmgjørVedtakMenyvalg = ({ sakId, vedtak }: Props) => {
    const { startRevurdering, startRevurderingLaster, startRevurderingError } =
        useStartRevurdering(sakId);

    const { opphørToggle } = useFeatureToggles();

    const kanOmgjøre = !!vedtak.gyldigeKommandoer.OMGJØR;

    return (
        <>
            <ActionMenu.Item
                onSelect={(e) => {
                    e.preventDefault();
                    startRevurdering({
                        revurderingType: RevurderingResultat.OMGJØRING,
                        rammevedtakIdSomOmgjøres: vedtak.id,
                        nyOmgjøring: opphørToggle,
                    }).then((omgjøringBehandling) => {
                        if (!omgjøringBehandling) {
                            return;
                        }

                        router.push(behandlingUrl(omgjøringBehandling));
                    });
                }}
                icon={
                    startRevurderingLaster ? (
                        <Loader size="xsmall" />
                    ) : kanOmgjøre ? (
                        <ArrowsCirclepathIcon aria-hidden />
                    ) : (
                        <CircleSlashIcon aria-hidden />
                    )
                }
                disabled={startRevurderingLaster || !kanOmgjøre}
            >
                {kanOmgjøre ? 'Omgjør' : 'Kan ikke omgjøres'}
            </ActionMenu.Item>
            {startRevurderingError && (
                <Alert variant={'error'} size={'small'}>
                    {`Kunne ikke opprette omgjøring: ${finnFetchFeilmelding(startRevurderingError)}`}
                </Alert>
            )}
        </>
    );
};
