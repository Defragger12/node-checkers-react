import {BASE_URL} from "../constants";
import io from "socket.io-client";

export const socket = io(BASE_URL);