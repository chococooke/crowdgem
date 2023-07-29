import { useState } from "react";
import { parseEther } from "ethers";
import LoaderElement from "./LoaderElement";

const ContributionForm = ({ contract, proposalId, reload }) => {
    const [amountCounter, setAmountCounter] = useState(0.0001);
    const [loading, setLoading] = useState(false);


    const handleAmountChange = (event) => {
        const value = event.target.value;

        if (value === "") { setAmountCounter(null) }
        else { setAmountCounter(parseFloat(value)) }
    }

    const contribute = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tx = await contract.contribute(proposalId, { value: parseEther(amountCounter.toString()) });
            const recpt = await tx.wait();
            setLoading(false);
            reload();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    return (
        <div className="contribution-form">
            <form className="contribution-form__grp">
                <input
                    name="amount"
                    className="contribution-form__grp-input"
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={amountCounter}
                    onChange={handleAmountChange}
                    placeholder="ETH"
                />
                <button onClick={(e) => { contribute(e) }} type="submit" className="btn btn-imp">
                    {loading ? <LoaderElement size={20} type={"btn"} /> : "Transact"}
                </button>
            </form>
        </div>
    )
}

export default ContributionForm;
