import { Button, HStack, Loader } from '@navikt/ds-react';
import router from 'next/router';
import { useContext } from 'react';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { SakContext } from '../../layout/SakLayout';
import { MeldekortDagDTO } from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { SubmitHandler, useForm } from 'react-hook-form';
import Meldekortuke from './Meldekortuke';

export interface Meldekortform {
  meldekortdager: MeldekortDagDTO[];
}

const Meldekort = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId, sakId);
  const { sendMeldekortTilBeslutter, senderMeldekortTilBeslutter } =
    useSendMeldekortTilBeslutter(meldekortId, sakId);

  const meldekortdager = meldekort.meldekortDager.map((dag) => ({
    dato: dag.dato,
    status: dag.status,
  }));

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Meldekortform>({
    mode: 'onSubmit',
    defaultValues: { meldekortdager: meldekortdager },
  });

  if (isLoading && !meldekort) {
    return <Loader />;
  }

  const onSubmit: SubmitHandler<Meldekortform> = (data) => {
    sendMeldekortTilBeslutter({ dager: data.meldekortdager });
  };

  const uke1 = meldekort.meldekortDager.slice(0, 7);
  const uke2 = meldekort.meldekortDager.slice(7, 14);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HStack>
        <Meldekortuke meldekortdager={uke1} control={control} />
        <Meldekortuke meldekortdager={uke2} control={control} />
      </HStack>
      <Button
        size="small"
        loading={senderMeldekortTilBeslutter}
        type="submit"
        value="submit"
      >
        Send til beslutter
      </Button>
    </form>
  );
};

export default Meldekort;
