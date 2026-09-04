import { useEffect, useState } from 'react';
import { HStack, InternalHeader, Search, Spacer } from '@navikt/ds-react';
import { useHentSakForFNR } from './useHentSakForFNR';
import { LukkbartVarsel } from '~/lib/_felles/varsel/LukkbartVarsel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { OpprettSak } from '~/lib/interndekoratør/opprett-sak/OpprettSak';
import { InnloggetSaksbehandlerStatus } from '~/lib/interndekoratør/innlogget-status/InnloggetSaksbehandlerStatus';
import { personoversiktUrl } from '~/utils/urls';
import { v4 as uuidv4 } from 'uuid';

import styles from './InternDekoratør.module.css';

export const InternDekoratør = () => {
    const { søk, error, reset } = useHentSakForFNR();
    const [søketekst, setSøketekst] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        const resetSøkState = () => {
            reset();
            setSøketekst('');
        };

        router.events.on('routeChangeStart', resetSøkState);

        return () => {
            router.events.off('routeChangeStart', resetSøkState);
        };
    }, [router, reset]);

    return (
        <>
            <InternalHeader>
                <InternalHeader.Title as={Link} href="/">
                    Tiltakspenger
                </InternalHeader.Title>
                <HStack gap="space-32" align="center">
                    <form
                        role="search"
                        style={{
                            alignContent: 'center',
                            marginLeft: '20px',
                            minWidth: '17rem',
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            søk({ fnr: søketekst }).then((sak) => {
                                if (sak) {
                                    router.push(personoversiktUrl(sak.saksnummer));
                                }
                            });
                        }}
                    >
                        <Search
                            label="InternalHeader søk"
                            size="small"
                            variant="secondary"
                            placeholder="Søk på fnr eller saksnummer"
                            value={søketekst}
                            onChange={(e) => setSøketekst(e.trim())}
                        >
                            <Search.Button className={styles.søkKnapp} />
                        </Search>
                    </form>
                </HStack>
                <Spacer />
                <HStack gap="space-16">
                    <OpprettSak />
                    <InnloggetSaksbehandlerStatus />
                </HStack>
            </InternalHeader>
            {error && (
                <LukkbartVarsel
                    melding={error.message ?? `Noe gikk galt ved henting av sak for "${søketekst}"`}
                    variant={'feil'}
                    key={`error-${uuidv4()}`}
                    className={styles.søkAlert}
                />
            )}
        </>
    );
};
