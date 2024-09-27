export const FACTORY_CONTRACT_ADDRESS = "0x435442E07A7c2606162d65535FF1dc097402f9DC";

export const FACTORY_ABI = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "projectAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "buyer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "seller",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "paymentAmount",
                type: "uint256",
            },
        ],
        name: "ProjectCreated",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_buyer",
                type: "address",
            },
            {
                internalType: "address payable",
                name: "_seller",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_paymentAmount",
                type: "uint256",
            },
        ],
        name: "createProject",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getProjects",
        outputs: [
            {
                internalType: "contract FreelanceProject[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "projects",
        outputs: [
            {
                internalType: "contract FreelanceProject",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export const PAYMENT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_buyer",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_seller",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_paymentAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "DisputeCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountTransferred",
				"type": "uint256"
			}
		],
		"name": "DisputeResolved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountTransferred",
				"type": "uint256"
			}
		],
		"name": "OrderCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "votedFor",
				"type": "address"
			}
		],
		"name": "VoteCasted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "buyer",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "commissionPercentage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dispute",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "buyerVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sellerVotes",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "resolved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disputeRewardPercentage",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disputeStatus",
		"outputs": [
			{
				"internalType": "enum FreelanceProject.DisputeStatus",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "markOrderCompleted",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "orderCompleted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resolveDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "seller",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "voteForBuyer",
				"type": "bool"
			}
		],
		"name": "voteOnDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winningVoters",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]
