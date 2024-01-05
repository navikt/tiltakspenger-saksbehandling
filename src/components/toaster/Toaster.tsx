import { Alert } from '@navikt/ds-react';
import { Toaster, ToastBar } from 'react-hot-toast';

const CustomToaster = () => (
  <Toaster
    toastOptions={{
      position: 'top-right',
      style: {
        padding: 0,
      },
    }}
    containerStyle={{ top: '2rem', right: '2rem' }}
  >
    {(t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => {
          if (t.type === 'blank') {
            return <Alert variant="info">{message}</Alert>;
          } else if (t.type === 'error') {
            return <Alert variant="error">{message}</Alert>;
          }
          return <></>;
        }}
      </ToastBar>
    )}
  </Toaster>
);

export default CustomToaster;
