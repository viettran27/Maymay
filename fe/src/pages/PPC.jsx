import { useState } from 'react'
import PaginationButton from '@/components/PaginationButton'
import ReactPaginate from 'react-paginate'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import apiClient from "@/api/axios"
import { useLoading } from '@/store/loading'
import { useOutletContext } from 'react-router-dom'
import { useRef } from 'react'

const configs = [
    {
        name: "Style",
        key: "Style_P"
    },
    {
        name: "Chuyền",
        key: "Line"
    },
    {
        name: "Sản lượng",
        key: "Qty_P"
    },
    {
        name: "SAH",
        key: "SAH_P"
    },
    {
        name: "Thời gian",
        key: "Hours_P"
    },
    {
        name: "Số công nhân",
        key: "Worker_P"
    },
    {
        name: "Ngày",
        key: "WorkDate",
        format: (date_str) => {
            if (typeof date_str === 'undefined' || date_str === null) return date_str 
            const date = new Date(date_str);

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
            const year = date.getFullYear();
            
            return `${day}/${month}/${year}`;
        }
    }
]

const PAGE_SIZE = 20

const PPC = () => {
    const action = useRef(null)

    const showLoading = useLoading((state) => state.showLoading)
    const hideLoading = useLoading((state) => state.hideLoading)

    const initScroll = useOutletContext()
    
    const [top, setTop] = useState(0)
    const [filter, setFilter] = useState({})
    const [data, setData] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1)

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
        getData()
    }, [])

    const getData = (page_param, filter_param) => {
        let url = `/api_ppc/`
        const queries = []
        Object.entries(filter_param ?? filter).forEach(([key, value]) => {
            if (value) queries.push(`${key}=${value}`)
        })
        if (queries.length > 0) {
            url += `?${queries.join("&")}&page=${page_param ?? page}&size=${PAGE_SIZE}`
        } else {
            url += `?page=${page_param ?? page}&size=${PAGE_SIZE}`
        }

        showLoading()
        apiClient.get(url).then(res => {
            setData(res.data)
            initScroll()
            setTotalPage(res.total_page)
            hideLoading()
        })
        .catch(() => {
            hideLoading()
        })
    }

    const handleDeleteSearch = () => {
        setFilter({})
        getData(null, {})
        setPage(1)
    }

    const handleChangePage = (e) => {
        const page = e.selected + 1
        showLoading()
        getData(page)
        setPage(page)
    }

    return (
        <div>
            <div ref={action} className='flex pt-4 items-center gap-2 px-4 pb-2 sticky top-[80px] z-10 bg-white'>
                <div className='font-bold'>Ngày</div>
                <Input type="date" value={filter?.workdate || {}} onChange={e => setFilter({...filter, workdate: e.target.value})}/>
                <div className='font-bold ml-2'>Style</div>
                <Input type="text" placeholder="Nhập style cần tìm" value={filter?.style || ""} onChange={e => setFilter({...filter, style: e.target.value})}/>
                <div className='font-bold ml-2'>Line</div>
                <Input type="text" placeholder="Nhập line cần tìm" value={filter?.line || ""} onChange={e => setFilter({...filter, line: e.target.value})}/>
                <Button className='ml-2 bg-green-600 hover:bg-green-700' onClick={() => getData()}>Tìm kiếm</Button>
                <Button className='px-2 bg-red-600 hover:bg-red-700' onClick={handleDeleteSearch}><X /></Button>
            </div>
            <table className="table-auto border-separate border-spacing-0 px-4 w-full">
                <thead className='sticky z-10'>
                    <tr>
                        {
                            configs.map((item, index) => (
                                <th style={{top: top}} className="font-bold p-2 sticky first:border-l border-t border-b border-r border-gray-300 text-center bg-[#4e73df] text-white" key={index}>{item.name}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => (
                            <tr key={index}>
                                {
                                    configs.map((config, index) => (
                                        <td className="border-b border-r first:border-l border-gray-300 p-2 text-center" key={index}>{config?.format ? config.format(item[config.key]) : item[config.key]}</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                totalPage > 1 &&
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={<PaginationButton direction="next" />}
                    pageRangeDisplayed={3}
                    pageCount={totalPage}
                    forcePage={page - 1}
                    className='flex items-center justify-center gap-2 mt-5 mb-4'
                    pageLinkClassName='px-4 py-2 block border rounded-lg cursor-pointer overflow-hidden'
                    activeLinkClassName='bg-[#4e73df] text-white'
                    onPageChange={handleChangePage}
                    previousLabel={<PaginationButton direction="prev" />}
                    renderOnZeroPageCount={null}
                />
            }
        </div>
    )
}

export default PPC
