import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./index";

// typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;
