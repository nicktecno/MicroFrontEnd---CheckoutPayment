import dynamic from "next/dynamic";

import algoliasearch from "algoliasearch/lite";
import apiUnlogged from "../services/apiUnlogged";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_SEARCH_API_KEY
);

const DEFAULT_PROPS = {
  searchClient,
  indexName: process.env.NEXT_PUBLIC_REACT_APP_ALGOLIA_INDEX_SEARCH,
};

const HomeMicro = dynamic(() => import("homePage/home"), { ssr: false });

export default function Home(props) {
  return (
    <>
      <HomeMicro {...DEFAULT_PROPS} menu={props.menu} banners={props.banners} />
    </>
  );
}

export async function getStaticProps() {
  const { data: response } = await apiUnlogged.get("/descendant-categories");
  const menuFilter = response.data.filter((filtro) => filtro.name !== "Root");

  let banners = false;

  try {
    const { data: response } = await apiUnlogged.get("/banners");
    banners = response;
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      banners,
      menu: menuFilter,
    },
    revalidate: 600,
  };
}
