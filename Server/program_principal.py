import cv2
from deepface import DeepFace
from flask import Flask, Response
from threading import Thread
import threading
from datetime import datetime
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from creare_baza_de_date import *
from picamera2 import Picamera2
import RPi.GPIO as GPIO
from testare import test
from libcamera import controls

app = Flask(__name__)
credentiale = credentials.Certificate("faceaccess-57261-firebase-adminsdk-cuo38-09d5d8366c.json")
firebase_admin.initialize_app(credentiale)
baza_de_date = firestore.client()
status_interogare = True
frame = None
timp_cloud = datetime.timestamp(datetime.utcnow())
GPIO.setmode(GPIO.BCM)
picam2 = Picamera2()
'''picam2.preview_configuration.main.size = (1280,720)'''
picam2.preview_configuration.main.format = "RGB888"
picam2.preview_configuration.align()
picam2.configure("preview")
picam2.start()
picam2.set_controls({"AfMode": controls.AfModeEnum.Continuous})
    
def on_snapshot(documente, changes, read_time):
    global timp_cloud
    global status_interogare
    lista = []
    
    status_interogare = False
    timp_cloud = datetime.timestamp(datetime.utcnow())
    for document in documente:
        lista.append(document.to_dict()['imagine'])
    verifica_foldere_si_sterge('Imagini/', lista)
    verifica_foldere_si_creeaza('Imagini/', lista)
    status_interogare = True
    if (os.path.exists("Imagini/representations_facenet512.pkl")):
        os.remove("Imagini/representations_facenet512.pkl")
        
def adaugare_inregsitrare(utilizatorID, nume, prenume):
    exista = False
    documente = baza_de_date.collection('inregistrari').where('utilizatorID', '==', utilizatorID).order_by('data_intrare', direction=firestore.Query.DESCENDING).limit(1).stream()
    for document in documente:
        inregsitrare_informatie = document.to_dict()
        documentID = document.id
        exista = True
    timp_inregistrare = datetime.utcnow()
    if (exista):
        if (datetime.timestamp(inregsitrare_informatie['data_iesire']) == 0):
            baza_de_date.collection('inregistrari').document(documentID).update({'data_iesire': timp_inregistrare, 'data_modificare': timp_inregistrare})
            baza_de_date.collection('utilizatori').document(utilizatorID).update({'status': False})
        else:
            exista = False
    if (not (exista)):
        data = {
            'utilizatorID': utilizatorID,
            'nume': nume,
            'prenume': prenume,
            'data_intrare': timp_inregistrare,
            'data_iesire': datetime.utcfromtimestamp(0),
            'data_modificare': timp_inregistrare,
            }
        baza_de_date.collection('inregistrari').add(data)
        baza_de_date.collection('utilizatori').document(utilizatorID).update({'status': True})
             
