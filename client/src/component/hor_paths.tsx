import React, { type CSSProperties } from 'react'
import "./css/hor_paths.css";
import type { Pots } from '../constant/types';
import Seed from './seed';


interface Prop  {
    color: CSSProperties['backgroundColor'];
    rotate?: boolean;
    startCountFrom: number;
    pots: Pots[];
    isPlayerTurn: boolean;
}
const HorPaths : React.FC<Prop> = ({ color, rotate = false, startCountFrom, pots, isPlayerTurn }):React.JSX.Element => {

    const colorPath = [1, 7, 8, 9, 10, 11];

  return (
    <div style={{ rotate: rotate ? "180deg" : ""}} className='hor_path_container'>

      {Array.from({length: 18}).map((_, index: number) => {

        if(colorPath.includes(index)){
          return (
            <div 
            key={index}
            style={{backgroundColor: color}} 
            className="path"
            data-id={startCountFrom + index + 1}
            >
              {pots.map((pot:Pots, _: number) => (
                pot.seeds.map((seed, _) => {
                  if(seed.state === startCountFrom + index + 1){
                    return (
                      <Seed
                        key={startCountFrom + index + 1}
                        color={pot.color}
                        name={seed.id}
                        absolute={true}
                        isPlayerTurn={isPlayerTurn}
                       />
                    )
                  }
                })
                
               ))}
            </div> 
          )
        }else{
          return (
            <div 
            key={index}
            className="path"
            data-id={startCountFrom + index + 1}
            >
              {pots.map((pot:Pots, _: number) => (
                pot.seeds.map((seed, _) => {

                  //console.log("state:", seed.state, "  ", "cellNumber: ", startCountFrom + index + 1, " for: ", pot.color+" "+seed.id)
                  if(seed.state === startCountFrom + index + 1){
                    return (
                      <Seed
                        key={startCountFrom + index + 1}
                        color={pot.color}
                        name={seed.id}
                        absolute={true}
                        isPlayerTurn={isPlayerTurn}
                       />
                    )
                  }else{
                    
                  }
                })
                
               ))}
            </div> 
          )
        }
      })}
    </div>
  )
}

export default HorPaths