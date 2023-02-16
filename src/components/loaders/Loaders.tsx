import { Loader } from '@navikt/ds-react';
import ContentLoader from 'react-content-loader';
import styles from './Loaders.module.css';

function User() {
    return (
        <div className={`navdsi-header__user`} style={{ marginLeft: 'auto', marginRight: '0' }}>
            <ContentLoader width={80} height={15} speed={1} backgroundColor={'#333'} foregroundColor={'#999'}>
                <rect rx="3" ry="3" width="80" height="15" />
            </ContentLoader>
        </div>
    );
}

function Page() {
    return (
        <div className={styles.page}>
            <Loader size="3xlarge" title="Laster inn side..." />
        </div>
    );
}

const Loaders = {
    User,
    Page,
};

export default Loaders;
