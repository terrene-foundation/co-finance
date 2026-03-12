# SEC Guidance on Educational vs Advisory Content

Understanding the regulatory boundary between financial education and investment advice is critical for anyone building a financial education platform. Crossing this line — even unintentionally — can trigger registration requirements under the Investment Advisers Act of 1940.

**Important**: This document provides general educational guidance about financial regulations. It is not legal advice. Consult qualified legal counsel for compliance decisions specific to your platform.

## The Core Distinction: Education vs Advice

The SEC distinguishes between:

| Category                           | Description                                         | Regulatory Impact                            |
| ---------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| **General financial education**    | Teaching concepts, principles, and methods          | No registration required                     |
| **Impersonal investment advice**   | Generic recommendations not tailored to individuals | Gray area — may require registration         |
| **Personalized investment advice** | Specific recommendations for specific individuals   | Registration required (RIA or broker-dealer) |

The key factor is whether content is **tailored to an individual's specific financial situation**. Teaching someone how P/E ratios work is education. Telling someone "you should buy AAPL because your portfolio needs more tech exposure" is personalized advice.

## Investment Advisers Act of 1940

### Who is an "Investment Adviser"?

Under Section 202(a)(11), an investment adviser is any person who:

1. **For compensation** (including indirect compensation like subscription fees)
2. **Engages in the business** of
3. **Advising others** about the value of securities or the advisability of investing in, purchasing, or selling securities

All three elements must be present. Educational platforms can potentially avoid this classification by staying within recognized exclusions and safe harbors.

### Key Exclusions

The Act provides several exclusions from the definition of investment adviser:

1. **Publisher's exclusion** (Section 202(a)(11)(D)): Publishers of bona fide newspapers, news magazines, or business/financial publications of general and regular circulation. This can cover educational platforms that provide general commentary rather than personalized advice. The key test (from _Lowe v. SEC_, 1985) is that the content must be:
   - Of general and regular circulation
   - Not tailored to individual subscribers
   - Bona fide (not a sham for delivering personalized advice)

2. **Teacher exclusion**: Teachers, professors, and educational institutions whose advisory activities are solely incidental to their educational role.

3. **Professionals exclusion**: Lawyers, accountants, engineers, and teachers whose advisory activities are solely incidental to their profession.

## Educational Safe Harbors

### What You CAN Do (Generally Safe)

These activities are generally considered educational and not advisory:

- **Teach financial concepts**: Explain what P/E ratios are, how compound interest works, what diversification means
- **Describe asset classes**: Explain what stocks, bonds, options, and ETFs are and how they function
- **Explain analytical methods**: Teach how to read financial statements, calculate returns, or assess risk
- **Use historical examples**: "In 2008, the S&P 500 fell approximately 37%" (factual, historical)
- **Present general principles**: "Diversification can help reduce portfolio risk" (general, not personalized)
- **Show calculation methods**: Teach how to calculate Sharpe ratios, NPV, or portfolio variance
- **Provide tools**: Offer calculators that let users input their own data (as long as the tool does not make recommendations)
- **Discuss research findings**: "Academic research suggests that low-cost index funds have historically outperformed most actively managed funds over long periods"
- **Display publicly available data**: Show stock prices, historical returns, and market indices with proper attribution

### What You CANNOT Do Without Registration

These activities likely cross the line into investment advice:

- **Personalized recommendations**: "Based on your age and risk tolerance, you should invest in X"
- **Specific buy/sell signals**: "Buy AAPL now" or "Sell your bonds before the rate hike"
- **Model portfolios presented as recommendations**: "Here is the portfolio you should hold"
- **Market timing advice**: "Now is the time to get into the market"
- **Tailored asset allocation**: "Given your situation, you should be 60% stocks and 40% bonds"
- **Individual security analysis as advice**: "This stock is undervalued and a good buy"

### The Gray Area

Some activities fall in a gray area that depends on context and presentation:

- **Screeners and filters**: Providing tools that screen stocks by criteria is generally educational, but framing results as "recommendations" crosses the line
- **Backtested strategies**: Showing that a strategy "would have returned X%" is educational with proper disclaimers; presenting it as "this strategy will return X%" is advice
- **Model portfolios as examples**: Showing a model portfolio to illustrate asset allocation concepts is educational; telling users to replicate it is advice
- **General asset allocation guidance**: "Financial planners often recommend a stock/bond ratio based on age" (educational, general) vs "You should use this allocation" (advice, personalized)

## General Solicitation Rules

If your platform could be construed as promoting investment products or services:

- **Regulation D (Rule 506)**: General solicitation is allowed for 506(c) offerings but only to accredited investors with verification
- **Investment company marketing**: Mutual funds and ETFs have specific advertising rules under the Investment Company Act
- **Broker-dealer advertising**: FINRA rules govern advertising and communications for broker-dealers

For a purely educational platform, these rules are generally not applicable as long as you are not promoting specific securities or investment products.

## Practical Compliance Guidelines for Educational Platforms

### Language Patterns

**Safe phrasing**:

- "This is for educational purposes only"
- "This example illustrates how..."
- "Historical data shows that..."
- "One approach that investors use is..."
- "Consider consulting a financial advisor for personalized guidance"

**Risky phrasing**:

- "You should..."
- "We recommend..."
- "Buy/sell..."
- "This is a good investment"
- "Now is the time to..."

### Structural Safeguards

1. **Prominent disclaimers**: Every page, module, and tool should include an educational disclaimer. See **[disclaimer-templates](disclaimer-templates.md)**.

2. **No personalization engines**: Do not build features that take a user's financial data and output investment recommendations. Calculators where the user interprets their own results are generally acceptable.

3. **No individual security recommendations**: Discuss categories, concepts, and methods — not "buy this stock."

4. **Historical framing**: Present all performance data as historical, with clear disclaimers about past performance not indicating future results.

5. **Encourage professional consultation**: Regularly suggest that users consult qualified financial advisors for personalized guidance.

## State-Level Considerations

Even if you are exempt from federal registration, some states have additional rules:

- State securities regulators ("blue sky laws") may have different definitions of investment adviser
- Some states require notice filings even for federally registered advisers
- State consumer protection laws may apply to educational content that could be deemed misleading

## Common Misconceptions

1. **"If I don't charge for it, it's not advice"**: The compensation element can be indirect (ad revenue, data collection, lead generation for financial products). Free content can still be advice.

2. **"A disclaimer makes everything educational"**: Disclaimers help but do not provide absolute protection. If the substance of your content is personalized investment advice, a disclaimer does not change its legal character.

3. **"Academic content is always safe"**: Generally true for university courses, but if you are a for-profit platform using academic concepts to make specific investment recommendations, the academic framing does not provide blanket protection.

4. **"I'm just sharing what I do personally"**: Sharing your personal portfolio and returns, especially if done "for compensation" to influence others' investment decisions, can be considered investment advice.

## Cross-References

- See **[disclaimer-templates](disclaimer-templates.md)** for ready-to-use disclaimer text
- See **[hypothetical-performance](hypothetical-performance.md)** for rules on presenting backtested/simulated results
- See **[data-licensing](data-licensing.md)** for data redistribution compliance
- See **[08-learning-design](../08-learning-design/SKILL.md)** for structuring content in a clearly educational framework
