import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Generation({ GenNos }) {
  const [genVal, setGenVal] = useState("01");

  const handleSelect = (e) => {
    console.log(e.target.value);
    setGenVal(e.target.value);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center  text-sm font-medium text-white ">
          {genVal}
          {/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[150px] origin-top-right rounded-md bg-[#141627] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {GenNos.map((item) => {
              return (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <option
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gradient-to-t from-purple-900 to-slate-900 text-white cursor-pointer py-3 rounded-md"
                            : "text-gray-400 bg-[#121528] py-3 rounded-md ",
                          "block px-2 py-1 text-center  text-sm no-underline"
                        )}
                        onClick={handleSelect}
                      >
                        {item.generation}
                      </option>
                    )}
                  </Menu.Item>
                  
                </>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
