import { serverRequest } from "."
import type { Response } from "./types";

export const initSession = async ():Promise<Response> => {
    const response = await serverRequest("get", "session/init");
    return response
}

/*export const checkSession = async ():Promise<Response>  => {
    const response : Response = await serverRequest("get", "session/get");
    return response;
}*/

export const getUserDetails = async ():Promise<Response> => {
    const response : Response  = await serverRequest("get", "user/get");
    return response; 
}

export const doIhaveActiveLobby = async ():Promise<Response> => {
    const response : Response = await serverRequest("get", "user/lobby/get");
    return response;
}

export const removeGuestFromLobby = async ({ guest_id }:{ guest_id: string }):Promise<Response> => {
    return await serverRequest("post", "lobby/remove/guest", { guest_id }, "json") as Response;
}


export const getLobbyData = async ():Promise<Response> => {
    const result = await serverRequest("get", "user/lobby/live");
    return result;
}