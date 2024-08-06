import InternDekoratør from '../header/InternDekoratør';

interface HovedLayoutProps extends React.PropsWithChildren {}

export function HovedLayout({ children }: HovedLayoutProps) {
  return (
    <>
      <InternDekoratør />
      <main>{children}</main>
    </>
  );
}
