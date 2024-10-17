import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useLoading } from '@/store/loading'
import apiClient from "@/api/axios"
import { getDayInMonth } from '@/lib/utils'
import { machines, regions } from '@/constants/machine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectGroup, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { useDebounceCallback } from '@/hooks/useDebounce'
import { useToast } from '@/store/toast'
import UploadFile from '@/components/UploadFile'

const Mayton = () => {
    const action = useRef(null)

    const showLoading = useLoading(state => state.showLoading)
    const hideLoading = useLoading(state => state.hideLoading)
    const showMessage = useToast(state => state.showMessage)

    const [top, setTop] = useState(0)
    const [file, setFile] = useState(null)
    const [data, setData] = useState({})
    const [fac, setFac] = useState("NT1")
    const [status, setStatus] = useState("OK")
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        setTop(action.current?.getBoundingClientRect().height + 80)

        const handleSetTopTable = () => {
            setTop(action.current?.getBoundingClientRect().height + 80)
        }

        window.addEventListener("resize", handleSetTopTable)
        return () => {
            window.removeEventListener("resize", handleSetTopTable)
        }
    }, [action.current])

    useEffect(() => {
        getData(fac, status, month, year)
    }, [])

    const getData = useDebounceCallback((fac, status, month, year, callback) => {
        if (!year) {
            showMessage("err", "Vui lòng nhập năm!")
        }

        showLoading()
        apiClient.get(`/api_mayton?fac=${fac}&month=${month}&year=${year}&status=${status}`).then(res => {
            setData(res?.data)
            callback && callback()
            hideLoading()
        }).catch(() => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại sau")
        })
    })

    const handleGetSample = () => {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API}/api_mayton/export?month=${month}&year=${year}&fac=${fac}&status=${status}`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const onChangeFile = (e) => {
        const file = e.target.files[0];
        setFile(file)
    }

    const handleSave = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fac", fac);
        formData.append("month", month);
        formData.append("year", year);
        formData.append("status", status);

        showLoading()
        apiClient.post(`/api_mayton`, formData).then((res) => {
            getData(fac, status, month, year, () => showMessage("success", res?.message))
            hideLoading()
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử thao tác sau")
        })
    }

    const onChangeYear = (e) => {
        setYear(e.target.value)
        getData(fac, status, month, e.target.value)
    }

    const days = getDayInMonth(month, year)

    return (
        <>
            <div ref={action} className='sticky left-0 px-4 pt-4 pb-2 top-[80px] bg-white z-20'>
                <div className="flex gap-2 mb-2 pb-4 items-center border-b border-gray-300">
                    <Button onClick={handleGetSample} className="bg-green-600 hover:bg-green-700">Lấy file</Button>
                    <UploadFile onChange={onChangeFile} />
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Lưu</Button>
                </div>
                <div className='flex items-center gap-2 h-[40px]'>
                    <div className='font-bold'>Nhà máy:</div>
                    <Select value={fac} onValueChange={new_fac => getData(new_fac, status, month, year, () => setFac(new_fac))}>
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
                    <div className='font-bold'>Trạng thái:</div>
                    <Select value={status} onValueChange={new_status => getData(fac, new_status, month, year, () => setStatus(new_status))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="OK">Ok</SelectItem>
                                <SelectItem value="Hong">Hỏng</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='font-bold ml-2'>Tháng:</div>
                    <Select value={month} onValueChange={new_month => getData(fac, status, new_month, year, () => setMonth(new_month))}>
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
