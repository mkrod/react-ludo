import React from 'react';
import { useGameProvider } from '../constant/provider';
import PlayerCard from './player_card';
import type { Player } from '../constant/types';
import "./css/panel.css";

interface Prop {

}

const Panel : React.FC<Prop> = ():React.JSX.Element => {

    const { players } = useGameProvider();

  return (
    <div className='panel_container'>



        {players.map((player:Player, idx:number)=>{
            const index:number = idx + 1;
            return (
                <PlayerCard
                 key={index}
                 playerIndex={index}
                 playerDetails={player}
                />
            )
        })}
    </div>
  )
}

export default Panel