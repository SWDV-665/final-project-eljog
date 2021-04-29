import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { searchCircle } from 'ionicons/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { updatePortfolio } from '../actions';
import { Portfolio, SymbolInfo } from '../models';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';
import { apiService } from '../services/ApiService';

const About: React.FC = () => {
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
    const portfolio = useSelector<RootState, Portfolio>((s) => s.portfolio);
    const [loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!authentication.isLoggedIn) {
            history.push('/login');
            return;
        }

        fetchPortfolio();
    }, [authentication]);

    const calculateMarketWorth = useCallback(() => {
        if (!portfolio.stocks.length) {
            return 0;
        }
        const price: number = portfolio.stocks.map(s => {
            return s.price * s.shares;
        }).reduce((a, c) => a + c);
        return price;
    }, [portfolio]);

    const fetchPortfolio = async () => {
        const fetchedPortfolio = await apiService.fetchPortfolio();
        dispatch(updatePortfolio(fetchedPortfolio));
        setLoaded(true);
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const suggestedSymbols: SymbolInfo[] = [
        {
            companyName: 'Microsoft',
            symbol: 'MSFT',
        },
        {
            companyName: 'Tesla',
            symbol: 'TSLA',
        },
        {
            companyName: 'Walmart',
            symbol: 'WMT',
        }
    ]

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="title">
                    <IonTitle color="light">FreeMarket</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen color="subtitle">
                <IonHeader collapse="condense">
                    <IonToolbar color="title">
                        <IonTitle size="large" color="light">FreeMarket</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow  >
                    <IonCol key="Market Worth">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>Market Worth</IonCardSubtitle>
                                <IonCardTitle>{currencyFormatter.format(calculateMarketWorth())}</IonCardTitle>
                            </IonCardHeader>
                        </IonCard>
                    </IonCol>
                    <IonCol key="Buying Power">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>Buying Power</IonCardSubtitle>
                                <IonCardTitle>{portfolio?.balance && currencyFormatter.format(portfolio.balance)}</IonCardTitle>
                            </IonCardHeader>
                        </IonCard>
                    </IonCol>
                </IonRow>
                {portfolio.stocks.length > 0 &&
                    <IonList>
                        <IonListHeader>Stocks</IonListHeader>
                        {portfolio.stocks.map((stock) => {
                            return (
                                <IonItem routerLink={`portfolio/${stock.symbol}`} routerDirection="forward" key={stock.symbol} lines="full">
                                    <IonAvatar slot="start">
                                        <img src={`https://storage.googleapis.com/iex/api/logos/${stock.symbol}.png`} style={{ maxWidth: 24, maxHeight: 24 }} />
                                    </IonAvatar>
                                    <IonLabel>
                                        <h3>{stock.symbol}</h3>
                                        <p>{stock.shares} shares</p>
                                    </IonLabel>
                                    <IonNote slot="end" color="primary">${stock.price}</IonNote>
                                </IonItem>
                            );
                        })}
                    </IonList>
                }
                {loaded && portfolio.stocks.length < 1 &&
                    <IonList>
                        <IonItem key="1">
                            <IonRow>
                                <IonCol className="ion-text-center" size="12">
                                    <IonText>Hi {authentication.displayName ?? authentication.username}</IonText><br />
                                    <IonNote>Start trading with one of the recommened stocks below, or search for your favorite bids.</IonNote>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                        <IonItem key="2" lines="none">
                            <IonRow >
                                {suggestedSymbols.map((symbol) => {
                                    return (
                                        <IonCol size="6">
                                            <IonCard routerLink={`portfolio/${symbol.symbol}`} className="ion-text-center" color="subtitle">
                                                <IonCardHeader>
                                                    <IonCardSubtitle>{symbol.companyName}</IonCardSubtitle>
                                                </IonCardHeader>
                                                <img src={`https://storage.googleapis.com/iex/api/logos/${symbol.symbol}.png`} width="32"
                                                    height="32" />
                                                <br />
                                                <br />
                                            </IonCard>
                                        </IonCol>
                                    );
                                })}
                                <IonCol size="6">
                                    <IonCard routerLink="company" className="ion-text-center" color="subtitle">
                                        <IonCardHeader>
                                            <IonCardSubtitle>Search for more</IonCardSubtitle>
                                        </IonCardHeader>
                                        <IonIcon icon={searchCircle} color="primary" size="large" />
                                        <br />
                                        <br />
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        </IonItem>
                    </IonList>
                }
            </IonContent>
        </IonPage >
    );
};

export default About;
