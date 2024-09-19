import { Button, HStack, Loader, Spacer, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useContext } from 'react';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { SakContext } from '../../layout/SakLayout';
import { MeldekortDagDTO } from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { SubmitHandler, useForm } from 'react-hook-form';
import Meldekortuke from './Meldekortuke';
import Varsel from '../../varsel/Varsel';
import styles from './Meldekort.module.css';
import { ukeHeading } from '../../../utils/date';
import { kanSaksbehandleForBehandling } from '../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../pages/_app';

export interface Meldekortform {
  uke1: MeldekortDagDTO[];
  uke2: MeldekortDagDTO[];
}

const Meldekort = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { meldekort, error, isLoading } = useHentMeldekort(meldekortId, sakId);
  const { sendMeldekortTilBeslutter, senderMeldekortTilBeslutter } =
    useSendMeldekortTilBeslutter(meldekortId, sakId);

  //B: Må endre denne til å ta inn saksbehandler på meldekortet når vi har lagt til tildeling.
  const kanSaksbehandle = kanSaksbehandleForBehandling(
    meldekort.status,
    innloggetSaksbehandler,
    innloggetSaksbehandler.navIdent,
  );

  const meldekortdager = meldekort.meldekortDager.map((dag) => ({
    dato: dag.dato,
    status: dag.status,
  }));

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    watch,
  } = useForm<Meldekortform>({
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

  const onSubmit: SubmitHandler<Meldekortform> = (data) => {
    const utfyltemeldekortdager = data.uke1.concat(data.uke2);
    sendMeldekortTilBeslutter({ dager: utfyltemeldekortdager });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HStack className={styles.meldekort}>
        <Meldekortuke
          watch={watch}
          ukenummer={1}
          meldekortdager={getValues().uke1}
          control={control}
          ukeHeading={ukeHeading(meldekort.periode.fraOgMed)}
        />
        <Spacer />
        <Meldekortuke
          ukenummer={2}
          watch={watch}
          meldekortdager={getValues().uke2}
          control={control}
          ukeHeading={ukeHeading(meldekort.periode.tilOgMed)}
        />
      </HStack>
      {kanSaksbehandle && (
        <Button
          size="small"
          loading={senderMeldekortTilBeslutter}
          type="submit"
          value="submit"
        >
          Send til beslutter
        </Button>
      )}
    </form>
  );
};

export default Meldekort;
