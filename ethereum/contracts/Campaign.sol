pragma solidity ^0.4.18;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function  createNewCampaign(uint256 minimum) public {
        address addr = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(addr);
    }

    function getDeployedCampaign() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    struct SpendingRequest {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvals;
    }
    
    uint256 public minimumContribution;
    address public manager;
    uint256 approversCount;
    SpendingRequest[] public requests;
    
    mapping(address => bool) public approvers;
    
    // MODIFIERS ////////////////////////
    
    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }
    
    /////////////////////////////////////
    
    constructor(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() 
        public 
        payable {
        
        hasPaidAboveMin(msg.value, minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string description, uint256 value, address recipient) 
        public 
        managerOnly {
        
        SpendingRequest memory request = SpendingRequest({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalsCount: 0
        });
        
        requests.push(request);
    }
    
    function approveRequest(uint256 index) public {
        SpendingRequest storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(request.approvals[msg.sender] == false);
        
        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }
    
    function finalizeRequest(uint256 index) public managerOnly {
        SpendingRequest storage request = requests[index];
         
        // TODO: it is not safe - as for 1 approver it will require 0 etc.
        // it is easy to game this contract
        require(request.approvalsCount > (approversCount / 2));
        require(request.complete == false);
        
        request.complete = true;
        request.recipient.transfer(request.value);
    }
    
    function getSummary() public view returns (uint256, uint256, uint256, uint256, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }

    // PRIVATE ///////////////////////////
    function hasPaidAboveMin(uint value, uint min) private pure {
        require(value >= min);
    }
}