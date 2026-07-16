import { createContext, useState } from 'react';

export const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('socialUser')) || null);

  const loginUser = (data) => {
    localStorage.setItem('socialUser', JSON.stringify(data));
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.removeItem('socialUser');
    setUser(null);
  };

  return (
    <SocialContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </SocialContext.Provider>
  );
};
