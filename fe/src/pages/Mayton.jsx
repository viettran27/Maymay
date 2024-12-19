import { useEffect, useState, useRef } from 'react'
import { useLoading } from '@/store/loading'
import apiClient from "@/api/axios"
import { getDayInMonth, getFirstDateOfMonth, getLastDateOfMonth } from '@/lib/utils'
import { STATUS } from '@/constants/machine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectGroup, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { useDebounceCallback } from '@/hooks/useDebounce'
import { useToast } from '@/store/toast'
import UploadFile from '@/components/UploadFile'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const Mayton = () => {
    const action = useRef(null)

    const showLoading = useLoading(state => state.showLoading)
    const hideLoading = useLoading(state => state.hideLoading)
    const showMessage = useToast(state => state.showMessage)

    const [top, setTop] = useState(0)
    const [file, setFile] = useState({
        value: null,
        fac: null
    })
    const [machines, setMachines] = useState([])
    const [data, setData] = useState({})
    const [fac, setFac] = useState("NT1")
    const [status, setStatus] = useState("Cho mượn")
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())
    const [date, setDate] = useState({
        from: getFirstDateOfMonth(),
        to: getLastDateOfMonth()
    })
    const [location, setLocation] = useState(STATUS[fac][status]?.[0]?.value)

    useEffect(() => {
        setTop(action.current?.getBoundingClientRect().height + 80)

        const handleSetTopTable = () => {
            setTop(action.current?.getBoundingClientRect().height + 80)
        }

        window.addEventListener("resize", handleSetTopTable)
        return () => {
            window.removeEventListener("resize", handleSetTopTable)
        }

        // eslint-disable-next-line 
    }, [action.current])

    useEffect(() => {
        getMachines()
        getData(fac, status, location, month, year)

        // eslint-disable-next-line 
    }, [])

    const getMachines = () => {
        apiClient.get(`/api_mayton/machines`)
        .then(data => setMachines(data))
    }

    const getData = useDebounceCallback((fac, status, location, month, year, callback) => {
        if (!year) {
            showMessage("err", "Vui lòng nhập năm!")
        }

        showLoading()
        apiClient.get(`/api_mayton?fac=${fac}&month=${month}&year=${year}&status=${status}&location=${location}`).then(res => {
            setData(res?.data)
            callback && callback()
            hideLoading()
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại sau")
        })
    })

    const onChangeFile = (e, fac) => {
        const file = e.target.files[0];
        setFile({
            value: file,
            fac
        })
    }

    const handleSave = () => {
        const formData = new FormData();
        formData.append("file", file.value);
        formData.append("date_from", date.from)
        formData.append("date_to", date.to)

        showLoading()
        apiClient.post(`/api_mayton/${file.fac}`, formData).then((res) => {
            getData(fac, status, location, month, year, () => showMessage("success", res?.message))
            hideLoading()
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử thao tác sau")
        })
    }

    const onChangeYear = (e) => {
        setYear(e.target.value)
        getData(fac, status, location, month, e.target.value)
    }

    const handleChangeFac = (new_fac) => {
        const new_location = STATUS[new_fac][status]?.[0]?.value
        getData(new_fac, status, new_location, month, year, () => { 
            setFac(new_fac)
            setLocation(new_location)
        })
    }

    const handleChangeStatus = (new_status) => {
        const new_location = new_status !== "4" ? STATUS[fac][new_status]?.[0]?.value : null
        getData(fac, new_status, new_location, month, year, () => {
            setStatus(new_status)
            setLocation(new_location)
        })
    }

    const renderLocation = () => {
        return STATUS[fac][status]?.map(location => <SelectItem key={location.value} value={location.value}>{location.name}</SelectItem>)
    }

    const days = getDayInMonth(month, year)

    return (
        <>
            <div ref={action} className='sticky left-0 px-4 pt-4 pb-2 top-[80px] bg-white z-20'>
                <div className="flex gap-2 mb-2 pb-4 items-center border-b border-gray-300">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Upload dữ liệu</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Đẩy dữ liệu excel</DialogTitle>
                                <DialogDescription></DialogDescription>    
                            </DialogHeader>
                            <div>
                                <div className="flex items-center">
                                    <div className='min-w-[100px]'>Từ ngày</div>
                                    <Input type="date" className="w-full block" value={date.from} onChange={date_from => setDate({...date, from: date_from})}/>
                                </div>
                                <div className="flex items-center mt-3">
                                    <div className='min-w-[100px]'>Đến ngày</div>
                                    <Input type="date" className="w-full block" value={date.to} onChange={date_to => setDate({...date, from: date_to})}/>
                                </div>
                                <div className='mt-3'>
                                    <UploadFile onChange={e => onChangeFile(e, "NT1")} buttonName={"NT1"}/>      
                                </div>
                                <div className='mt-3'>
                                    <UploadFile onChange={e => onChangeFile(e, "NT2")} buttonName={"NT2"}/>      
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary">Quay lại</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Lưu</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className='flex items-center gap-2 h-[40px]'>
                    <div className='font-bold'>Nhà máy:</div>
                    <Select value={fac} onValueChange={handleChangeFac}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="NT1">NT1</SelectItem>
                                <SelectItem value="NT2">NT2</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='font-bold ml-2'>Trạng thái:</div>
                    <Select value={status} onValueChange={handleChangeStatus}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Cho mượn">Cho mượn</SelectItem>
                                <SelectItem value="Mượn">Mượn</SelectItem>
                                <SelectItem value="Thuê">Máy thuê</SelectItem>
                                <SelectItem value="Thanh lý">Thanh lý</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className={`items-center gap-2 ${status !== "Thanh lý" ? "flex" : "hidden"}`} >
                        <div className='font-bold ml-2'>Vị trí</div>
                        <Select value={location} onValueChange={new_location => getData(fac, status, new_location, month, year, () => setLocation(new_location))}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                {renderLocation()}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='font-bold ml-2'>Tháng:</div>
                    <Select value={month} onValueChange={new_month => getData(fac, status, location, new_month, year, () => setMonth(new_month))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month, index) => (
                                    <SelectItem key={index} value={month}>{month}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='font-bold ml-2'>Năm:</div>
                    <Input 
                        value={year} 
                        onChange={onChangeYear} 
                        className="w-[100px]" 
                        type="number" 
                        min={1980} 
                        max={2100} 
                    />
                </div>
            </div>
            <table className="table-auto border-separate border-spacing-0 pl-4">
                <thead style={{top: top}} className='sticky z-10'>
                    <tr>
                        <th className="font-bold p-2 sticky left-4 min-w-[250px] after:content-[''] after:w-4 after:absolute after:h-[calc(100%+3px)] after:bg-white after:-top-[1px] after:-left-[17px] first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white">Loại máy</th>
                        {days.map((day, index) => (
                            <th className="font-bold min-w-[62px] p-2 first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white" key={index}>{day}</th>
                        ))}
                        <th className="sticky z-1 right-0 after:content-[''] after:block after:h-full after:w-4 bg-white"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        machines.map((machine, index) => (
                            <tr key={index}>
                                <td className="border-b border-r sticky left-4 bg-white after:content-[''] after:w-4 after:absolute after:h-[calc(100%+3px)] after:bg-white after:-top-[1px] after:-left-[17px] first:border-l border-gray-300 p-2 text-center">{machine}</td>
                                {
                                    data?.[machine] ?
                                        data?.[machine]?.map((value, index) => (
                                            <td className="border-b border-r border-gray-300 p-2 text-center" key={index}>{value}</td>
                                        ))
                                    :
                                        days.map((day, index) => (
                                            <td className="border-b border-r border-gray-300 p-2 text-center" key={index}>0</td>
                                        ))
                                }
                                <td className="sticky z-1 right-0 after:content-[''] after:block after:h-full after:w-4 bg-white"></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

export default Mayton
