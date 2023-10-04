import { create } from "zustand";
import { IUserState, useDetailsState } from "./userState";
import * as SecureStorage from "expo-secure-store";
import { handlePromise } from "../utils/handlePomise";
import AsyncStorage from "@react-native-async-storage/async-storage";
// const { setAll: updateDetails } = useDetailsState((state) => state);

interface IMultipleAccount {
  accounts: IUserState[];
  initiateAccount: (accounts: IUserState[]) => void;
  addAccountFn: (oldAccount: IUserState, newAccount: IUserState) => void;
  switchAccount: (
    username: any,
    token: string,
    updateFn: (data: Partial<IUserState>) => void
  ) => void;
}

export const useMultipleAccounts = create<IMultipleAccount>((set) => ({
  accounts: [],
  initiateAccount: (accounts: IUserState[]) =>
    set((state) => ({
      ...state,
      accounts: [...accounts],
    })),
  addAccountFn: (oldAccount, newAccount) =>
    set((state) => {
      const oldAccountsWithoutAccountToSwitchFrom = state.accounts.filter(
        (account) => {
          return account.username !== oldAccount.username;
        }
      );
      return {
        ...state,
        accounts: [
          ...oldAccountsWithoutAccountToSwitchFrom,
          oldAccount,
          newAccount,
        ],
      };
    }),
  switchAccount: (username, token, updateFn) =>
    set((state) => {
      const accountToUse = state.accounts.filter((account) => {
        return account.username === username;
      });
      const otherAccounts = state.accounts.filter((account) => {
        return account.username !== username;
      });

      updateFn({
        ...accountToUse[0],
        token,
      });
      const updateStore = async () => {
        const [saveOldUser, saveOldUserErr] = await handlePromise(
          AsyncStorage.setItem(
            `all_users`,
            JSON.stringify([accountToUse[0], ...otherAccounts])
          )
        );
      };
      updateStore();

      const newAccountsArr = [accountToUse[0], ...otherAccounts];

      return { ...state, accounts: newAccountsArr };
    }),
}));
