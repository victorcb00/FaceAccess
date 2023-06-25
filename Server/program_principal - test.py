import cv2
from deepface import DeepFace
import os
from testare import test

numarator = 0
numarator_fete = 0
numarator_fete_lipsa = 0
numarator_fete_autentice = 0
numarator_fete_neautentice = 0
numarator_fete_recunoscute = 0
numarator_fete_nerecunoscute = 0
numarator_fete_recunoscute_gresit = 0

''' "Imagini_testare/Cazuri pozitive" '''
''' "Imagini_testare/Cazuri negative" '''
''' "Imagini_testare/Cazuri neautentice" '''
for radacina, foldere, fisiere in os.walk("Imagini_testare/Cazuri pozitive", topdown=False):
    for fisier in fisiere:
        fisier_cale = os.path.join(radacina, fisier)
        imagine = cv2.imread(fisier_cale)
        
        numarator = numarator + 1
       
        fete = DeepFace.extract_faces(imagine, 
                                       detector_backend = "mediapipe",
                                       enforce_detection=False)
        
        if (fete[0]['confidence'] != 0):
            
            numarator_fete = numarator_fete + 1
    
            verificat = test(imagine, 'resources/anti_spoof_models', 0)
            
            if (verificat == 1):
                
                numarator_fete_autentice = numarator_fete_autentice + 1
                
                fete_recunoscute = DeepFace.find(imagine, 
                                                        db_path = "Imagini - test", 
                                                        detector_backend="mediapipe",
                                                        model_name="Facenet512",
                                                        distance_metric="euclidean_l2", 
                                                        enforce_detection=False, 
                                                        silent=True)
                
                for i in range(len(fete_recunoscute)):                    
                    if (len(fete_recunoscute[i]) > 0):
                        nume = fete_recunoscute[i]['identity'][0]
                        nume = nume.split("\\")
                        nume = nume[1].split("/")
                        nume = nume[0].split(" ")
                        nume_imagine = fisier.split("_")
                        
                        if ((nume_imagine[0] + nume_imagine[1]) == (nume[0] + nume[1])):
                            numarator_fete_recunoscute = numarator_fete_recunoscute + 1
                        else:
                            numarator_fete_recunoscute_gresit = numarator_fete_recunoscute_gresit + 1
                            print(fisier + " - fata recunoscuta gresit")
                    else:
                        numarator_fete_nerecunoscute = numarator_fete_nerecunoscute + 1
                        print(fisier + " - fata nerecunoscuta")
            else:
                numarator_fete_neautentice = numarator_fete_neautentice + 1
                print(fisier + " - fata neautentica")
        else:
            numarator_fete_lipsa = numarator_fete_lipsa + 1
            print(fisier + " - fata lipsa")

print()
print("Imagini - " + str(numarator))
print("Numar imagini cu fete - " + str(numarator_fete))
print("Numar imagini cu fete lipsa - " + str(numarator_fete_lipsa))
print("Numar imagini autentice - " + str(numarator_fete_autentice))
print("Numar imagini neautentice - " + str(numarator_fete_neautentice))
print("Numar imagini cu fete recunoscute - " + str(numarator_fete_recunoscute))
print("Numar imagini cu fete recunoscute gresit - " + str(numarator_fete_recunoscute_gresit))
print("Numar imagini cu fete nerecunoscute - " + str(numarator_fete_nerecunoscute))