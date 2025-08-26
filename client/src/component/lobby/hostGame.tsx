import React, { useEffect, useState } from 'react'
import { useGameProvider } from '../../constant/provider'
import "./css/HostGame.css";
import PlayerLobby from '../player_lobby';
import { IoCopyOutline } from 'react-icons/io5';
import type { MenuData } from '../../constant/menuData';
import { useOutletContext } from 'react-router';
import { serverRequest } from '../../constant';
import { ImExit } from 'react-icons/im';

const HostGame:React.FC = ():React.JSX.Element => {
  const { 
    user, 
    socket, 
    players, 
    setPlayers, 
    lobbyText: text, 
    setLobbyText: setText, 
    currentLobbyId: lobbyId, 
    setCurrentLobbyId: setLobbyId,
    setCurrentLobby
  } = useGameProvider();

  const [lobbyReadyState, setLobbyReadyState] = useState<boolean>(true);
  

  /*const [readyStateChange, setReadyStateChange] = useState<boolean>(true);
  useEffect(() => {
    const handleReadyStateChange = () => {
      console.log("Ready state changed");
      setReadyStateChange(true)
    };

    socket.on("ready_state_change", handleReadyStateChange);
    return () => {
      socket.off("ready_state_change", handleReadyStateChange);
    };
  }, []);*/


  useEffect(() => {
    const lobbyCreatedHandler = (data: any) => {
      //console.log("Lobby created:", data);
      setLobbyId(data.lobbyId);
      // Set the player details in the lobby
      // Assuming data.player_id is the ID of the player who created the lobby
      // and user.username is the name of the player
      // You might want to adjust this based on your actual data structure
      setPlayers([
        { name: user?.username || "", id: data.player_id, data: []}
      ])
      setText("Waiting for an opponent...");
    };

    /////////////////////////////////////////////////////
    const lobbyJoinHandler = (data: any) => {
      //console.log("Lobby joined:", data);
      setPlayers([
        { name: data.username || "", id: data.player_id, data: []}
      ])
      setText("Ready...");
    };

    ///////////////// create the room ////////////
    socket.emit("create_new_lobby");
    socket.on("lobby_created", lobbyCreatedHandler);
    socket.on("lobby_joined", lobbyJoinHandler);
  
    return () => {
      socket.off("lobby_created");
      socket.off("lobby_created", lobbyCreatedHandler);
      socket.off("lobby_joined", lobbyJoinHandler);
    };
    
  }, []);


  //lobby close section
  interface MenuContextType {
    activeMenuKey: keyof typeof MenuData;
    setActiveMenuKey: React.Dispatch<React.SetStateAction<keyof typeof MenuData>>;
    previousMenuKey: keyof typeof MenuData;
    setPreviousMenukey: React.Dispatch<React.SetStateAction<keyof typeof MenuData | undefined>>;
    showingMenu: keyof typeof MenuData;
    setShowingMenu: React.Dispatch<React.SetStateAction<keyof typeof MenuData | undefined>>;
  }

  const { setShowingMenu } = useOutletContext<MenuContextType>();

  useEffect(() => {
    const closedLobbyHandler = () => {
      setShowingMenu(undefined);
      setLobbyId(null);
      setPlayers([]);
    }



    socket.on("lobby_closed", closedLobbyHandler);
    return () => {
      socket.off("lobby_closed", closedLobbyHandler);
    }
  }, []);



/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {

    //if(!readyStateChange) return;
    console.log("Ready state changed, fetching lobby data...");
    const handleGuestJoinedLobby = async () => {
          //fetch the lobby where the user is currently in
          //and display the players in that lobby
          //this will be used to display the players in the lobby
          //and the lobby details
      
          serverRequest("get", "lobby/get_host_lobby")
          .then((result) => {
            if(result.status === 500) {
              console.error("Error fetching lobby: ", result.message);
              return;
            }
      
            // Handle the lobby data here
            //console.log("Lobby data: ", result.data);
            setCurrentLobby(result.data);
            result.data.players.length > 1 ? setText("Ready to proceed to game...") :  setText("Waiting for an opponent...");
            //setReadyStateChange(false);
            // Emit an event to notify that a guest has joined the lobby! nt necessary because guest already know and he told the host
            //socket.emit("guest_joined_lobby", { lobby_id: result.data.lobby_id });
          })
          .catch((err) => {
            console.error("Error fetching lobby: ", err);
          });
    }

    socket.on("guest_joined_lobby", handleGuestJoinedLobby);
    socket.on("ready_state_change", handleGuestJoinedLobby);

    return () => {
      socket.off("guest_joined_lobby", handleGuestJoinedLobby);
      socket.off("ready_state_change", handleGuestJoinedLobby);
    };
  }, []); //refetch the game state when user toogle between readyState, just send the event instead of readyState dependency


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    //after this host have emit to the server that he is ready to start a game, 
    //server will check if the other party is ready 
    // and if so it will emit start_game 
    // so both host and guess will receive it and redirect to game 
    const handleStartGame = () =>{
      alert("Game is starting...");
    }

    socket.on("start_game", handleStartGame);    
    return () => {
      socket.off("start_game", handleStartGame);
    }
  }, []);
  
  

  return (
    <div className='host_game_container'>
      <div className='host_game_text_container'>
        <span className='host_game_text'>{text}</span>
      </div>

      
        <div className="host_game_players_container">
          {players.map((player, index) => (
               <div key={index} className='host_game_player_container'>
                  {index !== 0 && 
                  <span
                  onClick={() => {
                    
                    socket.emit("remove_guest", { guest_id: player.id, lobby_id: lobbyId });
                    
                  }}
                  title='Kick Guest' className='host_game_player_span'>
                    <ImExit className='host_game_player_exit'/>
                  </span>}
                  <PlayerLobby 
                    playerDetails={player}
                  />
                  
                  <span className='host_game_text'>{ player.ready_state ? player.ready_state: "lobby" }</span>
               </div>
            ))}
        </div>


        <div className='host_game_quit_container'>
          <div className='host_game_lobby_id_container'>
            <span className='host_game_lobby_id'>Lobby ID: {lobbyId}</span>
            <IoCopyOutline
            onClick={() => {
              navigator.clipboard.writeText(lobbyId || "");
              alert("Lobby ID copied to clipboard!");
            }}
            aria-label='copy_lobby_id'
            tabIndex={0}
            role='button'
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigator.clipboard.writeText(lobbyId || "");
                alert("Lobby ID copied to clipboard!");
              }
            }}
            size={20}
             className='copy_icon' />
          </div>
          {<button
           disabled={players.length !== 1}
           type='button'
           data-testid='host_game_quit_button'
           aria-label='host_game_quit_button'
           id='host_game_quit_button'
           aria-disabled={players.length !== 1}
           tabIndex={players.length !== 1 ? -1 : 0}
           role='button'
          className='host_game_quit_button' onClick={() => {
            socket.emit("quit_lobby", { lobbyId });
          }}>
            Close Lobby
          </button>}
          {players.length > 1 && <button
           disabled={false} //for now
           type='button'
           data-testid='host_game_start_button'
           aria-label='host_game_start_button'
           id='host_game_start_button'
           aria-disabled={false}// for now
           tabIndex={players.length !== 1 ? -1 : 0}
           role='button'
           className='host_game_start_button'
           onClick={() => {
            socket.emit("start_game", { 
              player_id: user?.player_id, 
              lobby_id: lobbyId, 
              state: lobbyReadyState ? "ready" : "lobby"
            });
            setLobbyReadyState(!lobbyReadyState);
          }}>
            { lobbyReadyState ? "Start Game" : "Cancel" }
          </button>}
        </div>
    </div>
  )
}

export default HostGame