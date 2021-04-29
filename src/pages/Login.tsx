import { CognitoUserInterface } from '@aws-amplify/ui-components';
import { Plugins } from '@capacitor/core';
import { IonButton, IonCol, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonSpinner, IonText, IonToolbar, useIonAlert } from '@ionic/react';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { login } from '../actions';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';
import './Login.css';

/**
 * The login form.
 */
const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [signingIn, setSigningIn] = useState<boolean>();

    const [present] = useIonAlert();
    const history = useHistory();
    const dispatch = useDispatch();
    const authentication = useSelector<RootState, AuthState>((s) => s.authentication);

    /**
     * Redirect to portfolio if already logged in.
     */
    useEffect(() => {
        if (authentication.isLoggedIn) {
            history.push('/portfolio', { direction: 'none' });
        }
    }, [authentication]);

    // Native browser plugin to lauch browser for signup
    const { Browser } = Plugins;

    /**
     * Login using the given username and password
     * @param e form submission event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setErrorMessage('');

        // Validate input
        if (!username) {
            setUsernameError(true);
            return;
        }
        else {
            setUsernameError(false);
        }
        if (!password) {
            setPasswordError(true);
            return;
        }
        else {
            setPasswordError(false);
        }

        // Show spinner
        setSigningIn(true);

        try {
            const user = await Auth.signIn(username, password) as CognitoUserInterface;
            const uname = user.getUsername();
            const authState = {
                isLoggedIn: true,
                username: uname,
            } as AuthState;

            const session = await Auth.currentSession();
            if (session.isValid()) {
                authState.email = session.getIdToken().payload['email'];
                authState.displayName = session.getIdToken().payload['custom:name'];
            }

            // Set the authentication state in redux afer login
            dispatch(login(authState));
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
        finally {
            setSigningIn(false);
            setFormSubmitted(false);
        }
    };

    return (
        <IonPage id="login-page">
            <IonHeader>
                <IonToolbar color="title" className="ion-text-center">
                    <img src="assets/logo.png" alt="Freemarket logo" />
                </IonToolbar>
            </IonHeader>
            <IonContent color="subtitle">

                <div className="login-logo">
                    <img src="assets/game.jpg" alt="Freemarket logo" color="dark" />
                </div>

                {/* Login form with Signup link */}
                <form noValidate onSubmit={handleSubmit}>
                    <IonList lines="none">
                        <IonItem>
                            <IonLabel position="stacked" color="primary">Username</IonLabel>
                            <IonInput name="username" type="text" value={username} spellCheck={false} autocapitalize="off" onIonChange={e => setUsername(e.detail.value!)}
                                required>
                            </IonInput>
                        </IonItem>

                        {formSubmitted && usernameError && <IonText color="danger">
                            <p className="ion-padding-start">
                                Username is required
                            </p>
                        </IonText>}

                        <IonItem>
                            <IonLabel position="stacked" color="primary">Password</IonLabel>
                            <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
                            </IonInput>
                        </IonItem>

                        {formSubmitted && passwordError && <IonText color="danger">
                            <p className="ion-padding-start">
                                Password is required
                            </p>
                        </IonText>}
                        {errorMessage &&
                            <IonText color="danger">
                                <p className="ion-padding-start">
                                    {errorMessage}
                                </p>
                            </IonText>
                        }
                    </IonList>

                    <IonRow>
                        <IonCol>
                            <IonButton type="submit" expand="block">{formSubmitted && signingIn ? <span><IonSpinner name="dots" /></span> : <span>Login</span>}</IonButton>
                        </IonCol>

                        {/* Currently the user signup will need to be performed on the website.
                        Launch the signup page in the browser using the native capacitor plugin. */}
                        <IonCol>
                            <IonButton color="light" expand="block" onClick={() =>
                                present({
                                    header: 'Signup on the web app',
                                    message: 'Please visit our website to complete signup.',
                                    buttons: [
                                        'Cancel',
                                        { text: 'Signup on the Web App', handler: (d) => Browser.open({ url: 'https://freemarket.azurewebsites.net/signup' }) },
                                    ],
                                    onDidDismiss: (e) => console.log('did dismiss'),
                                })
                            }>Signup</IonButton>
                        </IonCol>
                    </IonRow>
                </form>

            </IonContent>
        </IonPage>
    );
};

export default Login;
