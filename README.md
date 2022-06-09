# Socket v2 SDK

## Setup

- `yarn`
- `yarn build`

## Usage

In summary:

- Initialise the sdk:
  ```ts
  const socket = new Socket(API_KEY, {
    singleTxOnly: false,
  });
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
  const quotes = await socket.getBestQuote({
    path,
    amount,
    address,
  }, { ... Any quote preferences here })
  ```
- Start executing the quote

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
