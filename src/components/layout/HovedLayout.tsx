import useSokOppPerson from '../../hooks/useSokOppPerson';
import InternDekoratør from '../header/InternDekoratør';

interface HovedLayoutProps extends React.PropsWithChildren {}

export function HovedLayout({ children }: HovedLayoutProps) {
  const { trigger, isSokerMutating } = useSokOppPerson();

  return (
    <>
      <InternDekoratør
        isSearchLoading={isSokerMutating}
        onSearch={(searchString) => trigger({ ident: searchString })}
      />
      <main>{children}</main>
    </>
  );
}
