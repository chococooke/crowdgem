import { useState } from "react";
import { X } from "react-feather";
import LoaderElement from "./LoaderElement";

const CreateProposal = ({ toggleForm, contract, refresh }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        funding: "",
        end: ""
    });


    const updateFormData = (e) => {
        e.preventDefault();
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const tx = await contract.createProposal(
                formData.title,
                formData.description,
                formData.funding,
                formData.end
            );

            const recpt = await tx.wait();
            setLoading(false);
            toggleForm();
            refresh();

        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    return (
        <div className="form__wrapper">
            <div className="form">
                <h3 className="form__heading">List New Project<button className="btn btn-exit" onClick={() => toggleForm()}><X /></button></h3>
                <div className="form__grp">
                    <input
                        name="title"
                        type="text"
                        className="form__grp-input"
                        placeholder="Title"
                        onChange={(e) => updateFormData(e)}
                    />
                    <input
                        name="description"
                        type="text"
                        className="form__grp-input"
                        placeholder="Description"
                        onChange={(e) => updateFormData(e)}
                    />
                    <input
                        min="1"
                        step="1"
                        type="number"
                        name="funding"
                        className="form__grp-input"
                        placeholder="Target Funding (ETH)"
                        onChange={(e) => updateFormData(e)}
                    />
                    <input
                        name="end"
                        type="number"
                        min="30"
                        step="30"
                        className="form__grp-input"
                        placeholder="Duration (Minutes)"
                        onChange={(e) => updateFormData(e)}
                    />
                    <button
                        onClick={(e) => handleSubmit(e)}
                        className="btn btn-submit">
                        {loading ? <LoaderElement type={"btn"} size={20} /> : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateProposal;