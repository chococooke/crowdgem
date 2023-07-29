import { Link } from "react-router-dom";
import { formatEther } from "ethers";
import CountdownTimer from "./Timer";

const ProposalCard = ({ proposal }) => {
    return (
        <div className="card">
            <div className="card__head">
                <h2 className="card__head-title">{proposal.title}</h2>
                <h3 className="card__head-description">{proposal.description}</h3>
            </div>
            <div className="card__body">
                <ul className="card__body-list">
                    <li className="card__body-list-item">
                        <span>Target:</span> {formatEther(proposal.targetFunding)} ETH
                    </li>
                    <li className="card__body-list-item">
                        <span>Contributed:</span> {formatEther(proposal.currentFunding).substring(0, 6)} ETH
                    </li>
                </ul>
            </div>
            <div className="card__footer">
                <CountdownTimer endTimestamp={Number(proposal.endTimeStamp)} />
                <Link to={`/project/${proposal.id}`} className="btn btn-link">Read More</Link>
            </div>
        </div>
    )
}

export default ProposalCard;