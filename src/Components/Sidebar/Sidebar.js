import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  RxDashboard,
  RxDoubleArrowLeft,
  RxDoubleArrowRight,
} from "react-icons/rx";
import { RiSettings5Line } from "react-icons/ri";
import { IoWalletOutline ,IoDiamondOutline} from "react-icons/io5";
import { CgShoppingBag } from "react-icons/cg";
import { Layout, Menu, theme } from "antd";
import logo from '../../assets/images/OneGameLogo.png'

const { Sider, Content } = Layout;

const Sidebar = ({ children, active, setActive }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { pathname } = useLocation();
  const SidebarItems = [
    {
      label: <img src={logo} alt="logo" className="object-contain"/>,
      className:
        "font-semibold text-[25px] !my-10 !overflow-visible text-center text-white	pointer-events-none !p-0",
    },
    {
      key: "1",
      className: `text-[20px]  !mb-16 !rounded-none ${
        pathname === "/"
          ? "bg-sidebarSel bg-cover bg-no-repeat !shadow-lg !shadow-[#CC00FF] "
          : ""
      } !bg-transparent ${
        collapsed && pathname === "/"
          ? " bg-circlebg bg-contain bg-no-repeat !px-[15px] !mx-[15px] !shadow-none"
          : ""
      }  text-center  `,

      label: "Dashboard",
      link: "/dashboard",
      icon: <RxDashboard size={20} className="!ml-[-5px] md:w-4" />,
      onClick: () => {
        setActive(1);
        navigate("/");
      },
    },
    {
      key: "2",
      className: `text-[20px] !mb-16 !rounded-none ${
        pathname === "/LiquidityPool"
          ? "bg-sidebarSel bg-cover bg-no-repeat !shadow-lg !shadow-[#CC00FF] "
          : ""
      } !bg-transparent ${
        collapsed && pathname === "/LiquidityPool"
          ? " bg-circlebg bg-contain bg-no-repeat !px-[15px] !mx-[15px] !shadow-none"
          : ""
      }  text-center  `,

      icon: <CgShoppingBag size={22} className="!ml-[-5px]" />,
      label: "Liquidity Pool",
      onClick: () => {
        setActive(2);
        navigate("/LiquidityPool");
      },
    },
    {
      key: "3",
      className: `text-[20px]  !mb-16 !rounded-none ${
        pathname === "/Staking"
          ? "bg-sidebarSel bg-cover bg-no-repeat !shadow-lg !shadow-[#CC00FF] "
          : ""
      } !bg-transparent ${
        collapsed && pathname === "/Staking"
          ? " bg-circlebg bg-contain bg-no-repeat !px-[15px] !mx-[15px] !shadow-none"
          : ""
      }  text-center  `,
      icon: <IoWalletOutline size={25} className="!ml-[-5px]" />,
      
      label: "Staking",
      onClick: () => {
        setActive(3);
        navigate("/Staking");
      },
    },
    {
      key: "4",
      className: `text-[20px]  !mb-16 !rounded-none ${
        pathname === "/GemVault"
          ? "bg-sidebarSel bg-cover bg-no-repeat !shadow-lg !shadow-[#CC00FF] "
          : ""
      } !bg-transparent ${
        collapsed && pathname === "/GemVault"
          ? " bg-circlebg bg-contain bg-no-repeat !px-[15px] !mx-[15px] !shadow-none"
          : ""
      }  text-center  `,
      icon: <IoDiamondOutline size={25} className="!ml-[-5px] " />,
      
      label: "Gem Vault",
      onClick: () => {
        setActive(4);
        navigate("/GemVault");
      },
    },
    // {
    //   key: "5",
    //   className: `text-[20px] !mb-16 !rounded-none ${
    //     pathname === "/Settings"
    //       ? "bg-sidebarSel bg-cover bg-no-repeat !shadow-lg !shadow-[#CC00FF] "
    //       : ""
    //   } !bg-transparent ${
    //     collapsed && pathname === "/Settings"
    //       ? " bg-circlebg bg-contain bg-no-repeat !px-[15px] !mx-[15px] !shadow-none"
    //       : ""
    //   }  text-center  `,
    //   icon: <RiSettings5Line size={25} className="!ml-[-5px]" />,
      
    //   label: "Settings",
    //   onClick: () => {
    //     setActive(5);
    //     navigate("/Settings");
    //   },
    // },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className="hidden md:inline lg:inline">
        <Menu
          theme="dark"
          mode="inline"
          className=" h-full bg-sidebar-img bg-cover  "
          defaultSelectedKeys={["1"]}
          items={SidebarItems}
        />
      </Sider>
      <Layout>
        <Content>
          <div className="absolute ">
            {React.createElement(
              collapsed ? RxDoubleArrowRight : RxDoubleArrowLeft,
              {
                className: collapsed
                  ? "trigger text-white mt-10 ml-3 cursor-pointer hidden md:inline lg:inline"
                  : "trigger text-white mt-16 ml-[-20px] cursor-pointer",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <main>{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
};

export { Sidebar };
