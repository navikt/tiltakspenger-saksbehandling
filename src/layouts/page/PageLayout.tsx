import Header from '../../containers/header/Header';
import useSokOppPerson from '../../core/useSokOppPerson';

interface PageLayoutProps extends React.PropsWithChildren {}

export function PageLayout({ children }: PageLayoutProps) {
  const { trigger, isSokerMutating } = useSokOppPerson();

  return (
    <>
      <Header
        isSearchLoading={isSokerMutating}
        onSearch={(searchString) => trigger({ ident: searchString })}
      />
      <main>{children}</main>
    </>
  );
}
