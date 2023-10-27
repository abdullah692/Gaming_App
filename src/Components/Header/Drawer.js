import { Button, Drawer, Radio, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaBars} from "react-icons/fa"
import { RxDashboard } from 'react-icons/rx';
import { CgShoppingBag } from 'react-icons/cg';
import { useLocation } from 'react-router-dom';
import { IoDiamondOutline, IoWalletOutline } from 'react-icons/io5';
const App = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [placement, setPlacement] = useState('left');
  const navigate=useNavigate();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  return (
    <>
      <Space>
        <Button className='border-none' onClick={showDrawer}>
        <FaBars color='white' size={20}/>
        </Button>
        {/* <div onClick={showDrawer} className='ml-3'>
          <FaBars color='white' size={20}/>
        </div> */}
        {/* <div>
          <p className='ml-3 text-[20px] font-semibold text-white'>DA</p>
        </div> */}
      </Space>
      <Drawer
        title={<span className='text-[24px] font-bold text-white flex justify-center'>D-App</span>}
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        width={230}
        className='!bg-[#141627] text-white'
      >
        <div className={`py-2 px-2 mb-6 text-[18px]  ${pathname === "/" ? " bg-sidebarSel bg-cover flex" : "flex "}`}>
        <RxDashboard className='mt-1 mr-3'/>
        <p onClick={()=>navigate("/")}> Dashboard</p>
          </div>

          <div className={`py-2 px-2 mb-6 text-[18px] ${pathname === "/LiquidityPool" ? " bg-sidebarSel bg-cover flex" : "flex "}`}>
        <CgShoppingBag className='mt-1 mr-3'/>
        <p onClick={()=>navigate("/LiquidityPool")}> Liquidity Pool</p>
          </div>
          
          
          <div className={`py-2 px-2 mb-6 text-[18px] ${pathname === "/Staking" ? " bg-sidebarSel bg-cover flex" : "flex "}`}>
        <IoWalletOutline className='mt-1 mr-3'/>
        <p onClick={()=>navigate("/Staking")}> Staking</p>
          </div>

          <div className={`py-2 px-2 mb-6 text-[18px] ${pathname === "/GemVault" ? " bg-sidebarSel bg-cover flex" : "flex "}`}>
        <IoDiamondOutline className='mt-1 mr-3'/>
        <p onClick={()=>navigate("/GemVault")}> Gem Vault</p>
          </div>
        
      </Drawer>
    </>
  );
};
export default App;
