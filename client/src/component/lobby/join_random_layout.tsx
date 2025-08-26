import React, { } from 'react'
import JoinedRoom from './joinedRoom';
import "./css/joined_random.css";
import { useOutletContext } from 'react-router';
import type { OutletContextType } from '../../layout/root_layout';
import Random from './random';

const JoinRandomLayout:React.FC = ():React.JSX.Element => {
    const { joinLobbyscreen } = useOutletContext<OutletContextType>();



    if(joinLobbyscreen === "in_lobby") {
        return <JoinedRoom />
    }else{
        return <Random />
    }
}

export default JoinRandomLayout