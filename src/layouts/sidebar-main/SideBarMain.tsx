import styles from './SideBarMain.module.css';

const SideBarMain = (props: { sidebar: React.ReactNode; main: React.ReactNode }) => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>{props.sidebar}</div>
            <div className={styles.main}>{props.main}</div>
        </div>
    );
};

export default SideBarMain;
