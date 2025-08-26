import React from 'react'
import type { ComponentDefaultProp } from '../constant/types';
import type { MenuData } from '../constant/menuData';
import HostGame from './lobby/hostGame';
import SearchRoom from './lobby/search_room';
import JoinRandomLayout from './lobby/join_random_layout';

interface Props extends ComponentDefaultProp {
    screen: keyof typeof MenuData;
}
const MenuGui :React.FC<Props> = ({ screen }) :React.JSX.Element => {


    switch(screen){
        case "host_game":
            return <HostGame /> ;
        case "random":
            return <JoinRandomLayout />;      
        case "search_room":
            return <SearchRoom />;      
        default:
            return <></>;
    }
}

export default MenuGui