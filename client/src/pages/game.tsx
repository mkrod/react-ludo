import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./css/game.css";
import House from '../component/house';
import VertPaths from '../component/vert_paths';
import HorPaths from '../component/hor_paths';
import { useGameProvider } from '../constant/provider';
import Dice from '../component/dice';
import OutSeed from '../component/outseed';
import Panel from '../component/panel';
import { defaultPotState, spinDice } from '../constant/logic';
import type { ComponentDefaultProp, DiceType, InGameState, Lobby, Player, Pots } from '../constant/types';
import socket from '../constant/ws_conn';
import { getLobbyData } from '../constant/api';

interface Props extends ComponentDefaultProp {

}

const Game : React.FC<Props> = () : React.JSX.Element => {

    
    const containerRef = useRef<HTMLDivElement|null>(null);
    // Initial state for pots
    const { 
        user, 
        pots, 
        setPots,
        setCurrentLobby,
        currentLobby,
        countingNumber,
        setCountingNumber } = useGameProvider();
    const [dices, setDices] = useState<DiceType[]>([
        {
            id: "1",
            number: 1,
        },
        {
            id: "2",
            number: 1,
        }
    ]);
    //const thisPlayer = players.find((p) => p.id === user?.player_id);
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
    const [canRollDice, setCanRollDice] = useState<boolean>(false);
    const [canCount, setCanCount] = useState<boolean>(false);
    //const [haveCountedSeed, setHaveCountedSeed] = useState<boolean>(true);
    //const [stillPlayerTurn, setStillPlayerTurn] = useState<boolean>(false);
    const [rolling, setRolling] = useState<boolean>(false);


    const rollDice = () => {
        if(!isPlayerTurn) return;
        setRolling(true);
        
        const {number1, number2} = spinDice();

        setTimeout(() => {

            setRolling(false);
            const data = [
                { id: "1", number: number1 },
                { id: "2", number: number2 }
            ];

            socket.emit("update_dice_state", {
                lobby_id: currentLobby?.lobby_id,
                player_id: user?.player_id,
                data,
            });
            setRolling(false);
        }, 400);
        

        // this state will be determined on live data from server
        //setHaveCountedSeed(false);
        //number1  + number2 ===  12 ?  setStillPlayerTurn(true) : setStillPlayerTurn(false);
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////in game-server connection////////////////////////////////////////////////////////////////////////////////////////////////
    
    useEffect(() => {
       // initNewGameData
       //if(user && user.player_id) return;
       const colors = currentLobby?.created_by === user?.player_id ? ["red", "blue"] : ["yellow","green"];

       const newGameData =  {
        colors,
       }
       socket.emit("init_new_game", ({ lobby_id: currentLobby?.lobby_id, player_id: user?.player_id, data: newGameData }));
    }, [user]);


    useEffect(() => {
        const getNewData = async () => {
          const result = await getLobbyData();
          const data: Lobby = result.data;
      
          console.log("Lobby data: ", data);
      
          // determine which player’s turn it is if player didnt last played, its their turn as there is only two players
          const currentPlayer = data.players.find((p) => p.id === user?.player_id);
          console.log("current player: ", currentPlayer);
          //if (currentPlayer) return;
          const lastPlayedId = data.last_played; 
          console.log("lastPlayedId: ", lastPlayedId);
          const myTurn = lastPlayedId !== currentPlayer?.id;
          console.log("myTurn: ", myTurn);
          setIsPlayerTurn(myTurn);

          const playerPlaying = data.players.find((p) => p.id !== data.last_played);
          const dice : DiceType[] = playerPlaying?.data[0].dice||[]; 
          console.log("dice: ", dice);
          if (dice.length === 2){
            setDices(dice);
          }
          if(myTurn){ //means ive either roll dice, but ive not counted or, ive not rolled the dice at all
            if(dice.length === 2){ //means ive roll dice and ive not counted
                setCanRollDice(false); // cant roll again, i have to count
                setCanCount(true); // ability to count
            } else{ //my turn but ive not make move
                setCanRollDice(true); //i can roll dice
                setCanCount(false); //i cant count yet, i have to roll dice so i can count, after rolling the state will change with this structure
            }
          }else{ //its not my turn, im handicapped, cant do anything
            setCanCount(false); //cant count
            setCanRollDice(false); //cant roll dice
           // setHaveCountedSeed(true);  //maybe not useful
          }
      
          // build new pots from players' in_game_state
          const newPots: Pots[] = defaultPotState.map(pot => {
            let modified = { ...pot };
      
            data.players.forEach((pd: Player) => {
              pd.in_game_state.forEach((igs: InGameState) => {
                if (igs.color === pot.color) {
                  modified = {
                    ...modified,
                    player_id: pd.id,
                    seeds: igs.seeds,
                  };
                }
              });
            });
      
            return modified;
          });
      
          setPots(newPots);
          setCurrentLobby(data);
          console.log("new pot after loop: ", newPots);
        };
      
        socket.on("new_move", getNewData);
        return () => {
          socket.off("new_move", getNewData);
        };
      }, [user, pots]); // <- include dependencies
      





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    


    const handleNowCountingNumber = useCallback((number:number) => {
        if(countingNumber !== 0) return; // after counting, set to 0 back.
        setCountingNumber(number);
        //somewhere else, ill make the countable seed undisabled.
    }, []);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









  return (
    <div className='game_container'>
        <div ref={containerRef} className="game_board_container">
            <div className="game_frame_stick_imitator one"></div>
            <div className="game_frame_stick_imitator two"></div>
            <div className="game_frame_stick_imitator three"></div>
            <div className="game_frame_stick_imitator four"></div>

            {pots.map((pot) => {
                if(pot.color === "blue" || pot.color === "yellow") {
                    return (
                        <div key={pot.color} className={`game_board_pot ${pot.color}`}>
                        <div className={`game_board_house ${pot.color}`}>
                            <House
                            image={`/${pot.color}.jpg`}
                            alt={`${pot.color} image`}
                            seeds={() => {
                                const remains = pot.seeds.map((s) => s.state !== "out");
                                return remains.length;
                            }}
                            color={pot.color}
                            pots={pots}
                            isPlayerTurn={isPlayerTurn}
                            />
                        </div>
        
                        
                        <div className={`game_board_path ${pot.color}`}>
                            <HorPaths 
                             color={pot.color}
                             rotate={pot.color === "yellow"}
                             startCountFrom={pot.step}
                             pots={pots}
                             isPlayerTurn={isPlayerTurn}
                             />
                        </div>
        
                      </div>
                    )
                }else{
                    return (
                        <div key={pot.color} className={`game_board_pot ${pot.color}`}>
                        <div className={`game_board_house ${pot.color}`}>
                            <House
                            image={`/${pot.color}.jpg`}
                            alt={`${pot.color} image`}
                            seeds={() => {
                                const remains = pot.seeds.map((s)=>s.state!=="out");
                                return remains.length;
                            }}
                            color={pot.color}
                            pots={pots}
                            isPlayerTurn={isPlayerTurn}
                            />
                        </div>
        
                        
                        <div className={`game_board_path ${pot.color}`}>
                            <VertPaths
                             rotate={pot.color === "green"}
                             color={pot.color}
                             startCountFrom={pot.step}
                             pots={pots}
                             isPlayerTurn={isPlayerTurn}
                             />
                        </div>
        
                      </div>
                    )
                }
            })}
            
            <div className="game_board_center">
                <img src='/center.jpeg' className='game_board_center_image' />
            </div>
            <div className='dices_container'>
                {dices.map((dice) => {

                    return (
                        <Dice
                         click={() => handleNowCountingNumber(dice.number)}
                         key={dice.id}
                         number={dice.number}
                         isPlayerTurn={canCount}
                         rolling={rolling}
                        />
                    )
                })}
            </div>

            {/*pots.map((pot, _: number) => {
                return(
                    pot.seeds.map((seed, _: number)=>(
                        <Seed 
                        key={`${pot.color}${seed.id + 1}`}
                        position={seed.state}
                        color={pot.color}
                        parent={containerRef}
                        name={seed.id}
                        />
                    ))
               )
            })*/}
            
        </div>
        <div className="game_center_space">
            <button 
            onClick={rollDice}
            disabled={!canRollDice}
            className='roll_dice_button'>
                Roll Dice
            </button>
            <div className="out_seed_container">
                <OutSeed
                 pots={pots}
                />
            </div>
        </div>
        <div className="game_panel_container">
            <Panel />
        </div>
    </div>
  )
}

export default Game;