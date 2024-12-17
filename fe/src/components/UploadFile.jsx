import {useRef, useId} from 'react'
import { buttonVariants } from './ui/button'

const UploadFile = ({value, onChange, buttonName}) => {
    const id = useId()
    const fileName = useRef()
    const input = useRef()

    const onClick = () => {
        input.current.value = null
        fileName.current.innerHTML = "Không có file nào được chọn"
    }

    const onFileChange = (e) => {
        fileName.current.innerHTML = e.target.files[0].name
        onChange(e)
    }
    
    return (
        <div className='flex gap-2 items-center w-[310px]'>
            <label onClick={onClick} htmlFor={id} className={buttonVariants({variant:'default'})}>{buttonName || 'Chọn file'}</label>
            <div ref={fileName} className='truncate'>Không có file nào được chọn</div>
            <input ref={input} id={id} value={value} onChange={onFileChange} type="file" className='hidden'/>
        </div>
    )
}

export default UploadFile
