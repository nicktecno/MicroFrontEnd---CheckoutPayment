import "react-toastify/dist/ReactToastify.min.css";

import { useLang } from "../../Context/LangContext";
import { useCart } from "../../Context/CartLengthContext";

import api from "../../services/api";

import CheckoutComponent from "./Checkout";

const Checkout = () => {
  const { routeTranslations } = useLang();

  const { setCartLength } = useCart();

  return (
    <>
      <meta
        name="kdt:page"
        content={`${process.env.NEXT_PUBLIC_REACT_APP_DESCRIPTION} - Pagamento`}
      />
      <title>{`${process.env.NEXT_PUBLIC_REACT_APP_TITLE} - Pagamento`}</title>
      <CheckoutComponent
        api={api}
        routeTranslations={routeTranslations}
        setCartLength={setCartLength}
      />
    </>
  );
};

export default Checkout;
