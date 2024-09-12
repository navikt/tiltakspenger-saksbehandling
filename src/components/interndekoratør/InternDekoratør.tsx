import React, { useContext } from 'react';
import { BodyShort, Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import { Loader } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../../pages/_app';
import { ExternalLinkIcon, LeaveIcon, MenuGridIcon } from '@navikt/aksel-icons';

const InternDekoratør = () => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  return (
    <InternalHeader>
      <InternalHeader.Title href="/">NAV Tiltakspenger</InternalHeader.Title>
      <Spacer />
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
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
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
  );
};

export default InternDekoratør;
