import React, { useEffect, useState } from 'react'
import type { Player } from '../constant/types'
import "./css/player_lobby.css";
import { useGameProvider } from '../constant/provider';


interface Props {
    playerDetails: Player;
}
const PlayerLobby :React.FC<Props> = ({ playerDetails }):React.JSX.Element => {

    const { user } = useGameProvider();
    const [isPlayer, setIsPlayer] = useState<boolean>(); 
    useEffect(() => {
        if(!user) return;
        setIsPlayer(user.player_id === playerDetails.id);
    },[user])
  return (
    <div className='player_lobby_container'>
        <div className="player_lobby_avatar_container">
            <img src={playerDetails.avatar ?? "/avatar.png"} className='player_avatar' />
        </div>
        <div className="player_lobby_metadata_container">
            <div className="player_lobby_name_container">
                <h6 className='player_lobby_name'>{!isPlayer ? playerDetails.name : "You"}</h6>
            </div>
        </div>
    </div>
  )
}

export default PlayerLobby