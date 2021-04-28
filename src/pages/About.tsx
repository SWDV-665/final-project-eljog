import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Auth } from 'aws-amplify';
import { logOut } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../actions';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';

const About: React.FC = () => {
    const dispatch = useDispatch();
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
    const history = useHistory();

    useEffect(() => {
        if (!authentication.isLoggedIn) {
            history.push('/login');
            return;
        }
    }, [authentication]);

    const signOut = async () => {
        try {
            await Auth.signOut();
            dispatch(logout());
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

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
                <IonCard>
                    <img src="assets/experiment.jpg" alt="Freemarket logo" color="dark" />
                    <IonCardHeader>
                        <IonCardSubtitle>Thank you {authentication.username} for using</IonCardSubtitle>
                        <IonCardTitle>FreeMarket</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        FreeMarket is a new way to learn investing in stock market – risk free.
                        You can learn trading by investing in real stocks using virtual money,
                        Experiment investment alternatives alongside your real investments,
                        Play investment games to for both fun as well as mastering skills, and more...
                    </IonCardContent>
                </IonCard>
                <IonItem onClick={() => signOut()}>
                    <IonIcon slot="start" icon={logOut} />
                    <IonLabel>Sign Out</IonLabel>
                </IonItem>
            </IonContent>
        </IonPage>
    );
};

export default About;
