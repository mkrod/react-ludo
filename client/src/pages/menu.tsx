import React, {  } from 'react';
import "./css/menu.css"; 
import MenuFooter from '../component/menu_footer';
import { MenuData } from '../constant/menuData';
import type { ComponentDefaultProp, MenuDataType } from '../constant/types';
import MenuGui from '../component/menu_gui';
import MenuHeader from '../component/menu_header';
import { useOutletContext } from 'react-router';
import type { OutletContextType } from '../layout/root_layout';

interface Props extends ComponentDefaultProp {

}
const Menu : React.FC<Props> = ({  }) : React.JSX.Element => {

  const { 
    activeMenuKey, 
    setActiveMenuKey,
    previousMenuKey,
    setPreviousMenukey,
    showingMenu,
    setShowingMenu
  
  } = useOutletContext<OutletContextType>();

  const activeMenu : MenuDataType[] = MenuData[activeMenuKey];



  return (
    <div className='menu_container'>
      <div className="menu_background">
      </div>
      <MenuHeader />

      {!showingMenu && <div className="menu_content_container">
        
        <div className="menu_items_container">
          {activeMenu.map((menu, index) => {
            return (
              <button 
              key={index+menu.label}
              onClick={() => {
                if(menu.hasSubmenu){
                  setPreviousMenukey(activeMenuKey);
                  setActiveMenuKey(menu.label)
                }else{
                  setPreviousMenukey(activeMenuKey);
                  setShowingMenu(menu.label)
                }
              }}
              className='menu_item'>
                {menu.label.replace("_", " ").toUpperCase()}
              </button>
            )
          })}

          {previousMenuKey &&  (
            <button onClick={() => {
              setActiveMenuKey(previousMenuKey || "main");
              const allMenuWithoutKey = Object.values(MenuData).flat();
              //console.log(allMenuWithoutKey)
              //console.log(previousMenuKey)
              allMenuWithoutKey.push({ label: "main", hasSubmenu: true, isSubmenu: false }) 

              const thisMenuObject = allMenuWithoutKey.find((o) => o.label.toLowerCase() === previousMenuKey.toLowerCase())
             // console.log(thisMenuObject)
              if(!thisMenuObject) return;
              if(!thisMenuObject.isSubmenu) setPreviousMenukey(undefined);
              }} className='menu_item'>
              BACK
            </button>
         )}
        </div>

        <MenuFooter />
      </div>}
      {showingMenu && 
      <MenuGui 
        screen={showingMenu}
      />}
    </div>
  )
}

export default Menu