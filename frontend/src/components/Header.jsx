import { useEffect } from "react";
import { Link2 } from "react-feather";
import { Link } from "react-router-dom";

const Header = ({ connectWallet, walletStatus, blockchainData }) => {

    useEffect(() => {
        if (blockchainData.contract === null && blockchainData.signer === null) {
            connectWallet();
        }
    }, [walletStatus, blockchainData]);

    return (
        <>
            <div className="header">
                <div className="header__nav">
                    <h1 className="header__nav-brand">
                        <Link to="/app">CrowdGem</Link>
                    </h1>
                    <div className="header__nav-navbar">
                        <button onClick={() => connectWallet()} className="btn btn-nav">
                            <Link2 /><span>{
                                blockchainData.signer
                                    ? `${blockchainData.signer.address.substring(0, 12)}...`
                                    : "Connecing Wallet..."
                            }</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
