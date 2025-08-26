import React from 'react';
import "./css/outseed.css";
import type { Pots } from '../constant/types';
import Seed from './seed';

interface Prop {
    pots: Pots[];
}

const OutSeed : React.FC<Prop> = ({ pots }):React.JSX.Element => {


  return (
    <div className='out_seed_container'>
        {pots.map((pot, index:number)=>  (

            pot.seeds.map((seed, idx:number)=> {
                return seed.state === "out" ? 
                <Seed
                isPlayerTurn={false}
                key={`${pot.color}${(idx + 1) * (index + 1)}`} //unique
                color={pot.color}
                name={seed.id}
                absolute={false}
                />
                :
                <div key={Date.now() * idx} className='house_seed' style={{ backgroundColor: "#dddddd78", cursor: "not-allowed", border: "none" }}>
                </div>
            })
        ))}
    </div>
  )
}

export default OutSeed