```mermaid
graph LR
    A[User] --> B(Frontend)
    B --> C{Smart Contracts}
    C --> E[Controller Contract]
    C --> F[PredictionMarketNFT Contract]
    C --> G[CustomEscrow Contract]
    C --> H[TestToken Contract]

    E -- "Address" --> F
    E -- "Address" --> G
    F -- "Deposit, Payout" --> G
    F --> H
    subgraph System Data Flow
    F -- "Market Data (Event, Options)" --> B
    B -- "Vote (Token)" --> F
    F -- "Implied Probabilities" --> B
   end

    style A fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style B fill:#ccf,stroke:#333,stroke-width:2px,color:#000
    style C fill:#cfc,stroke:#333,stroke-width:2px,color:#000
     style E fill:#fcc,stroke:#333,stroke-width:2px,color:#000
    style F fill:#fcc,stroke:#333,stroke-width:2px,color:#000
      style G fill:#fcc,stroke:#333,stroke-width:2px,color:#000
      style H fill:#fcc,stroke:#333,stroke-width:2px,color:#000
  style System Data Flow fill:#eee,stroke:#aaa,stroke-width:1px,stroke-dasharray:5,5, color:#000