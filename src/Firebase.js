import { getAuth } from "firebase/auth";
import config from "./config";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp(config);
export const db = firebase.firestore();
export const auth = getAuth();
export default firebase;
