import os
import requests

def stergere_folder(cale):
    if os.path.exists(cale):
        for radacina, foldere, fisiere in os.walk(cale, topdown=False):
            for fisier in fisiere:
                fisier_cale = os.path.join(radacina, fisier)
                os.remove(fisier_cale)
    
            for folder in foldere:
                folder_cale = os.path.join(radacina, folder)
                os.rmdir(folder_cale)
        os.rmdir(cale)

def verifica_foldere_si_sterge(cale, lista):
    foldere_cloud = []
    
    if (not os.path.exists(cale)):
        os.mkdir(cale)
        
    for i in range(len(lista)):
        foldere_cloud.append(str(lista[i].split("%2F")[1]))
        
    for folder_pc in os.listdir(cale):
        exista = False
        for folder_cloud in foldere_cloud:
            if (folder_cloud == folder_pc):
                exista = True
        if (not (folder_pc == "representations_facenet512.pkl")):
            if (not exista):
                stergere_folder(cale + folder_pc)
                        
def verifica_foldere_si_creeaza(cale, lista):        
    foldere_cloud = []
    imagini_cloud = []
    
    for i in range(len(lista)):
        foldere_cloud.append(cale + str(lista[i].split("%2F")[1]))
        imagini_cloud.append(cale + str(lista[i].split("%2F")[1]) + "/" + str(lista[i].split("%2F")[2].split("?")[0]) + ".jpg")
        
    i = 0
    for imagine_cloud in imagini_cloud:
        if (not (os.path.exists(imagine_cloud))):
            if (not (os.path.exists(foldere_cloud[i]))):
                os.mkdir(foldere_cloud[i])
                
            imagine_informatie = requests.get(lista[i]).content
            with open(imagine_cloud, 'wb') as creeaza:
                creeaza.write(imagine_informatie)
        i = i + 1