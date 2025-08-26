import React, { useEffect, useState } from 'react'
import "./css/joinedRoom.css";
import { serverRequest } from '../../constant';
import socket from '../../constant/ws_conn';
import { useGameProvider } from '../../constant/provider';
import PlayerLobby from '../player_lobby';
import { useOutletContext } from 'react-router';
import type { OutletContextType } from '../../layout/root_layout';

const JoinedRoom:React.FC = ():React.JSX.Element => {

  const { setCurrentLobby, players, guestText, setGuestText, currentLobby, user } = useGameProvider();
  const { setShowingMenu, setJoinLobbyScreen } = useOutletContext<OutletContextType>();
    const [lobbyReadyState, setLobbyReadyState] = useState<boolean>(true);

  useEffect(() =>  {

    //fetch the lobby where the user is currently in
    //and display the players in that lobby
    //this will be used to display the players in the lobby
    //and the lobby details

    const handleGuestJoinedLobby = async () => {
      console.log("Guest lobby, fetching lobby data...");

        serverRequest("get", "lobby/get_guest_lobby")
        .then((result) => {
          if(result.status === 500) {
            console.error("Error fetching lobby: ", result.message);
            console.log("Guest lobby, fetching lobby data error block...");
            setShowingMenu("random");
            setJoinLobbyScreen("");
            return;
          }

          // Handle the lobby data here
          //console.log("Lobby data: ", result.data);
          setCurrentLobby(result.data);
          setGuestText("Ready to proceed to game...");
          // Emit an event to notify that a guest has joined the lobby
          socket.emit("guest_joined_lobby", { lobby_id: result.data.lobby_id });
        })
        .catch((err) => {
          console.error("Error fetching lobby: ", err);
        });
      }
      handleGuestJoinedLobby();


      socket.on("guest_joined_lobby", handleGuestJoinedLobby);
      socket.on("ready_state_change", handleGuestJoinedLobby);
      
      return () => {
        socket.off("guest_joined_lobby", handleGuestJoinedLobby);
        socket.off("ready_state_change", handleGuestJoinedLobby);
      };

  }, []);


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
        <span className='host_game_text'>{guestText}</span>
      </div>

      
      <div className="host_game_players_container">
        {players.map((player, index) => (
          <div key={index} className='host_game_player_container'>
            <PlayerLobby playerDetails={player} />
            <span className='host_game_text'>{ player.ready_state ? player.ready_state : "lobby" }</span>
          </div>
          ))}
      </div>



              <div className='host_game_quit_container'>

                {<button
                 disabled={players.length !== 2}
                 type='button'
                 data-testid='host_game_quit_button'
                 aria-label='host_game_quit_button'
                 id='host_game_quit_button'
                 aria-disabled={players.length !== 2}
                 tabIndex={players.length !== 2 ? -1 : 0}
                 role='button'
                 className='host_game_quit_button' 
                 onClick={() => {
                  socket.emit("remove_guest", { guest_id: user?.player_id, lobby_id: currentLobby?.lobby_id });
                  setGuestText("You have left the lobby");
                }}>
                  Leave Lobby
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
                    lobby_id: currentLobby?.lobby_id, 
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

export default JoinedRoom