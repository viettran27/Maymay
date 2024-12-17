import { useLoading } from "@/store/loading"
import SideBar from "@/components/SideBar"
import Loading from "@/components/Loading"

const BaoCao = () => {
    const { hideLoading } = useLoading((state) => state)

    // useEffect(() => {
    //     showLoading()
    // }, [])

    return (
        <div className="w-full relative">
            <SideBar />
            <div className="left-[300px] fixed top-0 right-0 bottom-0 overflow-auto">
                <div className='w-full h-screen'>
                    <iframe src='http://10.0.0.252:91/' onLoad={hideLoading} width={'100%'} height={'100%'} />
                </div>
            </div>
            <Loading />
        </div>
    )
}

export default BaoCao
