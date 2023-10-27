import React from "react";
import profileImg from "../../assets/images/profile.png";
import arrow from "../../assets/images/arrowdown.png";
import { Menu } from "@headlessui/react";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Profile() {
  return (
    <div>
      {/* <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative "> */}
      <div className="relative  mt-[10%] ml-[40%]">
        <Menu as="div" className="relative ">
          <div>
            <Menu.Button>
              {/* <span className="sr-only">Open user menu</span> */}
             <div className="flex justify-evenly">
              <img
                className="h-10 w-[60px] rounded-full"
                src={profileImg}
                alt=""
              /> 
                <img src={arrow} alt="" className="h-2 w-3 mt-3 ml-3"/>
                </div>
            </Menu.Button>
          </div>
          {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  > */}
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700 no-underline"
                  )}
                >
                  Your Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700 no-underline"
                  )}
                >
                  Settings
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700 no-underline"
                  )}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
          {/* </Transition> */}
        </Menu>
      </div>
    </div>
    //        </div>
    //  </div>
  );
}

export default Profile;
