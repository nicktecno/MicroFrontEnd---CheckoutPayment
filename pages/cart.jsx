import { useLang } from "../Context/LangContext";
import { useCart } from "../Context/CartLengthContext";
import { useLocation } from "../Context/Location";

import api from "../services/api";
import msLocation from "../services/msLocation";

import dynamic from "next/dynamic";

const CartMicro = dynamic(() => import("CartPage/cart"), {
  ssr: false,
});

const Cart = () => {
  const { routeTranslations } = useLang();

  const { setCartLength } = useCart();
  const { AtualizarModalPagina, setAtualizarModalPagina } = useLocation();

  const mktName = process.env.NEXT_PUBLIC_REACT_APP_NAME;
  const appMsLocationUrl = process.env.NEXT_PUBLIC_REACT_APP_MS_LOCATION;

  return (
    <>
      <meta
        name="kdt:page"
        content={`${process.env.NEXT_PUBLIC_REACT_APP_DESCRIPTION} - Carrinho`}
      />
      <title>{`${process.env.NEXT_PUBLIC_REACT_APP_TITLE} - Carrinho`}</title>
      <CartMicro
        mktName={mktName}
        api={api}
        msLocation={msLocation}
        routeTranslations={routeTranslations}
        setCartLength={setCartLength}
        AtualizarModalPagina={AtualizarModalPagina}
        setAtualizarModalPagina={setAtualizarModalPagina}
        appMsLocationUrl={appMsLocationUrl}
      />
    </>
  );
};

export default Cart;
