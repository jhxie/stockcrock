# LoKnow stockcrock code challenge

Welcome to the challenge — we hope it's fun!

Clone this existing node.js Express app:

https://github.com/LoKnow/stockcrock

This app will need to be extended to consume the https://polygon.io API.
- Sign up for an API key here: https://polygon.io/dashboard/signup

Modify this app so that it meets the following requirements:
1. Queries the Polygon API [tickers](https://polygon.io/docs/stocks/get_v3_reference_tickers)
   endpoint to get tickers on the `XNYS` exchange.
2. Using 3 tickers obtained from the API, request [aggregates](https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to)
   - by day, and
   - for the previous 7 days including today (disregarding weekends/holidays
     and data not yet available)
3. For each ticker, and for each day from the aggregate data, calculate and
   display the difference between the opening and closing price, rounded to 4
   decimal places.
    - For example, if a stock opened at 75.0875 and closed at 74.06, the
      difference would be -1.0275.

Extra requirements:
- The resulting app should be implemented using node.js.
- The API requests should be done within node.js

Some boilerplate & tools are provided as part of the original project, but
aside from the requirements set out above, feel free to modify and use whatever
tools and libraries you are most comfortable with.

## Rubric
Submissions will be evaluated primarily on these criteria:
- Does it meet the requirements?
- Is the code well organized, easy to read, and does it adhere to industry
  conventions?
- Is the logic tested?
- Is the app easy to set up and run?

## Submission
Please submit your finished project as a code archive (e.g. zip or tar file).
Alternatively you may upload your project to a separate GitHub repo, but do not
fork the repo on GitHub or submit PRs.