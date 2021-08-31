# Outline

- Mission

  - Overview of the project

  - Primary purpose of the project

    - To decentralize data storage

    - > Filecoin is an open-source cloud storage marketplace, protocol, and cryptocurrency.

  - Secondary features of the project

    - Provide an incentive market for file storage

  - Values held by the project

    - Freedom from corporate control
    - Competitive prices (supply and demand)
    - Security & Authenticity
    - Useful proof of work that incentives storage over computation

  - ==What makes the project have value to its participants?==

    - The network and protocol’s can be, and have been utilized by developers for different specific applications
    - Proofs
      - spacetime
      - replication
      - Proofs are verifiable
    - Uses order book

- Key participants in the project

  - Promoters/Marketers
    - Created by Juan Benet
    - 
  - Developers
    - Protocol Labs
  - Investors
    - It later raised a couple seed rounds, including from BlueYard Capital, Digital Currency Group, Union Square Ventures, and Winklevoss Capital. These investments were explicitly for equity in the parent company, without any promise of tokens in the Filecoin project. [link](https://www.axios.com/filecoin-blockchain-delay-3b5e6b9a-bcc8-41cf-81cf-563f6cebb2c4.html)
  - Could disrupt Microsoft/amazon web services?

- ==Cryptographic properties==

  - What are the different cryptographic primitives that are used in the projects (e.g., cryptographic hashes, digital signatures, etc.). Be as specific as possible.
    - Collision resistant hash function CRH, MerkleCRH
    - Zero-Knowledge Succinct Non-interactive Arguments of Knowledge (zk-SNARK)
      - Both zero knowledge and proof of knowledge
      - Short and Easy to verify
  - What is the soundness of the the construction and combination of the primitives that are being used.
  - Attacks
    - Sybil Attacks: Malicious miners could pretend to store (and get paid for) more copies than the ones physically stored by creating multiple Sybil identities, but storing the data only once.
    - Outsourcing Attacks: Malicious miners could commit to store more data than the amount they can physically store, relying on quickly fetching data from other storage providers.
    - Generation Attacks: Malicious miners could claim to be storing a large amount of data which they are instead efficiently generating on-demand using a small program. If the program is smaller than the purportedly stored data, this inflates the malicious miner’s likelihood of winning a block reward in Filecoin, which is proportional to the miner’s storage currently in use.
    - Thus we need proof of replication and proof of space-time

- (Potential) legal issues

  - Do participants identified earlier have previous legal troubles that are identifiable?
  - Does the use of the project affect existing (il)legal use of any physical artifacts?
  - Is the use of the project affected by any existing laws?
    - [Ilegal data](https://github.com/filecoin-project/specs/issues/65#issuecomment-449468796)
      - Could use arbitrators to determine if data is illegal so no loss of collateral on data drop
      - Or fraud insurance to cover collateral
  - Is the project a response to existing laws?
  - Legal issues relating to “naive” distribution of tokens

- Monetary influence

  - What is the current market capitalization of the asset?

    - $8.15 Billion 
    - $177 Million ([bscscan](https://bscscan.com/token/0x0d8ce2a99bb6e3b7db580ed848240e4a0f9ae153))

  - How much of the asset is held by ...

    - institutional investors
    - 
    - founding members
    - public individuals

  - Tied to any other asset (cryptocurrency or fiat)?

  - > #### Store of value 
    >
    > Filecoin is a decentralized store of value, backed by something of real utility: a cloud storage service.

- ==Your personal predictions==

  - What is the short-term (< 30 days) future of this project?
  - What is the medium-term (1-2 years) future of this project?
  - What is the long-term (10+ years) future of this project?

  ## Presentation (65pts)

  - 15 minutes per person, include slides
  - Key issues, what everyone should know, what are important things to know?
  - This is the presentation of your ideas from your paper and will be judged both on your ability to effectively communicate (verbally and visually) the ideas in your paper.