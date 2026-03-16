# Data Visualization for Finance

Choosing the right chart for your data is as important as the analysis itself. A well-chosen visualization makes patterns obvious; a poorly chosen one hides them. This guide covers the chart types finance students use most, when to use each, and the most common mistakes.

## Why Data Visualization Matters

Finance is data-rich. Stock prices, returns, ratios, portfolio allocations, and economic indicators all benefit from visual representation. A clear chart can convey in five seconds what a table of numbers takes five minutes to parse.

## Choosing the Right Chart

### The Decision Framework

| What You Want to Show | Best Chart Type |
|----------------------|-----------------|
| **Trend over time** | Line chart |
| **Comparison across categories** | Bar chart (horizontal or vertical) |
| **Composition / parts of a whole** | Stacked bar, pie (limited), waterfall |
| **Relationship between two variables** | Scatter plot |
| **Distribution of values** | Histogram, box plot |
| **Change decomposition** | Waterfall chart |
| **Range / uncertainty** | Fan chart, confidence bands |
| **Geographical patterns** | Choropleth / heat map |

## Chart Types for Finance

### Line Chart (Time Series)

**Best for**: Stock prices, portfolio values, economic indicators, yield curves.

**Design principles**:
- X-axis = time, Y-axis = value
- Use consistent time intervals
- Label axes clearly with units
- Include a title that states the insight, not just the topic
- Limit to 4-5 lines maximum; beyond that, use small multiples

**Good title**: "US 10-year Treasury yield has risen 200 basis points since 2022"
**Bad title**: "Treasury Yields"

**Finance-specific tip**: For stock price charts, show returns rather than prices when comparing securities of different price levels ($10 stock vs. $1,000 stock). Normalize to a common starting point (index to 100).

### Bar Chart

**Best for**: Comparing values across categories (sector returns, company revenue, ratio comparisons).

**Design principles**:
- Order bars by value (largest to smallest) unless there is a natural order (chronological, geographical)
- Use horizontal bars when category labels are long
- Start the Y-axis at zero (truncating exaggerates differences)
- Use a single color for all bars unless highlighting a specific bar

**Finance application**: Annual returns by sector, P/E ratios across comparable companies, portfolio allocation across asset classes.

### Scatter Plot

**Best for**: Showing the relationship between two variables (risk vs. return, size vs. performance, beta vs. expected return).

**Design principles**:
- Each point represents one observation
- Add a trend line (regression line) to show the relationship
- Label notable outliers
- Include R-squared if showing a regression relationship

**Finance application**: The Security Market Line (plotting beta against expected return), efficient frontier visualization, factor exposure analysis.

### Waterfall Chart

**Best for**: Showing how a value changes through a series of additions and subtractions (revenue build, performance attribution, bridge from EBITDA to free cash flow).

**Design principles**:
- Start with the initial value on the left
- Show additions as upward bars (green) and subtractions as downward bars (red)
- End with the final value on the right
- Label each bar with its value

**Finance application**:
- Revenue to EBITDA to net income bridge
- Portfolio performance attribution (what contributed to returns)
- Balance sheet changes year-over-year

### Worked Example: Performance Attribution Waterfall

Starting value: Portfolio return = 8.5%

| Component | Contribution |
|-----------|-------------|
| Asset allocation | +3.2% |
| Security selection | +2.8% |
| Currency effect | -0.5% |
| Fees and costs | -0.3% |
| Interaction effect | +0.1% |
| **Benchmark return** | **3.2%** |
| **Active return** | **5.3%** |

This is ideal for a waterfall chart: the audience sees exactly where returns came from.

### Histogram

**Best for**: Showing the distribution of returns, volatility, or other continuous variables.

**Design principles**:
- Choose bin widths that reveal the shape without being too granular or too coarse
- Show the normal distribution overlay when testing for normality
- Mark the mean and key percentiles

**Finance application**: Distribution of daily stock returns, histogram of P/E ratios across an industry, distribution of portfolio returns from Monte Carlo simulation.

### Box Plot

**Best for**: Comparing distributions across categories.

**Shows**: Median, quartiles (Q1, Q3), whiskers (typically 1.5 x IQR), and outliers.

**Finance application**: Comparing return distributions across sectors, comparing volatility across different market regimes.

### Candlestick Chart

**Best for**: Showing open, high, low, close (OHLC) price data for a trading period.

**Design principles**:
- Green/white body = close > open (up day)
- Red/black body = close < open (down day)
- Wicks show high and low
- Combine with volume bars below

**Finance application**: Technical analysis, trading strategy visualization, market microstructure analysis.

## Design Principles for All Charts

### 1. Data-Ink Ratio

Maximize the proportion of ink devoted to data. Remove:
- Unnecessary gridlines (keep only light horizontal gridlines)
- 3D effects (always)
- Decorative backgrounds
- Redundant legends (label lines directly instead)
- Borders and boxes around the chart

### 2. Direct Labeling

Label data series directly on the chart rather than using a separate legend. This eliminates the back-and-forth between chart and legend.

### 3. Consistent Color Coding

Assign colors meaningfully and maintain them throughout your presentation:
- Same asset class = same color on every chart
- Use intuitive colors (red for negative, green for positive)
- Use color saturation to indicate magnitude

### 4. Annotation

Add text annotations to highlight the insight. Call out key events, turning points, or notable values directly on the chart.

**Example**: On a time series of the S&P 500, annotate "COVID crash: -34% in 23 trading days" at the March 2020 trough.

### 5. Source Attribution

Every chart must include a data source line at the bottom: "Source: Bloomberg, as of March 2026" or "Source: Author's calculations using CRSP data."

## Common Mistakes

1. **Truncated Y-axis on bar charts**: Starting the Y-axis at 50 instead of 0 makes a difference of 52 vs. 55 look enormous. Always start bar charts at zero.

2. **Pie charts for more than 4-5 categories**: Humans are bad at comparing angles. If you have more than 5 categories, use a horizontal bar chart instead.

3. **3D charts**: Never use 3D effects. They distort proportions, add visual noise, and make values harder to read.

4. **Dual Y-axes**: Two Y-axes on the same chart can be misleading because the scales are arbitrary. If you must use dual axes, clearly label both and use distinct visual styles (e.g., bars for one, line for the other).

5. **Chartjunk**: Clip art, decorative images, excessive color, gradient fills. Every visual element should represent data.

6. **Not telling the audience what to see**: Showing a complex chart without guiding the audience's attention. Always tell them what to look at: "As you can see in the upper right, the anomaly disappears after 2015."

## Key References

- Tufte, E.R. (2001). *The Visual Display of Quantitative Information*. 2nd ed. Graphics Press.
- Schwabish, J. (2021). *Better Data Visualizations: A Guide for Scholars, Researchers, and Wonks*. Columbia University Press.
- Knaflic, C.N. (2015). *Storytelling with Data: A Data Visualization Guide for Business Professionals*. Wiley.
- Few, S. (2012). *Show Me the Numbers: Designing Tables and Graphs to Enlighten*. 2nd ed. Analytics Press.
