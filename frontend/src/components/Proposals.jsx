import { useEffect, useState } from "react";
import ProposalCard from "./ProposalCard";
import LoaderElement from "./LoaderElement";
import CreateProposal from "./CreateProposal.jsx";
import { PlusCircle } from "react-feather";

const Proposals = ({ contract }) => {
    const [proposals, setProposals] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState("live");
    const [loading, setLoading] = useState(false);

    const toggleShowForm = () => {
        setShowForm(!showForm);
    };

    const refreshNow = () => {
        setRefresh(!refresh);
    };

    const getProposals = async () => {
        setLoading(true);
        try {
            const proposals = [];
            const proposalCount = await contract.proposalCount();

            for (let i = 1; i <= Number(proposalCount); i++) {
                const proposal = await contract.proposals(i);
                proposals.push(proposal);
            }

            setProposals(proposals);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (contract) {
            getProposals();
        }
    }, [contract, refresh]);

    const filterLiveEvents = () => {
        setActiveTab("live");
    };

    const filterEndedEvents = () => {
        setActiveTab("ended");
    };

    const liveProposals = proposals.filter((proposal) => {
        const currentTimestamp = Date.now() / 1000;
        return Number(proposal.endTimeStamp) > currentTimestamp;
    });

    const endedProposals = proposals.filter((proposal) => {
        const currentTimestamp = Date.now() / 1000;
        return Number(proposal.endTimeStamp) <= currentTimestamp;
    });

    return (
        <>
            {
                loading
                    ? <LoaderElement type={"full"} size={"60"} />
                    : <>
                        {showForm && (
                            <CreateProposal toggleForm={toggleShowForm} contract={contract} refresh={refreshNow} />
                        )}
                        <button className="btn btn-create" onClick={() => toggleShowForm()}>
                            <PlusCircle />
                            <span>List Project</span>
                        </button>
                        <div className="tabs">
                            <button className={activeTab === "live" ? "btn tabs-active" : "btn"} onClick={filterLiveEvents}>
                                Live Events
                            </button>
                            <button className={activeTab === "ended" ? "btn tabs-active" : "btn"} onClick={filterEndedEvents}>
                                Ended Events
                            </button>
                        </div>
                        <div className="proposals">
                            {activeTab === "live" && liveProposals.length === 0 ? (
                                "No Live events at the moment"
                            ) : activeTab === "live" ? (
                                liveProposals.reverse().map((proposal, index) => (
                                    <ProposalCard proposal={proposal} key={index} />
                                ))
                            ) : activeTab === "ended" && endedProposals.length === 0 ? (
                                <div>No ended events.</div>
                            ) : (
                                endedProposals.reverse().map((proposal, index) => (
                                    <ProposalCard proposal={proposal} key={index} />
                                ))
                            )}
                        </div>
                    </>
            }
        </>
    );
};

export default Proposals;
