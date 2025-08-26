import React, { type CSSProperties } from 'react';
import "./css/seed.css";


interface Prop {
    color: CSSProperties['backgroundColor'];
    position?: number | "home" | "out";
    parent?:  React.RefObject<HTMLDivElement|null>;
    name?: string;
    absolute?: boolean;
    isPlayerTurn: boolean;
    move: () => void;
}
const Seed : React.FC<Prop> = ({color, name, absolute = false, isPlayerTurn, move}):React.JSX.Element => {


  return (
    <button 
      disabled={!isPlayerTurn}
      onClick={move}
      style={{ 
        backgroundColor: color,
        color: color === "yellow" ? "black" : "white",
        position: absolute ? "absolute" : "unset",
       }}
      className='seed_container'
    >
      {name}
    </button>
  )
}

export default Seed