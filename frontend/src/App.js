import { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import abi from "./contracts/CoinFundr.json";
import Proposals from "./components/Proposals.jsx";
import ProposalInfo from "./components/ProposalInfo";
import Footer from "./components/Footer";
import LoaderElement from "./components/LoaderElement";
import "./css/style.css"

const App = () => {
  const { ethereum } = window;
  const [walletStatus, setWalletStatus] = useState(false)
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contractABI = abi.abi;
  const [blockchainData, setBlockchainData] = useState({
    provider: null,
    signer: null,
    contract: null
  })

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      setBlockchainData({
        provider,
        signer,
        contract: new Contract(contractAddress, contractABI, signer)
      });

      setWalletStatus(true);

      console.log("metamask connected.")
    } catch (err) {
      console.error(err);
    }
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <h1>Error. Go back :|</h1>,
    }, {
      path: "/app",
      element:
        <>
          <Header
            connectWallet={connectWallet}
            walletStatus={walletStatus}
            blockchainData={blockchainData}
          />
          <Proposals contract={blockchainData.contract} />
          <Footer />
        </>
    },
    {
      path: "/project/:id",
      element:
        <>
          <Header
            connectWallet={connectWallet}
            walletStatus={walletStatus}
            blockchainData={blockchainData}
          />
          <ProposalInfo signer={blockchainData.signer} contract={blockchainData.contract} />
          <Footer />
        </>
    },
  ]);

  useEffect(() => {
    if (ethereum && ethereum.selectedAddress) {
      setWalletStatus(true);
    }

  }, [walletStatus])

  return (<RouterProvider router={router} />)
}

export default App;