import { UserInfo } from "@/types/type";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// A context for user data
interface UserContextType {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

// Provider component to set and provide user data
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
