import { atom } from "recoil";

export const searchValueProvider = atom({
    key: "searchValueState",
    default: "",
});