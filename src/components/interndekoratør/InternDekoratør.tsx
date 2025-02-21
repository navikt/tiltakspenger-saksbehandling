import React, { useState } from 'react';
import { BodyShort, Dropdown, InternalHeader, Search, Spacer, VStack } from '@navikt/ds-react';
import { Loader } from '@navikt/ds-react';
import { LeaveIcon } from '@navikt/aksel-icons';
import { useHentSakForFNR } from '../../hooks/useHentSakForFNR';
import Varsel from '../varsel/Varsel';
import Link from 'next/link';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';

const InternDekoratør = () => {
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
                        søk({ fnr: søketekst });
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

                {/*
        ** B: Kommentert ut frem til vi har løst forskjellige url-er for prod og dev
        <Dropdown>
          <InternalHeader.Button as={Dropdown.Toggle}>
            <MenuGridIcon
              style={{ fontSize: '1.5rem' }}
              title="Systemer og oppslagsverk"
            />
          </InternalHeader.Button>
          <Dropdown.Menu>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>
                Systemer og oppslagsverk
              </Dropdown.Menu.GroupedList.Heading>
              <Dropdown.Menu.GroupedList.Item
                as="a"
                target="_blank"
                href="https://gosys-q1.dev.intern.nav.no/gosys"
              >
                Gosys <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item
                as="a"
                target="_blank"
                href="https://modiapersonoversikt.intern.dev.nav.no/"
              >
                Modia personoversikt <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item
                as="a"
                target="_blank"
                href="https://arbeid-og-inntekt-q2.dev.adeo.no/"
              >
                AA register <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
              <Dropdown.Menu.GroupedList.Item
                as="a"
                target="_blank"
                href="https://pensjon-psak.nais.preprod.local/psak"
              >
                Pesys <ExternalLinkIcon aria-hidden />
              </Dropdown.Menu.GroupedList.Item>
            </Dropdown.Menu.GroupedList>
          </Dropdown.Menu>
        </Dropdown>
*/}
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
            {error && <Varsel melding={error.message ?? ''} variant="error" marginX />}
        </VStack>
    );
};

export default InternDekoratør;
