import { Plugins } from '@capacitor/core';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonTextarea, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { Auth } from 'aws-amplify';
import { close, logOut, share, shareSharp } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../actions';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';

const { Share } = Plugins;

/**
 * The about page, that is displayed when the `FreeMarket` tab is selected.
 */
const About: React.FC = () => {
    const dispatch = useDispatch();
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
    const history = useHistory();
    const [shareMessage, setShareMessage] = useState('Hey I am using FreeMarket app to learn online stock trading risk free. I hope you will like it too.');
    const [showShare, setShowShare] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Redirect to login page if not logged in.
     */
    useEffect(() => {
        if (!authentication.isLoggedIn) {
            history.replace('/login', { direction: 'none' });
            return;
        }
    });

    const signOut = async () => {
        try {
            await Auth.signOut();
            dispatch(logout());
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    /**
     * Share FreeMarket with friends using native share API in Android, iOS, and supported web browsers
     * @param event form submission event
     */
    const handleShare: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;

        if (!form.checkValidity() || !shareMessage) {
            return;
        }

        console.log("Share", shareMessage);

        Share.share({
            title: 'Become a trading Pro!',
            text: shareMessage,
            url: 'https://freemarket.azurewebsites.net',
            dialogTitle: 'Share with buddies'
        }).catch((x) => { setErrorMessage(`Failed to share - ${x}`) });

        setShowShare(false);
    }

    // Modal form UI for sharing with others
    const shareMessageModalForm = (
        <IonModal isOpen={showShare} onDidDismiss={() => setShowShare(false)} >
            <IonHeader>
                <IonToolbar color="title">
                    <IonButtons slot="start">
                        <IonIcon icon={close} color="light" size="large" onClick={() => setShowShare(false)} />
                    </IonButtons>
                    <IonTitle color="light">Share with your friends</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form noValidate onSubmit={handleShare}>
                    <IonList>
                        <IonItem key="1">
                            <IonLabel position="stacked" color="primary">Message</IonLabel>
                            <IonTextarea value={shareMessage} placeholder="Message" rows={5} onIonChange={(e) => { setShareMessage(e.detail.value || '') }} />
                        </IonItem>

                        <IonButton type="submit" expand="block">Share <IonIcon icon={shareSharp}></IonIcon></IonButton>
                    </IonList>
                </form>
            </IonContent>
        </IonModal>);

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

                <IonFab vertical="center" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => setShowShare(true)}><IonIcon icon={share} /></IonFabButton>
                </IonFab>

                {/* Toast that displays the trade result */}
                <IonToast
                    isOpen={!!errorMessage}
                    onDidDismiss={() => setErrorMessage('')}
                    message={errorMessage!}
                    duration={3000}
                />

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

                {shareMessageModalForm}
            </IonContent>
        </IonPage>
    );
};

export default About;
