import React, { type CSSProperties } from 'react'
import "./css/house.css";
import type { Pots } from '../constant/types';
import Seed from './seed';
import { computeSeedMove } from '../constant/logic';
import { useGameProvider } from '../constant/provider';

interface Prop {
    color: CSSProperties['backgroundColor'];
    image: string;
    alt: string;
    seeds: () => number;
    pots: Pots[];
    isPlayerTurn: boolean;

}
const House : React.FC<Prop> = ({ image, alt, color, pots, isPlayerTurn })  :React.JSX.Element => {

  const { user, countingNumber } = useGameProvider();

  return (
    <div className='house_container'>
        <img src={image} className='house_image' alt={alt} />


        {pots.map((pot: Pots, index: number) => {
          if(pot.color === color){
            return(
              <div key={index * Date.now()} className='house_seeds_container'>
              {pot.seeds.map((seed, idx) => {
                if(seed.state ===  "home" && pot.color ===  color){
                  return(
                    <Seed 
                     move={() => computeSeedMove({ color, seed_id: seed.id, player_id: user?.player_id || "", count: countingNumber })}
                     key={(index + 1) * (idx + 1)}
                     color={pot.color}
                     name={seed.id}
                     isPlayerTurn={isPlayerTurn}
                    />
                  )
                }else if(seed.state !== "home"){
                  return (
                    <div key={(index + 1) * (idx + 1)} className='house_seed' style={{ backgroundColor: "#dddddd78", cursor: "not-allowed", border: "none" }}>
                  
                    </div>
                  )
                }
              })}
            </div>
            )
          }
        })}
    </div>
  )
}

export default House