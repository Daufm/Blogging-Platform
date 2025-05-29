import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useMemo, useState, createContext, useContext } from "react";

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export default function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        });
      },
      mode,
      setMode: (newMode) => {
        localStorage.setItem("theme", newMode);
        setMode(newMode);
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#18191A",
                  paper: "#232526",
                },
              }
            : {}),
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}