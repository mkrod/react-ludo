import React from 'react';
import "./css/menu_header.css"
import Coin from './coin';
import Diamond from './diamond';
import { useGameProvider } from '../constant/provider';

const MenuHeader:React.FC = ():React.JSX.Element => {

    const xpPercent = 87
    const { user } = useGameProvider()


  return (
    <div className='menu_header_container'>
        <div className="menu_header_player_level_container">
            <div className="menu_header_player_level">{ Math.round(xpPercent / 34) }</div>
            <div className='menu_header_player_level_name_container'>
                <span className='menu_header_player_name'>{user?.name}</span>
                <div className='menu_header_player_level_bar_container'>
                    <div className='menu_header_player_level_bar' style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>
        </div>


        <div className='menu_header_coin_container'>
            <Coin size={30} />
            <div className='menu_header_coin_amount'>8,467,675</div>
        </div>


        <div className='menu_header_diamond_coin_container'>
            <Diamond size={30} />
            <div className='menu_header_diamond_coin_amount'>
                <span>80</span>
                <div onClick={() => alert("")} className='menu_header_diamond_coin_add'>
                    +
                </div>
            </div>
        </div>




    </div>
  )
}

export default MenuHeader