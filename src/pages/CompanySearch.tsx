import { IonContent, IonHeader, IonItem, IonList, IonPage, IonSearchbar, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { SymbolInfo } from '../models';
import { apiService } from '../services/ApiService';

const CompanySearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [symbols, setSymbols] = useState<SymbolInfo[]>([]);

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
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar value={searchText} debounce={500} onIonChange={e => { setSearchText(e.detail.value!); handleSearch(e.detail.value!); }}></IonSearchbar>
        <IonList>
          {isLoading && <div className="ion-text-center"><IonSpinner name="dots" /></div>}
          {symbols.map((symbolInfo) => {
            return (
              <IonItem routerLink={`company/${symbolInfo.symbol}`} routerDirection="forward" key={symbolInfo.symbol}>
                <img
                  alt={"⌛"}
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
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CompanySearch;
