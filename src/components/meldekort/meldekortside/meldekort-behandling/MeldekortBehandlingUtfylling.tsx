import { Box, Button, HStack, Loader, Spacer, TextField, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useContext, useRef } from 'react';
import { SakContext } from '../../../layout/SakLayout';
import {
    MeldekortBehandlingProps,
    MeldekortDagDTO,
    MeldekortBehandlingDagStatus,
    MeldeperiodeProps,
    MeldeperiodeKjedeProps,
} from '../../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import Meldekortuke from '../Meldekortuke';
import Varsel from '../../../varsel/Varsel';
import styles from '../Meldekort.module.css';
import { ukeHeading } from '../../../../utils/date';
import { kanSaksbehandleForBehandling } from '../../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../../pages/_app';
import BekreftelsesModal from '../../../bekreftelsesmodal/BekreftelsesModal';
import { gyldigNavkontor, setupValidation } from '../../../../utils/validation';

export interface Meldekortform {
    uke1: MeldekortDagDTO[];
    uke2: MeldekortDagDTO[];
    navkontor: string;
}

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    meldekortBehandling: MeldekortBehandlingProps;
};

export const MeldekortBehandlingUtfylling = ({ meldeperiodeKjede, meldekortBehandling }: Props) => {
    const { sakId } = useContext(SakContext);
    const meldekortId = router.query.meldeperiodeId as string;
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
    const {
        sendMeldekortTilBeslutter,
        senderMeldekortTilBeslutter,
        feilVedSendingTilBeslutter,
        reset,
    } = useSendMeldekortTilBeslutter(meldekortId, sakId);

    const modalRef = useRef(null);

    const lukkModal = () => {
        modalRef.current.close();
        reset();
    };

    //B: Må endre denne til å ta inn saksbehandler på meldekortet når vi har lagt til tildeling.
    const kanSaksbehandle = kanSaksbehandleForBehandling(
        meldekortBehandling.status,
        innloggetSaksbehandler,
        innloggetSaksbehandler.navIdent,
    );

    const meldekortdager = meldekortBehandling.dager.map((dag) => ({
        dato: dag.dato,
        status: dag.status === MeldekortBehandlingDagStatus.IkkeUtfylt ? '' : dag.status,
    }));

    const methods = useForm<Meldekortform>({
        mode: 'onSubmit',
        defaultValues: {
            uke1: meldekortdager.slice(0, 7),
            uke2: meldekortdager.slice(7, 14),
            navkontor: meldekortBehandling.navkontor,
        },
    });

    const onSubmit: SubmitHandler<Meldekortform> = () => {
        modalRef.current?.showModal();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <HStack className={styles.meldekort}>
                    <Meldekortuke
                        ukenummer={1}
                        meldekortdager={methods.getValues().uke1}
                        ukeHeading={ukeHeading(meldeperiodeKjede.periode.fraOgMed)}
                    />
                    <Spacer />
                    <Meldekortuke
                        ukenummer={2}
                        meldekortdager={methods.getValues().uke2}
                        ukeHeading={ukeHeading(meldeperiodeKjede.periode.tilOgMed)}
                    />
                </HStack>
                <Box className={styles.navkontor}>
                    <Controller
                        name="navkontor"
                        control={methods.control}
                        rules={{
                            validate: setupValidation([gyldigNavkontor]),
                        }}
                        render={({ field: { onChange } }) => (
                            <TextField
                                label="Fyll ut navkontor"
                                description="Hvilket navkontor skal utbetale tiltakspenger for bruker på dette meldekortet?"
                                defaultValue={meldekortBehandling.navkontor}
                                onChange={onChange}
                                inputMode="numeric"
                                error={methods.formState.errors.navkontor?.message ?? ''}
                            />
                        )}
                    />
                </Box>
                {kanSaksbehandle && (
                    <>
                        <Button
                            type="submit"
                            value="submit"
                            size="small"
                            style={{ marginTop: '2.5rem' }}
                        >
                            Send til beslutter
                        </Button>
                        <BekreftelsesModal
                            modalRef={modalRef}
                            tittel={'Send meldekort til beslutter'}
                            body={
                                'Er du sikker på at meldekortet er ferdig utfylt og klart til å sendes til beslutter?'
                            }
                            error={feilVedSendingTilBeslutter}
                            lukkModal={lukkModal}
                        >
                            <Button
                                size="small"
                                loading={senderMeldekortTilBeslutter}
                                onClick={() =>
                                    sendMeldekortTilBeslutter({
                                        dager: methods
                                            .getValues()
                                            .uke1.concat(methods.getValues().uke2),
                                        navkontor: methods.getValues().navkontor,
                                    })
                                }
                            >
                                Send til beslutter
                            </Button>
                        </BekreftelsesModal>
                    </>
                )}
            </form>
        </FormProvider>
    );
};
