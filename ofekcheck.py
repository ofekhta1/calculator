import sys
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
# def sum_numbers(num1, num2):
#  return num1 + num2


def sp500(firstdate, lastdate, monthltinv):
    import yfinance as yf
    import pandas as pd
    sp500 = yf.Ticker("^GSPC")
    sp500 = sp500.history(period="max")
    sp500 = sp500[firstdate:lastdate]
    sp500["lastdayclose"] = sp500["Close"].iloc[-1]
    del (sp500["Volume"])
    del (sp500["Dividends"])
    del (sp500["Stock Splits"])
    sp500["month"] = pd.DatetimeIndex(sp500.index).month.astype('string')
    sp500["year"] = pd.DatetimeIndex(sp500.index).year.astype('string')
    sp500["yearMonth"] = sp500["year"]+sp500["month"]
    # sp500=sp500[sp500["day"]==1]
    sp500["day"] = pd.DatetimeIndex(sp500.index).day
    sp500["expenese"] = monthltinv
    sp500["profit"] = sp500["expenese"] * \
        sp500["lastdayclose"]/sp500["Close"] - sp500["expenese"]
    # דרך טובה גם לחישוב האחוז אך יותר מסובכת מהשנייה
   # sp500["percentpermonth"] = ((sp500["profit"]+sp500["expenese"])*100/monthltinv) -100
    sp500["percentpermonth"] = sp500["profit"]/monthltinv * 100
    sp500 = sp500.sort_index()
    sp500 = sp500.groupby(["yearMonth"]).first()
    sp500sum = sum(sp500["profit"])
    sp500.to_csv('C:\work\output.csv', index=False)
    return sp500sum


app = Flask(__name__)
CORS(app)  # Enable CORS for all domains


@app.route('/query', methods=['POST'])
def query():
    data = request.json
    firstdate = data['firstdate']
    lastdate = data['lastdate']
    monthlyinv = data['investpermonth']
    from datetime import datetime
    firstdate = datetime.strptime(firstdate, '%Y-%m-%d')
    lastdate = datetime.strptime(lastdate, '%Y-%m-%d')

    # Call the add_numbers function and print the result
    result = sp500(firstdate, lastdate, monthlyinv)
    return jsonify({"answer": result})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
    # Get the numbers from the command-line arguments
    # firstdate=sys.argv[1]
    # lastdate=sys.argv[2]
    # monthlyinv=int(sys.argv[3])

    # # Call the add_numbers function and print the result
    # result = sp500(firstdate,lastdate,monthlyinv)
    # print(result)
