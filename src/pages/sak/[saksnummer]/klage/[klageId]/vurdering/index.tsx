import { logger } from '@navikt/next-logger';
import { ReactElement, useState } from 'react';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { Klagebehandling, KlageId } from '~/types/Klage';
import { SakProps } from '~/types/Sak';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { KlageSteg } from '~/utils/KlageLayoutUtils';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { useForm } from 'react-hook-form';
import VurderingForm from '~/components/forms/klage-vurdering/VurderingForm';
import {
    klagebehandlingTilVurderingFormData,
    VurderingFormData,
    vurderingFormDataTilVurderKlageRequest,
    vurderingFormValidation,
} from '~/components/forms/klage-vurdering/VurderingFormUtils';
import { BodyShort, Button, Heading, HStack, LocalAlert, VStack } from '@navikt/ds-react';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import {
    useAvbrytKlagebehandling,
    useFerdigstillOmgjortKlage,
    useVurderKlage,
} from '~/api/KlageApi';
import WarningCircleIcon from '~/icons/WarningCircleIcon';
import router from 'next/router';
import { erKlageAvsluttet, finnUrlForKlageSteg, kanBehandleKlage } from '~/utils/klageUtils';
import AvsluttBehandlingModal from '~/components/modaler/AvsluttBehandlingModal';
import styles from './index.module.css';
import Link from 'next/link';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const saksnummer = context.params!.saksnummer as string;
    const klageId = context.params!.klageId as KlageId;

    const sak = await fetchSak(context.req, context.params!.saksnummer as string).catch((e) => {
        logger.error(`Feil under henting av sak med saksnummer ${saksnummer} - ${e.toString()}`);
        throw e;
    });

    const initialKlage = sak.klageBehandlinger.find((klage) => klage.id === klageId);

    if (!initialKlage) {
        logger.error(`Fant ikke klage ${klageId} på sak ${sak.sakId}`);

        return {
            notFound: true,
        };
    }

    return { props: { sak, initialKlage } };
});

const VurderingKlagePage = ({ sak }: Props) => {
    const { klage, setKlage } = useKlage();
    const [vilAvslutteBehandlingModal, setVilAvslutteBehandlingModal] = useState(false);
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>(
        !kanBehandleKlage(klage) ? 'LAGRET' : 'REDIGERER',
    );

    const form = useForm<VurderingFormData>({
        defaultValues: klagebehandlingTilVurderingFormData(),
        resolver: vurderingFormValidation,
    });

    const vurderKlage = useVurderKlage({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (oppdatertKlage) => {
            setKlage(oppdatertKlage);
            setFormTilstand('LAGRET');
        },
    });

    const ferdigstillKlage = useFerdigstillOmgjortKlage({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (oppdatertKlage) => {
            setKlage(oppdatertKlage);
        },
    });

    const avbrytKlageBehandling = useAvbrytKlagebehandling({
        sakId: klage.sakId,
        klageId: klage.id,
        onSuccess: () => {
            router.push(`/sak/${sak.saksnummer}`);
        },
    });

    const onSubmit = (data: VurderingFormData) => {
        vurderKlage.trigger(vurderingFormDataTilVurderKlageRequest(data));
    };

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack gap="8" marginInline="16" marginBlock="8" maxWidth="30rem">
                    <HStack gap="2">
                        {formTilstand === 'LAGRET' ? (
                            <CheckmarkCircleIcon
                                title="Sjekk ikon"
                                fontSize="1.5rem"
                                color="green"
                            />
                        ) : (
                            <WarningCircleIcon />
                        )}
                        <Heading size="small">Vurdering</Heading>
                    </HStack>
                    <VurderingForm control={form.control} readonly={formTilstand === 'LAGRET'} />

                    {vurderKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved oppdatering av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{vurderKlage.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {avbrytKlageBehandling.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved avbrytelse av klagebehandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {avbrytKlageBehandling.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {ferdigstillKlage.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved ferdigstilling av klagebehandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {ferdigstillKlage.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {formTilstand === 'REDIGERER' ? (
                        <Button className={styles.lagreKnapp} loading={vurderKlage.isMutating}>
                            Lagre
                        </Button>
                    ) : (
                        <HStack gap="4">
                            {kanBehandleKlage(klage) && (
                                <>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => {
                                            setVilAvslutteBehandlingModal(true);
                                        }}
                                    >
                                        <HStack>
                                            <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                                            <BodyShort>Avslutt</BodyShort>
                                        </HStack>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => setFormTilstand('REDIGERER')}
                                    >
                                        <HStack>
                                            <PencilIcon title="Rediger ikon" fontSize="1.5rem" />
                                            <BodyShort>Rediger</BodyShort>
                                        </HStack>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            ferdigstillKlage.trigger();
                                        }}
                                    >
                                        Ferdigstill behandling
                                    </Button>
                                </>
                            )}
                        </HStack>
                    )}

                    {ferdigstillKlage.data && (
                        <>
                            <LocalAlert status="warning">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>Omgjøring av vedtak</LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>
                                    Resultatet av klagebehandlingen er at påklaget vedtak skal
                                    omgjøres. En behandling for å fatte nytt vedtak blir ikke
                                    automatisk opprettet. Dette må gjøres manuelt.
                                </LocalAlert.Content>
                            </LocalAlert>

                            <Button
                                className={styles.opprettOmgjøringKnapp}
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    console.log('skal trigge en omgjøringsbehandling');
                                }}
                            >
                                Opprett omgjøringsbehandling
                            </Button>
                        </>
                    )}

                    {erKlageAvsluttet(klage) && (
                        <Button
                            className={styles.fortsettKnapp}
                            as={Link}
                            href={finnUrlForKlageSteg(klage)}
                        >
                            Fortsett
                        </Button>
                    )}
                </VStack>
            </form>
            {vilAvslutteBehandlingModal && (
                <AvsluttBehandlingModal
                    åpen={vilAvslutteBehandlingModal}
                    onClose={() => setVilAvslutteBehandlingModal(false)}
                    tittel={`Avslutt klagebehandling`}
                    tekst={`Er du sikker på at du vil avslutte klagebehandlingen?`}
                    textareaLabel={`Hvorfor avsluttes klagebehandlingen? (obligatorisk)`}
                    onSubmit={(begrunnelse: string) => {
                        avbrytKlageBehandling.trigger({ begrunnelse });
                    }}
                    footer={{
                        isMutating: avbrytKlageBehandling.isMutating,
                    }}
                />
            )}
        </div>
    );
};

VurderingKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage: klage } = page.props as Props;
    return (
        <KlageProvider initialKlage={klage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.VURDERING}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};
export default VurderingKlagePage;
