const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create users
  const toukoum = await prisma.user.create({
    data: {
      walletAddress: '9FgUdh5qsMNNqKmVTe957GJBeCfg2WjzF4xUVCWHDHF4',
      name: 'Toukoum',
      avatar: '/user-avatars/toukoum.png',
    },
  });

  const loul = await prisma.user.create({
    data: {
      walletAddress: 'BipPiy6YiJF3cFqKVRXuZvVsMeJsoWYrGYJxYxKc3GEU',
      name: 'loul',
      avatar: '/user-avatars/loul.png',
    },
  });

  // SEND TOOL
  const sendTool = await prisma.tool.create({
    data: {
      name: 'Send SOL',
      description: 'Instantly transfer SOL to any Solana wallet address with a seamless one-click experience. No confirmation dialogs, just fast and efficient transactions on Solana Devnet.',
      category: 'Finance',
      image: '/tool-avatars/1.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'to',
            type: 'string',
            description: 'Recipient SOL address (32-44 characters)',
            required: true
          },
          {
            name: 'amount',
            type: 'number',
            description: 'Amount of SOL to send',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Transaction',
          },
          {
            traitType: 'Execution Type',
            value: 'Direct',
          },
          {
            traitType: 'Network',
            value: 'Devnet',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // SWAP TOOL
  const swapTool = await prisma.tool.create({
    data: {
      name: 'Swap Tokens',
      description: 'Instantly convert between different tokens at competitive market rates. This tool executes swaps immediately without confirmation prompts, providing a streamlined trading experience.',
      category: 'Finance',
      image: '/tool-avatars/2.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'input',
            type: 'string',
            description: 'Input token symbol (SOL, BTC, USDC, ETH, META)',
            required: true
          },
          {
            name: 'output',
            type: 'string',
            description: 'Output token symbol (SOL, BTC, USDC, ETH, META)',
            required: true
          },
          {
            name: 'amount',
            type: 'number',
            description: 'Amount of input token to swap',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Exchange',
          },
          {
            traitType: 'Execution Type',
            value: 'Direct',
          },
          {
            traitType: 'Network',
            value: 'Devnet',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // ADD CONTACT TOOL
  const addContactTool = await prisma.tool.create({
    data: {
      name: 'Contact Manager: Add',
      description: 'Save wallet addresses with friendly names to your personal contact directory. Simplify future transactions by creating an organized address book of your frequent recipients.',
      category: 'Organization',
      image: '/tool-avatars/5.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'name',
            type: 'string',
            description: 'Name for the contact (minimum 3 characters)',
            required: true
          },
          {
            name: 'address',
            type: 'string',
            description: 'Solana wallet address of the contact (32-44 characters)',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Storage',
            value: 'Persistent',
          },
          {
            traitType: 'Privacy',
            value: 'User-only',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // GET CONTACT TOOL
  const getContactTool = await prisma.tool.create({
    data: {
      name: 'Contact Manager: Lookup',
      description: 'Retrieve wallet addresses by contact name from your personal directory. Quickly access saved addresses without having to remember complex wallet strings.',
      category: 'Organization',
      image: '/tool-avatars/6.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'name',
            type: 'string',
            description: 'Name of the contact to find (minimum 3 characters)',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Response Type',
            value: 'Address',
          },
          {
            traitType: 'Privacy',
            value: 'User-only',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // BALANCE CHECKER TOOL
  const balanceTool = await prisma.tool.create({
    data: {
      name: 'Balance Checker',
      description: 'View your current SOL balance and token holdings at a glance. Stay informed about your wallet status without leaving the chat interface.',
      category: 'Finance',
      image: '/tool-avatars/8.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [] // No parameters required
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Information',
          },
          {
            traitType: 'Network',
            value: 'Devnet',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // TOKEN BALANCE CHECKER TOOL
  const tokenBalanceTool = await prisma.tool.create({
    data: {
      name: 'Token Balance Checker',
      description: 'Query the balance of specific tokens in your connected wallet. View detailed token balances without leaving the conversation.',
      category: 'Finance',
      image: '/tool-avatars/token-balance.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'address',
            type: 'string',
            description: 'Token symbol (SOL, BTC, USDC, ETH, META)',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Information',
          },
          {
            traitType: 'Network',
            value: 'Devnet',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // DISPLAY RESULTS TOOL (visualization tool)
  const displayResultsTool = await prisma.tool.create({
    data: {
      name: 'Portfolio Visualization',
      description: 'Display a pie chart visualization of portfolio allocation or asset distribution. Visualize your holdings across different assets to better understand your investment diversification.',
      category: 'Analytics',
      image: '/tool-avatars/7.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'chartData',
            type: 'array',
            description: 'Array of objects containing x (asset name) and y (percentage or value) properties',
            required: true
          },
          {
            name: 'title',
            type: 'string',
            description: 'Title of the portfolio chart',
            required: false
          },
          {
            name: 'description',
            type: 'string',
            description: 'Description of the portfolio chart',
            required: false
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Visualization',
          },
          {
            traitType: 'Output Format',
            value: 'Chart',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // CONVERT CURRENCY TOOL
  const convertTool = await prisma.tool.create({
    data: {
      name: 'Currency Converter',
      description: 'Convert between different cryptocurrencies and fiat currencies at current market rates. Get accurate price conversions without leaving the chat interface.',
      category: 'Finance',
      image: '/tool-avatars/3.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'amount',
            type: 'number',
            description: 'Amount to convert',
            required: true
          },
          {
            name: 'fromCurrency',
            type: 'string',
            description: 'Currency code to convert from (e.g. BTC, SOL, USDC)',
            required: true
          },
          {
            name: 'toCurrency',
            type: 'string',
            description: 'Currency code to convert to (e.g. USDC, BTC, SOL)',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Information',
          },
          {
            traitType: 'Data Source',
            value: 'Real-time',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // PORTFOLIO CHECKER TOOL
  const portfolioTool = await prisma.tool.create({
    data: {
      name: 'Portfolio Checker',
      description: 'View a comprehensive summary of your entire crypto portfolio holdings. Get total value, asset allocation, and performance metrics in one place.',
      category: 'Finance',
      image: '/tool-avatars/4.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [] // No parameters required
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Information',
          },
          {
            traitType: 'Network',
            value: 'Devnet',
          },
          {
            traitType: 'Data Presentation',
            value: 'Summary',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  // TWITTER FETCHER TOOL
  const twitterTool = await prisma.tool.create({
    data: {
      name: 'Twitter Insights',
      description: 'Fetch and analyze tweets from specific Twitter accounts to extract relevant insights about portfolio management and market trends.',
      category: 'Social',
      image: '/tool-avatars/9.jpeg',
      isDefault: true,
      enabled: true,
      published: true,
      parameters: {
        create: [
          {
            name: 'username',
            type: 'string',
            description: 'Twitter username to analyze',
            required: true
          }
        ]
      },
      creatorId: toukoum.id,
      attributes: {
        create: [
          {
            traitType: 'Tool Type',
            value: 'Data Fetching',
          },
          {
            traitType: 'Data Source',
            value: 'Social Media',
          },
          {
            traitType: 'Output Format',
            value: 'Text',
          }
        ]
      }
    },
    include: {
      parameters: true,
      attributes: true
    }
  });

  console.log('Default tools created successfully!');
  console.log('Custom tools created successfully!');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Erreur pendant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });