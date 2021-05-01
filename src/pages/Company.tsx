import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonNote, IonPage, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { updatePortfolioStock } from '../actions';
import { CompanyProfile, InvestType, Portfolio, ResponseError, StockTradeRequest, TransactionType } from '../models';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';
import { apiService } from '../services/ApiService';
import './Company.css';

/**
 * Page that displays the details of a company.
 * User can also make a trade from this page.
 */
const Company: React.FC = () => {
  const { symbol } = useParams<{ symbol: string; }>();

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>();
  const [showBuySell, setShowBuySell] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [investType, setInvestType] = useState(InvestType.Dollars);
  const [transactionType, setTransactionType] = useState(TransactionType.Buy);
  const [quantity, setQuantity] = useState<number>(0);

  const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
  const portfolio = useSelector<RootState, Portfolio>((s) => s.portfolio);
  const dispatch = useDispatch();

  const history = useHistory();

  /**
   * Redirect to login page if not logged in.
   */
  useEffect(() => {
    if (!authentication.isLoggedIn) {
      history.replace('/login', { direction: 'none' });
      return;
    }
  });

  /**
   * Fetch company profile when this page is displayed.
   */
  useEffect(() => {
    async function fetchCompanyProfile() {
      try {
        const company = await apiService.fetchCompanyProfile(symbol);
        setCompanyProfile(company);
      }
      catch (error) {
        let errorMessage = 'Unable to fetch comapany profile at the moment. Please try again later.';
        if (error instanceof ResponseError) {
          errorMessage = error.message;
        }

        setErrorMessage(errorMessage);

        console.error('error when buying:', error);
      }
    };

    authentication.isLoggedIn && fetchCompanyProfile();
  }, [authentication, symbol]);

  /**
   * Calculate the estimated purchase cost/number of shares,
   * when the user is trying to make a trade
   * @returns the estimate
   */
  const estimateTrade = () => {
    const price = companyProfile?.priceInfo.price;
    if (quantity && price) {
      if (investType == InvestType.Shares) {
        return (quantity * price).toFixed(5);
      }
      else {
        return (quantity / price).toFixed(5);
      }
    }

    return 0.0;
  };

  /**
   * Execute a trade request (buy/sell)
   * @param event form submission event
   */
  const handleTrade: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    setFormSubmitted(true);
    if (!companyProfile) {
      return;
    }

    if (!quantity || quantity < 0.1) {
      setQuantityError(true);
      return;
    }

    try {
      setSubmitting(true);

      var stockTradeRequest = {
        investType: investType,
        quantity: quantity,
      } as StockTradeRequest;
      var result = await apiService.tradeStock(companyProfile.symbol, stockTradeRequest, transactionType);

      dispatch(updatePortfolioStock(result));

      console.log("Trade Result", result);

      const action = result.transaction.transactionType === TransactionType.Buy ? 'Purchased' : 'Sold';
      setToastMessage(`Successfully ${action.toLowerCase()} ${result.transaction.shares.toFixed(3)} shares of ${result.transaction.symbol} at an average cost of ${result.transaction.price.toFixed(3)}.`);
    } catch (error) {
      let errorMessage = 'Unable to trade the stock at the moment. Please try again later.';
      if (error instanceof ResponseError) {
        errorMessage = error.message;
      }

      setToastMessage(errorMessage);

      console.error('error when buying:', error);
    } finally {
      setSubmitting(false);
      setShowBuySell(false);
      setQuantity(0);
      setQuantityError(false);
    }
  }

  /**
   * Format currency values into USD.
   */
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Modal form UI that is used for a trade (buy/sell)
  const tradeRequestModalForm = (
    <IonRow className="ion-text-center">
      <IonCol className="text-center">
        <IonModal isOpen={showBuySell} onDidDismiss={() => setShowBuySell(false)} >
          <IonHeader>
            <IonToolbar color="title">
              <IonTitle color="light">{transactionType} {companyProfile?.symbol}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form noValidate onSubmit={handleTrade}>
              <IonList>
                <IonItem key="1">
                  <IonLabel position="stacked" color="primary">Invest In</IonLabel>
                  <IonSelect interface="popover" value={investType} placeholder="Select One" onIonChange={(e) => { setInvestType(e.detail.value as InvestType) }}>
                    <IonSelectOption value={InvestType.Dollars}>{InvestType.Dollars}</IonSelectOption>
                    <IonSelectOption value={InvestType.Shares}>{InvestType.Shares}</IonSelectOption>
                  </IonSelect>

                </IonItem>

                <IonItem key="2">
                  <IonLabel position="stacked" color="primary">{investType === InvestType.Shares ? "Shares" : "Amount"}</IonLabel>
                  <IonInput name="quantity" type="number" value={quantity} onIonChange={(e) => setQuantity(parseFloat(e.detail.value!))} required />
                  {formSubmitted && quantityError && <IonText color="danger">
                    <p className="ion-padding-start">
                      Entered quantity is not valid.
                    </p>
                  </IonText>}
                </IonItem>

                <IonItem key="3">
                  <IonLabel position="stacked" color="primary">Estimated {investType === InvestType.Dollars ? "shares" : "price"}</IonLabel>
                  <IonText >
                    {estimateTrade()}
                  </IonText>
                </IonItem>

                <IonRow>
                  {!submitting && <IonCol>
                    <IonButton expand="block" color="light" onClick={() => setShowBuySell(false)}>
                      Cancel
                    </IonButton>
                  </IonCol>
                  }
                  <IonCol>
                    <IonButton expand="block" type="submit">
                      {submitting ?
                        <IonSpinner name="dots" />
                        :
                        <span>{transactionType}</span>
                      }
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonList>
            </form>
          </IonContent>
        </IonModal>
      </IonCol>
    </IonRow>);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="title">
          <IonButtons slot="start">
            <IonBackButton icon={arrowBack} defaultHref="/portfolio" color="light" />
          </IonButtons>
          <IonText color="light">{symbol}</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="title">
            <IonButtons slot="start">
              <IonBackButton icon={arrowBack} defaultHref="/portfolio" color="light" />
            </IonButtons>
            <IonText color="light">{symbol}</IonText>
          </IonToolbar>
        </IonHeader>

        {/* Fab that displays Trade options (buttons to buy/sell) */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton>Trade</IonFabButton>
          <IonFabList side="top">
            <IonFabButton onClick={() => { setShowBuySell(true); setTransactionType(TransactionType.Buy); }} color="title">
              <IonText color="light">{TransactionType.Buy}</IonText>
            </IonFabButton>
            {companyProfile?.symbol && portfolio.stocks.find(s => s.symbol === companyProfile.symbol) &&
              <IonFabButton onClick={() => { setShowBuySell(true); setTransactionType(TransactionType.Sell); }} color="title">
                <IonText color="light">{TransactionType.Sell}</IonText>
              </IonFabButton>
            }
          </IonFabList>
        </IonFab>

        {/* Toast that displays the trade result */}
        <IonToast
          isOpen={!!toastMessage}
          onDidDismiss={() => setToastMessage('')}
          message={toastMessage}
          duration={3000}
        />

        {/* Display company logo, name and price */}
        <IonItem color="subtitle" lines="none">
          <IonRow>
            <IonCol>
              <IonItem lines="none" color="subtitle">
                <IonAvatar slot="start">
                  <img src={`https://storage.googleapis.com/iex/api/logos/${symbol}.png`} width="32"
                    height="32" />
                </IonAvatar>
                <IonLabel>{companyProfile?.companyName}</IonLabel>
                <IonText slot="end" color="primary">{companyProfile?.priceInfo.price && currencyFormatter.format(companyProfile?.priceInfo.price)}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonItem>

        {!!errorMessage ? <div className="ion-text-center"><IonNote color="danger">{errorMessage}</IonNote></div> : <div>

          {/* Display stock price statistics */}
          <IonListHeader>Price Info</IonListHeader>
          <IonRow className="subtitle-content">
            <IonCol>
              {companyProfile?.priceInfo.high &&
                <div>
                  <IonNote>High&nbsp;Today</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.high}</IonLabel>
                  <hr />
                </div>
              }
              {companyProfile?.priceInfo.week52High &&
                <div>
                  <IonNote>52&nbsp;Weeks&nbsp;High</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.week52High}</IonLabel>
                  <hr />
                </div>
              }
              {companyProfile?.priceInfo.open &&
                <div>
                  <IonNote>Open</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.open}</IonLabel>
                  <hr />
                </div>
              }
            </IonCol>
            <IonCol>
              {companyProfile?.priceInfo.low &&
                <div>
                  <IonNote>Low&nbsp;Today</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.low}</IonLabel>
                  <hr />
                </div>
              }
              {companyProfile?.priceInfo.week52Low &&
                <div>
                  <IonNote>52&nbsp;Weeks&nbsp;Low</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.week52Low}</IonLabel>
                  <hr />
                </div>
              }
              {companyProfile?.priceInfo.close &&
                <div>
                  <IonNote>Close</IonNote><br />
                  <IonLabel>${companyProfile?.priceInfo.close}</IonLabel>
                  <hr />
                </div>
              }
            </IonCol>
          </IonRow>

          {/* Display invest,ent details, if the user already has shares on this stock */}
          {companyProfile?.symbol && portfolio.stocks.find(s => s.symbol === companyProfile.symbol) &&
            <div>
              <IonListHeader>Your Investment</IonListHeader>
              {portfolio.stocks.filter(s => s.symbol === companyProfile.symbol).map(stock => {
                const equity = stock.price * stock.shares;
                const yourReturn = equity - stock.averageCost * stock.shares;
                return (
                  <IonRow className="subtitle-content">
                    <IonCol>
                      <IonNote>Shares</IonNote><br />
                      <IonLabel>{stock.shares.toFixed(3)}</IonLabel>
                      <hr />
                      <IonNote>Last&nbsp;Price</IonNote><br />
                      <IonLabel>{currencyFormatter.format(stock.price)}</IonLabel>
                      <hr />
                    </IonCol>
                    <IonCol>
                      <IonNote>Your&nbsp;Equity</IonNote><br />
                      <IonLabel>{currencyFormatter.format(equity)}</IonLabel>
                      <hr />
                      <IonNote>Your&nbsp;Return</IonNote><br />
                      <IonLabel>{currencyFormatter.format(yourReturn)}</IonLabel>
                      <hr />

                    </IonCol>
                  </IonRow>)
              })
              }
            </div>
          }

          {/* Display additional company information */}
          <IonListHeader>Company Info</IonListHeader>
          <IonRow className="subtitle-content">
            <IonCol>
              <IonNote>CEO</IonNote><br />
              <IonLabel>{companyProfile?.ceo}</IonLabel>
              <hr />
              {companyProfile?.employees ?
                <div>
                  <IonNote>Employees</IonNote><br />
                  <IonLabel>{companyProfile?.employees}</IonLabel>
                  <hr />
                </div>
                :
                <div>
                  <IonNote>Exchange</IonNote><br />
                  <IonLabel>{companyProfile?.exchange}</IonLabel>
                  <hr />
                </div>
              }
            </IonCol>
            <IonCol>
              <IonNote>Symbol</IonNote><br />
              <IonLabel>{companyProfile?.symbol}</IonLabel>
              <hr />
              <IonNote>Industry</IonNote><br />
              <IonLabel>{companyProfile?.industry}</IonLabel>
              <hr />
            </IonCol>
          </IonRow>
        </div>}

        {tradeRequestModalForm}
      </IonContent>
    </IonPage>
  );
};

export default Company;
