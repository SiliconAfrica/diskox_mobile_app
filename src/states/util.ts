import { create } from 'zustand'
import { useState } from 'react';

interface State {
    isLoggedIn: boolean;
    isDarkMode: boolean;
    setAll: (data: Partial<State>) => void;
}

export const useUtilState = create<State>((set) => ({
    isLoggedIn: false,
    isDarkMode: false,
    setAll: (data) => set((state) => ({ ...state, ...data })),
}));

type User = {
    name: string;
    email: string;
    password: string;
}

// function App() {
//     const [user, setUser] = useState<User>({ name: '', email: '', password: '' });

//     const changePassword = (password: string) => {
//         const obj = { ...user, password };
//         setUser((prev) => ({ ...prev, password }));
//     }
//     return {
//         user,
//         changePassword,
//     }
// }