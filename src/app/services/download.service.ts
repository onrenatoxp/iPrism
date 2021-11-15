import { Injectable } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private transfer: FileTransfer, 
    private file: File,
    public platform: Platform, 
    private fileOpener: FileOpener,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private document: DocumentViewer) { }


 async downloadLivroIOS(url, nomeArquivo, mimeType){

  const loading = await this.loadingCtrl.create({
    message: 'Loading'
  });

  await loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.documentsDirectory + nomeArquivo + '.pdf').then((entry) => {
    loading.dismiss();
    this.document.viewDocument(entry.toURL(), this.getMIMEtype(mimeType), {});


    }, (error) => {
     
      loading.dismiss();
      this.presentToast('Não foi possivel efetuar o download do arquivo. Tente novamente mais tarde');
    });
  
  }
  
  async download(url, mimeType){



        const downloadFolderName = 'iprism';
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        const file = this.file

       
      

        if(this.platform.is('mobileweb')) {/*download no navegador*/
            this.openWindows(url);
        } else { /*download no app*/
  
           const fileTransfer: FileTransferObject = this.transfer.create();
            
           const loading = await this.loadingCtrl.create({
              message: 'Loading'
            });
  
            await loading.present();

            //verificar de o arquivo já esta salvo
            this.file.checkFile(this.file.externalRootDirectory  +  downloadFolderName + "/", fileName)
            .then(existe => {

              if(existe){ //se existe abre o arquivo

                this.fileOpener.open(file.externalRootDirectory + downloadFolderName + "/" + fileName, this.getMIMEtype(mimeType))
                .then(() => {
                        loading.dismiss();
    
                }).catch(error => {
                  this.presentToast('Não foi possível abrir o arquivo');
                })

              }

            }).catch(error=>{ // não existe

              this.file.createDir(file.externalRootDirectory, downloadFolderName, true)
              .then((entries) => {

                fileTransfer.download(url, entries.toURL() + fileName).then((entry) => {
                  loading.dismiss();

                  this.fileOpener.open(entry.toURL(), this.getMIMEtype(mimeType))
                  .then(() => {
                    loading.dismiss();
                    console.log('File is opened')
                    })
                  .catch(error => {
                    
                    loading.dismiss();
                    console.log(JSON.parse(JSON.stringify(error)))
                    this.presentToast('É necessário a instalação de algum aplicativo de leitura para o arquivo com extenção: ' + mimeType);
                 
                  });

                }).catch(error=>{
                  console.log(JSON.parse(JSON.stringify(error)))
                  loading.dismiss();
                  this.presentToast('Não foi possível fazer o download do arquivo');
                });

              }).catch(error=>{

                loading.dismiss();
               
               console.log(JSON.parse(JSON.stringify(error)))
                this.presentToast('Não foi possível realizar o download. Verificar se o está conectado ao WIFI');
             
              });
        

      });
  
    }


  }


  
  openWindows(url){
    window.open(url,'_blank');
}


  getMIMEtype(extn){
    let ext=extn.toLowerCase();
    let MIMETypes={
      'txt' :'text/plain',
      'mp4' :'video/mp4',
      'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc' : 'application/msword',
      'pdf' : 'application/pdf',
      'jpg' : 'image/jpeg',
      'jpeg' : 'image/jpeg',
      'bmp' : 'image/bmp',
      'png' : 'image/png',
      'xls' : 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf' : 'application/rtf',
      'ppt' : 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'mp3': 'audio/mpeg'
    }
    return MIMETypes[ext];
}

  async presentToast(msgAlert) {
    const toast = await this.toastCtrl.create({
      message:  msgAlert,
      duration: 2000
    });
    toast.present();
  }

}
