import { Button, HStack } from '@navikt/ds-react';
import styles from './BehandlingSkjema.module.css';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import {useRouter} from "next/router";

interface behandlingKnapperProps {
    behandlingid: string;
    tilstand: string;
}

export const BehandlingKnapper = ({ behandlingid, tilstand }: behandlingKnapperProps) => {
    const mutator = useSWRConfig().mutate;
    const router = useRouter()

    const håndterRefreshSaksopplysninger = () => {
        const res = fetch(`/api/behandling/oppdater/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                router.push(`/behandling/${behandlingid}`);
                toast('Saksopplysninger er oppdatert');
            });
        });
    };

    const håndterSendTilBeslutter = () => {
        const res = fetch(`/api/behandling/beslutter/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt til beslutter');
            });
        });
    };

    const håndterGodkjenn = () => {
        const res = fetch(`/api/behandling/godkjenn/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling godkjent');
            });
        });
    };

    const håndterSendTilbake = () => {
        const res = fetch(`/api/behandling/sendtilbake/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandling/${behandlingid}`).then(() => {
                toast('Behandling sendt tilbake til saksbehandler');
            });
        });
    };

    const håndterAvbrytBehandling = () => {
        const res = fetch(`/api/behandling/avbrytbehandling/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            router.push('/');
            toast('Behandling avbrutt');
        });
    };

    return (
        <HStack justify="end" gap="3" align="end" className={styles.behandlingSkjema}>
            <>
                {tilstand == 'tilBeslutter' ? (
                    <>
                        <Button
                            type="submit"
                            size="small"
                            variant="secondary"
                            onClick={() => håndterSendTilbake()}
                        >
                            Send tilbake
                        </Button>
                        <Button type="submit" size="small" onClick={() => håndterGodkjenn()}>
                            Godkjenn vedtaket
                        </Button>
                    </>
                ) : (
                    <>
                        <Button type="submit" size="small" onClick={() => håndterAvbrytBehandling()}>
                            Avbryt behandling{' '}
                        </Button>
                        <Button type="submit" size="small" onClick={() => håndterRefreshSaksopplysninger()}>
                            Oppdater saksopplysninger{' '}
                        </Button>
                        <Button type="submit" size="small" onClick={() => håndterSendTilBeslutter()}>
                            Send til beslutter{' '}
                        </Button>
                    </>

                )}
            </>
        </HStack>
    );
};
