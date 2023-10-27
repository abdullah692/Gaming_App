import React, { useState } from "react";

const Model = ({ show, onClose, SellGems }) => {
  const [IsChecked, setIsChecked] = useState([]);
  // const [Isdull, setIsDull] = useState(true);
  if (!show) return null;
  // console.log('Show true',show);
  const handleChecked = (event) => {
    //   const CheckedId=event.target.id;
    //  console.log('Id',CheckedId)
    const { checked, value, id } = event.target;
    console.log(
      `The value is ${value} which is Checked is ${checked} and haved id ${id}`
    );
    if (checked) {
      setIsChecked([id, ...IsChecked]);
    } else {
      setIsChecked(IsChecked.filter((e) => e !== id));
      // if(!IsChecked.includes(id))
      // {
      //     setIsDull(false);
      // }
    }
  };
  console.log("Checked", IsChecked);
  // const isAnyChecked = IsChecked.length > 0;

  // };

  return (
    <>
      <div className="bg-[black] bg-opacity-30 backdrop-blur-sm fixed  inset-0  flex justify-center ">
        <div className="px-10 py-[60px]  max-h-[550px] overflow-auto scrollbar-hide  w-[800px] mt-14 rounded-[20px]  bg-[#141627] mb-5 border-[1px] border-[#CC00FF] !shadow-lg !shadow-[#CC00FF]">
          <p className="text-gray-400 text-[16px]">
            Select your Gems you want to sell.
          </p>
          <div className=" flex">
            <div className="pt-10 pb-2  pr-10 border-r-2 border-[#2a2d45] ">
              {SellGems.map((item, index) => {
                return (
                  <div>
                    {!IsChecked.includes(item.id) ? (
                      <>
                        <div className="flex border-b-[2px] border-[#2A2D45] mt-3  opacity-40">
                          <input
                            type="checkbox"
                            id={item.id}
                            name="checked"
                            // checked={IsChecked.includes(item.id)}
                            value={item.id}
                            onChange={(event) => handleChecked(event)}
                            className="w-3 h-3 text-[#CC00FF] focus:ring-[#CC00FF] mt-[20px] mr-4"
                          />
                          {/* <div style={{opacity:isAnyChecked ? 1 : 0.5}}> */}

                          <img
                            src={item.image}
                            alt="gems"
                            className="w-[60px] h-[55px]"
                          />
                          <p className="text-[22px] font-semibold my-2 ml-2 mr-[150px]">
                            {item.title}
                          </p>
                          {/* </div> */}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex border-b-[2px] border-[#2A2D45] mt-3">
                          <input
                            type="checkbox"
                            id={item.id}
                            name="checked"
                            // checked={IsChecked.includes(item.id)}
                            value={item.id}
                            onChange={(event) => handleChecked(event)}
                            className="w-3 h-3 text-[#CC00FF] focus:ring-[#CC00FF] mt-[20px] mr-4"
                          />
                          {/* <div style={{opacity:isAnyChecked ? 1 : 0.5}}> */}

                          <img
                            src={item.image}
                            alt="gems"
                            className="w-[60px] h-[55px]"
                          />
                          <p className="text-[22px] font-semibold my-2 ml-2 mr-[150px]">
                            {item.title}
                          </p>
                          {/* </div> */}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="">
              <div className="w-[300px] ml-6 mt-[80px] mb-6">
                <p className="text-[25px] text-center">
                  Are you sure you want to sell this gems?
                </p>
              </div>
              <div className="text-center ">
                <button className="my-6  px-[27px] py-[12px] text-[16px] rounded-[10px] bg-gradient-to-r  from-light-violet to-regal-blue">
                  Confirm
                </button>
                <br />
                <button
                  className=" border-2 border-white px-[30px] py-[12px] text-[16px] rounded-[10px]"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p> */}
        </div>
      </div>
    </>
  );
};
export default Model;
