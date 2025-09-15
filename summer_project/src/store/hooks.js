import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const selectAuth = (state) => state.auth;
export const selectBroadcast = (state) => state.broadcast;
export const selectCustomer = (state) => state.customer;
export const selectTemplate = (state) => state.template;
export const selectAdmin = (state) => state.admin;
export const selectUI = (state) => state.ui;
