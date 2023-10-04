// import { create } from "zustand";
// import { IUserState, useDetailsState } from "./userState";

// interface IMultipleAccount {
//   accounts: IUserState[];
//   addAccountFn: () => void;
//   switchAccount: (username: any, token: string) => void;
// }

// const { setAll: updateDetails } = useDetailsState((state) => state);
// const userData = useDetailsState((state) => state);
// export const useMultipleAccounts = create<IMultipleAccount>((set) => ({
//   accounts: [],
//   addAccountFn: () =>
//     set((state) => ({
//       ...state,
//       accounts: [...state.accounts, userData],
//     })),
//   switchAccount: (username, token) =>
//     set((state) => {
//       const accountToUse = state.accounts.filter((account) => {
//         return account.username === username;
//       });
//       const otherAccounts = state.accounts.filter((account) => {
//         return account.username !== username;
//       });

//       updateDetails({
//         ...accountToUse[0],
//         token,
//       });
//       const newAccountsArr = [accountToUse[0], ...otherAccounts];

//       return { ...state, accounts: newAccountsArr };
//     }),
// }));
