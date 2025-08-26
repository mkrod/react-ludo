import React, { useEffect , useState} from 'react'
import { useOutletContext } from 'react-router';
import type { OutletContextType } from '../../layout/root_layout';
import { serverRequest } from '../../constant';
import  "./css/random.css";
import PlayerLobby from '../player_lobby';
import { useGameProvider } from '../../constant/provider';

const Random:React.FC = ():React.JSX.Element => {
    const { setJoinLobbyScreen, lobbies, setLobbies, setShowingMenu } = useOutletContext<OutletContextType>();
    const [text, setText] = useState<string>("Searching for room...");
    const { socket }  = useGameProvider();
    const [lobbyChanged, setLobbyChanged] = useState<boolean>(true);

    useEffect(() => {
        socket.on("lobby_changed", () => {
            setLobbyChanged(true);
        });

        return () => {
            socket.off("lobby_changed");
        }
    }, [socket]);


    useEffect(() => {
        if(!lobbyChanged) return;
        setText("Searching for room...");
        serverRequest("get", "lobby/all_rooms")
        .then((res) => {
            if(res.status === 500) return setText(res.message);
            setText("open Rooms: " + res.data.length);
            return setLobbies(res.data);
        })
        .catch((err) => {
             console.error("Error fetching rooms: ", err);
            return setText("Error fetching rooms");
        })
        .finally(() => {
            setLobbyChanged(false);
        })
        
        //unecessary yet! Set the join lobby screen to random when this component mounts
        

    }, [lobbyChanged]);

    ///////////////////next///////////
    const joinRoom = async (lobby_id: string) =>  {
        const res = await serverRequest("post", "lobby/join_random", { lobby_id }, "json");
        if(res.status === 500) return setText(res.message);
        setJoinLobbyScreen("in_lobby");
        //setShowingMenu("in_lobby");
        //setLobbyChanged(true); // Reset the lobby state to fetch new data
        setText("Joined room successfully!");
        socket.emit("joined_lobby", { lobby_id, player_id: res.data.player_id });
    }

  return (
    <div className='joined_random_container'>
        <span className='joined_random_header_text'>{ text }</span>
        {lobbies.length > 0 &&(
            <div className='open_random_rooms_container'>
                {lobbies.map((lobby, index) => (
                    <div 
                    title={lobby.lobby_id}
                        key={index} 
                        onClick={()=> joinRoom(lobby.lobby_id)}
                        className='open_random_room'
                    >
                        <PlayerLobby playerDetails={lobby.created_by} />
                    </div>
                ))}
            </div>
        )}

        <div className='joined_random_footer'>
            <span className='joined_random_footer_text'>If you want to create a room, go back to the main menu and select "Host Game"</span>
            <button 
            onClick={() => {
                setJoinLobbyScreen("");
                setShowingMenu(undefined);
                setLobbyChanged(true); // Reset the lobby state to fetch new data
            }}
            className='joined_random_footer_button host_game_quit_button'>
                Exit
            </button>
        </div>

    </div>
  )
}

export default Random