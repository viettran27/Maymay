import {ChevronRight, ChevronLeft} from "lucide-react"

const PaginationButton = ({ direction }) => {
    return (
        <div className='bg-white p-2 rounded-lg text-[#4e73df] border border-gray-300'>
            {
                direction === "next" ?
                    <ChevronRight />
                    :
                    <ChevronLeft />
            }
        </div>
    )
}

export default PaginationButton