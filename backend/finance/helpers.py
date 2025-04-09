import yfinance as yf

def get_stock_price(symbol):
    """
    Returns the current closing price for the given stock symbol.
    If data is not available, returns None.
    """
    ticker = yf.Ticker(symbol)
    history = ticker.history(period="1d")
    if history.empty:
        return None
    return history['Close'].iloc[-1]

def get_stock_info(symbol):
    """
    Returns a dictionary containing select stock information:
    - shortName
    - longName
    - currency
    - regularMarketPrice
    """
    ticker = yf.Ticker(symbol)
    info = ticker.info
    return {
        "symbol": symbol,
        "shortName": info.get("shortName"),
        "longName": info.get("longName"),
        "currency": info.get("currency"),
        "regularMarketPrice": info.get("regularMarketPrice")
    }

def get_stock_history(symbol, start_date, end_date):
    """
    Returns historical stock data for the given symbol between start_date and end_date.
    The data is returned as a list of dictionaries (one per day) using the history() method.
    If no data is available, returns None.
    """
    ticker = yf.Ticker(symbol)
    history = ticker.history(start=start_date, end=end_date)
    if history.empty:
        return None
    return history.reset_index().to_dict(orient='records')

def fetch_stock_data(ticker_symbol, start=None, end=None):
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        
        data = {
            "asset_name": info.get("longName", "N/A"),
            "symbol": info.get("symbol", ticker_symbol),
            "type": info.get("quoteType", "N/A"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "current_price": info.get("currentPrice", "N/A"),
            "market_cap": info.get("marketCap", "N/A"),
            "dividend_yield": info.get("dividendYield", 0.0),
            "dividend_rate": info.get("dividendRate", 0.0),
            "trailing_pe": info.get("trailingPE", "N/A"),
            "forward_pe": info.get("forwardPE", "N/A"),
            "beta": info.get("beta", "N/A"),
            "52_week_high": info.get("fiftyTwoWeekHigh", "N/A"),
            "52_week_low": info.get("fiftyTwoWeekLow", "N/A"),
        }

        hist = ticker.history(start=start, end=end)
        historical_data = hist.reset_index().to_dict(orient="records")

        data["historical_data"] = historical_data

        return data

    except Exception as e:
        return {"error": str(e)}