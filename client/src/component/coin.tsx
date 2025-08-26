import React from 'react'
import "./css/coin.css"


interface Props {
    size: number;
}
const Coin:React.FC<Props> = ({ size }):React.JSX.Element => {


  return (
    <img 
    style={{width: `${size}px`, height: `${size}px`}}
    src='/coin.png' 
    className='coin_image' 
    />
  )
}

export default Coin