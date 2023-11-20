'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Footer, Navbar } from 'flowbite-react';
import ConnectButton from '@/components/ConnectButton';
import { RecoilRoot } from 'recoil';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`min-h-screen bg-white ${inter.className}`}>
        <RecoilRoot>
          <Navbar fluid>
            <Navbar.Brand>
              <span className='self-center whitespace-nowrap text-xl font-semibold text-black'>
                Urban Crypts
              </span>
            </Navbar.Brand>
            <div className='flex md:order-2'>
              <ConnectButton />
              <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
              <Navbar.Link href='/'>Create new record</Navbar.Link>
              <Navbar.Link href='/records'>All Records</Navbar.Link>
              <Navbar.Link href='/profile'>My Profile</Navbar.Link>
            </Navbar.Collapse>
          </Navbar>

          {children}

          <Footer container>
            <Footer.Copyright href='#' by='UrbanCrypts' year={2023} />
          </Footer>
        </RecoilRoot>
      </body>
    </html>
  );
}
