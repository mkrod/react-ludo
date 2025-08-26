import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { GameMode, Lobby, Player, Pots, Prompt, Response, User } from './types';
import { getUserDetails } from './api';
import socket from './ws_conn'; // ✅ import the connection
import type { Socket } from 'socket.io-client';
import { defaultPotState } from './logic';
import { serverRequest } from '.';


interface GameContextType {
    pots: Pots[];
    setPots: Dispatch<SetStateAction<Pots[]>>;
    players: Player[];
    setPlayers:  Dispatch<SetStateAction<Player[]>>;
    gameMode: GameMode | undefined;
    setGameMode: Dispatch<SetStateAction<GameMode | undefined>>;
    user: User | undefined;
    setUserUpdated: Dispatch<SetStateAction<boolean>>; 
    prompt: Prompt | undefined;
    setPrompt: Dispatch<SetStateAction<Prompt | undefined>>;
    socket: Socket;
    lobbyText: string;
    setLobbyText: Dispatch<SetStateAction<string>>;
    guestText: string;
    setGuestText: Dispatch<SetStateAction<string>>;
    currentLobbyId: string | null;
    setCurrentLobbyId: Dispatch<SetStateAction<string | null>>
    currentLobby: Lobby | undefined;
    setCurrentLobby: Dispatch<SetStateAction<Lobby | undefined>>;
    countingNumber: number;
    setCountingNumber: Dispatch<SetStateAction<number>>;

}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider : React.FC<{ children: React.ReactNode }> = ({children}): React.JSX.Element => {
        // ✅ WebSocket setup
        useEffect(() => {
            // When connected
            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });

            // Cleanup listeners on unmount
            return () => {
                socket.off("connect");
                socket.off("welcome");
                socket.off("move");
            };
        }, []);
    


    const [pots, setPots] = useState<Pots[] >(defaultPotState);


    const [currentLobby, setCurrentLobby] = useState<Lobby | undefined>(undefined);
    useEffect(() => {
        serverRequest("get", "lobby/get_host_lobby")
        .then((result) => {
        if(result.status === 500) {
            console.log(result.message);
            return;
        }

        // Handle the lobby data here
        //console.log("Lobby data: ", result.data);
        setCurrentLobby(result.data);
        result.data.players.length > 1 ? setLobbyText("Ready to proceed to game...") : setLobbyText("Waiting for an opponent...");
        setCurrentLobbyId(result.data.lobby_id);

        //setReadyStateChange(false);
        // Emit an event to notify that a guest has joined the lobby! nt necessary because guest already know and he told the host
        //socket.emit("guest_joined_lobby", { lobby_id: result.data.lobby_id });
        })
        .catch((err) => {
        console.log("Error fetching lobby: ", err);
        });
    }, []);
    useEffect(() => {
        serverRequest("get", "lobby/get_guest_lobby")
        .then((result) => {
        if(result.status === 500) {
            console.log(result.message);
            return;
        }

        // Handle the lobby data here
        //console.log("Lobby data: ", result.data);
        setCurrentLobby(result.data);
        result.data.players.length > 1 ? setLobbyText("Ready to proceed to game...") : setLobbyText("Waiting for an opponent...");
        setCurrentLobbyId(result.data.lobby_id);

        //setReadyStateChange(false);
        // Emit an event to notify that a guest has joined the lobby! nt necessary because guest already know and he told the host
        //socket.emit("guest_joined_lobby", { lobby_id: result.data.lobby_id });
        })
        .catch((err) => {
        console.log("Error fetching lobby: ", err);
        });
    }, []);

    const [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        if(!currentLobby) return;
        setPlayers(currentLobby.players)
    }, [currentLobby]);
    const [prompt, setPrompt] = useState<Prompt | undefined>(undefined)
    const [user, setUser] = useState<User | undefined>(undefined);
    const [userUpdated, setUserUpdated] = useState<boolean>(true);
    useEffect(() => {
        if(!userUpdated) return;
        getUserDetails()
        .then((res: Response) => {
            if(res.message !== "success") return setUser(undefined);
            setUser(res.data);
        })
        .catch((err) => {
            console.log("Error getting user: ", err);

        })
        .finally(() => {
            setUserUpdated(false);
        })

    }, [userUpdated]);

    const [gameMode, setGameMode] = useState<GameMode | undefined>(undefined);
    const [lobbyText, setLobbyText] = useState<string>("Establishing a connection...");
    const [guestText, setGuestText] = useState<string>("");
    const [currentLobbyId, setCurrentLobbyId] = useState<string | null>(null);

    const [countingNumber, setCountingNumber] = useState<number>(0);



  return (
    <GameContext.Provider
    value={{
        prompt, setPrompt,
        pots, setPots,
        players, setPlayers,
        gameMode, setGameMode,
        user,
        setUserUpdated,
        socket,
        lobbyText,
        guestText, setGuestText,
        setLobbyText,
        currentLobbyId, setCurrentLobbyId,
        currentLobby, setCurrentLobby,
        countingNumber, setCountingNumber
    }}>
     {children}
    </GameContext.Provider>
  )
}

export const useGameProvider = () => {
    const context = useContext(GameContext);
    if(!context) throw new Error("Provider Hook must be used within Game provider");
    return context;
}