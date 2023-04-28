import "react-toastify/dist/ReactToastify.min.css";

import { useLang } from "../../Context/LangContext";

import api from "../../services/api";
import wishListApi from "../../services/msWishList";
import msLocation from "../../services/msLocation";

import { useLocation } from "../../Context/Location";
import { useCart } from "../../Context/CartLengthContext";
import { useMenu } from "../../Context/Menu";

import dynamic from "next/dynamic";
import Head from "next/head";

import { initializeApollo } from "../../services/apolloSsr";
import {
  GET_PRODUCT,
  GET_PRODUCTID,
  GET_PRODUCT_SELLER,
} from "../../services/Querys";

const ProductPageMicro = dynamic(() => import("productPage/productPage"), {
  ssr: false,
});

export default function Product({ data }) {
  const { routeTranslations } = useLang();
  const { localizacao, setModal, localizado } = useLocation();
  const { setCartLength } = useCart();
  const { show, openWishList, setOpenWishList } = useMenu();

  const mktName = process.env.NEXT_PUBLIC_REACT_APP_NAME;
  const imageUrl = process.env.NEXT_PUBLIC_REACT_APP_IMAGES_URL;
  const appTitle = process.env.NEXT_PUBLIC_REACT_APP_TITLE;
  const headerUrl = process.env.NEXT_PUBLIC_REACT_APP_HEADER_URL;
  const appUrl = process.env.NEXT_PUBLIC_REACT_APP_URL;
  const msLocationEnv = process.env.NEXT_PUBLIC_REACT_APP_MS_LOCATION;

  function showValue(produto, atributo) {
    const value = produto?.find((attr) => attr.attribute[0].code === atributo);

    if (value) {
      return value.text_value ? value.text_value : value.value;
    } else {
      return false;
    }
  }

  return (
    <>
      <Head>
        <title>
          {appTitle} - {showValue(data?.product?.attributes, "name")}
        </title>
        <meta
          name="description"
          content={showValue(data?.product?.attributes, "meta_description")}
        />
        <meta
          name="keywords"
          content={showValue(data?.product?.attributes, "meta_keywords")}
        />
      </Head>
      <ProductPageMicro
        mktName={mktName}
        api={api}
        wishListMenuOpened={show}
        openWishList={openWishList}
        setOpenWishList={setOpenWishList}
        location={localizacao}
        setOpenLocationModal={setModal}
        located={localizado}
        wishListApi={wishListApi}
        routeTranslations={routeTranslations}
        setCartLength={setCartLength}
        ssrData={data}
        imageUrl={imageUrl}
        appTitle={appTitle}
        headerUrl={headerUrl}
        appUrl={appUrl}
        msLocation={msLocation}
        msLocationEnv={msLocationEnv}
      />
    </>
  );
}

export async function getServerSideProps({ params, resolvedUrl }) {
  const { slug } = params;

  const apolloClient = initializeApollo();
  let dataProductWithoutId = "";
  let imagens = [];
  let product = {};
  let id = "";

  const filterRoute = resolvedUrl.includes("/sellerproduct")
    ? { seller_id: parseInt(slug[0]), url_key: slug[1] }
    : { url_key: slug[0] };

  const filterQuery = resolvedUrl.includes("/sellerproduct")
    ? GET_PRODUCT_SELLER
    : GET_PRODUCT;

  try {
    const { data: response } = await apolloClient.query({
      query: GET_PRODUCTID,
      variables: filterRoute,
    });
    dataProductWithoutId = response;
    id = parseInt(dataProductWithoutId.children[0].parent[0].product_id);
  } catch (e) {
    console.log(e);
    return { redirect: { destination: "/404", permanent: false } };
  }

  if (id !== undefined) {
    const { data: dataProductWithId } = await apolloClient.query({
      query: filterQuery,
      variables: { ...filterRoute, id },
    });
    product = dataProductWithId.children[0];

    if (dataProductWithId.children[0].images) {
      // eslint-disable-next-line array-callback-return
      dataProductWithId.children[0].images.map((imagem, index) => {
        imagens.push({
          original:
            process.env.NEXT_PUBLIC_REACT_APP_IMAGES_URL + "/" + imagem.path,
          thumbnail:
            process.env.NEXT_PUBLIC_REACT_APP_IMAGES_URL + "/" + imagem.path,
        });
      });
    } else {
      imagens = [];
    }
  }

  return {
    props: {
      data: {
        images: imagens,
        id,
        product,
        resolvedUrl,
      },
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
