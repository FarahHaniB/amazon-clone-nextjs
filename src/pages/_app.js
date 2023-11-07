import { Provider } from "react-redux";
import { store } from "../app/store";
import "../styles/globals.css";
// import { Provider as AuthProvider } from 'next-auth/react'
import { SessionProvider } from "next-auth/react";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      {/* <AuthProvider>
    <Provider store={store}> */}
      <Component {...pageProps} />
      {/* </Provider>
    </AuthProvider> */}
    </SessionProvider>
  );
};

export default MyApp;
