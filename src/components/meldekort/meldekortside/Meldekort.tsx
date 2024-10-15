import {
  Box,
  Button,
  HStack,
  Loader,
  Spacer,
  TextField,
  VStack,
} from '@navikt/ds-react';
import router from 'next/router';
import { useContext, useRef } from 'react';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { SakContext } from '../../layout/SakLayout';
import {
  MeldekortDagDTO,
  MeldekortdagStatus,
} from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import Meldekortuke from './Meldekortuke';
import Varsel from '../../varsel/Varsel';
import styles from './Meldekort.module.css';
import { ukeHeading } from '../../../utils/date';
import { kanSaksbehandleForBehandling } from '../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../pages/_app';
import BekreftelsesModal from '../../bekreftelsesmodal/BekreftelsesModal';

export interface Meldekortform {
  uke1: MeldekortDagDTO[];
  uke2: MeldekortDagDTO[];
  navkontor: string;
}

const Meldekort = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { meldekort, error, isLoading } = useHentMeldekort(meldekortId, sakId);
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
    meldekort.status,
    innloggetSaksbehandler,
    innloggetSaksbehandler.navIdent,
  );

  const meldekortdager = meldekort.meldekortDager.map((dag) => ({
    dato: dag.dato,
    status: dag.status === MeldekortdagStatus.IkkeUtfylt ? '' : dag.status,
  }));

  const methods = useForm<Meldekortform>({
    mode: 'onSubmit',
    defaultValues: {
      uke1: meldekortdager.slice(0, 7),
      uke2: meldekortdager.slice(7, 14),
    },
  });

  if (isLoading && !meldekort) {
    return <Loader />;
  } else if (error) {
    return (
      <VStack className={styles.wrapper}>
        <Varsel
          variant="error"
          melding={`Kunne ikke hente meldekort (${error.status} ${error.info})`}
        />
      </VStack>
    );
  }

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
            ukeHeading={ukeHeading(meldekort.periode.fraOgMed)}
          />
          <Spacer />
          <Meldekortuke
            ukenummer={2}
            meldekortdager={methods.getValues().uke2}
            ukeHeading={ukeHeading(meldekort.periode.tilOgMed)}
          />
        </HStack>
        <Box className={styles.navkontor}>
          <Controller
            name="navkontor"
            control={methods.control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field: { onChange } }) => (
              <TextField
                label="Fyll ut navkontor"
                description="Hvilket navkontor skal utbetale tiltakspenger for bruker på dette meldekortet?"
                onChange={onChange}
              />
            )}
          />
        </Box>
        {kanSaksbehandle && (
          <>
            <Button type="submit" value="submit" size="small">
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

export default Meldekort;
