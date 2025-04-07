import React, { useState } from 'react';
import { BodyShort, Dropdown, InternalHeader, Search, Spacer, VStack } from '@navikt/ds-react';
import { Loader } from '@navikt/ds-react';
import { LeaveIcon } from '@navikt/aksel-icons';
import { useHentSakForFNR } from './useHentSakForFNR';
import Varsel from '../varsel/Varsel';
import Link from 'next/link';
import { useSaksbehandler } from '../../context/saksbehandler/SaksbehandlerContext';
import router from 'next/router';

export const InternDekoratør = () => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { søk, error } = useHentSakForFNR();
    const [søketekst, settSøketekst] = useState<string>('');

    return (
        <VStack gap="3">
            <InternalHeader>
                <InternalHeader.Title as={Link} href="/">
                    Tiltakspenger
                </InternalHeader.Title>
                <form
                    role="search"
                    style={{ alignContent: 'center', marginLeft: '20px' }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        søk({ fnr: søketekst }).then((sak) => {
                            if (sak) {
                                router.push(`/sak/${sak.saksnummer}`);
                            }
                        });
                    }}
                >
                    <Search
                        label="InternalHeader søk"
                        size="small"
                        variant="simple"
                        placeholder="Søk på fnr"
                        onChange={(e) => settSøketekst(e.trim())}
                    />
                </form>
                <Spacer />
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
            </InternalHeader>
            {error && (
                <Varsel
                    melding={error.message ?? `Noe gikk galt ved henting av sak for "${søketekst}"`}
                    variant="error"
                    marginX
                    key={Date.now()}
                />
            )}
        </VStack>
    );
};
