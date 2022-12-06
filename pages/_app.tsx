import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { Provider as AuthProvider } from "next-auth/client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
}

export default MyApp;
// const Footer = () => {
//   return (
//     <div className="footerContainer">
//       MSys Blockchain Platform by MSys © 2022. All rights reserved.
//     </div>
//   );
// };
