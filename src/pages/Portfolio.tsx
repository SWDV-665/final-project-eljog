import { IonAvatar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { updatePortfolio } from '../actions';
import { Portfolio } from '../models';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';
import { apiService } from '../services/ApiService';

const About: React.FC = () => {
    const [marketWorth, setMarketWorth] = useState(0.0);
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
    const portfolio = useSelector<RootState, Portfolio>((s) => s.portfolio);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!authentication.isLoggedIn) {
            history.push('/login');
            return;
        }

        fetchCompanyProfile();
    }, [authentication]);

    const fetchCompanyProfile = async () => {
        const fetchedPortfolio = await apiService.fetchPortfolio();
        dispatch(updatePortfolio(fetchedPortfolio));
        if (fetchedPortfolio?.stocks?.length) {
            let worth = 0;
            fetchedPortfolio.stocks.forEach(stock => {
                worth += stock.price * stock.shares;
            });
            setMarketWorth(worth);
        }
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>FreeMarket</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">FreeMarket</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonRow  >
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>Market Worth</IonCardSubtitle>
                                <IonCardTitle>{currencyFormatter.format(marketWorth)}</IonCardTitle>
                            </IonCardHeader>
                        </IonCard>
                    </IonCol>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>Buying Power</IonCardSubtitle>
                                <IonCardTitle>{portfolio?.balance && currencyFormatter.format(portfolio.balance)}</IonCardTitle>
                            </IonCardHeader>
                        </IonCard>
                    </IonCol>
                </IonRow>
                <IonList id="inbox-list">
                    <IonListHeader>Stocks</IonListHeader>
                    {portfolio.stocks.map((stock) => {
                        return (
                            <IonItem routerLink={`portfolio/${stock.symbol}`} routerDirection="forward" key={stock.symbol}>
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
            </IonContent>
        </IonPage>
    );
};

export default About;
