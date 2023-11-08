import { Provider } from "react-redux";
import { store } from "../app/store";
import "../styles/globals.css";
// import { Provider as AuthProvider } from 'next-auth/react'
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      ) : (
        "Prerendered"
      )}
    </div>
  );
};

export default MyApp;
