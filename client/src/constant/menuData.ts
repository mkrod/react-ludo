import type { MenuDataType } from "./types";

export const MenuData : Record<string, MenuDataType[]> = {
    main: [
        { label: "ai_match", hasSubmenu: true, isSubmenu: true },
        { label: "online_match", hasSubmenu: true, isSubmenu: true },
        { label: "friend_match", hasSubmenu: true, isSubmenu: true },
        { label: "option", hasSubmenu: true, isSubmenu: true },
        { label: "credit", hasSubmenu: true, isSubmenu: true },
    ],
    ai_match:[
        { label: "start_game", hasSubmenu: false, isSubmenu: true },
    ],
    online_match:[
        { label: "host_game", hasSubmenu: false, isSubmenu: true },
        { label: "join_game", hasSubmenu: true, isSubmenu: true },
    ],
    friend_match: [
        { label: "create_room", hasSubmenu: false, isSubmenu: true },
        { label: "join_room", hasSubmenu: false, isSubmenu: true },
    ],
    option:[],
    credit:[],
    join_game: [
        { label: "search_room", hasSubmenu: false, isSubmenu: true },
        { label: "random", hasSubmenu: false, isSubmenu: true }
    ],

}