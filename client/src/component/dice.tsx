import React, { useEffect, useState } from 'react';
import "./css/dice.css";

interface Props {
    number: number;
    click?: () => void;
    isPlayerTurn: boolean;
    rolling: boolean;
}
interface CurrentNumberType{
    number: number;
    word: string;
}

const Dice : React.FC<Props> = ({ number, click, isPlayerTurn, rolling }) => {
    const diceFace : CurrentNumberType[] = [
        {
            number: 1,
            word: "one",
        },
        {
            number: 2,
            word: "two",
        },
        {
            number: 3,
            word: "three",
        },
        {
            number: 4,
            word: "four",
        },
        {
            number: 5,
            word: "five",
        },
        {
            number: 6,
            word: "six",
        },
    ];
    const [currentNumber, setCurrentNumber] = useState<CurrentNumberType | undefined>(diceFace[0]);
    useEffect(() => {

        const current = diceFace.find((df) => df.number === number);
        if(!current) return;
        setCurrentNumber(current);

    }, [number]);


  return (
    <button
    disabled={!isPlayerTurn}
    onClick={click}
     className={`dice_container ${rolling ? "roll" : ""}`}>
        <div className={`inner_dice_container ${currentNumber?.word}`}>
            {currentNumber
            && Array.from({length: currentNumber.number})
            .map((_, index:number) => {
                return (
                    <div
                    key={index} 
                    className={`dice_dot ${number === 5 && index === 4 ? "fifth_dot" : ""}`} 
                    />
                )
            })}
        </div>
    </button>
  )
}

export default Dice 