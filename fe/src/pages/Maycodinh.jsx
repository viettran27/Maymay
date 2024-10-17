import { Fragment, useEffect, useState, useRef, memo } from 'react'
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

const REGION = {
    Tuyen_dung: "Tuyển dụng",
    Thay_layout: "Thay Layout",
    Mau: "Mẫu",
    Tat_ca: "Tất cả"
}

const Maycodinh = memo(() => {
    const action = useRef(null)

    const showLoading = useLoading(state => state.showLoading)
    const hideLoading = useLoading(state => state.hideLoading)
    const showMessage = useToast(state => state.showMessage)
    
    const [top, setTop] = useState(0)
    const [file, setFile] = useState(null)
    const [data, setData] = useState({})
    const [fac, setFac] = useState("NT1")
    const [region, setRegion] = useState("Tuyen_dung")
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
        getData(fac, region, month, year)
    }, [])

    const getData = useDebounceCallback((fac, region, month, year, callback) => {
        if (!year) {
            showMessage("err", "Vui lòng nhập năm!")
            return
        }
        
        showLoading()
        apiClient.get(`/api_maycodinh?fac=${fac}&region=${region}&month=${month}&year=${year}`).then(res => {
            setData(res?.data)
            callback && callback()
            hideLoading()
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại sau")
        })
    }, 500)

    const handleGetSample = () => {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API}/api_maycodinh/export?month=${month}&year=${year}&fac=${fac}&region=${region}`;
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
        showLoading()
        apiClient.post("/api_maycodinh", formData).then((res) => {            
            getData(fac, region, month, year, () => showMessage("success", res?.message))
            hideLoading()
        })
        .catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại sau")
        })
    }

    const onChangeYear = (e) => {
        setYear(e.target.value)
        getData(fac, region, month, e.target.value)
    }
    
    const renderTable = (index, region, regionData) => {
        return <Fragment key={index}>
            <tr >
                <td className="sticky bg-white left-4 min-w-[105px] border-b border-r first:border-l border-gray-300 p-2 text-center after:content-[''] after:w-4 after:absolute after:h-[calc(100%+3px)] after:bg-white after:-top-[1px] after:-left-[17px]" rowSpan={machines.length + 1}>{region}</td>
            </tr>
            {
                machines.map((machine, index) => (
                    <tr key={index}>
                        <td className="sticky bg-white left-[calc(100px+21px)] border-b border-r border-gray-300 p-2 text-left">{machine}</td>
                        {
                            regionData?.[machine] ?
                                regionData?.[machine].map((value, index) => (
                                    <td className="border-b border-r first:border-l border-gray-300 p-2 text-center" key={index}>{value}</td>
                                ))
                            :
                                days.map((_, index) => (
                                    <td className="border-b border-r first:border-l border-gray-300 p-2 text-center" key={index}>0</td>
                                ))
                        }
                        <td className="sticky z-1 right-0 after:content-[''] after:block after:h-full after:w-4 bg-white"></td>
                    </tr>
                ))
            }
        </Fragment>
    }

    const days = getDayInMonth(month, year)
    
    return (
        <>
            <div ref={action} className='sticky left-0 px-4 pt-4 pb-2 top-[80px] bg-white z-20'>
                <div className="flex gap-2 mb-2 pb-4 items-center border-b border-gray-300">
                    <Button onClick={handleGetSample} className="bg-green-600 hover:bg-green-700">Lấy file</Button>
                    <UploadFile onChange={onChangeFile}/>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Lưu</Button>
                </div>
                <div className='flex items-center gap-2 h-[40px]'>
                    <div className='font-bold'>Nhà máy:</div>
                    <Select value={fac} onValueChange={new_fac => getData(new_fac, region, month, year, () => setFac(new_fac))}>
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
                    <div className='font-bold'>Khu vực:</div>
                    <Select value={region} onValueChange={new_region => getData(fac, new_region, month, year, () => setRegion(new_region))}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Tuyen_dung">Tuyển dụng</SelectItem>
                                <SelectItem value="Thay_layout">Thay Layout</SelectItem>
                                <SelectItem value="Mau">Mẫu</SelectItem>
                                <SelectItem value="Tat_ca">Tất cả</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='font-bold ml-2'>Tháng:</div>
                    <Select value={month} onValueChange={new_month => getData(fac, region, new_month, year, () => setMonth(new_month))}>
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
                        className="w-[100px]" type="number" min={1980} max={2100} 
                    />
                </div>
            </div>
            <table className="table-auto border-separate border-spacing-0 pl-4">
                <thead className="sticky z-10" style={{top: top}}>
                    <tr>
                        <th className="font-bold p-2 sticky left-4 after:content-[''] after:w-4 after:absolute after:h-[calc(100%+3px)] after:bg-white after:-top-[1px] after:-left-[17px] min-w-[100px] z-10 first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white">Khu vực</th>
                        <th className="font-bold p-2 sticky left-[calc(100px+21px)] min-w-[250px] z-10 first:border-l border-t border-b border-r border-gray-300 text-left bg-[#4e73df] text-white">Loại máy</th>
                        {days.map((day, index) => (
                            <th className="min-w-[62px] font-bold p-2 first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white" key={index}>{day}</th>
                        ))}
                        <th className="sticky z-1 right-0 after:content-[''] after:block after:h-full after:w-4 bg-white"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        region === "Tat_ca" ?
                            regions.map((key, index) => {
                                const regionData = data[key]
                                return renderTable(index, regions[index], regionData)
                            })
                        :
                            renderTable(0, REGION[region], data[REGION[region]])
                    }
                </tbody>
            </table>
        </>
    )
})

export default Maycodinh
