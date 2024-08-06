import React, { FormEvent, useContext } from 'react';
import { InternalHeader, Spacer } from '@navikt/ds-react';
import { Loader } from '@navikt/ds-react';
import { SaksbehandlerContext } from '../../pages/_app';
import useSokOppPerson from '../../hooks/useSokOppPerson';

const InternDekoratør = () => {
  const { trigger, isSokerMutating } = useSokOppPerson();
  const [search, setSearch] = React.useState('');
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  async function searchHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <InternalHeader>
      <InternalHeader.Title href="/">NAV Tiltakspenger</InternalHeader.Title>
      {/*
      <form onSubmit={searchHandler}>
        <Search
          data-testid="nav-search-input"
          label={''}
          placeholder="Søk på fnr"
          onChange={(value) => {
            const searchTerm = value.trim();
            setSearch(searchTerm);
            if (!searchTerm) {
              router.push('/');
            }
          }}
          value={search}
          autoComplete="off"
        >
          <Search.Button loading={isSearchLoading} />
        </Search>
      </form>
      */}
      <Spacer />
      {innloggetSaksbehandler ? (
        <InternalHeader.User name={innloggetSaksbehandler.navIdent} />
      ) : (
        <Loader />
      )}
    </InternalHeader>
  );
};

export default InternDekoratør;
