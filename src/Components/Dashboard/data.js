import card1 from "../../assets/images/maskgroup.png";
import ogi from "../../assets/images/ogicoin.png";
import gems from "../../assets/images/gems.png";
import frames from "../../assets/images/frame.png";
import bg2 from "../../assets/images/bg2.png";
import matic from "../../assets/images/matic.png"

export const CardsData = [
  {
    id: 1,
    quantity: "56",
    title: "$OGI",
    description: "Token in your wallet",
    sub_desc: "Equivalent to $345",
    btn_text: "TRADE",
    image: ogi,
    bg: card1,
    shadow: "#FFA900",
  },
  {
    id: 2,
    quantity: "56",
    title: "Gems",
    description: "In your wallet",
    sub_desc: "Equivalent to $345",
    btn_text: "MANAGE",
    image: gems,
    bg: card1,
    shadow: "#b67edf",
  },
  
 
  {
    id: 3,
    quantity: "456 ",
    title: "ETH",
    description: "In your wallet",
    sub_desc: "Equivalent to $345",
    image: matic,
    bg: bg2,
    shadow: "#b67edf",
  },
];

export const contentData = [
  {
    id: 1,
    quantity: "56",
    description: "Wallets Holding $OGI",
    sub_desc: "Equivalent to $345",
    content:
      "The number of wallets that currently have any balance of the $OGI token",
  },
  {
    id: 2,
    quantity: "3456",
    description: "Wallets Holding Gems",
    sub_desc: "Equivalent to $345",
    content:
      "The number of wallets that currently hold at least 1 Gem, not counting any staked Gems",
  },
  
  {
    id: 3,
    quantity: "2684",
    description: "$OGI TVL in Gems",
    sub_desc: "Equivalent to $345",
    content:
      "The percentage of the total supply of the $OGI token which is currently locked in Gems",
  },
  
  {
    id: 4,
    quantity: "755",
    description: "Gems LP TVL",
    sub_desc: "Equivalent to $345",
    content:
      "The current estimated value of Gems currently available in the marketplace liquidity pool",
  },
  {
    id: 5,
    quantity: "235",
    description: "24hr Gem LP Volume",
    sub_desc: "Equivalent to $345",
    content:
      "The amount of ledger native token (MATIC) used to buy and sell Gems in the marketplace over the last 24 hours",
  },
];

export const contentTran = [
  {
    id: 1,
    description: "lorem ipsum dolor sit consectetur",
    time: "3 mins ago",
  },
  {
    id: 2,
    description: "lorem ipsum dolor sit consectetur",
    time: "25 mins ago",
  },
  {
    id: 3,
    description: "lorem ipsum dolor sit consectetur",
    time: "1 day ago",
  },
  {
    id: 4,
    description: "lorem ipsum dolor sit consectetur",
    time: "3 days ago",
  },
];
// export {CardsData, contentData};
