"use client";

import { createContext, useContext } from "react";

const UserRoleContext = createContext({
  userRole: "admin",
});

export const UserRoleProvider = UserRoleContext.Provider;

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within UserRoleProvider");
  }
  return context;
};
