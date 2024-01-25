import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../header/PersonaliaHeader';
import { SaksbehandlingTabs } from '../saksbehandling-tabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';

export const SaksbehandlingLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  console.log('ValgtBehandling:', valgtBehandling);
  return (
    <>
      <PersonaliaHeader
        personopplysninger={valgtBehandling.personopplysninger}
      />
      <SaksbehandlingTabs
        behandlingId={valgtBehandling.behandlingId}
        meldekortId={'a6a0712b-aeea-419f-aec9-26b5f239a717'}
      />
      {children}
    </>
  );
};
