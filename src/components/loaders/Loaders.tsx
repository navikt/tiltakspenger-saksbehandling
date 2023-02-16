import ContentLoader from 'react-content-loader';

function User() {
    return (
        <div className={`navdsi-header__user`} style={{ marginLeft: 'auto', marginRight: '0' }}>
            <ContentLoader width={80} height={15} speed={1} backgroundColor={'#333'} foregroundColor={'#999'}>
                <rect rx="3" ry="3" width="80" height="15" />
            </ContentLoader>
        </div>
    );
}

const Loaders = {
    User,
};

export default Loaders;
