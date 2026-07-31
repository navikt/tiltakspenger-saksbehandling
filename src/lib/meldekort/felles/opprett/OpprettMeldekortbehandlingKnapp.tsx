import { Button, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSak } from '~/lib/sak/SakContext';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { erSaksbehandler } from '~/lib/saksbehandler/tilganger';
import { finnUbehandledeMeldekort } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { useOpprettMeldekortbehandling } from '~/lib/meldekort/felles/opprett/useOpprettMeldekortbehandling';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { ComponentProps } from 'react';

type Props = {
    size?: ComponentProps<typeof Button>['size'];
};

export const OpprettMeldekortbehandlingKnapp = ({ size }: Props) => {
    const { sakId, saksnummer, åpenMeldekortbehandlingId, meldeperiodeKjeder } = useSak().sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const router = useRouter();

    const {
        opprettMeldekortbehandling,
        opprettMeldekortbehandlingLaster,
        opprettMeldekortbehandlingError,
    } = useOpprettMeldekortbehandling(sakId);

    const ubehandledeMeldekort = finnUbehandledeMeldekort(meldeperiodeKjeder);

    if (
        ubehandledeMeldekort.length === 0 ||
        !!åpenMeldekortbehandlingId ||
        !erSaksbehandler(innloggetSaksbehandler)
    ) {
        return null;
    }

    const antall = ubehandledeMeldekort.length;

    return (
        <VStack gap={'space-8'} align={'start'}>
            <Button
                size={size}
                variant={'primary'}
                icon={opprettMeldekortbehandlingLaster && <Loader />}
                disabled={opprettMeldekortbehandlingLaster}
                onClick={() => {
                    opprettMeldekortbehandling({
                        kjedeIder: ubehandledeMeldekort.map((kjede) => kjede.id),
                    }).then((meldekortbehandling) => {
                        if (meldekortbehandling) {
                            router.push(meldekortbehandlingUrl(saksnummer, meldekortbehandling.id));
                        }
                    });
                }}
            >
                {`Opprett behandling for ${antall} meldekort`}
            </Button>

            {opprettMeldekortbehandlingError && (
                <Infokort variant={'feil'} size={'small'}>
                    {opprettMeldekortbehandlingError.message}
                </Infokort>
            )}
        </VStack>
    );
};
