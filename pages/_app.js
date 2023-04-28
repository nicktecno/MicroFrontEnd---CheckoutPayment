import { useEffect } from "react";

import GlobalStyles from "../styles/globals";
import defaultLayout from "../jover";

import { LangProvider } from "../Context/LangContext";
import { AuthProvider } from "../Context/AuthContext";
import { CartLengthProvider } from "../Context/CartLengthContext";
import { ColorThemeProvider } from "../Context/ColorTheme";
import { LocationProvider } from "../Context/Location";
import { MenuProvider } from "../Context/Menu";
import { ApolloProvider } from "@apollo/client";

import { ToastContainer } from "react-toastify";

import { useApollo } from "../services/apolloSsr";

function MyApp({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);

  async function gtmTrigger() {
    try {
      const { data: response } = await apiUnlogged.get("/gtm/tag");

      TagManager.initialize({ gtmId: response.tag });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    gtmTrigger();

    window.__kdt = window.__kdt || [];
    __kdt.push({
      public_key: process.env.NEXT_PUBLIC_REACT_APP_KONDUTO_PUBLIC_KEY,
    });
    __kdt.push({ post_on_load: false });
    (function () {
      var kdt = document.createElement("script");
      kdt.id = "kdtjs";
      kdt.type = "text/javascript";
      kdt.async = true;
      kdt.src = "https://i.k-analytix.com/k.js";

      var s = document.getElementsByTagName("body")[0];
      s.parentNode.insertBefore(kdt, s);
    })();

    const userId = localStorage.getItem(
      process.env.NEXT_PUBLIC_REACT_APP_NAME + "_userId"
    );
    if (userId) {
      var customerID = userId; // define o ID do cliente
      (function () {
        var period = 300;
        var limit = 20 * 1e3;
        var nTry = 0;
        var intervalID = setInterval(function () {
          // loop para retentar o envio
          var clear = limit / period <= ++nTry;
          if (
            typeof Konduto !== "undefined" &&
            typeof Konduto.setCustomerID !== "undefined"
          ) {
            window.Konduto.setCustomerID(customerID); // envia o ID para a Konduto
            clear = true;
          }
          if (clear) {
            clearInterval(intervalID);
          }
        }, period);
      })(customerID);
    } else {
      var visitorID;

      var period = 600;
      var limit = 20 * 1e3;
      var nTry = 0;
      var intervalID = setInterval(function () {
        var clear = limit / period <= ++nTry;
        if (
          typeof Konduto !== "undefined" &&
          typeof Konduto.getVisitorID !== "undefined"
        ) {
          visitorID = Konduto.getVisitorID();

          clear = true;
        }
        if (clear) {
          clearInterval(intervalID);
        }
      }, period);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <LangProvider>
        <CartLengthProvider>
          <AuthProvider>
            <ColorThemeProvider>
              <LocationProvider>
                <MenuProvider>
                  <ToastContainer />
                  <GlobalStyles
                    colors={
                      process.env.NEXT_PUBLIC_REACT_APP_MMP_STATE === "true"
                        ? selectedMkt
                        : defaultLayout
                    }
                  />

                  <Component {...pageProps} />
                </MenuProvider>
              </LocationProvider>
            </ColorThemeProvider>
          </AuthProvider>
        </CartLengthProvider>
      </LangProvider>
    </ApolloProvider>
  );
}

export default MyApp;
