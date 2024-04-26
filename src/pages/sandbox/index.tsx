import TiltaksdeltagelseDemo from '../../components/tiltaksdeltagelse-demo/TiltaksdeltagelseDemo';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';

const SandboxPage = () => {
  return <TiltaksdeltagelseDemo></TiltaksdeltagelseDemo>;
};

export default SandboxPage;

export const getServerSideProps = pageWithAuthentication();
