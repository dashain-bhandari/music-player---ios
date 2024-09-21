import React, { createContext, ReactNode, useMemo, useState } from "react";

type SwipeContextProps = {
  openedItemKey: string;
  setOpenedItemKey: (key: string) => void;
};

type SwipeProviderProps = {
  children: ReactNode;
  initialOpenedItemKey: string;
};

const swipeContextValues: SwipeContextProps = {
  openedItemKey: "",
  setOpenedItemKey: () => {},
};

export const SwipeContext = createContext<SwipeContextProps>(
  swipeContextValues,
);

export function SwipeProvider({
  initialOpenedItemKey = "",
  children,
}: SwipeProviderProps) {
  const [openedItemKey, setOpenedItemKey] = useState(initialOpenedItemKey);

  const value = useMemo(() => {
    return {
      openedItemKey,
      setOpenedItemKey,
    };
  }, [openedItemKey]);

  return (
    <SwipeContext.Provider value={value}>{children}</SwipeContext.Provider>
  );
}

SwipeProvider.Context = SwipeContext;