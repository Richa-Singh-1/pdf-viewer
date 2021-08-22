import React, { useEffect } from 'react';
import { IonApp, IonPage, IonContent, IonHeader, IonToolbar } from '@ionic/react';
import 'capacitor-pdf-viewer';
import { Plugins } from '@capacitor/core';

const { PdfViewer } = Plugins;

const App = () => {
    useEffect(() => {
        (async () => {
            await PdfViewer.loadPDF({url: 'http://www.africau.edu/images/default/sample.pdf'});
        })();
    }, []);
    return (
        <IonApp>
            <IonPage style={{ height: '100vh' }}>
                <IonHeader>
                    <IonToolbar />
                </IonHeader>
                <IonContent>
                    Content
                </IonContent>ß
            </IonPage>
        </IonApp>
    );
};

export default App;