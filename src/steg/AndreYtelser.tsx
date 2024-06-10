import { VStack, Loader, HStack, Heading, Link } from '@navikt/ds-react';
import { SaksopplysningTabell } from '../components/saksopplysning-tabell/SaksopplysningTabell';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useHentBehandling } from '../hooks/useHentBehandling';
import { SaksbehandlerContext } from '../pages/_app';
import { avklarLesevisning } from '../utils/avklarLesevisning';
import { UtfallIkon } from '../components/utfall-ikon/UtfallIkon';

export const AndreYtelser = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const andreYtelser = valgtBehandling.saksopplysninger.find(
    (kategori) => kategori.kategoriTittel == 'Utbetalinger',
  );

  const girInnvilget = valgtBehandling.samletUtfall === 'OPPFYLT';

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.tilstand,
    girInnvilget,
  );

  if (!andreYtelser) return <Loader />;
  return (
    <>
      <HStack gap="3" align="center" style={{ marginBottom: '0.5em' }}>
        <UtfallIkon utfall={andreYtelser.samletUtfall} />
        <Heading size="medium" level="3">
          Andre ytelser
        </Heading>
      </HStack>
      <Link
        href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
        target="_blank"
        style={{ marginBottom: '1em' }}
      >
        Tiltakspengeforskriften § 7 Forholdet til andre ytelser
      </Link>
      <SaksopplysningTabell
        saksopplysninger={andreYtelser.saksopplysninger}
        behandlingId={valgtBehandling.behandlingId}
        behandlingsperiode={{
          fom: valgtBehandling.fom,
          tom: valgtBehandling.tom,
        }}
        lesevisning={lesevisning}
      />
    </>
  );
};
