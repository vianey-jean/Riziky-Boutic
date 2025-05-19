
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="container mx-auto px-4 py-6 flex-grow" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
