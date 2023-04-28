import dynamic from "next/dynamic";
import { useContext } from "react";
import { Context } from "../Context/AuthContext";
import { useCart } from "../Context/CartLengthContext";
import { useLang } from "../Context/LangContext";
import api from "../services/api";

const LoginMicro = dynamic(() => import("loginPage/login"), {
  ssr: false,
});

export default function Login() {
  const { lang, generalComponentsTranslation, setLang } = useLang();
  const { setCartLength } = useCart();
  const { validaLogin } = useContext(Context);

  const mktName = process.env.NEXT_PUBLIC_REACT_APP_NAME;
  return (
    <>
      <LoginMicro
        mktName={mktName}
        api={api}
        validaLogin={validaLogin}
        generalComponentsTranslation={generalComponentsTranslation}
        lang={lang}
        setLang={setLang}
        setCartLength={setCartLength}
      />
    </>
  );
}
