import BaoCao from "@/pages/Baocao";
import FS from "@/pages/FS";
import Maycodinh from "@/pages/Maycodinh";
import Mayton from "@/pages/Mayton";
import PPC from "@/pages/PPC";

export const routes = [
    {
        name: "Báo cáo tổng hợp",
        path: "/baocao",
        component: <BaoCao />
    },
    {
        name: "PPC",
        path: "/ppc",
        component: <PPC />
    },
    {
        name: "FS",
        path: "/fs",
        component: <FS />
    },
    {
        name: "Máy cố định",
        path: "/may_co_dinh",
        component: <Maycodinh />
    },
    {
        name: "Máy tồn",
        path: "/may_ton",
        component: <Mayton />
    }
]