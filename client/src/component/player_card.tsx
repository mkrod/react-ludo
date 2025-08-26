import React, { useEffect, useState } from 'react'
import type { Player } from '../constant/types';
import "./css/player_card.css";
import { useGameProvider } from '../constant/provider';

interface Prop {
    playerIndex: number;
    playerDetails: Player;
}

const PlayerCard : React.FC<Prop> = ({ playerIndex, playerDetails }):React.JSX.Element => {

    const { user } = useGameProvider();
    const [isPlayer, setIsPlayer] = useState<boolean>(); 
    useEffect(() => {
        if(!user) return;
        setIsPlayer(user.player_id === playerDetails.id);
    },[user])

  return (
    <div 
     style={{
        position:  playerIndex !== 0 ? "absolute":"unset",
        top: playerIndex === 1 || playerIndex === 2 ? 0 : "unset",
        left: playerIndex === 1 || playerIndex === 3 ? 0 : "unset",
        right: playerIndex === 2 || playerIndex === 4 ? 0 : "unset",
        bottom: playerIndex === 3 || playerIndex === 4 ? 0 : "unset",
        flexDirection: playerIndex === 1 || playerIndex === 3 ? "row" : "row-reverse"
     }}
    className='player_card_container'
    >
        <div className="player_avatar_container">
            <img src={playerDetails.avatar ?? "/avatar.png"} className='player_avatar' />
        </div>
        <div className="player_metadata_container">
            <div className="player_name_container">
                <h6 className='player_name'>{!isPlayer ? playerDetails.name : "You"}</h6>
            </div>
            <div className="player_score">
                {playerDetails.data[0]?.score ?? 0}
            </div>
            <div className="player_meta_data_others">
                {/* wil be horizontal bar */}
            </div>
        </div>
    </div>
  )
}

export default PlayerCard