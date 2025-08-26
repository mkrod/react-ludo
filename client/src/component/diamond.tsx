import React from 'react'

interface Props {
    size: number;
}
const Diamond:React.FC<Props> = ({ size }):React.JSX.Element => {



  return (
    <img 
    style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        zIndex: 2
    }}
    src='/diamond_coin.png'
     />
  )
}

export default Diamond