// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdGem {
    // Struct to store information about each proposal
    struct ProposalData {
        uint256 id;
        address payable host;
        string title;
        string description;
        uint256 targetFunding;
        uint256 currentFunding;
        uint256 endTimeStamp;
        uint256 contributorCount;
    }

    // Contract state variables
    uint256 public contractBalance;
    address public contractOwner;

    // Mapping to store information about each proposal
    mapping(uint256 => ProposalData) public proposals;

    // Mapping to store contributions made by each address to each proposal
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // Mapping to store the address of each contributor for each proposal
    mapping(uint256 => mapping(uint256 => address)) public contributors;

    // Counter to keep track of the number of proposals created
    uint256 public proposalCount;

    // Events for emitting important information
    event ProposalCreated(
        uint256 indexed id,
        string title,
        uint256 targetFunding,
        uint256 endTimeStamp
    );
    event ContributionMade(
        uint256 indexed proposalId,
        address contributor,
        uint256 amount
    );
    event FundsTransferredToHost(
        uint256 indexed proposalId,
        address host,
        uint256 amount
    );
    event FundsRefundedToContributor(
        uint256 indexed proposalId,
        address contributor,
        uint256 amount
    );

    // Modifier to restrict certain functions to be called only by the contract owner
    modifier onlyContractOwner() {
        require(
            msg.sender == contractOwner,
            "Only the contract owner can call this function"
        );
        _;
    }

    // Constructor to initialize the contract state variables
    constructor() {
        contractBalance = 0;
        contractOwner = msg.sender;
    }

    // Function to create a new proposal
    function createProposal(
        string memory title,
        string memory description,
        uint256 targetFunding,
        uint256 endTimeStamp
    ) public {
        proposalCount++;
        ProposalData storage proposal = proposals[proposalCount];
        proposal.host = payable(msg.sender);
        proposal.id = proposalCount;
        proposal.title = title;
        proposal.description = description;
        proposal.targetFunding = targetFunding * 1 ether;
        proposal.endTimeStamp = block.timestamp + (endTimeStamp * 1 minutes);

        emit ProposalCreated(
            proposalCount,
            title,
            targetFunding,
            proposal.endTimeStamp
        );
    }

    // Function to contribute funds to a proposal
    function contribute(uint256 proposalId) public payable {
        ProposalData storage proposal = proposals[proposalId];
        require(
            msg.value >= 0.0001 ether,
            "Amount must be equal to or more than 1 ETH"
        );

        require(
            proposalId > 0 && proposalId <= proposalCount,
            "Invalid proposal ID"
        );
        require(block.timestamp < proposal.endTimeStamp, "The event has ended");

        proposal.contributorCount++;
        proposal.currentFunding += msg.value;
        contractBalance += msg.value;

        contributions[proposalId][msg.sender] += msg.value;
        contributors[proposalId][proposal.contributorCount] = msg.sender;

        emit ContributionMade(proposalId, msg.sender, msg.value);
    }

    // Function to transfer funds to the host after the proposal ends
    function transferFundsToHost(uint256 proposalId) public onlyContractOwner {
        ProposalData storage proposal = proposals[proposalId];
        require(
            block.timestamp >= proposal.endTimeStamp,
            "Event hasn't ended yet"
        );

        require(
            proposal.currentFunding == proposal.targetFunding,
            "Project is not fully funded"
        );

        uint256 amountToTransfer = proposal.currentFunding;
        proposal.currentFunding = 0; // Reset the currentFunding to prevent double transfers.

        proposal.host.transfer(amountToTransfer);
        contractBalance -= amountToTransfer;

        emit FundsTransferredToHost(
            proposalId,
            proposal.host,
            amountToTransfer
        );
    }

    // Function to refund funds to a contributor if the proposal doesn't meet the target funding
    function refundFundsToContributor(uint256 proposalId) public {
        ProposalData storage proposal = proposals[proposalId];
        address payable contributor = payable(msg.sender);
        require(
            block.timestamp >= proposal.endTimeStamp,
            "Event hasn't ended yet"
        );
        require(
            proposal.currentFunding < proposal.targetFunding,
            "Project is fully funded"
        );

        uint256 amountToRefund = contributions[proposalId][msg.sender];
        require(
            amountToRefund > 0,
            "You have no contributions in this proposal."
        );

        // Set the contribution amount to 0 to prevent reentrancy attacks.
        contributions[proposalId][msg.sender] = 0;

        contributor.transfer(amountToRefund);
        contractBalance -= amountToRefund;
        proposal.currentFunding -= amountToRefund;

        emit FundsRefundedToContributor(proposalId, msg.sender, amountToRefund);
    }
}
