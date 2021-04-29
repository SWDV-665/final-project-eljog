import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { informationCircle, searchCircle, trendingUp } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { login } from './actions';
import About from './pages/About';
import Company from './pages/Company';
import CompanySearch from './pages/CompanySearch';
import Login from './pages/Login';
import Portfolio from './pages/Portfolio';
import { RootState } from './reducers';
import { AuthState } from './reducers/authenication';
/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => {
  const authentication = useSelector<RootState, AuthState>((s) => s.authentication);
  const dispatch = useDispatch();

  // Restore login state when a user re-opens the app
  useEffect(() => {
    if (authentication.isLoggedIn) {
      return;
    }

    Auth.currentSession().then(async (session) => {
      if (session.isValid()) {
        const maybeUser = await Auth.currentAuthenticatedUser();
        if (maybeUser) {
          const user = maybeUser as CognitoUser;

          const authState = {
            isLoggedIn: true,
            username: user.getUsername(),
            email: session.getIdToken().payload['email'],
            displayName: session.getIdToken().payload['custom:name'],
          } as AuthState;
          dispatch(login(authState));

          console.log('Restoring valid session');
        }
      }
      else {
        console.log('Session found but it is not valid. So not restoring')
      }
    }).catch(e => console.info('Cannot restore login: ', e));
  }, [authentication]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          {/* Page routing */}
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Redirect to="/portfolio" />
            </Route>
            <Route path="/portfolio" exact={true}>
              <Portfolio />
            </Route>
            <Route path="/portfolio/:symbol" exact={true}>
              <Company />
            </Route>
            <Route path="/login" exact={true}>
              <Login />
            </Route>
            <Route path="/about" exact={true}>
              <About />
            </Route>
            <Route path="/company" exact={true}>
              <CompanySearch />
            </Route>
            <Route path="/company/:symbol" exact={true}>
              <Company />
            </Route>
          </IonRouterOutlet>

           {/* Navigation tabs. Only displayed if logged in */}
          <IonTabBar slot="bottom" hidden={!authentication.isLoggedIn}>
            <IonTabButton tab="tab1" href="/portfolio">
              <IonIcon icon={trendingUp} />
              <IonLabel>Portfolio</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/company">
              <IonIcon icon={searchCircle} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/about">
              <IonIcon icon={informationCircle} />
              <IonLabel>FreeMarket</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
