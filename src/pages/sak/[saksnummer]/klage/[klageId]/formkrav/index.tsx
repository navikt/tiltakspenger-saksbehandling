import { ReactElement, useState } from 'react';

import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BodyShort, Button, Heading, HStack, InfoCard, LocalAlert, VStack } from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { fetchSak } from '~/utils/fetch/fetch-server';
import { logger } from '@navikt/next-logger';
import { SakProps } from '~/lib/sak/SakTyper';
import router from 'next/router';
import FormkravForm from '~/lib/klage/forms/formkrav/FormkravForm';
import {
    FormkravFormData,
    formkravFormDataTilOppdaterKlageFormkravRequest,
    formkravValidation,
    klageTilFormkravFormData,
} from '~/lib/klage/forms/formkrav/FormkravFormUtils';
import { Klagebehandling, KlageId } from '~/lib/klage/typer/Klage';
import KlageLayout, { KlageProvider, useKlage } from '../../layout';
import { finnNesteKlageSteg, KlageSteg } from '~/lib/klage/utils/KlageLayoutUtils';
import { CheckmarkCircleIcon, PencilIcon, TrashIcon } from '@navikt/aksel-icons';
import { useHentPersonopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import {
    harKlageEnÅpenRammebehandling,
    erKlageOmgjøring,
    kanBehandleKlage,
    erKlagebehandlingSattPåVent,
    erKlagebehandlingsOmgjøringsbehandlingUnderAktivOmgjøring,
} from '~/lib/klage/utils/klageUtils';
import { useOppdaterFormkrav } from '~/lib/klage/api/KlageApi';
import { Nullable } from '~/types/UtilTypes';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import styles from './index.module.css';
import { MeldekortVedtak } from '~/lib/meldekort/typer/MeldekortVedtak';
import { MeldekortbehandlingProps } from '~/lib/meldekort/typer/Meldekortbehandling';
import { OppsummeringAvVentestatuser } from '~/lib/behandling-felles/oppsummeringer/ventestatus/OppsummeringAvVentestatuser';
import AvbrytKlagebehandlingModal from '~/lib/klage/modaler/avbryt/AvbrytKlagebehandlingModal';
import { erBehandlingSattPåVent } from '~/lib/behandling-felles/utils/behandlingUtils';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

type Props = {
    sak: SakProps;
    initialKlage: Klagebehandling;
    omgjøringsbehandling: Nullable<Rammebehandling | MeldekortbehandlingPropsV2>;
    rammevedtakOgBehandling: Array<{
        vedtak: Rammevedtak;
        behandling: Rammebehandling;
    }>;
    meldekortvedtakOgBehandling: Array<{
        vedtak: MeldekortVedtak;
        behandling: MeldekortbehandlingProps;
    }>;
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

    const omgjøringsbehandling =
        sak.behandlinger.find((b) => initialKlage.åpenBehandlingId === b.id) ?? null;

    return {
        props: {
            sak,
            initialKlage,
            omgjøringsbehandling,
            rammevedtakOgBehandling: sak.alleRammevedtak
                .map((vedtak) => {
                    const behandling = sak.behandlinger.find(
                        (behandling) => behandling.id === vedtak.behandlingId,
                    );
                    return { vedtak, behandling };
                })
                .filter(({ behandling }) => behandling !== undefined) as Array<{
                vedtak: Rammevedtak;
                behandling: Rammebehandling;
            }>,
            meldekortvedtakOgBehandling: sak.meldekortvedtak
                .map((v) => {
                    const behandling = sak.meldeperiodeKjeder
                        .find((k) => k.id === v.kjedeId)
                        ?.meldekortbehandlinger.find((b) => b.id === v.meldekortId);

                    return { vedtak: v, behandling };
                })
                .filter(({ behandling }) => behandling !== undefined) as Array<{
                vedtak: MeldekortVedtak;
                behandling: MeldekortbehandlingProps;
            }>,
        } satisfies Props,
    };
});

