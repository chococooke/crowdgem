import FundraiseStatusBar from "./FundProgressBar";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import LoaderElement from "./LoaderElement";
import { formatEther } from "ethers";
import ContributionForm from "./ContributeForm";
import Timer from "./Timer";

const ProposalInfo = ({ contract, signer }) => {
    const currentTimestamp = Date.now() / 1000;
    const [proposal, setProposal] = useState(null);
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [eventEnded, setEventEnded] = useState(false);
    const isDeployer = contract?.runner ? contract.runner.address === signer.address : false;
    const isFunded = proposal?.targetFunding ? proposal.targetFunding === proposal.currentFunding : false;
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    const getProposal = async () => {
        try {
            setLoading(true);
            const tx = await contract.proposals(params.id);
            setProposal(tx);
            setEventEnded(Number(tx.endTimeStamp) - currentTimestamp < 0);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const refreshNow = () => {
        setRefresh(!refresh);
    }

    useEffect(() => {
        if (contract !== null) {
            getProposal();
        } else {
            console.log("Loading contract");
        }
    }, [contract]);

    const transferFundsToHost = async () => {
        try {
            setLoading(true);
            if (eventEnded && isFunded) {
                const tx = await contract.transferFundsToHost(proposal.id);
                await tx.wait();
                setProposal({ ...proposal, currentFunding: 0 });
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const refund = async () => {
        try {
            setLoading(true);
            const tx = await contract.refundFundsToContributor(proposal.id);
            await tx.wait();
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <LoaderElement type={"full"} />
            ) : (
                <div className="proposalInfo">
                    {proposal ? (
                        <>
                            <button onClick={() => navigate(-1)} className="btn btn-nav">
                                <ArrowLeft />
                            </button>
                            <div className="proposalInfo__head">
                                <h1 className="proposalInfo__head-title">
                                    <span>Title:   </span>
                                    {proposal.title}
                                </h1>
                                <h2 className="proposalInfo__head-description">
                                    <span>Description:   </span>
                                    {proposal.description}
                                </h2>
                                <div className="proposalInfo__head-sub">
                                    <p>
                                        <span>Host: </span>
                                        <Link to={`https://sepolia.etherscan.io/address/${proposal.host}`}>
                                            {proposal.host}
                                        </Link>
                                    </p>
                                    <p>
                                        <span>Target Funding: </span>
                                        {formatEther(proposal.targetFunding)} ETH
                                    </p>
                                    <p>
                                        <span>Current Funding: </span>
                                        {formatEther(proposal.currentFunding)} ETH
                                    </p>
                                    <p>
                                        <span>Contributor Count: </span>
                                        {Number(proposal.contributorCount)}
                                    </p>
                                </div>
                            </div>
                            <div className="proposalInfo__timer">
                                Event ends in: <Timer endTimestamp={Number(proposal.endTimeStamp)} />
                            </div>
                            <div className="proposalInfo__body">
                                {eventEnded && proposal.currentFunding === 0 ? (
                                    <p>This project didn't collect any funds</p>
                                ) : (
                                    <>
                                        progress:
                                        <FundraiseStatusBar
                                            reload={refresh}
                                            currentFunding={formatEther(proposal.currentFunding)}
                                            targetFunding={formatEther(proposal.targetFunding)}
                                            eventEnded={eventEnded}
                                        />
                                        {isDeployer && isFunded && (
                                            <button
                                                onClick={transferFundsToHost}
                                                disabled={!eventEnded || !isFunded}
                                                className="btn"
                                            >
                                                Send to host
                                            </button>
                                        )}
                                        {eventEnded && !isFunded && proposal.currentFunding > 0 && (
                                            <button onClick={refund} className="btn">
                                                Withdraw
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            {!eventEnded &&
                                <ContributionForm reload={refreshNow} contract={contract} proposalId={proposal.id} />}
                            <div className="proposalInfo__form"></div>
                        </>
                    ) : (
                        <div>
                            Proposal not found or loading...
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ProposalInfo;
