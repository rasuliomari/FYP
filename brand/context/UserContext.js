import React, { createContext, useState } from 'react';

const UserContext = createContext({
    userInfo: null,
    setUserInfo: () => null,
});

const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };