import React,{useState,useEffect} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSelector } from "react-redux";
import { Pagination } from "swiper";
import { contentData } from "./data";
import { AiOutlineInfoCircle, AiOutlineBell } from "react-icons/ai";
import { Tooltip } from "antd";
import Web3 from "web3";
import config  from "../../config.json"

function Swipper(props) {
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  const stateAddress = useSelector(
    (state) => state?.rootReducer?.wallet?.address?.address
  );
  const [NFTHold, setNFTHold] = useState("");
  const [OGIHold, setOGIHold] = useState("");
  const [tvlGem, setTvlGem] = useState("");
  const OGITokens = new web3.eth.Contract(config.OGIABI, config.OGIToken);
  // console.log("GEMTokens", GEMTokens);

  const NFTContract = new web3.eth.Contract(config.NFTABI, config.NFTToken);


  const handleOGIBUSD = async () => {
    const GemWalletHold = await NFTContract.methods.count().call();
    setNFTHold(GemWalletHold);
    const OgiWalletHold = await OGITokens.methods.count().call();
    setOGIHold(OgiWalletHold);

    const tvlGems = await NFTContract.methods.getTVL().call();
    const tvlEth = web3.utils.fromWei(tvlGems, "ether");
    console.log("tvlGems", tvlGems);
    let whole = 10000;
    let percentage = (tvlEth / whole) * 100;
    console.log('percentage',percentage);
    setTvlGem(percentage);
    // if (tvlEth.toString().includes(".")) {
    //   setTvlGem(tvlEth.toString().slice(0, 5));
    // } else {
    //   console.log(tvlEth.toString() + "..");
    //   setTvlGem(tvlEth.slice(0, 4));
    // }
  }

  useEffect(() => {
    handleOGIBUSD();
  }, []);

  return (
    <div >
      <div className="max-w-[120vw]">
        <div className="grid grid-cols-1 px-4 py-6 md:px-8 lg:px-8  xl:px-16">
          <div className="row-span-1 rounded-[10px] bg-mobileContent h-[132px] bg-cover ">
            <Swiper
             pagination={true} modules={[Pagination]} className="mySwiper"
            >
                 {contentData.map((item) => {
                   return (
                    <SwiperSlide key={item.id}>
                    <div >
                      <div className="ml-[20px] text-center md:text-start lg:text-start">
                        {item.id === 5 ? (
                          <div className="px-4">
                            <div className=" ">
                              {!sign.sign ? (
                                <p className="justify-center text-white font-semibold text-[45px] flex">
                                  N/A
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-[15px] mt-[25px]">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : (
                                <p className="flex justify-center md:justify-start lg:justify-start font-semibold text-white text-[45px] lg:text-[40px] xl:text-[45px]  ">
                                  {item.quantity}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-[15px] mt-[25px]">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              )}
                              <p className="font-normal mt-2 text-white ">
                                {item.description}
                              </p>
                              <p className="text-[14px]  text-gray-400 ">
                                {item.sub_desc}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="">
                            <div className=" px-6 ">
                              {item.id == 1 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start text-white font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {NFTHold}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : item.id == 2 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start text-white font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {OGIHold}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : item.id == 3 && stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-start text-white font-semibold text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {tvlGem}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : stateAddress && sign.sign ? (
                                <p className="flex justify-center md:justify-start lg:justify-startfont-semibold text-white text-[45px] lg:text-[40px] xl:text-[45px]">
                                  {item.quantity}
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className=" mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              ) : (
                                <p className="flex justify-center text-white font-semibold text-[45px]">
                                  N/A
                                  <Tooltip title={item.content} color="#F9B233">
                                    <span className="ml-3 mt-[25px] ">
                                      <AiOutlineInfoCircle
                                        size={30}
                                        color={"#9da1de70"}
                                        className="cursor-pointer hover:!text-[#F9B233] "
                                      />
                                    </span>
                                  </Tooltip>
                                </p>
                              )}
                              <p className="font-normal mt-2 text-white">
                                {item.description}
                              </p>
                              <p className="text-[14px] text-gray-400 ">
                                {item.sub_desc}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                </SwiperSlide>
                  );
                })}
              {/* <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide> */}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swipper;
