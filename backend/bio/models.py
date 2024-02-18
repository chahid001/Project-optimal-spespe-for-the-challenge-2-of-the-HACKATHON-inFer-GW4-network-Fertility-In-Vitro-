import matplotlib
# Set the backend before importing pyplot
matplotlib.use('Agg')
import matplotlib.pyplot as plt 
import pandas as pd 
import numpy as np 
from io import BytesIO
import base64
import os
from django.db import models
import pandas as pd 
from bio import views
import requests

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Meta:
    app_label = 'bio'

var_name = ''

def ploting_beat_pattern(path_file, tau, polar):
    if tau == -1:
        tau = 5
    else:
        tau = int(tau)

    try:
        data = pd.read_csv(path_file)
    except FileNotFoundError:
        print(f"Error: File {path_file} not found.")
        return None

    if polar:
        fig, ax1 = plt.subplots(subplot_kw=dict(projection='polar'), figsize=(15, 15))
    else:
        fig, ax1 = plt.subplots()

    for i in range(0, len(data), tau):
        row_data = data.iloc[i]
        x = row_data.iloc[2:1001]
        y = row_data.iloc[1002:2001]
        ax1.plot(x, y)

    # Create a directory to save the plot image if it doesn't exist
    output_dir = '../frontend/plot_images'
    os.makedirs(output_dir, exist_ok=True)

    # Take the name from csv
    pic_name = path_file.split("/")[-1].split(".")[0]
    global var_name
    pic_name = pic_name + '.jpeg'

    # Save the plot as an image file
    output_path = os.path.join(output_dir, pic_name)
    plt.savefig(output_path)
    # Close the plot to release resources
    plt.close()
    var_name = "../plot_images/" + pic_name
    return output_path




def reshaping_data(path):
    data = pd.read_csv(path)
    dic = {}
    i = 1
    j = 1001
    alpha = 1000/(data["flagellum_length"].iloc[0])
    for a in range(2,10):
        i += 1
        j += 1
        x = list(data["Unnamed: " + str(i)].iloc[:100])
        y = list(data["Unnamed: " + str(j)].iloc[:100])
        couple = {"x_"+str(i) : x, "y_"+str(i): y}
        dic.update(couple)
    return  pd.DataFrame(dic)


# Hard coded at l 1 dial lil fia n3as a 3ibad lah
def check_data(file, options):
    Graph = False
    X = -1 
    Y = -1
    Standard = False
    Custom = False
    Report = False
    Result = False

    if options[0] == 'Graph':
        Graph = True

    if Graph:
        if len(options) > 1:
            if options[1] != 'Standard':
                Custom = True
            else:
                Standard = True
            if Custom:
                X = options[1]
                if options[2] == "1":
                    Y = True
                if options[2] == "2":
                    Y = False
                if len(options) > 3 and options[3] == 'Report':
                    Report = True
                if 'Result' in options[3:]:
                    Result = True
    
    if Standard:
        if len(options) > 2 and options[2] == 'Report':
            Report = True
        if 'Result' in options[2:]:
            Result = True
    else:
        if len(options) >= 1 and options[0] == 'Report':
            Report = True
        if 'Result' in options[0:]:
            Result = True


    if len(options) > 1 and options[1] == 'Report':
        Report = True
    if 'Result' in options[1:]:
        Result = True

    # ff = reshaping_data(file)
    
    if Graph == True:
        if X == -1 and Y == -1:
            ploting_beat_pattern(file, X, False)
        else:
            ploting_beat_pattern(file, X, Y)

    # print(f"Graph: {Graph}")
    # print(f"Standard: {Standard}")
    # print(f"Custom: {Custom}")
    # print(f"X: {X}")
    # print(f"Y: {Y}")
    # print(f"Report: {Report}")
    # print(f"Result: {Result}")
    