import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import defaultLayout from "../jover";
export const ColorThemeContext = createContext();

export const ColorThemeProvider = ({ children }) => {
  const [colorThemes, setColorThemes] = useState(defaultLayout);
  const [selectedMkt, setSelectedMkt] = useState(defaultLayout);
  const getColorThemes = async () => {
    const theme = localStorage?.getItem("theme");
    try {
      const { data: response } = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_MMP_URL}/options`
      );
      setColorThemes(response);

      theme && response[theme]
        ? setSelectedMkt(response[theme])
        : setSelectedMkt(response.defaultLayout);
    } catch (e) {
      console.log(e.message);
    }
  };

  const login = async () => {
    try {
      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_MMP_URL}/register`,
        {
          email: "teste@front.com",
          password: "123456",
        }
      );
      localStorage.setItem("auth", response.accessToken);
    } catch (e) {
      console.log(e.message);
    }

    try {
      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_MMP_URL}/login`,
        {
          email: "teste@front.com",
          password: "123456",
        }
      );
      localStorage.setItem("auth", response.accessToken);
    } catch (e) {
      console.log(e.message);
    }
  };

  const PostColorThemes = async (data) => {
    const auth = localStorage?.getItem("auth");

    try {
      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_MMP_URL}/options`,
        data,
        {
          headers: { Authorization: `Bearer ${auth}` },
        }
      );
    } catch (e) {
      console.log(e.message);
    } finally {
      getColorThemes();
    }
  };

  const chooseMktOption = (mkt) => {
    setSelectedMkt(
      Object.entries(colorThemes)?.filter((option) => option[0] === mkt)[0][1]
    );
    localStorage?.setItem(
      "theme",
      Object.entries(colorThemes)?.filter((option) => option[0] === mkt)[0][0]
    );
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_REACT_APP_MMP_STATE === "true") {
      if (selectedMkt && selectedMkt.length === 0) {
        getColorThemes();
      }
      getColorThemes();
      login();
    }
  }, []);

  return (
    <ColorThemeContext.Provider
      value={{ colorThemes, chooseMktOption, selectedMkt, PostColorThemes }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => useContext(ColorThemeContext);
