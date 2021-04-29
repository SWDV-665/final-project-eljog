import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Auth } from 'aws-amplify';
import { logOut } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../actions';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';

/**
 * The about page, that is displayed when the `FreeMarket` tab is selected.
 */
const About: React.FC = () => {
    const dispatch = useDispatch();
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
    const history = useHistory();

    /**
     * Redirect to login page if not logged in.
     */
    useEffect(() => {
        if (!authentication.isLoggedIn) {
            history.push('/login', { direction: 'none' });
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
                <IonToolbar color="title">
                    <IonTitle color="light">FreeMarket</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar color="title">
                        <IonTitle size="large" color="light">FreeMarket</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <div style={{ maxHeight: "30vh", overflow: "hidden" }}>
                        <img src="assets/experiment.jpg" alt="Freemarket" color="dark" />
                    </div>
                    <IonCardHeader>
                        <IonCardTitle>Hey {authentication.displayName || authentication.username}!</IonCardTitle>
                        <IonCardSubtitle>Thank you for using FreeMarket</IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                        FreeMarket is a new way to learn investing in stock market – risk free.
                        You can learn trading by investing in real stocks using virtual money,
                        Experiment investment alternatives alongside your real investments,
                        Play investment games to for both fun as well as mastering skills, and more...
                    </IonCardContent>
                </IonCard>
                <IonList>
                    <IonItem onClick={() => signOut()} lines="none" key="signout">
                        <IonIcon slot="start" icon={logOut} />
                        <IonLabel>Sign Out</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default About;
