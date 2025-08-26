import React from 'react'
import "./css/menu_footer.css";
import { useGameProvider } from '../constant/provider';


const MenuFooter:React.FC = ():React.JSX.Element => {

  const { user } = useGameProvider();

  return (
    <div className='menu_footer_container'>
        <div className='menu_footer_player_id'>
            <span className='menu_footer_player_id_text'>Player ID: </span>
            {user && <span className='menu_footer_player_id_text'>{ user.player_id }</span>}
            {!user && <span className='menu_footer_player_id_text'>Not Logged In</span>}
        </div>
        <span className='menu_footer_copyright'>
            &copy; {new Date().getFullYear()} All Right Reserved
        </span>
    </div>
  )
}

export default MenuFooter