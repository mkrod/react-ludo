import React from 'react'
import { useOutletContext } from 'react-router'
import type { OutletContext } from '../constant/types';
import Auth from './auth';
import Game from './game';
import Menu from './menu';
import NotFound from './not_found';

const Index:React.FC = ():React.JSX.Element => {
    const { route } = useOutletContext<OutletContext>();

    const path = route.path;
    const pathData = route.data;

    switch (path) {
        case "auth" :
            return <Auth routeData={pathData} />
        case "in_game" :
            return <Game routeData={pathData} />
        case "menu" :
            return <Menu routeData={pathData} />
        default:
            return <NotFound />
    }
    
  
}

export default Index