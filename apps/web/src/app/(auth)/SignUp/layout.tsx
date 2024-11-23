'use client';

import SignUpNav from '../../../components/NavigationComponents/SignUpNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-white">
      <SignUpNav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
