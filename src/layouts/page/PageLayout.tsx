import Header from '../../components/header/Header';
import Loaders from '../../components/loaders/Loaders';
import useSaksbehandler from '../../core/useSaksbehandler';
import useSokOppPerson from '../../core/useSokOppPerson';

interface PageLayoutProps extends React.PropsWithChildren {}

export function PageLayout({ children }: PageLayoutProps) {
    const { saksbehandler, isSaksbehandlerLoading } = useSaksbehandler();

    const { trigger, isSokerMutating } = useSokOppPerson();

    if (isSaksbehandlerLoading) {
        return <Loaders.Page />;
    }

    return (
        <>
            <Header
                isSearchLoading={isSokerMutating}
                onSearch={(searchString) => trigger({ ident: searchString })}
                saksbehandler={saksbehandler}
            />
            <main>{children}</main>
        </>
    );
}
