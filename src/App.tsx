/*eslint-disable*/
import { IonApp, IonButton, IonContent, IonItem, IonList, IonPage } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Plugins } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Http } from '@capacitor-community/http';
// import { BASE64 } from './file';
import CircularSpinner from './circular-spinner';
import './App.css'
const App: React.FC = () => {

  const { Browser } = Plugins;
  const [isDownloaded, setDownloaded] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState({});

  useEffect(() => {
    (async () => {
      const { files } = await Filesystem.readdir({ directory: Directory.Documents, path: '/' });
      console.log('isFolder', files);
      if (files?.length && files.indexOf('pwm') > -1) {
        const { files: pwmFiles } = await Filesystem.readdir({ directory: Directory.Documents, path: '/pwm' });
        //Loop through files array and update obj wrt file
        console.log('FILES ON MOUNT IN PWM FOLDER', files);

        if (pwmFiles?.length) {
          const filePromises = new Array(pwmFiles.length);
          pwmFiles.forEach((fileName: string, index: number) => {
            filePromises[index] = new Promise(async (resolve) => {
              const { uri } = await Filesystem.getUri({ directory: Directory.Documents, path: `/pwm/${fileName}` });
              console.log('FILES URI ON MOUNT ', uri);
              resolve({ [fileName]: uri });
            });
          });

          Promise.all(filePromises).then((files) => {
            console.log('ALL PROMISES RESOLVED ', files);
            const filesData = {};
            files.forEach((fileInfo) => {
              const fileName = Object.keys(fileInfo)[0];
              filesData[fileName] = {
                uri: fileInfo[fileName],
                state: 'DOWNLOADED',
                percentageCompleted: 100,
              };
            });
            console.log('AFTER ALL PROMISE', filesData);

            setDownloadedFiles(filesData);
          });
        }

      }
      else {
        console.log('CREATING DIR AS IT DOESNT EXIST  ', files);
        await Filesystem.mkdir({ directory: Directory.Documents, path: 'pwm' });
      }
    }
    )();

  }, []);



  const downloadFile = async (fileName: string) => {
    const options = {
      url: 'http://localhost:8090/',
      filePath: 'pwm/' + fileName,
      fileDirectory: Directory.Documents,
      // Optional
      method: 'GET',
    };
    setDownloadedFiles({
      ...downloadedFiles, [fileName]: {
        uri: '',
        state: 'DOWNLOADING',
        percentageCompleted: 10,
      }
    });

    setTimeout(async ()=> {
      const response = await Http.downloadFile(options);
      console.log('FILE DOWNLOADED', response);
        setDownloadedFiles({
          ...downloadedFiles, [fileName]: {
            uri: response.path,
            state: 'DOWNLOADED',
            percentageCompleted: 100,
          }
        });
    }, 250);
    //return response.path;
  }

  const previewFile = (fileName) => {
    const fileURI = downloadedFiles[fileName].uri;
    if (fileURI) {
      try {
        console.log('previewAnyFile', fileURI);
        window['PreviewAnyFile'].previewPath(
          win => {
            if (win == "SUCCESS") {
              console.log('success', win)
            } else if (win == "CLOSING") {
              console.log('closing')
            } else if (win == "NO_APP") {
              console.log('no suitable app to open the file (mainly will appear on android')
            } else {
              console.log('error')
            }
          },
          error => console.error("open failed", error),
          fileURI
        );
      } catch (e) {
        console.log('caught error', e);
        // // Retry if file is downloaded but was deleted from folder.
        // downloadFile(fileName);
        // previewFile(fileName);

      }
    }
  }





  const downloadOpenusingFile = (fileName) => {
    try {
      if (fileName in downloadedFiles) {
        //  Preview
        console.log('File exists to direct preview', fileName);
        previewFile(fileName);
      } else {
        console.log('File doesnot exists to download', fileName);
        downloadFile(fileName);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const files = ['FILE_A', 'FILE_B', 'FILE_C', 'FILE_Z'];

  console.log('Download, downloadFile', downloadedFiles);
  return (
    <IonApp>
      <IonPage>
        <div style={{ height: '90vh' }}>
          <div style={{ height: '300px', backgroundColor: 'red' }}>Header</div>
          <IonList>
            {
              files.map((item) => (
                <IonItem key={item} className="red" onClick={() => downloadOpenusingFile(`${item}.pdf`)}>
                  {item}
                        &nbsp;

                  {downloadedFiles[`${item}.pdf`]
                    ? downloadedFiles[`${item}.pdf`]['state'] === 'DOWNLOADED'
                      ? (<span>Open</span>)
                      : (<CircularSpinner percentCompleted={downloadedFiles[`${item}.pdf`]['percentageCompleted']} radius={50} />)
                    : ''
                  }
                </IonItem>
              ))
            }
          </IonList>
          {/* <IonList className="red" onClick={() => downloadOpenusingFile('downloadA')}>A
            </IonButton>
            <IonButton className="red" onClick={() => downloadOpenusingFile('downloadB')}>B</IonButton>
            <IonButton className="red" onClick={() => downloadOpenusingFile('downloadA')}>A</IonButton>
            <IonButton  className="red" onClick={() => downloadOpenusingFile('downloadB')}>B</IonButton>
            <IonButton  className="red" onClick={() => downloadOpenusingFile('downloadC')}>C</IonButton> */}
        </div>
      </IonPage>
    </IonApp>
  );
};

export default App;