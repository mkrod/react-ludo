import React, { useEffect } from 'react'
import "./css/auth.css";
import { FcGoogle } from 'react-icons/fc';
import { FaUser } from 'react-icons/fa';
import MenuFooter from '../component/menu_footer';
import { authClient } from '../constant';
import { useGameProvider } from '../constant/provider';
import { useNavigate } from 'react-router';
import type { ComponentDefaultProp } from '../constant/types';

interface Props extends ComponentDefaultProp {

}
const Auth :React.FC<Props> = ({  }):React.JSX.Element => {
    
    const { user } = useGameProvider();
    const navigate = useNavigate();

    useEffect(() => {
        if(user) navigate("/");
    }, [user]);

  return (
    <div className='menu_container'>
      <div className="menu_background">
      </div>

     <div className='auth_content_container'>
        <div className="auth_items_container">
            <span className='auth_header_text'>Continue With</span>
            <button tabIndex={0} className='auth_link'>
                <div className='auth_link_icon'>
                    <FcGoogle 
                     size={20}
                    />
                </div>
                <span className='auth_link_text'>Google</span>
            </button>
            <button 
            onClick={() => {
                window.open(
                    authClient, //url
                    "MkGameAuth",  //nameOfTab
                    "width=450,height=600,scrollbars=yes,resizable=no"
                )
            }}
            tabIndex={0} className='auth_link'>
                <div className='auth_link_icon'>
                    <FaUser 
                     size={15}
                     color='#242424'
                    />
                </div>
                <span className='auth_link_text'>Mkgameo</span>
            </button>
        </div>

        <MenuFooter />
     </div>

     
    </div>
  )
}

export default Auth