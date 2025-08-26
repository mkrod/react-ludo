import type { CSSProperties } from "react";
import type { Pots } from "./types"
import socket from "./ws_conn";

export const defaultPotState : Pots[] = [
  {
      color: "green",
      seeds: [
          {
              id: "1",
              state: "home",
          },
          {
              id: "2",
              state: "home",
          },
          {
              id: "3",
              state: "home",
          },
          {
              id: "4",
              state: "home",
          },
      ],
      step: 36,//useless
      state: "home",//useless
      path: [
          42, 45, 48, 51, 54,
          72, 71, 70, 69, 68, 67, 
          61, 
          55, 56, 57, 58, 59, 60,
          16, 13, 10, 7, 4, 1,
          2, 
          3, 6, 9, 12, 15, 18,
          36, 35, 34, 33, 32, 31,
          25, 
          19, 20, 21, 22, 23, 24,
          52, 49, 46, 43, 40, 37,
          38, 41, 44, 47, 50, 53,

      ],
      safeZone: [41, 44, 47, 50, 53,],
  },
  {
      color: "yellow",
      seeds: [
          {
              id: "1",
              state: "home",
          },
          {
              id: "2",
              state: "home",
          },
          {
              id: "3",
              state: "home",
          },
          {
              id: "4",
              state: "home",
          },
      ],
      step: 18,//useless
      state: "home",//useless
      path: [
          20, 21, 22, 23, 24,
          52, 49, 46, 43, 40, 37,
          38, 
          39, 42, 45, 48, 51, 54,
          72, 71, 70, 69, 68, 67,
          61,
          55, 56, 57, 58, 59, 60,
          16, 13, 10, 7, 4, 1,
          2, 
          3, 6, 9, 12, 15, 18,
          36, 35, 34, 33, 32, 31,
          25, 26, 27, 28, 29, 30,
      ],
      safeZone: [26, 27, 28, 29, 30]
  },
  {
      color: "blue",
      seeds: [
          {
              id: "1",
              state: "home",
          },
          {
              id: "2",
              state: "home",
          },
          {
              id: "3",
              state: "home",
          },
          {
              id: "4",
              state: "home",
          },
      ],
      step: 54,//useless
      state: "home",//useless
      path: [
          56, 57, 58, 59, 60,
          16, 13, 10, 7, 4, 1,
          2, 
          3, 6, 9, 12, 15, 18,
          36, 35, 34, 33, 32, 31,
          25, 
          19, 20, 21, 22, 23, 24,
          52, 49, 46, 43, 40, 37,
          38, 
          39, 42, 45, 48, 51, 54, 
          72, 71, 70, 69, 68, 67, 
          61, 62, 63, 64, 65, 66,
      ],
      safeZone: [62, 63, 64, 65, 66]
  },
  {
      color: "red",
      seeds: [
          {
              id: "1",
              state: "home",
          },
          {
              id: "2",
              state: "home",
          },
          {
              id: "3",
              state: "home",
          },
          {
              id: "4",
              state: "home",
          },
      ],
      step: 0,//useless
      state: "home",//useless
      path: [
          6, 9, 12, 15, 18,
          36, 35, 34, 33, 32, 31,
          25, 
          19, 20, 21, 22, 23, 24,
          52, 49, 46, 43, 40, 37,
          38, 
          39, 42, 45, 48, 51, 54, 
          72, 71, 70, 69, 68, 67, 
          61,
          55, 56, 57, 58, 59, 60,
          16, 13, 10, 7, 4, 1,
          2, 5, 8, 11, 14, 17,
      ],
      safeZone: [5, 8, 11, 14, 17],
  },
];

  /* default player format
  {
      "name":"Mk Rod",
      "id": "san17k0kp7hj",
      data: [
          {
              score:  2,
          },
      ],
  },
  */
   
  
export class Ludo {

}

export const spinDice = (): {number1:number, number2:number} => {
    //generate two random numbers within 1 - 6
    const number1 = Math.floor(Math.random() * 6) + 1;
    const number2 = Math.floor(Math.random() * 6) + 1;
    return {number1, number2};
}


export const canMove = () => {

}

/*
export const isKilledSeed = ( 
    from: number,
    to: number, 
    pot: Pots, 
    path: number
) => {

  /*first loop through pot and check if an opponent seed,
    is at the end of the player's move which is the path.

    if so, 
    check how many is it
    then return { 
       isKill: boolean //whether it kill 
       length: number // number of seed on the path
    }

}



export const killSeed = (killer: Seed, killee: Seed) => {
    //to be called from ui interactivity
    //set the killer seed state to "out"
    //set the killed seed state back to "home"
}
    
*/

export const computeSeedMove = ({ color, seed_id, player_id, count, current_state }:{ color:CSSProperties["backgroundColor"], seed_id:string, player_id:string, count: number, current_state: number | string }) => {
   //get the new position
   const new_position = "" ; 


    countSeed({ player_id, seed_id, seed_color: color, new_position })
}

type MovePayload = { 
    player_id: string, 
    seed_id: string, 
    seed_color: CSSProperties["backgroundColor"], 
    new_position: number|string;
}

export const countSeed = (payload: MovePayload) => {

        socket.emit("make_move", payload);
    //on the backend, if another seed thats not for the player is on the new position,
    //set that seed position to home, and set the other seed position to out
}