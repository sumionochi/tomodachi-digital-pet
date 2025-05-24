// types/DailyQuiz.ts
export type QuizOption = "A" | "B" | "C" | "D";
export type Quiz = {
  question: string;
  options: Record<QuizOption, string>;
  answer: QuizOption;
};


export const quiz : Quiz[] = [
    {
      "question": "What is the native token of the Sui blockchain?",
      "options": {
        "A": "SUI",
        "B": "ETH",
        "C": "BTC",
        "D": "SOL"
      },
      "answer": "A"
    },
    {
      "question": "What is the smallest unit of the SUI token called?",
      "options": {
        "A": "Gwei",
        "B": "Mist",
        "C": "Wei",
        "D": "Drop"
      },
      "answer": "B"
    },
    {
      "question": "Which consensus mechanism does Sui use?",
      "options": {
        "A": "Proof of Work",
        "B": "Delegated Proof of Stake (DPoS)",
        "C": "Proof of Authority",
        "D": "Proof of History"
      },
      "answer": "B"
    },
    {
      "question": "What is a unique feature of Sui’s object model?",
      "options": {
        "A": "Objects can be owned or shared",
        "B": "Objects are only fungible tokens",
        "C": "Objects cannot be transferred",
        "D": "Objects are stored off-chain"
      },
      "answer": "A"
    },
    {
      "question": "Which network is NOT part of the Sui ecosystem?",
      "options": {
        "A": "Mainnet",
        "B": "Testnet",
        "C": "Devnet",
        "D": "Sidechain"
      },
      "answer": "D"
    },
    {
      "question": "What is the main purpose of the Move language on Sui?",
      "options": {
        "A": "Building web servers",
        "B": "Writing smart contracts and defining on-chain assets",
        "C": "Mining cryptocurrencies",
        "D": "Running machine learning models"
      },
      "answer": "B"
    },
    {
      "question": "Which of the following is a benefit of Sui’s scalability?",
      "options": {
        "A": "High gas fees during congestion",
        "B": "Network capacity grows with validator processing power",
        "C": "Transactions are only processed once per day",
        "D": "No support for NFTs"
      },
      "answer": "B"
    },
    {
      "question": "What is Walrus in the context of Sui?",
      "options": {
        "A": "A Sui wallet",
        "B": "A decentralized storage and file upload solution",
        "C": "A consensus algorithm",
        "D": "A Sui block explorer"
      },
      "answer": "B"
    },
    {
      "question": "Which of the following is NOT a Sui wallet?",
      "options": {
        "A": "Suiet",
        "B": "SuiWallet",
        "C": "MetaMask",
        "D": "Ethos Wallet"
      },
      "answer": "C"
    },
    {
      "question": "How does Sui handle NFTs differently from many other blockchains?",
      "options": {
        "A": "NFTs are stored as independent on-chain objects",
        "B": "NFTs are only pointers to off-chain data",
        "C": "NFTs cannot be transferred",
        "D": "NFTs are not supported"
      },
      "answer": "A"
    },
    {
      "question": "What is the relationship between SUI and MIST?",
      "options": {
        "A": "1 SUI = 1,000,000,000 MIST",
        "B": "1 SUI = 1,000 MIST",
        "C": "1 SUI = 100 MIST",
        "D": "They are unrelated"
      },
      "answer": "A"
    },
    {
      "question": "Which of the following best describes a shared object on Sui?",
      "options": {
        "A": "It can only be owned by one address",
        "B": "It can be interacted with by multiple addresses",
        "C": "It is immutable",
        "D": "It is stored off-chain"
      },
      "answer": "B"
    },
    {
      "question": "What is the main advantage of Sui’s parallel execution model?",
      "options": {
        "A": "Slower transaction times",
        "B": "Lower throughput",
        "C": "Faster and more scalable transaction processing",
        "D": "No support for smart contracts"
      },
      "answer": "C"
    },
    {
      "question": "Which programming language is recommended for writing Sui smart contracts?",
      "options": {
        "A": "Solidity",
        "B": "Move",
        "C": "JavaScript",
        "D": "Go"
      },
      "answer": "B"
    },
    {
      "question": "What is the function of validators in the Sui network?",
      "options": {
        "A": "They mine new tokens",
        "B": "They verify and process transactions",
        "C": "They provide off-chain storage",
        "D": "They design user interfaces"
      },
      "answer": "B"
    },
    {
      "question": "Which of the following is a use case for Walrus?",
      "options": {
        "A": "Uploading and storing NFT images for Sui dApps",
        "B": "Running consensus on Sui",
        "C": "Providing a wallet interface",
        "D": "Bridging tokens to Ethereum"
      },
      "answer": "A"
    },
    {
      "question": "What is the primary goal of Sui’s architecture?",
      "options": {
        "A": "To be a centralized payment processor",
        "B": "To optimize for high throughput and low latency",
        "C": "To only support DeFi applications",
        "D": "To replace all Layer 2 solutions"
      },
      "answer": "B"
    },
    {
      "question": "Which of the following best describes Sui’s approach to on-chain assets?",
      "options": {
        "A": "Assets are defined as objects with rich programmability",
        "B": "Assets are only simple key-value pairs",
        "C": "Assets cannot be transferred",
        "D": "Assets are only fungible tokens"
      },
      "answer": "A"
    },
    {
      "question": "What is a key benefit of using Move on Sui?",
      "options": {
        "A": "It prevents reentrancy vulnerabilities",
        "B": "It is only used for off-chain computation",
        "C": "It is not Turing complete",
        "D": "It is based on JavaScript"
      },
      "answer": "A"
    },
    {
      "question": "Which of the following is NOT a feature of Sui’s object model?",
      "options": {
        "A": "Objects can be owned, shared, or immutable",
        "B": "Objects have unique IDs and version numbers",
        "C": "Objects can only be created by validators",
        "D": "Objects can own other objects"
      },
      "answer": "C"
    },
    {
      "question": "What is the main advantage of storing NFT metadata on-chain with Walrus and Sui?",
      "options": {
        "A": "Metadata is always available and tamper-proof",
        "B": "Metadata can only be accessed by the creator",
        "C": "Metadata is deleted after minting",
        "D": "Metadata is stored off-chain only"
      },
      "answer": "A"
    },
    {
        "question": "Which Sui feature allows for atomic execution of multiple Move calls in a single transaction?",
        "options": {
          "A": "Batch Transactions",
          "B": "Programmable Transaction Blocks",
          "C": "Shared Objects",
          "D": "Dynamic Fields"
        },
        "answer": "B"
      },
      {
        "question": "In Sui, what is the purpose of the 'TransferObjects' Move function?",
        "options": {
          "A": "To mint new tokens",
          "B": "To transfer ownership of objects between addresses",
          "C": "To upgrade smart contracts",
          "D": "To create shared objects"
        },
        "answer": "B"
      },
      {
        "question": "How does Sui achieve parallel execution of transactions?",
        "options": {
          "A": "By sharding the blockchain",
          "B": "By using Narwhal and Bullshark consensus for independent object ownership",
          "C": "By batching all transactions into a single block",
          "D": "By using a single-threaded runtime"
        },
        "answer": "B"
      },
      {
        "question": "What is a 'dynamic field' in Sui Move?",
        "options": {
          "A": "A field that can change its type at runtime",
          "B": "A field that can store an unbounded set of key-value pairs in an object",
          "C": "A field that is only used for NFTs",
          "D": "A field that is immutable"
        },
        "answer": "B"
      },
      {
        "question": "In Sui, what is the main difference between owned and shared objects?",
        "options": {
          "A": "Owned objects can be mutated by their owner; shared objects can be mutated by anyone following access rules",
          "B": "Owned objects are immutable; shared objects are mutable",
          "C": "Owned objects are off-chain; shared objects are on-chain",
          "D": "Owned objects are only for NFTs"
        },
        "answer": "A"
      },
      {
        "question": "Which Move attribute is used to mark a function as entry in Sui?",
        "options": {
          "A": "#public",
          "B": "#entry",
          "C": "#main",
          "D": "#init"
        },
        "answer": "B"
      },
      {
        "question": "What is the recommended way to store large game state data on Sui?",
        "options": {
          "A": "As a single owned object",
          "B": "As a shared object with dynamic fields",
          "C": "As multiple immutable objects",
          "D": "Off-chain only"
        },
        "answer": "B"
      },
      {
        "question": "How can a Sui game implement turn-based logic securely?",
        "options": {
          "A": "By using shared objects and validating turn order in Move entry functions",
          "B": "By using only owned objects",
          "C": "By storing turns off-chain",
          "D": "By using Solidity contracts"
        },
        "answer": "A"
      },
      {
        "question": "What is the effect of Move's resource safety on game asset management?",
        "options": {
          "A": "Assets can be accidentally duplicated",
          "B": "Assets cannot be copied or accidentally destroyed",
          "C": "Assets can be deleted at will",
          "D": "Assets are not tracked"
        },
        "answer": "B"
      },
      {
        "question": "Which Sui feature allows for composable in-game items (e.g., an NFT sword with attached gems)?",
        "options": {
          "A": "Dynamic fields",
          "B": "Object ownership and nested objects",
          "C": "Shared object locks",
          "D": "Batch transactions"
        },
        "answer": "B"
      },
      {
        "question": "How does Sui prevent double-spending of objects in games?",
        "options": {
          "A": "By using object version numbers and ownership checks in the runtime",
          "B": "By limiting transaction throughput",
          "C": "By using off-chain consensus",
          "D": "By requiring admin approval"
        },
        "answer": "A"
      },
      {
        "question": "What is the best way to represent a leaderboard in a Sui on-chain game?",
        "options": {
          "A": "As a shared object with a vector of scores",
          "B": "As multiple owned objects",
          "C": "As an immutable object",
          "D": "As an off-chain database"
        },
        "answer": "A"
      },
      {
        "question": "Which Move feature can be used to prevent unauthorized function calls in a Sui game module?",
        "options": {
          "A": "Visibility modifiers (public, friend, private)",
          "B": "Dynamic fields",
          "C": "Entry points",
          "D": "Object IDs"
        },
        "answer": "A"
      },
      {
        "question": "How can a Sui game ensure that only the game owner can mint new in-game items?",
        "options": {
          "A": "By checking the sender's address in the Move entry function",
          "B": "By using shared objects",
          "C": "By using off-chain authentication",
          "D": "By using dynamic fields"
        },
        "answer": "A"
      },
      {
        "question": "What is the main benefit of using shared objects for multiplayer games on Sui?",
        "options": {
          "A": "They allow multiple players to interact with the same game state",
          "B": "They are cheaper to store",
          "C": "They are immutable",
          "D": "They do not require gas"
        },
        "answer": "A"
      },
      {
        "question": "Which Sui Move construct allows for storing a mapping from player addresses to scores?",
        "options": {
          "A": "Vector",
          "B": "Table (dynamic field)",
          "C": "Struct",
          "D": "Event"
        },
        "answer": "B"
      },
      {
        "question": "How can a Sui game module emit events for off-chain game analytics?",
        "options": {
          "A": "By using the 'emit' keyword in Move",
          "B": "By storing logs in dynamic fields",
          "C": "By calling external APIs",
          "D": "By using Solidity events"
        },
        "answer": "A"
      },
      {
        "question": "What is a potential risk when using shared objects in Sui games?",
        "options": {
          "A": "Race conditions if access is not properly controlled",
          "B": "Objects cannot be mutated",
          "C": "Objects are only visible to the owner",
          "D": "Objects are deleted after each transaction"
        },
        "answer": "A"
      },
      {
        "question": "Which Sui feature is most useful for implementing upgradable game logic?",
        "options": {
          "A": "Package upgradeability",
          "B": "Dynamic fields",
          "C": "Shared objects",
          "D": "Immutable objects"
        },
        "answer": "A"
      },
      {
        "question": "How can a Sui game enforce cooldowns or time-based actions?",
        "options": {
          "A": "By storing timestamps in objects and validating them in Move functions",
          "B": "By using off-chain timers",
          "C": "By using Solidity modifiers",
          "D": "By using immutable objects"
        },
        "answer": "A"
      },
      {
        "question": "In Move, what is the effect of annotating a struct with the 'key' ability?",
        "options": {
          "A": "It allows the struct to be stored as a global object in Sui's object store",
          "B": "It makes the struct immutable",
          "C": "It enables the struct to be used as a function parameter",
          "D": "It allows the struct to be copied freely"
        },
        "answer": "A"
      },
      {
        "question": "Which Move ability is required for a struct to be transferred between accounts on Sui?",
        "options": {
          "A": "store",
          "B": "key",
          "C": "drop",
          "D": "copy"
        },
        "answer": "B"
      },
      {
        "question": "What is the main purpose of the 'has' keyword in Move?",
        "options": {
          "A": "To declare a struct's abilities",
          "B": "To define a module's dependencies",
          "C": "To specify function visibility",
          "D": "To import external packages"
        },
        "answer": "A"
      },
      {
        "question": "How does Move enforce resource safety at the language level?",
        "options": {
          "A": "By preventing copying or dropping of resources unless explicitly allowed",
          "B": "By using garbage collection",
          "C": "By allowing implicit conversions",
          "D": "By allowing all structs to be freely copied"
        },
        "answer": "A"
      },
      {
        "question": "What is the correct way to define a Move struct that can be published as an object on Sui?",
        "options": {
          "A": "struct MyObject has key, store { ... }",
          "B": "struct MyObject has copy, drop { ... }",
          "C": "struct MyObject has public { ... }",
          "D": "struct MyObject { ... }"
        },
        "answer": "A"
      },
      {
        "question": "Which Move function modifier ensures a function can be called as a transaction entry point?",
        "options": {
          "A": "public",
          "B": "entry",
          "C": "private",
          "D": "friend"
        },
        "answer": "B"
      },
      {
        "question": "How does Sui's Move runtime prevent double-spending of objects?",
        "options": {
          "A": "By tracking object version numbers and enforcing single ownership per transaction",
          "B": "By using off-chain consensus",
          "C": "By requiring admin approval for each transfer",
          "D": "By limiting the number of transactions per block"
        },
        "answer": "A"
      },
      {
        "question": "What is the primary use of the 'store' ability in Move?",
        "options": {
          "A": "To allow a struct to be stored in global storage",
          "B": "To enable copying of the struct",
          "C": "To allow the struct to be dropped",
          "D": "To make the struct immutable"
        },
        "answer": "A"
      },
      {
        "question": "How can a Move module restrict access to certain functions to only itself or its friends?",
        "options": {
          "A": "By marking functions as 'private' or 'friend'",
          "B": "By using 'public' visibility",
          "C": "By using the 'entry' modifier",
          "D": "By using the 'key' ability"
        },
        "answer": "A"
      },
      {
        "question": "What is the purpose of the 'drop' ability in Move?",
        "options": {
          "A": "It allows a struct to be destroyed (dropped) when no longer needed",
          "B": "It enables copying of the struct",
          "C": "It allows the struct to be stored in global storage",
          "D": "It makes the struct immutable"
        },
        "answer": "A"
      },
      {
        "question": "In a Walrus-powered Sui dApp, what is the technical benefit of storing NFT metadata on-chain?",
        "options": {
          "A": "It guarantees availability and immutability of metadata",
          "B": "It reduces gas fees",
          "C": "It allows off-chain editing",
          "D": "It enables cross-chain transfers"
        },
        "answer": "A"
      },
      {
        "question": "What is the correct way to emit an event in a Move contract on Sui?",
        "options": {
          "A": "emit<MyEvent>(event_instance);",
          "B": "log(event_instance);",
          "C": "send(event_instance);",
          "D": "event.emit(event_instance);"
        },
        "answer": "A"
      },
      {
        "question": "Which Move feature allows for extensible storage in Sui objects, such as for game inventories?",
        "options": {
          "A": "Dynamic fields",
          "B": "Immutable objects",
          "C": "Entry functions",
          "D": "Resource abilities"
        },
        "answer": "A"
      },
      {
        "question": "How can a Walrus integration help a Move contract manage large user-uploaded files?",
        "options": {
          "A": "By storing file hashes or references on-chain and actual files in Walrus storage",
          "B": "By storing entire files directly in Move structs",
          "C": "By using Solidity contracts",
          "D": "By compressing files on-chain"
        },
        "answer": "A"
      },
      {
        "question": "What is a technical limitation of Move vectors in Sui contracts?",
        "options": {
          "A": "They cannot be resized after creation",
          "B": "They can only store primitive types",
          "C": "They cannot be stored in objects with the 'key' ability",
          "D": "They are not supported in Sui"
        },
        "answer": "A"
      },
      {
        "question": "Which Move construct is best suited for implementing a mapping from addresses to balances in a Sui contract?",
        "options": {
          "A": "Table (dynamic field)",
          "B": "Vector",
          "C": "Struct",
          "D": "Event"
        },
        "answer": "A"
      },
      {
        "question": "How does Sui ensure that only authorized users can mutate shared objects?",
        "options": {
          "A": "By enforcing access control in Move entry functions",
          "B": "By using off-chain authentication",
          "C": "By making all shared objects immutable",
          "D": "By requiring admin approval"
        },
        "answer": "A"
      },
      {
        "question": "What is the main technical advantage of using Walrus for NFT image hosting in Sui dApps?",
        "options": {
          "A": "Decentralized, persistent storage with on-chain references",
          "B": "Lower gas fees for minting",
          "C": "Automatic metadata generation",
          "D": "Real-time image editing"
        },
        "answer": "A"
      },
      {
        "question": "Which Move ability is required for a struct to be copied in memory?",
        "options": {
          "A": "copy",
          "B": "key",
          "C": "store",
          "D": "drop"
        },
        "answer": "A"
      },
      {
        "question": "How can a Move contract on Sui implement upgradable logic?",
        "options": {
          "A": "By using package upgrade mechanisms to deploy new versions",
          "B": "By editing code directly on-chain",
          "C": "By using dynamic fields",
          "D": "By using Solidity proxy patterns"
        },
        "answer": "A"
      }
]


  
   