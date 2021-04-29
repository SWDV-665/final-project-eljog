import { IonContent, IonHeader, IonItem, IonList, IonNote, IonPage, IonSearchbar, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { SymbolInfo } from '../models';
import { RootState } from '../reducers';
import { AuthState } from '../reducers/authenication';
import { apiService } from '../services/ApiService';

/**
 * Seach page that allows searching stock symbols 
 */
const CompanySearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);

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


  /**
   * Perform the serach as the user types in the search term
   * @param query search term
   * @returns a list of matching symbols
   */
  const handleSearch = async (query: string) => {
    if (!query) {
      setSymbols([]);
      return;
    }

    setIsLoading(true);

    var symbols = await apiService.searchSymbols(query);

    setSymbols(symbols);
    setIsLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="title">
          <IonTitle color="light">Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar color="title">
            <IonTitle size="large" color="light">Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar value={searchText} debounce={500} onIonChange={e => { setSearchText(e.detail.value!); handleSearch(e.detail.value!); }}></IonSearchbar>
        <IonList>
          {isLoading && <div className="ion-text-center"><IonSpinner name="dots" /></div>}
          {symbols.length ?
            symbols.map((symbolInfo) => {
              return (
                <IonItem routerLink={`company/${symbolInfo.symbol}`} routerDirection="forward" key={symbolInfo.symbol}>
                  <img
                    src={`https://storage.googleapis.com/iex/api/logos/${symbolInfo.symbol}.png`}
                    style={{
                      height: '24px',
                      marginRight: '10px',
                      width: '24px',
                    }}
                  />
                  <span><b>{symbolInfo.symbol}</b> - {symbolInfo.companyName}</span>
                </IonItem>
              )
            })
            :
            !isLoading && searchText && <div className="ion-text-center"><IonNote>No results found</IonNote></div>
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CompanySearch;
