import { BodyLong, Button, Heading, HStack, Loader, Select, VStack } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import React, { useContext, useRef } from 'react';
import styles from './Oppsummering.module.css';
import VilkårsvurderingTable from './VilkårsvurderingTable';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { Behandlingsknapper } from '../behandlingsknapper/BehandlingKnapper';
import BekreftelsesModal from '../bekreftelsesmodal/BekreftelsesModal';
import { useGodkjennBehandling } from '../../hooks/useGodkjennBehandling';
import Endringsmodal from '../endringsmodal/Endringsmodal';
import { Controller, useForm } from 'react-hook-form';
import { Subsumsjon, subsumsjoner } from '../../types/BehandlingTypes';
import { useOppdaterTilleggtekstBrev } from '../../hooks/useOppdaterTilleggtekstBrev';
import { finnSubsumsjonTekst } from '../../utils/tekstformateringUtils';
import { DocPencilIcon } from '@navikt/aksel-icons';

export interface BegrunnelseForm {
    subsumsjon: Subsumsjon;
}

const Oppsummering = () => {
    const { behandlingId, sakId } = useContext(BehandlingContext);
    const { valgtBehandling, isLoading, error } = useHentBehandling(behandlingId);
    const { oppdaterTilleggstekst, oppdaterTilleggstekstError, oppdaterTilleggstekstReset } =
        useOppdaterTilleggtekstBrev(behandlingId);
    const { godkjennBehandling, godkjennerBehandling, godkjennBehandlingError, reset } =
        useGodkjennBehandling(behandlingId, sakId);
    const godkjennRef = useRef(null);
    const begrunnelseRef = useRef(null);

    const subsumsjon = valgtBehandling?.tilleggstekstBrev?.subsumsjon;

    const {
        getValues,
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm<BegrunnelseForm>({
        defaultValues: { subsumsjon },
    });

    const onSubmitSubsumsjon = () => {
        oppdaterTilleggstekst({
            subsumsjon: getValues().subsumsjon,
        }).then(() => {
            lukkBegrunnelseModal();
        });
    };

    if (isLoading || !valgtBehandling) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente oppsummering (${error.status} ${error.info})`}
            />
        );

    const lukkBegrunnelseModal = () => {
        clearErrors();
        begrunnelseRef?.current?.close();
        oppdaterTilleggstekstReset();
    };

    const onGodkjennBehandling = () => {
        godkjennBehandling().then(lukkModal);
    };

    const lukkModal = () => {
        godkjennRef.current.close();
        reset();
    };

    return (
        <VStack gap="6" className={styles.wrapper}>
            <Heading size="medium">Oppsummering</Heading>
            {valgtBehandling.kreverBegrunnelse && !subsumsjon && (
                <Varsel
                    variant={'warning'}
                    heading={'Begrunnelse for endring mangler'}
                    melding={
                        'Du må legge til en begrunnelse dersom du ønsker å gjøre endringer i behandlingen.'
                    }
                />
            )}
            <VStack gap="4" className={styles.vurdering}>
                <Heading size="small">Vilkårsvurdering</Heading>
                <VilkårsvurderingTable />
            </VStack>
            {valgtBehandling.kreverBegrunnelse && (
                <VStack gap="4" className={styles.vurdering}>
                    <Heading size="small">Begrunnelse for endringer</Heading>
                    <BodyLong>
                        {valgtBehandling.tilleggstekstBrev
                            ? `"${valgtBehandling.tilleggstekstBrev.tekst}"`
                            : 'Det er ikke lagt ved tilleggsbegrunnelse for flytting av perioden'}
                    </BodyLong>
                    <HStack>
                        <Button
                            size="small"
                            variant={'secondary'}
                            onClick={() => begrunnelseRef.current.showModal()}
                        >
                            {valgtBehandling.tilleggstekstBrev
                                ? 'Endre begrunnelse'
                                : 'Legg til begrunnelse'}
                        </Button>
                    </HStack>
                </VStack>
            )}
            <Behandlingsknapper godkjennRef={godkjennRef} />
            <Endringsmodal
                modalRef={begrunnelseRef}
                håndterLagring={handleSubmit(onSubmitSubsumsjon)}
                onClose={lukkBegrunnelseModal}
                tittel={'Legg til begrunnelse for endringer'}
                ikon={<DocPencilIcon title="Redigeringsikon" />}
            >
                <VStack gap="4">
                    {oppdaterTilleggstekstError?.message && (
                        <Varsel variant={'error'} melding={oppdaterTilleggstekstError.message} />
                    )}
                    <BodyLong>
                        Legg til begrunnelse for endringene som er gjort i behandlingen. Denne
                        begrunnelsen vil legges til i fritekstfeltet i vedtaksbrevet.
                    </BodyLong>
                    <Controller
                        control={control}
                        name="subsumsjon"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Select
                                label={'Begrunnelse for endringer'}
                                description={'Velg alternativet som passer'}
                                onChange={onChange}
                                value={value}
                                error={errors.subsumsjon && 'Du må velge en begrunnelse'}
                            >
                                <option value={''}>- Velg begrunnelse -</option>
                                {subsumsjoner.map((subsumsjon) => (
                                    <option key={subsumsjon} value={subsumsjon}>
                                        {finnSubsumsjonTekst(subsumsjon)}
                                    </option>
                                ))}
                            </Select>
                        )}
                    />
                </VStack>
            </Endringsmodal>
            <BekreftelsesModal
                modalRef={godkjennRef}
                tittel={'Godkjenn og fatt vedtak'}
                body={'Ønsker du å fatte vedtak på denne behandlingen?'}
                lukkModal={lukkModal}
                error={godkjennBehandlingError}
            >
                <Button
                    type="submit"
                    size="small"
                    loading={godkjennerBehandling}
                    onClick={() => {
                        onGodkjennBehandling();
                    }}
                >
                    Godkjenn vedtaket
                </Button>
            </BekreftelsesModal>
        </VStack>
    );
};

export default Oppsummering;
