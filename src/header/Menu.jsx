import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { IoBarChartOutline } from "react-icons/io5";
import { CiStickyNote } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { ImProfile } from "react-icons/im";

function Menu({ tableADatas, phanquyens, bophans, keys }) {
    return (
        <div className="bg-white dark:bg-slate-900">
            <div className="list-mb menu-mb bg-white dark:bg-slate-900">
                <NavLink activeclassname="active" to="/auth/docs/home" className="tab dark:text-white" style={{ background: 'none' }}>
                    <FaHome size={20} />
                    <span>Trang chủ</span>
                </NavLink>
                {(phanquyens === true || (bophans && tableADatas.some(item => item.bophan === bophans && item.tinhtrangAD === true))) && (
                    <NavLink activeclassname="active" to={`/auth/docs/new/create`} className="tab dark:text-white" style={{ background: 'none' }}>
                        <CiCirclePlus size={20} />
                        <span>Tạo phiếu</span>
                    </NavLink>
                )}
                <NavLink activeclassname="active" to="/auth/docs/feedback-statistics" className="tab dark:text-white" style={{ background: 'none' }}>
                    <IoBarChartOutline size={20} />
                    <span>Thống kê</span>
                </NavLink>
                <NavLink activeclassname="active" to="/auth/docs/survey-management" className="tab dark:text-white" style={{ background: 'none' }}>
                    <CiStickyNote size={20} />
                    <span>Quản lý</span>
                </NavLink>
                {phanquyens === true && (
                    <NavLink activeclassname="active" to="/auth/docs/internal-management" className="tab dark:text-white" style={{ background: 'none' }}>
                        <MdManageAccounts size={20} />
                        <span>Phòng ban</span>
                    </NavLink>
                )}
                <NavLink activeclassname="active" to={`/auth/docs/profile/${keys}`} className="tab dark:text-white" style={{ background: 'none' }}>
                    <ImProfile size={20} />
                    <span>Tài khoản</span>
                </NavLink>
            </div>
        </div>
    );
}

export default Menu;
