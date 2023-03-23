import { useRouter } from 'next/router';
import Header from '../../components/header/Header';
import { Saksbehandler } from '../../types/Saksbehandler';
import { SøkerResponse } from '../../types/Søker';
import { fetcher, FetcherError, fetchSøker } from '../../utils/http';
import useSWRMutation from 'swr/mutation';
import styles from './PageLayout.module.css';
import Loaders from '../../components/loaders/Loaders';
import { toast } from 'react-hot-toast';
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
