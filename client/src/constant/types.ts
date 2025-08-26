export interface Prompt {
    type: "success" | "warning" | "error";
    message: string;
    body?: string;
    onClose?: (param?: any) => void;
    oncProceed: (param?: any) => void;
}

export interface UserData {
    
}
export interface User {
    player_id: string;
    name: string;
    username: string;
    email: string;
    data: UserData;
}


export interface Pots {
    player_id?: string,
    seeds: Seed[],
    label?: string,
    color?: string;
    state: number | "home";
    step: number,
    path: number[],
    safeZone: number[];
}

export type Seed = {
    id: string;
    state: number | "home" | "out";
};

export interface InGameState {
    color: string;
    seeds: Seed[];
}

export type DiceType = {  id: string, number: number };

export type PlayerData = {
    score: number;
    turn: boolean;
    dice: DiceType[];
};

export interface Player  {
    name: string,
    id: string,
    ready_state?: string;
    avatar?: string;
    data: PlayerData[],
    in_game_state: InGameState[];
}



export interface Road {
    
}

export type GameMode = "arcade" | "local" | "online";

export interface Response {
    status: number;
    message: string;
    data?: any;
}

export interface RouteData {

}

type RouteUrl = "auth" | "menu" | "in_game"; 
export interface Route {
    path: RouteUrl;
    data?: RouteData;
}

export interface OutletContext {
    route: Route;
    data:  RouteData;
}

export interface ComponentDefaultProp {
    routeData?: RouteData;
}

export type MenuDataType = {
    label: string;
    isSubmenu?: boolean;
    hasSubmenu?: boolean;
};

export interface  Lobby {
    lobby_id: string;
    created_by: Player;
    created_at: string;
    guest: string;
    players: Player[];
    state: "in_game" | "matchmaking"  | "ended" ; // "matchmaking" | "in_game" | "ended"
    last_played?: string;
}