const FormkravKlagePage = ({
    sak,
    omgjøringsbehandling,
    rammevedtakOgBehandling,
    meldekortvedtakOgBehandling,
}: Props) => {
    const { klage, setKlage } = useKlage();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { personopplysninger } = useHentPersonopplysninger(sak.sakId);
    const [vilAvslutteBehandlingModal, setVilAvslutteBehandlingModal] = useState(false);
    const [formTilstand, setFormTilstand] = useState<'REDIGERER' | 'LAGRET'>('LAGRET');

    const erReadonlyForSaksbehandler = innloggetSaksbehandler.navIdent !== klage.saksbehandler;

    const form = useForm<FormkravFormData>({
        defaultValues: klageTilFormkravFormData(
            klage,
            rammevedtakOgBehandling,
            meldekortvedtakOgBehandling,
        ),
        resolver: formkravValidation,
    });

    const oppdaterFormkrav = useOppdaterFormkrav({
        sakId: sak.sakId,
        klageId: klage.id,
        onSuccess: (klage) => {
            setKlage(klage);
            form.reset(
                klageTilFormkravFormData(
                    klage,
                    rammevedtakOgBehandling,
                    meldekortvedtakOgBehandling,
                ),
            );
            setFormTilstand('LAGRET');
        },
    });

    const onSubmit = (data: FormkravFormData) => {
        oppdaterFormkrav.trigger(formkravFormDataTilOppdaterKlageFormkravRequest(data));
    };

    return (
        //vi har formprovider fordi journalpostid komponenten bruker useformcontext. merk at bruken av useformcontext gir oss ikke compile feil dersom endrer på form-interfacet
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack
                    className={styles.formContainer}
                    gap="space-32"
                    marginBlock="space-32"
                    align="start"
                    maxWidth="35rem"
                >
                    <HStack gap="space-8">
                        <CheckmarkCircleIcon title="Sjekk ikon" fontSize="1.5rem" color="green" />
                        <Heading size="small">Formkrav</Heading>
                    </HStack>
                    {erKlageOmgjøring(klage) && harKlageEnÅpenRammebehandling(klage) && (
                        <InfoCard data-color="info" size="small">
                            <InfoCard.Header>
                                <InfoCard.Title>Informasjon om formkrav</InfoCard.Title>
                            </InfoCard.Header>
                            <InfoCard.Content>
                                Det er en åpen rammebehandling knyttet til klagen. Du kan kun gjøre
                                endringer som ikke påvirker resultatet, som å endre begrunnelse,
                                årsak og endre formkravene på en slik måte at de fremdeles er
                                oppfylt.
                            </InfoCard.Content>
                        </InfoCard>
                    )}
                    <FormkravForm
                        readonly={
                            erReadonlyForSaksbehandler ||
                            formTilstand === 'LAGRET' ||
                            erKlagebehandlingsOmgjøringsbehandlingUnderAktivOmgjøring(
                                omgjøringsbehandling,
                            )
                        }
                        fnrFraPersonopplysninger={personopplysninger?.fnr ?? null}
                        control={form.control}
                        rammevedtakOgBehandlinger={
                            sak.alleRammevedtak
                                .map((vedtak) => {
                                    const behandling = sak.behandlinger.find(
                                        (behandling) => behandling.id === vedtak.behandlingId,
                                    );
                                    return { vedtak, behandling };
                                })
                                .filter(({ behandling }) => behandling !== undefined) as Array<{
                                vedtak: Rammevedtak;
                                behandling: Rammebehandling;
                            }>
                        }
                        meldekortvedtakOgBehandlinger={
                            sak.meldekortvedtak
                                .map((v) => {
                                    const behandling = sak.meldeperiodeKjeder
                                        .find((k) => k.id === v.kjedeId)
                                        ?.meldekortbehandlinger.find((b) => b.id === v.meldekortId);

                                    return { vedtak: v, behandling };
                                })
                                .filter(({ behandling }) => behandling !== undefined) as Array<{
                                vedtak: MeldekortVedtak;
                                behandling: MeldekortbehandlingProps;
                            }>
                        }
                    />

                    {oppdaterFormkrav.error && (
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>Feil ved oppdatering av klage</LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                {oppdaterFormkrav.error.message}
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}

                    {formTilstand === 'REDIGERER' ? (
                        <Button loading={oppdaterFormkrav.isMutating}>Lagre</Button>
                    ) : (
                        <HStack gap="space-16">
                            {!erReadonlyForSaksbehandler &&
                                !erKlagebehandlingSattPåVent(klage) &&
                                kanBehandleKlage(klage, omgjøringsbehandling) && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="tertiary"
                                            onClick={() => {
                                                setVilAvslutteBehandlingModal(true);
                                            }}
                                        >
                                            <HStack>
                                                <TrashIcon
                                                    title="Søppelbøtte ikon"
                                                    fontSize="1.5rem"
                                                />
                                                <BodyShort>Avslutt</BodyShort>
                                            </HStack>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="tertiary"
                                            onClick={() => setFormTilstand('REDIGERER')}
                                        >
                                            <HStack>
                                                <PencilIcon
                                                    title="Rediger ikon"
                                                    fontSize="1.5rem"
                                                />
                                                <BodyShort>Rediger</BodyShort>
                                            </HStack>
                                        </Button>
                                    </>
                                )}
                            <Button
                                type="button"
                                onClick={() =>
                                    router.push(finnNesteKlageSteg(klage, KlageSteg.FORMKRAV))
                                }
                            >
                                Fortsett
                            </Button>
                        </HStack>
                    )}

                    {klage.ventestatus.length > 0 && !erBehandlingSattPåVent(klage) && (
                        <OppsummeringAvVentestatuser ventestatuser={klage.ventestatus} />
                    )}
                </VStack>
            </form>
            {vilAvslutteBehandlingModal && (
                <AvbrytKlagebehandlingModal
                    åpen={vilAvslutteBehandlingModal}
                    onClose={() => setVilAvslutteBehandlingModal(false)}
                    sakId={sak.sakId}
                    klageId={klage.id}
                    saksnummer={sak.saksnummer}
                />
            )}
        </FormProvider>
    );
};

FormkravKlagePage.getLayout = function getLayout(page: ReactElement) {
    const { sak, initialKlage } = page.props as Props;

    return (
        <KlageProvider initialKlage={initialKlage}>
            <KlageLayout saksnummer={sak.saksnummer} activeTab={KlageSteg.FORMKRAV}>
                {page}
            </KlageLayout>
        </KlageProvider>
    );
};

export default FormkravKlagePage;
