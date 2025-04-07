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