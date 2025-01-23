import React, { useContext, useRef } from 'react';
import { Button, HStack, Loader, Select, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { finnDeltagelsestatusTekst, lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import { useHentTiltaksdeltagelse } from '../../hooks/vilkår/useHentTiltaksdeltagelse';
import { TypeBehandling } from '../../types/BehandlingTypes';
import Spørsmålsmodal from '../revurderingsmodal/Spørsmålsmodal';
import { periodeTilFormatertDatotekst } from '../../utils/date';
import { Controller, useForm } from 'react-hook-form';
import { setupValidation } from '../../utils/validation';
import { DeltagelseStatus, deltagelsestatuser } from '../../types/TiltakDeltagelseTypes';
import { useOppdaterTiltaksdeltagelse } from '../../hooks/vilkår/useOppdaterTiltaksdeltagelse';

export interface StatusForm {
    status: DeltagelseStatus;
}

const Tiltaksdeltagelse = () => {
    const { behandlingId, behandlingstype, sakId, behandlingsperiode } =
        useContext(BehandlingContext);
    const { tiltaksdeltagelse, isLoading, error } = useHentTiltaksdeltagelse(behandlingId);

    const { oppdaterTiltaksdeltagelse } = useOppdaterTiltaksdeltagelse(behandlingId, sakId);

    const modalRef = useRef(null);

    const {
        getValues,
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<StatusForm>({});

    const onSubmit = () => {
        oppdaterTiltaksdeltagelse({
            statusForPeriode: [
                {
                    periode: behandlingsperiode,
                    status: getValues().status,
                },
            ],
        });
    };

    if (isLoading || !tiltaksdeltagelse) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke introduksjonsprogramvilkår (${error.status} ${error.info})`}
            />
        );

    const { status, tiltakNavn, kilde } = tiltaksdeltagelse.avklartSaksopplysning;

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Tiltaksdeltagelse'}
                lovdatatekst={tiltaksdeltagelse.vilkårLovreferanse.beskrivelse}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§2'}
                paragraf={tiltaksdeltagelse.vilkårLovreferanse.paragraf}
            />

            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={tiltaksdeltagelse.samletUtfall} />}
                text={lagUtfallstekst(tiltaksdeltagelse.samletUtfall)}
            />
            <VilkårKort
                key={tiltakNavn}
                saksopplysningsperiode={tiltaksdeltagelse.utfallperiode}
                kilde={kilde}
                utfall={tiltaksdeltagelse.samletUtfall}
                grunnlag={[
                    { header: 'Type tiltak', data: tiltakNavn },
                    { header: 'Siste status', data: finnDeltagelsestatusTekst(status) },
                ]}
            />
            {behandlingstype == TypeBehandling.REVURDERING && (
                <>
                    <HStack>
                        <Button size="small" onClick={() => modalRef.current.showModal()}>
                            Oppdater status
                        </Button>
                    </HStack>
                    <Spørsmålsmodal
                        modalRef={modalRef}
                        heading={`Oppdater status for perioden ${periodeTilFormatertDatotekst(tiltaksdeltagelse.utfallperiode)}`}
                        submitTekst="Lagre status"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <VStack gap="5" style={{ width: 300, paddingTop: 0 }}>
                            <Controller
                                name="status"
                                control={control}
                                rules={{
                                    validate: setupValidation([]),
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Select label="Status" onChange={onChange} value={value}>
                                        <option value={''}>- Velg status -</option>
                                        {deltagelsestatuser.map((status) => (
                                            <option key={status} value={status}>
                                                {finnDeltagelsestatusTekst(status)}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </VStack>
                    </Spørsmålsmodal>
                </>
            )}
        </VStack>
    );
};

export default Tiltaksdeltagelse;
