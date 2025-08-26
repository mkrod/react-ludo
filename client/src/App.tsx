import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import RootLayout from './layout/root_layout'
import { GameProvider } from './constant/provider'
import Index from './pages'
import NotFound from './pages/not_found'

const App : React.FC = () : React.JSX.Element => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Index />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    )
  )

  return (
    <GameProvider>
      <RouterProvider router={router}  />
    </GameProvider>
  )
}

export default App