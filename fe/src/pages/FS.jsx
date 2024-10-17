import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import apiClient from "@/api/axios"
import { useLoading } from "@/store/loading"
import { useDebounceCallback } from "@/hooks/useDebounce"
import { X, Pencil, Plus } from "lucide-react"
import UploadFile from "@/components/UploadFile"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/store/toast"

const config = [
    {
        name: "SN",
        key: "SN"
    },
    {
        name: "SN (use auto knife)",
        key: "SN (use auto knife)"
    },
    {
        name: "OL",
        key: "OL"
    },
    {
        name: "OL Top feeder - Máy cổ nhỏ",
        key: "OL Top feeder - Máy cổ nhỏ"
    },
    {
        name: "OL (hide seam inside)",
        key: "OL (hide seam inside)"
    },
    {
        name: "FL (hemming)",
        key: "FL (hemming)"
    },
    {
        name: "FL binding",
        key: "FL binding"

    },
    {
        name: "FL Special (many needles)",
        key: "FL Special (many needles)"
    },
    {
        name: "FL auto cut",
        key: "FL auto cut"
    },
    {
        name: "Bartack (BTK)",
        key: "Bartack (BTK)"
    },
    {
        name: "SN 2K",
        key: "SN 2K"
    },
    {
        name: "BTH",
        key: "BTH"
    },
    {
        name: "LBH (thùa khuy)",
        key: "LBH (thùa khuy)"
    }
]

const INIT_STYLE = {
    "Style": "",
    "SN": 0,
    "SN (use auto knife)": 0,
    "OL": 0,
    "OL Top feeder - Máy cổ nhỏ": 0,
    "OL (hide seam inside)": 0,
    "FL (hemming)": 0,
    "FL binding": 0,
    "FL Special (many needles)": 0,
    "FL auto cut": 0,
    "Bartack (BTK)": 0,
    "SN 2K": 0,
    "BTH": 0,
    "LBH (thùa khuy)": 0
}

const FS = () => {
    const showLoading  = useLoading((state) => state.showLoading)
    const hideLoading  = useLoading((state) => state.hideLoading)
    const showMessage = useToast(state => state.showMessage)

    const [styleSearch, setStyleSearch] = useState("")
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])
    const [styleValue, setStylevalue] = useState(INIT_STYLE)
    const [openDialog, setOpenDialog] = useState(false)
    const [dialog, setDialog] = useState({
        status: "add",
        title: "Thêm Style",
    })

    useEffect(() => {
        getData(styleSearch)
    }, [])

    const getData = (style, callback) => {
        showLoading()
        apiClient.get(`/api_fs?style=${style ?? styleSearch}`).then(res => {
            setData(res.data)
            hideLoading()
            callback && callback()
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại sau")
        })
    }


    const handleGetSample = () => {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API}/api_fs/export`;
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
        showLoading()
        
        apiClient.post("/api_fs", formData).then((res) => {
            getData(styleSearch, () => showMessage("success", res?.message))
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui được thể lại sau")
        })
    }

    const search = useDebounceCallback((value) => {
        getData(value)
    }, 500)

    const handleSearch = (e) => {
        setStyleSearch(e.target.value)
        search(e.target.value)
    }

    const handleDeleteSearch = () => {
        setStyleSearch("")
        search("")
    }

    const handleChangeStyle = (e) => {
        const target = e.target
        const value = target.value
        const name = target.name
        
        setStylevalue({
            ...styleValue,
            [name]: value
        })
    }

    const handleSaveStyle = () => {
        showLoading()
        apiClient.post("/api_fs/style", styleValue).then((res) => {
            getData(styleSearch, () => showMessage("success", res?.message))
        }).catch((e) => {
            hideLoading()
            showMessage("err", e?.response?.data?.message || "Có lỗi hệ thống, vui được thể lại sau")
        })
        setStylevalue(INIT_STYLE)
    }

    const handleEditStyle = (item) => {
        setStylevalue(item)
        setDialog({
            status: "edit",
            title: `Sửa Style ${item["Style"]}`
        })
        setOpenDialog(true)
    }

    return (
        <>
            <div className="sticky z-20 left-0 top-[80px] bg-white p-4 pb-2">
                <div className="flex gap-2 items-center mb-2 pb-4 border-b border-gray-300">
                    <Button onClick={handleGetSample} className="bg-green-600 hover:bg-green-700">Lấy file</Button>
                    <UploadFile onChange={onChangeFile} />
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Lưu</Button>
                </div>
                <div className="flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                        <Input 
                            type="text"
                            value={styleSearch}
                            onChange={(e) => handleSearch(e)}
                            placeholder="Nhập style cần tìm"
                        />
                        {
                            styleSearch &&
                            <Button className="bg-red-500 px-2 hover:bg-red-600" onClick={handleDeleteSearch}>
                                <X/> 
                            </Button> 
                        }
                    </div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button 
                                className="bg-green-600 hover:bg-green-600 flex gap-2 items-center"
                                onClick={() => setDialog({status: "add", title: "Thêm Style"})}
                            >
                                <Plus className="size-4"/>
                                Thêm Style
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[1000px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{dialog.title}</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2">
                                {
                                    dialog.status === "add" &&
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="min-w-[230px]">Style</div>
                                        <Input 
                                            type="text"
                                            name="Style"
                                            value={styleValue?.["Style"] ?? ""} 
                                            onChange={handleChangeStyle}
                                        />
                                    </div>
                                }
                                {
                                    config.map((item, index) => (
                                            <div className="flex items-center gap-2 mb-2" key={index}>
                                                <div className="min-w-[230px]">{item.name}</div>
                                                <Input 
                                                    type="number"
                                                    name={item.name} 
                                                    value={styleValue?.[item.name] ?? ""} 
                                                    onChange={handleChangeStyle}
                                                />
                                            </div>
                                    ))
                                }
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Quay lại</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="submit" onClick={handleSaveStyle}>Lưu</Button>
                                </DialogClose>  
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <table className="table-auto w-full border-separate border-spacing-0 px-4 pb-4">
                <thead className="sticky z-10">
                    <tr>
                        <th className="font-bold z-10 sticky top-[204px] p-2 first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white left-4 after:content-[''] after:w-4 after:absolute after:h-[calc(100%+3px)] after:bg-white after:-top-[2px] after:-left-[18px] min-w-[140px]">Style</th>
                        {
                            config.map((item, index) => (
                                <th
                                    style={{ minWidth: item.width ? item.width : "max-content"}}
                                    className={`font-bold sticky top-[204px] p-2 first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white ${item.class}`}
                                    key={index}
                                >
                                    {item.name}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length === 0 &&
                        <tr>
                            <td colSpan={config.length + 1} className="text-center border border-t-0 border-gray-300 py-3">Không có dữ liệu</td>
                        </tr>
                    }
                    {
                        data.map((item, index) => (
                            <tr key={index}>
                                <td 
                                    className={`border-b cursor-pointer group relative border-r first:border-l border-gray-300 p-2 text-center bg-white`}
                                >
                                    {item?.["Style"]}
                                    <div className="absolute hidden group-hover:flex items-center justify-center left-0 top-0 w-full h-full bg-white z-2">
                                        <Pencil color="#4e73df" onClick={() => handleEditStyle(item)}/>
                                    </div>
                                </td>
                                {
                                    config.map((c, index) => (
                                        <td className={`border-b border-r first:border-l border-gray-300 p-2 text-center bg-white ${c.class}`} key={index}>{item?.[c.key] || 0}</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}

export default FS
