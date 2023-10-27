import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { LiquidityData } from './LiquidityPool/data';
import { GridLoader } from 'react-spinners';

function LiquidityAndVaultData(props) {
    const wallet = useSelector((state) => state?.rootReducer?.wallet?.wallet);
    const OGI = useSelector((state) => state.rootReducer.wallet.ogi);
    const Gems = useSelector((state) => state.rootReducer.wallet.gems);
    const sign = useSelector((state) => state?.rootReducer?.wallet?.sign);
  

    const [loading, setLoading] = useState(false);
    return (
        <div>
            <div className="grid grid-cols-1  py-6 px-3 md:px-16 lg:px-16 xl:px-16 ">
          <div className="row-span-1 rounded-[10px] bg-liquiditymaskgroup bg-cover">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:grid-cols-3  xl:grid-cols-3  md:ml-20 lg:ml-0">
              {LiquidityData.map((item) => {
                return (
                  <>
                    {item.id === 3 ? (
                      <>
                        <div className="flex  my-4">
                          <div className="lg:ml-[-20px] xl:ml-0">
                            <img
                              src={item.image}
                              alt="imageBG"
                              className={`mt-7 h-[80px]`}
                            />
                          </div>
                          {!sign.sign ? (
                            <>
                              {/* <img
                                src={item.image}
                                alt="imageBG"
                                className={`mt-4  h-[120px]`}
                              /> */}
                              <div className="ml-5 mt-8">
                                <p className="font-semibold text-[35px]">
                                  N/A ETH
                                </p>
                                <p className=" text-gray-400">
                                  Please Connect to Wallet
                                </p>
                              </div>
                            </>
                          ) : loading == true && wallet ? (
                            <div className="col-span-3  mt-10 ml-[100px] flex justify-center">
                              <GridLoader color="#560871" />
                              {/* <p>$OGI</p> */}
                            </div>
                          ) : (
                            <>
                              <div className="ml-5 mt-8">
                                <p className="font-semibold text-[35px] lg:text-[27px] xl:text-[35px]">
                                  {wallet.wallet.slice(0, 7)}ETH
                                </p>
                                <p className='lg:text-[12px] xl:text-[14px]'>in your wallet</p>
                              </div>
                            </>
                          )}
                        </div>
                        {/* </div> */}
                      </>
                    ) : (
                      <>
                        <div className="flex  lg:border-r-2 lg:border-[#686ec24f] xl:border-r-2 xl:border-[#686ec24f]   my-6">
                          {item.id === 1 ? (
                            <>
                              {/* <div className="mt-10"> */}
                              <div className="lg:ml-[-8px] xl:ml-0">
                                <img
                                  src={item.image}
                                  alt="imageBG"
                                  className={`mt-2  h-[120px] xl:ml-6`}
                                />
                              </div>
                              {!sign.sign ? (
                                <>
                                  <div className="mt-8">
                                    <p className="font-semibold text-[35px]">
                                      N/A Gems
                                    </p>
                                    <p className=" text-gray-400">
                                      Please Connect to Wallet
                                    </p>
                                  </div>
                                </>
                              ) : loading == true && Gems ? (
                                <div className="col-span-3  mt-10 ml-[100px] flex justify-center">
                                  <GridLoader color="#560871" />
                                </div>
                              ) : (
                                <>
                                  <div className="mt-8">
                                    <p className="font-semibold text-[35px] lg:text-[27px] xl:text-[35px]">
                                      {Gems.gems} Gems
                                    </p>
                                    <p className='lg:text-[12px] xl:text-[14px]'>in your wallet</p>
                                  </div>
                                </>
                              )}
                              {/* </div> */}
                              {/* </div> */}
                            </>
                          ) : item.id === 2 ? (
                            <>
                              <div className="lg:ml-[-14px] xl:ml-0">
                                <img
                                  src={item.image}
                                  alt="imageBG"
                                  className={`lg:mt-4 xl:mt-0`}
                                />
                              </div>
                              {!sign.sign? (
                                <>
                                  <div className="mt-8">
                                    <p className="font-semibold text-[35px]">
                                      N/A $OGI
                                    </p>
                                    <p className=" text-gray-400">
                                      Please Connect to Wallet
                                    </p>
                                  </div>
                                </>
                              ) : loading == true && OGI ? (
                                <div className="col-span-3  mt-10 ml-[100px] flex justify-center">
                                  <GridLoader color="#560871" />
                                </div>
                              ) : (
                                <>
                                  <div className="mt-6">
                                    <p className="font-semibold text-[35px] lg:text-[25px] xl:text-[35px]">
                                      {OGI.ogi.substring(0,6)} $OGI
                                    </p>
                                    <p className='lg:text-[12px] xl:text-[14px]'>in your wallet</p>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}
                    {/* </div> */}
                  </>
                );
              })}
            </div>
          </div>
        </div>
        </div>
    );
}

export default LiquidityAndVaultData;