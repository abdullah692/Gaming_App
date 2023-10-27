import React,{useState,useEffect} from 'react';
import Web3 from 'web3';

function myWalletOfOwner(props) {
    const [myGems, setMyGems] = useState([]);

    const { ethereum } = window;
  const web3 = new Web3(ethereum);

    const MyGemsGet = async () => {
        try {
          const myGemsData = await NFTContract.methods
            .walletOfOwner(stateAddress.address)
            .call();
          const b = myGemsData;
          setMyGems(
            b.map((value, index) => ({
              id: index,
              value: value,
            }))
          );
          setLoading(false);
        } catch (error) {
          console.log("Error Message :", error);
        }
      };
      useEffect(() => {
        
        MyGemsGet();
        
      }, [stateAddress.address]);

    return (
        <div>
            
        </div>
    );
}

export default myWalletOfOwner;