def recunoastere_faciala():
    global frame
    global status_interogare
    font = cv2.FONT_HERSHEY_SIMPLEX
    
    GPIO.setup(23, GPIO.IN)
    timp_yala = 0
    utilizatori_inregsitrati = []
    timp_inregistrari = []
    
    while True:
        frame_curent_fara_intoarcere = picam2.capture_array()
        frame_curent = cv2.flip(frame_curent_fara_intoarcere, 0)
        timp = datetime.timestamp(datetime.utcnow())
        if ((timp - timp_yala) <= 10):
            GPIO.setup(23, GPIO.OUT)
        else:
            GPIO.setup(23, GPIO.IN)
        i = 0
        for utilizator_inregsitrati in utilizatori_inregsitrati:
            if ((datetime.timestamp(datetime.utcnow()) - timp_inregistrari[i]) > 20):
                utilizatori_inregsitrati.remove(utilizator_inregsitrati)
                timp_inregistrari.remove(timp_inregistrari[i])
            i = i + 1
                
        # detector_backend: opencv, ssd, dlib, mtcnn, retinaface, mediapipe*
        # model_name: VGG-Face, Facenet, Facenet512, OpenFace, DeepFace, DeepID, ArcFace, Dlib, SFace
        # distance_metric: cosine, euclidean, euclidean_l2
        if (((datetime.timestamp(datetime.utcnow()) - timp_cloud) > 5) and status_interogare):
            fete = DeepFace.extract_faces(frame_curent, 
                                           detector_backend = "mediapipe",
                                           enforce_detection=False)
            if (fete[0]['confidence'] != 0):

                verificat = test(frame_curent, 'resources/anti_spoof_models', 0)

                if (verificat == 1):
                    fete_recunoscute = DeepFace.find(frame_curent, 
                                                            db_path = "Imagini", 
                                                            detector_backend="mediapipe",
                                                            model_name="Facenet512",
                                                            distance_metric="euclidean_l2", 
                                                            enforce_detection=False, 
                                                            silent=True)
                    
                    for i in range(len(fete_recunoscute)):
                        if (len(fete_recunoscute[i]) > 0):
                            x = fete_recunoscute[i]['source_x'][0]
                            y = fete_recunoscute[i]['source_y'][0]
                            w = fete_recunoscute[i]['source_w'][0]
                            h = fete_recunoscute[i]['source_h'][0]
                            
                            stanga = x
                            top = y
                            dreapta = x + w
                            jos = y + h
                            
                            cv2.rectangle(frame_curent, (stanga, top), (dreapta, jos), (0, 255, 0), 1)
                            nume = fete_recunoscute[i]['identity'][0]
                            nume = nume.split("/")
                            nume = nume[1].split("_")
                            cv2.putText(frame_curent, nume[0] + " " + nume[1], (stanga, jos + 20), font, 0.5, (255,255,255), 1)
                            timp_yala = datetime.timestamp(datetime.utcnow())
                            
                            i = 0
                            status = True
                            for utilizator_inregsitrati in utilizatori_inregsitrati:
                                if (utilizator_inregsitrati == nume[2]):
                                    status = False 
                                i = i + 1
                            if (status):
                                utilizatori_inregsitrati.append(nume[2])
                                timp_inregistrari.append(datetime.timestamp(datetime.utcnow()))
                                adaugare_inregsitrare(nume[2], nume[0], nume[1])
                                
            
                        else: 
                            x = fete[i]['facial_area']['x']
                            y = fete[i]['facial_area']['y']
                            w = fete[i]['facial_area']['w']
                            h = fete[i]['facial_area']['h']
                            
                            stanga = x
                            top = y
                            dreapta = x + w
                            jos = y + h
                            
                            cv2.rectangle(frame_curent, (stanga, top), (dreapta, jos), (0, 0, 255), 1)
                            cv2.putText(frame_curent, "Necunoscut", (stanga, jos + 20), font, 0.5, (255,255,255), 1)

        else:
            cv2.putText(frame_curent, "Serverul isi actualizeaza baza de date", (20, 40), font, 0.85, (255,255,255), 1)
        
        frame = frame_curent

def generare_frameuri():
    global frame
    
    while True:
        if frame is None:
            continue
        status, buffer = cv2.imencode('.jpg', frame)
        frame_informatie = buffer.tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame_informatie + b'\r\n')

@app.route('/livestream')
def livestream():
    return Response(generare_frameuri(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':    
    interogare = baza_de_date.collection('imagini')
    urmarire_baza_de_date = interogare.on_snapshot(on_snapshot)
    
    thread_frame = Thread(target=recunoastere_faciala)
    thread_frame.daemon = True
    thread_frame.start()
    
    thread_livestream = Thread(target=app.run, kwargs={'host': '192.168.31.58', 'port': '5000', 'ssl_context': 'adhoc'})
    thread_livestream.daemon = True
    thread_livestream.start()
    
    while True:
        if frame is not None:
            cv2.imshow('Livestream', frame)
    
        if cv2.waitKey(1) == ord('q'):
            break
    
    picam2.stop()
    cv2.destroyAllWindows()
    
'''app.run(ssl_context=('certificat.pem', 'cheia_privata.pem'))'''
