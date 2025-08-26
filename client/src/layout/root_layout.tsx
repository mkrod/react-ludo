import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { doIhaveActiveLobby, initSession } from '../constant/api'
import type { Lobby, Response, Route } from '../constant/types'
import { MenuData } from '../constant/menuData'
import { useGameProvider } from '../constant/provider'

export interface OutletContextType {
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  activeMenuKey: keyof typeof MenuData;
  setActiveMenuKey: React.Dispatch<React.SetStateAction<keyof typeof MenuData>>;
  showingMenu: keyof typeof MenuData | undefined;
  setShowingMenu: React.Dispatch<React.SetStateAction<keyof typeof MenuData | undefined>>;
  previousMenuKey: keyof typeof MenuData | undefined;
  setPreviousMenukey: React.Dispatch<React.SetStateAction<keyof typeof MenuData | undefined>>;
  joinLobbyscreen: string;
  setJoinLobbyScreen: React.Dispatch<React.SetStateAction<string>>;
  lobbies: Lobby[]; // Assuming lobbies is an array of objects
  setLobbies: React.Dispatch<React.SetStateAction<Lobby[]>>;
}
const RootLayout : React.FC = () : React.JSX.Element => {
   ////////////  route change ////////////
    const defaultRoute: Route = {
      path: "menu",
    }
    const [route, setRoute] = useState<Route>(defaultRoute);
    const { setUserUpdated } = useGameProvider();

  useEffect(() => {
    initSession()
    .then((res:Response) => {
      //console.log(res);
      if(res.message !== "logged_in") setRoute({ path: "auth" });
    })
    .catch(err => {
      setRoute({ path: "auth" });
      console.error("Error starting session: ", err);
    })
    .finally(() => {
      setUserUpdated(true);
    });
  }, []);



  ///menu constants
  const [activeMenuKey, setActiveMenuKey] = useState<keyof typeof MenuData>("main")
  const [previousMenuKey, setPreviousMenukey] = useState<keyof typeof MenuData | undefined>(undefined);
  const [showingMenu, setShowingMenu] = useState<keyof typeof MenuData | undefined>(undefined); //indicates which graphical ui is being shown, not part of menu,  e.g lobby, settings, and other button that !hasSubmenu
//////////////////////////////////////////////////////////////////////////////////////
  const [joinLobbyscreen, setJoinLobbyScreen] = useState<string>("");
  const [lobbies, setLobbies] = useState<Lobby[]>([]); // State to hold the list of lobbies

  /////////////////////////////////////////////////////////////////////////

  useEffect(() => { 
    
    const lobbyCheck = async () => {

    const result = await doIhaveActiveLobby();
    if(result.message !==  "yes") return;
    const data = result.data.existingLobby;
    if(data.state ===  "in_game") return setRoute({ path: "in_game" });
    //console.log("isPlayer", data);

    if(data.isPlayer){ //user created the lobby
      //factor deciding that it will show lobby
      setShowingMenu("host_game");  //first set lobby path

    }else { // there as a guest
      //factor deciding that it will show lobby
      //console.log("A Guest")
      setShowingMenu("random");  //first set lobby path
      setJoinLobbyScreen("in_lobby"); //then set join lobby screen
    }

    return setRoute({ path: "menu" }); //then direct to lobby
  };
  lobbyCheck();
}, []);





  return (
    <div className='root_layout_container'>
        <Outlet context={{ 
          route, setRoute,
          activeMenuKey, setActiveMenuKey,
          showingMenu, setShowingMenu,
          previousMenuKey, setPreviousMenukey,
          joinLobbyscreen, setJoinLobbyScreen,
          lobbies, setLobbies
           }} />
    </div>
  )
}

export default RootLayout;