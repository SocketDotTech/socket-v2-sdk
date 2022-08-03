# Socket v2 SDK

-> [Docs](https://rugamoto.github.io/socket-v2-docs/) <-

## Install

- `yarn add socket-v2-sdk`

  or

- `npm i socket-v2-sdk`

## Usage

In summary:

- Initialise the sdk:
  ```ts
  const socket = new Socket({ apiKey: API_KEY });
  ```
- Retrieve the token lists

  ```ts
  const tokenList = await socket.getTokenList({
    fromChainId: 1,
    toChainId: 137,
  });

  // tokenList.from has list of from tokens
  // tokenList.to has list of to tokens
  ```

- Create a path
  ```ts
  const path = new Path({ fromToken, toToken });
  ```
- Get quote
  ```ts
  const quote = await socket.getBestQuote({
    path,
    amount,
    address,
  }, { ... Any quote preferences here })
  ```
- You have 2 options for executing a quote. Managing the steps yourself or connecting a web3 provider.

- Connecting web3 provider:
  ```ts
  const provider = new ethers.providers.Web3Provider(window.ethereum); // Or use wallet provider like onboard, web3modal, web3react etc.
  const connectedSocket = socket.connect(provider);
  await connectedSocket.start(quote, {
    onTx: (tx) => {
      console.log('Executing transaction', tx);
      return (tx) => {
        console.log('Done transaction', tx);
      }
    }
    ... // Other callbacks
  });
  ```
- Handle the steps manually

  ```ts
  const execute = await socket.start(quote);
  let next = await execute.next();

  while (!next.done && next.value) {
    const tx = next.value;
    const approvalTxData = await tx.getApproveTransaction();
    // ... if there is approval send the approve and wait

    const sendTxData = await tx.getSendTransaction();
    // ... send the tx and execute next

    next = await execute.next(sendTx.hash);
  }
  ```

### Direct api communication

All api functions are available through the typescript client

```ts
const socket = new Socket(API_KEY);
const activeRoute = await socket.client.routes.getActiveRoute({ activeRouteId: 1234 });
```

## Test

- USDC Polygon to BSC
  `PRIVATE_KEY="<YOUR_PRIVATE_KEY_WITH_GT_15_USDC>" npx ts-node examples/1_usdc_poly_to_bsc.ts`

Other examples [here](/examples/)
