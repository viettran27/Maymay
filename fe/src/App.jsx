import {memo, useCallback, useEffect, useRef} from "react"
import { Outlet, useLocation } from "react-router-dom"
import SideBar from "@/components/SideBar"
import Toast from "@/components/Toast"
import Loading from "@/components/Loading"
import Header from "@/components/Header"

const App = memo(() => {
  
  const page = useRef()
  
  const initScroll = useCallback(() => {
    page.current.scrollTo(0, 0)
  }, [])

  const pathName = useLocation().pathname

  useEffect(() => {
    initScroll()
  }, [pathName])

  return (
    <div className="w-full relative">
      <SideBar />
      <div ref={page} className="left-[300px] fixed top-0 right-0 bottom-0 overflow-auto">
        <Header />
        <Outlet context={initScroll} />
      </div>
      <Toast />
      <Loading />
    </div>
  )
})

export default App
