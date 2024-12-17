import { useEffect, useRef } from 'react'
import { CircleX } from 'lucide-react'
import { useToast } from '@/store/toast'
import {shallow} from 'zustand/shallow'

const Toast = () => {
    const { type, show, message, hideMessage } = useToast((state) => state, shallow)

    const timeout = useRef()
    const toast = useRef()

    useEffect(() => {
        if (!toast.current) return
        if (show) {
            toast.current.style.transform = 'translateX(0)'
            clearTimeout(timeout.current)
            
            timeout.current = setTimeout(() => {
                hideMessage()
            }, 5000)
        } else {
            toast.current.style.transform = 'translateX(calc(100% + 20px))'
        }
    }, [show])
    
    return (
        <div
            ref={toast}
            className={`fixed flex gap-2 transform translate-x-[calc(100%+20px)] transition-all duration-100 z-20 right-5 top-[95px] px-2 py-3 rounded-lg text-white ${!type ? '' : type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
            <span>{message}</span>
            <CircleX className='cursor-pointer' onClick={hideMessage}/>
        </div >
    )
}

export default Toast
