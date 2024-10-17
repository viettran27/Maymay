import logo from '@/assets/logo_white.png'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '@/constants/routes'

const SideBar = () => {
    const location = useLocation()
    const pathName = location.pathname

    return (
        <div className='fixed top-0 left-0 bottom-0 bg-primary w-[300px] h-[100vh] px-3 overflow-y-auto'>
            <div className='flex justify-center items-center min-h-[80px]'>
                <img className='w-14 h-14' src={logo} />
            </div>
            <div className='border-b border-white'></div>
            <div className='mt-5 overflow-auto'>
                {
                    routes.map((route, index) => (
                        <Link
                            to={route.path}
                            key={index}
                            className={`block py-3 text-xl font-semibold px-5 rounded-xl ${pathName === route.path ? 'bg-white text-[#4e73df]' : 'text-white'}`}>
                            {route.name}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default SideBar
