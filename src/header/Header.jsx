import React from 'react';
import Logo from '../assets/Logo.png';
import { Link, Outlet, NavLink } from 'react-router-dom';
import { IoPartlySunnyOutline, IoCreateOutline, IoClose } from "react-icons/io5";
import { LuMoon } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { FaHome, FaRegChartBar } from "react-icons/fa";
import { CiStickyNote } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import Footer from '../components/footer/Footer';
import { GoPasskeyFill } from "react-icons/go";
import Menu from './Menu';
import Modal from '../components/function/Modal';
import Darkmode from '../components/function/Darkmode';
import { ImProfile } from "react-icons/im";

const Header = ({ name, handleLogout, phanquyen, bophan, tableAData, keys, imgAvatar }) => {
  const { toggleDarkMode, isDarkMode } = Darkmode();
  const {
    closeMenu,
    toggleMenu, isMenuOpen } = Modal();

  return (
    <>
      <header className="bg-white dark:bg-slate-900">
        <div className="niso-header">
          {name && (
            <>
              <Link to="/" className='flex items-center gap-2'>
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-16 md:w-16 lg:w-16"
                />
                <span className='font-bold yu dark:text-white'>NISO FORM</span>
              </Link>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold dark:text-white name-niso-reponsive text-mobile">
                  {phanquyen === false && <>Xin chào, </>}
                  {phanquyen === true && <>Dashboard, </>}
                  <span style={{ color: '#ae8f3d' }}>{name}</span>
                </h3>
                <CgMenuGridO
                  className="iconmenu"
                  size={40}
                  onClick={toggleMenu}
                />
                <IoIosLogOut
                  onClick={handleLogout}
                  className="iconmenu"
                  size={40} />
              </div>
            </>
          )}
        </div>
      </header>
      <div className={`account-niso-settings bg-white dark:bg-slate-900 ${isMenuOpen ? 'account-niso-setting-modal' : ''}`}>
        <IoClose className='iconmenu' size={40} onClick={closeMenu} style={{ marginTop: '10px', marginLeft: '10px' }} />
        <div className='info-account-niso'>
          <img src={imgAvatar} alt='Avartar' className='avartar' />
          <span className='text-slate-900 dark:text-white'>{name}{phanquyen === true && (<span className='bg-red-600 dp'>QTV</span>)}</span>
          <span className='text-slate-900 dark:text-white'>Bộ phận: {bophan}</span>
        </div>
        <NavLink activeclassname="active" to="/auth/docs/home" className="background-colors text-slate-900 dark:text-white">
          Home
          <FaHome size={21} />
        </NavLink>
        {(phanquyen === true || (bophan && tableAData.some(item => item.bophan === bophan && item.tinhtrangAD === true))) && (
          <NavLink activeclassname="active" to={`/auth/docs/new/create`} className="background-colors text-slate-900 dark:text-white">
            Tạo Form mới
            <IoCreateOutline size={21} />
          </NavLink>
        )}
        <NavLink activeclassname="active" to="/auth/docs/feedback-statistics" className="background-colors text-slate-900 dark:text-white">
          Báo cáo và phản hồi
          <FaRegChartBar size={21} />
        </NavLink>
        <NavLink activeclassname="active" to="/auth/docs/survey-management" className="background-colors text-slate-900 dark:text-white">
          Quản lý Form
          <CiStickyNote size={21} />
        </NavLink>
        {phanquyen === true && (
          <NavLink activeclassname="active" to="/auth/docs/internal-management" className="background-colors text-slate-900 dark:text-white">
            Quản lý phòng ban
            <MdManageAccounts size={21} />
          </NavLink>
        )}
        {phanquyen === true && (
          <NavLink activeclassname="active" to="/auth/docs/permission-settings" className="background-colors text-slate-900 dark:text-white">
            Cài đặt phân quyền
            <GoPasskeyFill size={21} />
          </NavLink>
        )}
        <NavLink
          to={`/auth/docs/profile/${keys}`}
          className="background-colors text-slate-900 dark:text-white"
        >
          <span>Thông tin tài khoản</span>
          <ImProfile size={21} />
        </NavLink>
        {isDarkMode ? (
          <span className="background-colors text-slate-900 dark:text-white" onClick={toggleDarkMode}>
            <span>Chế độ sáng</span>
            <IoPartlySunnyOutline
              size={21}
            />
          </span>
        ) : (
          <span className="background-colors text-slate-900 dark:text-white" onClick={toggleDarkMode}>
            <span>Chế độ ban đêm</span>
            <LuMoon
              size={21}
            />
          </span>
        )}
        <button style={{ width: '100%', display: 'flex', justifyContent: 'space-between', borderRadius: '0px', padding: '15px 40px' }} onClick={handleLogout}>
          Đăng xuất
          <IoIosLogOut
            size={21}
          /></button>
      </div>
      <div>
        <Outlet />
      </div>
      <div className='footer bg-white dark:bg-slate-900'>
        <Footer />
        <Menu phanquyens={phanquyen} bophans={bophan} tableADatas={tableAData} names={name} keys={keys}/>
      </div>
    </>
  );
};

export default Header;