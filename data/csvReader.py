import pandas as pd
import utm
import requests

def readCSV(f):


    # Abre o csv usando apenas as colunas definidas
    data = pd.read_csv(f, sep="\t")[['FISICO_FONTE', 'FONTEX', 'FONTEY','FISICO_NO', 'NOX', 'NOY', 'COMPRIMENTO']]
    data = data.dropna() #limpa os valores vazios

    postes = []

    count = 0

    for i, row in data.iterrows(): #itera pelas linhas

        if count > 100:
            break;

        try:
            fonte = int(row['FISICO_FONTE']) #essa conversão elimina os postes com plaquetas não int
            nfonte = int(row['FISICO_NO'])
        except:
            continue

        x = float(row['FONTEX'].replace(',', '.')) # os postes tem seus numeros decimais separados por virgula =(
        y = float(row['FONTEY'].replace(',', '.'))

        nx = float(row['NOX'].replace(',', '.')) # os postes tem seus numeros decimais separados por virgula =(
        ny = float(row['NOY'].replace(',', '.'))

        cord = utm.to_latlon(x, y, 22, 'C')
        ncord = utm.to_latlon(nx, ny, 22, 'C')


        dist = float(row['COMPRIMENTO'].replace(',', '.'))

        data = {'fplaq':fonte, 'fcoord':{'x': cord[0], 'y':cord[1]}, 'nplaq':nfonte, 'ncoord':{'x': ncord[0], 'y':ncord[1]}, 'distance':dist}

        x = requests.post('http://localhost:5000/add-edge', json = data)
        
        count += 1;

readCSV('data.csv')