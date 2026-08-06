import { useEffect, useState } from 'react';
import {
    BodyShort,
    Dropdown,
    HStack,
    InternalHeader,
    Loader,
    Search,
    Spacer,
} from '@navikt/ds-react';
import { LeaveIcon } from '@navikt/aksel-icons';
import { useHentSakForFNR } from './useHentSakForFNR';
import LukkbartVarsel from '~/lib/_felles/varsel/LukkbartVarsel';
import Link from 'next/link';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import router from 'next/router';
import styles from './InternDekoratør.module.css';
import { OpprettSak } from '~/lib/interndekoratør/opprett-sak/OpprettSak';
import { personoversiktUrl } from '~/utils/urls';
import { v4 as uuidv4 } from 'uuid';

export const InternDekoratør = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { søk, error, reset } = useHentSakForFNR();
    const [søketekst, setSøketekst] = useState<string>('');

    //window eksiterer ikke alltid ved lasting til å kunne brukes som en dependency for useEffect
    const windowPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useEffect(() => {
        reset();
        // TODO Gjorde lintingen strengere ved oppgradering til Next 16. Fikset bare åpenbare feil, denne burde undersøkes.
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setSøketekst('');
    }, [windowPath]);

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
                    {innloggetSaksbehandler ? (
                        <Dropdown>
                            <InternalHeader.UserButton
                                as={Dropdown.Toggle}
                                name={innloggetSaksbehandler.navIdent}
                            />
                            <Dropdown.Menu>
                                <dl>
                                    <BodyShort as="dt" size="small">
                                        {innloggetSaksbehandler.navIdent}
                                    </BodyShort>
                                </dl>
                                <Dropdown.Menu.Divider />
                                <Dropdown.Menu.List>
                                    <Dropdown.Menu.List.Item as="a" href={'/oauth2/logout'}>
                                        Logg ut
                                        <Spacer />
                                        <LeaveIcon aria-hidden fontSize="1.5rem" />
                                    </Dropdown.Menu.List.Item>
                                </Dropdown.Menu.List>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Loader />
                    )}
                </HStack>
            </InternalHeader>
            {error && (
                <LukkbartVarsel
                    melding={error.message ?? `Noe gikk galt ved henting av sak for "${søketekst}"`}
                    variant="feil"
                    marginX
                    key={`error-${uuidv4()}`}
                />
            )}
        </>
    );
};
